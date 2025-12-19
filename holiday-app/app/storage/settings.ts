import AsyncStorage from '@react-native-async-storage/async-storage';

export type Region = 'noord' | 'midden' | 'zuid';

const REGION_KEY = 'region';
const YEAR_KEY = 'schoolYear';

/**
 * Save the selected region to AsyncStorage
 */
export async function saveRegion(region: Region): Promise<void> {
  try {
    await AsyncStorage.setItem(REGION_KEY, region);
  } catch (error) {
    console.error('Error saving region:', error);
  }
}

/**
 * Get the saved region from AsyncStorage
 */
export async function getRegion(): Promise<Region | null> {
  try {
    const value = await AsyncStorage.getItem(REGION_KEY);
    if (value === 'noord' || value === 'midden' || value === 'zuid') {
      return value;
    }
    return null;
  } catch (error) {
    console.error('Error getting region:', error);
    return null;
  }
}

/**
 * Save the selected school year to AsyncStorage
 */
export async function saveSchoolYear(year: string): Promise<void> {
  try {
    await AsyncStorage.setItem(YEAR_KEY, year);
  } catch (error) {
    console.error('Error saving school year:', error);
  }
}

/**
 * Get the saved school year from AsyncStorage
 */
export async function getSchoolYear(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(YEAR_KEY);
    return value;
  } catch (error) {
    console.error('Error getting school year:', error);
    return null;
  }
}

/**
 * Utility: determine region based on latitude
 * Noord: >= 52.7
 * Midden: 51.9 – 52.7
 * Zuid: < 51.9
 */
export function detectRegionFromLatitude(lat: number): Region {
  if (lat >= 52.7) return 'noord';
  if (lat < 51.9) return 'zuid';
  return 'midden';
}
