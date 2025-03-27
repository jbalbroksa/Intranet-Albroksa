-- Add company_id column to content table
ALTER TABLE content ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS content_company_id_idx ON content(company_id);

-- Update realtime publication
alter publication supabase_realtime add table content;