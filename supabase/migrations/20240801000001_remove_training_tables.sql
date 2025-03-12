-- Drop training-related tables
DROP TABLE IF EXISTS user_courses;
DROP TABLE IF EXISTS training_courses;

-- Remove from realtime publication if they exist
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS user_courses;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS training_courses;
