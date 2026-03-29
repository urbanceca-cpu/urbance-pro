-- ============================================================
-- Migration 015: Complete RLS + Realtime fix for jobs table
--
-- Problems this fixes:
--  1. Providers couldn't read their OWN jobs (partner_id = uid)
--     after migration 013 dropped the old "jobs_provider_read_own" policy
--  2. super_admin / admin users couldn't read all jobs
--  3. Reject (cancel) wasn't covered by the UPDATE policy
--  4. Realtime publication may not include the jobs table
-- ============================================================

-- 1. Drop stale / overlapping policies
DROP POLICY IF EXISTS "jobs_read_available"    ON public.jobs;
DROP POLICY IF EXISTS "jobs_provider_update"   ON public.jobs;
DROP POLICY IF EXISTS "jobs_provider_read_own" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_read"        ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_update"      ON public.jobs;
DROP POLICY IF EXISTS "jobs_service_insert"    ON public.jobs;
DROP POLICY IF EXISTS "jobs_read_own"          ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_insert"      ON public.jobs;
DROP POLICY IF EXISTS "jobs_update"            ON public.jobs;

-- 2. SELECT: browse available (unassigned) jobs
CREATE POLICY "jobs_read_available" ON public.jobs
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND status = 'accepted'
    AND partner_id IS NULL
  );

-- 3. SELECT: own assigned jobs
CREATE POLICY "jobs_read_own" ON public.jobs
  FOR SELECT
  USING (auth.uid() = partner_id);

-- 4. SELECT: admins/super_admin see all jobs
CREATE POLICY "jobs_admin_read" ON public.jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- 5. INSERT: admins can insert (service role key bypasses RLS anyway)
CREATE POLICY "jobs_admin_insert" ON public.jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- 6. UPDATE: accept, reject/cancel, start, complete
CREATE POLICY "jobs_update" ON public.jobs
  FOR UPDATE
  USING (
    -- Accept or decline an available job
    (status = 'accepted' AND partner_id IS NULL AND auth.role() = 'authenticated')
    OR
    -- Own job: start / complete
    auth.uid() = partner_id
    OR
    -- Admins can update anything
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- 7. Enable Realtime for jobs table (idempotent)
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;

SELECT 'Migration 015 complete.' AS status;
