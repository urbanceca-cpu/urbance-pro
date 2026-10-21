create or replace function public.sync_job_offer() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if new.is_demo then delete from public.job_offers where job_id=new.id;return new;end if;
 if new.status='accepted' and new.partner_id is null then
 insert into public.job_offers(job_id,service_name,service_city,scheduled_date,scheduled_time,payout_amount,service_details,created_at)
 values(new.id,new.service_name,new.service_city,new.scheduled_date,new.scheduled_time::text,new.payout_amount,new.service_details,new.created_at)
 on conflict(job_id) do update set service_name=excluded.service_name,service_city=excluded.service_city,scheduled_date=excluded.scheduled_date,scheduled_time=excluded.scheduled_time,payout_amount=excluded.payout_amount,service_details=excluded.service_details;
 else delete from public.job_offers where job_id=new.id;end if;
 return new;
end$$;
delete from public.job_offers o using public.jobs j where j.id=o.job_id and j.is_demo;
