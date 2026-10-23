create table public.ops_independent_jobs (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.ops_businesses(id),
 created_by uuid not null references auth.users(id), title text not null, customer_name text not null,
 customer_email text not null default '', address text not null default '', scheduled_at timestamptz,
 status text not null check(status in ('lead','estimated','scheduled','in_progress','completed','cancelled')),
 revenue_cents integer not null check(revenue_cents between 0 and 100000000),
 materials_cents integer not null check(materials_cents between 0 and 100000000),
 labour_cents integer not null check(labour_cents between 0 and 100000000),
 travel_cents integer not null check(travel_cents between 0 and 100000000),
 overhead_cents integer not null check(overhead_cents between 0 and 100000000),
 notes text not null default '', created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index ops_independent_business_updated on public.ops_independent_jobs(business_id,updated_at desc);
alter table public.ops_independent_jobs enable row level security;
revoke all on public.ops_independent_jobs from anon,authenticated;
grant all on public.ops_independent_jobs to service_role;
comment on table public.ops_independent_jobs is 'Private contractor-sourced work. No marketplace dispatch, commission, emails or customer-account sharing. API requires billing permission and business ownership.';
