import { useState, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { ResultsDisplay } from './components/ResultsDisplay';
import { coffeePlacesApi } from './services/api';
import type { CoffeePlace, CityInfo } from './types/coffeePlace';

type View = 'home' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [results, setResults] = useState<CoffeePlace[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch cities and extract tags from places on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch cities
      const cities = await coffeePlacesApi.getCities();
      setAvailableCities(cities);

      // Use curated coffee-relevant tags (not dependent on API response)
      // These are standard tags for coffee places search/autocomplete
      const curatedCoffeeTags = [
        'wifi',
        'outdoor',
        'wheelchair-accessible',
        'takeaway',
        'delivery',
        'coffee',
        'cozy',
        'pet-friendly',
        'breakfast',
        'bakery',
      ];
      
      // Optionally: Check API for additional valid tags that might exist
      try {
        const places = await coffeePlacesApi.search({});
        
        // Coffee-relevant tags whitelist for validation
        const coffeeRelevantTags = new Set([
          'wifi', 'outdoor', 'outdoor-seating', 'outdoor_seating',
          'wheelchair-accessible', 'wheelchair_accessible', 'wheelchair',
          'takeaway', 'take-away', 'take_away',
          'delivery',
          'coffee', 'cafe', 'café', 'caffee', 'caffe',
          'espresso', 'latte', 'cappuccino', 'barista',
          'cozy', 'cosy', 'quiet', 'pet-friendly', 'pet_friendly', 'pet friendly',
          'breakfast', 'brunch', 'lunch', 'bakery', 'pastry',
          'organic', 'fair-trade', 'fairtrade', 'sustainable',
          'roastery', 'specialty', 'third-wave'
        ]);
        
        // Extract valid tags from API response (only coffee-relevant ones)
        const apiTagsSet = new Set<string>();
        places.forEach((place) => {
          if (place.tags && Array.isArray(place.tags)) {
            place.tags.forEach((tag) => {
              if (tag && typeof tag === 'string') {
                const tagLower = tag.toLowerCase().trim();
                // Only include if it's coffee-relevant
                if (coffeeRelevantTags.has(tagLower) || 
                    tagLower.includes('coffee') || 
                    tagLower.includes('cafe') || 
                    tagLower.includes('café') ||
                    tagLower.includes('wifi') ||
                    tagLower.includes('outdoor') ||
                    tagLower.includes('wheelchair') ||
                    tagLower === 'takeaway' || tagLower === 'delivery') {
                  apiTagsSet.add(tag);
                }
              }
            });
          }
        });
        
        // Combine curated tags with valid API tags (prioritize curated, then add unique from API)
        const allTags = new Set([...curatedCoffeeTags, ...Array.from(apiTagsSet)]);
        setAvailableTags(Array.from(allTags));
      } catch (error) {
        console.error('Error fetching places for tags:', error);
        // Fallback to static tags if API fails
        setAvailableTags(coffeePlacesApi.getAvailableTags());
      }
    };
    
    fetchInitialData();
  }, []);

  const handleSearch = async (query: string, type: 'city' | 'tag' | null) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    setCurrentView('results');

    // Track start time to ensure skeleton shows for at least 1 second
    const startTime = Date.now();
    const minimumDisplayTime = 1000; // 1 second

    try {
      const searchParams: { city?: string; tags?: string[] } = {};

      if (type === 'city') {
        searchParams.city = query;
      } else if (type === 'tag') {
        searchParams.tags = [query];
      } else {
        // Try to determine the type based on available data
        const matchingCity = availableCities.find(
          (city) => city.name.toLowerCase() === query.toLowerCase() || city.displayName.toLowerCase() === query.toLowerCase()
        );
        if (matchingCity) {
          searchParams.city = matchingCity.name;
        } else if (availableTags.some((tag) => tag.toLowerCase() === query.toLowerCase())) {
          searchParams.tags = [query];
        } else {
          // Default to city search
          searchParams.city = query;
        }
      }

      const data = await coffeePlacesApi.search(searchParams);
      
      // Ensure minimum display time of 1 second for skeleton
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setResults(data);
    } catch (err) {
      // Ensure minimum display time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setError(err instanceof Error ? err.message : 'An error occurred while fetching results');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentView('home');
    setResults(null);
    setError(null);
    setSearchQuery('');
  };

  return (
    <>
      {/* Home View */}
      {currentView === 'home' && (
        <div className="animate-fadeIn">
          <HomeView
            availableCities={availableCities}
            availableTags={availableTags}
            onSearch={handleSearch}
          />
        </div>
      )}

      {/* Results View */}
      {currentView === 'results' && (
        <div className="animate-fadeIn">
          <ResultsDisplay
            results={results}
            isLoading={isLoading}
            error={error}
            onBack={handleBack}
            searchQuery={searchQuery}
          />
        </div>
      )}
    </>
  );
}

export default App;
