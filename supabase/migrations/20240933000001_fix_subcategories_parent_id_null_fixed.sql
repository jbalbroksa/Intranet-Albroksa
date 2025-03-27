-- Fix subcategories parent_id NULL values
-- This migration fixes the issue with empty strings in parent_subcategory column

-- Update records where parent_subcategory is NULL or empty string
UPDATE content_subcategories
SET parent_subcategory = NULL
WHERE parent_subcategory IS NULL OR parent_subcategory = '';

-- Update records where parent_id is NULL or empty string
UPDATE content_subcategories
SET parent_id = NULL
WHERE parent_id IS NULL OR parent_id = '';
