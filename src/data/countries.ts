import { Country } from '@/types/location';

export const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryOptions = () => {
  return countries.map(country => ({
    label: country.name,
    value: country.code
  }));
}; 