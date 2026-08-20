# smart nachhaltig – Projektdaten Power-Up für Trello

Ein privates, kostenloses Trello Power-Up, das auf jeder Karte ein Projektdaten-Formular
(Personalien + Planung) einblendet. Struktur, Bezeichnungen, Farben und Dropdown-Optionen
werden boardweit im Backend gepflegt; die ausgefüllten Werte werden pro Karte gespeichert.

## Die Dateien

- `index.html` – der Connector, den Trello lädt (meldet die Funktionen an)
- `form.html` – das Formular auf der Kartenrückseite
- `settings.html` – das Backend (Optionen, Farben, Bezeichnungen, Überschriften)
- `export.html` – Sammelbestellung als CSV über alle Karten des Boards
- `config.js` – gemeinsame Standardwerte und Speicher-Helfer
- `style.css` – gemeinsames Design (inkl. automatischem Dunkelmodus)
- `icon.svg` – Icon für Kartenbereich und Board-Buttons

Alle Dateien gehören zusammen in **denselben Ordner** (das Repository-Wurzelverzeichnis).

## Schritt 1 – Auf GitHub Pages hochladen (kostenlos)

1. Auf github.com kostenlos ein Konto anlegen.
2. Oben rechts „+" → „New repository". Namen vergeben (z. B. `trello-powerup`),
   Sichtbarkeit **Public** lassen, „Create repository".
3. Im Repo „Add file" → „Upload files", dann **alle** Dateien aus diesem Ordner
   hineinziehen und „Commit changes".
4. „Settings" → links „Pages" → Source „Deploy from a branch", Branch `main`,
   Ordner `/ (root)", „Save".
5. Nach ein bis zwei Minuten erscheint die Adresse:
   `https://DEINNAME.github.io/trello-powerup/`
   Diese URL ist die Basis-Adresse deines Power-Ups.

Hinweis: Öffentlich ist nur dieser Programmcode – er enthält keine Kundendaten.
Alle ausgefüllten Werte liegen in Trello, nicht im Repository.

## Schritt 2 – In Trello registrieren

1. Auf https://trello.com/power-ups/admin einloggen → „Create new Power-Up".
2. Namen vergeben, den passenden Workspace wählen (so bleibt es privat).
3. Bei „Iframe connector URL" die Adresse aus Schritt 1 eintragen, inkl. `index.html`:
   `https://DEINNAME.github.io/trello-powerup/index.html`
4. Unter „Capabilities" aktivieren:
   `card-back-section`, `card-badges`, `card-detail-badges`, `show-settings`, `board-buttons`.
5. Speichern.

## Schritt 3 – Zum Board hinzufügen und einrichten

1. Im gewünschten Board: Menü → „Power-Ups" → „Custom" → dein Power-Up „Add".
2. Über den Board-Button „Projektdaten-Optionen" das Backend öffnen und die
   Dropdown-Optionen (Modultyp, Wechselrichter, …), Farben und Bezeichnungen eintragen.
3. Eine Karte öffnen → der Bereich „Projektdaten" erscheint → ausfüllen → „Speichern".
4. Für die Sammelbestellung: Board-Button „Sammelbestellung (CSV)" → herunterladen.

## Gut zu wissen

- Die Einstellungen gelten für alle Karten des Boards.
- Speichern auf der Karte lädt den Bereich kurz neu – das ist normal.
- Power-Ups laufen nicht in den Trello-Mobile-Apps, nur im mobilen Browser.
- Trello speichert je Schlüssel begrenzt viel Text. Falls sehr viele Dropdown-Optionen
  irgendwann nicht mehr speichern, bitte Bescheid geben – dann teilen wir die Ablage auf.
- Änderungen am Design: einfach die Datei im Repo ersetzen; GitHub veröffentlicht die
  neue Version automatisch in ca. einer Minute.
