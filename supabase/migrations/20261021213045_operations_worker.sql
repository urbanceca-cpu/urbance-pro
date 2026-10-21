create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;
create schema if not exists ops_internal;
revoke all on schema ops_internal from public,anon,authenticated;

create or replace function ops_internal.worker_ping() returns bigint
language plpgsql security invoker set search_path=public,pg_temp as $$
declare token text;request_id bigint;begin
 select decrypted_secret into token from vault.decrypted_secrets where name='urbance_ops_worker_token' limit 1;
 if token is null then return null;end if;
 select net.http_get(url:='https://pros.urbance.ca/api/ops/worker',headers:=jsonb_build_object('Authorization','Bearer '||token),timeout_milliseconds:=10000) into request_id;
 return request_id;
end$$;
revoke all on function ops_internal.worker_ping() from public,anon,authenticated;

-- Notifications are queued inside the same transaction as their job event.
create or replace function ops_internal.queue_job_event() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
declare j public.jobs%rowtype;email text;provider_email text;begin
 select * into j from public.jobs where id=new.job_id;
 if j.is_demo then return new;end if;
 if j.partner_id is not null then select p.email into provider_email from public.profiles p where p.id=j.partner_id;end if;
 for email in select distinct e from unnest(array[j.customer_email,provider_email]) e where e is not null and e<>'' loop
 insert into public.ops_outbox(event_key,business_id,job_id,recipient,subject,body)
 values('job:'||j.id||':'||new.event||':'||email,new.business_id,j.id,email,
 'Urbance · '||replace(new.event,'_',' ')||' · '||coalesce(j.booking_ref,substr(j.id::text,1,8)),
 'Your home-service booking has an update: '||replace(new.event,'_',' ')||E'.\n\nCustomers: https://www.urbance.ca/bookings\nProviders: https://pros.urbance.ca/dashboard/jobs\n\nFor help: support@urbance.ca.')
 on conflict(event_key) do nothing;
 end loop;
 return new;
end$$;
revoke all on function ops_internal.queue_job_event() from public,anon,authenticated;
create trigger ops_queue_job_event after insert on public.ops_job_events for each row execute function ops_internal.queue_job_event();

create or replace function ops_internal.job_dispatch_event() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
declare s public.ops_job_state%rowtype;begin
 if new.is_demo then return new;end if;
 if TG_OP='INSERT' and new.payment_status='paid' and new.job_status='pending' then
  insert into public.ops_job_events(job_id,event) values(new.id,'booking_confirmed');
  perform ops_internal.worker_ping();
 end if;
 if TG_OP='UPDATE' and new.job_status in ('completed','cancelled') then
  update public.ops_job_state set phase=new.job_status,sharing_location=false,latitude=null,longitude=null,location_at=null,updated_at=now()
  where job_id=new.id and phase<>new.job_status returning * into s;
  if s.job_id is not null then insert into public.ops_job_events(job_id,business_id,event) values(new.id,s.business_id,new.job_status);end if;
  update public.ops_dispatch_offers set status='expired' where job_id=new.id and status='open';
  update public.ops_outbox set status='cancelled' where job_id=new.id and event_key like 'offer:%' and status in ('pending','failed');
 end if;
 return new;
end$$;
revoke all on function ops_internal.job_dispatch_event() from public,anon,authenticated;
create trigger ops_job_dispatch_event after insert or update of job_status on public.jobs for each row execute function ops_internal.job_dispatch_event();

-- Register the recurring worker separately after CRON_SECRET is deployed and
-- the same secret is safely stored in Vault. See scripts/configure-ops-worker.
