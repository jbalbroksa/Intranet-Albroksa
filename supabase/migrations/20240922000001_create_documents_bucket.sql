-- Check if the documents bucket exists and create it if it doesn't
DO $$
BEGIN
  -- This is a safer approach that doesn't require direct credentials in the migration
  -- Instead, it uses SQL to create the bucket through the storage API
  
  -- Create the documents bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('documents', 'documents', true)
  ON CONFLICT (id) DO NOTHING;
  
  -- Set RLS policies for the documents bucket
  -- Allow authenticated users to read documents
  DROP POLICY IF EXISTS "Allow authenticated users to read documents" ON storage.objects;
  CREATE POLICY "Allow authenticated users to read documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
  
  -- Allow authenticated users to upload documents
  DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
  CREATE POLICY "Allow authenticated users to upload documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
  
  -- Allow users to update their own documents
  DROP POLICY IF EXISTS "Allow users to update their own documents" ON storage.objects;
  CREATE POLICY "Allow users to update their own documents"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'documents' AND owner = auth.uid());
  
  -- Allow users to delete their own documents
  DROP POLICY IF EXISTS "Allow users to delete their own documents" ON storage.objects;
  CREATE POLICY "Allow users to delete their own documents"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'documents' AND owner = auth.uid());
  
  -- Enable RLS on the storage.objects table
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
END
$$;