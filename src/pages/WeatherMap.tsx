"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { weatherService } from "@/services/weatherService";

const OPENWEATHER_API_KEY = "662f9e367e0eed1c1a0ba5e40a5fc2b4";

// Für dynamischen Background wie auf Index
function getBackgroundClass(condition?: string) {
  switch (condition) {
    case "sunny":
      return "bg-sunny";
    case "rainy":
      return "bg-rainy";
    case "cloudy":
      return "bg-cloudy";
    case "snowy":
      return "bg-clear";
    default:
      return "bg-sunny";
  }
}

// Komponente, um Wetter und Condition des Markers an die Elternkomponente zu melden
function WeatherMarker({ position, onWeatherLoaded }: { position: [number, number], onWeatherLoaded: (condition: string | undefined) => void }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    setWeather(null);
    weatherService.getCurrentWeather(position[0], position[1]).then(w => {
      setWeather(w);
      onWeatherLoaded(w?.condition);
    });
  }, [position[0], position[1], onWeatherLoaded]);

  const icon = L.icon({
    iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static/icons/map-pin.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        {weather ? (
          <div className="min-w-[180px] text-center">
            <div className="font-bold">{weather.location}</div>
            <div className="text-2xl my-1">{weather.temperature}°C</div>
            <div>{weather.condition}</div>
            <div className="text-xs text-muted-foreground">{weather.description}</div>
            <div className="mt-2 flex justify-between text-xs">
              <span>💧 {weather.humidity}%</span>
              <span>🌬 {weather.windSpeed} km/h</span>
            </div>
          </div>
        ) : (
          <div>Lade Wetter...</div>
        )}
      </Popup>
    </Marker>
  );
}

function ClickHandler({ onMapClick }: { onMapClick: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const WeatherMap = () => {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [markerWeather, setMarkerWeather] = useState<string | undefined>("sunny");

  // Background wechselt mit Wetter des Markers (wie auf Home)
  const bgClass = getBackgroundClass(markerWeather);

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Weather Map</h1>
          <p className="text-white/80">Interactive weather conditions worldwide</p>
        </div>
        <Card className="h-[600px] shadow-card glass overflow-hidden">
          <div className="h-full">
            <MapContainer
              center={[50, 10]}
              zoom={4}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <TileLayer
                url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              />
              <ClickHandler onMapClick={setMarkerPos} />
              {markerPos && (
                <WeatherMarker
                  position={markerPos}
                  onWeatherLoaded={setMarkerWeather}
                />
              )}
            </MapContainer>
          </div>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-accent"></div>
            <span className="text-sm">Sunny</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-sm">Rainy</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
            <span className="text-sm">Cloudy</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg glass">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <span className="text-sm">Snow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
