import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { Database, Users, FileText, Calendar, Target, Award } from 'lucide-react';

interface TableStats {
  name: string;
  count: number;
  icon: React.ReactNode;
}

export const DatabaseMonitoring = () => {
  const { themeColors } = useTheme();
  const [tableStats, setTableStats] = useState<TableStats[]>([]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['database-stats'],
    queryFn: async () => {
      const [
        { count: profilesCount },
        { count: certificatesCount },
        { count: projectsCount },
        { count: journeyCount },
        { count: trackerCount },
        { count: roadmapsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('journey_entries').select('*', { count: 'exact', head: true }),
        supabase.from('tracker_entries').select('*', { count: 'exact', head: true }),
        supabase.from('roadmaps').select('*', { count: 'exact', head: true })
      ]);

      return {
        profiles: profilesCount || 0,
        certificates: certificatesCount || 0,
        projects: projectsCount || 0,
        journey: journeyCount || 0,
        tracker: trackerCount || 0,
        roadmaps: roadmapsCount || 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  useEffect(() => {
    if (stats) {
      setTableStats([
        {
          name: 'User Profiles',
          count: stats.profiles,
          icon: <Users className="h-5 w-5" />
        },
        {
          name: 'Certificates',
          count: stats.certificates,
          icon: <Award className="h-5 w-5" />
        },
        {
          name: 'Projects',
          count: stats.projects,
          icon: <FileText className="h-5 w-5" />
        },
        {
          name: 'Journey Entries',
          count: stats.journey,
          icon: <Calendar className="h-5 w-5" />
        },
        {
          name: 'Tracker Entries',
          count: stats.tracker,
          icon: <Target className="h-5 w-5" />
        },
        {
          name: 'Roadmaps',
          count: stats.roadmaps,
          icon: <Database className="h-5 w-5" />
        }
      ]);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <Card style={{ backgroundColor: themeColors.surface }}>
        <CardContent className="p-6">
          <div style={{ color: themeColors.text }}>Loading database statistics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: themeColors.surface }}>
      <CardHeader>
        <CardTitle style={{ color: themeColors.text }} className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tableStats.map((stat) => (
            <div
              key={stat.name}
              className="p-4 rounded-lg border"
              style={{ 
                borderColor: themeColors.accent + '30',
                backgroundColor: themeColors.background
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{ color: themeColors.primary }}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: themeColors.text }}>
                    {stat.count}
                  </div>
                  <div className="text-sm" style={{ color: themeColors.accent }}>
                    {stat.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
          <h4 className="font-medium mb-2" style={{ color: themeColors.text }}>
            Connection Status
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span style={{ color: themeColors.accent }} className="text-sm">
              Database connected and operational
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};