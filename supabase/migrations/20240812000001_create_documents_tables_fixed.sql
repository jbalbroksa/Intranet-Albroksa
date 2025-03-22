-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Enable row-level security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
DROP POLICY IF EXISTS "Documents are viewable by everyone" ON documents;
CREATE POLICY "Documents are viewable by everyone"
  ON documents FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Documents can be inserted by authenticated users" ON documents;
CREATE POLICY "Documents can be inserted by authenticated users"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Documents can be updated by the uploader" ON documents;
CREATE POLICY "Documents can be updated by the uploader"
  ON documents FOR UPDATE
  USING (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Documents can be deleted by the uploader" ON documents;
CREATE POLICY "Documents can be deleted by the uploader"
  ON documents FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Create policies for document_tags
DROP POLICY IF EXISTS "Document tags are viewable by everyone" ON document_tags;
CREATE POLICY "Document tags are viewable by everyone"
  ON document_tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Document tags can be inserted by authenticated users" ON document_tags;
CREATE POLICY "Document tags can be inserted by authenticated users"
  ON document_tags FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Document tags can be deleted by authenticated users" ON document_tags;
CREATE POLICY "Document tags can be deleted by authenticated users"
  ON document_tags FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Note: Removed the alter publication statements since supabase_realtime is already defined as FOR ALL TABLES
