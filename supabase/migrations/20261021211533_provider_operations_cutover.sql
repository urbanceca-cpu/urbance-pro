-- Roll out only with the rebuilt provider portal. Tighten legacy access paths.
update storage.buckets set public=false where id='provider-documents';
drop policy if exists "Allow public reads" on storage.objects;
drop policy if exists "provider_documents_upload w7hcrg_0" on storage.objects;
drop policy if exists "Anyone can insert documents" on public.documents;
drop policy if exists "Users can view documents" on public.documents;
create policy documents_owner_read on public.documents for select to authenticated using (
 exists(select 1 from public.provider_applications a where a.id=application_id and a.user_id=(select auth.uid()))
 or exists(select 1 from public.providers p where p.id=provider_id and p.user_id=(select auth.uid())) or public.is_admin()
);
create policy documents_owner_insert on public.documents for insert to authenticated with check (
 exists(select 1 from public.provider_applications a where a.id=application_id and a.user_id=(select auth.uid()) and a.status='draft')
);
drop policy if exists app_update_own on public.provider_applications;
create policy app_update_own on public.provider_applications for update to authenticated
 using(user_id=(select auth.uid()) and status in ('draft','rejected'))
 with check(user_id=(select auth.uid()) and status in ('draft','rejected'));
drop policy if exists approved_providers_read_job_offers on public.job_offers;
drop policy if exists jobs_update_own on public.jobs;
revoke execute on function public.accept_job_offer(uuid) from public,anon,authenticated;

