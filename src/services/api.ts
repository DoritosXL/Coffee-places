import axios from 'axios';
import type { CoffeePlace, SearchParams } from '../types/coffeePlace';

// API Base URL configuration:
// - In development: ALWAYS use '/api' (relative path) to go through Vite proxy (avoids CORS)
// - In production: Use VITE_API_URL if set, otherwise use '/api' (Vercel rewrite handles it)
// Note: The actual API endpoint is /api/places
// The Vite proxy forwards /api/* to https://nara-vf9k.vercel.app/api/*
// The Vercel rewrite forwards /api/* to https://nara-vf9k.vercel.app/api/*
let API_BASE_URL: string;

if (import.meta.env.DEV) {
  // Development: always use relative path for Vite proxy (overrides VITE_API_URL)
  API_BASE_URL = '/api';
} else {
  // Production: use env var if set, otherwise use /api (Vercel rewrite will handle it)
  API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
}

// Debug: log the API base URL being used
console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  resolved_API_BASE_URL: API_BASE_URL,
});

// Configure axios with better error handling and request/response interceptors
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    const fullURL = config.url?.startsWith('http') 
      ? config.url 
      : `${config.baseURL || ''}${config.url}`;
    
    // Warn if using full URL in development (should use proxy instead)
    if (import.meta.env.DEV && fullURL.startsWith('http')) {
      console.warn('⚠️ Using full URL in development! This will cause CORS. Using:', fullURL);
      console.warn('Expected: relative path like /api/places');
    }
    
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL,
      isRelative: !config.url?.startsWith('http'),
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      dataLength: response.data ? JSON.stringify(response.data).length : 0,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      } : null,
      request: error.request ? {
        url: error.config?.url,
        method: error.config?.method,
      } : null,
    });
    return Promise.reject(error);
  }
);

export const coffeePlacesApi = {
  /**
   * Fetch coffee places based on search parameters
   */
  async search(params: SearchParams): Promise<CoffeePlace[]> {
    try {
      const queryParams: Record<string, string> = {};

      if (params.city) {
        queryParams.city = params.city;
      }

      if (params.tags && params.tags.length > 0) {
        queryParams.tags = params.tags.join(',');
      }

      const url = `${API_BASE_URL}/places`;
      // Logging is handled by interceptors

      const response = await apiClient.get(url, {
        params: queryParams,
      });

      // Handle empty or null response
      if (!response.data) {
        console.warn('Empty response data received');
        return [];
      }

      // Handle if response.data is an object with a data property
      const places = Array.isArray(response.data) ? response.data : response.data?.data;

      if (!Array.isArray(places)) {
        console.error('Expected array but got:', {
          typeof: typeof places,
          value: places,
          responseData: response.data,
        });
        return [];
      }

      return places;
    } catch (error) {
      console.error('Error in API search:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        response: axios.isAxiosError(error) ? {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        } : null,
      });
      throw error;
    }
  },

  /**
   * Fetch all available cities (for autocomplete)
   */
  async getCities(): Promise<string[]> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/places`);
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
