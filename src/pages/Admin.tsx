
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Database, Activity } from 'lucide-react';

export const Admin = () => {
  const { user, userRole } = useAuth();
  const { themeColors } = useTheme();

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: themeColors.primary }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Denied
            </h2>
            <p style={{ color: themeColors.accent }}>
              This area is restricted to administrators only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminTools = [
    {
      title: "User Management",
      description: "Manage user roles and permissions",
      icon: Users,
      color: "#dc2626"
    },
    {
      title: "System Logs",
      description: "View application logs and activities",
      icon: Activity,
      color: "#ea580c"
    },
    {
      title: "Database Monitoring",
      description: "Monitor database performance and health",
      icon: Database,
      color: "#ca8a04"
    },
    {
      title: "Security Dashboard",
      description: "Monitor security events and alerts",
      icon: Shield,
      color: "#dc2626"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="relative mb-16">
          <h1 className="text-4xl font-bold text-center text-white">
            Admin Dashboard
          </h1>
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 rounded mt-2"
            style={{ 
              backgroundColor: themeColors.primary,
              boxShadow: `0 0 10px ${themeColors.primary}`
            }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminTools.map((tool, index) => (
            <Card 
              key={tool.title}
              className="border-0 cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: themeColors.surface }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${tool.color}`;
                e.currentTarget.style.border = `2px solid ${tool.color}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.border = '';
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
            <CardHeader>
              <CardTitle className="text-white">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-white">
                <div>
                  <h3 className="font-semibold mb-2">Current User</h3>
                  <p className="text-gray-300">{user.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Role</h3>
                  <p className="text-gray-300 capitalize">{userRole}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p className="text-green-400">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
