
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

export const Admin = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  useEffect(() => {
    // Redirect if not admin
    if (!user || userRole !== 'admin') {
      navigate('/');
    }
  }, [user, userRole, navigate]);

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
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cybersecurity-certs', label: 'Cybersecurity Certificates' },
    { id: 'blockchain-certs', label: 'Blockchain Certificates' },
    { id: 'projects', label: 'Projects' },
    { id: 'tracker', label: 'Tracker' },
    { id: 'journey', label: 'Journey' },
  ];

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
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.text }}>
              Welcome to Admin Dashboard
            </h2>
            <p className="mb-4" style={{ color: themeColors.accent }}>
              Select a section from the sidebar to manage your website content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.slice(1).map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="h-20 text-left"
                  style={{ borderColor: themeColors.primary, color: themeColors.text }}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen" style={{ backgroundColor: themeColors.surface }}>
          <div className="p-6">
            <h1 className="text-xl font-bold mb-6" style={{ color: themeColors.primary }}>
              Admin Panel
            </h1>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === item.id ? 'font-medium' : ''
                  }`}
                  style={{
                    backgroundColor: activeSection === item.id ? themeColors.primary + '20' : 'transparent',
                    color: activeSection === item.id ? themeColors.primary : themeColors.text
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
