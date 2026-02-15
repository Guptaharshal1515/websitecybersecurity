-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('certificates', 'certificates', true),
  ('projects', 'projects', true),
  ('profiles', 'profiles', true),
  ('social-icons', 'social-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for certificates bucket
CREATE POLICY "Certificates are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certificates');

CREATE POLICY "Editors can upload certificates" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certificates' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can update certificates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'certificates' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can delete certificates" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'certificates' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

-- Create storage policies for projects bucket
CREATE POLICY "Projects are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects');

CREATE POLICY "Editors can upload projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projects' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can update projects" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projects' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can delete projects" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projects' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

-- Create storage policies for profiles bucket
CREATE POLICY "Profiles are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Editors can upload profiles" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profiles' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can update profiles" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profiles' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can delete profiles" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profiles' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

-- Create storage policies for social-icons bucket
CREATE POLICY "Social icons are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'social-icons');

CREATE POLICY "Editors can upload social icons" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'social-icons' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can update social icons" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'social-icons' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

CREATE POLICY "Editors can delete social icons" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'social-icons' AND (auth.uid() IS NOT NULL) AND (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin'))
));

-- Add completion_date to certificates table
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS completion_date DATE;

-- Add completion_date to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS completion_date DATE;

-- Add resource_link to journey_entries table
ALTER TABLE public.journey_entries ADD COLUMN IF NOT EXISTS resource_link TEXT;

-- Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for social_links
CREATE POLICY "Anyone can view social links" 
ON public.social_links 
FOR SELECT 
USING (true);

CREATE POLICY "Editors can manage social links" 
ON public.social_links 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

-- Create tracker_categories table
CREATE TABLE IF NOT EXISTS public.tracker_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT DEFAULT '📝',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tracker_categories
ALTER TABLE public.tracker_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for tracker_categories
CREATE POLICY "Anyone can view tracker categories" 
ON public.tracker_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Editors can manage tracker categories" 
ON public.tracker_categories 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

-- Add category_id to tracker_entries
ALTER TABLE public.tracker_entries ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.tracker_categories(id);

-- Update RLS policies for content management
CREATE POLICY "Editors can manage homepage content" 
ON public.homepage_content 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage certificates" 
ON public.certificates 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage projects" 
ON public.projects 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage journey entries" 
ON public.journey_entries 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage tracker entries" 
ON public.tracker_entries 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage roadmaps" 
ON public.roadmaps 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage roadmap topics" 
ON public.roadmap_topics 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

CREATE POLICY "Editors can manage roadmap subtopics" 
ON public.roadmap_subtopics 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('editor', 'admin')));

-- Create triggers for updated_at columns
CREATE TRIGGER update_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tracker_categories_updated_at
BEFORE UPDATE ON public.tracker_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();