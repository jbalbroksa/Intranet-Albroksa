-- Check if company_id column exists in content table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'company_id') THEN
        ALTER TABLE content ADD COLUMN company_id UUID REFERENCES companies(id);
    END IF;

    -- Make sure the company_id column is properly typed as UUID
    ALTER TABLE content ALTER COLUMN company_id TYPE UUID USING company_id::UUID;

    -- Add index for better performance
    CREATE INDEX IF NOT EXISTS idx_content_company_id ON content(company_id);

    -- Don't try to modify the publication directly since it's FOR ALL TABLES
    -- The content table will be automatically included in the publication
END
$$;