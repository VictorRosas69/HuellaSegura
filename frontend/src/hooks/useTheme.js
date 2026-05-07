import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hs-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Light es el modo predeterminado. Dark es opt-in desde el perfil del usuario.
    return localStorage.getItem(STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const setLight = useCallback(() => setTheme('light'), []);
  const setDark  = useCallback(() => setTheme('dark'), []);

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setLight,
    setDark,
  };
}