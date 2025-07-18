import React, { useState, useEffect } from 'react'; // useEffect importieren
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import styles from './WeatherMap.module.css';


import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const WeatherMap: React.FC = () => {
  const apiKey = "485781dc76ae6d02904cf60be211c2ae";

  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);


  const fetchWeather = async (latlng: L.LatLng) => {
    setMarkerPosition(latlng);
    setWeatherData(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&appid=${apiKey}&units=metric&lang=de`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Wetterdaten nicht gefunden.");
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Wetterdaten:", error);
      setWeatherData({ error: "Wetterdaten konnten nicht geladen werden." });
    }
  };

  useEffect(() => {
    const initialLatLng = L.latLng(49.79, 9.95);
    fetchWeather(initialLatLng);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mapFrame}>
        <MapContainer
          center={[49.79, 9.95]}
          zoom={12}
          className={styles.mapContainer}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            className={styles.tileLayer}
          />

          <MapClickHandler onMapClick={fetchWeather} />

          {markerPosition && (
            <Marker position={markerPosition}>
              <Popup>
                {weatherData ? (
                  weatherData.error ? (
                    <span>{weatherData.error}</span>
                  ) : (
                    <div>
                      <strong>{weatherData.name}</strong><br />
                      Temperatur: {Math.round(weatherData.main.temp)}°C<br />
                      Wetter: {weatherData.weather[0].description}
                    </div>
                  )
                ) : (
                  "Lade Wetterdaten..."
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default WeatherMap;