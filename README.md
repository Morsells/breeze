🌦️ Breeze Weather App
Eine moderne, interaktive Wetter-App mit OpenWeather-API, Favoriten, dynamischer Karte & stylischem UI – gebaut mit React, TailwindCSS und React Leaflet.

Inhalt
Features

Screenshots

Tech Stack

Setup & Installation

Umgebungsvariablen

Verfügbare Scripts

Ordnerstruktur

Komponenten & Architektur

API & Services

FAQ & Troubleshooting

Contribution

Lizenz

Features
🔍 Live-Wetter für beliebige Orte weltweit

⭐ Favoritenfunktion (mit localStorage, robust gegen Rundungsfehler)

🗺️ Interaktive Wetterkarte mit Layern und Map-Click-Feature

🎨 Dynamischer Hintergrund je nach aktuellem Wetter (sunny, cloudy, rainy, snowy)

🕓 Stunden- und Tages-Vorhersage

☀️ Sunrise/Sunset-Anzeige

💨 Air Quality, Wind, Druck, Sichtweite etc.

🖥️ Responsive & modernes UI (Tailwind, Glassmorphism)

⚡ Schnelle API-Calls & Caching

👥 Tab-Synchronisierung für Favoriten

🧠 Robuste Typisierung mit TypeScript

Screenshots
(Füge hier PNGs deiner App im Light/Dark Mode, WeatherMap und Favoritenliste ein)

Tech Stack
Frontend: React (18+), TypeScript, TailwindCSS

Map: React Leaflet, OpenStreetMap, OpenWeatherMap Tiles

Icons: Lucide React

API: OpenWeatherMap REST API

State: React Hooks, Context, Local Storage

Setup & Installation
1. Repository klonen
bash
Kopieren
Bearbeiten
git clone https://github.com/dein-user/breeze-weather-app.git
cd breeze-weather-app
2. Abhängigkeiten installieren
WICHTIG:

Nutze Node.js 18+ (empfohlen)

Falls du React 18 nutzt, installiere React Leaflet 4 (nicht 5!):

bash
Kopieren
Bearbeiten
npm install
npm install leaflet react-leaflet@4
3. API Key einrichten
Erstelle im Projekt eine .env-Datei:

ini
Kopieren
Bearbeiten
VITE_OPENWEATHER_API_KEY=dein-openweather-api-key
(Oder passe direkt im Code den Key an.)

4. Starten
bash
Kopieren
Bearbeiten
npm run dev
Öffne http://localhost:5173 oder http://localhost:3000 (je nach Vite/Next/CRA Setup).

Umgebungsvariablen
VITE_OPENWEATHER_API_KEY – dein OpenWeather API Key
(bei Create React App: REACT_APP_...)

Verfügbare Scripts
Befehl	Zweck
npm run dev	Entwicklungs-Server starten
npm run build	Produktion-Build
npm run preview	Produktion lokal testen

Ordnerstruktur
plaintext
Kopieren
Bearbeiten
src/
├─ components/
│  ├─ ui/              # Basis UI-Elemente (Button, Card, Skeleton, ...)
│  ├─ WeatherCard.tsx  # Haupt-WeatherCard mit Favoriten-Button
│  ├─ HourlyForecast.tsx
│  ├─ SunriseSunset.tsx
│  ├─ WeatherMap.tsx   # Map-Ansicht (React Leaflet)
│  └─ SavedCities.tsx  # Favoritenliste
├─ hooks/
│  └─ useLocation.ts   # Hook für Geo & Location
├─ services/
│  └─ weatherService.ts# API Calls mit Caching
├─ types/
│  └─ weather.d.ts     # Wetter-Typen für TS
├─ App.tsx
├─ Index.tsx           # Start-/Home-Seite
└─ ...
Komponenten & Architektur
WeatherCard
Zeigt das aktuelle Wetter + Favoriten-Herz (mit Rundungs-Check und robustem Storage-Handling)

SavedCities
Listet alle Favoriten, sorgt für Storage- und Intervall-Updates, synchronisiert mit allen Tabs

WeatherMap
Interaktive Leaflet-Karte, Marker setzen, aktuelles Wetter per Popup, dynamischer Background wie Home

useLocation
Liefert aktuelle Koordinaten/Stadt (Geolocation + Fallbacks)

weatherService
Holt Wetterdaten, cached sie, mapped OpenWeather-Daten zu UI-friendly Types

API & Services
OpenWeatherMap:

/weather für aktuelles Wetter

/forecast für stündliche & Tages-Vorhersage

/air_pollution für Air Quality

/geo/1.0/direct für Geocoding

FAQ & Troubleshooting
Wetterdaten/Favoriten werden nicht korrekt angezeigt?
Prüfe, ob dein API Key gültig ist

Leere einmal LocalStorage, wenn du nach einem Update Fehler siehst

Achte darauf, dass alle Koordinaten beim Speichern/Lesen mit Number(...).toFixed(4) gerundet werden

Map oder API-Fehler (CORS etc.)
Stelle sicher, dass OpenWeatherMap und OSM nicht von deiner Firewall/Adblocker geblockt werden

React Leaflet will React 19?
Nutze dann unbedingt die Version 4 von react-leaflet
npm install react-leaflet@4

Contribution
Pull Requests und Bug Reports sind willkommen!
Bitte stelle sicher, dass deine PRs nach dem bestehenden Code- und Styling-Standard formatiert sind.

Lizenz
MIT License
(c) 2024 Moritz Bauer und Open Source Contributors

Sonstiges
Für weitere Fragen/Erweiterungen einfach Issue erstellen oder mich direkt kontaktieren.

Screenshots, weitere Features, Demos etc. gerne ergänzen!

