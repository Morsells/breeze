import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { HourlyForecast } from "@/components/HourlyForecast";
import { SunriseSunset } from "@/components/SunriseSunset";
import { Skeleton } from "@/components/ui/skeleton";
import { weatherService } from "@/services/weatherService";
import { AppWeatherData, HourlyForecastItem } from "@/types/weather";

interface LastLocation {
  lat: number;
  lon: number;
  city: string;
}

const DEFAULT_LOCATION: LastLocation = {
  lat: 49.7913, // Würzburg
  lon: 9.9534,
  city: "Würzburg",
};

const Index = () => {
  // Lokale States für die aktuell angezeigten Koordinaten und Stadt
  const [location, setLocation] = useState<LastLocation>(() => {
    // Versuche beim Laden, die letzte Stadt zu laden:
    const last = localStorage.getItem("lastLocation");
    if (last) {
      try {
        return JSON.parse(last);
      } catch (e) {}
    }
    return DEFAULT_LOCATION;
  });

  const [currentWeather, setCurrentWeather] = useState<AppWeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyForecastItem[]>([]);
  const [airQuality, setAirQuality] = useState({ quality: 'Good', aqi: 42 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamischer Hintergrund
  const getBackgroundClass = (condition?: string) => {
    switch (condition) {
      case 'sunny': return 'bg-sunny';
      case 'rainy': return 'bg-rainy';
      case 'cloudy': return 'bg-cloudy';
      case 'snowy': return 'bg-clear';
      default: return 'bg-sunny';
    }
  };

  // Wetterdaten holen
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location.lat || !location.lon) return;

      try {
        setLoading(true);
        setError(null);

        const [weather, hourly, air] = await Promise.all([
          weatherService.getCurrentWeather(location.lat, location.lon),
          weatherService.getHourlyForecast(location.lat, location.lon),
          weatherService.getAirQuality(location.lat, location.lon)
        ]);

        setCurrentWeather(weather);
        setHourlyData(hourly);
        setAirQuality(air);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location.lat, location.lon]);

  // Auf Standortwechsel aus Sidebar reagieren UND im localStorage merken
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
        <div className="container mx-auto p-6 space-y-6">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-48 w-full mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="min-h-screen bg-sunny flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Weather Data Unavailable</h2>
          <p className="text-white/80">{error || 'Unable to load weather information'}</p>
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
    <div className={`min-h-screen ${getBackgroundClass(currentWeather.condition)}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Current Weather */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Today's Weather</h1>
          <p className="text-white/80">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            })}
          </p>
        </div>

        {/* Main Weather Card */}
        <WeatherCard
          {...currentWeather}
          className="mb-6"
          lat={location.lat}
          lon={location.lon}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Forecast: nimmt 2/3, immer volle Höhe */}
          <div className="lg:col-span-2 h-full flex">
            <div className="w-full h-full flex flex-col">
              <HourlyForecast forecast={hourlyData} className="h-full" />
            </div>
          </div>
          {/* SunTimes: nimmt 1/3, immer volle Höhe */}
          <div className="h-full flex">
            <div className="w-full h-full flex flex-col">
              <SunriseSunset
                sunrise={currentWeather.sunrise || "06:47 AM"}
                sunset={currentWeather.sunset || "07:56 PM"}
                className="h-full"
              />
            </div>
          </div>
        </div>



        {/* Additional Weather Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-2">Air Quality</h3>
            <div className={`text-2xl font-bold ${
              airQuality.aqi <= 2 ? 'text-green-500' :
              airQuality.aqi <= 3 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {airQuality.quality}
            </div>
            <div className="text-sm text-muted-foreground">AQI: {airQuality.aqi}</div>
          </div>

          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-2">Visibility</h3>
            <div className="text-2xl font-bold">{currentWeather.visibility || 10} km</div>
            <div className="text-sm text-muted-foreground">
              {(currentWeather.visibility || 10) >= 10 ? 'Clear view' : 'Limited visibility'}
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-2">Pressure</h3>
            <div className="text-2xl font-bold">{currentWeather.pressure || 1013} hPa</div>
            <div className="text-sm text-muted-foreground">
              {(currentWeather.pressure || 1013) > 1013 ? 'High' : 'Normal'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
