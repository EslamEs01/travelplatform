# Implementation Plan: Destinations & Blog SEO Content Pages (Travel SaaS Platform)

**Branch**: `004-destinations-blog-seo` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-destinations-blog-seo/spec.md`

## Summary

Build the four real public **content/SEO** pages the homepage and discovery layer only teased — `destinations.html`
(destinations listing), `destination-details.html` (rich single-destination landing, default Dubai), `blog.html`
(travel-guides listing), and `article.html` (long-form article, default "كيف تجد أرخص عروض السفر إلى دبي؟") — then
**rewire** the homepage and shared shell so the destinations/blog links and the homepage popular-destination &
travel-guide teaser cards navigate to these real pages instead of the "coming soon" toast (out-of-scope links keep
"coming soon"). This completes the public content layer (browse destinations → explore a destination → browse guides
→ read an article) on top of the Spec 001 foundation, Spec 002 homepage, and Spec 003 discovery pages, proving SEO
depth while linking content back into deals/coupons/compare.

**Technical approach**: Static composition + editorial content, mirroring the homepage and Spec 003 pattern exactly.
Each page is a standalone HTML document that **inlines** the canonical shell (`partials/head|header|footer.html`),
reuses the design tokens (`tailwind.config.js`), component classes (`src/input.css`:
`.btn/.card/.badge-source-*/.field/.modal/.skeleton/.empty-state/.inline-msg/.price`, plus the homepage
`.dest-card`/`.guide-card` patterns), and the `window.TUI` utilities wired declaratively via `data-*`. Core content
(destination cards, the default Dubai destination, article cards, the default long-form article) is **static HTML** so
pages render without JavaScript (Constitution III); a single **new additive** module `src/js/content.js` (loaded only
by the four new pages, dispatched by `<html data-page>`) enhances them with search + filter chips + reset + URL state,
the `destination-details.html?id=` and `article.html?id=` field/content swap (from an inline JSON catalog), the
table-of-contents scroll, save/bookmark toggles, and alert/newsletter form validation — exactly the additive-module
precedent set by Spec 003's `discovery.js`. Cross-page selection/state travels in **URL query parameters** (`?id=`,
optional `?destination=`/`?article=` slug, search/filter state) read with `URLSearchParams` and written with
`history.replaceState`. Alert/newsletter forms reuse the existing `data-validate data-frontend-form` handler; the
destination-details price-alert lives in an existing-style `.modal`. New believable mock content lives in additive
`assets/data/destinations-full.json` (≥12) + `assets/data/articles.json` (≥12); related deals/coupons reuse the
existing `deals.json`/`coupons.json` ids and `compare.html?destination=`. **No behavioral change** is made to
`src/js/main.js`, `src/js/ui.js`, or `src/js/discovery.js`; the only shared-file edits are the
constitutionally-required nav-link rewiring to `partials/` (+ every inlined shell copy) and the homepage teaser-card
link rewiring. No visual identity change; no foundation rebuild; no Spec 002/003 surface removed; no backend.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via the existing Tailwind CSS v3.4 local build (PostCSS/Autoprefixer);
vanilla JavaScript (ES2020, classic `defer` scripts — no bundler). Build-time runtime: Node.js ≥ 18 LTS + npm
(unchanged from Spec 001/002/003).
**Primary Dependencies**: None added. Reuses installed `tailwindcss@^3.4`, `postcss`, `autoprefixer`,
`@tailwindcss/forms`, and the existing `window.TUI` namespace (`toast` / `modal.open|close` / `drawer.open|close|toggle`
/ `validateForm` / `copyToClipboard` / `prefersReducedMotion`). Browser `URLSearchParams` + `history.replaceState`
for URL state; CSS `scroll-behavior`/`scrollIntoView` for the table-of-contents. No runtime framework, no CDN.
**Storage**: N/A — no backend/database/CMS. Mock content is realistic, clearly-mock static HTML mirroring small local
`assets/data/*.json` files (`destinations-full.json`, `articles.json` new; `deals.json`/`coupons.json`/
`compare-offers.json`/`destinations.json` reused unchanged). Search/filter/alert/newsletter forms persist/transmit
nothing.
**Testing**: Manual QA against the per-page "done" checklist (`quickstart.md`) + automated accessibility audit
(axe-core) targeting WCAG 2.1 AA, HTML validation (`html-validate`), and Prettier/Stylelint. The stack-compliance
grep is a hard gate. No unit-test framework (consistent with Spec 001/002/003). A `qa-results.md` is produced after
implementation.
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major versions.
Mobile-first (~320–360px up to desktop).
**Project Type**: Static frontend web application (single project; four content pages in scope this phase, plus
homepage/shell rewiring). No backend tier.
**Performance Goals**: Each page interactive in < 2s under Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT) + 4×
CPU throttle (SC-016); minified CSS reused; lazy non-hero images; zero runtime CDN requests; search/filter operate on
the in-page DOM (no network).
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no
`alert()`/`confirm()`/`prompt()`); Arabic-RTL default + English-ready; WCAG 2.1 AA; standalone backend-ready pages
(render without JS); no dead interactions; SEO baseline (semantic HTML, single `<h1>`, heading hierarchy, breadcrumb,
meta, JSON-LD); product-honesty wording (illustrative/integration-ready; never live prices / official visa). Reuse the
Spec 001/002/003 foundation unchanged except additive mock data + the new `content.js` + the required nav/teaser-link
rewiring; preserve the visual identity; remove no homepage/discovery section.
**Scale/Scope**: Four pages + homepage/shell rewiring. Mock data: ≥12 destinations (catalog, incl. Dubai default +
the 4 homepage-teaser destinations as a consistent subset), ≥12 articles (incl. the default article + the 3
homepage-teaser guides). Per-page minima: destinations ≥12 cards / ≥8 routes / ≥5 FAQ; destination-details ≥8
quick-facts / 4–6 deals / 3–4 coupons / ≥6 areas / ≥8 things-to-do / 3-day itinerary / ≥8 FAQ; blog ≥12 cards +
featured / ≥5 FAQ; article 8 TOC sections + inline deal + inline coupon + 3 destinations + 3 articles / ≥6 FAQ.

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications (2026-06-01) resolved the four open questions
(content selection = `?id=` with default fallback; rendering = static-HTML-first + JS enhancement; page logic = new
additive `content.js`; data layout = new `destinations-full.json` + `articles.json`, reusing existing deal/coupon
ids). See `research.md` for the derived technical decisions (D1–D10).*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend content pages; zero backend/CMS. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | Existing local Tailwind build + vanilla JS only; one additive `content.js`. No forbidden libs/CDN/dialogs. Verified by the stack-compliance grep gate. |
| III. Standalone, Backend-Ready Pages | ✅ PASS | Each page is self-contained and **renders core content without JS** (static destination/article cards, static default Dubai destination + default article; JS only enhances). Shell inlined 1:1 with `partials/`; semantic, server/CMS-renderable. |
| IV. Premium & Trustworthy | ✅ PASS | Reuses premium tokens + trust signals (source badges, ratings, terms indicators, illustrative-data notes). No empty/broken UI — branded empty/skeleton states + graceful `?id=` default fallback. |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | Inlines `<html lang="ar" dir="rtl">` shell, logical-property utilities, mobile-first breakpoints; English-ready; rich detail/article layouts and TOC reflow to a single column at ≤360px. |
| VI. No Dead Interactions | ✅ PASS | Cards/links navigate; search/chips/reset act on the DOM + URL; coupons copy + toast; share buttons toast; save/bookmark toggles; price-alert opens a validated modal; alert/newsletter forms validate→toast→inline; out-of-scope links → coming-soon toast. No bare `#`, no `alert()`. |
| VII. Listing & Detail Contracts | ✅ PASS (now full for content) | `destinations.html`/`blog.html` ship search/filters, empty state, skeleton, and reset; `destination-details.html` + `article.html` ship main info + primary CTA/conversion + related items + FAQ. |
| VIII. SaaS Direction Preserved | ✅ PASS | Adds the public content/SEO surfaces; rewires toward them; still-unbuilt surfaces (auth/saved/alerts-mgmt/dashboards/admin) keep "coming soon". Nothing removed or simplified. |
| IX. Integration-Ready, Never Faked | ✅ PASS | All content believable mock/editorial; source badges (Partner/Affiliate/Manual Deal/API Ready); safe labels; "ابتداءً من"/تقديري pricing; price-trend teaser explicitly "مثال توضيحي … لا يمثل أسعارًا مباشرة … قابل للربط لاحقًا"; visa notes "لا تعتبر بديلاً عن المصادر الرسمية"; alerts/newsletters frontend-only and never imply live data, real notification, or storage. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, single `<h1>`, heading hierarchy, breadcrumb, per-page meta + JSON-LD (ItemList/Blog on listings; BreadcrumbList + FAQPage on details; Article on the article); substantial non-thin Arabic content; FAQs; `article.html` uses `<article>`. |
| Technical Standards & File Organization | ✅ PASS | Stays within `travel-saas-frontend/`; additive `assets/data/*.json`, `assets/images/*`, `src/js/content.js`; nav/teaser-link edits to `partials/` + inlined copies + `index.html`. See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist in `quickstart.md`; stack-compliance hard gate; preservation rule honored (no homepage/discovery section removed; `main.js`/`ui.js`/`discovery.js` behavior unchanged). |

**Result**: PASS — no violations. The only shared-file edits are the constitutionally-required nav-link rewiring
(FR-026–FR-029) plus additive files; logged in Complexity Tracking. Re-checked after Phase 1 design — still PASS (no
new components, tokens, or visual identity introduced; Principles VII & X now satisfied in full for the content
layer).

## Project Structure

### Documentation (this feature)

```text
specs/004-destinations-blog-seo/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications 2026-06-01)
├── research.md          # Phase 0 output — decisions D1–D10
├── data-model.md        # Phase 1 output — page/section inventory, schemas, URL & interaction maps
├── quickstart.md        # Phase 1 output — build/preview + per-page QA gate
├── contracts/           # Phase 1 output
│   ├── content-pages.contract.md  # per-page structural/behavioral + nav-rewiring + non-regression
│   └── mock-data.contract.md      # destinations-full/articles schemas + reuse & consistency rules
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── tailwind.config.js        # REUSED unchanged (design tokens; content globs already cover pages/partials/src/js)
├── src/
│   ├── input.css             # REUSED; additive only if an unavoidable composition class is needed
│   └── js/
│       ├── ui.js             # REUSED UNCHANGED (window.TUI)
│       ├── main.js           # REUSED UNCHANGED (declarative data-* wiring, incl. data-coming-soon)
│       ├── discovery.js      # REUSED UNCHANGED (Spec 003 — loaded only by the 4 discovery pages)
│       └── content.js        # ★ NEW additive — search/filter chips/reset/URL state, ?id= swap
│                             #   (destinations/articles), TOC scroll, save/bookmark, alert/newsletter
│                             #   validation; dispatched by <html data-page>; loaded only by the 4 new pages
├── assets/
│   ├── css/tailwind.css      # BUILD OUTPUT (regenerated; not hand-edited)
│   ├── data/
│   │   ├── destinations-full.json # NEW — destinations catalog (≥12; Dubai default; superset of destinations.json)
│   │   ├── articles.json     # NEW — articles catalog (≥12; default article + 3 homepage-teaser guides)
│   │   ├── destinations.json # REUSED — homepage teaser (4); kept a consistent subset of destinations-full.json
│   │   ├── deals.json        # REUSED unchanged — related-deal ids (deal-001…deal-010)
│   │   ├── coupons.json      # REUSED unchanged — related/inline coupon ids (FLY15…FAMILY15)
│   │   └── compare-offers.json # REUSED unchanged — compare.html?destination= context
│   └── images/               # NEW additive SVG placeholders if needed (reuse city/beach/heritage/etc.)
├── partials/                 # CANONICAL shell — header/footer nav links rewired (destinations/blog)
│   ├── head.html             # REUSED unchanged
│   ├── header.html           # EDIT — real hrefs for الوجهات→destinations.html, المدونة→blog.html (remove data-coming-soon)
│   └── footer.html           # EDIT — real hrefs for destination/blog links (remove data-coming-soon)
└── pages/
    ├── index.html            # EDIT — popular-destination cards → destination-details.html?id=; guide cards → article.html?id=; inlined shell synced
    ├── destinations.html     # ★ NEW — destinations listing
    ├── destination-details.html # ★ NEW — single-destination landing (+ inline JSON catalog, price-alert modal)
    ├── blog.html             # ★ NEW — travel-guides listing
    ├── article.html          # ★ NEW — long-form article (+ inline JSON catalog, TOC, inline deal/coupon)
    ├── deals.html            # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── deal-details.html     # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── compare.html          # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── coupons.html          # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── styleguide.html       # EDIT (sync inlined shell only) — still renders, 1:1 with partials
    └── components.html       # EDIT (sync inlined shell only) — still renders, 1:1 with partials
```

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/` (unchanged from Spec
001/002/003). The feature is **composition + editorial content** (four new `pages/*.html`) + **additive** mock-data
JSON (`destinations-full.json`, `articles.json`) + one **additive** `src/js/content.js` + the required **nav/teaser
rewiring** to the canonical `partials/`, every inlined shell copy, and the homepage teaser cards. No foundation file
is rebuilt or behaviorally changed; `src/js/main.js`, `src/js/ui.js`, and `src/js/discovery.js` are untouched; the
shared shell stays canonical in `partials/`. The header/footer nav-link change must be applied to every page that
inlines the shell (the four new pages, `index.html`, the four Spec 003 pages, `styleguide.html`, `components.html`) so
all stay 1:1 with the canonical source (SC-017).

## Complexity Tracking

> Only additive/justified shared-file touches are logged here. There are no principle violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| New `src/js/content.js` (search/filter chips/reset, URL state via `URLSearchParams`+`replaceState`, `?id=` swap for destinations & articles from inline catalogs, TOC scroll, save/bookmark toggles) | The listing/detail/article pages need client-side search/filter/deep-link, the detail/article content swap, and TOC navigation, which neither the declarative `data-*` layer nor Spec 003's `discovery.js` covers. | Inline `<script>` per page rejected (ui-utilities contract: pages need no bespoke inline JS; a shared module is reusable). Extending `main.js` rejected (adds page-specific concerns to a file loaded by **every** page — regression risk). Extending `discovery.js` rejected (it is the Spec 003 module; mixing content-page logic risks Spec 003 regressions and the spec scopes a separate file). `main.js`/`ui.js`/`discovery.js` stay unchanged. |
| Nav-link edits to `partials/header.html` + `partials/footer.html` and every inlined copy (`index`/`destinations`/`destination-details`/`blog`/`article`/`deals`/`deal-details`/`compare`/`coupons`/`styleguide`/`components`) | FR-026/FR-028 require الوجهات→`destinations.html` and المدونة→`blog.html` to resolve to the new real pages; the shell is inlined per page so copies must stay 1:1 with the canonical source (research D10). | Runtime partial injection via `fetch` rejected (breaks standalone rendering on `file://`, violates III); leaving inlined copies stale rejected (violates the 1:1 rule and SC-017). Out-of-scope links keep `data-coming-soon`. |
| Homepage teaser-card rewiring in `index.html`: popular-destination cards `data-coming-soon` → `href="destination-details.html?id=<id>"`; guide cards `data-coming-soon` → `href="article.html?id=<id>"` | FR-027 requires the homepage teaser cards to navigate to the new detail pages. The 4 teaser destinations and 3 teaser guides must resolve to real catalog entries. | Leaving them as `data-coming-soon` rejected (FR-027); adding a JS redirect handler rejected (a plain `href` is simpler, works with zero JS, and removes a dead control). No homepage section is removed. |
| New `assets/data/destinations-full.json` (≥12) + `articles.json` (≥12) (+ optional SVG imagery) | The content pages need believable, consistent mock catalogs; `destinations-full.json` is the destinations source of truth (homepage `destinations.json` is a consistent subset) and the `?id=` swap source; `articles.json` likewise for the blog/article pages. | Hardcoding everything inline rejected for consistency/reuse; JSON mirrors the existing `deals.json`/`featured.json` convention and is backend/CMS-ready. Related deals/coupons reuse existing ids rather than duplicating data. |
| `destination-details.html` + `article.html` each embed an inline `<script type="application/json">` catalog + a static default (Dubai / default article) | The `?id=` swap must work with **zero network** (robust on `file://`, SC-013) while the static default satisfies the no-JS baseline (III) and the graceful-fallback requirement (FR-013/FR-021). | `fetch('../assets/data/*.json')` rejected (network dependency, fails on `file://`); pre-rendering one static page per destination/article rejected (N pages to maintain, out of scope). Mirrors Spec 003's `deal-details.html` D5 pattern exactly. |
