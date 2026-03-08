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
import { PageTransition } from '@/components/layout/PageTransition';
import { PageHeader } from '@/components/layout/PageHeader';

export const Admin = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || userRole !== 'admin') {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h2>
              <p className="text-muted-foreground">This area is restricted to administrators only.</p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <PageHeader title="Admin Dashboard" subtitle="System management and monitoring." />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pb-16">
            <TabsList className="grid w-full grid-cols-7 mb-8 bg-secondary">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="monitoring">DB</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActiveTab('users')}>
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-primary" />
                    <div><h3 className="font-semibold text-foreground">User Management</h3><p className="text-sm text-muted-foreground">Manage roles & permissions</p></div>
                  </div>
                </Card>
                <Card className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActiveTab('logs')}>
                  <div className="flex items-center gap-4">
                    <Activity className="h-8 w-8 text-primary" />
                    <div><h3 className="font-semibold text-foreground">System Logs</h3><p className="text-sm text-muted-foreground">View system activity</p></div>
                  </div>
                </Card>
                <Card className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActiveTab('monitoring')}>
                  <div className="flex items-center gap-4">
                    <Database className="h-8 w-8 text-primary" />
                    <div><h3 className="font-semibold text-foreground">Database</h3><p className="text-sm text-muted-foreground">Monitor performance</p></div>
                  </div>
                </Card>
                <Card className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActiveTab('security')}>
                  <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-primary" />
                    <div><h3 className="font-semibold text-foreground">Security</h3><p className="text-sm text-muted-foreground">Security monitoring</p></div>
                  </div>
                </Card>
              </div>

              <Card className="glass-card">
                <CardHeader><CardTitle className="text-foreground">System Information</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div><h3 className="font-semibold mb-2 text-foreground">Current User</h3><p className="text-muted-foreground font-mono text-sm">{user.email}</p></div>
                    <div><h3 className="font-semibold mb-2 text-foreground">Role</h3><p className="text-muted-foreground capitalize">{userRole}</p></div>
                    <div><h3 className="font-semibold mb-2 text-foreground">Status</h3><p className="text-primary font-semibold">Active</p></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users"><UserRoleManager /></TabsContent>
            <TabsContent value="logs"><SystemLogs /></TabsContent>
            <TabsContent value="monitoring"><DatabaseMonitoring /></TabsContent>
            <TabsContent value="security"><SecurityDashboard /></TabsContent>
            <TabsContent value="analytics"><SystemAnalytics /></TabsContent>
            <TabsContent value="audit"><AuditLogger /></TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};
