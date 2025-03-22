-- Ensure email column exists in users table
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
        -- Add the column
        ALTER TABLE public.users ADD COLUMN email TEXT;
    END IF;
    
    -- Update the schema cache
    NOTIFY pgrst, 'reload schema';
END
$$;