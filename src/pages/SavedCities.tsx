import { useState, useEffect, useCallback } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { weatherService } from "@/services/weatherService";
import { AppWeatherData } from "@/types/weather";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedCity {
  name: string;
  lat: number;
  lon: number;
  weather?: AppWeatherData;
}

// <--- NEU: Cities als Name, echte Koordinaten werden erst beim Start geholt!
const DEFAULT_CITIES_NAMES = [
  "Würzburg",
  "Stockholm",
  "Barcelona",
  "Berlin",
];

// Toleranz für Koordinatenvergleich
const COORD_TOLERANCE = 0.00001;

// NEU: Hole Default-Cities per Geocoding-API
async function fetchDefaultCitiesFromAPI(): Promise<SavedCity[]> {
  const apiKey = "662f9e367e0eed1c1a0ba5e40a5fc2b4"; // <-- Dein Key!
  const cities = await Promise.all(
    DEFAULT_CITIES_NAMES.map(async (name) => {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          name
        )}&limit=1&appid=${apiKey}`
      );
      const [geo] = await res.json();
      return geo
        ? { name, lat: geo.lat, lon: geo.lon }
        : null;
    })
  );
  return cities.filter(Boolean) as SavedCity[];
}

const SavedCities = () => {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load & Wetterdaten holen
  const loadSavedCities = useCallback(async () => {
    setLoading(true);
    try {
      let saved: SavedCity[] = JSON.parse(localStorage.getItem("savedCities") || "[]");
      if (!Array.isArray(saved) || saved.length === 0) {
        // Beim Erststart echte Defaults holen!
        saved = await fetchDefaultCitiesFromAPI();
        localStorage.setItem("savedCities", JSON.stringify(saved));
      }
      // Wetterdaten holen
      const citiesWithWeather = await Promise.all(
        saved.map(async (city) => {
          try {
            const weather = await weatherService.getCurrentWeather(city.lat, city.lon);
            return { ...city, weather };
          } catch {
            return city;
          }
        })
      );
      setSavedCities(citiesWithWeather);
    } catch (error) {
      setSavedCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedCities();
  }, [loadSavedCities]);

  // City entfernen
  const removeCity = (index: number) => {
    const cityToRemove = savedCities[index];
    const updated = savedCities.filter((city, i) => {
      return !(
        Math.abs(Number(city.lat) - Number(cityToRemove.lat)) < COORD_TOLERANCE &&
        Math.abs(Number(city.lon) - Number(cityToRemove.lon)) < COORD_TOLERANCE
      );
    });
    setSavedCities(updated);
    localStorage.setItem(
      "savedCities",
      JSON.stringify(
        updated.map(({ name, lat, lon }) => ({
          name,
          lat,
          lon,
        }))
      )
    );
  };

  // Wetterdaten neu laden (manuell & im Intervall)
  const refreshWeather = async () => {
    setLoading(true);
    try {
      const citiesWithWeather = await Promise.all(
        savedCities.map(async (city) => {
          try {
            const weather = await weatherService.getCurrentWeather(city.lat, city.lon);
            return { ...city, weather };
          } catch {
            return city;
          }
        })
      );
      setSavedCities(citiesWithWeather);
    } finally {
      setLoading(false);
    }
  };

  // Wetterdaten automatisch alle 10 Minuten neu laden
  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeather();
    }, 10 * 60 * 1000); // 10 Minuten
    return () => clearInterval(interval);
  }, [savedCities]);

  // Tab-Synchronisierung
  useEffect(() => {
    const syncCities = () => {
      let saved: SavedCity[] = JSON.parse(localStorage.getItem("savedCities") || "[]");
      setSavedCities((current) => {
        if (
          saved.length !== current.length ||
          saved.some(
            (s, i) =>
              Math.abs(Number(s.lat) - Number(current[i]?.lat)) > COORD_TOLERANCE ||
              Math.abs(Number(s.lon) - Number(current[i]?.lon)) > COORD_TOLERANCE
          )
        ) {
          return saved;
        }
        return current;
      });
    };
    window.addEventListener("storage", syncCities);
    return () => window.removeEventListener("storage", syncCities);
  }, []);

  // Neue Stadt hinzufügen (aus Suche/Map)
  useEffect(() => {
    const handleCityAdd = async (event: CustomEvent) => {
      const { lat, lon, name } = event.detail;
      const exists = savedCities.some(
        (city) =>
          Math.abs(Number(city.lat) - Number(lat)) < COORD_TOLERANCE &&
          Math.abs(Number(city.lon) - Number(lon)) < COORD_TOLERANCE
      );
      if (!exists) {
        let weather: AppWeatherData | undefined = undefined;
        try {
          weather = await weatherService.getCurrentWeather(lat, lon);
        } catch {}
        const newCity = { name, lat, lon, weather };
        const updated = [...savedCities, newCity];
        setSavedCities(updated);
        localStorage.setItem(
          "savedCities",
          JSON.stringify(
            updated.map(({ name, lat, lon }) => ({
              name,
              lat,
              lon,
            }))
          )
        );
      }
    };
    window.addEventListener("addCity", handleCityAdd as EventListener);
    return () => window.removeEventListener("addCity", handleCityAdd as EventListener);
  }, [savedCities]);

  // Fehlende Wetterdaten nachladen
  useEffect(() => {
    const fetchMissingWeather = async () => {
      const needsWeather = savedCities.filter((c) => !c.weather);
      if (needsWeather.length === 0) return;
      const updated = await Promise.all(
        savedCities.map(async (city) =>
          city.weather
            ? city
            : {
                ...city,
                weather: await weatherService
                  .getCurrentWeather(city.lat, city.lon)
                  .catch(() => undefined),
              }
        )
      );
      setSavedCities(updated);
    };
    fetchMissingWeather();
  }, [savedCities]);

  // --- UI ---

  if (loading) {
    return (
      <div className="min-h-screen bg-clear">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clear">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Saved Cities</h1>
            <p className="text-white/80">
              Your favorite locations at a glance
            </p>
          </div>
          <Button onClick={refreshWeather} className="gap-2">
            <Plus className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {savedCities.length === 0 ? (
          <div className="text-center text-white py-12">
            <h2 className="text-xl font-semibold mb-2">No saved cities</h2>
            <p className="text-white/80">
              Use the search bar to add cities to your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCities.map((city, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => removeCity(index)}
                  className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {city.weather ? (
                  <WeatherCard
                    {...city.weather}
                    lat={city.lat}
                    lon={city.lon}
                    hideFavoriteButton
                  />
                ) : (
                  <div className="glass rounded-lg p-6 shadow-card">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">{city.name}</h3>
                      <p className="text-muted-foreground">
                        Loading weather data...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCities;
