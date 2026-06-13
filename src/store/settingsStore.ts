import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

interface SettingsState {
  syncToCalendar: boolean;
  defaultReminder: number;
  themeColor: string;
  
  setSyncToCalendar: (value: boolean) => void;
  setDefaultReminder: (value: number) => void;
  setThemeColor: (value: string) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      syncToCalendar: DEFAULT_SETTINGS.syncToCalendar,
      defaultReminder: DEFAULT_SETTINGS.defaultReminder,
      themeColor: DEFAULT_SETTINGS.themeColor,
      
      setSyncToCalendar: (value) => set({ syncToCalendar: value }),
      setDefaultReminder: (value) => set({ defaultReminder: value }),
      setThemeColor: (value) => set({ themeColor: value }),
      resetToDefaults: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
