import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { CityInfo, CoffeePlace } from '../types/coffeePlace';
import { coffeePlacesApi } from '../services/api';

interface SearchBarProps {
  availableCities: CityInfo[];
  availableTags: string[];
  onSearch: (query: string, type: 'city' | 'tag' | null) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  availableCities,
  availableTags,
  onSearch,
  placeholder = 'Search by city or wifi...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [suggestionType, setSuggestionType] = useState<'city' | 'tag' | 'place' | null>(null);
  const [placesData, setPlacesData] = useState<CoffeePlace[]>([]);
  const [ghostTextStyles, setGhostTextStyles] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch places once on mount for autocomplete suggestions
  useEffect(() => {
    const fetchPlacesForAutocomplete = async () => {
      try {
        // Fetch places without filters to get a broad set of data for autocomplete
        const places = await coffeePlacesApi.search({});
        setPlacesData(places);
      } catch (error) {
        console.error('Error fetching places for autocomplete:', error);
        setPlacesData([]);
      }
    };

    fetchPlacesForAutocomplete();
  }, []);


  // Extract autocomplete suggestions from places data
  const autocompleteSuggestions = useMemo(() => {
    const suggestions: {
      cities: Map<string, string>; // name -> displayName
      tags: Set<string>;
      placeNames: Set<string>;
    } = {
      cities: new Map(),
      tags: new Set(),
      placeNames: new Set(),
    };

    placesData.forEach((place) => {
      // Extract cities - prefer versions with spaces for better display
      if (place.city) {
        const cityName = place.city.toLowerCase().trim();
        const cityDisplayName = place.city.trim();
        // Only set if we don't have this city, or if the new one has spaces and the old one doesn't
        const existing = suggestions.cities.get(cityName);
        if (!existing || (cityDisplayName.includes(' ') && !existing.includes(' '))) {
          suggestions.cities.set(cityName, cityDisplayName);
        }
      }

      // Extract tags
      if (place.tags && Array.isArray(place.tags)) {
        place.tags.forEach((tag) => {
          suggestions.tags.add(tag.toLowerCase());
        });
      }

      // Extract place names
      if (place.name) {
        suggestions.placeNames.add(place.name);
      }
    });

    return suggestions;
  }, [placesData]);

  useEffect(() => {
    if (!inputValue) {
      setSuggestion('');
      setSuggestionType(null);
      return;
    }

    const lowerInput = inputValue.toLowerCase();

    // Check tags from places first
    const matchingTag = Array.from(autocompleteSuggestions.tags).find((tag) =>
      tag.startsWith(lowerInput)
    );

    if (matchingTag) {
      setSuggestion(matchingTag);
      setSuggestionType('tag');
      return;
    }

    // Check cities from places - match against both name and displayName
    // Prefer cities with spaces over those without
    const matchingCities = Array.from(autocompleteSuggestions.cities.entries()).filter(
      ([cityName, displayName]) => {
        // Normalize both for comparison (remove spaces for matching)
        const normalizedCityName = cityName.replace(/\s+/g, '');
        const normalizedDisplayName = displayName.toLowerCase().replace(/\s+/g, '');
        const normalizedInput = lowerInput.replace(/\s+/g, '');
        
        return normalizedCityName.startsWith(normalizedInput) || 
               normalizedDisplayName.startsWith(normalizedInput) ||
               cityName.startsWith(lowerInput) || 
               displayName.toLowerCase().startsWith(lowerInput);
      }
    );

    if (matchingCities.length > 0) {
      // Sort to prefer cities with spaces, then by length (shorter first)
      matchingCities.sort((a, b) => {
        const aHasSpace = a[1].includes(' ');
        const bHasSpace = b[1].includes(' ');
        if (aHasSpace && !bHasSpace) return -1;
        if (!aHasSpace && bHasSpace) return 1;
        // If both have or both don't have spaces, prefer shorter
        return a[1].length - b[1].length;
      });
      const [, displayName] = matchingCities[0];
      // Debug: verify suggestion has space for multi-word cities
      if (lowerInput === 'den' && displayName.includes('Haag')) {
        console.log('Setting suggestion:', { displayName, hasSpace: displayName.includes(' ') });
      }
      setSuggestion(displayName);
      setSuggestionType('city');
      return;
    }

    // Check place names
    const matchingPlaceName = Array.from(autocompleteSuggestions.placeNames).find((name) =>
      name.toLowerCase().startsWith(lowerInput)
    );

    if (matchingPlaceName) {
      setSuggestion(matchingPlaceName);
      setSuggestionType('place');
      return;
    }

    // Fallback to static lists if places data is not available yet
    const staticMatchingTag = availableTags.find((tag) =>
      tag.toLowerCase().startsWith(lowerInput)
    );

    if (staticMatchingTag) {
      setSuggestion(staticMatchingTag);
      setSuggestionType('tag');
      return;
    }

    const staticMatchingCity = availableCities.find((city) =>
      city.name.toLowerCase().startsWith(lowerInput) ||
      city.displayName.toLowerCase().startsWith(lowerInput)
    );

    if (staticMatchingCity) {
      setSuggestion(staticMatchingCity.displayName);
      setSuggestionType('city');
      return;
    }

    setSuggestion('');
    setSuggestionType(null);
  }, [inputValue, autocompleteSuggestions, availableCities, availableTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setInputValue(suggestion);
      setSuggestion('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setSuggestion('');
    }
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;

    // Determine if the input matches a tag, city, or place
    let finalValue = suggestion || inputValue;
    const finalType: 'city' | 'tag' | null = suggestionType === 'place' ? null : (suggestionType as 'city' | 'tag' | null);

    // If it's a city suggestion, find the matching city from places or static list
    if (finalType === 'city') {
      // First check places data
      const cityFromPlaces = Array.from(autocompleteSuggestions.cities.entries()).find(
        ([, displayName]) =>
          displayName.toLowerCase() === finalValue.toLowerCase()
      );
      
      if (cityFromPlaces) {
        finalValue = cityFromPlaces[0]; // Use lowercase name
      } else {
        // Fallback to static cities list
        const matchingCity = availableCities.find((city) =>
          city.displayName.toLowerCase() === finalValue.toLowerCase() ||
          city.name.toLowerCase() === finalValue.toLowerCase()
        );
        if (matchingCity) {
          finalValue = matchingCity.name;
        }
      }
    }

    // If it's a tag, use the tag as-is
    // If it's a place name, search will determine the type
    onSearch(finalValue, finalType);
  };

  const displayValue = inputValue;
  
  // Calculate ghost text - match input against suggestion and return rest with all characters preserved
  const ghostText = (() => {
    if (!suggestion || !inputValue) return '';
    
    const inputLower = inputValue.toLowerCase().trim().replace(/\s+/g, '');
    const suggestionLower = suggestion.toLowerCase().replace(/\s+/g, '');
    
    // Check if suggestion (without spaces) starts with input (without spaces)
    if (!suggestionLower.startsWith(inputLower)) {
      return '';
    }
    
    // Find position in original suggestion where we've matched all input characters
    // Match character by character, skipping spaces in suggestion
    let inputCharsMatched = 0;
    let slicePosition = 0;
    
    for (let i = 0; i < suggestion.length; i++) {
      const char = suggestion[i].toLowerCase();
      
      if (char === ' ') {
        // Space in suggestion - if we've matched all input, slice from here
        if (inputCharsMatched === inputLower.length) {
          slicePosition = i;
          break;
        }
        // Otherwise, space is in the way, just continue
      } else {
        // Non-space character
        if (inputCharsMatched < inputLower.length) {
          const expectedChar = inputLower[inputCharsMatched];
          if (char === expectedChar) {
            inputCharsMatched++;
            // If we just matched the last character, check what's next
            if (inputCharsMatched === inputLower.length) {
              slicePosition = i + 1;
              break;
            }
          } else {
            // Character doesn't match, stop
            return '';
          }
        }
      }
    }
    
    // Slice from the position we found - this preserves all characters including spaces
    const result = suggestion.slice(slicePosition);
    
    // Debug logging for "den" case
    if (inputValue.toLowerCase().trim() === 'den' && suggestion.toLowerCase().includes('haag')) {
      console.log('Ghost text calculation:', {
        inputValue,
        suggestion,
        inputLower,
        suggestionLower,
        inputCharsMatched,
        slicePosition,
        result,
        resultCharCodes: result.split('').map(c => c.charCodeAt(0)),
        hasSpace: result.startsWith(' ')
      });
    }
    
    return result;
  })();

  // Sync ghost text styles with input element styles for pixel-perfect alignment
  useEffect(() => {
    if (inputRef.current && ghostText) {
      const inputStyles = window.getComputedStyle(inputRef.current);
      setGhostTextStyles({
        fontFamily: inputStyles.fontFamily,
        fontSize: inputStyles.fontSize,
        fontStyle: inputStyles.fontStyle,
        fontWeight: inputStyles.fontWeight,
        letterSpacing: inputStyles.letterSpacing,
        lineHeight: inputStyles.lineHeight,
      });
    }
  }, [ghostText, inputValue]);

  return (
    <div className={`relative w-full rounded-4xl ${className}`}>
      <div className="relative rounded-full overflow-visible">
        {/* Ghost text for autocomplete suggestion */}
        {ghostText && (
          <div className="absolute inset-0 flex items-center pointer-events-none rounded-full">
            <span 
              className="pl-6 text-gray-400 select-none whitespace-pre text-lg"
              style={ghostTextStyles}
            >
              <span className="invisible">{displayValue}</span>
              {ghostText}
            </span>
          </div>
        )}

        {/* Actual input */}
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-6 pr-20 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            backgroundColor: 'white',
            backgroundClip: 'padding-box'
          }}
          aria-label="Search for coffee places"
        />
      </div>

      {/* Search button - icon only */}
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-orange-500 text-white rounded-full hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        aria-label="Search"
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Suggestion hint */}
      {suggestion && (
        <div className="absolute left-0 -bottom-6 text-xs text-gray-500">
          Press Tab to autocomplete "{suggestion}"
          {suggestionType && (
            <span className="ml-1 text-gray-400">({suggestionType})</span>
          )}
        </div>
      )}
    </div>
  );
};
