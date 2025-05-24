// Location-related type definitions for Sprint 3.1

export interface Country {
  code: string;
  name: string;
  flag?: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

export interface Municipality {
  code: string;
  name: string;
  stateCode: string;
  countryCode: string;
}

export interface IdentityDocumentType {
  id: string;
  name: string;
  description?: string;
  countryCode?: string;
  isActive: boolean;
}

// Utility type for location filtering
export interface LocationFilter {
  countryCode?: string;
  stateCode?: string;
} 