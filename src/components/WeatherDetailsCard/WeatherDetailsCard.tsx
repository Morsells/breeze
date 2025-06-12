import React from "react";
import styles from "./WeatherDetailsCard.module.css";

type Props = {
  temp: number;
  feelsLike: number;
  weather: string;
  iconUrl: string;
  humidity: number;
  wind: number;
  uv: number;
  sunrise: string;
  sunset: string;
};

const WeatherDetailsCard: React.FC<Props> = ({
  temp, feelsLike, weather, iconUrl, humidity, wind, uv, sunrise, sunset
}) => (
  <div className={styles.card}>
    <div className={styles.topRow}>
      <span className={styles.temp}>{temp}°C</span>
      <span className={styles.feelsLike}>Feels like: {feelsLike}°C</span>
      <img src={iconUrl} alt={weather} className={styles.weatherIcon} />
    </div>
    <div className={styles.middleRow}>
      <div className={styles.weather}>{weather}</div>
      <div className={styles.metrics}>
        <div>
          <span>Humidity</span>
          <span>{humidity}%</span>
        </div>
        <div>
          <span>Wind</span>
          <span>{wind} km/h</span>
        </div>
        <div>
          <span>UV</span>
          <span>{uv}</span>
        </div>
      </div>
    </div>
    <div className={styles.bottomRow}>
      <span>Sunrise: {sunrise}</span>
      <span>Sunset: {sunset}</span>
    </div>
  </div>
);

export default WeatherDetailsCard;
