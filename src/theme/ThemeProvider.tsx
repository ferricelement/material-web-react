import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import type { MD3Theme, ColorScheme } from './tokens.js';
import { themeToStyleVars } from './tokens.js';

const ThemeContext = createContext<Partial<MD3Theme> | undefined>(undefined);
const ColorSchemeContext = createContext<ColorScheme>('system');

export interface ThemeProviderProps {
  theme?: Partial<MD3Theme>;
  darkTheme?: Partial<MD3Theme>;
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

const darkMediaQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

function subscribeToColorScheme(callback: () => void) {
  darkMediaQuery?.addEventListener('change', callback);
  return () => darkMediaQuery?.removeEventListener('change', callback);
}

function getSystemIsDark() {
  return darkMediaQuery?.matches ?? false;
}

export function ThemeProvider({
  theme,
  darkTheme,
  colorScheme = 'light',
  children,
}: ThemeProviderProps) {
  const systemIsDark = useSyncExternalStore(
    subscribeToColorScheme,
    getSystemIsDark,
    () => false,
  );

  const resolvedIsDark =
    colorScheme === 'dark' || (colorScheme === 'system' && systemIsDark);

  const activeTheme = resolvedIsDark && darkTheme ? darkTheme : (theme ?? {});

  const style = useMemo(() => {
    const vars = themeToStyleVars(activeTheme);
    if (colorScheme !== 'system') {
      vars['colorScheme'] = colorScheme;
    }
    return vars;
  }, [activeTheme, colorScheme]);

  const dataAttr =
    colorScheme === 'system' ? undefined : colorScheme;

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <ThemeContext.Provider value={activeTheme}>
        <div style={style} data-md-color-scheme={dataAttr}>
          {children}
        </div>
      </ThemeContext.Provider>
    </ColorSchemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Returns the resolved color scheme: 'light' or 'dark'.
 * When the provider is set to 'system', this reflects the OS preference.
 */
export function useColorScheme(): 'light' | 'dark' {
  const scheme = useContext(ColorSchemeContext);
  const systemIsDark = useSyncExternalStore(
    subscribeToColorScheme,
    getSystemIsDark,
    () => false,
  );

  if (scheme === 'dark') return 'dark';
  if (scheme === 'light') return 'light';
  return systemIsDark ? 'dark' : 'light';
}
