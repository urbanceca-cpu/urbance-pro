-- Bound each mail batch to fit the 60-second worker budget. Leases allow recovery.
create or replace function public.ops_claim_mail() returns setof public.ops_outbox language sql security invoker set search_path=public,pg_temp as $$
 update public.ops_outbox set status='sending',attempts=attempts+1,lease_until=now()+interval '5 minutes'
 where id in(select id from public.ops_outbox where ((status in ('pending','failed') and next_attempt_at<=now()) or (status='sending' and lease_until<now())) and attempts<8 order by created_at for update skip locked limit 5) returning *;
$$;
revoke all on function public.ops_claim_mail() from public,anon,authenticated;
grant execute on function public.ops_claim_mail() to service_role;
alter table public.ops_job_state add column if not exists eta_updated_at timestamptz;

-- Give asynchronous requests enough time for a bounded worker invocation.
create or replace function ops_internal.worker_ping() returns bigint
language plpgsql security invoker set search_path=public,pg_temp as $$
declare token text;request_id bigint;begin
 select decrypted_secret into token from vault.decrypted_secrets where name='urbance_ops_worker_token' limit 1;
 if token is null then return null;end if;
 select net.http_get(url:='https://pros.urbance.ca/api/ops/worker',headers:=jsonb_build_object('Authorization','Bearer '||token),timeout_milliseconds:=60000) into request_id;
 return request_id;
end$$;
revoke all on function ops_internal.worker_ping() from public,anon,authenticated;
