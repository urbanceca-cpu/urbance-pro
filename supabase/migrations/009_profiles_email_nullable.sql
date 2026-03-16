-- Migration 009: Fix profiles.email NOT NULL constraint
-- The handle_new_user trigger doesn't insert email (auth.users.email is not
-- accessible from AFTER INSERT triggers on auth.users in Supabase).
-- Make email nullable so the trigger succeeds, then backfill via the API route.

ALTER TABLE public.profiles
  ALTER COLUMN email DROP NOT NULL;
