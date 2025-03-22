-- Create role_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY,
  role VARCHAR NOT NULL,
  module VARCHAR NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT FALSE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, module)
);

-- Create user_type_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_type_permissions (
  id UUID PRIMARY KEY,
  user_type VARCHAR NOT NULL,
  module VARCHAR NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT FALSE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_type, module)
);

-- Insert default admin permissions if they don't exist
INSERT INTO role_permissions (id, role, module, can_view, can_create, can_edit, can_delete, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'admin', 'documents', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'content', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'forums', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'training', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'users', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'news', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'calendar', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'companies', true, true, true, true, now(), now())
ON CONFLICT (role, module) DO NOTHING;

-- Update all users to have admin role if not set
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
