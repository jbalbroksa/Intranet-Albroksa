-- Drop forum-related tables
DROP TABLE IF EXISTS forum_replies;
DROP TABLE IF EXISTS forum_threads;

-- Remove from realtime publication if they exist
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS forum_replies;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS forum_threads;
