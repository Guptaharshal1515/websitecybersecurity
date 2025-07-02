-- Assign editor role to harshalguptacoc@gmail.com
UPDATE public.profiles 
SET role = 'editor'::user_role 
WHERE username = 'harshalguptacoc@gmail.com';