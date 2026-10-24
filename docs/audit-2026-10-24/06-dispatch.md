# Dispatch verification

Actual current path: real paid pending unassigned jobs → online unsuspended non-demo businesses → approved application and reviewed current docs/current agreements → category/presence eligibility → local city offers → radius expansion if no local supply or after 30 minutes. Worker runs every five minutes. This differs from the requested configurable three-wave approved-coverage model.

Verified by source/SQL: matching uses category and geographic distance; stale/offline businesses excluded; demo/real environments separated; acceptance calls `businessReady` again and rechecks eligibility. SQL `ops_accept_job` locks the job row, checks membership/approval/payment/open offer, assigns a winner, creates job state, closes competitors and cancels pending offer mail. The older acceptance RPC is not executable by anon/authenticated roles.

Local tests exposed and now guard named trade precedence and malformed/future presence timestamps. Local/nearby distance and travel-radius tests pass. No claims of a real 20-provider or concurrent-client simulation: this run did not seed production dispatch jobs or accept live offers.

Remaining high-priority gaps:

1. Coverage is business city plus owner-adjustable radius; no enforced approved-city polygon/list for each trade. Nearby distance is not proof of authorized coverage.
2. Specialized credentials are currently a generic verified trade-licence document if either plumbing/electrical is selected; distinct trade/skill validation needs a stronger model and reviewed qualification mapping.
3. Three dispatch waves and timing controls are not available to administrators.
4. No verified no-provider/stuck-offer escalation, alternate appointment proposal, customer recovery or admin intervention workflow.
5. Business calendars for private work do not establish marketplace crew capacity or collision prevention.
6. Offer email delivery revalidation does not fully re-evaluate readiness/suspension/category after queueing; an alert could become ineligible between queue and send, though assignment endpoint rechecks eligibility.
7. SQL claim checks the open offer and approval, while some eligibility remains in application code before its transaction. Strongest guarantees require moving all relevant claim checks into the atomic claim.

Privacy: current workspace offers are sanitized and exact customer fields are accessed after assignment. The legacy job-offer trigger copies service details containing address/phone into an RLS-denied server table; keep it inaccessible and remove unnecessary personal fields as defense in depth. No direct leak demonstrated in this audit.
