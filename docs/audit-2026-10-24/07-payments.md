# Payments and reconciliation

**Prepared-code update:** [The atomic settlement continuation](11-atomic-payment-repair.md) replaces the separate-write webhook in the repair branch and adds database rollback/replay tests, confirmation outbox events and a reconciliation view. The older flow is still production. The remaining limitations below describe the initial baseline; real Stripe/staging validation and financial execution remain outstanding.

**No actual Stripe payment, refund, payout, SCA challenge or chargeback was exercised.** Customer project environment metadata lists production Stripe credentials only, with no dedicated test key or test webhook secret. Provider project does not implement actual payout settlement. Never use production credentials to simulate test charges.

Verified locally: checkout reads a durable owned quote, ignores browser price overrides, validates schedule and uses an approved return origin. Confirmation UI polls payment records and does not infer payment from the success URL. Webhook rejects parsed request bodies and invalid/missing production signature configuration. Job unique indexes exist for Stripe session and booking IDs.

Prepared repairs: prevent preview/nonproduction use of live Stripe keys; require successful database confirmation/history writes; fail retryably instead of silently acknowledging failures; retain processed-event dedupe; prevent automatic checkout for specialized services routed through handyman pricing.

Outstanding launch blockers:

- Fulfillment is a sequence of separate database writes rather than one settlement transaction. The unique indexes prevent duplicate jobs, not every inconsistent payment/booking state.
- Resume checkout creates another session; no verified expire/reuse/idempotency contract for old sessions. Two independently paid sessions for one booking require explicit reconciliation, not silent dedupe or repeated retries.
- Checkout initiation itself has no verified end-to-end booking/payment idempotency contract.
- Webhook handles checkout completion and logs failed intent; asynchronous success, expired sessions, refunds, disputes and cancellation event handling are not complete.
- Amount/currency are checked, but session-to-payment binding, expected checkout attempt, zero-row payment writes and settlement state transitions require stronger transactional validation.
- Before-payment acceptance is missing versioned customer booking/policy evidence. Marketing consent must remain separate.
- No verified provider payable ledger, commission/tax/refund allocation, Connect onboarding, payout eligibility, payout transfer or bank reconciliation.
- Current provider earnings are estimated amounts after 7% commission, not money received or paid out. GST/commission treatment requires approved finance rules.
- Complete receipt/booking/admin email events missing.

Required isolated test setup: dedicated Stripe test account/key and webhook secret; staging Supabase database/storage/Auth; test webhook endpoint; synthetic consenting recipients or email sink; no production email worker access. Then test successful/declined/SCA/expired/abandoned/duplicate attempts, concurrent/reordered signed events, partial failures, refunds/partial refunds/disputes and payable ledger. Reconcile Stripe identifiers/amount/currency with exactly one intended booking and job, plus append-only settlement entries. No test-mode evidence may be represented as live money reconciliation.
