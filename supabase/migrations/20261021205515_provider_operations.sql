-- Private operations tables: only authenticated, authorized server routes use these.
create table public.ops_businesses (
 id uuid primary key default gen_random_uuid(), owner_user_id uuid not null unique references auth.users(id),
 display_name text not null, mode text not null default 'individual' check(mode in ('individual','team')),
 city text not null, address text not null default '', phone text not null default '', categories text[] not null default '{}',
 max_travel_km integer not null default 25 check(max_travel_km between 0 and 100),
 gst_number text not null default '', online boolean not null default false, last_seen_at timestamptz,
 repeat_offer_emails boolean not null default true, suspended boolean not null default false,
 is_demo boolean not null default false, created_at timestamptz not null default now()
);
create table public.ops_members (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.ops_businesses(id),
 owner_user_id uuid not null references auth.users(id), user_id uuid not null references auth.users(id),
 name text not null, email text not null, role text not null check(role in ('owner','manager','dispatcher','technician','billing','viewer')),
 permissions text[], active boolean not null default true, created_at timestamptz not null default now(), unique(user_id)
);
create index ops_members_business_idx on public.ops_members(business_id);
create table public.ops_invites (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.ops_businesses(id),
 email text not null, name text not null, role text not null check(role in ('manager','dispatcher','technician','billing','viewer')),
 permissions text[], token_hash text not null unique, expires_at timestamptz not null default now()+interval '7 days',
 accepted_at timestamptz, revoked_at timestamptz, created_by uuid not null references auth.users(id),created_at timestamptz not null default now()
);
create table public.ops_documents (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 application_id uuid references public.provider_applications(id), kind text not null, path text not null unique,
 original_name text not null, expires_at date, verified_at timestamptz, created_at timestamptz not null default now()
);
create index ops_documents_user_idx on public.ops_documents(user_id);
create table public.ops_consents (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 application_id uuid not null references public.provider_applications(id), version text not null,
 acceptances jsonb not null, accepted_at timestamptz not null default now(), unique(application_id,version)
);
alter table public.jobs add column if not exists is_demo boolean not null default false;
create table public.ops_job_state (
 job_id uuid primary key references public.jobs(id), business_id uuid not null references public.ops_businesses(id),
 phase text not null default 'accepted' check(phase in ('accepted','en_route','arrived','in_progress','completed','cancelled')),
 assigned_user_id uuid references auth.users(id), eta_minutes integer check(eta_minutes between 1 and 360),
 en_route_at timestamptz, arrived_at timestamptz, started_at timestamptz, completed_at timestamptz,
 sharing_location boolean not null default false, latitude numeric check(latitude between -90 and 90),
 longitude numeric check(longitude between -180 and 180), location_at timestamptz, updated_at timestamptz not null default now()
);
create index ops_job_state_business_idx on public.ops_job_state(business_id);
create table public.ops_job_events (
 id uuid primary key default gen_random_uuid(),job_id uuid not null references public.jobs(id),
 business_id uuid references public.ops_businesses(id), actor_id uuid references auth.users(id),
 event text not null, detail text not null default '', created_at timestamptz not null default now()
);
create index ops_job_events_job_idx on public.ops_job_events(job_id,created_at);
create table public.ops_job_photos (
 id uuid primary key default gen_random_uuid(),job_id uuid not null references public.jobs(id),
 business_id uuid not null references public.ops_businesses(id), actor_id uuid not null references auth.users(id),
 phase text not null check(phase in ('before','during','after')),path text not null unique,
 caption text not null default '', created_at timestamptz not null default now()
);
create index ops_job_photos_job_idx on public.ops_job_photos(job_id);
create table public.ops_dispatch_offers (
 id uuid primary key default gen_random_uuid(),job_id uuid not null references public.jobs(id),
 business_id uuid not null references public.ops_businesses(id), wave text not null check(wave in ('local','nearby')),
 status text not null default 'open' check(status in ('open','accepted','expired','declined')),
 expires_at timestamptz not null,created_at timestamptz not null default now(),unique(job_id,business_id)
);
create index ops_dispatch_business_idx on public.ops_dispatch_offers(business_id,status);
create table public.ops_outbox (
 id uuid primary key default gen_random_uuid(), event_key text not null unique, business_id uuid references public.ops_businesses(id),
 job_id uuid references public.jobs(id),recipient text not null, subject text not null, body text not null,
 status text not null default 'pending' check(status in ('pending','sending','sent','failed','cancelled')),
 attempts integer not null default 0, next_attempt_at timestamptz not null default now(),lease_until timestamptz,
 delivery_id text,last_error text,created_at timestamptz not null default now(),sent_at timestamptz
);
create index ops_outbox_pending_idx on public.ops_outbox(status,next_attempt_at);
create table public.ops_invoices (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.ops_businesses(id),
 invoice_number text not null unique default 'URB-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),
 customer_name text not null,customer_email text not null, customer_address text not null,
 issuer_name text not null,issuer_address text not null,gst_number text not null default '',items jsonb not null,
 subtotal_cents bigint not null,tax_cents bigint not null,total_cents bigint not null,currency text not null default 'CAD' check(currency='CAD'),
 issued_date date not null default current_date,due_date date not null,notes text not null default '',
 status text not null default 'draft' check(status in ('draft','sent','paid','void')),sent_at timestamptz,paid_at timestamptz,
 created_by uuid not null references auth.users(id),created_at timestamptz not null default now()
);
create index ops_invoices_business_idx on public.ops_invoices(business_id,created_at);
create table public.ops_audit (
 id uuid primary key default gen_random_uuid(),business_id uuid references public.ops_businesses(id),
 actor_id uuid references auth.users(id),action text not null,entity text not null,details jsonb not null default '{}',created_at timestamptz not null default now()
);
create table public.ops_rate_limits (key text primary key, count integer not null, reset_at timestamptz not null);

do $$declare t text;begin
 foreach t in array array['ops_businesses','ops_members','ops_invites','ops_documents','ops_consents','ops_job_state','ops_job_events','ops_job_photos','ops_dispatch_offers','ops_outbox','ops_invoices','ops_audit','ops_rate_limits'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on table public.%I from anon, authenticated',t);
 execute format('grant all on table public.%I to service_role',t);
 end loop;
end$$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('ops-private','ops-private',false,4194304,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do update set public=false;

-- Fail closed for direct application mutations: approval is an administrative act.
create or replace function public.protect_provider_application() returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
 if current_user in ('authenticated','anon') and not public.is_admin() then
  if TG_OP='INSERT' and new.status <> 'draft' then raise exception 'Application must start as draft'; end if;
  if TG_OP='UPDATE' and (new.status is distinct from old.status or new.user_id is distinct from old.user_id) then raise exception 'Application submission and approval are server managed'; end if;
 end if; return new;
end$$;
create trigger protect_provider_application before insert or update on public.provider_applications for each row execute function public.protect_provider_application();

-- Atomic acceptance: validate an open targeted offer, lock the canonical job, expire competitors.
create or replace function public.ops_accept_job(p_job_id uuid,p_business_id uuid,p_actor_id uuid) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare j public.jobs%rowtype;b public.ops_businesses%rowtype;m public.ops_members%rowtype;begin
 select * into b from public.ops_businesses where id=p_business_id and not suspended;
 select * into m from public.ops_members where business_id=p_business_id and user_id=p_actor_id and active;
 if b.id is null or m.id is null or m.role not in ('owner','manager','dispatcher') or (m.permissions is not null and not 'jobs.accept'=any(m.permissions)) then raise exception 'FORBIDDEN';end if;
 if not exists(select 1 from public.provider_applications where user_id=b.owner_user_id and status='approved') then raise exception 'APPROVAL_REQUIRED';end if;
 select * into j from public.jobs where id=p_job_id for update;
 if j.id is null or j.partner_id is not null or j.job_status<>'pending' or j.payment_status<>'paid' or j.is_demo<>b.is_demo then raise exception 'JOB_ALREADY_TAKEN';end if;
 if not exists(select 1 from public.ops_dispatch_offers where job_id=p_job_id and business_id=p_business_id and status='open' and expires_at>now()) then raise exception 'OFFER_EXPIRED';end if;
 update public.jobs set partner_id=b.owner_user_id,status='assigned',job_status='accepted',provider_assigned_at=now(),updated_at=now() where id=p_job_id;
 insert into public.ops_job_state(job_id,business_id,assigned_user_id) values(p_job_id,p_business_id,b.owner_user_id);
 update public.ops_dispatch_offers set status=case when business_id=p_business_id then 'accepted' else 'expired' end where job_id=p_job_id;
 update public.ops_outbox set status='cancelled' where job_id=p_job_id and event_key like 'offer:%' and status in ('pending','failed');
 insert into public.ops_job_events(job_id,business_id,actor_id,event) values(p_job_id,p_business_id,p_actor_id,'accepted');
 return jsonb_build_object('job_id',p_job_id,'accepted',true);
end$$;
revoke all on function public.ops_accept_job(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.ops_accept_job(uuid,uuid,uuid) to service_role;

create or replace function public.ops_claim_mail() returns setof public.ops_outbox language sql security invoker set search_path=public,pg_temp as $$
 update public.ops_outbox set status='sending',attempts=attempts+1,lease_until=now()+interval '5 minutes'
 where id in(select id from public.ops_outbox where ((status in ('pending','failed') and next_attempt_at<=now()) or (status='sending' and lease_until<now())) and attempts<8 order by created_at for update skip locked limit 50) returning *;
$$;
revoke all on function public.ops_claim_mail() from public,anon,authenticated;
grant execute on function public.ops_claim_mail() to service_role;
create or replace function public.ops_take_limit(p_key text,p_limit integer,p_seconds integer) returns boolean language plpgsql security invoker set search_path=public,pg_temp as $$
declare n integer;begin
 insert into ops_rate_limits(key,count,reset_at) values(p_key,1,now()+make_interval(secs=>p_seconds)) on conflict(key) do update set count=case when ops_rate_limits.reset_at<now() then 1 else ops_rate_limits.count+1 end,reset_at=case when ops_rate_limits.reset_at<now() then now()+make_interval(secs=>p_seconds) else ops_rate_limits.reset_at end returning count into n;
 return n<=p_limit;
end$$;
revoke all on function public.ops_take_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.ops_take_limit(text,integer,integer) to service_role;

-- Existing provider job links continue to work; new portal uses authorized server routes.
-- Close document exposure and old mutation/claim bypasses at cutover (see separate rollout migration).

create or replace function public.ops_transition_job(p_job_id uuid,p_actor_id uuid,p_to text,p_eta integer default null) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare s public.ops_job_state%rowtype;m public.ops_members%rowtype;j public.jobs%rowtype;begin
 select * into s from ops_job_state where job_id=p_job_id for update;
 select * into m from ops_members where user_id=p_actor_id and business_id=s.business_id and active;
 if m.id is null or m.role not in ('owner','manager','technician') or (m.permissions is not null and not 'jobs.work'=any(m.permissions)) or (m.role='technician' and s.assigned_user_id is distinct from p_actor_id) then raise exception 'FORBIDDEN';end if;
 if not exists(select 1 from ops_businesses b join provider_applications a on a.user_id=b.owner_user_id where b.id=s.business_id and not b.suspended and a.status='approved') then raise exception 'APPROVAL_REQUIRED';end if;
 select * into j from jobs where id=p_job_id for update;
 if j.job_status in ('cancelled','completed','disputed') then raise exception 'JOB_NOT_ACTIVE';end if;
 if not ((s.phase='accepted' and p_to='en_route') or (s.phase='en_route' and p_to='arrived') or (s.phase='arrived' and p_to='in_progress') or (s.phase='in_progress' and p_to='completed')) then raise exception 'INVALID_TRANSITION';end if;
 if p_to='in_progress' and not exists(select 1 from ops_job_photos where job_id=p_job_id and phase='before') then raise exception 'BEFORE_PHOTO_REQUIRED';end if;
 if p_to='completed' and (select count(distinct phase) from ops_job_photos where job_id=p_job_id)<3 then raise exception 'ALL_PHOTO_STAGES_REQUIRED';end if;
 update ops_job_state set phase=p_to,
 en_route_at=case when p_to='en_route' then now() else en_route_at end,
 arrived_at=case when p_to='arrived' then now() else arrived_at end,
 started_at=case when p_to='in_progress' then now() else started_at end,
 completed_at=case when p_to='completed' then now() else completed_at end,
 eta_minutes=coalesce(p_eta,eta_minutes),
 sharing_location=case when p_to='completed' then false else sharing_location end,
 latitude=case when p_to='completed' then null else latitude end,longitude=case when p_to='completed' then null else longitude end,updated_at=now() where job_id=p_job_id;
 -- Canonical jobs currently accept no en_route value. Keep the fine-grained timeline separately.
 update jobs set status=case when p_to='completed' then 'completed' else status end,
 job_status=case when p_to='completed' then 'completed' when p_to='in_progress' then 'in_progress' else job_status end,
 eta=case when p_eta is not null then p_eta||' minutes (provider estimate)' else eta end,updated_at=now() where id=p_job_id;
 insert into ops_job_events(job_id,business_id,actor_id,event) values(p_job_id,s.business_id,p_actor_id,p_to);
 return jsonb_build_object('job_id',p_job_id,'phase',p_to);
end$$;
revoke all on function public.ops_transition_job(uuid,uuid,text,integer) from public,anon,authenticated;
grant execute on function public.ops_transition_job(uuid,uuid,text,integer) to service_role;

create or replace function public.ops_accept_invite(p_token_hash text,p_user_id uuid,p_email text) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare i public.ops_invites%rowtype;b public.ops_businesses%rowtype;begin
 select * into i from ops_invites where token_hash=p_token_hash and lower(email)=lower(p_email) and accepted_at is null and revoked_at is null and expires_at>now() for update;
 if i.id is null then raise exception 'INVITATION_INVALID';end if;
 select * into b from ops_businesses where id=i.business_id and mode='team' and not suspended;
 if b.id is null then raise exception 'BUSINESS_INACTIVE';end if;
 if exists(select 1 from ops_members where user_id=p_user_id) then raise exception 'ALREADY_A_MEMBER';end if;
 insert into ops_members(business_id,owner_user_id,user_id,name,email,role,permissions) values(b.id,b.owner_user_id,p_user_id,i.name,p_email,i.role,i.permissions);
 update ops_invites set accepted_at=now() where id=i.id;
 insert into ops_audit(business_id,actor_id,action,entity) values(b.id,p_user_id,'invitation.accepted',i.id::text);
 return jsonb_build_object('success',true);
end$$;
revoke all on function public.ops_accept_invite(text,uuid,text) from public,anon,authenticated;
grant execute on function public.ops_accept_invite(text,uuid,text) to service_role;
