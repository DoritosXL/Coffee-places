import React from 'react';
import { SearchBar } from './SearchBar';

interface HomeViewProps {
  availableCities: string[];
  availableTags: string[];
  onSearch: (query: string, type: 'city' | 'tag' | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  availableCities,
  availableTags,
  onSearch,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col items-center justify-center px-4">
      {/* Main Content - Centered like Claude/Gemini */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-1">
        {/* Coffee Icon/Logo */}
        <div className="mb-8 animate-[float_3s_ease-in-out_infinite]">
          <div className="relative">
            {/* Coffee cup icon */}
            <svg
              className="w-24 h-24 text-orange-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2s-.9 2-2 2zm-2 2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-2zm-5.5-4c0-.28.22-.5.5-.5s.5.22.5.5V8h1V6c0-.28.22-.5.5-.5s.5.22.5.5v2h1V6c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5V6z" />
            </svg>
            {/* Decorative steam */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-60">
              <div className="w-1 h-6 bg-gradient-to-t from-orange-400 to-transparent rounded-full animate-[steam_2s_ease-in-out_infinite]"></div>
              <div className="w-1 h-6 bg-gradient-to-t from-orange-400 to-transparent rounded-full animate-[steam_2s_ease-in-out_infinite_0.5s]"></div>
              <div className="w-1 h-6 bg-gradient-to-t from-orange-400 to-transparent rounded-full animate-[steam_2s_ease-in-out_infinite_1s]"></div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-3 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Coffee Places Finder
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg md:text-xl mb-12 text-center max-w-2xl">
          Discover the perfect coffee spot near you. Search by city or amenities like wifi.
        </p>

        {/* Search Bar - Centered and prominent */}
        <div className="w-full max-w-2xl">
          <SearchBar
            availableCities={availableCities}
            availableTags={availableTags}
            onSearch={onSearch}
            placeholder="Search for a city or amenity (e.g., 'Amsterdam' or 'wifi')..."
            className="shadow-2xl"
          />
        </div>

        {/* Quick suggestions */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <span className="text-sm text-gray-500">Try:</span>
          {availableCities.slice(0, 3).map((city) => (
            <button
              key={city}
              onClick={() => onSearch(city, 'city')}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {city}
            </button>
          ))}
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSearch(tag, 'tag')}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-6 text-center">
        <a
          href="https://nara-vf9k.vercel.app/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
        >
          API Documentation
        </a>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes steam {
          0%, 100% {
            transform: translateY(0) translateX(0) scaleX(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-15px) translateX(3px) scaleX(1.2);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};
