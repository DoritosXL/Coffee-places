import React, { useState, useEffect } from 'react';

interface ShufflingHeaderProps {}

export const ShufflingHeader: React.FC<ShufflingHeaderProps> = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Shuffle numbers (0-9) quickly
    const interval = setInterval(() => {
      setCount(Math.floor(Math.random() * 10)); // 0-9
    }, 100); // Change every 100ms for a rapid shuffle effect

    return () => clearInterval(interval);
  }, []);

  return (
    <h2 className="text-3xl font-bold text-gray-800 animate-pulse">
      <span className="inline-block">Found{' '}</span>
      <span className="inline-block tabular-nums">
        {count}
      </span>
      <span className="inline-block">{' '}coffee {count === 1 ? 'place' : 'places'}</span>
    </h2>
  );
};
