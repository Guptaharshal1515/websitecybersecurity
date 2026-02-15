import { supabase } from '@/integrations/supabase/client';
import { useFeatureFlags } from './useFeatureFlags';

interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export const useAuditLog = () => {
  const { isEnabled } = useFeatureFlags();

  const logAction = async (entry: AuditLogEntry) => {
    if (!isEnabled('audit_logging')) return;

    try {
      // Get client IP (limited in browser environment)
      const ipAddress = '127.0.0.1'; // Placeholder - real IP would come from server
      const userAgent = navigator.userAgent;

      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id || null,
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          details: entry.details,
          ip_address: ipAddress,
          user_agent: userAgent,
        });
    } catch (error) {
      console.error('Error logging audit entry:', error);
    }
  };

  return { logAction };
};