
import { useState, useEffect } from "react";
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

const SavedCities = () => {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved cities from localStorage
  useEffect(() => {
    const loadSavedCities = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem('savedCities') || '[]') as SavedCity[];
        
        // Default cities if none saved
        const defaultCities = saved.length > 0 ? saved : [
          { name: 'Würzburg', lat: 49.7913, lon: 9.9534 },
          { name: 'Stockholm', lat: 59.3293, lon: 18.0686 },
          { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
          { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
        ];

        // Fetch weather data for each city
        const citiesWithWeather = await Promise.all(
          defaultCities.map(async (city) => {
            try {
              const weather = await weatherService.getCurrentWeather(city.lat, city.lon);
              return { ...city, weather };
            } catch (error) {
              console.error(`Error fetching weather for ${city.name}:`, error);
              return city;
            }
          })
        );

        setSavedCities(citiesWithWeather);
        
        // Save default cities if none were saved before
        if (saved.length === 0) {
          localStorage.setItem('savedCities', JSON.stringify(defaultCities));
        }
      } catch (error) {
        console.error('Error loading saved cities:', error);
        setSavedCities([]);
      } finally {
        setLoading(false);
      }
    };

    loadSavedCities();
  }, []);

  const removeCity = (index: number) => {
    const updated = savedCities.filter((_, i) => i !== index);
    setSavedCities(updated);
    localStorage.setItem('savedCities', JSON.stringify(updated.map(city => ({
      name: city.name,
      lat: city.lat,
      lon: city.lon
    }))));
  };

  const refreshWeather = async () => {
    setLoading(true);
    try {
      const citiesWithWeather = await Promise.all(
        savedCities.map(async (city) => {
          try {
            const weather = await weatherService.getCurrentWeather(city.lat, city.lon);
            return { ...city, weather };
          } catch (error) {
            console.error(`Error refreshing weather for ${city.name}:`, error);
            return city;
          }
        })
      );
      setSavedCities(citiesWithWeather);
    } catch (error) {
      console.error('Error refreshing weather:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for new cities added from search
  useEffect(() => {
    const handleCityAdd = (event: CustomEvent) => {
      const { lat, lon, name } = event.detail;
      
      // Check if city already exists
      const exists = savedCities.some(city => 
        Math.abs(city.lat - lat) < 0.01 && Math.abs(city.lon - lon) < 0.01
      );
      
      if (!exists) {
        const newCity = { name, lat, lon };
        const updated = [...savedCities, newCity];
        setSavedCities(updated);
        localStorage.setItem('savedCities', JSON.stringify(updated.map(city => ({
          name: city.name,
          lat: city.lat,
          lon: city.lon
        }))));
        
        // Fetch weather for new city
        weatherService.getCurrentWeather(lat, lon).then(weather => {
          setSavedCities(prev => prev.map(city => 
            city.name === name ? { ...city, weather } : city
          ));
        }).catch(error => {
          console.error(`Error fetching weather for new city ${name}:`, error);
        });
      }
    };

    window.addEventListener('addCity', handleCityAdd as EventListener);
    return () => window.removeEventListener('addCity', handleCityAdd as EventListener);
  }, [savedCities]);

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
            <p className="text-white/80">Your favorite locations at a glance</p>
          </div>
          <Button onClick={refreshWeather} className="gap-2">
            <Plus className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {savedCities.length === 0 ? (
          <div className="text-center text-white py-12">
            <h2 className="text-xl font-semibold mb-2">No saved cities</h2>
            <p className="text-white/80">Use the search bar to add cities to your favorites</p>
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
                  <WeatherCard {...city.weather} />
                ) : (
                  <div className="glass rounded-lg p-6 shadow-card">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">{city.name}</h3>
                      <p className="text-muted-foreground">Loading weather data...</p>
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
