-- Create role_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete)
VALUES
  ('admin', 'documents', true, true, true, true),
  ('admin', 'content', true, true, true, true),
  ('admin', 'forums', true, true, true, true),
  ('admin', 'training', true, true, true, true),
  ('admin', 'users', true, true, true, true),
  ('admin', 'news', true, true, true, true),
  ('admin', 'calendar', true, true, true, true),
  ('admin', 'companies', true, true, true, true)
ON CONFLICT (role, module) DO NOTHING;

-- Insert default franchise_manager permissions if they don't exist
INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete)
VALUES
  ('franchise_manager', 'documents', true, true, true, false),
  ('franchise_manager', 'content', true, true, true, false),
  ('franchise_manager', 'forums', true, true, true, false),
  ('franchise_manager', 'training', true, true, false, false),
  ('franchise_manager', 'users', true, true, true, false),
  ('franchise_manager', 'news', true, true, true, false),
  ('franchise_manager', 'calendar', true, true, true, false),
  ('franchise_manager', 'companies', true, true, true, false)
ON CONFLICT (role, module) DO NOTHING;

-- Insert default employee permissions if they don't exist
INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete)
VALUES
  ('employee', 'documents', true, false, false, false),
  ('employee', 'content', true, false, false, false),
  ('employee', 'forums', true, true, false, false),
  ('employee', 'training', true, false, false, false),
  ('employee', 'users', false, false, false, false),
  ('employee', 'news', true, false, false, false),
  ('employee', 'calendar', true, false, false, false),
  ('employee', 'companies', true, false, false, false)
ON CONFLICT (role, module) DO NOTHING;

-- Insert default user type permissions
INSERT INTO user_type_permissions (user_type, module, can_view, can_create, can_edit, can_delete)
VALUES
  ('internal', 'documents', true, true, true, false),
  ('internal', 'content', true, true, true, false),
  ('internal', 'forums', true, true, true, false),
  ('internal', 'training', true, true, true, false),
  ('internal', 'users', true, false, false, false),
  ('internal', 'news', true, true, true, false),
  ('internal', 'calendar', true, true, true, false),
  ('internal', 'companies', true, true, true, false),
  
  ('external', 'documents', true, false, false, false),
  ('external', 'content', true, false, false, false),
  ('external', 'forums', true, true, false, false),
  ('external', 'training', true, false, false, false),
  ('external', 'users', false, false, false, false),
  ('external', 'news', true, false, false, false),
  ('external', 'calendar', true, false, false, false),
  ('external', 'companies', true, false, false, false),
  
  ('standard', 'documents', true, true, false, false),
  ('standard', 'content', true, false, false, false),
  ('standard', 'forums', true, true, true, false),
  ('standard', 'training', true, false, false, false),
  ('standard', 'users', false, false, false, false),
  ('standard', 'news', true, false, false, false),
  ('standard', 'calendar', true, true, false, false),
  ('standard', 'companies', true, false, false, false)
ON CONFLICT (user_type, module) DO NOTHING;

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
WHERE role IS NULL OR role = '';
