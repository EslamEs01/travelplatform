# Quickstart: Public Homepage

**Feature**: `002-public-homepage` | **Date**: 2026-05-31

How to build, preview, and verify the real public homepage. The toolchain is unchanged from Spec 001
(HTML + local Tailwind v3.4 build + vanilla JS, **no CDN, no framework**). This feature is composition +
content on the existing foundation.

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only). Spec 001 already installed dependencies.
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → open http://localhost:3000/pages/index.html
```

> Rebuild after editing markup so Tailwind's content scan picks up any newly-used utility classes.

## 2. Per-page "done" checklist (Constitution gate)

The homepage is **NOT done** until all pass:

- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network
      requests** for CSS/JS/fonts/images (SC-009).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; fully usable at 360px with **no horizontal
      scroll** (SC-001); touch targets ≥ ~44px (SC-012).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors layout with no breakage (SC-007).
- [ ] **Value clear**: single `<h1>` value proposition + search/comparison entry both within the first 360px viewport (above the fold) (SC-003).
- [ ] **Design-system fidelity**: ≥95% of styling via existing tokens/utilities; no new ad-hoc page-specific styles; no new visual identity introduced (SC-008).
- [ ] **Search works (frontend-only)**: empty/invalid submit → inline validation, blocked; valid submit →
      success toast + inline echo, **no navigation**, nothing implies storage/live data (SC-004).
- [ ] **Explore substance**: ≥6 featured deals (source badges + safe labels), ≥4 destinations, ≥3 coupons —
      all believable mock, never live pricing (SC-006).
- [ ] **Coupons copy**: every coupon code copies via the copy control with a success toast; zero browser
      dialogs (SC-005).
- [ ] **Deal CTA**: ≥1 deal opens a quick-view modal (focus-managed, `Esc`/overlay/close dismiss); others
      show a coming-soon toast. No dead controls.
- [ ] **Trust + social proof**: testimonials + trusted partners + trust band present, clearly mock.
- [ ] **Newsletter (frontend-only)**: invalid → inline error; valid → success toast/inline; persists nothing (SC-004).
- [ ] **No dead interactions**: zero bare `#` links without a handled action, zero dead buttons, zero
      `alert()`/`confirm()`/`prompt()` (SC-002).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, required meta, and valid
      `Organization` + `WebSite` + `FAQPage` JSON-LD; FAQ answers ≥3 questions (SC-011).
- [ ] **Accessibility — WCAG 2.1 AA**: `npm run audit:a11y` reports **0 AA violations**; keyboard-only
      reaches/operates 100% of interactive elements (search, card CTAs, copy, modal/drawer, forms); visible
      focus; reduced-motion respected (SC-012).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-013); minified CSS,
      font preload + `font-display: swap`, lazy non-hero images.
- [ ] **No regression**: `pages/styleguide.html` and `pages/components.html` still render; the homepage's
      header/footer match the canonical `partials/` source (SC-014).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules):
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
```

Any match fails review (Principle II / SC-010).

## 4. Validation commands

```bash
npx html-validate pages/index.html         # 0 errors
npx stylelint "src/**/*.css"                # 0 errors (only if src/input.css was touched)
npx prettier --check "src/js/**/*.js" "pages/index.html"
npm run serve & npm run audit:a11y          # 0 WCAG 2.1 AA violations
```

## Where things live

- Page → `pages/index.html` (the deliverable).
- Reused shell → `partials/head.html`, `partials/header.html`, `partials/footer.html`.
- Reused tokens/components → `tailwind.config.js`, `src/input.css`.
- Reused interactions → `src/js/ui.js` (`window.TUI`); additive opt-in form handling in `src/js/main.js`.
- Mock content → `assets/data/featured.json` (reused), `destinations.json` + `coupons.json` (new).
- Contracts → `specs/002-public-homepage/contracts/` (homepage-content, mock-data).
