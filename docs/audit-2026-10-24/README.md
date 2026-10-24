# Urbance business-system audit — 24 October 2026

**Disposition: NOT ready for an unattended marketplace launch.** This is a verified initial audit and repair batch, not certification that the 14-phase completion standard has been met. Production remains unchanged. Code and two database migrations are prepared for review. Remaining implementation and blocked tests are listed explicitly.

**Latest continuation:** [Atomic payment repair](11-atomic-payment-repair.md) adds a third pending migration, transactional fulfillment and review UI. Latest local suites: customer **70/70**, provider **23/23**; both builds pass. Initial findings below remain a dated baseline; the continuation distinguishes prepared fixes from unchanged production.

## Evidence and boundaries

Customer main inspected: `f461f7e2f85e0d7482d44f7f767c0b7ae83177c9`. Provider production inspected: `65972f77abfcad718a3509b94e0bcf311a2a0638`, deployment `dpl_FPpuQ2VUvtoNHKUwtN4sWxhRs93D`, READY. Supabase project: `fayscounjvfclnlyuddv`. Read-only production queries, 17 public HTTP checks, seven authenticated read-only checks against existing isolated demo fixtures, browser menu/office-quote interaction, local regression tests, dependency scans, and rollback-only SQL validation were performed. No real payment, refund, payout, customer email, document approval, or production deployment was performed. No new accounts were created.

The database has 60 public tables, all with RLS enabled; RLS alone does not establish safe permissions. There are zero non-demo businesses and zero non-demo paid jobs at inspection. This is not proof of production-scale operation. Source inventory is in `source-inventory.json`; the authoritative customer GitHub file inventory is in `customer-repository-inventory.json`. Local customer sources are a partial snapshot, so missing local assets were not reported as live defects.

## Deliverables

1. [Feature audit and findings](01-feature-audit.md)
2. [Architecture and workflow map](02-workflows.md)
3. [Repairs and regression evidence](03-repairs.md)
4. [Automated test report and 24-scenario matrix](04-tests.md)
5. [Event email matrix](05-email-matrix.md)
6. [Dispatch verification](06-dispatch.md)
7. [Payment and reconciliation report](07-payments.md)
8. [Security and privacy report](08-security.md)
9. [Deployment readiness and approval scope](09-readiness.md)
10. [Prioritized remaining implementation](10-next-work.md)

**Current evidence:** customer 38/38 local tests; provider 19/19 local tests; seven live dashboard checks; two SQL rollback checks; both builds pass; provider targeted ESLint has zero errors and one existing navigation warning. Dependency scans after updates report zero known production-dependency vulnerabilities. These are different levels of evidence, not 66 full end-to-end business tests.
