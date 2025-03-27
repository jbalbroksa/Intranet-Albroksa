-- Ensure all subcategories have the correct parent_id and level
-- This will help with displaying the hierarchical structure correctly

-- First, make sure all top-level subcategories have level=1 and parent_id=null
UPDATE content_subcategories
SET level = 1, parent_id = NULL
WHERE parent_id IS NULL OR parent_id = '';

-- Then, make sure all child subcategories have the correct parent_id and level
-- This query finds subcategories that have a name like 'parent/child' and sets their parent_id
-- to the ID of the parent subcategory
DO $$
DECLARE
    subcat RECORD;
    parent_name TEXT;
    parent_id UUID;
    parent_level INT;
BEGIN
    FOR subcat IN 
        SELECT id, name, parent_category 
        FROM content_subcategories 
        WHERE name LIKE '%/%'
    LOOP
        -- Extract the parent name from the full name
        parent_name := split_part(subcat.name, '/', 1);
        
        -- Find the parent subcategory
        SELECT id, level INTO parent_id, parent_level 
        FROM content_subcategories 
        WHERE name = parent_name AND parent_category = subcat.parent_category;
        
        -- If parent found, update the child
        IF parent_id IS NOT NULL THEN
            UPDATE content_subcategories
            SET parent_id = parent_id, level = parent_level + 1
            WHERE id = subcat.id;
        END IF;
    END LOOP;
END;
$$;

-- Add the subcategories to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE content_subcategories;
