-- First, update any empty strings to NULL in parent_subcategory column
UPDATE content_subcategories
SET parent_subcategory = NULL
WHERE parent_subcategory = '';

-- Update parent_id to NULL where it's an empty string
UPDATE content_subcategories
SET parent_id = NULL
WHERE parent_id = '';

-- Add a check constraint to ensure parent_subcategory is either NULL or a valid UUID
ALTER TABLE content_subcategories
DROP CONSTRAINT IF EXISTS parent_subcategory_check;

ALTER TABLE content_subcategories
ADD CONSTRAINT parent_subcategory_check CHECK (
  parent_subcategory IS NULL OR 
  parent_subcategory ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);

-- Add a check constraint to ensure parent_id is either NULL or a valid UUID
ALTER TABLE content_subcategories
DROP CONSTRAINT IF EXISTS parent_id_check;

ALTER TABLE content_subcategories
ADD CONSTRAINT parent_id_check CHECK (
  parent_id IS NULL OR 
  parent_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);
