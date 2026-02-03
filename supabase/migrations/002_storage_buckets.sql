-- Create storage bucket for provider documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'provider-documents',
  'provider-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for provider-documents bucket

-- Allow authenticated users to upload their own documents
CREATE POLICY "provider_documents_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read their own documents
CREATE POLICY "provider_documents_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own documents
CREATE POLICY "provider_documents_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own documents
CREATE POLICY "provider_documents_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow admins to read all documents
CREATE POLICY "provider_documents_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Add application_id column to documents table to link documents to applications
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES public.provider_applications(id) ON DELETE CASCADE;

-- Create index for application_id
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON public.documents(application_id);

-- Update documents policy to allow insert for applications (even without provider_id initially)
DROP POLICY IF EXISTS "documents_user_write" ON public.documents;

CREATE POLICY "documents_insert_for_application" ON public.documents
  FOR INSERT WITH CHECK (
    -- Allow if user owns the application
    application_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.provider_applications 
      WHERE id = application_id AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

-- Policy for users to insert their own documents
CREATE POLICY "documents_user_insert" ON public.documents
  FOR INSERT WITH CHECK (
    provider_id = auth.uid()
  );
