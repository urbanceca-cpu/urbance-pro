-- ============================================================
-- Migration 005: Ensure provider-documents bucket exists
-- ============================================================

-- Create bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'provider-documents',
  'provider-documents',
  false,
  20971520,
  ARRAY['image/jpeg','image/png','image/heic','image/heif','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit    = 20971520,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/heic','image/heif','application/pdf'];

-- Drop old policies
DROP POLICY IF EXISTS "provider_documents_upload"     ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_read"       ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_update"     ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_delete"     ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_admin_read" ON storage.objects;

-- Upload: authenticated users can upload to their own folder
CREATE POLICY "provider_documents_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Read: users can only read their own files
CREATE POLICY "provider_documents_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete: users can delete their own files
CREATE POLICY "provider_documents_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin read-all
CREATE POLICY "provider_documents_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
