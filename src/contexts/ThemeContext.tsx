
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
  // Use design system semantic tokens consistently
  return {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    surface: 'hsl(var(--card))',
    text: 'hsl(var(--foreground))',
  };
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
