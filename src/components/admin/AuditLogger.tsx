import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, User, Activity, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: unknown;
  user_agent: string | null;
  created_at: string;
}

export const AuditLogger = () => {
  const { themeColors } = useTheme();
  const { isEnabled } = useFeatureFlags();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    if (!isEnabled('audit_logging')) return;
    fetchLogs();
  }, [isEnabled]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%`);
      }

      if (filterAction) {
        query = query.eq('action', filterAction);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-500';
      case 'logout': return 'bg-blue-500';
      case 'failed_login': return 'bg-red-500';
      case 'route_access': return 'bg-purple-500';
      case 'role_change': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isEnabled('audit_logging')) {
    return null;
  }

  return (
    <Card style={{ backgroundColor: themeColors.surface }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: themeColors.text }}>
          <Activity className="h-5 w-5" />
          Audit Logs
        </CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 space-y-2"
                style={{ borderColor: themeColors.primary + '20' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getActionColor(log.action)} text-white`}>
                      {log.action}
                    </Badge>
                    <span className="text-sm font-medium" style={{ color: themeColors.text }}>
                      {log.resource_type}
                    </span>
                    {log.resource_id && (
                      <span className="text-xs text-gray-400">
                        ID: {log.resource_id}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {formatDate(log.created_at)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {log.user_id && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      User: {log.user_id.slice(0, 8)}...
                    </div>
                  )}
                  {log.ip_address && (
                    <div>IP: {String(log.ip_address)}</div>
                  )}
                </div>

                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="text-xs p-2 rounded" style={{ backgroundColor: themeColors.background }}>
                    <strong>Details:</strong> {JSON.stringify(log.details, null, 2)}
                  </div>
                )}

                {log.user_agent && (
                  <div className="text-xs text-gray-400 truncate">
                    User Agent: {log.user_agent}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};