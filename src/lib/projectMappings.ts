/**
 * Mapping between frontend display names and backend keys
 * for configurations and amenities
 */

// Configuration mapping: display name -> backend key
export const CONFIGURATION_MAP: Record<string, string> = {
  '1BHK': '1bhk',
  '2BHK': '2bhk',
  '3BHK': '3bhk',
  '4BHK': '4bhk',
  'Villa': 'villa',
  'Duplex': 'duplex',
  'Apartment': 'apartment',
  '1 BHK': '1bhk',
  '2 BHK': '2bhk',
  '3 BHK': '3bhk',
  '4 BHK': '4bhk',
};

// Amenity mapping: display name -> backend key
export const AMENITY_MAP: Record<string, string> = {
  'Swimming Pool': 'swimming_pool',
  "Children's Play Area": 'childrens_play_area',
  'Security': 'security',
  'Parking': 'parking',
  'Jogging Track': 'jogging_track',
  'Gym': 'gym',
  'Clubhouse': 'clubhouse',
  'Power Backup': 'power_backup',
  'Garden': 'garden',
  'Community Hall': 'community_hall',
};

// Reverse mapping: backend key -> display name
export const CONFIGURATION_DISPLAY_MAP: Record<string, string> = {
  '1bhk': '1 BHK',
  '2bhk': '2 BHK',
  '3bhk': '3 BHK',
  '4bhk': '4 BHK',
  'villa': 'Villa',
  'duplex': 'Duplex',
  'apartment': 'Apartment',
};

export const AMENITY_DISPLAY_MAP: Record<string, string> = {
  'swimming_pool': 'Swimming Pool',
  'childrens_play_area': "Children's Play Area",
  'security': 'Security',
  'parking': 'Parking',
  'jogging_track': 'Jogging Track',
  'gym': 'Gym',
  'clubhouse': 'Clubhouse',
  'power_backup': 'Power Backup',
  'garden': 'Garden',
  'community_hall': 'Community Hall',
};

/**
 * Convert frontend display names to backend keys for configurations
 */
export function mapConfigurationsToBackend(configs: string[]): string[] {
  return configs.map(config => CONFIGURATION_MAP[config] || config);
}

/**
 * Convert frontend display names to backend keys for amenities
 */
export function mapAmenitiesToBackend(amenities: string[]): string[] {
  return amenities.map(amenity => AMENITY_MAP[amenity] || amenity);
}

/**
 * Convert backend keys to frontend display names for configurations
 */
export function mapConfigurationsToFrontend(configs: string[]): string[] {
  return configs.map(config => CONFIGURATION_DISPLAY_MAP[config] || config);
}

/**
 * Convert backend keys to frontend display names for amenities
 */
export function mapAmenitiesToFrontend(amenities: string[]): string[] {
  return amenities.map(amenity => AMENITY_DISPLAY_MAP[amenity] || amenity);
}

