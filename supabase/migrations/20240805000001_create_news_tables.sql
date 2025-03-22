-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  image_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create news tags table
CREATE TABLE IF NOT EXISTS news_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(news_id, tag)
);

-- Create news visibility table
CREATE TABLE IF NOT EXISTS news_visibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  branch TEXT NOT NULL,
  user_type TEXT NOT NULL,
  UNIQUE(news_id, branch, user_type)
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_visibility ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "News select policy" ON news;
CREATE POLICY "News select policy" ON news FOR SELECT USING (true);

DROP POLICY IF EXISTS "News insert policy" ON news;
CREATE POLICY "News insert policy" ON news FOR INSERT WITH CHECK (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "News update policy" ON news;
CREATE POLICY "News update policy" ON news FOR UPDATE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "News delete policy" ON news;
CREATE POLICY "News delete policy" ON news FOR DELETE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Tags policies
DROP POLICY IF EXISTS "News tags select policy" ON news_tags;
CREATE POLICY "News tags select policy" ON news_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "News tags insert policy" ON news_tags;
CREATE POLICY "News tags insert policy" ON news_tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM news 
    WHERE news.id = news_id AND (
      auth.uid() = news.author_id OR 
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    )
  )
);

DROP POLICY IF EXISTS "News tags delete policy" ON news_tags;
CREATE POLICY "News tags delete policy" ON news_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM news 
    WHERE news.id = news_id AND (
      auth.uid() = news.author_id OR 
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    )
  )
);

-- Visibility policies
DROP POLICY IF EXISTS "News visibility select policy" ON news_visibility;
CREATE POLICY "News visibility select policy" ON news_visibility FOR SELECT USING (true);

DROP POLICY IF EXISTS "News visibility insert policy" ON news_visibility;
CREATE POLICY "News visibility insert policy" ON news_visibility FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM news 
    WHERE news.id = news_id AND (
      auth.uid() = news.author_id OR 
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    )
  )
);

DROP POLICY IF EXISTS "News visibility delete policy" ON news_visibility;
CREATE POLICY "News visibility delete policy" ON news_visibility FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM news 
    WHERE news.id = news_id AND (
      auth.uid() = news.author_id OR 
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    )
  )
);

-- Enable realtime
alter publication supabase_realtime add table news;
alter publication supabase_realtime add table news_tags;
alter publication supabase_realtime add table news_visibility;
