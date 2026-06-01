# Quickstart: Public Discovery & Monetization Pages

**Feature**: `003-public-discovery-pages` | **Date**: 2026-06-01

How to build, preview, and verify the four new public pages (`deals.html`, `deal-details.html`,
`compare.html`, `coupons.html`) plus the homepage/shell navigation rewiring. The toolchain is unchanged from
Spec 001/002 (HTML + local Tailwind v3.4 build + vanilla JS, **no CDN, no framework**). This feature is
static composition + content on the existing foundation, enhanced by one additive JS module.

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only; already installed in Spec 001).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → http://localhost:3000/pages/deals.html
```

Preview the funnel end-to-end:
- `…/pages/index.html` → submit hero search → lands on `compare.html?destination=…`
- `…/pages/deals.html` → apply filters/sort (URL updates) → click a card → `deal-details.html?id=…`
- `…/pages/deal-details.html?id=deal-002` → "Request Booking" opens the inquiry modal
- `…/pages/coupons.html` → copy a code → success toast
- Direct deep links: `deals.html?source=Partner&sort=price-asc`, `deal-details.html?id=deal-007`

> Rebuild after editing markup so Tailwind's content scan picks up newly-used utility classes.

## 2. Per-page "done" checklist (Constitution gate)

A page is **NOT done** until all pass. Run for **each** of the four pages.

**All pages**
- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network
      requests** for CSS/JS/fonts/images (SC-013).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; usable at 360px with **no horizontal scroll**
      (SC-001); touch targets ≥ ~44px (SC-015).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors layout with no breakage (SC-011).
- [ ] **Design-system fidelity**: ≥95% styling via tokens/utilities; no new visual identity (SC-012).
- [ ] **No dead interactions**: zero bare `#` without a handler, zero dead buttons, zero
      `alert()`/`confirm()`/`prompt()` (SC-002).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, required meta, valid JSON-LD for the page
      (ItemList/Breadcrumb on listings; Product/Offer+FAQPage on details) describing mock content honestly
      (SC-014).
- [ ] **Accessibility WCAG 2.1 AA**: `npm run audit:a11y` → 0 violations; keyboard reaches/operates 100% of
      controls (filters, sort, reset, card CTAs, copy, modal, inquiry form); visible focus; reduced-motion
      respected; `[aria-live]` announces result/empty changes (SC-015).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-016).

**`deals.html`**
- [ ] ≥9 deal cards (source badges + safe CTA → `deal-details.html?id=`) (SC-003).
- [ ] Filters (source/region/priceMax) narrow the set; sort (price/rating) reorders; result count updates;
      reset restores full set; branded empty state when nothing matches; skeleton pattern present (SC-004).
- [ ] Filter/sort state in the URL and restored on reload/share (SC-018).

**`deal-details.html`**
- [ ] `?id=<known>` shows that deal; unknown/absent → default deal or branded not-found linking to deals
      (SC-006).
- [ ] Full info + ≥4 highlights + illustrative terms; ≥3 related deals; help/FAQ ≥3 (SC-005).
- [ ] Primary CTA opens a validated inquiry modal (valid/invalid/error/success), frontend-only, persists
      nothing (SC-005).

**`compare.html`**
- [ ] ≥4 offers across ≥3 sources for a single trip; echoes `?destination=` (default when absent) (SC-007).
- [ ] Sort/filter reorder/narrow with count + URL sync; branded empty state (SC-004).
- [ ] Readable/usable at 360px (cards), columns/table ≥md (SC-001).

**`coupons.html`**
- [ ] ≥6 coupons; every code copies via the copy control → success toast; zero browser dialogs (SC-008).
- [ ] Filters (source/category) + reset + empty state; URL-reflected (SC-004).
- [ ] Coupons shared with the homepage are identical (SC-009).

**Navigation rewiring + non-regression**
- [ ] Hero search navigates to `compare.html` with query params; deals/compare/coupons/deal CTAs and
      header/drawer/footer links resolve to real pages; out-of-scope links keep "coming soon" (SC-010).
- [ ] **No homepage section removed**; visual identity unchanged vs Spec 002 (SC-010/SC-017).
- [ ] `src/js/main.js` and `src/js/ui.js` unchanged; `styleguide.html` + `components.html` still render and
      their shell matches canonical `partials/` (SC-017).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules):
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
```

Any match fails review (Principle II / SC-013).

## 4. Validation commands

```bash
npx html-validate pages/deals.html pages/deal-details.html pages/compare.html pages/coupons.html  # 0 errors
npx stylelint "src/**/*.css"                                          # 0 errors (only if input.css touched)
npx prettier --check "src/js/**/*.js" "pages/*.html"
npm run serve & axe http://localhost:3000/pages/deals.html            # repeat per page → 0 AA violations
```

## Where things live

- Pages → `pages/deals.html`, `pages/deal-details.html`, `pages/compare.html`, `pages/coupons.html`.
- Reused shell → `partials/head.html`, `partials/header.html`, `partials/footer.html` (header/footer updated
  for nav rewiring; copies inlined per page).
- Reused tokens/components → `tailwind.config.js`, `src/input.css`.
- Reused interactions → `src/js/ui.js` (`window.TUI`) + `src/js/main.js` (declarative `data-*`) — **unchanged**.
- New page logic → `src/js/discovery.js` (filter/sort/URL/detail-swap/compare-context); loaded on the four
  new pages only.
- Mock content → `assets/data/deals.json` (NEW), `compare-offers.json` (NEW), `coupons.json` (extended),
  `featured.json` (kept consistent), `assets/images/*` (new SVG placeholders if needed).
- Contracts → `specs/003-public-discovery-pages/contracts/` (discovery-pages, mock-data).
