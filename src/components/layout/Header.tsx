
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, Settings, Home, FileText, Award, Briefcase, Map, Target, User } from 'lucide-react';

export const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const { themeColors } = useTheme();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cybersecurity-certificates', label: 'Cybersecurity', icon: Award },
    { path: '/blockchain-certificates', label: 'Blockchain', icon: Award },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/journey', label: 'Journey', icon: Map },
    { path: '/tracker', label: 'Tracker', icon: Target },
    { path: '/roadmap', label: 'Roadmap', icon: FileText },
  ];

  return (
    <header 
      className="sticky top-0 z-50 border-b"
      style={{ 
        backgroundColor: themeColors.background,
        borderColor: themeColors.primary + '20'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold" style={{ color: themeColors.primary }}>
            WebsiteCyberSec
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === path 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: location.pathname === path ? themeColors.primary : 'transparent'
                }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
                {userRole === 'admin' && (
                  <Link to="/admin">
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  size="sm"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
