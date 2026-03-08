import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Home, Award, Briefcase, Trophy, User, Shield, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigationLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cybersecurity-certificates', label: 'Cybersecurity', icon: Shield },
    { path: '/blockchain-certificates', label: 'Blockchain', icon: Award },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/journey', label: 'Journey', icon: Map },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/digital-badges', label: 'Badges', icon: Award },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
      style={{
        backgroundColor: isScrolled ? 'hsl(var(--background) / 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(1.5)' : 'none',
        borderBottom: isScrolled ? '1px solid hsl(var(--border))' : 'none',
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground font-bold text-sm font-mono">HG</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  {userRole}
                </span>
                {userRole === 'admin' && (
                  <Link to="/admin">
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-xs">
                      <Settings className="h-3 w-3 mr-1.5" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  <LogOut className="h-3 w-3 mr-1.5" />
                  Exit
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium">
                  <User className="h-3 w-3 mr-1.5" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
