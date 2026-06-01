# Phase 0 Research: Public Discovery & Monetization Pages

**Feature**: `003-public-discovery-pages` | **Date**: 2026-06-01

No `NEEDS CLARIFICATION` items remained after the spec's Clarifications session (2026-06-01), which resolved
the four open questions (compare model = source-offers-for-one-trip; cross-page state = URL query params;
deal-details CTA = validated inquiry modal; deals data = new `deals.json` catalog superset). This document
records the remaining technical decisions for building four standalone public pages on top of the Spec 001
foundation and Spec 002 homepage, with **no backend** and **no change to the existing visual identity**.

The investigation grounded every decision in the real codebase: the shell is **inlined** into each page
(canonical source in `partials/`), homepage content is **static HTML** (the `assets/data/*.json` files are
backend-ready data sources, not fetched at runtime), pages use a small page-scoped `<style>` block for grid
layout alongside design-token utilities, and interactions are wired declaratively via `data-*` against
`window.TUI` (`toast`, `modal`, `drawer`, `validateForm`, `copyToClipboard`).

---

## D1. Rendering strategy — static HTML + progressive enhancement (NOT client-side fetch-render)

**Decision**: Author every page's core content as **static, server-renderable HTML** that mirrors the
canonical mock data, exactly like the Spec 002 homepage. JavaScript only *enhances* (filter, sort, URL
state, deal-details field swap, comparison context echo); it never *renders* the baseline content. Each
listing card carries machine-readable `data-*` attributes (e.g., `data-source`, `data-region`,
`data-price`, `data-rating`, `data-category`) so the enhancement layer can filter/sort the existing DOM
without any fetch.

**Rationale**: Constitution III mandates pages that render correctly standalone with no runtime/router, and
the spec's JS-unavailable edge case + FR-003/FR-032 require core content (cards, deal info, offers) to be
readable without JavaScript. Static HTML also avoids layout shift, works on `file://`, and maps cleanly to
future Django templates. It matches the established homepage pattern.

**Alternatives considered**:
- *Client `fetch()` + render from JSON*: rejected — empty page without JS, layout shift, fragile on
  `file://`, contradicts III and the no-JS edge case.
- *Build-time static-site generator*: rejected — no SSG in the toolchain (just the Tailwind CLI); out of
  scope and adds a dependency.

---

## D2. Cross-page state — URL query parameters (clarified), read with `URLSearchParams`

**Decision**: Encode all cross-page state in the URL query string:
- Hero search → `compare.html?destination=…&dates=…&travelers=…`
- Deal/offer cards → `deal-details.html?id=deal-0NN`
- Listing & comparison filters/sort → reflected as params (e.g., `deals.html?source=Partner&sort=price-asc`)

The enhancement layer reads params on load with `URLSearchParams`, and writes them on filter/sort change
with `history.replaceState` (no reload, no scroll jump). Absent/invalid params fall back to a sensible
default (default trip / default deal / unfiltered listing).

**Rationale**: Clarified by the user; deep-linkable, shareable, bookmarkable, and backend-ready (the same
params map to future query strings). No client-side router needed (III).

**Alternatives considered**: `sessionStorage` (rejected — not shareable, lost on direct visit); no passing
at all (rejected — the comparison "context echo" becomes generic, weakening the search→compare flow).

---

## D3. Hero-search navigation — native `method="get"` form (zero shared-JS change)

**Decision**: Change the homepage hero search form to a **native GET form**:
`<form method="get" action="compare.html" data-validate> … </form>`, dropping the Spec 002
`data-frontend-form`/`data-success-toast` echo attributes. On submit the existing `data-validate` handler
blocks *invalid* submits with inline errors and (because it does **not** `preventDefault` valid submits)
lets a valid submit navigate **natively** to `compare.html` with the field values as query parameters.

**Rationale**: This is the most robust, standards-based option: it works with **zero JavaScript** (native
form GET), needs **no modification to `main.js` or `ui.js`** (the current `data-validate` branch already
falls through on valid), and produces exactly the `?destination=…` URL contract D2 needs. It strictly
reduces shared-file churn versus Spec 002 (which had to add an opt-in handler).

**Alternatives considered**:
- *Additive opt-in `data-nav-target` handler in `main.js`* (build URL + `location.assign`): viable and
  reversible, but unnecessary — native GET already does it and avoids touching shared JS. Rejected in favor
  of the simpler native form.
- *Keep `data-frontend-form` echo (no navigation)*: rejected — contradicts FR-021 (must navigate to
  `compare.html`).

---

## D4. Page-specific behavior — one new additive module `src/js/discovery.js`

**Decision**: Add a single **new** file `src/js/discovery.js`, loaded (via `defer`) **only** by the four new
pages after `ui.js`/`main.js`. It owns: listing/comparison filter + sort + reset operating on the static
DOM; URL state sync (D2); the deal-details `?id=` field swap (D5); the comparison context echo + per-trip
offer swap; and empty-state/result-count toggling. It calls `window.TUI` for toasts and reuses existing
`data-modal-open`/`data-copy`/`validateForm` wiring. **`main.js` and `ui.js` are not modified.**

**Rationale**: Filter/sort/URL/detail-swap is genuine page logic that the declarative `data-*` layer does
not cover. A dedicated additive module keeps `ui.js` (the `window.TUI` contract) and `main.js` (declarative
wiring) untouched and matches the canonical structure, which already anticipates multiple JS files
(`main.js`, `dashboard.js`, `charts.js`). The homepage does **not** load `discovery.js`, so it is unaffected.

**Alternatives considered**: Inline `<script>` per page (rejected — the ui-utilities contract says pages need
no bespoke inline JS; a shared module is reusable and testable); extending `main.js` (rejected — would grow a
shared file with page-specific concerns and risk regressions on every page).

---

## D5. Deal-details data source — inline JSON catalog + static default deal

**Decision**: `deal-details.html` statically renders a **representative default deal** (so the page is fully
populated with no JS). It also embeds the deals catalog as an inline
`<script type="application/json" id="deals-catalog">…</script>` (the same entities as `assets/data/deals.json`).
On load, `discovery.js` reads `?id=`, looks the deal up in the inline catalog, and swaps the title, image,
price, rating, highlights, source badge, and terms in place. Unknown/absent id → keep the default deal (or
show a branded not-found panel linking to `deals.html`). Related deals and FAQ are static.

**Rationale**: Inline JSON guarantees the swap works with zero network (robust on `file://`, satisfies
SC-009 "no CDN/network requests"), while the static default satisfies the no-JS baseline (D1) and the
graceful-fallback requirement (FR-013/SC-006).

**Alternatives considered**: `fetch('../assets/data/deals.json')` (rejected — adds a network dependency and
fails on `file://`; the inline copy is safer and still consistent because both derive from the same
canonical schema); pre-rendering one static page per deal (rejected — N pages to maintain, out of scope).

---

## D6. Comparison page model — source offers for ONE trip (clarified)

**Decision**: `compare.html` renders a **single-trip** comparison: for the trip echoed from the URL
(`?destination=…`), it shows ≥4 mock offers from ≥3 distinct sources (Partner / Affiliate / Manual Deal /
API Ready) side by side, each with "starting from" price, rating, and a "Compare Offer / View Deal" action
linking to `deal-details.html?id=`. A small additive `assets/data/compare-offers.json` maps a few
representative destinations → offer sets; the page statically renders the default trip's offers and
`discovery.js` swaps the set + echoes the destination when a known `?destination=` is supplied. It is **not**
a user-assembled shortlist of unrelated deals.

**Rationale**: Clarified by the user and aligned with the platform thesis ("compare deals from many trusted
sources in one place") and Constitution IX (comparison pages MUST show source badges). Keying offers by
destination keeps the echo believable without a real engine.

**Alternatives considered**: Deal-shortlist comparison with a per-card "add to compare" selection (rejected
per clarification — larger scope, needs selection persistence); hybrid (rejected — largest scope, no added
value for this phase).

---

## D7. Listing & detail page contracts (Constitution VII now fully applies)

**Decision**: Implement the full contracts the homepage only previewed:
- **Listings** (`deals.html`, `coupons.html`) and the comparison: filters, sort (deals/compare), a visible
  result count + active-filter indication, a **reset** action, a branded **empty state**, and a
  **skeleton/loading** placeholder pattern (shown briefly while `discovery.js` initialises / reserved for
  future async).
- **Detail** (`deal-details.html`): main info, primary CTA (inquiry modal), trust/terms indicators, related
  deals, and a help/FAQ.

**Rationale**: These are real listing/detail pages, so Principle VII applies in full (it was "scoped/PASS"
for the homepage). Reuses existing `.card`, `.badge-*`, `.btn`, `.field`, `.skeleton`, `.empty-state`,
`.modal` components.

**Alternatives considered**: none — this is a constitutional requirement.

---

## D8. Deal-details primary CTA — validated inquiry modal reusing existing patterns (clarified)

**Decision**: The primary CTA (e.g., "اطلب الحجز" / Request Booking) opens an existing-style `.modal`
containing a `data-validate data-frontend-form` inquiry form (name, contact/email `dir="ltr"`, travel
details). It reuses the **existing** Spec 002 `data-frontend-form` behavior (validate → `preventDefault` →
success toast + inline confirmation + reset) — **no new JS** needed for the form itself. The modal opens via
the existing `data-modal-open`; focus management is handled by `TUI.modal`.

**Rationale**: Clarified by the user; reuses proven components and the existing opt-in form handler, so the
inquiry adds markup only. Frontend-only, transmits/persists nothing (FR-011, Constitution IX).

**Alternatives considered**: Lightweight toast-only (rejected per clarification); a bespoke inquiry handler
in `discovery.js` (rejected — the existing `data-frontend-form` path already does validate→toast→reset).

---

## D9. Structured data & SEO per page (honest, no live-price claim)

**Decision**:
- `deals.html`, `coupons.html`, `compare.html`: `BreadcrumbList` + `ItemList` JSON-LD summarising the
  visible items; each page keeps exactly one `<h1>`, correct heading order, and full document meta + OG.
- `deal-details.html`: `BreadcrumbList` + a `Product`/`Offer` (with `aggregateRating`) describing the deal,
  plus `FAQPage` mirroring the visible FAQ. Pricing is expressed as the indicative "starting from" value and
  the visible copy always frames it as illustrative; structured data describes mock content honestly and
  never asserts a live/guaranteed price (Constitution IX, FR-031).

**Rationale**: Matches the homepage's JSON-LD approach (`Organization`/`WebSite`/`FAQPage` already present)
and the constitution's SEO mandate (X) while staying truthful about mock data.

**Alternatives considered**: Omitting structured data (rejected — FR-031/SC-014 require it); asserting
`priceValidUntil`/live availability (rejected — would imply live data, violating IX).

---

## D10. Shell rewiring — update canonical `partials/` + every inlined copy

**Decision**: Update the canonical `partials/header.html` and `partials/footer.html` so the **deals,
compare, and coupons** links become real `href`s (`deals.html`, `compare.html`, `coupons.html`) with the
`data-coming-soon` attribute removed; links to still-unbuilt surfaces (destinations, blog/guides, auth,
about, contact, partners, terms, privacy, social) keep `data-coming-soon`. Because the shell is **inlined**
per page, apply the identical change to every page that inlines it — `index.html`, `styleguide.html`,
`components.html`, and the four new pages — so all stay 1:1 with the canonical source (SC-017). On the
homepage also rewire the in-page CTAs: featured-deal cards/“view all” → `deals.html` (and card →
`deal-details.html?id=`), coupons section/“get coupon” → `coupons.html`, hero search → `compare.html`
(D3), any "compare" CTA → `compare.html`. **No homepage section is removed; the visual identity is
unchanged.**

**Rationale**: FR-021–FR-024 require the rewiring; keeping inlined copies in sync with `partials/` upholds
Constitution III and the non-regression criterion (SC-017).

**Alternatives considered**: Runtime partial injection via `fetch` to avoid duplication (rejected — breaks
standalone rendering on `file://` and III); leaving inlined copies stale (rejected — violates the
"1:1 with canonical partials" rule and SC-017).

---

## Summary of decisions

| # | Area | Decision |
|---|------|----------|
| D1 | Rendering | Static HTML baseline + JS enhancement; cards carry filter `data-*` |
| D2 | Cross-page state | URL query params via `URLSearchParams` + `history.replaceState` |
| D3 | Hero search | Native `method="get" action="compare.html"` + `data-validate` (no shared-JS change) |
| D4 | Page logic | New additive `src/js/discovery.js` (4 new pages only); `main.js`/`ui.js` untouched |
| D5 | Deal-details data | Static default deal + inline JSON catalog; `?id=` swap (no fetch) |
| D6 | Compare model | Single-trip source-offer aggregation; `compare-offers.json` keyed by destination |
| D7 | Page contracts | Full listing (filters/sort/empty/skeleton/reset) + detail (info/CTA/related/FAQ) |
| D8 | Booking CTA | Inquiry `.modal` reusing existing `data-validate data-frontend-form` |
| D9 | SEO/JSON-LD | ItemList/Breadcrumb on listings; Product/Offer+FAQPage on details; honest pricing |
| D10 | Shell rewiring | Update canonical `partials/` + all inlined copies; out-of-scope links keep coming-soon |

**Net shared-file impact**: **no behavioral change** to `src/js/main.js` or `src/js/ui.js`; additive only —
one new `src/js/discovery.js`, new `assets/data/deals.json` + `compare-offers.json` (+ extended
`coupons.json`), optional new SVG placeholders, and link/CTA edits to the canonical `partials/` and every
inlined shell. `src/input.css` is reused; a small page-scoped `<style>` per page (as on the homepage) covers
grid layout. No `NEEDS CLARIFICATION` remain.
