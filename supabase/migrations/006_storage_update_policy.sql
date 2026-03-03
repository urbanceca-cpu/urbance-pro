-- ============================================================
-- Migration 006: Add missing UPDATE policy for storage objects
-- Allows providers to replace/overwrite their own uploaded files
-- ============================================================

-- Drop if exists to allow re-run
DROP POLICY IF EXISTS "provider_documents_update" ON storage.objects;

CREATE POLICY "provider_documents_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Also ensure no public access to the bucket
UPDATE storage.buckets
SET public = false
WHERE id = 'provider-documents';
