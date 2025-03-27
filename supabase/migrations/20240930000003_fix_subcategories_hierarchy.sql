-- Add parent_id column to content_subcategories if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_subcategories' AND column_name = 'parent_id') THEN
        ALTER TABLE content_subcategories ADD COLUMN parent_id UUID REFERENCES content_subcategories(id);
    END IF;

    -- Add level column to content_subcategories if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_subcategories' AND column_name = 'level') THEN
        ALTER TABLE content_subcategories ADD COLUMN level INT DEFAULT 1;
    END IF;

    -- Add display_order column to content_subcategories if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_subcategories' AND column_name = 'display_order') THEN
        ALTER TABLE content_subcategories ADD COLUMN display_order INT DEFAULT 0;
    END IF;

    -- Refresh the schema cache
    NOTIFY pgrst, 'reload schema';
END
$$;