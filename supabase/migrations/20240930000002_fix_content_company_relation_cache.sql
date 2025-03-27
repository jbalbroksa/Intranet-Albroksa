-- Fix the relationship between content and company_id in the schema cache
DO $$
BEGIN
    -- Ensure the company_id column exists and is properly typed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'company_id') THEN
        ALTER TABLE content ADD COLUMN company_id UUID REFERENCES companies(id);
    END IF;

    -- Make sure the company_id column is properly typed as UUID
    ALTER TABLE content ALTER COLUMN company_id TYPE UUID USING company_id::UUID;

    -- Add index for better performance
    CREATE INDEX IF NOT EXISTS idx_content_company_id ON content(company_id);
    
    -- Refresh the schema cache to fix the relationship issue
    NOTIFY pgrst, 'reload schema';
END
$$;