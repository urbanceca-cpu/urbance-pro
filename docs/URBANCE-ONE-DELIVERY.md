# Urbance One delivery ledger

User requirement: implement the attached Urbance 2.0 product brief, retain branding, make connected workflows reliable. Own-client tools are free initially (confirmed 23 October 2026); no marketplace commission on independently sourced jobs.

## Existing production foundations
Authenticated provider workspaces, role permissions, onboarding and private documents, atomic job acceptance, dispatch by geography/category, job milestones and photo evidence, customer tracking, 7% marketplace commission, provider invoice records, branded notification delivery, cron worker. Do not interpret these as proof of payment collection or automatic payouts.

## Current increment: independent business workspace
Private own-client pipeline with client contact details, appointment, scope notes, stages, estimated revenue and labour/material/travel/overhead costs; ProfitGuard forecast and JSON export. Server-rendered first response; owner/billing permissions; server-side business isolation; direct Data API blocked for ordinary users. No automatic messages, charges, dispatch, or customer-platform sharing. Maximum 500 recent records per workspace response/export. Not an accounting ledger. Costs and revenue are entered forecasts before tax.

## Still required by the full brief
- Full connected CRM entities, estimates with immutable versions, customer approval and conversion to invoices, secure client portal, payment collection/reconciliation and payout integration.
- Calendar capacity validation, staff assignments/timesheets, expense entries/receipts, actual-versus-forecast profitability and offline field sync with conflict handling.
- Customer change-order approvals, secure job messaging/masked calling, dispute/warranty workflow, recurring services, property/family permissions and HomeTwin service records.
- Vision visual analysis, Shadow voice/text administration with reviewable actions, SkillLens references with qualification boundaries.
- CrewMesh cross-business invitations and limited job permissions; MaterialGraph consent-based inventory and real supplier availability; RouteFill opt-in opportunity matching around calendars.
- End-to-end paid booking and webhook replay tests using Stripe test mode, concurrency tests for acceptance, mobile device checks, notification lifecycle checks, performance budgets and operational alerting.

These are unfinished requirements, not live feature claims. Release each complete workflow with authorization tests and honest UI states. Do not advertise supplier stock, AI diagnosis, guaranteed margins, live ETA routing or automated payouts without the corresponding working integration.

## White workspace and invoice handoff
White dashboard redesign with soft summary cards, dark readable typography and a featured My business entry. Private work has pipeline, calendar and derived client-directory views; job editing opens explicitly. Saved jobs can generate a provider-issued invoice snapshot, with chosen 0% tax or 5% GST subject to registration validation, due in 14 days. Repeated requests return the original invoice. No automatic email, client approval, payment collection or payout is implied. The full requirements above remain active.

## Estimate approvals, cost ledger and calendar integrity — 23 October 2026
- Private, 30-day client estimate review links use random 256-bit tokens stored only as hashes. Links use a URL fragment, not a server-visible query string. No search indexing; no-store API; no-referrer page. Links carry bearer access and must be shared only with the client.
- Customer-facing scope and exclusions are entered separately from private notes. Revisions revoke pending links. Accepted/declined decisions are recorded once with the entered name and timestamp. This is a recorded acknowledgement, not independently verified signer identity.
- Publishing, deciding and invoicing lock the private job to serialize competing actions. Accepted totals remain the invoice price even if the working job estimate changes. Duplicate invoice requests return the existing snapshot.
- Append-only expense and labour-time entries have idempotency IDs; voiding preserves the original record. Price-minus-recorded-cost totals do not imply collected revenue or complete profit accounting. Export now includes estimates and ledger entries within the workspace response limits.
- Scheduled/in-progress private jobs on a business calendar cannot overlap. Duration is entered explicitly. This is one private business calendar, not concurrent crew-capacity planning or live marketplace availability.
- Vision photo observations and Shadow text-note drafts are implemented behind OPS_AI_ENABLED, off by default. They require explicit processing permission and professional review. They never execute actions, change prices or contact clients. AI SDK 7.0.152 uses the live-catalog model openai/gpt-4.1-mini through Vercel OIDC; no retries, 1400 output token cap, 20 company-wide attempts per calendar month and 3 attempts per user/minute.
- User approved CAD $5/month for AI testing. Gateway shows zero credit and requires card verification; no AI paid requests have been enabled. Platform funding/verification and hard budget configuration still require completion before activation.
- Remaining full-document requirements still include distinct CRM/property entities, crew scheduling, receipt uploads, offline conflict resolution, recurring service plans, payments/payout reconciliation, customer messaging/masked calls, dispute workflows, CrewMesh, MaterialGraph supplier integrations, HomeTwin sharing and RouteFill. They are not complete merely because a dashboard section exists.
