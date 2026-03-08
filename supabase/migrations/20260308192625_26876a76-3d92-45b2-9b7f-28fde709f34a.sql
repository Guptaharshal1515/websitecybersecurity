CREATE OR REPLACE VIEW public.roadmap_subtopics_safe 
WITH (security_invoker = on) AS
SELECT 
  id, topic_id, title, is_completed,
  CASE
    WHEN completed_by = auth.uid() THEN completed_by
    WHEN public.get_user_role(auth.uid()) = 'admin'::public.user_role THEN completed_by
    ELSE NULL
  END AS completed_by,
  display_order, created_at, resource_link
FROM public.roadmap_subtopics;