import React from "react";
import styles from "./HourlyForecastCard.module.css";

type Hour = {
  time: string;
  iconUrl: string;
  temp: number;
};

type Props = {
  hours: Hour[];
};

const HourlyForecastCard: React.FC<Props> = ({ hours }) => (
  <div className={styles.card}>
    <div className={styles.header}>24-hour forecast</div>
    <div className={styles.hourRow}>
      {hours.map((h, i) => (
        <div className={styles.hourBox} key={i}>
          <div className={styles.time}>{h.time}</div>
          <img src={h.iconUrl} alt="" className={styles.icon} />
          <div className={styles.temp}>{h.temp}°C</div>
        </div>
      ))}
    </div>
  </div>
);

export default HourlyForecastCard;
