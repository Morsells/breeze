import React from 'react';
import styles from './HourlyForecast.module.css';

const getWeatherIcon = (icon: string) => ({ 'sunny': '☀️', 'partly-cloudy': '🌤️', 'cloudy': '☁️', 'sunrise': '🌅' }[icon] || '❔');

type HourlyData = { time: string; icon: string; temp: number; };
type Props = { fullDate: string; hourlyData: HourlyData[]; };

const HourlyForecast: React.FC<Props> = ({ fullDate, hourlyData }) => (
    <div className={styles.container}>
        <h2 className={styles.dateHeader}>{fullDate}</h2>
        <div className={styles.scroller}>
            {hourlyData.map((hour) => (
                <div key={hour.time} className={styles.hourItem}>
                    <div>{hour.time}</div>
                    <div className={styles.icon}>{getWeatherIcon(hour.icon)}</div>
                    <div className={styles.temp}>{hour.temp}°C</div>
                </div>
            ))}
        </div>
    </div>
);
export default HourlyForecast;