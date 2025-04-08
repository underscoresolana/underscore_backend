import { createContext, useContext, useEffect } from 'react';

type Theme = 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme: Theme = 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light');
    root.classList.add('dark');
    localStorage.setItem('theme', theme);
  }, []);

  // Keep toggleTheme function for API compatibility, but it won't do anything
  const toggleTheme = () => {
    // No-op, dark theme is always used
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
