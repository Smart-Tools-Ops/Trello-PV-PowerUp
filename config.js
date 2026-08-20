/* Gemeinsame Konfiguration + Speicher-Helfer.
   Struktur (Überschriften, Bezeichnungen, Farben, Dropdown-Optionen) wird
   boardweit gespeichert. Die ausgefüllten Werte liegen pro Karte. */

var PALETTE = ['green','blue','amber','teal','purple','rose','gray'];

var DEFAULT_CONFIG = {
  headings: { projekt:'Projektdaten', personalien:'Personalien', planung:'Planung' },
  personalien: { color:'gray', anrede:['Herr','Frau','Familie'] },
  groups: [
    { key:'pv',       title:'PV-Module',        color:'green',  rows:[
        { key:'modultyp',      label:'Modultyp',       countLabel:'Anzahl Module',              options:[] } ]},
    { key:'wr',       title:'Wechselrichter',   color:'blue',   rows:[
        { key:'wechselrichter',label:'Wechselrichter', countLabel:'Anzahl Wechselrichter',      options:[] } ]},
    { key:'speicher', title:'Stromspeicher',    color:'amber',  rows:[
        { key:'stromspeicher', label:'Stromspeicher',  countLabel:'Anzahl Speichermodule',      options:[] } ]},
    { key:'wallbox',  title:'Wallbox',          color:'teal',   rows:[
        { key:'wallbox',       label:'Wallbox',        countLabel:'Anzahl Wallboxen',           options:[] } ]},
    { key:'uk',       title:'Unterkonstruktion',color:'purple', rows:[
        { key:'uk_schiene',    label:'Schienen',       countLabel:'Anzahl Schienen',            options:[] },
        { key:'uk_haken',      label:'Haken',          countLabel:'Anzahl Haken',               options:[] } ]},
    { key:'zusaetze', title:'Zusätze',          color:'rose',   rows:[
        { key:'esp',     label:'EPS / Notstrombox', countLabel:'Anzahl ESP / Notstromboxen', options:[] },
        { key:'zusatz1', label:'Zusatzprodukt 1',   countLabel:'Anzahl', options:[] },
        { key:'zusatz2', label:'Zusatzprodukt 2',   countLabel:'Anzahl', options:[] },
        { key:'zusatz3', label:'Zusatzprodukt 3',   countLabel:'Anzahl', options:[] },
        { key:'zusatz4', label:'Zusatzprodukt 4',   countLabel:'Anzahl', options:[] },
        { key:'zusatz5', label:'Zusatzprodukt 5',   countLabel:'Anzahl', options:[] } ]}
  ]
};

/* Feste Personalien-Felder (Reihenfolge = Anzeige). "anrede" ist ein Dropdown. */
var PERSONALIEN_FIELDS = [
  { key:'kundennummer', label:'Kundennummer', type:'text',   width:'half' },
  { key:'anrede',       label:'Anrede',       type:'anrede', width:'half' },
  { key:'vorname',      label:'Vorname',      type:'text',   width:'half' },
  { key:'nachname',     label:'Nachname',     type:'text',   width:'half' },
  { key:'telefon',      label:'Telefonnummer',type:'tel',    width:'half' },
  { key:'email',        label:'Email',        type:'email',  width:'half' },
  { key:'strasse',      label:'Straße',       type:'text',   width:'w75' },
  { key:'hausnummer',   label:'Hausnr.',      type:'text',   width:'w25' },
  { key:'plz',          label:'PLZ',          type:'text',   width:'w25' },
  { key:'stadt',        label:'Stadt',        type:'text',   width:'w75' }
];

/* Zusatzfelder unter dem Formular – NICHT im CSV-Export enthalten. */
var EXTRA_FIELDS = [
  { key:'abstand_wr_ssk', label:'Abstand Wechselrichter – Schaltschrank:', type:'text' },
  { key:'schaltschrank',  label:'Schaltschrank',                            type:'textarea' }
];

function clone(o){ return JSON.parse(JSON.stringify(o)); }

function loadConfig(t){
  return t.get('board','shared','config').then(function(c){
    return (c && c.groups) ? c : clone(DEFAULT_CONFIG);
  });
}
function saveConfig(t, c){ return t.set('board','shared','config', c); }

function loadCardData(t){
  return t.get('card','shared','projektdaten').then(function(d){ return d || {}; });
}
function saveCardData(t, d){ return t.set('card','shared','projektdaten', d); }
