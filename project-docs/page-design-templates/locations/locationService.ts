import { LocationOption } from '@/types/location';
import COUNTRIES from '@/data/countries';
import US_STATES from '@/data/us-states';
import PR_MUNICIPALITIES from '@/data/pr-municipalities';

/**
 * Location types for which we have specific data
 */
export type LocationType = 'country' | 'state' | 'municipality';

/**
 * Get locations for a specific parent location
 * @param type - The type of location to retrieve
 * @param parentValue - Optional parent location code
 * @returns Array of location options
 */
export const getLocationsByType = (
  type: LocationType, 
  parentValue?: string
): LocationOption[] => {
  switch (type) {
    case 'country':
      return COUNTRIES;
    case 'state':
    case 'municipality':
      // If we have a parent country, filter by it
      if (parentValue) {
        if (parentValue === 'US') {
          return US_STATES;
        } else if (parentValue === 'PR') {
          return PR_MUNICIPALITIES;
        }
      }
      // If no parent or unrecognized parent, return empty array
      return [];
    default:
      return [];
  }
};

/**
 * Retrieves child locations for a specific country
 * @param countryCode - The country code to get child locations for
 * @returns Array of location options for that country
 */
export const getChildLocationsForCountry = (countryCode: string): LocationOption[] => {
  return getLocationsByType('state', countryCode);
};

export default {
  getLocationsByType,
  getChildLocationsForCountry
};