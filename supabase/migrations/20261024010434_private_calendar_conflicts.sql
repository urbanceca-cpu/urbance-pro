create extension if not exists btree_gist with schema extensions;
alter table public.ops_independent_jobs add constraint ops_private_calendar_no_overlap exclude using gist (
 business_id extensions.gist_uuid_ops with =,
 tsrange(scheduled_at at time zone 'UTC',(scheduled_at at time zone 'UTC')+duration_minutes*interval '1 minute','[)') with &&
) where (scheduled_at is not null and status in ('scheduled','in_progress'));
