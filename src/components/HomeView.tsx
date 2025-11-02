import React, { useMemo } from 'react';
import { SearchBar } from './SearchBar';
import type { CityInfo } from '../types/coffeePlace';

interface HomeViewProps {
  availableCities: CityInfo[];
  availableTags: string[];
  onSearch: (query: string, type: 'city' | 'tag' | null) => void;
}

// Helper function to shuffle array and get random subset
const getRandomTags = (tags: string[], count: number): string[] => {
  if (tags.length <= count) return [...tags];
  
  // Fisher-Yates shuffle
  const shuffled = [...tags];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
};

export const HomeView: React.FC<HomeViewProps> = ({
  availableCities,
  availableTags,
  onSearch,
}) => {
  // Get random subset of tags to display (currently random, will be popularity-based in future)
  // Only show tags once they're loaded (empty array initially)
  const displayedTags = useMemo(() => {
    if (availableTags.length === 0) return [];
    return getRandomTags(availableTags, 3); // Show 3 random tags
  }, [availableTags]);
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

        {/* Quick suggestions - Fixed height container to prevent jumping */}
        <div className="mt-10 w-full">
          <div className="flex flex-col items-center gap-6 min-h-[120px]">
            {/* Cities section */}
            {availableCities.length > 0 && (
              <div className="flex flex-col items-center gap-3 animate-fadeIn">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Popular Cities
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableCities.slice(0, 3).map((city, index) => (
                    <button
                      key={city.name}
                      onClick={() => onSearch(city.name, 'city')}
                      className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {city.displayName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags section - with reserved space */}
            <div className="flex flex-col items-center gap-3 w-full">
              {displayedTags.length > 0 ? (
                <>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Popular Tags
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {displayedTags.map((tag, index) => (
                      <button
                        key={tag}
                        onClick={() => onSearch(tag, 'tag')}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full text-sm font-medium text-orange-700 hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 animate-fadeIn"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                // Placeholder skeleton to reserve space while loading - visible but subtle
                <div className="flex flex-col items-center gap-3 w-full">
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Popular Tags
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="px-5 py-2.5 bg-gray-50/50 border border-gray-100 rounded-full text-sm animate-pulse"
                      >
                        <span className="text-transparent">Loading</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
