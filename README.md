# Breeze – Wetter-App & Travel Planner (Frontend)

Willkommen zu **Breeze** – der React-basierten All-in-One-Plattform für Wetter, Reiseplanung und Favoritenverwaltung.  
Modern, responsiv und vollständig als Docker-Container lauffähig.

---

## Projektüberblick

- Moderne Single Page Application (React/Vite)
- Datenquellen: OpenWeatherMap (Wetter) & Pixabay (Bilder)
- Komplett lauffähig als Docker-Container (kein Node.js/NPM auf dem Host erforderlich)
- Mobile-optimiertes, responsives Design

---

## Features & Funktionen

### **Startseite / Aktuelles Wetter**
- Wetteranzeige für die ausgewählte Stadt mit Temperatur, Zustand, Wind, Luftfeuchtigkeit und UV-Index
- Favoriten-Herz zum Hinzufügen/Entfernen der Stadt aus den Favoriten
- Schnelle Stadtsuche (Live-Autocomplete)
- 24-Stunden-Prognose (Wetterverlauf, Icons & Temperaturen)
- Sonnenaufgang & Sonnenuntergang (mit Symbolen)
- Zusatzinfos: Luftqualität, Sichtweite, Luftdruck
- Responsives Layout, Dark/Light Mode

### **5-Tage-Vorhersage**
- Prognose der kommenden fünf Tage für die gewählte Stadt
- Detaillierte Tageskarten mit Wetter-Icons, Temperatur (min/max) und Zustand
- Suchfunktion für Städte
- Automatische Aktualisierung bei Standortänderung
- Mobil- und Desktopoptimiert

### **Travel Planner**
- Neue Reiseziele anlegen mit:
  - Intelligenter Stadtsuche (Autocomplete)
  - Auswahl eines Reisedatums (Kalender)
  - Bild-Upload (Drag & Drop, Dateiauswahl oder automatische Suche)
- Automatisch generierte Packliste je nach Wetterbedingungen am Zielort
- Übersicht aller Reisen als Cards mit Wettervorhersage, Bild, Datum & Wetterwarnungen („Rain expected“)
- Reisen entfernen (Papierkorb)
- Detailansicht mit allen Infos & Packempfehlungen
- Persistenz: Alles bleibt nach Neuladen gespeichert (LocalStorage)
- Responsives Layout und Dark Mode

### **Favoriten / Saved Cities**
- Verwaltung aller favorisierten Städte
- Wetter-Kurzinfo je Stadt (Temperatur, Symbol)
- Schnellnavigation zu Favoriten
- Entfernen aus der Favoritenliste

### **Wetterkarte**
- Interaktive Karte mit aktuellen Wetterdaten (z. B. Temperatur, Regen, Bewölkung)
- Zoom, Pan & zentrieren auf aktuellen Standort
- Verschiedene Wetter-Layer (nach API-Verfügbarkeit)
- Anpassung für alle Bildschirmgrößen

### **404 Fehlerseite**
- Freundliche Anzeige bei unbekannten Seiten/Fehlern
- Button zum Zurückkehren auf die Startseite

### **Weitere Funktionen**
- Sidebar für schnelle Navigation auf allen Devices (inkl. Mobile-Menü)
- Umschalten zwischen Dark Mode und Light Mode
- Lokale Speicherung der wichtigsten Daten (Favoriten, Reisen) ohne externen Server
- Nutzerfeedback über Toast-Messages bei Fehlern oder Erfolgen

---

## Installation & Start

### 1. Voraussetzungen

- **Docker** muss installiert sein (Docker Desktop oder Engine).

### 2. Projekt klonen
```bash
git clone <REPO_URL>
cd <PROJEKTORDNER>
```

### 3. Build des Containers

Das Image wird komplett mit allen Abhängigkeiten gebaut:

```bash
docker build -t breeze-app .
```

### 4. Starten des Containers

Starte die Anwendung (Port 8080 auf localhost):

```bash
docker run -p 8080:80 breeze-app
```

### 5. App im Browser aufrufen

Öffne deinen Browser und gehe auf:

```
http://localhost:8080
```

---

## Projektstruktur

- `src/` – Quellcode (React-Komponenten, Seiten, Hooks, Services)
- `public/` – Statische Dateien (Assets, Fallback-Bilder)
- `Dockerfile` – Build- & Run-Definition (Multi-Stage: Node Build, Nginx Serve)
- `nginx.conf` – SPA-freundliches Routing für React (History-API)
- `README.md` – Diese Anleitung

---

## Wichtige Docker-Kommandos

- **Image bauen:**  
  `docker build -t breeze-app .`

- **Container starten:**  
  `docker run -p 8080:80 breeze-app`

- **Image & Container aufräumen:**  
  ```bash
  docker ps -a                # Container auflisten
  docker stop <CONTAINER_ID>  # Container stoppen
  docker rm <CONTAINER_ID>    # Container löschen
  docker rmi breeze-app       # Image löschen
  ```

---

## Tests

Nach dem Build und Start:  
1. Öffne die App unter `localhost:8080`
2. Suche nach Städten, plane Reisen, teste das UI
3. Fehler oder Wünsche? Im Issue-Tracker melden

---

## Hinweise

- **API Keys:** Die App nutzt öffentliche Demo-Keys (Pixabay, OpenWeather). Für produktive Nutzung bitte eigene Keys im Code hinterlegen.
- **Persistenz:** Travel-Ziele werden im LocalStorage gespeichert, kein Server notwendig.

---

**Viel Spaß mit Breeze!**
