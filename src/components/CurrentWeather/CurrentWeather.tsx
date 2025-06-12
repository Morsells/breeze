// src/components/CurrentWeather/CurrentWeather.tsx
import React from "react";
import styles from "./CurrentWeather.module.css";

type Props = {
  city: string;
  temp: number;
  feelsLike: number;
  weather: string;
  iconUrl: string;
  humidity: number;
  wind: number;
  sunrise: string;
  sunset: string;
  uv: number;
};

const CurrentWeather: React.FC<Props> = ({
  city, temp, feelsLike, weather, iconUrl, humidity, wind, sunrise, sunset, uv
}) => (
  <div className={styles.card}>
    <div className={styles.topRow}>
      <div>
        <h2>{city}</h2>
        <div className={styles.weatherType}>{weather}</div>
      </div>
      <img src={iconUrl} alt={weather} className={styles.weatherIcon} />
    </div>
    <div className={styles.tempRow}>
      <span className={styles.temp}>{temp}°C</span>
      <span className={styles.feelsLike}>Feels like: {feelsLike}°C</span>
    </div>
    <div className={styles.infoRow}>
      <span>Humidity: {humidity}%</span>
      <span>Wind: {wind} km/h</span>
      <span>UV: {uv}</span>
    </div>
    <div className={styles.sunRow}>
      <span>Sunrise: {sunrise}</span>
      <span>Sunset: {sunset}</span>
    </div>
  </div>
);

export default CurrentWeather;
