-- Create news table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id),
  image_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create news_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.news_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Create news_visibility table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.news_visibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  branch TEXT NOT NULL,
  user_type TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_visibility ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all users to read news" ON public.news;
CREATE POLICY "Allow all users to read news"
  ON public.news FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert news" ON public.news;
CREATE POLICY "Allow authenticated users to insert news"
  ON public.news FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow users to update their own news" ON public.news;
CREATE POLICY "Allow users to update their own news"
  ON public.news FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow users to delete their own news" ON public.news;
CREATE POLICY "Allow users to delete their own news"
  ON public.news FOR DELETE
  USING (auth.uid() = author_id);

-- Policies for news_tags
DROP POLICY IF EXISTS "Allow all users to read news_tags" ON public.news_tags;
CREATE POLICY "Allow all users to read news_tags"
  ON public.news_tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert news_tags" ON public.news_tags;
CREATE POLICY "Allow authenticated users to insert news_tags"
  ON public.news_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.news
    WHERE id = news_id AND author_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Allow users to delete their own news_tags" ON public.news_tags;
CREATE POLICY "Allow users to delete their own news_tags"
  ON public.news_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.news
    WHERE id = news_id AND author_id = auth.uid()
  ));

-- Policies for news_visibility
DROP POLICY IF EXISTS "Allow all users to read news_visibility" ON public.news_visibility;
CREATE POLICY "Allow all users to read news_visibility"
  ON public.news_visibility FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert news_visibility" ON public.news_visibility;
CREATE POLICY "Allow authenticated users to insert news_visibility"
  ON public.news_visibility FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.news
    WHERE id = news_id AND author_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Allow users to delete their own news_visibility" ON public.news_visibility;
CREATE POLICY "Allow users to delete their own news_visibility"
  ON public.news_visibility FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.news
    WHERE id = news_id AND author_id = auth.uid()
  ));

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_tags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_visibility;
