# Deployment readiness

**Marketplace launch: blocked. First repair batch: prepared for review, not production approval or full staging sign-off.**

Production stays unchanged until the owner approves a concrete release. Do not merge these repair branches to main if that automatically deploys production before approval. Do not apply pending migrations merely because local tests passed.

Proposed first release scope: dispatch normalization/presence/validator fixes; honest application-load retry; shared Auth profile/email correction; table privilege reduction; provider classification on approval; customer Google controls; preview payment isolation; webhook DB retry handling; manual review gates for specialized services; dependency updates. Broader billing/dispatch/admin completion is not included in this release.

Required before production rollout:

1. Review both repair PRs and the two database migrations. Confirm email backfill uniqueness preflight; do not change existing privileged roles.
2. Provision isolated staging Auth/database/storage and synthetic email delivery. Provide dedicated Stripe test credentials/webhook configuration as secrets, never in chat or source.
3. Deploy previews and run fresh signup/verification/reset, Google return/cancel/error, saved quote and no-wrong-trade checkout tests. Complete provider upload/application/review flow in staging.
4. Validate Auth trigger behavior on a fresh fixture and migrated null-email fixtures. Validate permission migration against browser reads/service writes and no privilege regressions.
5. Complete transactional payment fulfillment, explicit booking acceptance and required notification events; exercise duplicate/concurrent/reordered payment cases.
6. Obtain owner approval for the exact tested production release; apply reviewed migrations in order; deploy code; verify anonymous protection and existing account access. Monitor mail/webhook backlog and error metrics.

Rollback: keep the known READY production deployments available. A code rollback must not restore live keys to previews or browser database ownership privileges. Migration rollback requires a separately reviewed forward correction, not blind grant restoration. Email restoration cannot be undone by wiping addresses. Back up approved schema/configuration and verify restore capability before launch.

External/test blockers: no dedicated Stripe test credentials in current customer project; no isolated staging database/Auth/mail environment verified; Google browser login requires the user's secure sign-in; business/legal approval of contract/cancellation/privacy/GST/qualification rules; production approval. These do not excuse unresolved code gaps listed in the payment/dispatch reports.

Review PRs: [provider #15](https://github.com/urbanceca-cpu/urbance-pro/pull/15) and [customer #11](https://github.com/urbanceca-cpu/urbance-platform/pull/11), both draft/unmerged. Provider preview built READY. Customer preview was last observed QUEUED. Preview fetching is blocked by connector authorization: `web_fetch_vercel_url` returned 403 at `read_protection_bypass`. No authenticated CLI is available as fallback. Reauthorize the Vercel connection for the Urbance team and both projects, or confirm the connected account's preview access. Do not disable Deployment Protection. See `review-status.json` for exact deployment IDs.
