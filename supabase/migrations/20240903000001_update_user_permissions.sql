-- Update admin user to have admin role
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email LIKE '%@admin%';

-- Update all users to have role if not set
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE raw_user_meta_data->>'role' IS NULL;

-- Update public.users table to match
UPDATE public.users
SET role = 'admin'
WHERE role IS NULL;
