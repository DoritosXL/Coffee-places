import { useState, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { ResultsDisplay } from './components/ResultsDisplay';
import { coffeePlacesApi } from './services/api';
import type { CoffeePlace } from './types/coffeePlace';

type View = 'home' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [results, setResults] = useState<CoffeePlace[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableTags = coffeePlacesApi.getAvailableTags();

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      const cities = await coffeePlacesApi.getCities();
      setAvailableCities(cities);
    };
    fetchCities();
  }, []);

  const handleSearch = async (query: string, type: 'city' | 'tag' | null) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    setCurrentView('results');

    try {
      const searchParams: { city?: string; tags?: string[] } = {};

      if (type === 'city') {
        searchParams.city = query;
      } else if (type === 'tag') {
        searchParams.tags = [query];
      } else {
        // Try to determine the type based on available data
        if (availableCities.some((city) => city.toLowerCase() === query.toLowerCase())) {
          searchParams.city = query;
        } else if (availableTags.some((tag) => tag.toLowerCase() === query.toLowerCase())) {
          searchParams.tags = [query];
        } else {
          // Default to city search
          searchParams.city = query;
        }
      }

      const data = await coffeePlacesApi.search(searchParams);
      setResults(data);
    } catch (err) {
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
