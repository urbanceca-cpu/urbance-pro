-- Allow anonymous uploads to provider-documents bucket
-- This is needed for the application form where users haven't logged in yet

-- Drop existing policies
DROP POLICY IF EXISTS "provider_documents_upload" ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_read" ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_delete" ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_admin_read" ON storage.objects;

-- Make bucket public for uploads
UPDATE storage.buckets 
SET public = true 
WHERE id = 'provider-documents';

-- Allow anyone (authenticated or anonymous) to upload documents
CREATE POLICY "provider_documents_public_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'provider-documents');

-- Allow anyone to read documents (they have the URL)
CREATE POLICY "provider_documents_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'provider-documents');

-- Only allow authenticated users to update their own documents
CREATE POLICY "provider_documents_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Only allow authenticated users to delete their own documents
CREATE POLICY "provider_documents_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow admins to manage all documents
CREATE POLICY "provider_documents_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
