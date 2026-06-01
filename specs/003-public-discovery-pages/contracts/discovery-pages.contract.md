# Contract: Discovery & Monetization Pages

**Feature**: `003-public-discovery-pages` | **Date**: 2026-06-01

This contract defines the **observable structure and behavior** each new page MUST satisfy, plus the
homepage/shell **navigation-rewiring** contract. It is the acceptance surface for `/speckit-tasks` and QA.
"MUST" items are non-negotiable; they trace to the spec's FRs/SCs and the constitution. All pages reuse the
inlined shell, design tokens, components, and `window.TUI`; only `src/js/discovery.js` is added (no change to
`main.js`/`ui.js`).

---

## C0. Shared page contract (all four pages)

- **C0.1** Standalone HTML5 document: `<html lang="ar" dir="rtl">`, inlined `head`/`header`/`footer` 1:1 with
  `partials/`, `#main` landmark, skip link, `#toast-root`. Renders with no console errors and **zero
  external CDN/network requests** for CSS/JS/fonts/images. (FR-003/FR-004; SC-001/SC-013)
- **C0.2** Loads `../src/js/ui.js`, `../src/js/main.js`, `../src/js/discovery.js` (all `defer`). No inline
  page JS beyond JSON-LD and the inline JSON catalog on `deal-details.html`. (research D4/D5)
- **C0.3** Exactly one `<h1>`; `<h2>` section headings; `<h3>` card titles; correct heading order; full meta
  (title, description, viewport, theme-color, OG baseline). (FR-030; SC-014)
- **C0.4** Arabic RTL default, English-ready (logical properties; no hard-coded LTR). Mobile-first, usable
  320–360px → desktop, **no horizontal scroll**, touch targets ≥ ~44px. (FR-027/FR-028; SC-001/SC-011)
- **C0.5** WCAG 2.1 AA: AA contrast, full keyboard operability + visible focus, focus-managed modals,
  meaningful `alt`, labelled fields with programmatic error links, `[aria-live]` result/empty announcements,
  reduced-motion respected. `npm run audit:a11y` → 0 violations. (FR-029; SC-015)
- **C0.6** No dead interactions: every control navigates, opens a modal/drawer, toggles a visible state,
  shows a toast, copies, applies a filter/sort, or submits a validated form. Zero bare `#` without a handler,
  zero `alert()`/`confirm()`/`prompt()`. (FR-025/FR-026; SC-002)
- **C0.7** ≥95% of styling via existing tokens/utilities; only a small page-scoped `<style>` for grid layout
  (as `index.html`). No new visual identity. (FR-001; SC-012)
- **C0.8** All content is believable mock; source badges limited to Partner/Affiliate/Manual Deal/API Ready;
  safe CTA labels only; "ابتداءً من" pricing; never implies live data. (FR-005/FR-012-equivalent; IX)

---

## C1. `deals.html` — deals listing (US1)

- **C1.1** Renders **≥9** deal cards from the `deals.json` catalog as static HTML, each with a source badge,
  "ابتداءً من" price, rating, and a safe CTA linking to `deal-details.html?id=<id>`. (FR-006/FR-009; SC-003)
- **C1.2** Provides **filters** — at minimum `source`, `region`, and `priceMax` — that narrow the visible
  cards; a visible **result count** (`[aria-live]`) and active-filter indication; and a **sort** control with
  at least `price-asc`, `price-desc`, `rating-desc`. (FR-007)
- **C1.3** Provides a **reset** action clearing all filters/sort to the default set; a branded **empty state**
  with a reset action when nothing matches; and a **skeleton** placeholder pattern. (FR-008; SC-004)
- **C1.4** Filter/sort state is reflected in the URL (`?source=&region=&priceMax=&sort=`) and restored on
  load (research D2). No-JS baseline shows all deals. (FR-007; SC-018)
- **C1.5** Includes a deals help FAQ and `BreadcrumbList`+`ItemList` JSON-LD. (FR-031)

## C2. `deal-details.html` — deal detail (US2)

- **C2.1** Statically renders a representative default deal (full info: `<h1>` title, gallery/imagery with
  `alt`, "ابتداءً من" price+currency, rating+reviews, ≥4 highlights/inclusions, source badge, illustrative
  terms/cancellation). (FR-010)
- **C2.2** Reads `?id=` and swaps the deal fields from the inline JSON catalog; unknown/absent id →
  representative default **or** a branded not-found panel linking to `deals.html`. Never empty/broken.
  (FR-013; SC-006)
- **C2.3** Primary CTA (safe label, e.g. "اطلب الحجز") opens an inquiry **modal** containing a
  `data-validate data-frontend-form` form (name + email`dir=ltr` required; travel date/travelers/notes
  optional) with valid/invalid/error/success states; on valid submit → success toast + inline confirmation +
  reset. Frontend-only; transmits/persists nothing. (FR-011; SC-005)
- **C2.4** Includes **≥3 related deals** (cards linking to their own `?id=`) and a **help/FAQ ≥3** Q&A.
  (FR-012; SC-005)
- **C2.5** JSON-LD: `BreadcrumbList` + `Product`/`Offer` (+`aggregateRating`) + `FAQPage` mirroring the FAQ;
  pricing illustrative, never live. (FR-031; SC-014)

## C3. `compare.html` — single-trip source-offer comparison (US3)

- **C3.1** Presents **≥4** comparable offers for a **single trip**, from **≥3 distinct sources**, each with a
  source badge, "ابتداءً من" price, rating, and a safe action linking to `deal-details.html?id=`. Readable
  and usable down to ~320–360px (cards on mobile, columns/table ≥md). (FR-014/FR-017; SC-007)
- **C3.2** Reads `?destination=&dates=&travelers=` and visibly **echoes** the trip context; with
  absent/invalid params shows a sensible default trip comparison. Not a shortlist of unrelated deals.
  (FR-015; SC-007)
- **C3.3** Supports **sort** (price, rating) and **filter** (source) with visible active state + result
  count, reflects sort/filter in the URL, and shows a branded **empty state** when filters exclude all.
  (FR-016; SC-004)
- **C3.4** Includes a comparison help FAQ + trust band and `BreadcrumbList`+`ItemList` JSON-LD. (FR-031)

## C4. `coupons.html` — coupons listing (US4)

- **C4.1** Renders **≥6** coupon cards from `coupons.json` as static HTML, each with title, merchant/source
  attribution + source badge, discount value, illustrative validity/terms, and a **copyable code**
  (`data-copy`, code `dir=ltr`) → success toast. Never a browser dialog. (FR-018; SC-008)
- **C4.2** Provides **filters** — at minimum `source` and `category` — narrowing visible coupons with active
  state + result count, a **reset** action, and a branded **empty state**. URL-reflected. (FR-019; SC-004)
- **C4.3** Coupons shared with the homepage are identical (id/code/discount/source/terms). (FR-020; SC-009)
- **C4.4** Includes a coupons help FAQ + `BreadcrumbList`+`ItemList` JSON-LD. (FR-031)

---

## C5. Navigation rewiring contract (US5)

- **C5.1** Canonical `partials/header.html` + `partials/footer.html` updated so **deals / compare / coupons**
  links become real `href`s (`deals.html`/`compare.html`/`coupons.html`) with `data-coming-soon` **removed**.
  (FR-023)
- **C5.2** The identical shell change is applied to **every inlined copy** — `index.html`, `styleguide.html`,
  `components.html`, and the four new pages — so all stay 1:1 with `partials/`. (FR-023; SC-017)
- **C5.3** Homepage in-page CTAs rewired: hero search → `compare.html` (native GET, research D3); featured
  deal cards → `deal-details.html?id=`; "view all deals"/featured → `deals.html`; coupons section / "get
  coupon" → `coupons.html`; any compare CTA → `compare.html`. (FR-021/FR-022)
- **C5.4** Links to still-out-of-scope surfaces (destinations, blog/guides, auth, about, contact, partners,
  terms, privacy, social) **keep** `data-coming-soon`. No navigation to non-existent pages. (FR-024)
- **C5.5** **No existing homepage section is removed**; the visual identity is unchanged; `index.html` still
  renders all Spec 002 sections. (FR-024; SC-010/SC-017)

---

## C6. Non-regression contract

- **C6.1** `src/js/main.js` and `src/js/ui.js` are **unchanged** (no behavioral diff). New behavior lives in
  the additive `src/js/discovery.js`, loaded only by the four new pages. (research D4)
- **C6.2** `pages/styleguide.html` and `pages/components.html` still render; their inlined shell matches the
  updated canonical `partials/`. (SC-017)
- **C6.3** Stack-compliance grep gate returns no matches; build output regenerates cleanly. (SC-013)
