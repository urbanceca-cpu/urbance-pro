# Feature audit

Status describes inspected production unless explicitly marked prepared. Working means only the stated evidence scope passed.

| Area | Classification | Evidence / gap |
|---|---|---|
| Customer public pages | Partially Working | Nine selected routes returned 200; exhaustive buttons, accessibility, device journeys not verified. |
| Customer email login/profile | Partially Working | Existing authorization/profile tests pass; fresh email verification/reset delivery not tested. |
| Google sign-in | Broken | Enabled in Supabase settings, but live login/signup pages expose no Google control. Repair prepared; real Google round trip still not verified. |
| Shared signup profile creation | Broken | Auth trigger hardcodes provider role and omits email; 29 profiles have null email. Trigger/backfill repair prepared. |
| Customer saved quotes | Partially Working | Authenticated persistence/history/resume code and existing regression coverage present; abandonment recovery events/timers/preferences missing. |
| Residential and office quote routing | Partially Working | Office browser request asks square footage; conversation tests preserve office context. Full priced journeys and all quantity boundaries not verified. |
| Plumbing/electrical/appliance/painting quote | Broken | Existing prompt treats specialized trades as handyman; approved distinct automated pricing is absent. Manual-review safeguards prepared; automated category pricing remains missing. |
| Checkout integrity | Partially Working | Server quotes and ownership checks tested; preview could fall back to a live key. Fail-closed repair prepared. Policy acceptance evidence missing. |
| Stripe fulfillment | Partially Working | Signed events and unique job indexes present. Several DB errors were ignored; retry fix prepared. Multi-write settlement is not transactional. |
| Refunds/disputes/payouts/reconciliation | Missing / Not Verified | No verified full money movement and ledger workflow. Provider earnings are estimates, not reconciled payouts. |
| Provider signup/onboarding | Partially Working | Account/app/document steps implemented; load errors could masquerade as signed-out state. Retry repair prepared. New-account SMTP/verification/upload/review journey not tested end-to-end. |
| Application approval | Partially Working | Server role checks and required-document validation exist. Real reviewer workflow not verified; newest/old document handling needs further coverage. |
| Documents/photos | Partially Working | Both buckets private; MIME/size/magic checks and ownership controls exist. Real new-provider upload and malware scanning not verified. |
| Provider dashboard/roles | Working within tested scope | Seven live read-only checks pass; technician restrictions and business isolation verified. |
| Mobile dashboards | Not Verified | Responsive source exists; no physical iPhone/Android/tablet or complete mobile checkout test this run. |
| Dispatch | Partially Working | Approval/presence/category/radius checks and atomic first-winner RPC exist. Wrong repair category and invalid timestamp bugs fixed locally. Explicit approved coverage and specialized credentials need completion. |
| Dispatch waves/escalation | Partially Working | City-first then radius after 30 minutes or no locals. No admin-configurable three-wave system or verified no-provider escalation. |
| Job progress and tracking | Partially Working | Phase/photo checks and ownership tests exist; no full newly paid booking-to-completion simulation. |
| Company email | Partially Working | Resend sender previously tested; outbox retries/dedupe exist. Complete event matrix, bounce webhook, and admin preferences are incomplete. |
| Admin control center | Partially Working | Application review exists; provider admin Jobs page explicitly says coming soon. Finance, dispatch tuning, recovery, support/dispute operations incomplete. |
| Private business tools | Partially Working | CRUD/estimate/invoice/cost tests pass; these do not collect Stripe payments or reconcile payouts. |
| Vision / Shadow | Partially Working | Previously live-tested; not called again this audit. Existing per-request budget reservation remains separate from IQ spending. |
| Database permissions | Broken | 80 anon/authenticated TRUNCATE grants remain. Repair prepared and rollback-tested; direct REST exploit not asserted. |
| Backups/disaster recovery | Not Verified | No restore drill or verified recovery objective evidence. |
| Native customer/provider apps | Not Verified | No separate native app repository or release verified in this run. |

Provider categories: cleaning, handyman, moving, junk, painting, plumbing, electrical, landscaping, appliance. Dispatch city catalog: Vancouver, Burnaby, Surrey, Richmond, Coquitlam, Delta, Langley, North Vancouver, West Vancouver, New Westminster, Port Coquitlam, Port Moody, Maple Ridge, Pitt Meadows, White Rock. Listing does not prove approved service availability or qualified supply.
