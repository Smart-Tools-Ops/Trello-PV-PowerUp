/* Sync-Logik für Kartensynchronisation zwischen zwei Boards.
   Nutzt die Trello REST API (Autorisierung via getRestApi) und ein
   Verknüpfungs-Register auf Workspace-Ebene (organization/shared), damit
   beide Karten ihren Partner finden. Voraussetzung: beide Boards liegen im
   selben Workspace (Arbeitsbereich). */

var APP_NAME = 'PV Work List';

/* --- Autorisierung sicherstellen (öffnet beim ersten Mal ein Trello-Fenster) --- */
function ensureAuth(t){
  return t.getRestApi().isAuthorized().then(function(ok){
    if(ok) return true;
    return t.getRestApi().authorize({ scope:'read,write', expiration:'never' }).then(function(){ return true; });
  });
}

/* --- REST-Aufruf: GET über Query, Schreibzugriffe über Formular-Body --- */
function api(t, method, path, params){
  return t.getRestApi().getToken().then(function(token){
    params = params || {};
    params.key = APP_KEY; params.token = token;
    var enc = Object.keys(params).map(function(k){
      return encodeURIComponent(k)+'='+encodeURIComponent(params[k]==null?'':params[k]);
    }).join('&');
    var url = 'https://api.trello.com/1/'+path, opts;
    if(method==='GET'){ url += (path.indexOf('?')>-1?'&':'?')+enc; opts={ method:'GET' }; }
    else { opts={ method:method, headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:enc }; }
    return fetch(url, opts).then(function(r){
      if(!r.ok) return r.text().then(function(x){ throw new Error('Trello-API '+r.status+': '+x); });
      if(r.status===204) return null;
      return r.json().catch(function(){ return null; });
    });
  });
}

/* --- Verknüpfungs-Register (Workspace-Ebene, für beide Karten sichtbar) --- */
function linkKey(cardId){ return 'sync_'+cardId; }
function getLink(t, cardId){ return t.get('organization','shared', linkKey(cardId)).then(function(v){ return v||null; }); }
function setLink(t, cardId, link){ return t.set('organization','shared', linkKey(cardId), link); }
function removeLink(t, cardId){ return t.remove('organization','shared', linkKey(cardId)); }

/* --- Karten-Kernfelder --- */
function getCore(t, cardId){
  return api(t,'GET','cards/'+cardId, { fields:'name,desc,due,dateLastActivity,idBoard,idList,idLabels' });
}
function getBoardLabels(t, boardId){
  return api(t,'GET','boards/'+boardId+'/labels', { fields:'name,color', limit:1000 });
}

/* Quell-Label-IDs -> Ziel-Label-IDs (per Name+Farbe; fehlende Labels werden angelegt) */
function mapLabels(t, srcIdLabels, srcBoardId, tgtBoardId){
  if(!srcIdLabels || !srcIdLabels.length) return Promise.resolve([]);
  return Promise.all([ getBoardLabels(t, srcBoardId), getBoardLabels(t, tgtBoardId) ]).then(function(res){
    var src = res[0] || [], tgt = res[1] || [];
    var srcById = {}; src.forEach(function(l){ srcById[l.id] = l; });
    function findTgt(name, color){
      for(var i=0;i<tgt.length;i++){ if((tgt[i].name||'')===(name||'') && (tgt[i].color||'')===(color||'')) return tgt[i]; }
      return null;
    }
    var chain = Promise.resolve(), out = [];
    srcIdLabels.forEach(function(id){
      var l = srcById[id]; if(!l) return;
      chain = chain.then(function(){
        var m = findTgt(l.name, l.color);
        if(m){ out.push(m.id); return; }
        return api(t,'POST','labels', { idBoard:tgtBoardId, name:l.name||'', color:l.color||'' })
          .then(function(nl){ if(nl && nl.id){ tgt.push(nl); out.push(nl.id); } });
      });
    });
    return chain.then(function(){ return out; });
  });
}

/* Kernfelder von "source" auf die Zielkarte schreiben */
function applyCore(t, targetCardId, source, tgtIdLabels){
  return api(t,'PUT','cards/'+targetCardId, {
    name: source.name!=null ? source.name : '',
    desc: source.desc!=null ? source.desc : '',
    due:  source.due ? source.due : '',
    idLabels: (tgtIdLabels||[]).join(',')
  });
}

/* Formulardaten (projektdaten) der Partnerkarte lesen – nur Lesen ist per API möglich */
function getRemoteForm(t, cardId, pluginId){
  return api(t,'GET','cards/'+cardId+'/pluginData', {}).then(function(list){
    if(!list || !list.length) return null;
    for(var i=0;i<list.length;i++){
      if(String(list[i].idPlugin) === String(pluginId)){
        try { var v = JSON.parse(list[i].value); return v.projektdaten || null; }
        catch(e){ return null; }
      }
    }
    return null;
  });
}

/* Verbindung trennen (beide Register-Einträge entfernen) */
function stopSync(t){
  return t.card('id').then(function(c){
    return getLink(t, c.id).then(function(link){
      if(!link) return;
      return removeLink(t, c.id).then(function(){ if(link.partner) return removeLink(t, link.partner); });
    });
  });
}
