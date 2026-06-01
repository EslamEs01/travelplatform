<!-- SPECKIT START -->
## Active feature: 003-public-discovery-pages

Frontend-first **Travel SaaS Platform**. Current phase builds the **public discovery & monetization pages**
the completed homepage (Spec 002) links to — `deals.html` (deals listing), `deal-details.html` (single-deal
detail), `compare.html` (single-trip source-offer comparison), `coupons.html` (coupons listing) — then
**rewires** the homepage/shell so deals/compare/coupons CTAs navigate to the real pages (out-of-scope links
keep "coming soon"). Build by composition on the Spec 001 foundation + Spec 002 homepage: reuse the inlined
shell, design tokens, components, and `window.TUI` (`data-*`). Core content is **static HTML** (renders
without JS); one **new additive** `src/js/discovery.js` (4 new pages only) adds filter/sort, URL state,
`deal-details.html?id=` swap, and the compare trip-context echo. Cross-page state = **URL query params**
(hero search = native `method="get" action="compare.html"`). Deal-details CTA = validated inquiry modal
reusing the existing `data-validate data-frontend-form`. `src/js/main.js` + `src/js/ui.js` stay **unchanged**.
No new visual identity, no foundation rebuild, no backend, no homepage section removed.

**Key decisions (research D1–D10)**: static-HTML + JS-enhancement; URL query params via
`URLSearchParams`+`history.replaceState`; deals catalog in new `assets/data/deals.json` (homepage featured =
consistent subset); `compare-offers.json` (NEW) + `coupons.json` (extended w/ `category`);
`deal-details.html` ships a static default deal + inline JSON catalog for `?id=` swap.

**Read the current plan and its design artifacts:**

- Plan: `specs/003-public-discovery-pages/plan.md`
- Spec: `specs/003-public-discovery-pages/spec.md`
- Research (decisions D1–D10): `specs/003-public-discovery-pages/research.md`
- Page/section inventory, schemas, URL & interaction maps: `specs/003-public-discovery-pages/data-model.md`
- Contracts: `specs/003-public-discovery-pages/contracts/` (discovery-pages, mock-data)
- Quickstart & QA gate: `specs/003-public-discovery-pages/quickstart.md`
- Reused homepage (Spec 002): `specs/002-public-homepage/`
- Foundation reused (Spec 001): `specs/001-frontend-foundation/` (page-shell, ui-utilities, component-patterns)
- Governing constitution: `.specify/memory/constitution.md`

**Stack (non-negotiable)**: HTML + local Tailwind CSS v3.4 build (PostCSS) + vanilla JS only.
Forbidden: React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN, browser `alert()`. Arabic RTL primary,
English-ready, mobile-first, WCAG 2.1 AA, standalone backend-ready pages, no CDN at runtime.
<!-- SPECKIT END -->
