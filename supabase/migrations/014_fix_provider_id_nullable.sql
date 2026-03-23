-- ============================================================
-- Migration 014: Drop jobs_partner_id_fkey FK constraint
-- partner_id is a soft reference to the accepting provider.
-- The FK was blocking accepts because new bookings start with
-- partner_id=null and the constraint expects auth.users(id).
-- ============================================================

-- Drop the FK constraint so any authenticated user can accept jobs
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_partner_id_fkey;
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_provider_id_fkey;

-- Done!
SELECT 'Migration 014 complete — partner_id FK constraint removed.' AS status;
