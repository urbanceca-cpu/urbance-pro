# Urbance provider studio redesign

Scope: provider public pages, application/sign-in presentation and approved workspace. Customer site was inspected as the brand reference. Its photographic service stories, consistent logo, editorial hierarchy and useful customer pathways informed a richer provider experience.

## Visual system

Ink navy (#142f3b), slate blue, warm stone and muted sage replace the stark white surfaces. Public pages gain a photographic hero, service stories, workflow explanation, team section, interactive CAD commission illustration, provider standards, coverage section and FAQs. Navigation, footer and workspace link directly to the main customer website. Mobile navigation is keyboard-accessible; motion honours reduced-motion preferences.

The four user-supplied PNG logos are used as intact brand artwork. Production derivatives trim transparent margins without changing the mark: white/dark wordmarks and white/dark symbols. Uploaded originals are unchanged. No generated logo substitutes.

## Generated photo set

Built-in image generation produced six production assets, optimized to WebP at public/images/pro. Prompts requested natural editorial photography, unbranded navy workwear, correct practical work, muted blue/sage/cedar tones, no text, no watermarks:

- hero-team.webp: two diverse professionals beside a tidy work van outside a Vancouver cedar-and-stone townhouse after rain; subjects on the right, negative space left.
- cleaning.webp: a cleaner in navy uniform and protective gloves wiping a stone kitchen island, warm oak and blue cabinets.
- moving.webp: two movers safely carrying modest boxes outside a Vancouver townhouse, natural residential setting.
- craft.webp: a maintenance professional checking a wooden shelf with a spirit level, warm modern living room.
- team.webp: three teammates planning their work at a table in a tidy workshop office, paper schedule and angled tablet, no readable text.
- vancouver.webp: quiet cedar-and-cream residential street, mountain backdrop, warm light after rain.

Images illustrate the service experience; they are not represented as actual employee portraits or customer jobs.

## Loading changes

Previously the workspace fetched after hydration, performed independent reads serially, and remounted a full-screen loading treatment on section changes. Baseline production workspace requests: 3,847 and 4,886 ms (two samples; network conditions vary).

The new authenticated layout preloads workspace data on the server and streams a stable structural shell. Its client provider persists across dashboard routes, deduplicates refresh requests, keeps existing content during refresh and polls only while the document is visible. Independent database reads run concurrently; related job lookups share a second parallel wave. Identity lookup is deduplicated within server rendering only. No global, disk or browser-storage cache of private workspace data is introduced.

Authorization still verifies the identity and live membership on every API request. Unauthorized refreshes clear the visible workspace. Role-scoped job/document/finance filtering and cross-business denial are exercised by scripts/test-studio-flow.cjs. Query failures are surfaced instead of silently rendering empty records.

The existing provider functions ran in Portland (pdx1), while the shared database is in Canada Central. This release places provider functions in Montréal (yul1 / ca-central-1), alongside the database, to reduce function-to-database round trips. Static public assets still use the CDN.

The existing live-intake, dispatch and email rollout gates remain unchanged. This redesign does not activate them.
