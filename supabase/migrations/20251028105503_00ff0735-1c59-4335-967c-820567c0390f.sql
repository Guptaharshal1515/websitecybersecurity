-- Create digital_badges table
CREATE TABLE public.digital_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issuer TEXT NOT NULL,
  issue_date DATE,
  badge_image_url TEXT,
  credential_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.digital_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for digital_badges
CREATE POLICY "Anyone can view digital badges"
ON public.digital_badges
FOR SELECT
USING (true);

CREATE POLICY "Editors can manage digital badges"
ON public.digital_badges
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('editor', 'admin')
  )
);

-- Enable realtime for digital_badges
ALTER TABLE public.digital_badges REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.digital_badges;

-- Create trigger for updated_at
CREATE TRIGGER update_digital_badges_updated_at
BEFORE UPDATE ON public.digital_badges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();