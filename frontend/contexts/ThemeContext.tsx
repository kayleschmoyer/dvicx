import React, { createContext, ReactNode } from 'react';

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

const theme: Theme = {
  background: COLORS.white,
  text: COLORS.charcoal,
  accent: COLORS.magenta,
};

interface ThemeContextProps {
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
