"use client";
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

const OPENWEATHER_API_KEY = "DEIN_OPENWEATHER_API_KEY"; // <-- hier deinen Key eintragen!

const WeatherMap = () => {
  return (
    <div className="min-h-screen bg-clear">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Weather Map</h1>
          <p className="text-white/80">Interactive weather conditions worldwide</p>
        </div>

        {/* Map Container */}
        <Card className="h-[600px] shadow-card glass overflow-hidden">
          <div className="h-full">
            <MapContainer
              center={[50, 10]}
              zoom={4}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay checked name="Clouds">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Precipitation">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Temperature">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Wind">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                  />
                </LayersControl.Overlay>
              </LayersControl>
            </MapContainer>
          </div>
        </Card>

        {/* Map Legend */}
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
