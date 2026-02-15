import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, AlertTriangle, Key, Activity } from 'lucide-react';

interface SecurityMetric {
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export const SecurityDashboard = () => {
  const { themeColors } = useTheme();
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);

  useEffect(() => {
    // Simulate security metrics
    const securityMetrics: SecurityMetric[] = [
      {
        label: 'Active Sessions',
        value: 3,
        status: 'good',
        icon: <Activity className="h-4 w-4" />
      },
      {
        label: 'Failed Login Attempts (24h)',
        value: 2,
        status: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />
      },
      {
        label: 'RLS Policies Active',
        value: 12,
        status: 'good',
        icon: <Shield className="h-4 w-4" />
      },
      {
        label: 'Admin Accounts',
        value: 1,
        status: 'good',
        icon: <Key className="h-4 w-4" />
      }
    ];

    setMetrics(securityMetrics);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'good':
      default:
        return '#10b981';
    }
  };

  return (
    <Card style={{ backgroundColor: themeColors.surface }}>
      <CardHeader>
        <CardTitle style={{ color: themeColors.text }} className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border"
              style={{ 
                borderColor: themeColors.accent + '30',
                backgroundColor: themeColors.background
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ color: getStatusColor(metric.status) }}>
                    {metric.icon}
                  </div>
                  <span style={{ color: themeColors.text }} className="text-sm font-medium">
                    {metric.label}
                  </span>
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: getStatusColor(metric.status) }}
                >
                  {metric.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium" style={{ color: themeColors.text }}>
            Recent Security Events
          </h4>
          <div className="space-y-2">
            {[
              {
                time: '2 minutes ago',
                event: 'User role updated to editor',
                severity: 'info'
              },
              {
                time: '1 hour ago',
                event: 'Admin login successful',
                severity: 'success'
              },
              {
                time: '3 hours ago',
                event: 'Failed login attempt detected',
                severity: 'warning'
              }
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded border"
                style={{ 
                  borderColor: themeColors.accent + '20',
                  backgroundColor: themeColors.background
                }}
              >
                <span style={{ color: themeColors.text }} className="text-sm">
                  {event.event}
                </span>
                <span style={{ color: themeColors.accent }} className="text-xs">
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};