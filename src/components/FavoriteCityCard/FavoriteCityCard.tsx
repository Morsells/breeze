import React from 'react';
import styles from './FavoriteCityCard.module.css';

// Wir verwenden hier Emojis als einfache Wetter-Icons
const getWeatherIcon = (icon: string) => {
    switch (icon) {
        case 'partly-cloudy-day':
            return '🌤️';
        case 'sunny':
            return '☀️';
        case 'rainy':
            return '🌧️';
        default:
            return '❔';
    }
};

type Props = {
    city: string;
    temp: number;
    icon: string;
};

const FavoriteCityCard: React.FC<Props> = ({ city, temp, icon }) => {
    return (
        <div className={styles.card}>
            <div className={styles.city}>📍 {city}</div>
            <div className={styles.icon}>{getWeatherIcon(icon)}</div>
            <div className={styles.temp}>{temp}°C</div>
        </div>
    );
};

export default FavoriteCityCard;