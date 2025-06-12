import React from "react";
import { Link } from "react-router-dom"; // <-- NEU
import styles from "./Header.module.css";

const Header: React.FC = () => (
  <header className={styles.header}>
    <Link to="/" className={styles.logo}>Breeze</Link>
    <input
      className={styles.search}
      placeholder="Search for your preferred city..."
      type="text"
    />
    {/* Später Theme/Lang Switcher */}
  </header>
);

export default Header;
