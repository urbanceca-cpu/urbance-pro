-- Disabled until credentials, sender and deployment are verified.
do $$ declare worker_id bigint; begin worker_id := cron.schedule('urbance-provider-operations','*/5 * * * *','select ops_internal.worker_ping()'); perform cron.alter_job(worker_id,active:=false); end $$;
