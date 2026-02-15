import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

export const SystemLogs = () => {
  const { themeColors } = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Simulate recent system logs
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'User login successful',
        source: 'auth'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        level: 'success',
        message: 'Certificate data updated',
        source: 'database'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        level: 'warning',
        message: 'High memory usage detected',
        source: 'system'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        level: 'info',
        message: 'Profile role updated to editor',
        source: 'database'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        level: 'error',
        message: 'Failed authentication attempt',
        source: 'auth'
      }
    ];
    setLogs(mockLogs);
  }, []);

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  return (
    <Card style={{ backgroundColor: themeColors.surface }}>
      <CardHeader>
        <CardTitle style={{ color: themeColors.text }} className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
              style={{ 
                borderColor: themeColors.accent + '30',
                backgroundColor: themeColors.background
              }}
            >
              {getLogIcon(log.level)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span style={{ color: themeColors.text }} className="text-sm font-medium">
                    {log.message}
                  </span>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: getLevelColor(log.level) + '20',
                      color: getLevelColor(log.level)
                    }}
                  >
                    {log.level.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" style={{ color: themeColors.accent }} />
                  <span style={{ color: themeColors.accent }} className="text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span style={{ color: themeColors.accent }} className="text-xs">
                    • {log.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};