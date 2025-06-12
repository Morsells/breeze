// src/pages/Home/Home.tsx
import React from "react";
import styles from "./Home.module.css";
import CityCard from "../../components/CityCard/CityCard";
import WeatherDetailsCard from "../../components/WeatherDetailsCard/WeatherDetailsCard";

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
  </div>
);

export default Home;
