-- Fix the admin user setting
UPDATE users
SET is_admin = true
WHERE role = 'admin';

-- Fix the alter publication syntax
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE users, companies, company_specifications, content, content_subcategories, content_tags, branches;
