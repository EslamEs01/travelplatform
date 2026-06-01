# Contract: Public Homepage Content & Interaction

**Feature**: `002-public-homepage` | **Date**: 2026-05-31

Defines the required structure, sections, and interaction behavior of the real public homepage
(`travel-saas-frontend/pages/index.html`). The page MUST satisfy the Spec 001 page-shell contract (head meta,
landmark order, single `<h1>`, `defer` scripts, `#toast-root`) and this content contract. All patterns are
reused from Spec 001; no new visual identity.

## C0. Inherited from Spec 001 (unchanged)

- `<!DOCTYPE html><html lang="ar" dir="rtl">`; full `<head>` meta per page-shell contract.
- Canonical header + slide-in drawer + footer, matching `partials/` 1:1.
- `<a href="#main" class="skip-link">`, `<main id="main">`, `#toast-root` live region, `defer` scripts
  `ui.js` + `main.js`.
- Existing `Organization` + `WebSite` JSON-LD retained.

## C1. Hero + Search/Comparison (US1 / FR-005–FR-007)

```html
<section class="hero-section" aria-labelledby="hero-heading">
  <h1 id="hero-heading">…value proposition (compare best travel deals in one place)…</h1>
  <p>…supporting subtext…</p>
  <!-- credibility cues (e.g., "+50 مصدر موثوق", rating) -->
  <form data-validate data-frontend-form
        data-success-toast="نبحث لك عن أفضل العروض — محرّك المقارنة قيد الإطلاق"
        aria-label="بحث ومقارنة عروض السفر" novalidate>
    <div class="field">
      <label class="field-label" for="search-destination">الوجهة</label>
      <input class="field-input" id="search-destination" name="destination" type="text"
             required minlength="2" aria-describedby="search-destination-err" placeholder="إلى أين تسافر؟">
      <p class="field-error" id="search-destination-err" role="alert" hidden>الرجاء إدخال وجهة.</p>
    </div>
    <div class="field"><label class="field-label" for="search-dates">التاريخ</label>
      <input class="field-input" id="search-dates" name="dates" type="month"></div>
    <div class="field"><label class="field-label" for="search-travelers">المسافرون</label>
      <select class="field-select" id="search-travelers" name="travelers">…</select></div>
    <button type="submit" class="btn btn-primary btn-lg">ابحث وقارن</button>
    <p class="inline-msg inline-msg-success" data-frontend-success hidden role="status">…echo…</p>
  </form>
</section>
```

**Rules**
- Exactly one `<h1>` on the page (the hero heading).
- Empty/invalid required submit → inline `.field-error` + `aria-invalid`; submission blocked; **no** `alert()`.
- Valid submit → `preventDefault`; success toast + visible inline echo of the destination; **no** navigation.
- Touch targets ≥ 44px; fields use `.field` patterns; comfortable at 360px (no horizontal scroll).

## C2. Featured Deals (US2 / FR-008, FR-009, FR-012)

- ≥6 deal `<article class="card">` from `featured.json`, each with: `.card-media` (lazy, real `alt`),
  a `.card-badge-wrap` with a **source badge** (`badge-source-partner|affiliate|manual|api-ready`) and
  optional `badge-featured`/`badge-verified`, `.card-title` (`<h3>`), `.card-meta` (location · ⭐ rating
  (reviews)), `.price` framed "ابتداءً من <strong>…</strong> ر.س".
- Primary CTA uses a safe label; ≥1 deal opens a **quick-view modal** (`data-modal-open`); others may use
  `data-coming-soon`. No bare `#`, no dead control.
- One quick-view `.modal` (`data-modal="deal-quickview"`, `role="dialog" aria-modal="true"` + labelled)
  exists and is dismissible via overlay/close/`Esc` with focus management (reuse existing modal).

## C3. Popular Destinations (US2 / FR-010)

- ≥4 destination `.card`s from `destinations.json`: image (lazy, alt), name + country, indicative
  "ابتداءً من" price or deal count. Selection → visible action (`data-coming-soon` or quick-view). No dead links.

## C4. Coupons / Offers (US2 / FR-011)

- ≥3 coupon `.card`s from `coupons.json`: title, merchant + **source badge**, discount label, a code shown
  `dir="ltr"`, illustrative expiry/terms, a **copy control** `data-copy="<CODE>"` → success toast, and a
  safe "Get Coupon" CTA. Copy MUST use `TUI.copyToClipboard` (never a browser dialog).

## C5. Why-us / How-it-works + Trust band (US3 / FR-013, retained)

- Retain the existing how-it-works steps and trust band; keep trust signals (verified deals, secure inquiry,
  certified partners, 24/7 support). AA contrast preserved.

## C6. Social Proof — Testimonials + Partners (US3 / FR-013)

- ≥3 testimonial cards (author label, ⭐ rating, quote) + ≥3 trusted-partner items (visible text label;
  decorative mark `aria-hidden`). Clearly mock content.

## C7. Travel Guides Teaser (US3 / FR-015, Principle X)

- ≥3 guide `.card`s (title `<h3>`, excerpt, category, image) with "اقرأ المزيد" → `data-coming-soon`.
  Substantial, semantic, SEO-friendly content (not thin).

## C8. Price-Alert / Newsletter (US3 / FR-014)

```html
<form data-validate data-frontend-form
      data-success-toast="شكراً لاشتراكك — سنرسل لك أفضل العروض" aria-label="اشترك في تنبيهات الأسعار" novalidate>
  <div class="field">
    <label class="field-label" for="news-email">البريد الإلكتروني</label>
    <input class="field-input" id="news-email" name="email" type="email" required dir="ltr"
           aria-describedby="news-email-err" placeholder="example@email.com">
    <p class="field-error" id="news-email-err" role="alert" hidden>الرجاء إدخال بريد إلكتروني صحيح.</p>
  </div>
  <button type="submit" class="btn btn-primary">اشترك الآن</button>
  <p class="inline-msg inline-msg-success" data-frontend-success hidden role="status">…confirmation…</p>
</form>
```

- Invalid/empty → inline error, blocked. Valid → success toast + inline confirmation; persists nothing;
  never implies server-side storage.

## C9. FAQ + Final CTA (US3 / FR-023, retained + enhanced)

- FAQ: ≥3 traveler questions using native `<details>`/`<summary>` (retain existing 5). Add a `FAQPage`
  JSON-LD block in `<head>` whose Q&A **exactly mirrors** the visible FAQ.
- Final CTA band (gradient) with safe-labeled CTAs (anchor to `#` sections or `data-coming-soon`).

## C10. Heading hierarchy

```text
h1  Hero value proposition
  h2  العروض المميزة → h3 card titles
  h2  وجهات شهيرة → h3 card titles
  h2  كوبونات وعروض → h3 coupon titles
  h2  كيف تعمل المنصة
  h2  ماذا يقول مسافرونا → h3 (optional) 
  h2  دليل السفر والنصائح → h3 guide titles
  h2  لا تفوّت أي عرض (newsletter)
  h2  الأسئلة الشائعة
  h2  ابدأ الآن (CTA)
footer (no new h1)
```

## Acceptance

- Served statically: renders fully, no console errors, **zero external CDN/network requests** for CSS/JS/fonts/images.
- 360px: no horizontal scroll; all touch targets ≥ 44px; drawer works.
- Every interactive element produces a visible action; zero bare `#`, zero `alert()/confirm()/prompt()`.
- Flipping `dir="ltr" lang="en"` mirrors layout with no breakage.
- Single `<h1>`; valid `Organization` + `WebSite` + `FAQPage` JSON-LD.
- `html-validate` clean; axe-core 0 AA violations; stack-compliance grep returns zero matches.
- Styleguide and components showcase still render unchanged (no foundation regression).
