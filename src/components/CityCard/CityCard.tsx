import React from "react";
import styles from "./CityCard.module.css";

type Props = {
  city: string;
  time: string;
  date: string;
};

const CityCard: React.FC<Props> = ({ city, time, date }) => (
  <div className={styles.card}>
    <div className={styles.city}>{city}</div>
    <div className={styles.time}>{time}</div>
    <div className={styles.date}>{date}</div>
  </div>
);

export default CityCard;
