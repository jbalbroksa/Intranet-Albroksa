-- Fix news tables and references

-- Check if company_id column exists in news table, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'company_id') THEN
    ALTER TABLE public.news ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ensure news has updated_at column with default
ALTER TABLE IF EXISTS public.news
  ALTER COLUMN updated_at SET DEFAULT now();

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

-- Ensure RLS is enabled but with proper policies
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Update policies to allow admins to manage all news
DROP POLICY IF EXISTS "Allow users to update their own news" ON public.news;
CREATE POLICY "Allow users to update their own news"
  ON public.news FOR UPDATE
  USING (auth.uid() = author_id OR 
         EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Allow users to delete their own news" ON public.news;
CREATE POLICY "Allow users to delete their own news"
  ON public.news FOR DELETE
  USING (auth.uid() = author_id OR 
         EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Update policies for news_tags to allow admins
DROP POLICY IF EXISTS "Allow users to delete their own news_tags" ON public.news_tags;
CREATE POLICY "Allow users to delete their own news_tags"
  ON public.news_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.news
    WHERE id = news_id AND (author_id = auth.uid() OR 
                           EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  ));

-- Update policies for news_visibility to allow admins
DROP POLICY IF EXISTS "Allow users to delete their own news_visibility" ON public.news_visibility;
CREATE POLICY "Allow users to delete their own news_visibility"
  ON public.news_visibility FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.news
    WHERE id = news_id AND (author_id = auth.uid() OR 
                           EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  ));

-- Make sure realtime is enabled
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
