
-- Update the handle_new_user function to support the new editor role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'username' = 'guptaharshal' THEN 'admin'::user_role
      ELSE 'viewer'::user_role
    END
  );
  RETURN NEW;
END;
$function$;
