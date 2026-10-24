# Automated test report

Executed this run:

- Customer `npm test`: 38 passed, zero failed. Includes OAuth start/error, payment DB retry, processed-event dedupe, specialized quote guards, quote corrections, pricing, ownership and photo checks. Uses isolated local mocks/pure logic, not real Stripe transactions.
- Provider `npm test`: 19 passed, zero failed. Includes dispatch categories/presence, roles, application validator, typed API errors, private work, estimates, costs, and AI budget checks.
- Provider `npx tsc --noEmit` and production build passed. Targeted ESLint: zero errors, one existing internal-navigation warning.
- Customer public build passed: 186 local public assets. Partial local source snapshot; not a claim of exhaustive asset integrity.
- Seven authenticated live read-only studio checks passed: anonymous blocking, public assets, owner workspace, server-rendered dashboard, section rendering, technician restrictions, other-business isolation. Observed workspace 277 ms; dashboard HTML 1499 ms. Samples are not load/latency percentiles.
- Seventeen selected live HTTP checks returned expected 200/401 responses: see `http-checks.json`.
- Database permission and trigger compile checks succeeded inside transactions that were rolled back. No production schema/backfill persisted.
- Browser: Services dropdown opens; office cleaning first question asks square footage. Desktop interaction only.
- Both post-update production-dependency audits report zero known advisories; not a guarantee against undiscovered vulnerabilities.

## Required business simulations

| # | Scenario | Actual evidence / status |
|---|---|---|
| 1 | Fresh Google signup | Blocked pending reviewed deployment and user-owned Google browser authentication; start flow unit-tested. |
| 2 | Start and leave quote | Persistence source/previous unit coverage; abandonment event not verified. |
| 3 | Resume quote | Persistence regression passes; fresh authenticated E2E not verified. |
| 4 | Customer payment | Blocked: no dedicated Stripe test credentials configured. |
| 5 | Stripe confirmation | Signed-event guard and mocks pass; test-mode event not exercised. |
| 6 | Exactly one booking/job | Unique job/session and job/booking indexes verified; complete payment race not verified. |
| 7 | Customer confirmation email | Missing complete payment-to-email integration. |
| 8 | Admin booking notification | Missing complete event/preference workflow. |
| 9 | Correct eligible offers | Pure matching tests pass; new paid staging job not exercised. |
| 10 | Surrey priority | City/radius logic unit-tested; staging multi-provider wave not exercised. |
| 11 | Concurrent acceptance | RPC row lock reviewed; concurrent staging clients not exercised this run. |
| 12 | Single winner | SQL claim implementation reviewed; concurrent staging evidence missing. |
| 13 | Assignment email | Queue code present; no actual delivery during this audit. |
| 14 | Complete job | Phase/evidence validator tests pass; full new-job E2E missing. |
| 15 | Completion email | Queue code present; no actual delivery test. |
| 16 | Payout reconciliation | Missing implementation/evidence. |
| 17 | Entire provider signup | Blocked on isolated verification/SMTP and staging setup; no real registration sent. |
| 18 | Unapproved accept | Server approval checks reviewed; no mutating production attempt. |
| 19 | Duplicate webhook | Mock processed-event replay passes; real Stripe replay blocked. |
| 20 | Provider cancellation | Missing complete reassignment/refund workflow. |
| 21 | No eligible provider | Missing verified escalation/customer-alert path. |
| 22 | Refund request | Missing verified operational/refund implementation. |
| 23 | Checkout session expiry | Not verified; replacement session/double-payment risks remain. |
| 24 | Mobile complete booking | Not verified; no iPhone/Android/device checkout evidence. |

Repeat local checks with `npm test` in each repository. Repeat read-only deployed dashboard checks with `OPS_TEST_BASE=https://pros.urbance.ca node scripts/test-studio-flow.cjs` using the existing ignored fixture file. Do not copy fixture credentials into reports or use demo accounts as real providers. Existing mutating fixture scripts were deliberately not run against production in this audit.
