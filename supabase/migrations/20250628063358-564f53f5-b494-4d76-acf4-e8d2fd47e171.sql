
-- Create a table to store web archives
CREATE TABLE public.archives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  description TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index for faster searching
CREATE INDEX archives_url_idx ON public.archives(url);
CREATE INDEX archives_title_idx ON public.archives(title);
CREATE INDEX archives_created_at_idx ON public.archives(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at field
CREATE TRIGGER archives_update_updated_at
  BEFORE UPDATE ON public.archives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
