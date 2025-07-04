import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Database, Activity } from 'lucide-react';
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { SystemLogs } from '@/components/admin/SystemLogs';
import { DatabaseMonitoring } from '@/components/admin/DatabaseMonitoring';
import { SecurityDashboard } from '@/components/admin/SecurityDashboard';
import { SystemAnalytics } from '@/components/admin/SystemAnalytics';
import { AuditLogger } from '@/components/admin/AuditLogger';

export const Admin = () => {
  const { user, userRole } = useAuth();
  const { themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="monitoring">Database Monitoring</TabsTrigger>
            <TabsTrigger value="security">Security Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
              style={{ backgroundColor: themeColors.surface }}
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8" style={{ color: themeColors.primary }} />
                <div>
                  <h3 className="font-semibold" style={{ color: themeColors.text }}>User Management</h3>
                  <p className="text-sm" style={{ color: themeColors.accent }}>Manage user roles and permissions (Admin only)</p>
                </div>
              </div>
            </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
                style={{ backgroundColor: themeColors.surface }}
                onClick={() => setActiveTab('logs')}
              >
                <div className="flex items-center gap-4">
                  <Activity className="h-8 w-8" style={{ color: themeColors.primary }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: themeColors.text }}>System Logs</h3>
                    <p className="text-sm" style={{ color: themeColors.accent }}>View system activity</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
                style={{ backgroundColor: themeColors.surface }}
                onClick={() => setActiveTab('monitoring')}
              >
                <div className="flex items-center gap-4">
                  <Database className="h-8 w-8" style={{ color: themeColors.primary }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: themeColors.text }}>Database Monitoring</h3>
                    <p className="text-sm" style={{ color: themeColors.accent }}>Monitor database performance</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow" 
                style={{ backgroundColor: themeColors.surface }}
                onClick={() => setActiveTab('security')}
              >
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8" style={{ color: themeColors.primary }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: themeColors.text }}>Security Dashboard</h3>
                    <p className="text-sm" style={{ color: themeColors.accent }}>Security monitoring</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card style={{ backgroundColor: themeColors.surface }}>
              <CardHeader>
                <CardTitle style={{ color: themeColors.text }}>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: themeColors.text }}>Current User</h3>
                    <p style={{ color: themeColors.accent }}>{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: themeColors.text }}>Role</h3>
                    <p style={{ color: themeColors.accent }} className="capitalize">{userRole}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: themeColors.text }}>Status</h3>
                    <p className="text-green-400">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserRoleManager />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <SystemLogs />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <DatabaseMonitoring />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogger />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};