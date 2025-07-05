import React from 'react';
import styles from './TravelPlanner.module.css';
import TripCard from '../../components/TripCard/TripCard';

import parisImage from '../../assets/images/paris.jpg';
import lyonImage from '../../assets/images/lyon.jpg';

const mockTrips = [
  {
    id: 1,
    city: 'Paris',
    country: 'France',
    tripDate: 'May 30, 2025',
    imageUrl: parisImage,
    forecast: [
      { date: '30.05', icon: 'partly-cloudy', temp: 16 },
      { date: '31.05', icon: 'partly-cloudy', temp: 19 },
      { date: '01.06', icon: 'sunny', temp: 10 },
      { date: '02.06', icon: 'sunny', temp: 22 },
    ],
    tips: 'Make sure you take a light jacket and an umbrella with you',
  },
  {
    id: 2,
    city: 'Lyon',
    country: 'France',
    tripDate: 'June 03, 2025',
    imageUrl: lyonImage,
    forecast: [
      { date: '03.06', icon: 'partly-cloudy', temp: 17 },
      { date: '04.06', icon: 'sunny', temp: 22 },
      { date: '05.06', icon: 'sunny', temp: 24 },
      { date: '06.06', icon: 'sunny', temp: 25 },
    ],
    tips: 'Pack an umbrella and sunglasses to be prepared for changing conditions.',
  },
];

const TravelPlanner: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.plannerScroller}>
        {/* Rendert für jede Reise eine TripCard */}
        {mockTrips.map((trip) => (
          <TripCard
            key={trip.id}
            city={trip.city}
            country={trip.country}
            tripDate={trip.tripDate}
            imageUrl={trip.imageUrl}
            forecast={trip.forecast}
            tips={trip.tips}
          />
        ))}

        {/* Die "Plus"-Karte zum Hinzufügen einer neuen Reise */}
        <button className={styles.addCard} aria-label="Add new trip">
          <div className={styles.plusIcon}>+</div>
        </button>
      </div>
    </div>
  );
};

export default TravelPlanner;