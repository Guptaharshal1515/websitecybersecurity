-- Enable realtime for achievements table
ALTER TABLE public.achievements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;

-- CRITICAL SECURITY FIX: Restrict profiles table access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Only allow users to view their own profile details
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- CRITICAL SECURITY FIX: Restrict audit log insertions
-- Drop the insecure policy that allows anyone to insert
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Create a more secure policy that only allows authenticated users to log their own actions
CREATE POLICY "Authenticated users can log own actions"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert audit logs for system actions
CREATE POLICY "Service role can insert audit logs"
ON public.audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);