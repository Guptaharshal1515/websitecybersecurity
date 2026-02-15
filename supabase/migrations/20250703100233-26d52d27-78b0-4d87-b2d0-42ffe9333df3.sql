-- Create audit_logs table for tracking user actions (admin-only visibility)
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feature_flags table for temporary feature management
CREATE TABLE public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Feature flags policies (admin only)
CREATE POLICY "Admins can manage feature flags" 
ON public.feature_flags 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Anyone can view enabled feature flags" 
ON public.feature_flags 
FOR SELECT 
USING (enabled = true OR get_user_role(auth.uid()) = 'admin'::user_role);

-- Insert initial feature flags
INSERT INTO public.feature_flags (name, enabled, description) VALUES
('audit_logging', true, 'Track all user actions with timestamps and IP addresses'),
('adaptive_navigation', true, 'Responsive navigation: desktop full nav, tablet sidebar, mobile bottom nav'),
('admin_analytics', true, 'Real-time user engagement metrics for admin dashboard'),
('security_dashboard', true, 'Failed login attempts and suspicious activity monitoring'),
('editor_workflow', true, 'Content workflow with draft-review-publish pipeline'),
('session_management', true, 'Enhanced session management with role-based timeouts'),
('role_based_routing', true, 'Enhanced route protection with role verification');

-- Create trigger for audit log timestamps
CREATE TRIGGER update_audit_logs_updated_at
BEFORE UPDATE ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for feature flags timestamps
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();