// src/pages/Home/Home.tsx
import React from "react";
import styles from "./Home.module.css";
import CityCard from "../../components/CityCard/CityCard";
import WeatherDetailsCard from "../../components/WeatherDetailsCard/WeatherDetailsCard";
import HourlyForecastCard from "../../components/HourlyForecastCard/HourlyForecastCard";

const hours = [
  { time: "12:00", iconUrl: "https://openweathermap.org/img/wn/01d.png", temp: 24 },
  { time: "13:00", iconUrl: "https://openweathermap.org/img/wn/01d.png", temp: 27 },
  { time: "14:00", iconUrl: "https://openweathermap.org/img/wn/03d.png", temp: 27 },
  { time: "15:00", iconUrl: "https://openweathermap.org/img/wn/03d.png", temp: 25 },
  { time: "16:00", iconUrl: "https://openweathermap.org/img/wn/01d.png", temp: 22 },
  { time: "17:00", iconUrl: "https://openweathermap.org/img/wn/01d.png", temp: 22 },
  { time: "18:00", iconUrl: "https://openweathermap.org/img/wn/01d.png", temp: 22 },
];

const Home: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.mainRow}>
      <CityCard
        city="Würzburg"
        time="12:00"
        date="Saturday, 31 Aug"
      />
      <WeatherDetailsCard
        temp={24}
        feelsLike={22}
        weather="Sunny"
        iconUrl="https://openweathermap.org/img/wn/01d.png"
        humidity={41}
        wind={12}
        uv={8}
        sunrise="06:37"
        sunset="20:37"
      />
    </div>
    <HourlyForecastCard hours={hours} />
  </div>
);

export default Home;
