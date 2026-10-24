create or replace function public.ops_decide_estimate(p_hash text,p_decision text,p_name text) returns jsonb
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
