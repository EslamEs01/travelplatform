# Contract: Destinations & Blog Content Pages

**Feature**: `004-destinations-blog-seo` | **Date**: 2026-06-01

This contract defines the **observable structure and behavior** each new page MUST satisfy, plus the homepage/shell
**navigation-rewiring** contract. It is the acceptance surface for `/speckit-tasks` and QA. "MUST" items are
non-negotiable; they trace to the spec's FRs/SCs and the constitution. All pages reuse the inlined shell, design
tokens, components, and `window.TUI`; only `src/js/content.js` is added (no change to `main.js`/`ui.js`/`discovery.js`).

---

## C0. Shared page contract (all four pages)

- **C0.1** Standalone HTML5 document: `<html lang="ar" dir="rtl" data-page="…">`, inlined `head`/`header`/`footer` 1:1
  with `partials/`, `#main` landmark, skip link, `#toast-root`. Renders with no console errors and **zero external
  CDN/network requests** for CSS/JS/fonts/images. (FR-003/FR-004; SC-001/SC-013)
- **C0.2** Loads `../src/js/ui.js`, `../src/js/main.js`, `../src/js/content.js` (all `defer`). No inline page JS beyond
  JSON-LD and the inline JSON catalog on the two detail pages. (research D3/D4)
- **C0.3** Exactly one `<h1>`; `<h2>` section headings; `<h3>` card/sub-section titles; correct heading order; the
  specified breadcrumb; full meta (Arabic title + description, viewport, theme-color, OG baseline). (FR-035; SC-014)
- **C0.4** Arabic RTL default, English-ready (logical properties; no hard-coded LTR). Mobile-first, usable 320–360px →
  desktop, **no horizontal scroll**, touch targets ≥ ~44px. (FR-032/FR-033; SC-001/SC-011)
- **C0.5** WCAG 2.1 AA: AA contrast, full keyboard operability + visible focus, focus-managed modal, meaningful `alt`,
  labelled fields with programmatic error links (`aria-invalid`/`aria-describedby`), `[aria-live]` result/empty
  announcements, accessible labels on icon-only controls, reduced-motion respected. `npm run audit:a11y` → 0
  violations. (FR-034; SC-015)
- **C0.6** No dead interactions: every control navigates, opens the modal/drawer, toggles a visible state
  (save/bookmark/accordion), shows a toast, copies, applies a filter/search, or submits a validated form. Zero bare
  `#` without a handler, zero `alert()`/`confirm()`/`prompt()`. (FR-030/FR-031; SC-002)
- **C0.7** ≥95% of styling via existing tokens/utilities; only a small page-scoped `<style>` for grid / price-trend
  bars / TOC layout (as `index.html`). No new visual identity. (FR-001; SC-012)
- **C0.8** All content is believable mock/editorial; reused deal/coupon source badges limited to
  Partner/Affiliate/Manual Deal/API Ready; safe labels only; "ابتداءً من"/تقديري pricing; price-trend explicitly
  illustrative; visa "لا تعتبر بديلاً عن المصادر الرسمية"; never implies live data, real notification, or AI.
  (FR-025; IX)
- **C0.9** Core/default content renders with JavaScript disabled (static-HTML-first); JS only enhances. (FR-005;
  SC-018)

---

## C1. `destinations.html` — destinations listing (US1)

- **C1.1** Renders **≥12** destination cards from the `destinations-full.json` catalog as static HTML, each with
  imagery + meaningful `alt`, city/country, region, a short SEO description, illustrative "ابتداءً من"/تقديري price,
  best season, deals & coupons counts, `popularFor` style badges, a visa/travel note, a primary CTA ("استكشف الوجهة" →
  `destination-details.html?id=<id>`), a secondary CTA (`deals.html` / `compare.html?destination=<name>`), and a
  save/favorite control. Cards carry `data-region`/`data-style`/`data-price`/`data-season`/`data-destination`/
  `data-search`/`data-card`. (FR-006; SC-003)
- **C1.2** Provides a **search** input (city/country) and **region + travel-style filter chips**
  (`aria-pressed`, "الكل" resets a facet) that narrow the visible cards; a visible **result count**
  (`[data-result-count][aria-live="polite"]`) + active-chip indication. (FR-007; SC-003)
- **C1.3** Provides a **reset** action clearing all search/filters to the default set; a branded **empty state** with a
  reset action + a CTA to deals/compare when nothing matches; and a **skeleton** placeholder pattern. (FR-008; SC-003)
- **C1.4** Search/filter state is reflected in the URL (`?region=&style=&q=`) and restored on load (research D2). No-JS
  baseline shows all destinations. (FR-007; SC-018)
- **C1.5** Includes a hero (search + CTAs + trust badges), **≥8** popular-route cards (→ `compare.html?destination=`),
  a seasonal-ideas section, a substantial SEO content block, a 3–4 article guides teaser (→ `article.html?id=`), a
  validated destination-alert form, and a **≥5** FAQ. (FR-009; SC-004)
- **C1.6** JSON-LD: `BreadcrumbList` + `ItemList`. (FR-036)

## C2. `destination-details.html` — destination landing (US2)

- **C2.1** Statically renders the **default Dubai** destination (hero with one `<h1>` "دبي، الإمارات", region/country
  badge, imagery + `alt`, SEO summary, best-for badges, CTAs deals/compare/price-alert, illustrative-data note) +
  breadcrumb (الرئيسية / الوجهات / دبي), readable with no JS. (FR-010; SC-005)
- **C2.2** Reads `?id=` (or `?destination=` slug) and swaps the destination from the inline catalog; unknown/absent/
  invalid → Dubai default. Never empty/broken. (FR-013; SC-005)
- **C2.3** Includes **≥8** quick-facts cards (safe wording); **4–6** related deal cards (→ `deal-details.html?id=`);
  **3–4** related coupon cards (code `dir="ltr"`, `data-copy` → success toast); an illustrative **price-trend teaser**
  explicitly "مثال توضيحي … لا يمثل أسعارًا مباشرة … قابل للربط لاحقًا"; **≥6** best-areas cards (CTA → deals/compare);
  **≥8** things-to-do cards; substantial long-form guide content; a **3-day itinerary**; **3–4** related article cards
  (→ `article.html?id=`). (FR-011; SC-005)
- **C2.4** Primary "فعّل تنبيه الأسعار" CTA opens a **price-alert modal** containing a `data-validate
  data-frontend-form` form (email `dir="ltr"` required; destination; max budget; travel month; travelers) with
  valid/invalid/error/success states → success toast + inline confirmation + reset. Frontend-only; persists/transmits
  nothing; no real notification. Includes a save/favorite toggle and a **≥8** FAQ. (FR-012; SC-005)
- **C2.5** JSON-LD: `BreadcrumbList` + `FAQPage` (mirrors the FAQ) [+ optional `TouristDestination`]; pricing/visa
  illustrative, never live/official. (FR-036; SC-014)

## C3. `blog.html` — travel-guides listing (US3)

- **C3.1** Renders **≥12** article cards from `articles.json` as static HTML (imagery + `alt`, category, title,
  excerpt, reading time, date, author, related destination/type, CTA → `article.html?id=<id>`, optional
  save/bookmark) **plus** a large **featured article** card. Cards carry `data-category`/`data-search`/`data-card`.
  (FR-014; SC-006)
- **C3.2** Provides **category filter chips** (`aria-pressed`, "الكل" resets) + a **search** input that narrow the
  grid; a visible **result count** (`[data-result-count][aria-live]`); a **reset** action; a branded **empty state**;
  and a **skeleton** pattern. URL-reflected (`?category=&q=`) and restored on load. (FR-015; SC-006/SC-018)
- **C3.3** Includes a hero (search + CTAs), a popular-guides/sidebar block, a substantial SEO content section, a
  validated guide-alert form, and a **≥5** FAQ. (FR-016; SC-006)
- **C3.4** JSON-LD: `BreadcrumbList` + `Blog`/`ItemList`. (FR-036)

## C4. `article.html` — long-form article (US4)

- **C4.1** Statically renders the **default article** ("كيف تجد أرخص عروض السفر إلى دبي؟") inside a semantic
  `<article>` with one `<h1>`, an article header (category badge, excerpt, author, publish + last-updated dates,
  reading time, related-destination badge, share buttons), and a breadcrumb (الرئيسية / المدونة / <title>) — readable
  with no JS. (FR-017; SC-007)
- **C4.2** Reads `?id=` (or `?article=` slug) and shows the matching article; unknown/absent/invalid → default
  article. Never empty/broken. (FR-021; SC-007)
- **C4.3** Includes a **table of contents** of 8 in-page anchors (مقدمة، أفضل وقت للحجز، مقارنة الطيران والفنادق،
  استخدام الكوبونات، اختيار المنطقة المناسبة، نصائح للعائلات، أخطاء يجب تجنبها، خلاصة) that scroll to the body sections
  (reduced-motion respected); substantial real Arabic body across those sections with internal links to
  compare/deals/coupons/destination pages. (FR-018; SC-007)
- **C4.4** Embeds an inline **related-deal card** (→ `deal-details.html?id=`) and an inline **coupon card** (code
  `dir="ltr"`, `data-copy` → success toast, no dialog); plus **3 related destinations** (→ `destination-details.html?id=`)
  and **3 related articles** (→ `article.html?id=`). (FR-019; SC-007)
- **C4.5** Share buttons show a **toast only** (no real share, no dialog). Includes a **≥6** FAQ and a validated
  newsletter/price-alert form (email required; destination; interest category) → toast + inline success, no
  real-subscription claim; MAY include a save/article toggle. (FR-017/FR-020; SC-007)
- **C4.6** JSON-LD: `BreadcrumbList` + `Article` (headline/author/datePublished/dateModified/image) + `FAQPage`
  (mirrors the FAQ); no live-data claim. (FR-036; SC-014)

---

## C5. Navigation rewiring contract (US5)

- **C5.1** Canonical `partials/header.html` + `partials/footer.html` updated so **الوجهات** → `destinations.html` and
  **المدونة / دليل السفر** → `blog.html` become real `href`s with `data-coming-soon` **removed**. (FR-026/FR-028)
- **C5.2** The identical shell change is applied to **every inlined copy** — `index.html`, the four Spec 003 pages
  (`deals`/`deal-details`/`compare`/`coupons`), `styleguide.html`, `components.html`, and the four new pages — so all
  stay 1:1 with `partials/`. (FR-026; SC-009/SC-017)
- **C5.3** Homepage in-page teaser cards rewired: the 4 popular-destination `.dest-card` controls →
  `destination-details.html?id=<id>` (`dest-istanbul`/`dest-dubai`/`dest-maldives`/`dest-paris`); the 3 travel-guide
  `.guide-card` "اقرأ المزيد" controls → `article.html?id=<id>` (consistent article ids). (FR-027)
- **C5.4** Links to still-out-of-scope surfaces (auth/login/register, saved deals, price-alerts management, merchant
  dashboard, SaaS owner admin, unbuilt about/contact/privacy/terms, social) **keep** `data-coming-soon`. No navigation
  to non-existent pages. (FR-029)
- **C5.5** **No existing homepage section is removed**; the visual identity is unchanged; `index.html` still renders
  all Spec 002 sections. (FR-029; SC-009/SC-017)

---

## C6. Non-regression contract

- **C6.1** `src/js/main.js`, `src/js/ui.js`, and `src/js/discovery.js` are **unchanged** (no behavioral diff). New
  behavior lives in the additive `src/js/content.js`, loaded only by the four new pages. (research D4)
- **C6.2** The homepage (all Spec 002 sections), the four Spec 003 pages (`deals`/`deal-details`/`compare`/`coupons`),
  `styleguide.html`, and `components.html` still render; their inlined shell matches the updated canonical `partials/`.
  (SC-017)
- **C6.3** Stack-compliance grep gate returns no matches; `npm run build` regenerates cleanly; zero console errors on
  the new pages. (SC-013/SC-017)
