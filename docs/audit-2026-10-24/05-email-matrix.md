# Event email matrix

Transactional mail uses provider outbox → five-minute worker → Resend. Provider offers use 30-minute reminder slots, leases, dedupe keys, retries, and stale-offer cancellation. Existing sent count is three; this audit sent zero emails. Auth verification/reset uses Supabase Auth delivery, whose production SMTP configuration was not inspected by the available database connector. Customer Vercel env metadata does not list a Resend key.

| Event | Recipient | Current implementation / gap |
|---|---|---|
| Email signup verification | Customer/provider | Supabase Auth enabled, confirmation required; fresh delivery not verified. |
| Password reset | Customer/provider | Auth request/callback code; actual delivery/reset not tested. |
| Customer welcome | Customer | No complete reviewed template/event integration verified. |
| Saved/finished quote | Customer | In-account save present; dedicated email not verified. |
| Abandoned quote 1h/24h/72h | Eligible customer | Missing consent-aware scheduler, suppression, unsubscribe and admin timing controls. Keep disabled. |
| Paid/booking confirmed/searching | Customer | Payment creates job/event; complete outbox notification integration missing. |
| Payment failure/action required | Customer/admin | Webhook handler currently only logs payment failure. |
| Assigned | Customer/provider | `queueJobNotifications(..., accepted)` present; missing-email profiles can suppress provider mail. No fresh delivery test. |
| En route/arrived/started/completed | Customer/provider | Job transition queue exists; complete delivery/state correlation not verified. |
| Receipt | Customer | Stripe configuration/delivery not verified; no Urbance receipt reconciliation proof. |
| Cancel/refund/reschedule/support/review | Customer | Complete event workflows missing or not verified. |
| Application submitted | Provider | Submission queues acknowledgement; queuing error handling and admin counterpart require improvement. |
| Approved/rejected/under review | Provider | Reviewer queues update using profile email; null email bug repair prepared. |
| New offer and 30-minute reminder | Provider owner | Outbox path exists, revalidates offer/state/presence; no active real providers. |
| Acceptance / unavailable offer | Providers | Assignment notification exists; competitor closure email not implemented. |
| Customer cancellation / schedule change | Provider | No complete verified operational event path. |
| Payout/failure | Provider/admin | Reconciled financial event path missing. |
| Document expiry | Provider/admin | Readiness rejects expired docs, but proactive alert scheduler missing. |
| Invoice sent | Own-client customer | Explicit provider invoice action queues mail; no automatic charge. |
| Team invitation | Invitee | Explicit owner invitation queues token-bound link; not sent in this audit. |
| New application / paid booking / no supply | Admin | Complete centralized alerts and preferences missing. |
| Complaint/dispute/webhook failure/security outage | Admin | Complete monitored alert routing missing. |
| Daily operational digest | Admin | Missing. |

SPF/DKIM/DMARC records, bounce/complaint event ingestion, suppression lists, dead-letter handling and delivery dashboards remain unverified/incomplete. Previously verified sender status and a prior successful test do not prove every trigger delivers. Do not turn on marketing recovery based only on a saved email or an unfinished quote.
