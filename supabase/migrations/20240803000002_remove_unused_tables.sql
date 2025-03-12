-- This migration safely removes unused tables from the database

-- First, remove tables from realtime publication if they exist
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if training_courses exists and remove from publication
  SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'training_courses') INTO table_exists;
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS training_courses';
  END IF;
  
  -- Check if user_courses exists and remove from publication
  SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_courses') INTO table_exists;
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS user_courses';
  END IF;
  
  -- Check if forum_threads exists and remove from publication
  SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_threads') INTO table_exists;
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS forum_threads';
  END IF;
  
  -- Check if forum_replies exists and remove from publication
  SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_replies') INTO table_exists;
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS forum_replies';
  END IF;
  
  -- Check if activity_feed exists and remove from publication
  SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'activity_feed') INTO table_exists;
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS activity_feed';
  END IF;
  
  -- Check if activity_comments exists and remove from publication
  SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'activity_comments') INTO table_exists;
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS activity_comments';
  END IF;
END
$$;

-- Now drop the tables if they exist
DROP TABLE IF EXISTS user_courses CASCADE;
DROP TABLE IF EXISTS training_courses CASCADE;
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS forum_threads CASCADE;
DROP TABLE IF EXISTS activity_comments CASCADE;
DROP TABLE IF EXISTS activity_feed CASCADE;
