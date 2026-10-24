create table public.ops_estimates (
 id uuid primary key default gen_random_uuid(),business_id uuid not null references public.ops_businesses(id),
 private_job_id uuid not null references public.ops_independent_jobs(id),created_by uuid not null references auth.users(id),
 token_hash text not null unique,expires_at timestamptz not null default now()+interval '30 days',
 title text not null,customer_name text not null,issuer_name text not null,scope text not null,
 exclusions text not null default '',subtotal_cents bigint not null check(subtotal_cents>0),tax_cents bigint not null check(tax_cents>=0),total_cents bigint not null,
 status text not null default 'pending' check(status in ('pending','accepted','declined','revoked')),
 signer_name text,decision_at timestamptz,created_at timestamptz not null default now()
);
create index ops_estimates_business_job on public.ops_estimates(business_id,private_job_id,created_at desc);
create table public.ops_work_entries (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.ops_businesses(id),
 private_job_id uuid not null references public.ops_independent_jobs(id),created_by uuid not null references auth.users(id),
 request_id uuid not null unique,kind text not null check(kind in ('expense','time')),category text not null check(category in ('materials','labour','travel','overhead')),
 amount_cents bigint not null check(amount_cents between 0 and 100000000),minutes integer not null default 0 check(minutes between 0 and 1440),
 description text not null,occurred_on date not null,voided boolean not null default false,created_at timestamptz not null default now()
);
create index ops_work_entries_business_job on public.ops_work_entries(business_id,private_job_id);
alter table public.ops_independent_jobs add column duration_minutes integer not null default 120 check(duration_minutes between 15 and 1440);
alter table public.ops_estimates enable row level security;
alter table public.ops_work_entries enable row level security;
revoke all on public.ops_estimates,public.ops_work_entries from anon,authenticated;
grant all on public.ops_estimates,public.ops_work_entries to service_role;
-- Lock a decision once. A second click never changes accepted into declined.
create function public.ops_decide_estimate(p_hash text,p_decision text,p_name text) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare e public.ops_estimates;begin
 perform 1 from public.ops_independent_jobs where id=(select private_job_id from public.ops_estimates where token_hash=p_hash) for update;
 if p_decision not in ('accepted','declined') or length(trim(p_name))<2 or length(p_name)>150 then raise exception 'Invalid decision';end if;
 select * into e from public.ops_estimates where token_hash=p_hash and expires_at>now() for update;
 if not found or e.status='revoked' then raise exception 'Estimate unavailable';end if;
 if e.status<>'pending' then return jsonb_build_object('status',e.status,'decision_at',e.decision_at);end if;
 update public.ops_estimates set status=p_decision,signer_name=trim(p_name),decision_at=now() where id=e.id returning * into e;
 return jsonb_build_object('status',e.status,'decision_at',e.decision_at);
end $$;
revoke all on function public.ops_decide_estimate(text,text,text) from public,anon,authenticated;
grant execute on function public.ops_decide_estimate(text,text,text) to service_role;
create function public.ops_publish_estimate(p_business uuid,p_job uuid,p_actor uuid,p_hash text,p_snapshot jsonb) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare result uuid;begin
 perform 1 from public.ops_independent_jobs where id=p_job and business_id=p_business and status<>'cancelled' for update;
 if not found then raise exception 'Job unavailable';end if;
 if exists(select 1 from public.ops_estimates where private_job_id=p_job and status='accepted') or exists(select 1 from public.ops_invoices where source_independent_job_id=p_job) then raise exception 'This job already has an approved estimate or invoice';end if;
 update public.ops_estimates set status='revoked' where private_job_id=p_job and status='pending';
 insert into public.ops_estimates(business_id,private_job_id,created_by,token_hash,title,customer_name,issuer_name,scope,exclusions,subtotal_cents,tax_cents,total_cents)
 values(p_business,p_job,p_actor,p_hash,p_snapshot->>'title',p_snapshot->>'customer_name',p_snapshot->>'issuer_name',p_snapshot->>'scope',p_snapshot->>'exclusions',(p_snapshot->>'subtotal_cents')::bigint,(p_snapshot->>'tax_cents')::bigint,(p_snapshot->>'total_cents')::bigint) returning id into result;
 return result;
end $$;
revoke all on function public.ops_publish_estimate(uuid,uuid,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_publish_estimate(uuid,uuid,uuid,text,jsonb) to service_role;
create function public.ops_invoice_private_job(p_business uuid,p_job uuid,p_actor uuid,p_tax numeric) returns public.ops_invoices
language plpgsql security invoker set search_path=public,pg_temp as $$
declare j public.ops_independent_jobs;e public.ops_estimates;i public.ops_invoices;b public.ops_businesses;sub bigint;tax bigint;label text;begin
 select * into j from public.ops_independent_jobs where id=p_job and business_id=p_business for update;
 if not found then raise exception 'Private job not found';end if;
 select * into i from public.ops_invoices where source_independent_job_id=p_job;
 if found then return i;end if;
 if j.status='cancelled' or j.revenue_cents<=0 or length(trim(j.address))<5 or j.customer_email not like '%@%.%' then raise exception 'Save valid client details, address and a positive price first';end if;
 select * into b from public.ops_businesses where id=p_business;
 select * into e from public.ops_estimates where private_job_id=p_job order by created_at desc limit 1;
 sub=j.revenue_cents;label=j.title;
 if found and e.status in ('pending','declined') then raise exception 'The current estimate must be accepted before invoicing';end if;
 if e.status='accepted' then sub=e.subtotal_cents;tax=e.tax_cents;label=e.title;
 else
 if p_tax not in (0,0.05) or (p_tax=0.05 and b.gst_number !~ '^\d{9}RT\d{4}$') then raise exception 'Select a supported tax rate and valid GST registration';end if;
 tax=round(sub*p_tax);
 end if;
 insert into public.ops_invoices(source_independent_job_id,business_id,customer_name,customer_email,customer_address,issuer_name,issuer_address,gst_number,items,subtotal_cents,tax_cents,total_cents,due_date,notes,created_by)
 values(j.id,b.id,j.customer_name,j.customer_email,j.address,b.display_name,b.address,b.gst_number,jsonb_build_array(jsonb_build_object('description',label,'quantity',1,'unit_cents',sub)),sub,tax,sub+tax,current_date+14,'Provider-issued invoice for independently sourced work. No Urbance marketplace commission.',p_actor) returning * into i;
 return i;
end $$;
revoke all on function public.ops_invoice_private_job(uuid,uuid,uuid,numeric) from public,anon,authenticated;
grant execute on function public.ops_invoice_private_job(uuid,uuid,uuid,numeric) to service_role;
