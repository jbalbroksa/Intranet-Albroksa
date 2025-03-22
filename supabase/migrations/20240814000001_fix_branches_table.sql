-- Add city column to branches table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'city') THEN
        ALTER TABLE branches ADD COLUMN city TEXT;
    END IF;
END
$$;