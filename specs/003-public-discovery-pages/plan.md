# Implementation Plan: Public Discovery & Monetization Pages (Travel SaaS Platform)

**Branch**: `003-public-discovery-pages` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-public-discovery-pages/spec.md`

## Summary

Build the four real public pages the homepage links to — `deals.html` (deals listing), `deal-details.html`
(single-deal detail), `compare.html` (single-trip source-offer comparison), and `coupons.html` (coupons
listing) — then **rewire** the homepage and shared shell so CTAs/links that now have real destinations stop
showing the "coming soon" toast and navigate to these pages. This completes the public discovery funnel
(browse → compare → detail → coupon) on top of the completed Spec 001 foundation and Spec 002 homepage.

**Technical approach**: Static composition + content, mirroring the homepage pattern. Each page is a
standalone HTML document that **inlines** the canonical shell (`partials/head|header|footer.html`), reuses the
design tokens (`tailwind.config.js`), component classes (`src/input.css`: `.btn/.card/.badge-source-*/.field/
.modal/.skeleton/.empty-state/.inline-msg/.price`), and the `window.TUI` utilities wired declaratively via
`data-*`. Core content (deal/coupon/offer cards, deal info) is **static HTML** so pages render without
JavaScript (Constitution III); a single **new additive** module `src/js/discovery.js` (loaded only by the
four pages) enhances them with filter + sort + URL state, the `deal-details.html?id=` field swap (from an
inline JSON catalog), and the `compare.html` trip-context echo. Cross-page state travels in **URL query
parameters** (clarified): the homepage hero search becomes a native `method="get" action="compare.html"` form
(works with zero JS), cards are plain `href="deal-details.html?id="` links, and filters/sort sync to the URL
via `history.replaceState`. The deal-details primary CTA opens an inquiry **modal** reusing the existing
`data-validate data-frontend-form` handler. New believable mock data lives in additive
`assets/data/deals.json` + `compare-offers.json` (+ extended `coupons.json`). **No behavioral change** is
made to `src/js/main.js` or `src/js/ui.js`; the only shared-file edits are the constitutionally-required nav
link updates to `partials/` and the inlined shell copies. No visual identity change; no foundation rebuild;
no backend.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via the existing Tailwind CSS v3.4 local build
(PostCSS/Autoprefixer); vanilla JavaScript (ES2020, classic `defer` scripts — no bundler). Build-time
runtime: Node.js ≥ 18 LTS + npm (unchanged from Spec 001/002).
**Primary Dependencies**: None added. Reuses installed `tailwindcss@^3.4`, `postcss`, `autoprefixer`,
`@tailwindcss/forms`, and the existing `window.TUI` namespace (`toast`/`modal`/`drawer`/`validateForm`/
`copyToClipboard`). Browser `URLSearchParams` + `history.replaceState` for URL state. No runtime framework,
no CDN.
**Storage**: N/A — no backend/database. Mock content is realistic, clearly-mock static HTML mirroring small
local `assets/data/*.json` files (`deals.json`, `compare-offers.json` new; `coupons.json` extended;
`featured.json` kept consistent). Filter/inquiry forms persist/transmit nothing.
**Testing**: Manual QA against the per-page "done" checklist (`quickstart.md`) + automated accessibility audit
(axe-core) targeting WCAG 2.1 AA, HTML validation (`html-validate`), and Prettier/Stylelint. The
stack-compliance grep is a hard gate. No unit-test framework (consistent with Spec 001/002).
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major
versions. Mobile-first (~320–360px up to desktop).
**Project Type**: Static frontend web application (single project; four pages in scope this phase, plus
homepage/shell rewiring). No backend tier.
**Performance Goals**: Each page interactive in < 2s under Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT)
+ 4× CPU throttle (SC-016); minified CSS reused; lazy non-hero images; zero runtime CDN requests; filter/sort
operate on the in-page DOM (no network).
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no
`alert()`/`confirm()`/`prompt()`); Arabic-RTL default + English-ready; WCAG 2.1 AA; standalone backend-ready
pages (render without JS); no dead interactions; SEO baseline (semantic HTML, single `<h1>`, heading
hierarchy, meta, JSON-LD). Reuse the Spec 001/002 foundation unchanged except additive mock data + the new
`discovery.js` + the required nav-link rewiring; preserve the visual identity; remove no homepage section.
**Scale/Scope**: Four pages + homepage/shell rewiring. Mock data: ≥9 deals (catalog), ≥6 coupons, ≥4 compare
offers across ≥3 sources, ≥3 related deals + ≥3 FAQ on the detail page.

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications (2026-06-01) resolved the four open
questions (compare model = source-offers-for-one-trip; cross-page state = URL query params; deal-details CTA
= validated inquiry modal; deals data = new `deals.json` catalog superset). See `research.md` for the derived
technical decisions (D1–D10).*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend pages; zero backend. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | Existing local Tailwind build + vanilla JS only; one additive `discovery.js`. No forbidden libs/CDN/dialogs. Verified by the stack-compliance grep gate. |
| III. Standalone, Backend-Ready Pages | ✅ PASS | Each page is self-contained and **renders core content without JS** (static cards/info; JS only enhances). Shell inlined 1:1 with `partials/`; semantic, server-renderable. |
| IV. Premium & Trustworthy | ✅ PASS | Reuses premium tokens + trust signals (verified/source badges, ratings, terms/cancellation indicators, support cues). No empty/broken UI — branded empty/skeleton/not-found states. |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | Inlines `<html lang="ar" dir="rtl">` shell, logical-property utilities, mobile-first breakpoints; English-ready; comparison reflows to cards at ≤360px. |
| VI. No Dead Interactions | ✅ PASS | Cards/links navigate; filters/sort/reset act on the DOM + URL; coupons copy + toast; CTA opens validated inquiry modal; out-of-scope links → coming-soon toast. No bare `#`, no `alert()`. |
| VII. Listing & Detail Contracts | ✅ PASS (now full) | `deals.html`/`coupons.html`/`compare.html` ship filters, sort (where relevant), empty state, skeleton, and reset; `deal-details.html` ships main info + primary CTA + related items + FAQ. |
| VIII. SaaS Direction Preserved | ✅ PASS | Adds public discovery surfaces; rewires toward them; still-unbuilt surfaces (destinations/blog/auth/dashboards/admin) keep "coming soon". Nothing removed or simplified. |
| IX. Integration-Ready, Never Faked | ✅ PASS | All content believable mock; source badges (Partner/Affiliate/Manual Deal/API Ready); safe CTA labels; "ابتداءً من" pricing; inquiry + comparison are frontend-only and never imply live data, real booking, or storage. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, single `<h1>`, heading hierarchy, per-page meta + JSON-LD (ItemList/Breadcrumb on listings; Product/Offer + FAQPage on details); FAQs; non-thin pages. |
| Technical Standards & File Organization | ✅ PASS | Stays within `travel-saas-frontend/`; additive `assets/data/*.json`, `assets/images/*`, `src/js/discovery.js`; nav-link edits to `partials/` + inlined copies. See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist in `quickstart.md`; stack-compliance hard gate; preservation rule honored (no homepage section removed; `main.js`/`ui.js` behavior unchanged). |

**Result**: PASS — no violations. The only shared-file edits are the constitutionally-required nav-link
rewiring (FR-023) plus additive files; logged in Complexity Tracking. Re-checked after Phase 1 design — still
PASS (no new components, tokens, or visual identity introduced; Principle VII now satisfied in full).

## Project Structure

### Documentation (this feature)

```text
specs/003-public-discovery-pages/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications 2026-06-01)
├── research.md          # Phase 0 output — decisions D1–D10
├── data-model.md        # Phase 1 output — page/section inventory, schemas, URL & interaction maps
├── quickstart.md        # Phase 1 output — build/preview + per-page QA gate
├── contracts/           # Phase 1 output
│   ├── discovery-pages.contract.md   # per-page structural/behavioral + nav-rewiring + non-regression
│   └── mock-data.contract.md         # deals/coupons/compare-offers schemas + consistency rules
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── tailwind.config.js        # REUSED unchanged (design tokens)
├── src/
│   ├── input.css             # REUSED; additive only if an unavoidable composition class is needed
│   └── js/
│       ├── ui.js             # REUSED UNCHANGED (window.TUI)
│       ├── main.js           # REUSED UNCHANGED (declarative data-* wiring)
│       └── discovery.js      # ★ NEW additive — filter/sort/URL state, ?id= detail swap, compare echo
│                             #   (loaded only by the 4 new pages, after ui.js/main.js)
├── assets/
│   ├── css/tailwind.css      # BUILD OUTPUT (regenerated; not hand-edited)
│   ├── data/
│   │   ├── deals.json        # NEW — deals catalog (≥9), superset of featured.json
│   │   ├── compare-offers.json # NEW — destination → source-offer sets
│   │   ├── coupons.json      # EXTENDED — adds `category`; ≥6 items
│   │   └── featured.json     # REUSED — kept consistent as a subset of deals.json
│   └── images/               # NEW additive SVG placeholders if needed
├── partials/                 # CANONICAL shell — header/footer nav links rewired (deals/compare/coupons)
│   ├── head.html             # REUSED unchanged
│   ├── header.html           # EDIT — real hrefs for deals/compare/coupons (remove data-coming-soon)
│   └── footer.html           # EDIT — real hrefs for deals/compare/coupons (remove data-coming-soon)
└── pages/
    ├── index.html            # EDIT — hero search → GET compare.html; CTAs → real pages; inlined shell synced
    ├── deals.html            # ★ NEW — deals listing
    ├── deal-details.html     # ★ NEW — single-deal detail (+ inline JSON catalog, inquiry modal)
    ├── compare.html          # ★ NEW — single-trip source-offer comparison
    ├── coupons.html          # ★ NEW — coupons listing
    ├── styleguide.html       # EDIT (sync inlined shell only) — still renders, 1:1 with partials
    └── components.html       # EDIT (sync inlined shell only) — still renders, 1:1 with partials
```

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/` (unchanged from Spec
001/002). The feature is **composition + content** (four new `pages/*.html`) + **additive** mock-data JSON +
one **additive** `src/js/discovery.js` + the required **nav-link rewiring** to the canonical `partials/` and
every inlined shell copy. No foundation file is rebuilt or behaviorally changed; `src/js/main.js` and
`src/js/ui.js` are untouched; the shared shell stays canonical in `partials/`.

## Complexity Tracking

> Only additive/justified shared-file touches are logged here. There are no principle violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| New `src/js/discovery.js` (filter/sort, URL state via `URLSearchParams`+`replaceState`, `?id=` detail swap from inline catalog, compare trip-context echo) | The listing/detail/compare pages need client-side filter/sort/deep-link and the detail field swap, which the declarative `data-*` layer does not cover (research D4). | Inline `<script>` per page rejected (ui-utilities contract: pages need no bespoke inline JS; a shared module is reusable); extending `main.js` rejected (adds page-specific concerns to a shared file loaded by every page — regression risk). `main.js`/`ui.js` stay unchanged. |
| Nav-link edits to `partials/header.html` + `partials/footer.html` and every inlined copy (`index/deals/deal-details/compare/coupons/styleguide/components`) | FR-021–FR-024 require deals/compare/coupons links to resolve to the new real pages; the shell is inlined per page so copies must stay 1:1 with the canonical source (research D10). | Runtime partial injection via `fetch` rejected (breaks standalone rendering on `file://`, violates III); leaving inlined copies stale rejected (violates the 1:1 rule and SC-017). Out-of-scope links keep `data-coming-soon`. |
| New `assets/data/deals.json` + `compare-offers.json` (+ extended `coupons.json`, optional SVG imagery) | The pages need believable, consistent mock content; the deals catalog (≥9) is the source of truth and the homepage featured set is a subset (clarified). | Hardcoding everything inline rejected for consistency/reuse; JSON mirrors the existing `featured.json` convention and is backend-ready (maps to future view context). |
| Homepage hero search → native `method="get" action="compare.html"` (drop `data-frontend-form` echo) | FR-021 requires navigating to `compare.html` with the entered context as query params. | An additive `data-nav-target` handler in `main.js` was considered but rejected as unnecessary — the native GET form already produces the URL contract, works with **zero JS**, and needs **no shared-JS change** (research D3). |
