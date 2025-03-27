-- Fix subcategories parent_id validation
UPDATE content_subcategories
SET parent_subcategory = NULL
WHERE parent_subcategory = '';

-- Ensure parent_subcategory is a valid UUID or NULL
ALTER TABLE content_subcategories
ADD CONSTRAINT parent_subcategory_check
CHECK (
  parent_subcategory IS NULL
  OR parent_subcategory ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);
