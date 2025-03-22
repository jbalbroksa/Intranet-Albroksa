-- Add missing columns to branches table if they don't exist
DO $$
BEGIN
    -- Add contact_person column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'contact_person') THEN
        ALTER TABLE branches ADD COLUMN contact_person TEXT;
    END IF;
    
    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'email') THEN
        ALTER TABLE branches ADD COLUMN email TEXT;
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'phone') THEN
        ALTER TABLE branches ADD COLUMN phone TEXT;
    END IF;
    
    -- Add website column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'website') THEN
        ALTER TABLE branches ADD COLUMN website TEXT;
    END IF;
    
    -- Make sure the table is in the realtime publication
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'branches') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE branches;
    END IF;
END
$$;
