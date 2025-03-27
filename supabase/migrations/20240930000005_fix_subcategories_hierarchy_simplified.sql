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

    -- Update existing subcategories to set parent_id based on name hierarchy
    UPDATE content_subcategories c1
    SET parent_id = c2.id
    FROM content_subcategories c2
    WHERE c1.name LIKE c2.name || '/%'
    AND c1.parent_subcategory IS NULL
    AND c1.id != c2.id;

    -- Update level based on parent_id
    WITH RECURSIVE subcategory_tree AS (
        SELECT id, parent_id, 1 as level
        FROM content_subcategories
        WHERE parent_id IS NULL
        
        UNION ALL
        
        SELECT c.id, c.parent_id, st.level + 1
        FROM content_subcategories c
        JOIN subcategory_tree st ON c.parent_id = st.id
    )
    UPDATE content_subcategories c
    SET level = st.level
    FROM subcategory_tree st
    WHERE c.id = st.id;

    -- Refresh the schema cache
    NOTIFY pgrst, 'reload schema';
END
$$;