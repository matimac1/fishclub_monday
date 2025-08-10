import { Concursante, Catch, EspeciePez } from '../types';

const STORAGE_KEYS = {
  CONCURSANTES: 'concursantesData',
  CATCHES: 'catchesData',
  ESPECIES: 'especiesData',
};

export const loadData = <T>(key: string): T | null => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return null;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.clear();
    console.log("All data cleared from localStorage.");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

export default STORAGE_KEYS;
