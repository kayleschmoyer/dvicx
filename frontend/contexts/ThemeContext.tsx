import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  background: string;
  text: string;
  accent: string;
}

const COLORS = {
  magenta: '#ED017F',
  charcoal: '#333333',
  white: '#FFFFFF',
  biscuit: '#F2F3EF',
};

const lightTheme: Theme = {
  background: COLORS.white,
  text: COLORS.charcoal,
  accent: COLORS.magenta,
};

const darkTheme: Theme = {
  background: COLORS.charcoal,
  text: COLORS.white,
  accent: COLORS.magenta,
};

interface ThemeContextProps {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'theme-mode';

export const ThemeContext = createContext<ThemeContextProps>({
  mode: 'dark',
  theme: darkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
