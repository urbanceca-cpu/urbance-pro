-- ============================================================
-- Migration 012: Enable Supabase Realtime on the jobs table
-- so booking confirmations from the main website are instantly
-- broadcast to ALL logged-in provider dashboards.
-- ============================================================

-- 1. Enable Realtime replication for the jobs table
-- (adds it to the supabase_realtime publication)
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;

-- 2. Also allow providers to receive realtime events for available jobs
-- The RLS policies from Migration 011 control what rows they can see,
-- and Realtime respects those same policies.

-- 3. Verify Realtime is enabled (informational)
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename = 'jobs';

-- Done!
SELECT 'Migration 012 complete — Realtime enabled on jobs table.' AS status;
