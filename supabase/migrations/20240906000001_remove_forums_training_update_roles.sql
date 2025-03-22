-- Remove forums and training from role_permissions
DELETE FROM role_permissions WHERE module IN ('forums', 'training');

-- Remove forums and training from user_type_permissions
DELETE FROM user_type_permissions WHERE module IN ('forums', 'training');

-- Update roles: remove 'franchise_manager' and 'employee', keep only 'admin' and add 'user'
DELETE FROM role_permissions WHERE role IN ('franchise_manager', 'employee');

-- Insert permissions for 'user' role
INSERT INTO role_permissions (id, role, module, can_view, can_create, can_edit, can_delete, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'user', 'documents', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'user', 'content', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'user', 'users', false, false, false, false, now(), now()),
  (gen_random_uuid(), 'user', 'news', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'user', 'calendar', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'user', 'companies', true, false, false, false, now(), now())
ON CONFLICT (role, module) DO NOTHING;

-- Clear existing user types
DELETE FROM user_type_permissions;

-- Insert new user types: 'delegacion', 'delegacion_expert', 'colaborador', 'responsable_departamento', 'administrador'
INSERT INTO user_type_permissions (id, user_type, module, can_view, can_create, can_edit, can_delete, created_at, updated_at)
VALUES
  -- Delegación
  (gen_random_uuid(), 'delegacion', 'documents', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion', 'content', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion', 'users', false, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion', 'news', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion', 'calendar', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion', 'companies', true, false, false, false, now(), now()),
  
  -- Delegación Expert
  (gen_random_uuid(), 'delegacion_expert', 'documents', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion_expert', 'content', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion_expert', 'users', false, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion_expert', 'news', true, false, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion_expert', 'calendar', true, true, false, false, now(), now()),
  (gen_random_uuid(), 'delegacion_expert', 'companies', true, false, false, false, now(), now()),
  
  -- Colaborador
  (gen_random_uuid(), 'colaborador', 'documents', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'colaborador', 'content', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'colaborador', 'users', false, false, false, false, now(), now()),
  (gen_random_uuid(), 'colaborador', 'news', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'colaborador', 'calendar', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'colaborador', 'companies', true, false, false, false, now(), now()),
  
  -- Responsable de departamento
  (gen_random_uuid(), 'responsable_departamento', 'documents', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'responsable_departamento', 'content', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'responsable_departamento', 'users', true, true, true, false, now(), now()),
  (gen_random_uuid(), 'responsable_departamento', 'news', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'responsable_departamento', 'calendar', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'responsable_departamento', 'companies', true, true, true, true, now(), now()),
  
  -- Administrador
  (gen_random_uuid(), 'administrador', 'documents', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'administrador', 'content', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'administrador', 'users', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'administrador', 'news', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'administrador', 'calendar', true, true, true, true, now(), now()),
  (gen_random_uuid(), 'administrador', 'companies', true, true, true, true, now(), now())
ON CONFLICT (user_type, module) DO NOTHING;

-- Update existing users to have the new roles/types if needed
UPDATE public.users
SET role = 'admin',
    user_type = 'administrador'
WHERE role NOT IN ('admin', 'user') OR user_type NOT IN ('delegacion', 'delegacion_expert', 'colaborador', 'responsable_departamento', 'administrador');
