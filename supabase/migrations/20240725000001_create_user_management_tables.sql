-- Add new fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS extension TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS telegram_username TEXT,
ADD COLUMN IF NOT EXISTS branch TEXT,
ADD COLUMN IF NOT EXISTS user_type TEXT,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create branches table for reference
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable realtime for branches table
ALTER PUBLICATION supabase_realtime ADD TABLE public.branches;

-- Insert some default branches
INSERT INTO public.branches (name) VALUES
('Sede Central'),
('Sucursal Norte'),
('Sucursal Sur'),
('Sucursal Este'),
('Sucursal Oeste')
ON CONFLICT DO NOTHING;
