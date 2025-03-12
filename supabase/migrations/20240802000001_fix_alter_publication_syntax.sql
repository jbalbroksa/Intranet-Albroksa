-- Fix ALTER PUBLICATION syntax by removing IF EXISTS clause

-- First check if tables exist in the publication
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if user_courses table exists in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_courses'
  ) INTO table_exists;
  
  -- If it exists, remove it
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE user_courses';
  END IF;
  
  -- Check if training_courses table exists in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'training_courses'
  ) INTO table_exists;
  
  -- If it exists, remove it
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE training_courses';
  END IF;
  
  -- Check if activity_feed table exists in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'activity_feed'
  ) INTO table_exists;
  
  -- If it exists, remove it
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE activity_feed';
  END IF;
  
  -- Check if forum_threads table exists in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'forum_threads'
  ) INTO table_exists;
  
  -- If it exists, remove it
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE forum_threads';
  END IF;
  
  -- Check if forum_replies table exists in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'forum_replies'
  ) INTO table_exists;
  
  -- If it exists, remove it
  IF table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE forum_replies';
  END IF;
END
$$;