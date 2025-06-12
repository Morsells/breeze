import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => (
  <nav className={styles.sidebar}>
    <NavLink to="/favorites" className={styles.link}>Saved Cities</NavLink>
    <NavLink to="/forecast" className={styles.link}>5-day Forecast</NavLink>
    <NavLink to="/travel-planner" className={styles.link}>Travel Planner</NavLink>
    <NavLink to="/weather-map" className={styles.link}>Weather Map</NavLink>
  </nav>
);

export default Sidebar;
