
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string | null;
  role: 'viewer' | 'customer' | 'admin';
  created_at: string | null;
  updated_at: string | null;
}

export const UserRoleManager = () => {
  const { themeColors } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'viewer' | 'customer' | 'admin' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      toast({ title: 'User role updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error updating user role', description: error.message, variant: 'destructive' });
    }
  });

  const handleRoleChange = (userId: string, newRole: 'viewer' | 'customer' | 'admin') => {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateRoleMutation.mutate({ userId, newRole });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#ef4444';
      case 'customer':
        return '#3b82f6';
      case 'viewer':
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6" style={{ color: themeColors.primary }} />
        <h2 
          className="text-2xl font-bold"
          style={{ color: themeColors.text }}
        >
          User Role Management
        </h2>
      </div>

      <Card style={{ backgroundColor: themeColors.surface }}>
        <CardHeader>
          <CardTitle style={{ color: themeColors.text }}>
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: themeColors.accent + '30' }}>
                  <th className="text-left p-3" style={{ color: themeColors.text }}>Username</th>
                  <th className="text-left p-3" style={{ color: themeColors.text }}>Current Role</th>
                  <th className="text-left p-3" style={{ color: themeColors.text }}>Member Since</th>
                  <th className="text-left p-3" style={{ color: themeColors.text }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b" style={{ borderColor: themeColors.accent + '20' }}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" style={{ color: getRoleColor(user.role) }} />
                        <span style={{ color: themeColors.text }}>
                          {user.username || 'No username'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                        style={{
                          backgroundColor: getRoleColor(user.role) + '20',
                          color: getRoleColor(user.role)
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3" style={{ color: themeColors.accent }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'viewer' | 'customer' | 'admin')}
                          className="px-3 py-1 rounded border text-sm"
                          style={{ 
                            backgroundColor: themeColors.background,
                            borderColor: themeColors.accent + '30',
                            color: themeColors.text
                          }}
                          disabled={updateRoleMutation.isPending}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: themeColors.surface }}>
        <CardContent className="p-4">
          <div className="text-sm" style={{ color: themeColors.accent }}>
            <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>Role Permissions:</h4>
            <ul className="space-y-1">
              <li><strong style={{ color: getRoleColor('viewer') }}>Viewer:</strong> Can only view public content</li>
              <li><strong style={{ color: getRoleColor('customer') }}>Customer:</strong> Can access protected content like Journey and Tracker</li>
              <li><strong style={{ color: getRoleColor('admin') }}>Admin:</strong> Full access to edit website content and manage users</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
