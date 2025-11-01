import React from 'react';
import type { CoffeePlace } from '../types/coffeePlace';
import { SkeletonLoader } from './SkeletonLoader';

interface ResultsDisplayProps {
  results: CoffeePlace[] | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  searchQuery?: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  isLoading,
  error,
  onBack,
  searchQuery,
}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-8">
      <div className="max-w-6xl w-full mx-auto">
        {/* Back button at top-left - always visible */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to search</span>
        </button>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Go back and try again
            </button>
          </div>
        )}

        {!error && results && results.length === 0 && (
          <div className="p-12 bg-white border border-gray-200 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No coffee places found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or explore different cities</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
            >
              Try a new search
            </button>
          </div>
        )}

        {/* Loading state with skeleton */}
        {isLoading && <SkeletonLoader />}

        {!error && !isLoading && results && results.length > 0 && (
          <>
            <div className="mb-6" style={{ minHeight: '5rem' }}>
              <h2 className="text-3xl font-bold text-gray-800">
                Found {results.length} coffee {results.length === 1 ? 'place' : 'places'}
              </h2>
              <p className="text-gray-600 mt-2" style={{ minHeight: '1.5rem' }}>
                {searchQuery ? `Showing results for "${searchQuery}"` : '\u00A0'}
              </p>
            </div>
            <div className="space-y-4">
              {results.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{place.name}</h3>
              <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                <svg
                  className="w-5 h-5 text-orange-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-orange-700">{place.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
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
                <span>{place.city}</span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
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
                <span>
                  Open: {place.openHours.start} - {place.openHours.end}
                </span>
              </div>

              {place.tags.length > 0 && (
                <div className="flex items-start mt-3">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

                  {/* Raw JSON - for development purposes */}
                  <details className="mt-4">
                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                      View raw JSON
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-x-auto">
                      {JSON.stringify(place, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
