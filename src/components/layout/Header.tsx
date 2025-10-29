import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Home, Award, Briefcase, Trophy, User, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Header = () => {
  const { user, userRole, signOut } = useAuth();
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

  // Simple navigation array - NO Journey, NO Roadmap
  const navigationLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/certificates', label: 'Certificates', icon: Award },
    { path: '/cybersecurity-certificates', label: 'Cybersecurity', icon: Award },
    { path: '/blockchain-certificates', label: 'Blockchain', icon: Award },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/digital-badges', label: 'Digital Badges', icon: Shield },
  ];

  return (
    <header 
      className={`fixed z-50 transition-all duration-700 ease-out ${
        isScrolled 
          ? 'left-6 top-6 w-auto rounded-2xl shadow-2xl border-2' 
          : 'top-0 left-0 right-0 w-full border-b'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ 
        backgroundColor: isScrolled 
          ? 'hsl(var(--background) / 0.95)'
          : 'hsl(var(--background) / 0.85)',
        borderColor: isScrolled ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)'
      }}
    >
      <div className={`${isScrolled ? 'px-4' : 'container mx-auto px-4'} py-3`}>
        <div className={`flex items-center ${isScrolled ? 'justify-center' : 'justify-between'}`}>
          {!isScrolled && <div className="flex items-center" />}

          <nav className={`flex items-center ${isScrolled ? 'gap-1' : 'gap-6'}`}>
            {navigationLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center ${isScrolled ? 'p-3 justify-center w-12 h-12' : 'gap-2 px-3 py-2'} rounded-lg transition-all duration-300 hover:scale-105 ${
                  location.pathname === path 
                    ? 'text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                style={{
                  backgroundColor: location.pathname === path ? 'hsl(var(--primary))' : 'transparent'
                }}
                title={isScrolled ? label : undefined}
              >
                <Icon className={`${isScrolled ? 'h-5 w-5' : 'h-4 w-4'}`} />
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
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    onClick={signOut} 
                    variant="outline" 
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90">
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
