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

// Hilfsfunktion für saubere Rundung!
function roundCoord(coord: number): number {
  return Number(coord.toFixed(4));
}

const DEFAULT_CITIES: SavedCity[] = [
  { name: "Würzburg", lat: roundCoord(49.7913), lon: roundCoord(9.9534) },
  { name: "Stockholm", lat: roundCoord(59.3293), lon: roundCoord(18.0686) },
  { name: "Barcelona", lat: roundCoord(41.3851), lon: roundCoord(2.1734) },
  { name: "Berlin", lat: roundCoord(52.5200), lon: roundCoord(13.4050) },
];


const SavedCities = () => {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(true);

  // Hilfsfunktion fürs Einlesen
  function parseCities(cities: any[]): SavedCity[] {
    return (cities || []).map((c: any) => ({
      ...c,
      lat: Number(c.lat),
      lon: Number(c.lon),
    }));
  }

  // Initial load & Wetterdaten holen
  const loadSavedCities = useCallback(async () => {
    setLoading(true);
    try {
      // Immer als Number einlesen!
      const saved = parseCities(JSON.parse(localStorage.getItem("savedCities") || "[]"));
      const baseCities = saved.length > 0 ? saved : DEFAULT_CITIES;

      const citiesWithWeather = await Promise.all(
        baseCities.map(async (city) => {
          try {
            const weather = await weatherService.getCurrentWeather(roundCoord(city.lat), roundCoord(city.lon));
            return { ...city, lat: roundCoord(city.lat), lon: roundCoord(city.lon), weather };
          } catch {
            return { ...city, lat: roundCoord(city.lat), lon: roundCoord(city.lon) };
          }
        })
      );
      setSavedCities(citiesWithWeather);

      // Defaults speichern, falls keine Cities vorher da
      if (saved.length === 0) {
        localStorage.setItem(
          "savedCities",
          JSON.stringify(DEFAULT_CITIES)
        );
      }
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
        roundCoord(city.lat) === roundCoord(cityToRemove.lat) &&
        roundCoord(city.lon) === roundCoord(cityToRemove.lon)
      );
    });
    setSavedCities(updated);
    localStorage.setItem(
      "savedCities",
      JSON.stringify(
        updated.map(({ name, lat, lon }) => ({
          name,
          lat: roundCoord(lat),
          lon: roundCoord(lon),
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
            const weather = await weatherService.getCurrentWeather(roundCoord(city.lat), roundCoord(city.lon));
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

  // Tab-Synchronisierung (immer parseCities benutzen!)
  useEffect(() => {
    const syncCities = () => {
      const saved = parseCities(JSON.parse(localStorage.getItem("savedCities") || "[]"));
      setSavedCities((current) => {
        if (
          saved.length !== current.length ||
          saved.some(
            (s, i) =>
              roundCoord(s.lat) !== roundCoord(current[i]?.lat) ||
              roundCoord(s.lon) !== roundCoord(current[i]?.lon)
          )
        ) {
          return saved.map(city => ({
            ...city,
            lat: roundCoord(city.lat),
            lon: roundCoord(city.lon),
          }));
        }
        return current;
      });
    };
    window.addEventListener("storage", syncCities);
    return () => window.removeEventListener("storage", syncCities);
  }, []);

  // Neue Stadt hinzufügen (aus Suche/Map) – alles gerundet & als Number!
  useEffect(() => {
    const handleCityAdd = async (event: CustomEvent) => {
      const { lat, lon, name } = event.detail;
      const roundedLat = roundCoord(Number(lat));
      const roundedLon = roundCoord(Number(lon));
      const exists = savedCities.some(
        (city) =>
          roundCoord(city.lat) === roundedLat &&
          roundCoord(city.lon) === roundedLon
      );
      if (!exists) {
        let weather: AppWeatherData | undefined = undefined;
        try {
          weather = await weatherService.getCurrentWeather(roundedLat, roundedLon);
        } catch {}
        const newCity = { name, lat: roundedLat, lon: roundedLon, weather };
        const updated = [...savedCities, newCity];
        setSavedCities(updated);
        localStorage.setItem(
          "savedCities",
          JSON.stringify(
            updated.map(({ name, lat, lon }) => ({
              name,
              lat: roundCoord(lat),
              lon: roundCoord(lon),
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
                  .getCurrentWeather(roundCoord(city.lat), roundCoord(city.lon))
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
