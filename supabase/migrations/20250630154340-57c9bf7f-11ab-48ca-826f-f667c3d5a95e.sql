
-- First, let's ensure we have proper RLS policies for the certificates table
CREATE POLICY "Allow public read access to certificates" ON public.certificates
FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage certificates" ON public.certificates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Same for projects table
CREATE POLICY "Allow public read access to projects" ON public.projects
FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage projects" ON public.projects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Same for tracker_entries table
CREATE POLICY "Allow public read access to tracker_entries" ON public.tracker_entries
FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage tracker_entries" ON public.tracker_entries
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Same for journey_entries table
CREATE POLICY "Allow public read access to journey_entries" ON public.journey_entries
FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage journey_entries" ON public.journey_entries
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on all tables
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_entries ENABLE ROW LEVEL SECURITY;

-- Update the profiles table to have 'visitor' as default role instead of 'viewer'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'viewer'::user_role;

-- Update the handle_new_user function to assign 'viewer' role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'username' = 'guptaharshal' THEN 'admin'::user_role
      ELSE 'viewer'::user_role
    END
  );
  RETURN NEW;
END;
$$;
