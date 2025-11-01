import React, { useState, useEffect } from 'react';

interface CoffeeLoaderProps {
  message?: string;
}

export const CoffeeLoader: React.FC<CoffeeLoaderProps> = ({
  message = 'Brewing your results...',
}) => {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Fallback to simple spinner if animations don't load after 10 seconds
    const fallbackTimer = setTimeout(() => {
      setUseFallback(true);
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  if (useFallback) {
    // Simple fallback spinner
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Coffee Cup Animation */}
      <div className="relative w-24 h-24">
        {/* Coffee Cup */}
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="relative">
            {/* Cup body */}
            <div className="w-16 h-20 bg-gradient-to-b from-orange-100 to-orange-200 rounded-b-lg border-4 border-orange-400 relative overflow-hidden">
              {/* Coffee liquid with wave animation */}
              <div className="absolute bottom-0 w-full h-14 bg-gradient-to-b from-amber-700 to-amber-900 animate-[wave_2s_ease-in-out_infinite]"></div>
            </div>
            {/* Cup handle */}
            <div className="absolute right-[-12px] top-4 w-8 h-10 border-4 border-orange-400 rounded-r-full border-l-0"></div>
          </div>
        </div>

        {/* Steam animation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-8 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-[steam_2s_ease-in-out_infinite] opacity-60"></div>
          <div className="w-1 h-8 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-[steam_2s_ease-in-out_infinite_0.5s] opacity-60"></div>
          <div className="w-1 h-8 bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-[steam_2s_ease-in-out_infinite_1s] opacity-60"></div>
        </div>

        {/* Rotating coffee beans */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-800 rounded-full transform -translate-y-2"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-800 rounded-full transform translate-y-2"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-4 bg-amber-800 rounded-full transform -translate-x-2"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-4 bg-amber-800 rounded-full transform translate-x-2"></div>
        </div>
      </div>

      {/* Loading message */}
      <p className="mt-8 text-gray-600 animate-pulse">{message}</p>

      {/* Loading dots */}
      <div className="flex gap-2 mt-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      <style>{`
        @keyframes steam {
          0%, 100% {
            transform: translateY(0) translateX(0) scaleX(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(4px) scaleX(1.2);
            opacity: 0.6;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};
