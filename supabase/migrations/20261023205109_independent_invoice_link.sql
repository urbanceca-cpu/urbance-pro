alter table public.ops_invoices add column source_independent_job_id uuid unique references public.ops_independent_jobs(id);
comment on column public.ops_invoices.source_independent_job_id is 'One immutable invoice snapshot per own-client job; repeated draft requests return the original invoice.';
