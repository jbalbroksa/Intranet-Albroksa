-- Create documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'documents', 'documents', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'documents'
);

-- Set up security policies for the documents bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow authenticated users to update their own documents" ON storage.objects;
CREATE POLICY "Allow authenticated users to update their own documents"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Allow authenticated users to delete their own documents" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete their own documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Allow public read access to documents" ON storage.objects;
CREATE POLICY "Allow public read access to documents"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'documents');
