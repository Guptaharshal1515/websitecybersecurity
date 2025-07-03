
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
    background: 'hsl(var(--background))',
    surface: 'hsl(var(--card))',
    text: 'hsl(var(--foreground))',
  };

  switch (role) {
    case 'admin':
      return {
        ...baseTheme,
        primary: '0 84% 60%', // Red in HSL
        secondary: '0 63% 31%',
        accent: '0 93% 94%',
      };
    case 'editor':
      return {
        ...baseTheme,
        primary: '262 83% 58%', // Violet in HSL
        secondary: '263 70% 50%',
        accent: '262 69% 84%',
      };
    case 'customer':
      return {
        ...baseTheme,
        primary: '142 76% 36%', // Green in HSL
        secondary: '142 64% 28%',
        accent: '142 69% 84%',
      };
    default: // viewer
      return {
        ...baseTheme,
        primary: '213 94% 68%', // Blue in HSL
        secondary: '213 93% 30%',
        accent: '213 89% 84%',
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
