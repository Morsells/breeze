# Breeze – Wetter & Travel Planner (Frontend)

Willkommen zu **Breeze**: Mit dieser modernen React-Anwendung kannst du bequem Wetterdaten, 5-Tage-Prognosen, Travel-Packing-Listen und Favoriten verwalten – mobilfreundlich, performant, 100 % als Docker-Container ausführbar.

---

## Projektüberblick

Breeze ist eine vollständig als SPA umgesetzte React/Vite-Anwendung, die Wetterdaten via OpenWeatherMap (und Bilder via Pixabay) holt. Es gibt folgende Kern-Features:

- Wetterübersicht für Städte (Live-Suche & Favoriten)
- 5-Tage-Vorhersage mit Symbolen
- Travel-Planner mit Packing-Tipps & Bild-Upload
- Mobile-optimierte Navigation (inkl. Sidebar)
- Alles läuft im Docker-Container, kein Node oder NPM auf dem System notwendig.

---

## Installation & Start

### 1. Voraussetzungen

- **Docker** muss installiert sein (Docker Desktop oder Engine).

### 2. Projekt klonen

git clone <REPO_URL>
cd <PROJEKTORDNER>


### 3. Build des Containers

Das Image wird komplett mit allen Abhängigkeiten gebaut:

''' 
docker build -t breeze-app .
'''

### 4. Starten des Containers

Starte die Anwendung (Port 8080 auf localhost):

''' 
docker run -p 8080:80 breeze-app
'''

### 5. App im Browser aufrufen

Öffne deinen Browser und gehe auf:

'''
http://localhost:8080
'''

---

## Projektstruktur

- 'src/' – Quellcode (React-Komponenten, Seiten, Hooks, Services)
- 'public/' – Statische Dateien (Assets, Fallback-Bilder)
- 'Dockerfile' – Build- & Run-Definition (Multi-Stage: Node Build, Nginx Serve)
- 'nginx.conf' – SPA-freundliches Routing für React (History-API)
- 'README.md' – Diese Anleitung

---

## Wichtige Docker-Kommandos

- **Image bauen:**  
  'docker build -t breeze-app .'

- **Container starten:**  
  'docker run -p 8080:80 breeze-app'

- **Image & Container aufräumen:**  
  ''' 
  docker ps -a                # Container auflisten
  docker stop <CONTAINER_ID>  # Container stoppen
  docker rm <CONTAINER_ID>    # Container löschen
  docker rmi breeze-app       # Image löschen
  '''

---

## Nutzung

- **Suche:** Städte können direkt gesucht werden (Live-Autocomplete im Suchfeld)
- **Travel-Planner:** Per Klick auf „Add“ Ziel eingeben, Datum via Kalender auswählen, Bild hochladen (Drag & Drop oder Explorer), Packing-Liste wird automatisch vorgeschlagen
- **Delete:** Reisen lassen sich direkt entfernen (Papierkorb)
- **Dark/Light Mode:** Umschaltbar rechts oben
- **100 % mobilfähig:** Sidebar als Menü, alles responsive

---

## Tests

Nach dem Build und Start:  
1. Öffne die App unter 'localhost:8080'
2. Suche nach Städten, plane Reisen, teste das UI
3. Fehler oder Wünsche? Im Issue-Tracker melden

---

## Hinweise

- **API Keys:** Die App nutzt öffentliche Demo-Keys (Pixabay, OpenWeather). Für produktive Nutzung bitte eigene Keys im Code hinterlegen.
- **Persistenz:** Travel-Ziele werden im LocalStorage gespeichert, kein Server notwendig.

---

**Viel Spaß mit Breeze!**
