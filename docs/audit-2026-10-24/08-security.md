# Security and privacy

| Finding | Severity / scope | Disposition |
|---|---|---|
| 80 browser-role TRUNCATE grants | High unnecessary database capability; RLS does not govern TRUNCATE. No exposed REST truncate action or exploit asserted. | Removal migration prepared and rollback-validated. Production unchanged. |
| Shared Auth default/provider classification and missing email | High workflow/identity classification defect, not demonstrated admin escalation. | Trigger and null-email restoration migration prepared; provider classification follows review. |
| Preview live-key fallback | High financial environment isolation risk. | Local repair/tests; no live payment performed. |
| Specialized work routed as handyman | High qualification/pricing mismatch. | Provider routing and customer manual-review/payment guards prepared; full trade qualification model still missing. |
| Ignored payment database errors | High fulfillment consistency risk. | Retry checks prepared; transaction/race shortcomings remain open. |
| Production dependency advisories | Provider initially 1 high; customer initially 1 critical/8 high/2 moderate at package level. Actual deploy exploitability not established for every dependency, including unused legacy Express tools. | Provider Zod and compatible customer dependencies updated; post-update production scans zero known advisories. |
| Leaked-password protection disabled | Medium account hardening gap, Supabase advisor warning. | Requires Auth configuration review; not changed. |
| Public-schema vector extension | Medium/low schema hygiene warning, not a demonstrated exploit. | Do not move blindly; dependency-aware migration remains pending. |
| Privileged helper functions | Advisor warns for three authenticated SECURITY DEFINER functions. | Bodies inspected: current role/admin check and provider approval lookup. No public write/accept privilege discovered; not automatically vulnerabilities. |
| Backend-only RLS tables without policies | Informational, expected for service-only tables. | Do not add broad client policies just to silence advisor. |
| Memory-only customer IQ rate limit | Medium reliability/cost risk across serverless instances. | Durable quota/body controls and monitoring need completion. |
| Backup/restore and alerts | Operational launch blocker until verified. | No recovery drill, RPO/RTO or tested critical alert routing this run. |

All 60 public tables have RLS enabled. Storage buckets `ops-private` and `provider-documents` are private. Existing profile identity guard and provider approval triggers prevent direct normal-client privilege/status updates; old direct acceptance is revoked. Role-scoped live read checks and customer ownership regression tests pass. These checks do not replace an exhaustive IDOR/security penetration test.

Previously revoked legacy Supabase credentials remain revoked; no key values are included here. The customer browser SDK loads an unpinned major CDN SDK; this audit restored its missing local snapshot for source inspection, not a live-site fix. Pinning/bundling that client is further supply-chain work.

## Canadian/BC privacy and communication review

Engineering requirement: collect only appropriate job/onboarding information, explain purposes/recipients, apply access/retention/deletion controls, keep agreements and optional marketing consent distinct, and maintain an incident/privacy request process. Do not request SIN, bank passwords or immigration documents as ordinary provider uploads. Existing UI discourages those uploads; retention and access-request operations still need validation.

CRTC guidance says an abandoned cart alone is not a completed purchase establishing the two-year implied-consent period. Therefore do not enable 1h/24h/72h promotional recovery solely because a customer entered an email. Implement a recorded lawful basis, withdrawal/suppression, sender identification and applicable unsubscribe handling; get business/legal review of message classifications. See [CRTC FAQ](https://crtc.gc.ca/eng/com500/faq500.htm), [CRTC requirements](https://crtc.gc.ca/eng/internet/anti/reg.htm), and [OIPC BC private organization guidance](https://www.oipc.bc.ca/for-private-organizations/). These are implementation requirements and gaps, not a legal compliance certification.
