-- Set the specific user as admin
UPDATE public.users
SET is_admin = true, role = 'admin'
WHERE email = 'tecnologia.albroksa@gmail.com';

-- Add the user if it doesn't exist
INSERT INTO public.users (id, full_name, email, is_admin, role, created_at, updated_at)
SELECT 
  uuid_generate_v4(),
  'Admin Tecnología',
  'tecnologia.albroksa@gmail.com',
  true,
  'admin',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'tecnologia.albroksa@gmail.com'
);
