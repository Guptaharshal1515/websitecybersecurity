import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LogOut, Settings, Home, Award, Briefcase, Trophy, User,
  Menu, X, BarChart3, Shield, Users, Database, Map
} from 'lucide-react';

export const AdaptiveNavigation = () => {
  const { user, userRole, signOut } = useAuth();
  const { themeColors } = useTheme();
  const { isEnabled } = useFeatureFlags();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isEnabled('adaptive_navigation')) {
    return null;
  }

  const baseNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cybersecurity-certificates', label: 'Cybersecurity', icon: Award },
    { path: '/blockchain-certificates', label: 'Blockchain', icon: Award },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/journey', label: 'Journey', icon: Map },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/digital-badges', label: 'Digital Badges', icon: Shield },
  ];

  const adminNavItems = [
    ...baseNavItems,
    { path: '/admin', label: 'Admin', icon: Settings },
    { path: '/admin?tab=dashboard', label: 'Analytics', icon: BarChart3 },
    { path: '/admin?tab=security', label: 'Security', icon: Shield },
    { path: '/admin?tab=users', label: 'Users', icon: Users },
    { path: '/admin?tab=monitoring', label: 'Database', icon: Database },
  ];

  const getNavItems = () => {
    if (userRole === 'admin') return adminNavItems;
    return baseNavItems;
  };

  const navigationItems = getNavItems();

  // Mobile Bottom Navigation
  if (isMobile) {
    const quickActions = navigationItems.slice(0, 4);
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t" style={{ backgroundColor: themeColors.surface }}>
        <div className="flex justify-around items-center py-2">
          {quickActions.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                location.pathname === path ? 'text-white' : 'text-gray-400'
              }`}
              style={{
                backgroundColor: location.pathname === path ? themeColors.primary : 'transparent'
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]" style={{ backgroundColor: themeColors.surface }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>Navigation</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {navigationItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      location.pathname === path ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: location.pathname === path ? themeColors.primary : 'transparent'
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
                {user && (
                  <Button 
                    onClick={signOut} 
                    variant="outline" 
                    className="w-full mt-4"
                    style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  // Tablet Collapsible Sidebar
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  if (isTablet) {
    return (
      <div className="flex">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="fixed top-4 left-4 z-50"
              style={{ backgroundColor: themeColors.surface }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80" style={{ backgroundColor: themeColors.surface }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center" />
            </div>
            <nav className="space-y-2">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === path ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: location.pathname === path ? themeColors.primary : 'transparent'
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
            
            {user && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-400">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                </div>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  className="w-full"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop Full Navigation
  return (
    <header 
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{ 
        backgroundColor: themeColors.background + 'F0',
        borderColor: themeColors.primary + '20'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center" />

          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === path 
                    ? 'text-white scale-105' 
                    : 'text-gray-400 hover:text-white hover:scale-105'
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
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-gray-400">Logged in as</span>
                  <span className="text-sm font-medium" style={{ color: themeColors.primary }}>
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                </div>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  size="sm"
                  className="hover:scale-105 transition-transform"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  className="hover:scale-105 transition-transform"
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
