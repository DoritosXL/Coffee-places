import React, { useState, useEffect } from 'react';
import { coffeePlacesApi } from '../services/api';
import { fallbackCoffeePlaces } from '../data/fallbackData';
import type { CoffeePlace } from '../types/coffeePlace';

interface SkeletonLoaderProps {}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = () => {
  const [count, setCount] = useState(0);
  const [cafeName, setCafeName] = useState('');
  const [cityName, setCityName] = useState('');
  const [hours, setHours] = useState('');
  const [ratingValue, setRatingValue] = useState(4.5);
  const [dataPool, setDataPool] = useState<CoffeePlace[]>(fallbackCoffeePlaces);

  useEffect(() => {
    // Try to fetch all data first
    const fetchAllData = async () => {
      try {
        const allData = await coffeePlacesApi.search({});
        if (allData && allData.length > 0) {
          setDataPool(allData);
        }
      } catch (error) {
        console.log('Using fallback data for skeleton loader');
        // Already set to fallbackCoffeePlaces by default
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (dataPool.length === 0) return;

    // Initialize all content immediately (before first interval)
    const initialPlace = dataPool[Math.floor(Math.random() * dataPool.length)];
    setCafeName(initialPlace.name);
    setCityName(initialPlace.city || 'Unknown');
    if (initialPlace.openHours) {
      setHours(`${initialPlace.openHours.start} - ${initialPlace.openHours.end}`);
    } else {
      setHours('Hours not available');
    }
    setRatingValue(parseFloat(initialPlace.rating.toFixed(1)));

    // Initialize count immediately
    setCount(Math.floor(Math.random() * 8) + 2); // Numbers between 2 and 9

    // Separate intervals for different update speeds
    const contentInterval = 200; // Content updates every 200ms
    const numbersInterval = 50; // Numbers update every 50ms (twice as fast)

    // Interval for shuffling content (names, cities, hours, ratings, tags)
    const contentIntervalId = setInterval(() => {
      const randomPlace = dataPool[Math.floor(Math.random() * dataPool.length)];

      setCafeName(randomPlace.name);
      setCityName(randomPlace.city || 'Unknown');
      if (randomPlace.openHours) {
        setHours(`${randomPlace.openHours.start} - ${randomPlace.openHours.end}`);
      } else {
        setHours('Hours not available');
      }
      setRatingValue(parseFloat(randomPlace.rating.toFixed(1)));
    }, contentInterval);

    // Interval for shuffling numbers (faster)
    const numbersIntervalId = setInterval(() => {
      setCount(Math.floor(Math.random() * 8) + 2); // Numbers between 2 and 9
    }, numbersInterval);

    return () => {
      clearInterval(contentIntervalId);
      clearInterval(numbersIntervalId);
    };
  }, [dataPool]);

  return (
    <>
      {/* Shuffling header */}
      <div className="mb-6" style={{ minHeight: '5rem' }}>
        <h2 className="text-3xl font-bold text-gray-800 animate-pulse">
          Found <span className="inline-block tabular-nums">{count}</span> coffee {count === 1 ? 'place' : 'places'}
        </h2>
        <p className="text-gray-600 mt-2" style={{ minHeight: '1.5rem' }}>{'\u00A0'}</p>
      </div>

      {/* Single skeleton card with dynamic shuffling text */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with title and rating */}
        <div className="flex justify-between items-start mb-3">
          {/* Title - shuffling cafe names */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-400 animate-pulse">{cafeName}</h3>
          </div>
          {/* Rating - shuffling values */}
          <div className="ml-4 flex items-center bg-orange-100 px-3 py-1 rounded-full animate-pulse">
            <svg
              className="w-5 h-5 text-orange-300 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold text-orange-400 tabular-nums">{ratingValue}</span>
          </div>
        </div>

        {/* Details section with shuffling text */}
        <div className="space-y-2 text-gray-400">
          {/* City - shuffling city names */}
          <div className="flex items-center animate-pulse">
            <svg
              className="w-5 h-5 mr-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{cityName}</span>
          </div>

          {/* Hours - shuffling hours */}
          <div className="flex items-center animate-pulse">
            <svg
              className="w-5 h-5 mr-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Open: {hours}</span>
          </div>
        </div>
      </div>
    </>
  );
};
