-- Secure launch-wide realtime offers and atomic first-provider acceptance.
-- Available offers intentionally omit customer identity, phone and exact address.

CREATE OR REPLACE FUNCTION public.is_approved_provider(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.provider_applications a
    WHERE a.user_id = p_user_id AND a.status = 'approved'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = p_user_id AND p.role IN ('admin', 'super_admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_approved_provider(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_approved_provider(uuid) TO authenticated;

CREATE TABLE IF NOT EXISTS public.job_offers (
  job_id uuid PRIMARY KEY REFERENCES public.jobs(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  service_city text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time text,
  payout_amount numeric(10,2) NOT NULL DEFAULT 0,
  service_details text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- A paid customer booking can create at most one provider job.
CREATE UNIQUE INDEX IF NOT EXISTS jobs_booking_id_unique
ON public.jobs (booking_id)
WHERE booking_id IS NOT NULL;

DROP POLICY IF EXISTS "approved_providers_read_job_offers" ON public.job_offers;
CREATE POLICY "approved_providers_read_job_offers"
ON public.job_offers FOR SELECT
USING (public.is_approved_provider(auth.uid()));

CREATE OR REPLACE FUNCTION public.sync_job_offer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND NEW.partner_id IS NULL THEN
    INSERT INTO public.job_offers (
      job_id, service_name, service_city, scheduled_date, scheduled_time,
      payout_amount, service_details, created_at
    ) VALUES (
      NEW.id, NEW.service_name, NEW.service_city, NEW.scheduled_date,
      NEW.scheduled_time::text, NEW.payout_amount, NEW.service_details, NEW.created_at
    )
    ON CONFLICT (job_id) DO UPDATE SET
      service_name = EXCLUDED.service_name,
      service_city = EXCLUDED.service_city,
      scheduled_date = EXCLUDED.scheduled_date,
      scheduled_time = EXCLUDED.scheduled_time,
      payout_amount = EXCLUDED.payout_amount,
      service_details = EXCLUDED.service_details;
  ELSE
    DELETE FROM public.job_offers WHERE job_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_job_offer_trigger ON public.jobs;
CREATE TRIGGER sync_job_offer_trigger
AFTER INSERT OR UPDATE OF status, partner_id, service_name, service_city,
  scheduled_date, scheduled_time, payout_amount, service_details
ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.sync_job_offer();

INSERT INTO public.job_offers (
  job_id, service_name, service_city, scheduled_date, scheduled_time,
  payout_amount, service_details, created_at
)
SELECT id, service_name, service_city, scheduled_date, scheduled_time::text,
  payout_amount, service_details, created_at
FROM public.jobs
WHERE status = 'accepted' AND partner_id IS NULL
ON CONFLICT (job_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.accept_job_offer(p_job_id uuid)
RETURNS SETOF public.jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job public.jobs%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_approved_provider(auth.uid()) THEN
    RAISE EXCEPTION 'APPROVED_PROVIDER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  UPDATE public.jobs
  SET partner_id = auth.uid(), status = 'assigned', updated_at = now()
  WHERE id = p_job_id AND status = 'accepted' AND partner_id IS NULL
  RETURNING * INTO v_job;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'JOB_ALREADY_TAKEN' USING ERRCODE = 'P0001';
  END IF;

  RETURN NEXT v_job;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_job_offer(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_job_offer(uuid) TO authenticated;

-- Available jobs are no longer directly readable: this protects private booking data.
DROP POLICY IF EXISTS "jobs_read_available" ON public.jobs;
DROP POLICY IF EXISTS "jobs_provider_read_available" ON public.jobs;
DROP POLICY IF EXISTS "jobs_provider_read_own" ON public.jobs;
DROP POLICY IF EXISTS "jobs_read_own" ON public.jobs;
CREATE POLICY "jobs_read_own" ON public.jobs
FOR SELECT USING (
  auth.uid() = partner_id AND public.is_approved_provider(auth.uid())
);

DROP POLICY IF EXISTS "jobs_update" ON public.jobs;
DROP POLICY IF EXISTS "jobs_provider_update" ON public.jobs;
CREATE POLICY "jobs_update_own" ON public.jobs
FOR UPDATE
USING (
  auth.uid() = partner_id AND public.is_approved_provider(auth.uid())
)
WITH CHECK (
  auth.uid() = partner_id AND public.is_approved_provider(auth.uid())
);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.job_offers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
