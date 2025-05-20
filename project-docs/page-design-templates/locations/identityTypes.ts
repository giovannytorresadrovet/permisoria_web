/**
 * Interface for identity document types
 */
export interface IdentityType {
    value: string;
    label: string;
    description?: string;
    requiresExpiry?: boolean;
  }
  
  /**
   * Standard identity document types supported throughout Permisoria.
   * Centralizing these ensures consistency across all identity selection interfaces.
   */
  export const IDENTITY_TYPES: IdentityType[] = [
    { 
      value: "driversLicense", 
      label: "Driver's License",
      description: "State or territory-issued driver's license",
      requiresExpiry: true
    },
    { 
      value: "stateId", 
      label: "State ID",
      description: "Government-issued identification card",
      requiresExpiry: true
    },
    { 
      value: "passport", 
      label: "Passport",
      description: "Internationally recognized travel document",
      requiresExpiry: true
    }
  ];
  
  /**
   * Retrieves all identity document types
   * @returns Array of identity document types
   */
  export const getAllIdentityTypes = (): IdentityType[] => {
    return IDENTITY_TYPES;
  };
  
  /**
   * Finds an identity type by its value code
   * @param value - The identity type code
   * @returns The identity type object or undefined if not found
   */
  export const getIdentityTypeByValue = (value: string): IdentityType | undefined => {
    return IDENTITY_TYPES.find(type => type.value === value);
  };
  
  /**
   * Default export for direct array access when needed
   */
  export default IDENTITY_TYPES;