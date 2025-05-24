import { IdentityDocumentType } from '@/types/location';

export const identityDocumentTypes: IdentityDocumentType[] = [
  {
    id: 'drivers_license',
    name: 'Driver\'s License',
    description: 'Government-issued driver\'s license',
    countryCode: 'US',
    isActive: true
  },
  {
    id: 'state_id',
    name: 'State ID Card',
    description: 'Government-issued identification card',
    countryCode: 'US',
    isActive: true
  },
  {
    id: 'passport',
    name: 'Passport',
    description: 'Government-issued passport',
    isActive: true
  },
  {
    id: 'military_id',
    name: 'Military ID',
    description: 'Military identification card',
    countryCode: 'US',
    isActive: true
  },
  {
    id: 'pr_drivers_license',
    name: 'Puerto Rico Driver\'s License',
    description: 'Puerto Rico government-issued driver\'s license',
    countryCode: 'PR',
    isActive: true
  },
  {
    id: 'pr_state_id',
    name: 'Puerto Rico State ID',
    description: 'Puerto Rico government-issued identification card',
    countryCode: 'PR',
    isActive: true
  },
  {
    id: 'social_security_card',
    name: 'Social Security Card',
    description: 'Social Security Administration issued card',
    countryCode: 'US',
    isActive: true
  },
  {
    id: 'voter_registration',
    name: 'Voter Registration Card',
    description: 'Voter registration identification',
    isActive: true
  },
  {
    id: 'birth_certificate',
    name: 'Birth Certificate',
    description: 'Certified birth certificate',
    isActive: true
  },
  {
    id: 'naturalization_certificate',
    name: 'Naturalization Certificate',
    description: 'Certificate of Naturalization',
    countryCode: 'US',
    isActive: true
  }
];

export const getIdentityDocumentTypesByCountry = (countryCode?: string): IdentityDocumentType[] => {
  if (!countryCode) return identityDocumentTypes.filter(type => type.isActive);
  return identityDocumentTypes.filter(type => 
    type.isActive && (!type.countryCode || type.countryCode === countryCode)
  );
};

export const getIdentityDocumentTypeById = (id: string): IdentityDocumentType | undefined => {
  return identityDocumentTypes.find(type => type.id === id);
};

export const getIdentityDocumentTypeOptions = (countryCode?: string) => {
  const types = getIdentityDocumentTypesByCountry(countryCode);
  return types.map(type => ({
    label: type.name,
    value: type.id,
    description: type.description
  }));
}; 