# Provider operations rebuild — 21 October 2026

Scope: replace provider acquisition, application, protected workspace, teams, dispatch, job execution, evidence, invoices and notification delivery; preserve the shared customer booking/payment pipeline and 7% commission.

Rules:
- Draft applicants can authenticate only to resume onboarding. Completed applicants can see review status. Only approved, active businesses can work jobs. Staff need an accepted invitation, verified identity and an active membership.
- Every endpoint validates the authenticated user and business membership. Finance and team administration are separate permissions; technicians see only their assigned jobs.
- Dispatch starts with category + city, approved availability and a fresh heartbeat. Expand to neighbouring cities when no local provider is available or a request remains unclaimed for 30 minutes. Acceptance locks the job; all other offers expire in that transaction.
- Verification files and job evidence are private. Signed links expire. Customer details appear only after job acceptance. Job evidence is shared with the owning customer, never all providers.
- Status transitions and evidence timestamps are server-authoritative. Location sharing is explicit, active-job-only and timestamped; routing opens a navigation app. ETA is labelled as provider-supplied unless a routing service is configured.
- Notifications use an outbox, unique event keys, retries and delivery receipts. Offer emails repeat at 30-minute intervals until assignment/cancellation/expiry; a scheduled worker must be configured. Demo records never send external email or enter live dispatch.
- External invoices identify the provider as supplier, are in CAD, and charge GST only when a registration number is recorded. They do not imply automatic payment collection or an Urbance tax registration.
- No completion claim without build, authorization, concurrency and workflow tests. Do not put privileged keys in source or browser bundles.

Existing findings: public provider-document read policies; unrestricted document metadata reads/inserts; self-editable application status; a service-role credential in a historical public test script; incompatible job status fields; all-provider offer visibility. Remove these paths as part of rollout. The exposed legacy credential must be revoked through Supabase project API-key settings (not exposed by the current connector).

Reference requirements: BC PIPA consent/purpose/retention/access; WorkSafeBC status and clearance where applicable; appropriate business/trade licences; Urbance's $2M liability requirement; separate optional marketing consent; CRA invoice disclosures. Legal copy is an operational draft requiring company legal review before representing it as legal assurance.

## Release gates

Production is deliberately paused by `OPS_LIVE_ENABLED=false`. Trusted demo identities can test isolated fixtures. Before collecting real documents or dispatching real jobs:

1. Replace the exposed legacy service credential. Update server environments in both projects and any other consumers, migrate legacy client keys as needed, then revoke/disable the exposed credential in Supabase. Removing a source literal does not revoke its historical value.
2. Configure a verified company sender as `NOTIFICATIONS_FROM` and its `RESEND_API_KEY`; complete actual delivery/retry checks.
3. Review company identity, contractor/consumer terms, privacy purposes/retention, insurance and category requirements with Canadian/BC counsel. The current launch geography is Metro Vancouver, not every province.
4. Deploy both review branches. Verify demo screens and customer tracking, then enable `OPS_LIVE_ENABLED=true` and the disabled `urbance-provider-operations` pg_cron job. Worker runs every five minutes; reminders use 30-minute offer-relative slots and stale queued reminders are discarded. ETA is provider-entered; navigation uses external maps, not a paid routing API.

The invoice feature records provider-issued CAD invoices and manual payment status. It does not collect third-party payments, settle provider bank payouts or create tax registrations. Team location is explicit, limited to active jobs and hidden when stale. No background tracking.

Validation: 6 domain tests; 14 real-backend HTTP workflow/authorization tests (see E2E-RESULTS.json); successful optimized production build. Company email delivery, automated route ETA and cross-device production visual verification remain release checks.
