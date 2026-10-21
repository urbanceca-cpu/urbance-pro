create table public.ops_customer_photos (
 id uuid primary key default gen_random_uuid(),booking_id uuid not null references public.bookings(id),
 user_id uuid not null references auth.users(id),path text not null unique,consent_at timestamptz not null,
 created_at timestamptz not null default now()
);
create index ops_customer_photos_booking_idx on public.ops_customer_photos(booking_id,user_id);
alter table public.ops_customer_photos enable row level security;
revoke all on public.ops_customer_photos from anon,authenticated;
grant all on public.ops_customer_photos to service_role;
