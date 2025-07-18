import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { weatherService } from "@/services/weatherService";

// Forecast-Typ
interface DailyForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  description: string;
  airQuality: string;
}

// Default-Stadt für den Start
const DEFAULT_LOCATION = {
  lat: 49.7913,
  lon: 9.9534,
  city: "Würzburg",
};

const Forecast = () => {
  // Nutze dieselbe Speicher-Logik wie in Index!
  const [location, setLocation] = useState(() => {
    const last = localStorage.getItem("lastLocation");
    if (last) {
      try {
        return JSON.parse(last);
      } catch {}
    }
    return DEFAULT_LOCATION;
  });

  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
  };

  const weatherColors = {
    sunny: "text-accent",
    cloudy: "text-muted-foreground",
    rainy: "text-primary",
    snowy: "text-blue-400",
  };

  // Forecast holen, wenn Location sich ändert
  useEffect(() => {
    const fetchForecast = async () => {
      if (!location.lat || !location.lon) return;
      try {
        setLoading(true);
        setError(null);
        const forecast = await weatherService.get5DayForecast(location.lat, location.lon);
        setDailyForecast(forecast);
      } catch (err) {
        console.error('Forecast fetch error:', err);
        setError('Unable to load forecast data');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location.lat, location.lon]);

  // Auf Standortwechsel aus Sidebar reagieren UND speichern
  useEffect(() => {
    const handleLocationChange = (event: CustomEvent) => {
      const { lat, lon, name } = event.detail;
      setLocation({ lat, lon, city: name });
      localStorage.setItem("lastLocation", JSON.stringify({ lat, lon, city: name }));
    };

    window.addEventListener('locationChange', handleLocationChange as EventListener);
    return () => window.removeEventListener('locationChange', handleLocationChange as EventListener);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sunny">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sunny flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Forecast Unavailable</h2>
          <p className="text-white/80">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sunny">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">5-Day Forecast</h1>
          <p className="text-white/80">Detailed weather outlook</p>
        </div>

        <div className="space-y-4">
          {dailyForecast.map((day, index) => {
            const IconComponent = weatherIcons[day.condition as keyof typeof weatherIcons] || Sun;
            return (
              <Card key={index} className="p-6 shadow-card hover:shadow-elevation transition-smooth glass">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`${weatherColors[day.condition as keyof typeof weatherColors] || 'text-accent'}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{day.day}</div>
                      <div className="text-sm text-muted-foreground">{day.date}</div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium capitalize">{day.description}</div>
                      <div className="text-sm text-muted-foreground">Air Quality: {day.airQuality}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{day.high}°</span>
                      <span className="text-lg text-muted-foreground">/ {day.low}°</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
