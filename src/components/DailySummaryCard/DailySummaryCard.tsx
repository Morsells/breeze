import React from 'react';
import styles from './DailySummaryCard.module.css';

const getWeatherIcon = (icon: string) => ({ 'sunny': '☀️', 'partly-cloudy': '🌤️' }[icon] || '❔');
const getAirIcon = () => '🍃';

type Props = {
    dayName: string;
    icon: string;
    temp: number;
    airQuality: string;
    airQualityDesc: string;
    isSelected: boolean;
    onClick: () => void;
};

const DailySummaryCard: React.FC<Props> = (props) => {
    const cardClasses = `${styles.card} ${props.isSelected ? styles.activeCard : ''}`;

    return (
        <button className={cardClasses} onClick={props.onClick}>
            <div className={styles.dayName}>{props.dayName}</div>
            <div className={styles.weatherIcon}>{getWeatherIcon(props.icon)}</div>
            <div className={styles.temp}>{props.temp}°C</div>
            <div className={styles.airIcon}>{getAirIcon()}</div>
            <div className={styles.airQuality}>{props.airQuality}</div>
            {props.airQualityDesc && (
                <div className={styles.airQualityDesc}>({props.airQualityDesc})</div>
            )}
        </button>
    );
};

export default DailySummaryCard;