# Payment repair continuation — 23 October 2026 (Pacific)

**Prepared and locally verified; not deployed.** This continuation supersedes the initial report's description of the *prepared* webhook as nontransactional. Production still uses the older implementation until reviewed migrations and code are released.

## What changed

The customer webhook now hands verified paid Checkout events to the service-only `ops_settle_checkout(jsonb)` function. It locks the booking and quote, validates the persisted payment/session binding, checks amount/currency against the stored quote and booking, and commits the payment, booking, quote/history, provider job, settlement record and customer email queue together. A failed job or email-queue insert rolls back preceding changes. Delayed paid Checkout events are handled; unpaid completed sessions do not dispatch. Test/live event mismatches are rejected.

Replay of an already settled session returns its existing outcome. A second paid session for the same booking, reused intent, wrong amount/currency, cancelled booking, foreign quote or unsupported city produces a private review record instead of a second job. Unknown payment binding remains retryable. Completed-job replays preserve progress; legacy completed jobs do not receive a misleading new search email. Quotes with paid exceptions are frozen in `payment_review` state.

Checkout creation checks that the payment attempt exists and that its Stripe session was saved before returning a payable URL. Each attempt supplies a Stripe idempotency key and payment identifier. Resume checkout preserves older attempt bindings instead of overwriting them and refuses another payment if review is pending. This does **not** yet reuse/expire all old sessions or prevent every duplicate browser initiation; extra real charges require reconciliation, not automatic refunds.

Customers receive an ownership-scoped `payment_review` flag, with private session/reason records omitted. Under-review bookings show support guidance and remove pay-again/cancel buttons; the resume/cancel APIs enforce the restriction. The unused-account deletion endpoint no longer deletes the profile before Auth deletion, refuses automatic deletion for accounts with booking records, and revokes sessions first. Account closure with retained business records still needs a complete operational process.

Provider administration gains `/admin/payments`, a server-authorized view of the latest 200 settlement records and an exact count of review records. Admins can opt their own verified profile email into payment alerts; browser requests cannot choose another recipient. Authorized opted-in admin alerts are queued in the settlement transaction and link to the reconciliation page. This screen does not execute refunds/payouts or certify a review as resolved.

## Validation

- Customer suite: **70 passed**, including an isolated Postgres integration group with 19 business/security scenarios (20 reported tests including its parent).
- Provider suite: **23 passed**, including admin-role rejection, own-account alert preferences and email-link escaping.
- Both production builds pass; the new `/admin/payments` route is present in the clean Next build. Targeted new-component ESLint passes.
- Customer production-dependency audit reports zero known vulnerabilities after adding the pinned test-only Postgres engine `@electric-sql/pglite@0.5.11`.
- The complete migration compiled against the actual Supabase schema inside a transaction, with anonymous/authenticated execution/read restrictions asserted, then **ROLLBACK**. A follow-up check confirmed that neither the settlement table nor function remains installed.
- Database integration tests run locally, using an introspected production-column snapshot and relevant constraints. External worker/HTTP triggers and Auth identities are intentionally excluded. Queued duplicate calls use the embedded engine's serialized connection: **not a true multi-connection concurrency test**.
- No Stripe charge, refund, payout, account deletion, notification email, production fixture write or permanent schema change was performed.

## Release dependencies and remaining blockers

Customer migration: `urbance-platform/supabase/migrations/20261024060250_atomic_payment_settlement.sql` (UTC-generated filename). It adds a service-only reconciliation table/function and extends the quote status constraint. Apply it only as part of an approved, backed-up release, before switching the webhook or customer booking APIs. The earlier provider permission/Auth migrations are still pending too.

The existing protected-preview connector access error and absent isolated Stripe test setup still block full staging sign-off. Real Stripe signature delivery, separate-connection races, deployment worker triggers, actual email delivery, fresh Google/provider signup and mobile checkout remain unverified. Refund/payout execution, review resolution, explicit customer policy acceptance, approved provider coverage/qualification enforcement, no-supply escalation and complete operational alerts are still outstanding.

Reference: [Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment) and Supabase database-function guidance were checked. Local transaction tests are evidence of database behavior, not evidence of real Stripe settlement or email delivery.
