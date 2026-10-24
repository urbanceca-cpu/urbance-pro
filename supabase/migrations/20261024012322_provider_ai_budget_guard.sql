create table public.ops_ai_monthly_budget (
 month text primary key,reserved_cad_cents integer not null default 0 check(reserved_cad_cents between 0 and 500)
);
create table public.ops_ai_usage (
 id uuid primary key default gen_random_uuid(),business_id uuid not null references public.ops_businesses(id),user_id uuid not null references auth.users(id),
 month text not null references public.ops_ai_monthly_budget(month),reserved_cad_cents integer not null default 25 check(reserved_cad_cents=25),
 status text not null default 'reserved' check(status in ('reserved','completed','failed')),input_tokens integer,output_tokens integer,created_at timestamptz not null default now()
);
alter table public.ops_ai_monthly_budget enable row level security;
alter table public.ops_ai_usage enable row level security;
revoke all on public.ops_ai_monthly_budget,public.ops_ai_usage from anon,authenticated;
grant all on public.ops_ai_monthly_budget,public.ops_ai_usage to service_role;
create function public.ops_reserve_ai_budget(p_business uuid,p_user uuid) returns uuid language plpgsql security invoker set search_path=public,pg_temp as $$
declare m text;reservation uuid;begin
 m=to_char(now() at time zone 'America/Vancouver','YYYY-MM');
 insert into public.ops_ai_monthly_budget(month) values(m) on conflict do nothing;
 update public.ops_ai_monthly_budget set reserved_cad_cents=reserved_cad_cents+25 where month=m and reserved_cad_cents<=475;
 if not found then return null;end if;
 insert into public.ops_ai_usage(business_id,user_id,month) values(p_business,p_user,m) returning id into reservation;
 return reservation;
end $$;
revoke all on function public.ops_reserve_ai_budget(uuid,uuid) from public,anon,authenticated;
grant execute on function public.ops_reserve_ai_budget(uuid,uuid) to service_role;
