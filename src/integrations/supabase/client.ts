import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://paancfrieexivtdjitic.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYW5jZnJpZWV4aXZ0ZGppdGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTE3ODAsImV4cCI6MjA2NjY2Nzc4MH0.YcrsWkQnzHpTo8XqbBr5UUvm5oWMlwjWoqEauxPJXMI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);