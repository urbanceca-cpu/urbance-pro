-- ============================================================
-- Migration 011: Allow providers to see available (unassigned) jobs
-- and ensure bookings from the main website populate the jobs table
-- ============================================================

-- 1. Drop old restrictive jobs policies that only let providers see their OWN jobs
DROP POLICY IF EXISTS "jobs_user_read"  ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_read" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_update" ON public.jobs;

-- 2. Providers can read:
--    a) Jobs assigned to them (their own work)
--    b) Available jobs (accepted, no partner yet) — so they can browse & accept
CREATE POLICY "jobs_provider_read_own" ON public.jobs
  FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "jobs_provider_read_available" ON public.jobs
  FOR SELECT
  USING (
    status = 'accepted'
    AND partner_id IS NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'provider'
    )
  );

-- 3. Admins can read all jobs
CREATE POLICY "jobs_admin_read" ON public.jobs
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Admins can update any job
CREATE POLICY "jobs_admin_update" ON public.jobs
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. Providers can update jobs:
--    - Accept: set partner_id to themselves when status='accepted' and partner_id IS NULL
--    - Start/complete: update status when they are the partner
DROP POLICY IF EXISTS "jobs_provider_update" ON public.jobs;

CREATE POLICY "jobs_provider_update" ON public.jobs
  FOR UPDATE
  USING (
    -- Either it's their job already
    auth.uid() = partner_id
    OR
    -- Or it's available and they're accepting it
    (status = 'accepted' AND partner_id IS NULL AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'provider'
    ))
  );

-- 6. Allow main website (service role) or admin to INSERT jobs (bookings)
--    The main website should use the service_role key to bypass RLS when creating jobs
--    This policy is for any authenticated admin/service-role inserts:
DROP POLICY IF EXISTS "jobs_admin_insert" ON public.jobs;

CREATE POLICY "jobs_admin_insert" ON public.jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Done!
SELECT 'Migration 011 complete — providers can now see available jobs.' AS status;
