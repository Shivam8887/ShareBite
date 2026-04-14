import React, { createContext, useContext } from 'react';

// Light-only — no theme switching needed
const ThemeContext = createContext({ theme: 'light' });

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
