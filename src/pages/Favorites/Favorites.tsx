import React from 'react';
import styles from './Favorites.module.css';
import FavoriteCityCard from '../../components/FavoriteCityCard/FavoriteCityCard';

// Simulierter Datensatz, der dem Bild entspricht.
const mockFavorites = [
  { id: 1, name: 'Paris', temp: 12, icon: 'partly-cloudy-day' },
  { id: 2, name: 'Würzburg', temp: 10, icon: 'sunny' },
  { id: 3, name: 'Berlin', temp: 9, icon: 'sunny' },
  { id: 4, name: 'Stockholm', temp: 6, icon: 'rainy' },
  { id: 5, name: 'Barcelona', temp: 17, icon: 'sunny' },
];

const Favorites: React.FC = () => {
  const handleAddClick = () => {
    alert('Funktion zum Hinzufügen einer neuen Stadt!');
  };

  return (
    <div className={styles.favoritesContainer}>
      <h2 className={styles.title}>Today's weather in your favorite cities:</h2>
      <div className={styles.favoritesGrid}>
        {/* Erstellt für jeden Favoriten eine Wetter-Karte */}
        {mockFavorites.map((city) => (
          <FavoriteCityCard
            key={city.id}
            city={city.name}
            temp={city.temp}
            icon={city.icon}
          />
        ))}

        {/* Die Karte zum Hinzufügen eines neuen Favoriten */}
        <button className={styles.addCard} onClick={handleAddClick} aria-label="Add new city">
          <div className={styles.plusIcon}>+</div>
        </button>
      </div>
    </div>
  );
};

export default Favorites;