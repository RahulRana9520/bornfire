import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  reduceAnimations: boolean;
  toggleReduceAnimations: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('bornfire_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Fallback: check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('bornfire_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const [reduceAnimations, setReduceAnimations] = useState<boolean>(() => {
    return localStorage.getItem('bornfire_reduce_animations') === 'true';
  });

  const toggleReduceAnimations = () => {
    const newVal = !reduceAnimations;
    setReduceAnimations(newVal);
    localStorage.setItem('bornfire_reduce_animations', String(newVal));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (reduceAnimations) {
      root.classList.add('reduce-animations');
    } else {
      root.classList.remove('reduce-animations');
    }
  }, [theme, reduceAnimations]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, reduceAnimations, toggleReduceAnimations }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
