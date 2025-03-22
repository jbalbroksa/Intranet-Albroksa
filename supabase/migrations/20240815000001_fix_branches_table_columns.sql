-- Check if city column exists in branches table, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'city') THEN
        ALTER TABLE branches ADD COLUMN city TEXT;
    END IF;

    -- Ensure all required columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'postal_code') THEN
        ALTER TABLE branches ADD COLUMN postal_code TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'province') THEN
        ALTER TABLE branches ADD COLUMN province TEXT;
    END IF;
END
$$;