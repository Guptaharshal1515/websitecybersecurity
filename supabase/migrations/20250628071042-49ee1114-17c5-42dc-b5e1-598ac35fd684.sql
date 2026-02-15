
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('viewer', 'customer', 'admin');

-- Create profiles table for user role management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create homepage content table
CREATE TABLE public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_image_url TEXT,
  welcome_message TEXT,
  introduction TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  about_bio TEXT,
  contact_email TEXT DEFAULT 'minecgupta@outlook.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  certificate_url TEXT,
  type TEXT CHECK (type IN ('cybersecurity', 'blockchain')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journey timeline table
CREATE TABLE public.journey_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  entry_date DATE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracker table
CREATE TABLE public.tracker_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('Course', 'Certificate', 'Custom')) NOT NULL,
  proof_link TEXT,
  completion_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap table
CREATE TABLE public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap topics table
CREATE TABLE public.roadmap_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap subtopics table
CREATE TABLE public.roadmap_subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.roadmap_topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resource_link TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page layouts table
CREATE TABLE public.page_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT UNIQUE NOT NULL,
  layout_type TEXT CHECK (layout_type IN ('arc', 'cards')) DEFAULT 'cards',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for content tables (public read, admin write)
CREATE POLICY "Anyone can view homepage content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins can manage certificates" ON public.certificates FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view journey entries" ON public.journey_entries FOR SELECT USING (true);
CREATE POLICY "Admins can manage journey entries" ON public.journey_entries FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for tracker (customers can mark complete, admins manage)
CREATE POLICY "Anyone can view tracker entries" ON public.tracker_entries FOR SELECT USING (true);
CREATE POLICY "Customers can update completion status" ON public.tracker_entries FOR UPDATE USING (
  public.get_user_role(auth.uid()) IN ('customer', 'admin') AND 
  (completed_by IS NULL OR completed_by = auth.uid())
);
CREATE POLICY "Admins can manage tracker entries" ON public.tracker_entries FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for roadmap
CREATE POLICY "Anyone can view roadmaps" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "Admins can manage roadmaps" ON public.roadmaps FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view roadmap topics" ON public.roadmap_topics FOR SELECT USING (true);
CREATE POLICY "Admins can manage roadmap topics" ON public.roadmap_topics FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view roadmap subtopics" ON public.roadmap_subtopics FOR SELECT USING (true);
CREATE POLICY "Customers can update subtopic completion" ON public.roadmap_subtopics FOR UPDATE USING (
  public.get_user_role(auth.uid()) IN ('customer', 'admin') AND 
  (completed_by IS NULL OR completed_by = auth.uid())
);
CREATE POLICY "Admins can manage roadmap subtopics" ON public.roadmap_subtopics FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view page layouts" ON public.page_layouts FOR SELECT USING (true);
CREATE POLICY "Admins can manage page layouts" ON public.page_layouts FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'username' = 'guptaharshal' THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default homepage content
INSERT INTO public.homepage_content (
  welcome_message,
  introduction,
  github_url,
  linkedin_url,
  about_bio,
  contact_email
) VALUES (
  'Welcome to WebsiteCyberSec',
  'Cybersecurity Professional & Blockchain Enthusiast',
  'https://github.com',
  'https://linkedin.com',
  'Passionate about cybersecurity and blockchain technology.',
  'minecgupta@outlook.com'
);

-- Insert default page layouts
INSERT INTO public.page_layouts (page_name, layout_type) VALUES
('cybersecurity-certificates', 'cards'),
('blockchain-certificates', 'cards'),
('projects', 'cards');

-- Create update triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_entries_updated_at BEFORE UPDATE ON public.journey_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracker_entries_updated_at BEFORE UPDATE ON public.tracker_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON public.roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_layouts_updated_at BEFORE UPDATE ON public.page_layouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
