import React from "react";
import styles from "./Header.module.css";

const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.logo}>Breeze</div>
    <input
      className={styles.search}
      placeholder="Search for your preferred city..."
      type="text"
    />
    {/* Später Theme/Lang Switcher */}
  </header>
);

export default Header;
