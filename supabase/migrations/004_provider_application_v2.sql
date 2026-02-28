-- ============================================================
-- Migration 004: Provider Application V2
-- Full multi-step application schema + RLS + storage
-- ============================================================

-- ── Drop old provider_applications (no data in prod yet) ──
DROP TABLE IF EXISTS public.provider_applications CASCADE;

-- ── New provider_applications table ──
CREATE TABLE public.provider_applications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  step_completed   JSONB NOT NULL DEFAULT '{}',
  basic_info       JSONB NOT NULL DEFAULT '{}',
  services_coverage JSONB NOT NULL DEFAULT '{}',
  experience_standards JSONB NOT NULL DEFAULT '{}',
  pricing_availability JSONB NOT NULL DEFAULT '{}',
  submitted_at     TIMESTAMP WITH TIME ZONE,
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT provider_applications_user_unique UNIQUE (user_id)
);

-- ── provider_documents table ──
DROP TABLE IF EXISTS public.provider_documents CASCADE;

CREATE TABLE public.provider_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id  UUID NOT NULL REFERENCES public.provider_applications(id) ON DELETE CASCADE,
  category        TEXT NOT NULL
                  CHECK (category IN (
                    'government_id', 'business_license', 'insurance_certificate',
                    'trade_certification', 'worksafebc', 'background_check',
                    'proof_of_address', 'other'
                  )),
  file_name       TEXT NOT NULL,
  file_path       TEXT NOT NULL,
  file_type       TEXT NOT NULL,
  file_size       INTEGER NOT NULL,
  uploaded_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── Indexes ──
CREATE INDEX idx_provider_applications_user_id ON public.provider_applications(user_id);
CREATE INDEX idx_provider_applications_status  ON public.provider_applications(status);
CREATE INDEX idx_provider_documents_user_id    ON public.provider_documents(user_id);
CREATE INDEX idx_provider_documents_app_id     ON public.provider_documents(application_id);

-- ── updated_at trigger ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_provider_applications ON public.provider_applications;
CREATE TRIGGER set_updated_at_provider_applications
  BEFORE UPDATE ON public.provider_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── RLS: provider_applications ──
ALTER TABLE public.provider_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_select_own" ON public.provider_applications;
DROP POLICY IF EXISTS "app_insert_own" ON public.provider_applications;
DROP POLICY IF EXISTS "app_update_own" ON public.provider_applications;
DROP POLICY IF EXISTS "app_admin_all"  ON public.provider_applications;

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

-- ── RLS: provider_documents ──
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

-- ── Storage bucket: provider-documents (update limits) ──
UPDATE storage.buckets
SET
  public            = false,
  file_size_limit   = 20971520,  -- 20 MB
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/heic', 'image/heif',
    'application/pdf'
  ]
WHERE id = 'provider-documents';

-- ── Storage RLS (recreate clean) ──
DROP POLICY IF EXISTS "provider_documents_upload"     ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_read"       ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_update"     ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_delete"     ON storage.objects;
DROP POLICY IF EXISTS "provider_documents_admin_read" ON storage.objects;

CREATE POLICY "provider_documents_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "provider_documents_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "provider_documents_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "provider_documents_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'provider-documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
