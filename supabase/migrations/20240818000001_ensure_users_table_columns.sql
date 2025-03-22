-- Ensure users table has all required columns
DO $$ 
BEGIN
    -- Check if users table exists, if not create it
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE public.users (
            id UUID PRIMARY KEY,
            full_name TEXT,
            email TEXT,
            avatar_url TEXT,
            extension TEXT,
            description TEXT,
            telegram_username TEXT,
            branch TEXT,
            role TEXT DEFAULT 'user',
            user_type TEXT DEFAULT 'Empleado',
            is_admin BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        -- Add columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'email') THEN
            ALTER TABLE public.users ADD COLUMN email TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name') THEN
            ALTER TABLE public.users ADD COLUMN full_name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'avatar_url') THEN
            ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'extension') THEN
            ALTER TABLE public.users ADD COLUMN extension TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'description') THEN
            ALTER TABLE public.users ADD COLUMN description TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'telegram_username') THEN
            ALTER TABLE public.users ADD COLUMN telegram_username TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'branch') THEN
            ALTER TABLE public.users ADD COLUMN branch TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') THEN
            ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'user_type') THEN
            ALTER TABLE public.users ADD COLUMN user_type TEXT DEFAULT 'Empleado';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_admin') THEN
            ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'created_at') THEN
            ALTER TABLE public.users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updated_at') THEN
            ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
        END IF;
    END IF;
    
    -- Enable realtime for users table
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    EXCEPTION WHEN OTHERS THEN
        -- Publication might already include this table
        NULL;
    END;
    
    -- Insert a sample user if the table is empty
    IF NOT EXISTS (SELECT FROM public.users LIMIT 1) THEN
        INSERT INTO public.users (id, full_name, email, role, user_type, is_admin, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            'Admin User',
            'admin@example.com',
            'admin',
            'Administrador',
            true,
            now(),
            now()
        );
    END IF;
END $$;