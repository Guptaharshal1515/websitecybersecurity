import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, Settings, Home, FileText, Award, Briefcase, Map, Target, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const { themeColors } = useTheme();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 100);
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cybersecurity-certificates', label: 'Cybersecurity', icon: Award },
    { path: '/blockchain-certificates', label: 'Blockchain', icon: Award },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/journey', label: 'Journey', icon: Map },
    { path: '/achievements', label: 'Achievements', icon: Target },
    { path: '/additional-certificates', label: 'Additional Certs', icon: Award },
    { path: '/roadmap', label: 'Roadmap', icon: FileText },
  ];

  return (
    <header 
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? 'left-4 top-4 w-auto rounded-2xl shadow-2xl' 
          : 'top-0 left-0 right-0 w-full'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ 
        backgroundColor: isScrolled 
          ? themeColors.background + 'E6'
          : themeColors.background,
        borderColor: themeColors.primary + '20',
        border: isScrolled ? `2px solid ${themeColors.primary}40` : 'none',
        backdropFilter: 'blur(15px)'
      }}
    >
      <div className={`${isScrolled ? 'px-4' : 'container mx-auto px-4'} py-3`}>
        <div className={`flex items-center ${isScrolled ? 'justify-center' : 'justify-between'}`}>
          {!isScrolled && (
            <div className="flex items-center">
              {/* Portfolio title removed */}
            </div>
          )}

          <nav className={`flex items-center ${isScrolled ? 'gap-2' : 'gap-6'}`}>
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center ${isScrolled ? 'p-2 justify-center' : 'gap-2 px-3 py-2'} rounded-md transition-colors ${
                  location.pathname === path 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: location.pathname === path ? themeColors.primary : 'transparent'
                }}
                title={isScrolled ? label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isScrolled && label}
              </Link>
            ))}
          </nav>

          {!isScrolled && (
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
          )}
        </div>
      </div>
    </header>
  );
};