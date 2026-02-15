import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from './useFeatureFlags';
import { useToast } from './use-toast';

const ROLE_TIMEOUTS = {
  admin: 2 * 60 * 60 * 1000, // 2 hours
  editor: 4 * 60 * 60 * 1000, // 4 hours
  customer: 8 * 60 * 60 * 1000, // 8 hours
  viewer: 8 * 60 * 60 * 1000, // 8 hours
};

const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const useSessionManagement = () => {
  const { user, userRole, signOut } = useAuth();
  const { isEnabled } = useFeatureFlags();
  const { toast } = useToast();
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (!isEnabled('session_management') || !user) return;

    const timeout = ROLE_TIMEOUTS[userRole] || ROLE_TIMEOUTS.viewer;
    const warningTimeout = timeout - WARNING_TIME;

    // Show warning before logout
    const warningTimer = setTimeout(() => {
      if (!warningShown) {
        setWarningShown(true);
        toast({
          title: "Session Expiring Soon",
          description: "Your session will expire in 5 minutes. Please save your work.",
          duration: 10000,
        });
      }
    }, warningTimeout);

    // Auto logout
    const logoutTimer = setTimeout(() => {
      toast({
        title: "Session Expired",
        description: "You have been automatically logged out for security.",
        variant: "destructive",
      });
      signOut();
    }, timeout);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [user, userRole, isEnabled, warningShown, toast, signOut]);

  return { warningShown };
};