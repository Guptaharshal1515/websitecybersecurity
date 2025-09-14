-- Add image_url field to journey_entries table for photo uploads
ALTER TABLE public.journey_entries ADD COLUMN image_url text;

-- Add completion_date field to achievements table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='achievements' AND column_name='completion_date') THEN
        ALTER TABLE public.achievements ADD COLUMN completion_date date;
    END IF;
END $$;