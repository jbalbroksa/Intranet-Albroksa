-- Create initial permissions for roles
INSERT INTO role_permissions (id, role, module, can_view, can_create, can_edit, can_delete, created_at, updated_at)
VALUES
  -- Admin role has all permissions by default
  (gen_random_uuid(), 'admin', 'documents', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'content', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'forums', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'training', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'users', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'news', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'calendar', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'admin', 'companies', true, true, true, true, now(), now()),
  
  -- Franchise manager role
  (gen_random_uuid(), 'franchise_manager', 'documents', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'content', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'forums', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'training', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'users', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'news', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'calendar', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'franchise_manager', 'companies', true, true, true, false, now(), now()),
  
  -- Employee role
  (gen_random_uuid(), 'employee', 'documents', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'content', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'forums', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'training', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'users', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'news', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'calendar', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'employee', 'companies', true, false, false, false, now(), now())
ON CONFLICT (role, module) DO NOTHING;

-- Create initial permissions for user types
INSERT INTO user_type_permissions (id, user_type, module, can_view, can_create, can_edit, can_delete, created_at, updated_at)
VALUES
  -- Internal user type
  (gen_random_uuid(), 'internal', 'documents', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'internal', 'content', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'internal', 'forums', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'internal', 'training', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'internal', 'users', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'internal', 'news', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'internal', 'calendar', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'internal', 'companies', true, true, true, false, now(), now()),
  
  -- External user type
  (gen_random_uuid(), 'external', 'documents', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'content', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'forums', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'training', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'users', false, false, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'news', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'calendar', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'external', 'companies', true, false, false, false, now(), now()),
  
  -- Standard user type
  (gen_random_uuid(), 'standard', 'documents', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'content', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'forums', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'training', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'users', false, false, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'news', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'calendar', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'standard', 'companies', true, false, false, false, now(), now())
ON CONFLICT (user_type, module) DO NOTHING;
