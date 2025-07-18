import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow, Heart } from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  location: string;
  description: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  lat?: number;
  lon?: number;
  className?: string;
  hideFavoriteButton?: boolean;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
};

const weatherGradients = {
  sunny: "bg-sunny",
  cloudy: "bg-cloudy",
  rainy: "bg-rainy",
  snowy: "bg-clear",
};

// ** Toleranz für den Favoriten-Vergleich **
const COORD_TOLERANCE = 0.00001;

export function WeatherCard({
  temperature,
  condition,
  location,
  description,
  humidity,
  windSpeed,
  uvIndex,
  lat,
  lon,
  className,
  hideFavoriteButton = false,
}: WeatherCardProps) {
  const IconComponent = weatherIcons[condition];

  // Favoriten-Status
  const [isFavorite, setIsFavorite] = useState(false);

  // Favoritenprüfung mit Toleranz
  useEffect(() => {
    if (lat === undefined || lon === undefined) return;
    const saved = (JSON.parse(localStorage.getItem("savedCities") || "[]") as any[]).map(c => ({
      ...c,
      lat: Number(c.lat),
      lon: Number(c.lon),
    }));

      // <--- HIER DEBUG LOGS EINBAUEN ---
  console.log("[WeatherCard] lat/lon von Props:", lat, lon);
  console.log("[WeatherCard] Favoriten (localStorage):", saved);
    setIsFavorite(
      saved.some(
        (c: any) =>
          Math.abs(Number(c.lat) - Number(lat)) < COORD_TOLERANCE &&
          Math.abs(Number(c.lon) - Number(lon)) < COORD_TOLERANCE
      )
    );
  }, [lat, lon, location]);

  const handleToggleFavorite = () => {
    if (lat === undefined || lon === undefined) return;
    const saved = (JSON.parse(localStorage.getItem("savedCities") || "[]") as any[]).map(c => ({
      ...c,
      lat: Number(c.lat),
      lon: Number(c.lon),
    }));

    if (isFavorite) {
      // Entfernen
      const updated = saved.filter(
        (c: any) =>
          Math.abs(Number(c.lat) - Number(lat)) >= COORD_TOLERANCE ||
          Math.abs(Number(c.lon) - Number(lon)) >= COORD_TOLERANCE
      );
      localStorage.setItem("savedCities", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // Hinzufügen
      const updated = [
        ...saved,
        { name: location, lat: Number(lat), lon: Number(lon) }
      ];
      localStorage.setItem("savedCities", JSON.stringify(updated));
      setIsFavorite(true);
      window.dispatchEvent(
        new CustomEvent("addCity", {
          detail: { lat: Number(lat), lon: Number(lon), name: location },
        })
      );
    }
  };

  return (
    <Card className={`relative p-6 shadow-card hover:shadow-elevation transition-smooth glass ${className}`}>
      {/* Favoriten-Button */}
      {!hideFavoriteButton && lat !== undefined && lon !== undefined && (
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-20 text-accent hover:text-accent/80 transition"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <Heart className="w-6 h-6" fill="currentColor" />
          ) : (
            <Heart className="w-6 h-6" />
          )}
        </button>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${weatherGradients[condition]}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{location}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{temperature}°C</div>
          <div className="text-sm text-muted-foreground capitalize">{condition}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Humidity</div>
          <div className="font-semibold">{humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Wind</div>
          <div className="font-semibold">{windSpeed} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">UV Index</div>
          <div className="font-semibold">{uvIndex}</div>
        </div>
      </div>
    </Card>
  );
}
