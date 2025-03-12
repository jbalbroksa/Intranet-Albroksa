-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  mediator_access_url TEXT,
  contact_email TEXT,
  classification TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;

-- Create storage bucket for company logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for public access to company logos
CREATE POLICY "Company logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets' AND path LIKE 'company-logos/%');

-- Allow authenticated users to upload company logos
CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets' AND path LIKE 'company-logos/%');

-- Allow authenticated users to update their own company logos
CREATE POLICY "Authenticated users can update their own company logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets' AND path LIKE 'company-logos/%');
