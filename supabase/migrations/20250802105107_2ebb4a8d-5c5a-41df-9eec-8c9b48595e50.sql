-- Phase 1: Critical Security Fixes

-- 1. Enable RLS on archives table and add proper policies
ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for archives table
CREATE POLICY "Users can view all archives" 
ON public.archives 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage archives" 
ON public.archives 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- 2. Fix function security issues by adding SET search_path = ''
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role FROM public.profiles WHERE id = user_id;
$function$;

-- 3. Secure the handle_new_user function and remove hardcoded admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    'viewer'::user_role  -- Default to viewer role for security
  );
  RETURN NEW;
END;
$function$;

-- 4. Clean up duplicate RLS policies

-- Remove duplicate certificate policies (keep the most restrictive ones)
DROP POLICY IF EXISTS "Allow admin to manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Allow public read access to certificates" ON public.certificates;

-- Remove duplicate project policies  
DROP POLICY IF EXISTS "Allow admin to manage projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;

-- Remove duplicate journey entry policies
DROP POLICY IF EXISTS "Allow admin to manage journey_entries" ON public.journey_entries;
DROP POLICY IF EXISTS "Allow public read access to journey_entries" ON public.journey_entries;

-- Remove duplicate tracker entry policies
DROP POLICY IF EXISTS "Allow admin to manage tracker_entries" ON public.tracker_entries;
DROP POLICY IF EXISTS "Allow public read access to tracker_entries" ON public.tracker_entries;