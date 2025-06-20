import type { TownData } from '../types/town';

const STORAGE_KEY = 'tiny-town-chronicle';

export const saveTownData = (townData: TownData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(townData));
  } catch (error) {
    console.error('Failed to save town data:', error);
  }
};

export const loadTownData = (): TownData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load town data:', error);
    return null;
  }
};

export const generateTownId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateEntryId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// For future implementation: sharing towns
export const exportTownData = (townData: TownData): string => {
  return btoa(JSON.stringify(townData));
};

export const importTownData = (encodedData: string): TownData | null => {
  try {
    const decodedData = atob(encodedData);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Failed to import town data:', error);
    return null;
  }
};