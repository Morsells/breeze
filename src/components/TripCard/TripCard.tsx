import React from 'react';
import styles from './TripCard.module.css';

// Ein einfacher Weg, Wetter-Icons darzustellen
const getWeatherIcon = (icon: string) => {
    switch (icon) {
        case 'partly-cloudy': return '🌤️';
        case 'sunny': return '☀️';
        case 'rainy': return '🌧️';
        default: return '❔';
    }
};

type Forecast = {
    date: string;
    icon: string;
    temp: number;
};

type Props = {
    city: string;
    country: string;
    tripDate: string;
    imageUrl: string;
    forecast: Forecast[];
    tips: string;
};

const TripCard: React.FC<Props> = (props) => {
    return (
        <div className={styles.card}>
            <img src={props.imageUrl} alt={`View of ${props.city}`} className={styles.tripImage} />

            <div className={styles.cardContent}>
                <div className={styles.location}>
                    <span className={styles.pinIcon}>📍</span>
                    {props.city}, {props.country}
                </div>
                <div className={styles.tripDate}>Trip Date: {props.tripDate}</div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>EXPECTED WEATHER</h3>
                    <div className={styles.forecast}>
                        {props.forecast.map((day) => (
                            <div key={day.date} className={styles.forecastDay}>
                                <div>{day.date}</div>
                                <div className={styles.weatherIcon}>{getWeatherIcon(day.icon)}</div>
                                <div>{day.temp}°C</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>TIPS</h3>
                    <p className={styles.tipsText}>{props.tips}</p>
                </div>

                <div className={styles.buttonGroup}>
                    <button className={styles.detailsButton}>Details</button>
                    <button className={styles.alertsButton}>Alerts ⚠️</button>
                </div>
            </div>
        </div>
    );
};

export default TripCard;