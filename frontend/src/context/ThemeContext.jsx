import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Default theme
  });

  useEffect(() => {
    // 1. Save theme to local storage
    localStorage.setItem('theme', theme);
    
    // 2. Remove all existing theme classes from HTML element
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'blue', 'green', 'high-contrast');
    
    // 3. Add the active theme class
    if (theme !== 'dark') {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
