-- Update RLS policies for journey_entries to restrict viewer access
DROP POLICY IF EXISTS "Anyone can view journey entries" ON journey_entries;

CREATE POLICY "Non-viewers can view journey entries"
ON journey_entries
FOR SELECT
USING (
  get_user_role(auth.uid()) IN ('customer', 'editor', 'admin')
);

-- Update RLS policies for roadmaps to restrict viewer access  
DROP POLICY IF EXISTS "Anyone can view roadmaps" ON roadmaps;

CREATE POLICY "Non-viewers can view roadmaps"
ON roadmaps
FOR SELECT
USING (
  get_user_role(auth.uid()) IN ('customer', 'editor', 'admin')
);

-- Update RLS policies for roadmap_topics to restrict viewer access
DROP POLICY IF EXISTS "Anyone can view roadmap topics" ON roadmap_topics;

CREATE POLICY "Non-viewers can view roadmap topics"
ON roadmap_topics
FOR SELECT
USING (
  get_user_role(auth.uid()) IN ('customer', 'editor', 'admin')
);

-- Update RLS policies for roadmap_subtopics to restrict viewer access
DROP POLICY IF EXISTS "Anyone can view roadmap subtopics" ON roadmap_subtopics;

CREATE POLICY "Non-viewers can view roadmap subtopics"
ON roadmap_subtopics
FOR SELECT
USING (
  get_user_role(auth.uid()) IN ('customer', 'editor', 'admin')
);