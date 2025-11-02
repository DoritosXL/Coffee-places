import React, { useState, useMemo } from 'react';
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
  const [sortOrder, setSortOrder] = useState<'high-low' | 'low-high' | 'default'>('high-low');

  // Sort results by rating
  const sortedResults = useMemo(() => {
    if (!results) return null;

    const sorted = [...results];
    
    if (sortOrder === 'high-low') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'low-high') {
      sorted.sort((a, b) => a.rating - b.rating);
    }
    // If 'default', keep original order (don't sort)

    return sorted;
  }, [results, sortOrder]);

  const handleSortChange = () => {
    if (sortOrder === 'high-low') {
      setSortOrder('low-high');
    } else if (sortOrder === 'low-high') {
      setSortOrder('default');
    } else {
      setSortOrder('high-low');
    }
  };

  const displayResults = sortedResults || results;

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

        {!error && !isLoading && displayResults && displayResults.length > 0 && (
          <>
            <div className="mb-6" style={{ minHeight: '5rem' }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Found {displayResults.length} coffee {displayResults.length === 1 ? 'place' : 'places'}
                </h2>
                <button
                  onClick={handleSortChange}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label={`Sort by rating: ${sortOrder === 'high-low' ? 'High to Low' : sortOrder === 'low-high' ? 'Low to High' : 'Default order'}`}
                >
                  {sortOrder === 'high-low' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : sortOrder === 'low-high' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  <span>
                    {sortOrder === 'high-low'
                      ? 'High to Low'
                      : sortOrder === 'low-high'
                      ? 'Low to High'
                      : 'Default'}
                  </span>
                </button>
              </div>
              <p className="text-gray-600 mt-2" style={{ minHeight: '1.5rem' }}>
                {searchQuery ? `Showing results for "${searchQuery}"` : '\u00A0'}
              </p>
            </div>
            <div className="space-y-4">
              {displayResults.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{place.name}</h3>
              <div
                className="flex items-center bg-orange-100 px-3 py-1 rounded-full cursor-help"
                title={`Rating: ${place.rating.toFixed(1)} out of 5 from Google Places`}
                aria-label={`Rating: ${place.rating.toFixed(1)} out of 5 from Google Places`}
              >
                <svg
                  className="w-5 h-5 text-orange-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-orange-700" aria-hidden="true">{place.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2 text-gray-600">
              {place.city && (
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
              )}

              {place.openHours && (
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
              )}

              {/* Full Address */}
              {place.address?.full && (
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>{place.address.full}</span>
                </div>
              )}

              {/* Phone */}
              {place.phone && (
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a href={`tel:${place.phone}`} className="text-orange-600 hover:text-orange-700 hover:underline">
                    {place.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {place.website && (
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}

              {/* Email */}
              {place.email && (
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a href={`mailto:${place.email}`} className="text-orange-600 hover:text-orange-700 hover:underline">
                    {place.email}
                  </a>
                </div>
              )}

              {/* Amenities as icons/badges */}
              {(place.hasWifi || place.hasOutdoorSeating || place.hasWheelchairAccess || place.hasTakeaway || place.hasDelivery) && (
                <div className="flex items-start mt-3 pt-3 border-t border-gray-200">
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <div className="flex flex-wrap gap-2">
                    {place.hasWifi && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1" title="WiFi available">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        WiFi
                      </span>
                    )}
                    {place.hasOutdoorSeating && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium" title="Outdoor seating available">
                        Outdoor Seating
                      </span>
                    )}
                    {place.hasWheelchairAccess && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium" title="Wheelchair accessible">
                        Wheelchair Access
                      </span>
                    )}
                    {place.hasTakeaway && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium" title="Takeaway available">
                        Takeaway
                      </span>
                    )}
                    {place.hasDelivery && (
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium" title="Delivery available">
                        Delivery
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
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

              {/* Verified badge */}
              {place.isVerified && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
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
