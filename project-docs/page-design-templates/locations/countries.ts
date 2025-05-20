import { LocationOption } from '@/types/location';

/**
 * Countries supported for identity document issuance in Permisoria.
 * This centralized list ensures consistency across all country dropdowns.
 */
export const COUNTRIES: LocationOption[] = [
  { value: "US", label: "United States" },
  { value: "PR", label: "Puerto Rico" },
  // For future expansion:
  // { value: "CA", label: "Canada" },
  // { value: "MX", label: "Mexico" },
];

/**
 * Retrieves all countries available for selection.
 * @returns Array of country options
 */
export const getAllCountries = (): LocationOption[] => {
  return COUNTRIES;
};

/**
 * Finds a specific country by its value code.
 * @param value - The country code to search for
 * @returns The country object or undefined if not found
 */
export const getCountryByValue = (value: string): LocationOption | undefined => {
  return COUNTRIES.find(country => country.value === value);
};

/**
 * Default export for direct array access when needed
 */
export default COUNTRIES;