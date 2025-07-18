
import { useState, useEffect } from 'react';
import { weatherService } from '@/services/weatherService';

interface LocationState {
  lat: number;
  lon: number;
  city: string;
  loading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: 49.7913, // Default to Würzburg
    lon: 9.9534,
    city: 'Würzburg',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const coords = await weatherService.getCurrentLocation();
        const weatherData = await weatherService.getCurrentWeather(coords.lat, coords.lon);
        
        setLocation({
          lat: coords.lat,
          lon: coords.lon,
          city: weatherData.location,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Location initialization error:', error);
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Unable to get your location',
        }));
      }
    };

    initializeLocation();
  }, []);

  const updateLocation = async (lat: number, lon: number) => {
    setLocation(prev => ({ ...prev, loading: true }));
    
    try {
      const weatherData = await weatherService.getCurrentWeather(lat, lon);
      setLocation({
        lat,
        lon,
        city: weatherData.location,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Location update error:', error);
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to update location',
      }));
    }
  };

  return {
    ...location,
    updateLocation,
  };
};
