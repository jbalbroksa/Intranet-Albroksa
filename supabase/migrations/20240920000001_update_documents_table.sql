-- Add foreign key columns to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS content_id UUID REFERENCES content(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS category VARCHAR,
ADD COLUMN IF NOT EXISTS subcategory VARCHAR;

-- Note: We don't need to alter the publication since it's already defined as FOR ALL TABLES
-- which means all tables are automatically included in the publication
