import React, { createContext, useContext, useMemo } from 'react';
import type { MD3Theme } from './tokens.js';
import { themeToStyleVars } from './tokens.js';

const ThemeContext = createContext<Partial<MD3Theme> | undefined>(undefined);

export interface ThemeProviderProps {
  theme: Partial<MD3Theme>;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const style = useMemo(() => themeToStyleVars(theme), [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div style={style}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
