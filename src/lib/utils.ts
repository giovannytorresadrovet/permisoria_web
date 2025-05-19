import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values using clsx and merges Tailwind classes properly
 * to avoid conflicts and duplication.
 * 
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns - Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 