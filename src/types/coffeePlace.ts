import { z } from 'zod';

// Coffee Place data schema
export const coffeePlaceSchema = z.object({
  // Core fields (required - backward compatible)
  id: z.string(),
  name: z.string(),
  city: z.string().nullable(), // May be null for some OSM entries
  rating: z.number().min(0).max(5), // Now represents quality score (0-5)
  openHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }).nullable(), // May be null if OSM data is incomplete
  tags: z.array(z.string()),

  // New optional fields from OpenStreetMap
  // Location details
  lat: z.number().optional(),
  lon: z.number().optional(),

  // Address details
  address: z.object({
    street: z.string().optional(),
    housenumber: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    full: z.string().optional(),
  }).optional(),

  // Contact information
  phone: z.string().optional(),
  website: z.string().optional(),
  email: z.string().optional(),

  // Detailed opening hours
  openingHours: z.string().optional(), // Full OSM format (e.g., "Mo-Fr 08:00-18:00")

  // Amenities (boolean flags)
  hasWifi: z.boolean().optional(),
  hasOutdoorSeating: z.boolean().optional(),
  hasWheelchairAccess: z.boolean().optional(),
  hasTakeaway: z.boolean().optional(),
  hasDelivery: z.boolean().optional(),

  // Quality indicators
  qualityScore: z.number().optional(), // 0-10 score based on data completeness
  isVerified: z.boolean().optional(), // Has website + phone + hours

  // Google Places data (Phase 2 - future)
  googleRating: z.number().optional(), // Google rating (1-5)
  googleReviewCount: z.number().optional(), // Number of reviews
  googlePriceLevel: z.number().optional(), // Price level (1-4, $-$$$$)
});

export type CoffeePlace = z.infer<typeof coffeePlaceSchema>;

// Query parameters schema
export const queryParamsSchema = z.object({
  city: z.string().optional(),
  minRating: z
    .string()
    .optional()
    .transform((val: string | undefined) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0).max(5).optional()),
  openAfter: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  openBefore: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  tags: z
    .string()
    .optional()
    .transform((val: string | undefined) => (val ? val.split(',').map((t) => t.trim()) : undefined))
    .pipe(z.array(z.string()).optional()),
  random: z
    .string()
    .optional()
    .transform((val: string | undefined): boolean => val === 'true')
    .pipe(z.boolean()),
  limit: z
    .string()
    .optional()
    .transform((val: string | undefined): number => (val ? parseInt(val, 10) : 100))
    .pipe(z.number().int().min(1).max(100)),
  page: z
    .string()
    .optional()
    .transform((val: string | undefined): number => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1)),
});

export type QueryParams = z.infer<typeof queryParamsSchema>;

// Simplified query params for our search functionality
export interface SearchParams {
  city?: string;
  tags?: string[];
}

// Cities API response format
export interface CityInfo {
  name: string;
  displayName: string;
  count: number;
}

export interface CitiesResponse {
  total: number;
  cities: CityInfo[];
}
