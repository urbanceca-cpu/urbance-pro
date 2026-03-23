-- ============================================================
-- Migration 013: Fix RLS — allow super_admin + admin to see
-- available jobs, and simplify provider check to not require
-- exact role='provider' (allows any authenticated user to browse)
-- ============================================================

-- Drop the overly-restrictive policy from migration 011
DROP POLICY IF EXISTS "jobs_provider_read_available" ON public.jobs;
DROP POLICY IF EXISTS "jobs_provider_update"          ON public.jobs;

-- New policy: ANY authenticated user can read available jobs
-- (status=accepted, no partner yet). RLS for own jobs stays separate.
CREATE POLICY "jobs_read_available" ON public.jobs
  FOR SELECT
  USING (
    status = 'accepted'
    AND partner_id IS NULL
  );

-- New update policy: any authenticated user can accept an available job,
-- and providers can update their own jobs (start/complete)
CREATE POLICY "jobs_provider_update" ON public.jobs
  FOR UPDATE
  USING (
    -- Their own job
    auth.uid() = partner_id
    OR
    -- Accepting an available job
    (status = 'accepted' AND partner_id IS NULL)
  );

-- Done!
SELECT 'Migration 013 complete — all authenticated providers can see available jobs.' AS status;
