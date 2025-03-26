-- Add missing columns to content_subcategories if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_subcategories' AND column_name = 'parent_subcategory') THEN
    ALTER TABLE content_subcategories ADD COLUMN parent_subcategory UUID REFERENCES content_subcategories(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_subcategories' AND column_name = 'level') THEN
    ALTER TABLE content_subcategories ADD COLUMN level INTEGER DEFAULT 1;
  END IF;

  -- Update existing content_subcategories to set level=1 if null
  UPDATE content_subcategories SET level = 1 WHERE level IS NULL;

  -- Create specification_subcategories table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'specification_subcategories') THEN
    CREATE TABLE specification_subcategories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      parent_category TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
  
  -- Add subcategory column to company_specifications if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_specifications' AND column_name = 'subcategory') THEN
    ALTER TABLE company_specifications ADD COLUMN subcategory UUID REFERENCES specification_subcategories(id) ON DELETE SET NULL;
  END IF;
END $$;
