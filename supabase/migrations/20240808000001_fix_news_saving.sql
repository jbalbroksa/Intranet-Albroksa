-- Fix news tables and references

-- Ensure news table has correct references
ALTER TABLE IF EXISTS public.news
  DROP CONSTRAINT IF EXISTS news_author_id_fkey,
  ADD CONSTRAINT news_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.news
  DROP CONSTRAINT IF EXISTS news_company_id_fkey,
  ADD CONSTRAINT news_company_id_fkey
  FOREIGN KEY (company_id)
  REFERENCES public.companies(id)
  ON DELETE SET NULL;

-- Ensure news has updated_at column with default
ALTER TABLE IF EXISTS public.news
  ALTER COLUMN updated_at SET DEFAULT now();

-- Add unique constraint to news_tags to prevent duplicates
ALTER TABLE IF EXISTS public.news_tags
  DROP CONSTRAINT IF EXISTS news_tags_news_id_tag_key,
  ADD CONSTRAINT news_tags_news_id_tag_key
  UNIQUE (news_id, tag);

-- Add unique constraint to news_visibility to prevent duplicates
ALTER TABLE IF EXISTS public.news_visibility
  DROP CONSTRAINT IF EXISTS news_visibility_news_id_branch_user_type_key,
  ADD CONSTRAINT news_visibility_news_id_branch_user_type_key
  UNIQUE (news_id, branch, user_type);

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
