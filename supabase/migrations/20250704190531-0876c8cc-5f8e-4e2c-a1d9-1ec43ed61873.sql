-- Clean up duplicate social media entries, keeping only the latest ones
DELETE FROM public.social_links 
WHERE id IN (
  '0144d809-a283-4c5c-a220-c93ff3c787eb', -- old LinkedIn
  '17da8333-a1d0-4741-aa7e-b162e52ce6d4', -- old GitHub  
  'fec2d3b8-7f4a-4c84-9228-d0523852cd55'  -- old Twitter
);