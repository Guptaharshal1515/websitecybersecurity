
import { createContext, useContext } from 'react';
import { useAuth, UserRole } from './AuthContext';

interface ThemeContextType {
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  userRole: UserRole;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getThemeColors = (role: UserRole) => {
  const baseTheme = {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
  };

  switch (role) {
    case 'admin':
      return {
        ...baseTheme,
        primary: '#dc2626', // Red
        secondary: '#991b1b',
        accent: '#fca5a5',
      };
    case 'editor':
      return {
        ...baseTheme,
        primary: '#8b5cf6', // Violet
        secondary: '#7c3aed',
        accent: '#c4b5fd',
      };
    case 'customer':
      return {
        ...baseTheme,
        primary: '#16a34a', // Light Green
        secondary: '#15803d',
        accent: '#86efac',
      };
    default: // viewer
      return {
        ...baseTheme,
        primary: '#1e40af', // Sapphire Blue
        secondary: '#1e3a8a',
        accent: '#93c5fd',
      };
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useAuth();
  const themeColors = getThemeColors(userRole);

  const value = {
    themeColors,
    userRole,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
