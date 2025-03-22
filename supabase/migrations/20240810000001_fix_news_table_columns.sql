-- Check if updated_at column exists in news table, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'updated_at') THEN
    ALTER TABLE public.news ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- Check if company_id column exists in news table, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'company_id') THEN
    ALTER TABLE public.news ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add unique constraint to news_tags to prevent duplicates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_tags_news_id_tag_key') THEN
    ALTER TABLE IF EXISTS public.news_tags
      ADD CONSTRAINT news_tags_news_id_tag_key
      UNIQUE (news_id, tag);
  END IF;
END $$;

-- Add unique constraint to news_visibility to prevent duplicates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_visibility_news_id_branch_user_type_key') THEN
    ALTER TABLE IF EXISTS public.news_visibility
      ADD CONSTRAINT news_visibility_news_id_branch_user_type_key
      UNIQUE (news_id, branch, user_type);
  END IF;
END $$;

-- Make sure realtime is enabled
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
