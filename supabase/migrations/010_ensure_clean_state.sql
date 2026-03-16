-- ============================================================
-- Migration 010: Ensure clean state for provider applications
-- Run this in the Supabase SQL editor to fix any schema issues.
-- ============================================================

-- 1. Ensure provider_applications has correct JSONB schema
-- (Migration 004 should have already done this, but just in case)
DO $$
BEGIN
  -- Check if step_completed column exists (it wouldn't exist on the v1 schema)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'provider_applications'
    AND column_name = 'step_completed'
  ) THEN
    RAISE NOTICE 'provider_applications is using v1 schema — you need to run migration 004 first';
  ELSE
    RAISE NOTICE 'provider_applications schema is correct (v2 with JSONB columns)';
  END IF;
END
$$;

-- 2. Ensure handle_new_user trigger is correct (no email column)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    new.id,
    'provider',
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Ensure profiles.email is nullable
ALTER TABLE public.profiles
  ALTER COLUMN email DROP NOT NULL;

-- 4. Ensure storage bucket exists with correct settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'provider-documents',
  'provider-documents',
  false,
  20971520,
  ARRAY['image/jpeg','image/png','image/heic','image/heif','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/heic','image/heif','application/pdf'];

-- 5. Clean up ALL storage policies and recreate from scratch
DROP POLICY IF EXISTS "provider_documents_upload"              ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_read"                ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_update"              ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_delete"              ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_admin_read"          ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_admin_all"           ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_public_upload"       ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_public_read"         ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_authenticated_delete" ON storage.objects;

-- Upload: authenticated users can upload to their own folder
CREATE POLICY "provider_documents_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Read: users can read their own files
CREATE POLICY "provider_documents_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update: users can update their own files
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

-- Delete: users can delete their own files
CREATE POLICY "provider_documents_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin: admins can read all documents
CREATE POLICY "provider_documents_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. Ensure RLS is correct for provider_applications
ALTER TABLE public.provider_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_select_own" ON public.provider_applications;
DROP POLICY IF EXISTS "app_insert_own" ON public.provider_applications;
DROP POLICY IF EXISTS "app_update_own" ON public.provider_applications;
DROP POLICY IF EXISTS "app_admin_all"  ON public.provider_applications;
-- Also drop v1 policies if they exist
DROP POLICY IF EXISTS "provider_applications_user_read"    ON public.provider_applications;
DROP POLICY IF EXISTS "provider_applications_admin_read"   ON public.provider_applications;
DROP POLICY IF EXISTS "provider_applications_user_insert"  ON public.provider_applications;
DROP POLICY IF EXISTS "provider_applications_admin_update" ON public.provider_applications;

CREATE POLICY "app_select_own" ON public.provider_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "app_insert_own" ON public.provider_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "app_update_own" ON public.provider_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "app_admin_all" ON public.provider_applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. Ensure RLS is correct for provider_documents
ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doc_select_own"  ON public.provider_documents;
DROP POLICY IF EXISTS "doc_insert_own"  ON public.provider_documents;
DROP POLICY IF EXISTS "doc_delete_own"  ON public.provider_documents;
DROP POLICY IF EXISTS "doc_admin_all"   ON public.provider_documents;

CREATE POLICY "doc_select_own" ON public.provider_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "doc_insert_own" ON public.provider_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "doc_delete_own" ON public.provider_documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "doc_admin_all" ON public.provider_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Done!
SELECT 'Migration 010 complete — all policies and schemas verified.' AS status;
