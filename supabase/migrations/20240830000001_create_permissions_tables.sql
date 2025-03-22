-- Create role_permissions table to store permissions for each role
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR NOT NULL,
  module VARCHAR NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, module)
);

-- Create user_type_permissions table to store permissions for each user type
CREATE TABLE IF NOT EXISTS user_type_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type VARCHAR NOT NULL,
  module VARCHAR NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_type, module)
);

-- Add user_type column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'user_type') THEN
    ALTER TABLE users ADD COLUMN user_type VARCHAR DEFAULT 'standard';
  END IF;
END $$;

-- Insert default permissions for roles
INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete)
VALUES 
  -- Admin role has full access to everything
  ('admin', 'documents', true, true, true, true),
  ('admin', 'content', true, true, true, true),
  ('admin', 'forums', true, true, true, true),
  ('admin', 'training', true, true, true, true),
  ('admin', 'users', true, true, true, true),
  ('admin', 'news', true, true, true, true),
  ('admin', 'calendar', true, true, true, true),
  ('admin', 'companies', true, true, true, true),
  
  -- Franchise Manager role
  ('franchise_manager', 'documents', true, true, true, false),
  ('franchise_manager', 'content', true, true, true, false),
  ('franchise_manager', 'forums', true, true, true, false),
  ('franchise_manager', 'training', true, true, true, false),
  ('franchise_manager', 'users', true, true, false, false),
  ('franchise_manager', 'news', true, true, true, false),
  ('franchise_manager', 'calendar', true, true, true, false),
  ('franchise_manager', 'companies', true, false, false, false),
  
  -- Employee role
  ('employee', 'documents', true, false, false, false),
  ('employee', 'content', true, false, false, false),
  ('employee', 'forums', true, true, false, false),
  ('employee', 'training', true, false, false, false),
  ('employee', 'users', true, false, false, false),
  ('employee', 'news', true, false, false, false),
  ('employee', 'calendar', true, false, false, false),
  ('employee', 'companies', true, false, false, false)
ON CONFLICT (role, module) DO NOTHING;

-- Insert default permissions for user types
INSERT INTO user_type_permissions (user_type, module, can_view, can_create, can_edit, can_delete)
VALUES 
  -- Internal user type
  ('internal', 'documents', true, true, true, false),
  ('internal', 'content', true, true, true, false),
  ('internal', 'forums', true, true, true, false),
  ('internal', 'training', true, true, true, false),
  ('internal', 'users', true, false, false, false),
  ('internal', 'news', true, false, false, false),
  ('internal', 'calendar', true, true, true, false),
  ('internal', 'companies', true, false, false, false),
  
  -- External user type
  ('external', 'documents', true, false, false, false),
  ('external', 'content', true, false, false, false),
  ('external', 'forums', true, true, false, false),
  ('external', 'training', true, false, false, false),
  ('external', 'users', false, false, false, false),
  ('external', 'news', true, false, false, false),
  ('external', 'calendar', true, false, false, false),
  ('external', 'companies', true, false, false, false),
  
  -- Standard user type
  ('standard', 'documents', true, false, false, false),
  ('standard', 'content', true, false, false, false),
  ('standard', 'forums', true, true, false, false),
  ('standard', 'training', true, false, false, false),
  ('standard', 'users', true, false, false, false),
  ('standard', 'news', true, false, false, false),
  ('standard', 'calendar', true, false, false, false),
  ('standard', 'companies', true, false, false, false)
ON CONFLICT (user_type, module) DO NOTHING;

-- Enable realtime for the new tables
alter publication supabase_realtime add table role_permissions;
alter publication supabase_realtime add table user_type_permissions;
