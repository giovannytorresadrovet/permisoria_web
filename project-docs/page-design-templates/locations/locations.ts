/**
 * Standard interface for location dropdown options throughout the application.
 * Used for countries, states, municipalities, and other geographical entities.
 */
export interface LocationOption {
    /** Unique identifier or code for the location */
    value: string;
    /** Human-readable display name */
    label: string;
    /** Optional flag for default selection */
    isDefault?: boolean;
    /** Optional group for categorizing locations */
    group?: string;
    /** Optional icon name for visual distinction */
    icon?: string;
  }