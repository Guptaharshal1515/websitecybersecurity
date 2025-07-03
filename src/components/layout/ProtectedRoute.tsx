import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAuditLog } from '@/hooks/useAuditLog';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'editor' | 'customer' | 'viewer';
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const { isEnabled } = useFeatureFlags();
  const { logAction } = useAuditLog();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && isEnabled('role_based_routing')) {
      logAction({
        action: 'route_access',
        resource_type: 'page',
        resource_id: location.pathname,
        details: {
          required_role: requiredRole,
          user_role: userRole,
          allowed: !requiredRole || hasPermission(userRole, requiredRole)
        }
      });
    }
  }, [user, location.pathname, requiredRole, userRole, logAction, isEnabled]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRole && !hasPermission(userRole, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'admin': 4,
    'editor': 3,
    'customer': 2,
    'viewer': 1
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
};