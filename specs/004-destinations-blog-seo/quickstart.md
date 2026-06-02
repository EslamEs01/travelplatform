# Quickstart: Destinations & Blog SEO Content Pages

**Feature**: `004-destinations-blog-seo` | **Date**: 2026-06-01

How to build, preview, and verify the four new public content pages (`destinations.html`, `destination-details.html`,
`blog.html`, `article.html`) plus the homepage/shell navigation rewiring. The toolchain is unchanged from Spec
001/002/003 (HTML + local Tailwind v3.4 build + vanilla JS, **no CDN, no framework**). This feature is static
composition + editorial content on the existing foundation, enhanced by one additive JS module (`content.js`).

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only; already installed in Spec 001).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → http://localhost:3000/pages/destinations.html
```

Preview the content funnel end-to-end:
- `…/pages/index.html` → click a popular-destination card → `destination-details.html?id=dest-…`; click a guide card → `article.html?id=art-…`
- `…/pages/destinations.html` → search + toggle region/style chips (URL updates) → click a card → `destination-details.html?id=…`
- `…/pages/destination-details.html` (default Dubai) and `?id=dest-istanbul` → copy a coupon → toast; "فعّل تنبيه الأسعار" opens the modal
- `…/pages/blog.html` → toggle a category chip + search → click an article → `article.html?id=…`
- `…/pages/article.html` (default) and `?id=art-…` → click a TOC link (scrolls); copy the inline coupon; share button → toast
- Direct deep links: `destinations.html?region=الخليج&style=عائلات`, `destination-details.html?id=dest-paris`, `blog.html?category=طيران`, `article.html?id=art-cheap-dubai-deals`

> Rebuild after editing markup so Tailwind's content scan picks up newly-used utility classes. The Tailwind config
> globs (`./pages/**/*.html`, `./partials/**/*.html`, `./src/js/**/*.js`) already cover the new pages and `content.js`.

## 2. Per-page "done" checklist (Constitution gate)

A page is **NOT done** until all pass. Run for **each** of the four pages.

**All pages**
- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network requests** for
      CSS/JS/fonts/images (SC-013).
- [ ] **No-JS baseline**: with JavaScript disabled, the default content (destinations grid / default Dubai destination
      / blog grid + featured / default article) renders and is readable (SC-018; FR-005).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; usable at 360px with **no horizontal scroll** (SC-001);
      touch targets ≥ ~44px (SC-015).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors layout with no structural breakage (SC-011).
- [ ] **Design-system fidelity**: ≥95% styling via tokens/utilities; no new visual identity (SC-012).
- [ ] **No dead interactions**: zero bare `#` without a handler, zero dead buttons, zero `alert()`/`confirm()`/
      `prompt()` (SC-002).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, the specified breadcrumb, required Arabic
      title/meta, valid JSON-LD (ItemList/Breadcrumb on listings; BreadcrumbList+FAQPage on details; Article on the
      article) describing mock content honestly (SC-014).
- [ ] **Honest copy**: no live-price/real-booking/connected-API/active-scraping/guaranteed-coupon/processed-payment/
      sent-notification/active-AI/official-visa claims; price-trend explicitly illustrative; visa "لا تعتبر بديلاً عن
      المصادر الرسمية" (SC-010).
- [ ] **Accessibility WCAG 2.1 AA**: `npm run audit:a11y` → 0 violations; keyboard reaches/operates 100% of controls
      (search, chips, reset, card CTAs, save/bookmark, copy, TOC, share, modal, forms); visible focus; reduced-motion
      respected; `[aria-live]` announces result/empty changes (SC-015).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-016).

**`destinations.html`**
- [ ] ≥12 destination cards (style badges + safe pricing + CTA → `destination-details.html?id=`) (SC-003).
- [ ] Search + region/style chips narrow the set; result count updates (aria-live); reset restores full set; branded
      empty state + CTA to deals/compare; skeleton pattern present (SC-003).
- [ ] ≥8 popular-route cards (→ `compare.html?destination=`), seasonal ideas, substantial SEO block, 3–4 guides
      teaser, validated destination-alert form, ≥5 FAQ (SC-004).
- [ ] Search/filter state in the URL and restored on reload/share (SC-018).

**`destination-details.html`**
- [ ] Default Dubai renders with no JS; `?id=<known>` shows that destination; unknown/absent → Dubai default (SC-005).
- [ ] ≥8 quick-facts; 4–6 related deals (→ `deal-details.html?id=`); 3–4 coupons (copy → toast); illustrative
      price-trend teaser (explicitly not-live); ≥6 areas; ≥8 things-to-do; long-form guide content; 3-day itinerary;
      3–4 related articles; save toggle; ≥8 FAQ (SC-005).
- [ ] "فعّل تنبيه الأسعار" opens a validated modal (valid/invalid/error/success), frontend-only, persists nothing
      (SC-005).

**`blog.html`**
- [ ] ≥12 article cards + a featured article (CTA → `article.html?id=`) (SC-006).
- [ ] Category chips + search narrow the grid; result count (aria-live); reset; branded empty state; skeleton; URL
      reflected (SC-006/SC-018).
- [ ] Popular-guides/sidebar block, substantial SEO section, validated guide-alert form, ≥5 FAQ (SC-006).

**`article.html`**
- [ ] Default article renders with no JS inside `<article>` with one `<h1>`; `?id=<known>` shows that article;
      unknown/absent → default (SC-007).
- [ ] TOC of 8 anchors scrolls to body sections; substantial Arabic body with internal links to
      compare/deals/coupons/destination (SC-007).
- [ ] Inline related-deal card (→ `deal-details.html?id=`); inline coupon copy → toast (no dialog); 3 related
      destinations; 3 related articles; share buttons → toast only; validated newsletter form; ≥6 FAQ (SC-007).

**Navigation rewiring + non-regression**
- [ ] Header/drawer الوجهات → `destinations.html`, المدونة → `blog.html`; homepage popular-destination cards →
      `destination-details.html?id=`; homepage guide cards → `article.html?id=`; footer destination/blog links resolve;
      out-of-scope links keep "coming soon" (SC-009).
- [ ] **No homepage section removed**; visual identity unchanged vs Spec 002 (SC-009/SC-017).
- [ ] `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js` unchanged; homepage, the four Spec 003 pages,
      `styleguide.html`, `components.html` still render and their shell matches canonical `partials/` (SC-017).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules):
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
```

Any match fails review (Principle II / SC-013).

## 4. Validation commands

```bash
npx html-validate pages/destinations.html pages/destination-details.html pages/blog.html pages/article.html  # 0 errors
npx stylelint "src/**/*.css"                                          # 0 errors (only if input.css touched)
npx prettier --check "src/js/**/*.js" "pages/*.html"
npm run serve & axe http://localhost:3000/pages/destinations.html     # repeat per page → 0 AA violations
```

## 5. Mock-data consistency check

- [ ] `destinations-full.json` ≥12 items (full schema; `dest-dubai` default; `dest-istanbul`/`dest-dubai`/
      `dest-maldives`/`dest-paris` match `destinations.json`).
- [ ] `articles.json` ≥12 items (full schema; `art-cheap-dubai-deals` default; 3 homepage-teaser guides present).
- [ ] Every `relatedDealIds`/`relatedCouponIds`/`relatedArticleIds`/`relatedDestinationId` and every rendered
      `?id=`/`deal-details.html?id=` resolves to a real entry — no dangling links.

## Where things live

- Pages → `pages/destinations.html`, `pages/destination-details.html`, `pages/blog.html`, `pages/article.html`.
- Reused shell → `partials/head.html`, `partials/header.html`, `partials/footer.html` (header/footer updated for nav
  rewiring; copies inlined per page).
- Reused tokens/components → `tailwind.config.js`, `src/input.css` (incl. `.dest-card`/`.guide-card`).
- Reused interactions → `src/js/ui.js` (`window.TUI`) + `src/js/main.js` (declarative `data-*`, incl.
  `data-coming-soon`) + `src/js/discovery.js` (Spec 003) — **all unchanged**.
- New page logic → `src/js/content.js` (search/filter/URL state/`?id=` swap/TOC/save); loaded on the four new pages
  only, dispatched by `<html data-page>`.
- Mock content → `assets/data/destinations-full.json` (NEW), `articles.json` (NEW); `deals.json`/`coupons.json`/
  `compare-offers.json`/`destinations.json` (reused unchanged); `assets/images/*` (new SVG placeholders if needed).
- Contracts → `specs/004-destinations-blog-seo/contracts/` (content-pages, mock-data).
- QA artifact → `qa-results.md` (produced after implementation).
