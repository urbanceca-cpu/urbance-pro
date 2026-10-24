# Prepared repairs

All repairs below are local/review changes, not deployed.

| Repair | Root cause and implementation | Validation |
|---|---|---|
| Correct dispatch categories | Generic repair regex preceded appliance/plumbing/electrical category checks. Named categories now take precedence. | Regression exercises named repairs and handyman mismatch rejection. |
| Reject invalid presence | NaN timestamp comparison silently passed. Require finite timestamp and reject excessive future clock skew. | Malformed/future/stale/offline/approval/environment tests. |
| Strict application declarations | Pure validator accepted truthy non-boolean consent and NaN insurance limits. Require actual true and finite coverage. | Invalid coverage and string-consent rejection added. |
| Recover application load failures | Client discarded HTTP status and rendered signup on every fetch failure. Preserve typed status, show retryable saved-application error for non-401 failures. | Client status regression plus TS/build checks. |
| Google entry point | Customer pages omitted OAuth control. Add Google button, preserve normalized return destination via existing callback, show retryable startup failure. | Mocked OAuth start/error tests; Supabase Google enabled; actual login round trip pending. |
| Preview payment isolation | Preview/nonproduction key helper could fall back to production live key. Accept only test-prefixed secret/restricted keys outside production. | Missing test key plus live fallback rejected; production selection unchanged. |
| Retry payment DB failures | Supabase returns error objects, which webhook writes ignored. Check confirmation/history writes and processing-log writes; return 500 for Stripe retry instead of silently marking processed. | Injected DB failures cannot proceed to job creation; processed-event duplicate has no writes. |
| Specialized quote safety | IQ prompt and classifier treated specialized work as handyman. Manual review gate before model/tool pricing; block saved specialized handyman quotes on new/resumed checkout. | Category/scope-correction and saved-quote guards tested. Distinct trade pricing remains unimplemented. |
| Auth profile trigger | Shared Auth trigger omitted email and assigned provider to all signups. Prepare customer-default trigger using authoritative Auth email and null-only email backfill. Set provider classification during admin approval without overwriting privileged roles. | Trigger compiled and direct execute revoked inside rolled-back transaction. No real registration/backfill performed. |
| Least privilege | Excess table ownership capabilities survived earlier DML restrictions. Revoke TRUNCATE/REFERENCES/TRIGGER for PUBLIC/anon/authenticated and migration-owner defaults. | Rolled-back SQL asserts unsafe grants gone, customer SELECT and service UPDATE retained. |
| Dependencies | Provider Zod advisory and customer dependency advisories. Pin Zod 4.6.7, update compatible customer dependencies/lockfile; pin Supabase and changed direct packages. | Tests/builds; npm production audit reports zero known vulnerabilities after updates. |

The database migrations are `20261024030008_audit_client_privileges.sql` and `20261024030305_audit_auth_profile_identity.sql`. Neither is applied to production. Both require deployment review; the email backfill must also be checked for uniqueness conflicts against authoritative Auth data before application.

Unresolved: payment handling still spans multiple commits; these error checks improve retry behavior but do not provide transactional settlement or prevent two separate paid checkout sessions for the same booking. Do not describe the webhook as fully repaired.
