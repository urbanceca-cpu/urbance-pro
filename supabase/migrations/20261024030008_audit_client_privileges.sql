-- Audit repair: table ownership operations are never browser capabilities.
-- No rows are changed. Preserve SELECT/DML privileges and existing RLS policies.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
-- Cover tables subsequently created by the migration owner.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLES FROM PUBLIC, anon, authenticated;
