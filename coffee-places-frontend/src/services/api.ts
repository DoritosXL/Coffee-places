import axios from 'axios';
import type { CoffeePlace, SearchParams } from '../types/coffeePlace';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const coffeePlacesApi = {
  /**
   * Fetch coffee places based on search parameters
   */
  async search(params: SearchParams): Promise<CoffeePlace[]> {
    const queryParams: Record<string, string> = {};

    if (params.city) {
      queryParams.city = params.city;
    }

    if (params.tags && params.tags.length > 0) {
      queryParams.tags = params.tags.join(',');
    }

    const response = await axios.get(`${API_BASE_URL}/places`, {
      params: queryParams,
    });

    // Handle if response.data is an object with a data property
    const places = Array.isArray(response.data) ? response.data : response.data.data;

    if (!Array.isArray(places)) {
      console.error('Expected array but got:', typeof places, places);
      return [];
    }

    return places;
  },

  /**
   * Fetch all available cities (for autocomplete)
   */
  async getCities(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/places`);
      console.log('API Response:', response.data);

      // Handle if response.data is an object with a data property
      const places = Array.isArray(response.data) ? response.data : response.data.data;

      if (!Array.isArray(places)) {
        console.error('Expected array but got:', typeof places, places);
        return [];
      }

      const cities = [...new Set(places.map((place: CoffeePlace) => place.city))];
      return cities.sort();
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  /**
   * Get available tags (for autocomplete)
   */
  getAvailableTags(): string[] {
    // Based on the requirement, we know 'wifi' is one of the tags
    // This could be expanded or fetched from the API if needed
    return ['wifi'];
  },
};
