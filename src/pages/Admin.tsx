import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border border-border bg-card">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              This area is restricted to administrators only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="relative mb-16">
          <h1 className="text-4xl font-bold text-center text-foreground">
            Admin Dashboard
          </h1>
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 rounded mt-2 bg-primary shadow-lg"
            style={{ 
              boxShadow: `0 0 10px hsl(var(--primary))`
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
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-card border border-border" 
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-card-foreground">User Management</h3>
                  <p className="text-sm text-muted-foreground">Manage user roles and permissions (Admin only)</p>
                </div>
              </div>
            </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-card border border-border" 
                onClick={() => setActiveTab('logs')}
              >
                <div className="flex items-center gap-4">
                  <Activity className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-card-foreground">System Logs</h3>
                    <p className="text-sm text-muted-foreground">View system activity</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-card border border-border" 
                onClick={() => setActiveTab('monitoring')}
              >
                <div className="flex items-center gap-4">
                  <Database className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-card-foreground">Database Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Monitor database performance</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-card border border-border" 
                onClick={() => setActiveTab('security')}
              >
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-card-foreground">Security Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Security monitoring</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-card-foreground">Current User</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-card-foreground">Role</h3>
                    <p className="text-muted-foreground capitalize">{userRole}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-card-foreground">Status</h3>
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

          <TabsContent value="security" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogger />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};