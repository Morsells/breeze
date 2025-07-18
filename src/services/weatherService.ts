
import { CurrentWeather, WeatherForecast, AirQuality, GeocodingResult, AppWeatherData, HourlyForecastItem } from '@/types/weather';

const API_KEY = '662f9e367e0eed1c1a0ba5e40a5fc2b4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

class WeatherService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  private mapWeatherCondition(weatherMain: string, weatherId: number): "sunny" | "cloudy" | "rainy" | "snowy" {
    if (weatherMain.toLowerCase().includes('rain') || weatherId >= 200 && weatherId < 600) {
      return 'rainy';
    }
    if (weatherMain.toLowerCase().includes('snow') || weatherId >= 600 && weatherId < 700) {
      return 'snowy';
    }
    if (weatherMain.toLowerCase().includes('cloud') || weatherId >= 800 && weatherId < 900) {
      return weatherId === 800 ? 'sunny' : 'cloudy';
    }
    return 'sunny';
  }

  private formatTime(timestamp: number, timezone: number = 0): string {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  }

  private getAirQualityText(aqi: number): string {
    const levels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return levels[aqi - 1] || 'Unknown';
  }

  async getCurrentWeather(lat: number, lon: number): Promise<AppWeatherData> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const cacheKey = `current_${lat}_${lon}`;
    
    const data: CurrentWeather = await this.fetchWithCache(url, cacheKey);
    
    return {
      temperature: Math.round(data.main.temp),
      condition: this.mapWeatherCondition(data.weather[0].main, data.weather[0].id),
      location: data.name,
      description: `Feels like ${Math.round(data.main.feels_like)}°C`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      uvIndex: 0, // UV Index requires separate API call
      sunrise: this.formatTime(data.sys.sunrise, data.timezone),
      sunset: this.formatTime(data.sys.sunset, data.timezone),
      visibility: Math.round(data.visibility / 1000), // Convert to km
      pressure: data.main.pressure,
    };
  }

  async getCurrentWeatherByCity(cityName: string): Promise<AppWeatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
    const cacheKey = `current_city_${cityName.toLowerCase()}`;
    
    const data: CurrentWeather = await this.fetchWithCache(url, cacheKey);
    
    return {
      temperature: Math.round(data.main.temp),
      condition: this.mapWeatherCondition(data.weather[0].main, data.weather[0].id),
      location: data.name,
      description: `Feels like ${Math.round(data.main.feels_like)}°C`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      uvIndex: 0,
      sunrise: this.formatTime(data.sys.sunrise, data.timezone),
      sunset: this.formatTime(data.sys.sunset, data.timezone),
      visibility: Math.round(data.visibility / 1000),
      pressure: data.main.pressure,
    };
  }

  async getHourlyForecast(lat: number, lon: number): Promise<HourlyForecastItem[]> {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const cacheKey = `hourly_${lat}_${lon}`;
    
    const data: WeatherForecast = await this.fetchWithCache(url, cacheKey);
    
    return data.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      temperature: Math.round(item.main.temp),
      condition: this.mapWeatherCondition(item.weather[0].main, item.weather[0].id),
      precipitation: Math.round(item.pop * 100),
    }));
  }

  async get5DayForecast(lat: number, lon: number) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const cacheKey = `forecast_${lat}_${lon}`;
    
    const data: WeatherForecast = await this.fetchWithCache(url, cacheKey);
    
    const dailyForecasts = new Map();
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: this.mapWeatherCondition(item.weather[0].main, item.weather[0].id),
          description: item.weather[0].description,
          airQuality: 'Good', // Would need separate API call
        });
      } else {
        const existing = dailyForecasts.get(dateKey);
        existing.high = Math.max(existing.high, Math.round(item.main.temp_max));
        existing.low = Math.min(existing.low, Math.round(item.main.temp_min));
      }
    });
    
    return Array.from(dailyForecasts.values()).slice(0, 5);
  }

  async getAirQuality(lat: number, lon: number): Promise<{ quality: string; aqi: number }> {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const cacheKey = `air_${lat}_${lon}`;
    
    try {
      const data: AirQuality = await this.fetchWithCache(url, cacheKey);
      const aqi = data.list[0].main.aqi;
      return {
        quality: this.getAirQualityText(aqi),
        aqi
      };
    } catch (error) {
      console.error('Air quality fetch error:', error);
      return { quality: 'Good', aqi: 1 };
    }
  }

  async searchCities(query: string): Promise<GeocodingResult[]> {
    if (query.length < 2) return [];
    
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const cacheKey = `search_${query.toLowerCase()}`;
    
    try {
      return await this.fetchWithCache(url, cacheKey);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to Würzburg coordinates as fallback
          resolve({ lat: 49.7913, lon: 9.9534 });
        }
      );
    });
  }
}

export const weatherService = new WeatherService();
