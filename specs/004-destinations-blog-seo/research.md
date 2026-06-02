# Phase 0 Research: Destinations & Blog SEO Content Pages

**Feature**: `004-destinations-blog-seo` | **Date**: 2026-06-01

No `NEEDS CLARIFICATION` items remained after the spec's Clarifications session (2026-06-01), which resolved the four
open questions (content selection = `?id=` with a default fallback; rendering = static-HTML-first + JS enhancement;
page logic = a new additive `content.js`; data layout = new `destinations-full.json` + `articles.json` reusing
existing deal/coupon ids). This document records the remaining technical decisions for building four standalone public
content pages on top of the Spec 001 foundation, Spec 002 homepage, and Spec 003 discovery pages, with **no backend**
and **no change to the existing visual identity**.

The investigation grounded every decision in the real codebase: the shell is **inlined** into each page (canonical
source in `partials/head|header|footer.html`), the page dispatcher reads `<html data-page>` (Spec 003's
`discovery.js` does `document.documentElement.dataset.page`), homepage/discovery content is **static HTML** (the
`assets/data/*.json` files are backend-ready data sources, not fetched at runtime), pages use a small page-scoped
`<style>` block alongside design-token utilities, and interactions are wired declaratively via `data-*` against
`window.TUI` (`toast`, `modal`, `drawer`, `validateForm`, `copyToClipboard`, `prefersReducedMotion`). The homepage
teaser cards currently carry `data-coming-soon` (popular destinations `#destinations` `.dest-card` × 4:
Istanbul/Dubai/Maldives/Paris; travel guides `#guides` `.guide-card` × 3), handled by `main.js` (preventDefault +
info toast). Spec 003 already established the exact additive-module + inline-catalog + `?id=` swap pattern this
feature reuses.

---

## D1. Rendering strategy — static HTML + progressive enhancement (NOT client-side fetch-render)

**Decision**: Author every page's core content as **static, server/CMS-renderable HTML** that mirrors the canonical
mock data, exactly like the Spec 002 homepage and the Spec 003 pages. The destinations grid, the default Dubai
destination landing, the blog grid + featured article, and the default long-form article are all hand-authored static
HTML. JavaScript only *enhances* (search, filter chips, reset, URL state, the `?id=` content swap, TOC scroll,
save/bookmark, form validation); it never *renders* the baseline content. Each listing card carries machine-readable
`data-*` (e.g., `data-region`, `data-style`, `data-price`, `data-season`, `data-destination` on destination cards;
`data-category`, `data-search` on article cards) so the enhancement layer filters/searches the existing DOM with no
fetch.

**Rationale**: Constitution III mandates pages that render correctly standalone with no runtime/router; FR-005 and the
JS-unavailable edge case require core content (cards, the default destination/article, headings, FAQ) to be readable
without JavaScript. Static HTML also avoids layout shift, works on `file://`, and maps cleanly to future Django/CMS
templates. It matches the established homepage and discovery-page pattern.

**Alternatives considered**:
- *Client `fetch()` + render from JSON*: rejected — empty page without JS, layout shift, fragile on `file://`,
  contradicts III/FR-005 and the no-JS edge case.
- *Build-time static-site generator*: rejected — no SSG in the toolchain (just the Tailwind CLI); out of scope and
  adds a dependency.

---

## D2. Content selection & cross-page state — URL query parameters (clarified), read with `URLSearchParams`

**Decision**: Encode content selection and listing state in the URL query string:
- Destination cards → `destination-details.html?id=dest-<slug>` (optional `?destination=<slug>` accepted)
- Article cards → `article.html?id=art-<slug>` (optional `?article=<slug>` accepted)
- Destinations listing search/filters → reflected as params (e.g., `destinations.html?region=الخليج&style=عائلات&q=دبي`)
- Blog listing category/search → reflected as params (e.g., `blog.html?category=طيران&q=حجز`)
- Route CTAs → `compare.html?destination=<name>` (Spec 003 compare page already reads this)

The enhancement layer reads params on load with `URLSearchParams`, and writes listing state on change with
`history.replaceState` (no reload, no scroll jump) — reusing Spec 003's `getParams()`/`setParams()` pattern. Absent or
invalid `?id=` falls back to a sensible default (Dubai destination / default article); absent listing params show the
full unfiltered set.

**Rationale**: Clarified by the user; deep-linkable, shareable, bookmarkable, and backend-ready (the same params map
to future query strings / CMS slugs). No client-side router needed (III). Identical to Spec 003's D2.

**Alternatives considered**: `sessionStorage` (rejected — not shareable, lost on direct visit); a separate static page
per destination/article (rejected — N pages to maintain; the `?id=` swap on one template is the established pattern).

---

## D3. Detail/article data source — inline JSON catalog + static default (mirrors Spec 003 D5)

**Decision**: `destination-details.html` statically renders the **default Dubai destination** (so the page is fully
populated with no JS) and embeds the destinations catalog as an inline
`<script type="application/json" id="destinations-catalog">…</script>` (the same entities as
`assets/data/destinations-full.json`). `article.html` statically renders the **default article** and embeds an inline
`<script type="application/json" id="articles-catalog">…</script>`. On load, `content.js` reads `?id=`, looks the
entity up in the inline catalog, and swaps the relevant fields in place via `data-*` swap targets (mirroring
`discovery.js`'s `[data-deal-*]` approach):
- Destination: `[data-dest-name]`, `[data-dest-region]`, `[data-dest-country]`, `[data-dest-summary]`,
  `[data-dest-img]`, `[data-dest-badges]`, quick-fact targets, breadcrumb, `<title>` — plus regenerating the related
  deals/coupons/articles sections from the entity's `relatedDealIds`/`relatedCouponIds`/`relatedArticleIds` (resolved
  against inline deal/coupon/article mini-catalogs).
- Article: `[data-article-title]`, `[data-article-category]`, `[data-article-meta]`, breadcrumb, `<title>` — the body
  for non-default articles is supplied from the catalog's stored body HTML (or the page links onward to the listing if
  full bodies are not catalogued; the **default** article always has a full static body).

Unknown/absent/invalid `?id=` → keep the static default (Dubai / default article). Long-form article bodies beyond the
default MAY be summarised with a link rather than fully swapped, but the **default** is always complete and static.

**Rationale**: Inline JSON guarantees the swap works with zero network (robust on `file://`, satisfies SC-013), while
the static default satisfies the no-JS baseline (D1) and the graceful-fallback requirement (FR-013/FR-021/SC-005/
SC-007). It reuses Spec 003's proven `deal-details.html` mechanism verbatim, minimising new code.

**Alternatives considered**: `fetch('../assets/data/*.json')` (rejected — network dependency, fails on `file://`;
inline copy is safer and still consistent because both derive from the same schema); pre-rendering one page per
destination/article (rejected — N pages, out of scope).

---

## D4. Page-specific behavior — one new additive module `src/js/content.js`

**Decision**: Add a single **new** file `src/js/content.js`, loaded (via `defer`) **only** by the four new pages after
`ui.js`/`main.js`. It dispatches on `document.documentElement.dataset.page` (`destinations` | `destination-details` |
`blog` | `article`) — the same dispatch Spec 003's `discovery.js` uses — and owns: listing search + filter-chip toggle
+ reset operating on the static DOM; URL state sync (D2); the `?id=` content swap for destinations & articles (D3);
result-count + empty-state toggling (`[data-result-count]` with `aria-live`, `[data-empty-state]`); the
table-of-contents smooth-scroll (respecting `TUI.prefersReducedMotion()`); and save/bookmark toggles. It calls
`window.TUI` for toasts and reuses the existing `data-modal-open`/`data-copy`/`data-validate data-frontend-form`
wiring for the price-alert modal, coupon copy, and the alert/newsletter forms. **`main.js`, `ui.js`, and
`discovery.js` are not modified; `discovery.js` is not even loaded by these pages.**

**Rationale**: Search/filter/URL/content-swap/TOC is genuine page logic the declarative `data-*` layer does not cover.
A dedicated additive module keeps `ui.js` (the `window.TUI` contract), `main.js` (declarative wiring), and
`discovery.js` (Spec 003) untouched, and matches the canonical structure that already anticipates multiple JS files.
Keeping it separate from `discovery.js` avoids any Spec 003 regression risk and matches the spec's explicit scoping
(FR-002).

**Alternatives considered**: Inline `<script>` per page (rejected — the ui-utilities contract says pages need no
bespoke inline JS); extending `main.js` (rejected — page-specific concerns in a file every page loads → regression
risk); extending `discovery.js` (rejected — risks Spec 003 behavior and conflates two features' concerns).

---

## D5. Listing & detail page contracts (Constitution VII applies in full for content)

**Decision**: Implement the full contracts:
- **Listings** (`destinations.html`, `blog.html`): a search input, filter chips (region+style for destinations;
  category for blog), a visible result count (`[aria-live="polite"]`) + active-chip indication, a **reset** action, a
  branded **empty state** (with reset + a CTA onward to deals/compare), and a **skeleton/loading** placeholder pattern.
- **Details** (`destination-details.html`, `article.html`): main info, a primary CTA / conversion moment (price-alert
  modal on the destination; newsletter + onward links on the article), related items (deals/coupons/articles /
  destinations+articles), and a help/FAQ section.

**Rationale**: These are real listing/detail pages, so Principle VII applies in full. Reuses existing `.card`,
`.badge-*`, `.btn`, `.field`, `.skeleton`, `.empty-state`, `.modal`, plus the homepage `.dest-card`/`.guide-card`
patterns.

**Alternatives considered**: none — this is a constitutional requirement.

---

## D6. Filter & search model — DOM-filtered chips + text search over `data-*` (no engine)

**Decision**: Destinations filter by **region** and **travel style** via chips (`data-filter="region|style"` +
`data-value=`), combined with a **search** box matching `data-search` / `data-destination` (city/country); the active
set is the intersection of the active region chip, active style chip(s), and the search term. Blog filters by a single
active **category** chip plus a search box matching title/excerpt/tags. `content.js` toggles a hidden class on
non-matching `[data-card]` elements, updates `[data-result-count]`, toggles `[data-empty-state]`, and syncs the URL.
Chips use `aria-pressed`; one "الكل" chip resets the facet. No-JS baseline shows all cards (search/filter is an
enhancement).

**Rationale**: Mirrors Spec 003's listing filter approach (DOM filtering over `data-*`, no fetch/engine), is fully
client-side, and keeps the pages standalone (III). Region+style are independent facets so the destinations page needs
two chip groups; the brief lists both region chips and style chips in one strip — implemented as labelled groups.

**Alternatives considered**: A client-side search library (rejected — adds a dependency, violates II); server-side
filtering (rejected — no backend); single-facet only (rejected — the brief requires region *and* style).

---

## D7. Destination-details price-alert + alert/newsletter forms — reuse existing `data-validate data-frontend-form`

**Decision**: The destination-details "فعّل تنبيه الأسعار" CTA opens an existing-style `.modal`
(`data-modal-open="price-alert"`) containing a `data-validate data-frontend-form` form (email `dir="ltr"` required,
destination, max budget, travel month, travelers count) with valid/invalid/error/success states; on valid submit the
**existing** Spec 002 `data-frontend-form` handler → `preventDefault` → success toast + inline confirmation + reset.
The destinations-listing destination-alert form, the blog guide-alert form, and the article newsletter form reuse the
identical handler inline (no modal). **No new JS** is needed for any form; `content.js` adds none of the form logic.

**Rationale**: Reuses proven components and the existing opt-in form handler, so the forms add markup only.
Frontend-only, transmits/persists nothing (FR-012/FR-020, Constitution IX). Identical to Spec 003's D8.

**Alternatives considered**: A bespoke form handler in `content.js` (rejected — `data-frontend-form` already does
validate→toast→reset); toast-only with no inline success (rejected — the spec requires inline success too).

---

## D8. Table of contents & in-page anchors (article)

**Decision**: `article.html` renders a static `<nav aria-label="محتويات المقال">` table of contents whose links are
plain in-page anchors (`href="#sec-booking-time"` …) targeting the eight body section headings (each `<section
id="…">` with an `<h2>`). Smooth scrolling is provided by CSS `scroll-behavior:smooth` plus a `content.js` click
handler that calls `scrollIntoView` only when `TUI.prefersReducedMotion()` is false (otherwise it lets the native
anchor jump happen). Anchors work with **zero JS** (native fragment navigation).

**Rationale**: Native anchors keep the TOC functional without JS (III) and avoid dead controls (VI); the JS layer only
upgrades to smooth scroll and honors reduced-motion (FR-018, Edge Cases). No new dependency.

**Alternatives considered**: JS-only scroll (rejected — dead without JS); a scrollspy active-section highlighter
(considered nice-to-have, out of the required scope; may be added but not required).

---

## D9. Structured data & SEO per page (honest, no live-price / official-visa claim)

**Decision**:
- `destinations.html`: `BreadcrumbList` + `ItemList` JSON-LD summarising the visible destinations.
- `destination-details.html`: `BreadcrumbList` + `FAQPage` mirroring the visible FAQ (and optionally a `Place`/
  `TouristDestination` describing the destination). Pricing is the indicative "ابتداءً من"/تقديري value; visa notes
  carry the "لا تعتبر بديلاً عن المصادر الرسمية" framing; structured data never asserts live/guaranteed prices or
  official visa rules.
- `blog.html`: `BreadcrumbList` + `Blog`/`ItemList` (visible articles).
- `article.html`: `BreadcrumbList` + `Article` (headline, author, datePublished, dateModified, image) + `FAQPage`
  mirroring the visible FAQ. Inside a semantic `<article>`.

Each page keeps exactly one `<h1>`, correct heading order, the required Arabic title/meta description, and the
specified breadcrumb.

**Rationale**: Matches the homepage/discovery JSON-LD approach and the constitution's SEO mandate (X) while staying
truthful about mock/editorial content (IX, FR-025/FR-036). `Article` + `FAQPage` are the highest-value schemas for the
content layer.

**Alternatives considered**: Omitting structured data (rejected — FR-036/SC-014 expect it where simple/safe);
asserting `priceValidUntil`/live availability or official visa validity (rejected — would imply live/official data,
violating IX).

---

## D10. Shell & homepage rewiring — update canonical `partials/` + every inlined copy + homepage teaser cards

**Decision**: Update the canonical `partials/header.html` and `partials/footer.html` so the **destinations** ("الوجهات")
and **blog/guides** ("المدونة" / "دليل السفر") links become real `href`s (`destinations.html`, `blog.html`) with the
`data-coming-soon` attribute removed; links to still-unbuilt surfaces (auth/login/register, saved deals, price-alerts
management, dashboards, admin, about/contact/privacy/terms not yet built, social) keep `data-coming-soon`. Because the
shell is **inlined** per page, apply the identical change to **every** page that inlines it — `index.html`, the four
Spec 003 pages (`deals`/`deal-details`/`compare`/`coupons`), `styleguide.html`, `components.html`, and the four new
pages — so all stay 1:1 with the canonical source (SC-017). On the homepage also rewire the in-page teaser cards:
the 4 popular-destination `.dest-card` buttons (`data-coming-soon`) → `href="destination-details.html?id=<id>"`
(dest-istanbul/dest-dubai/dest-maldives/dest-paris) and the 3 travel-guide `.guide-card` "اقرأ المزيد" buttons
(`data-coming-soon`) → `href="article.html?id=<id>"`. **No homepage section is removed; the visual identity is
unchanged.**

**Rationale**: FR-026–FR-029 require the rewiring; keeping inlined copies in sync with `partials/` upholds Constitution
III and the non-regression criterion (SC-017). The 4 teaser destinations + 3 teaser guides must exist as real entries
in `destinations-full.json` / `articles.json` so the rewired links resolve (no dangling links).

**Alternatives considered**: Runtime partial injection via `fetch` to avoid duplication (rejected — breaks standalone
rendering on `file://` and III); leaving inlined copies stale (rejected — violates the "1:1 with canonical partials"
rule and SC-017); a JS redirect for the teaser cards (rejected — a plain `href` is simpler and works with zero JS).

---

## Summary of decisions

| # | Area | Decision |
|---|------|----------|
| D1 | Rendering | Static HTML baseline + JS enhancement; cards carry filter/search `data-*` |
| D2 | Selection / state | URL query params (`?id=` + listing state) via `URLSearchParams` + `history.replaceState` |
| D3 | Detail/article data | Static default (Dubai / default article) + inline JSON catalog; `?id=` swap (no fetch) — mirrors Spec 003 D5 |
| D4 | Page logic | New additive `src/js/content.js` (4 new pages only), dispatched by `<html data-page>`; `main.js`/`ui.js`/`discovery.js` untouched |
| D5 | Page contracts | Full listing (search/filter/empty/skeleton/reset) + detail (info/CTA/related/FAQ) |
| D6 | Filter/search | DOM-filtered chips (region+style / category) + text search over `data-*`; no engine |
| D7 | Forms / alerts | Price-alert `.modal` + alert/newsletter forms reuse existing `data-validate data-frontend-form` |
| D8 | Article TOC | Native in-page anchors + CSS smooth-scroll; JS upgrade honors reduced-motion |
| D9 | SEO/JSON-LD | ItemList/Blog on listings; BreadcrumbList + FAQPage on details; Article on the article; honest pricing/visa |
| D10 | Rewiring | Update canonical `partials/` + all inlined copies + homepage teaser cards; out-of-scope links keep coming-soon |

**Net shared-file impact**: **no behavioral change** to `src/js/main.js`, `src/js/ui.js`, or `src/js/discovery.js`;
additive only — one new `src/js/content.js`, new `assets/data/destinations-full.json` + `articles.json`, optional new
SVG placeholders, and link/CTA edits to the canonical `partials/`, every inlined shell, and the homepage teaser cards.
`src/input.css` is reused; a small page-scoped `<style>` per page (as on the homepage) covers grid/price-trend/TOC
layout. No `NEEDS CLARIFICATION` remain.
