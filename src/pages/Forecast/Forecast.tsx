import React, { useState } from 'react';
import styles from './Forecast.module.css';
import DailySummaryCard from '../../components/DailySummaryCard/DailySummaryCard';
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast';

const mockForecastData = [
  {
    dayName: 'Saturday', fullDate: 'Saturday, 31 August 2025', maxTemp: 28, airQuality: 'Good', airQualityDesc: '', icon: 'sunny',
    hourly: [
      { time: '7:00 Uhr', icon: 'cloudy', temp: 6 },
      { time: '8:00 Uhr', icon: 'partly-cloudy', temp: 10 }, { time: '9:00 Uhr', icon: 'sunny', temp: 13 },
      { time: '10:00 Uhr', icon: 'sunny', temp: 15 }, { time: '11:00 Uhr', icon: 'sunny', temp: 20 },
      { time: '12:00 Uhr', icon: 'sunny', temp: 25 }, { time: '13:00 Uhr', icon: 'sunny', temp: 28 },
      { time: '14:00 Uhr', icon: 'sunny', temp: 28 },
    ]
  },
  { dayName: 'Sunday', maxTemp: 27, airQuality: 'Moderate', airQualityDesc: '', icon: 'sunny', hourly: [/* ...Stundendaten für Sonntag... */] },
  { dayName: 'Monday', maxTemp: 27, airQuality: 'Unhealthy', airQualityDesc: '(Sensitive)', icon: 'partly-cloudy', hourly: [/* ...Stundendaten für Montag... */] },
  { dayName: 'Tuesday', maxTemp: 25, airQuality: 'Unhealthy', airQualityDesc: '(Sensitive)', icon: 'partly-cloudy', hourly: [/* ...Stundendaten für Dienstag... */] },
  { dayName: 'Wednesday', maxTemp: 26, airQuality: 'Good', airQualityDesc: '', icon: 'sunny', hourly: [/* ...Stundendaten für Mittwoch... */] },
];

const Forecast: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = mockForecastData[selectedDayIndex];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.forecastWrapper}>
        <h1 className={styles.mainTitle}>5-day forecast</h1>

        {/* Die obere Stunden-Vorschau */}
        <HourlyForecast
          fullDate={selectedDay.fullDate || selectedDay.dayName}
          hourlyData={selectedDay.hourly}
        />

        {/* Die untere 5-Tages-Übersicht */}
        <div className={styles.dailySummaryContainer}>
          {mockForecastData.map((day, index) => (
            <DailySummaryCard
              key={day.dayName}
              dayName={day.dayName}
              icon={day.icon}
              temp={day.maxTemp}
              airQuality={day.airQuality}
              airQualityDesc={day.airQualityDesc}
              isSelected={index === selectedDayIndex}
              onClick={() => setSelectedDayIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Forecast;