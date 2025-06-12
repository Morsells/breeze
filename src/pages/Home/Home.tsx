// src/pages/Home/Home.tsx
import React from "react";
import styles from "./Home.module.css";
import CityCard from "../../components/CityCard/CityCard";
import WeatherDetailsCard from "../../components/WeatherDetailsCard/WeatherDetailsCard";

const Home: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.headerRow}>
      <div className={styles.logo}>Breeze</div>
      <input className={styles.search} placeholder="Search for your preferred city..." />
      <div className={styles.topControls}>
        {/* Hier kommen später ThemeSwitch etc. rein */}
        <span>🌞</span>
      </div>
    </div>
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
