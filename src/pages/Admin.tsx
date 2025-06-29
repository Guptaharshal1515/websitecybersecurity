
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, FileText, Award, FolderOpen, Map, Clock, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Admin = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const adminSections = [
    {
      title: 'Website Content',
      icon: FileText,
      description: 'Manage homepage content, about section, and social media links',
      items: ['Homepage Text', 'Social Media Links', 'Profile Picture', 'About Me Section']
    },
    {
      title: 'Certificates Management',
      icon: Award,
      description: 'Add, edit, and organize cybersecurity and blockchain certificates',
      items: ['Cybersecurity Certificates', 'Blockchain Certificates', 'Certificate Images', 'Display Order']
    },
    {
      title: 'Projects Management',
      icon: FolderOpen,
      description: 'Manage project portfolio and showcase your work',
      items: ['Project Details', 'Project Images', 'Technologies Used', 'Project Links']
    },
    {
      title: 'Journey Timeline',
      icon: Map,
      description: 'Update your personal and professional journey milestones',
      items: ['Timeline Events', 'Date Management', 'Milestone Descriptions', 'Event Categories']
    },
    {
      title: 'Skills Tracker',
      icon: Clock,
      description: 'Track and display your learning progress and achievements',
      items: ['Skills & Courses', 'Completion Dates', 'Certificate Links', 'Progress Tags']
    },
    {
      title: 'Roadmap Planning',
      icon: BarChart3,
      description: 'Plan and visualize your learning and career roadmap',
      items: ['Learning Paths', 'Semester Goals', 'Technology Trees', 'Resource Links']
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage user roles and access permissions',
      items: ['User Roles', 'Access Control', 'User Analytics', 'Account Settings']
    },
    {
      title: 'Site Settings',
      icon: Settings,
      description: 'Configure global site settings and preferences',
      items: ['Theme Settings', 'SEO Configuration', 'Analytics Setup', 'Backup & Export']
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: themeColors.primary }}
          >
            Admin Dashboard
          </h1>
          <p 
            className="text-lg"
            style={{ color: themeColors.accent }}
          >
            Manage your portfolio website content and settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Card 
              key={section.title}
              className={`border-0 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer pixel-glitch-card pixel-glitch-delay-${(index % 4) + 1}`}
              style={{ 
                backgroundColor: themeColors.surface,
                boxShadow: `0 4px 20px ${themeColors.primary}20`
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle 
                  className="flex items-center gap-3 text-lg"
                  style={{ color: themeColors.text }}
                >
                  <section.icon className="h-6 w-6" style={{ color: themeColors.primary }} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p 
                  className="text-sm mb-4"
                  style={{ color: themeColors.accent }}
                >
                  {section.description}
                </p>
                
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="flex items-center gap-2 text-sm p-2 rounded"
                      style={{ backgroundColor: themeColors.background }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: themeColors.primary }}
                      />
                      <span style={{ color: themeColors.text }}>{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full mt-4"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Manage {section.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card 
            className="border-0 pixel-glitch-card"
            style={{ backgroundColor: themeColors.surface }}
          >
            <CardHeader>
              <CardTitle 
                className="text-xl"
                style={{ color: themeColors.text }}
              >
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Add Certificate</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <FolderOpen className="h-5 w-5" />
                  <span className="text-xs">New Project</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <Map className="h-5 w-5" />
                  <span className="text-xs">Update Journey</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2"
                  style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Site Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
