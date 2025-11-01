import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  availableCities: string[];
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
  const [suggestionType, setSuggestionType] = useState<'city' | 'tag' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputValue) {
      setSuggestion('');
      setSuggestionType(null);
      return;
    }

    const lowerInput = inputValue.toLowerCase();

    // Check tags first
    const matchingTag = availableTags.find((tag) =>
      tag.toLowerCase().startsWith(lowerInput)
    );

    if (matchingTag) {
      setSuggestion(matchingTag);
      setSuggestionType('tag');
      return;
    }

    // Check cities
    const matchingCity = availableCities.find((city) =>
      city.toLowerCase().startsWith(lowerInput)
    );

    if (matchingCity) {
      setSuggestion(matchingCity);
      setSuggestionType('city');
      return;
    }

    setSuggestion('');
    setSuggestionType(null);
  }, [inputValue, availableCities, availableTags]);

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

    // Determine if the input matches a tag or city
    const finalValue = suggestion || inputValue;
    const finalType = suggestionType;

    onSearch(finalValue, finalType);
  };

  const displayValue = inputValue;
  const ghostText = suggestion && suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
    ? suggestion.slice(inputValue.length)
    : '';

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative rounded-full overflow-visible">
        {/* Ghost text for autocomplete suggestion */}
        {ghostText && (
          <div className="absolute inset-0 flex items-center pointer-events-none rounded-full">
            <span className="pl-6 text-gray-400 select-none">
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
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            backgroundColor: 'white',
            backgroundClip: 'padding-box'
          }}
          aria-label="Search for coffee places"
        />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
        aria-label="Search"
      >
        Search
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
