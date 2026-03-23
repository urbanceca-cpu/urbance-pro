-- ============================================================
-- Migration 014: Fix jobs table — make provider_id nullable
-- since new bookings from the main website don't have a provider
-- yet (they get assigned when a provider accepts the job).
-- Also make partner_id the canonical "assigned provider" column.
-- ============================================================

-- Make provider_id nullable (it starts null, gets set on accept)
ALTER TABLE public.jobs ALTER COLUMN provider_id DROP NOT NULL;

-- Set provider_id = partner_id for any existing rows where provider_id is null
-- but partner_id is set (keeps data consistent)
UPDATE public.jobs
SET provider_id = partner_id
WHERE provider_id IS NULL AND partner_id IS NOT NULL;

-- Done!
SELECT 'Migration 014 complete — provider_id is now nullable.' AS status;
