
import { HistoryItem } from '../types';

const STORAGE_KEY = 'stone_calc_history';

export const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  // Keep only last 50 items to avoid storage bloat
  const updatedHistory = [newItem, ...history].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getHistory = (): HistoryItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearAllHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
