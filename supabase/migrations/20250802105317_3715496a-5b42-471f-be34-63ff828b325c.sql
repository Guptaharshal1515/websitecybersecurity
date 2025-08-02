-- Create achievements table for the new achievements showcase
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  certificate_url TEXT,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  display_order INTEGER DEFAULT 0,
  achievement_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage achievements" 
ON public.achievements 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Editors can manage achievements" 
ON public.achievements 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY (ARRAY['editor'::user_role, 'admin'::user_role]));

-- Create additional_certificates table
CREATE TABLE public.additional_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  certificate_url TEXT,
  completion_date DATE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on additional_certificates table
ALTER TABLE public.additional_certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for additional_certificates
CREATE POLICY "Anyone can view additional certificates" 
ON public.additional_certificates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage additional certificates" 
ON public.additional_certificates 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Editors can manage additional certificates" 
ON public.additional_certificates 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY (ARRAY['editor'::user_role, 'admin'::user_role]));

-- Add triggers for updated_at columns
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_additional_certificates_updated_at
BEFORE UPDATE ON public.additional_certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Add 3 dummy certificates to blockchain certificates
INSERT INTO public.certificates (title, description, image_url, certificate_url, completion_date, type, display_order) VALUES
('Certified Blockchain Developer', 'Professional certification in blockchain development and smart contracts', '/placeholder.svg', 'https://example.com/cert1.pdf', '2024-01-15', 'blockchain', 1),
('Ethereum Development Specialist', 'Advanced certification in Ethereum blockchain development and DApp creation', '/placeholder.svg', 'https://example.com/cert2.pdf', '2024-02-20', 'blockchain', 2),
('Cryptocurrency Trading Expert', 'Professional certification in cryptocurrency analysis and trading strategies', '/placeholder.svg', 'https://example.com/cert3.pdf', '2024-03-10', 'blockchain', 3);

-- Remove tracker-related tables completely
DROP TABLE IF EXISTS public.tracker_entries CASCADE;
DROP TABLE IF EXISTS public.tracker_categories CASCADE;