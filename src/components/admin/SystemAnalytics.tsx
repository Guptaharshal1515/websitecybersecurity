import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Users, Eye, Clock, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  avgSessionTime: number;
  topPages: Array<{ page: string; views: number; }>;
  userActivity: Array<{ hour: number; count: number; }>;
}

export const SystemAnalytics = () => {
  const { themeColors } = useTheme();
  const { isEnabled } = useFeatureFlags();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    pageViews: 0,
    avgSessionTime: 0,
    topPages: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isEnabled('admin_analytics')) return;

    const fetchAnalytics = async () => {
      try {
        // Fetch user counts
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch audit logs for activity analysis
        const { data: auditLogs } = await supabase
          .from('audit_logs')
          .select('*')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        // Calculate metrics from audit logs
        const uniqueUsers = new Set(auditLogs?.map(log => log.user_id).filter(Boolean)).size;
        const pageViews = auditLogs?.filter(log => log.action === 'route_access').length || 0;

        // Calculate top pages
        const pageAccess = auditLogs?.filter(log => log.action === 'route_access') || [];
        const pageCount = pageAccess.reduce((acc, log) => {
          const page = log.resource_id || 'unknown';
          acc[page] = (acc[page] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topPages = Object.entries(pageCount)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Calculate hourly activity
        const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
          const count = auditLogs?.filter(log => {
            const logHour = new Date(log.created_at).getHours();
            return logHour === hour;
          }).length || 0;
          return { hour, count };
        });

        setAnalytics({
          totalUsers: totalUsers || 0,
          activeUsers: uniqueUsers,
          pageViews,
          avgSessionTime: Math.floor(Math.random() * 600 + 300), // Mock data
          topPages,
          userActivity: hourlyActivity
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isEnabled]);

  if (!isEnabled('admin_analytics')) {
    return null;
  }

  if (loading) {
    return (
      <Card style={{ backgroundColor: themeColors.surface }}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8" style={{ color: themeColors.primary }} />
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold" style={{ color: themeColors.text }}>
                  {analytics.totalUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8" style={{ color: themeColors.primary }} />
              <div>
                <p className="text-sm text-gray-400">Active Users (24h)</p>
                <p className="text-2xl font-bold" style={{ color: themeColors.text }}>
                  {analytics.activeUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Eye className="h-8 w-8" style={{ color: themeColors.primary }} />
              <div>
                <p className="text-sm text-gray-400">Page Views (24h)</p>
                <p className="text-2xl font-bold" style={{ color: themeColors.text }}>
                  {analytics.pageViews}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8" style={{ color: themeColors.primary }} />
              <div>
                <p className="text-sm text-gray-400">Avg Session (mins)</p>
                <p className="text-2xl font-bold" style={{ color: themeColors.text }}>
                  {Math.floor(analytics.avgSessionTime / 60)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardHeader>
            <CardTitle style={{ color: themeColors.text }}>Top Pages (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: themeColors.text }}>
                    {index + 1}. {page.page === '/' ? 'Home' : page.page.replace('/', '')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: themeColors.primary,
                        width: `${Math.max(20, (page.views / analytics.topPages[0]?.views) * 100)}px`
                      }}
                    />
                    <span className="text-sm text-gray-400">{page.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardHeader>
            <CardTitle style={{ color: themeColors.text }}>Hourly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {analytics.userActivity.map((activity) => (
                <div
                  key={activity.hour}
                  className="flex-1 bg-opacity-60 rounded-t flex flex-col justify-end"
                  style={{ 
                    backgroundColor: themeColors.primary + '60',
                    height: `${Math.max(4, (activity.count / Math.max(...analytics.userActivity.map(a => a.count))) * 100)}%`
                  }}
                  title={`${activity.hour}:00 - ${activity.count} activities`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};