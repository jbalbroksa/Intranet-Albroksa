-- Add title column to company_specifications if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_specifications' AND column_name = 'title') THEN
    ALTER TABLE company_specifications ADD COLUMN title TEXT;
  END IF;
END $$;
