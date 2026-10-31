export type Region = 'europe' | 'asia-gulf' | 'americas-australia';

export interface Destination {
  /** Saved as the student's preferred country. */
  value: string;
  name: string;
  /** ISO 3166-1 alpha-2 code, used for the flag. */
  flag: string;
  region: Region;
  description: string;
  /** Partner universities. Add names here as they are confirmed. */
  universities: string[];
}

export const regions: { value: Region; label: string }[] = [
  { value: 'europe', label: 'Europe' },
  { value: 'asia-gulf', label: 'Asia and the Gulf' },
  { value: 'americas-australia', label: 'North America and Australia' },
];

// To add a country, add one entry here. The landing page, its counts and the
// application form all read from this list.
export const destinations: Destination[] = [
  { value: 'uk', name: 'United Kingdom', flag: 'gb', region: 'europe', description: 'Long-established universities and one-year master\'s degrees.', universities: [] },
  { value: 'ireland', name: 'Ireland', flag: 'ie', region: 'europe', description: 'English-speaking universities close to a growing technology sector.', universities: [] },
  { value: 'germany', name: 'Germany', flag: 'de', region: 'europe', description: 'Research-led public universities and a wide range of technical programs.', universities: [] },
  { value: 'france', name: 'France', flag: 'fr', region: 'europe', description: 'Public universities and business schools with English-taught master\'s programs.', universities: [] },
  { value: 'spain', name: 'Spain', flag: 'es', region: 'europe', description: 'English-taught programs, especially in business and management.', universities: [] },
  { value: 'malta', name: 'Malta', flag: 'mt', region: 'europe', description: 'An English-speaking island country inside the European Union.', universities: [] },
  { value: 'india', name: 'India', flag: 'in', region: 'asia-gulf', description: 'A very large university sector, strong in engineering and technology.', universities: [] },
  { value: 'singapore', name: 'Singapore', flag: 'sg', region: 'asia-gulf', description: 'A regional hub for business and technology, taught in English.', universities: [] },
  { value: 'malaysia', name: 'Malaysia', flag: 'my', region: 'asia-gulf', description: 'English-taught degrees, including branch campuses of foreign universities.', universities: [] },
  { value: 'uae', name: 'United Arab Emirates', flag: 'ae', region: 'asia-gulf', description: 'International branch campuses in a Gulf business center.', universities: [] },
  { value: 'usa', name: 'United States', flag: 'us', region: 'americas-australia', description: 'A wide choice of universities and flexible study paths.', universities: [] },
  { value: 'canada', name: 'Canada', flag: 'ca', region: 'americas-australia', description: 'Universities and colleges, many with work placement options.', universities: [] },
  { value: 'australia', name: 'Australia', flag: 'au', region: 'americas-australia', description: 'English-taught universities with large international student communities.', universities: [] },
];
