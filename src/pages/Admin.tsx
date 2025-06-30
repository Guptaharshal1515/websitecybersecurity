
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CertificateManager } from '@/components/admin/CertificateManager';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { TrackerManager } from '@/components/admin/TrackerManager';
import { JourneyManager } from '@/components/admin/JourneyManager';
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { useToast } from '@/hooks/use-toast';

export const Admin = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  useEffect(() => {
    // Redirect if not admin
    if (!user || userRole !== 'admin') {
      navigate('/');
      toast({ 
        title: 'Access Denied', 
        description: 'Admin privileges required',
        variant: 'destructive' 
      });
    }
  }, [user, userRole, navigate, toast]);

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Denied
            </h2>
            <p style={{ color: themeColors.accent }}>
              Admin access required to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview and quick actions' },
    { id: 'cybersecurity-certs', label: 'Cybersecurity Certificates', description: 'Manage cybersecurity certifications' },
    { id: 'blockchain-certs', label: 'Blockchain Certificates', description: 'Manage blockchain certifications' },
    { id: 'projects', label: 'Projects', description: 'Manage portfolio projects' },
    { id: 'tracker', label: 'Tracker', description: 'Manage learning progress tracker' },
    { id: 'journey', label: 'Journey', description: 'Manage professional journey timeline' },
    { id: 'users', label: 'User Management', description: 'Manage user roles and permissions' },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    toast({ title: `Switched to ${menuItems.find(item => item.id === sectionId)?.label}` });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'cybersecurity-certs':
        return <CertificateManager type="cybersecurity" />;
      case 'blockchain-certs':
        return <CertificateManager type="blockchain" />;
      case 'projects':
        return <ProjectManager />;
      case 'tracker':
        return <TrackerManager />;
      case 'journey':
        return <JourneyManager />;
      case 'users':
        return <UserRoleManager />;
      default:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: themeColors.text }}>
                Admin Dashboard
              </h2>
              <p className="text-lg mb-6" style={{ color: themeColors.accent }}>
                Welcome back! Select a section from the sidebar to manage your website content.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.slice(1).map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:scale-105 transition-transform duration-200 border-0"
                  style={{ backgroundColor: themeColors.surface }}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                      {item.label}
                    </h3>
                    <p className="text-sm" style={{ color: themeColors.accent }}>
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
              <CardHeader>
                <CardTitle style={{ color: themeColors.text }}>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" style={{ color: themeColors.accent }}>
                  <li>• Navigate to the homepage to use live editing features</li>
                  <li>• Changes are automatically saved to the backend</li>
                  <li>• Upload images using the built-in file manager</li>
                  <li>• Manage user roles in the User Management section</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen border-r" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.primary + '20' }}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-8" style={{ color: themeColors.primary }}>
              Admin Panel
            </h1>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    activeSection === item.id ? 'font-medium shadow-lg' : 'hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: activeSection === item.id ? themeColors.primary + '20' : 'transparent',
                    color: activeSection === item.id ? themeColors.primary : themeColors.text,
                    border: activeSection === item.id ? `1px solid ${themeColors.primary}` : '1px solid transparent'
                  }}
                >
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs mt-1 opacity-70">{item.description}</div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
