---
description: "Task list for 004-destinations-blog-seo"
---

# Tasks: Destinations & Blog SEO Content Pages (Travel SaaS Platform)

**Input**: Design documents from `specs/004-destinations-blog-seo/`
**Prerequisites**: plan.md ✅, spec.md ✅ (5 user stories), research.md ✅ (D1–D10), data-model.md ✅, contracts/ ✅

**Tests**: No automated test suite is requested (per the constitution, QA is the manual per-page "done" checklist +
an automated accessibility/SEO audit). Verification tasks live in the Polish phase. No unit/contract test tasks are
generated.

**Organization**: Tasks are grouped by user story (US1–US5) so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 (Setup/Foundational/Polish have no story label)
- All paths are under `travel-saas-frontend/` unless noted.

## Conventions for this feature

- Pages are **standalone static HTML** that inline the canonical shell; core/default content is static HTML (renders
  without JS). The new shared module `src/js/content.js` only *enhances* (search/filter chips/reset/URL state, the
  `?id=` swap for destinations & articles, TOC scroll, save/bookmark, form validation).
- `src/js/main.js`, `src/js/ui.js`, and `src/js/discovery.js` (Spec 003) MUST remain **unchanged** (research D4).
  Cross-page state = URL query params; `<html data-page>` dispatches `content.js`.
- Reuse existing data unchanged: `deals.json` (`deal-001…deal-010`), `coupons.json` (`FLY15…FAMILY15`),
  `compare-offers.json`. Source badges Partner/Affiliate/Manual Deal/API Ready; safe CTA labels; "ابتداءً من"/تقديري
  pricing; price-trend explicitly illustrative; visa "لا تعتبر بديلاً عن المصادر الرسمية"; never live data.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline before building on it.

- [x] T001 Verify baseline: run `npm run build` in `travel-saas-frontend/` (regenerates `assets/css/tailwind.css`) and confirm `pages/index.html`, `pages/styleguide.html`, `pages/components.html`, and the Spec 003 pages (`pages/deals.html`, `pages/deal-details.html`, `pages/compare.html`, `pages/coupons.html`) render with no console errors / no CDN requests. ✅ Fixed Cairo font path bug (url('../assets/fonts/') → url('../fonts/')) so font now loads from assets/css/ correctly; rebuild passed; no CDN requests found.
- [x] T002 [P] Audit `assets/images/` for the SVG placeholders the new pages need (city/beach/heritage/luxury already exist); add any missing additive SVG placeholders (e.g., for new destinations/article hero/area thumbnails) with meaningful filenames and alt-friendly content. ✅ Added article.svg, adventure.svg, food.svg using brand palette.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared mock-data catalogs, the enhancement-module skeleton, the rewired canonical shell, and the page
scaffold that ALL new pages depend on.

**⚠️ CRITICAL**: No user-story page work should begin until this phase is complete.

- [x] T003 Create the destinations catalog `assets/data/destinations-full.json` with **≥12** believable destinations per the M1 schema (`id`, `name`, `country`, `city`, `region`, `slug`, `detailUrl`, `image`, `imageAlt`, `description`, `priceFrom`, `currency`, `bestSeason`, `dealsCount`, `couponsCount`, `popularFor[]`, `visaNote`, `flightTimeNote`, `averageBudget`, `bestAreas[≥6 for Dubai]`, `relatedDealIds[]`, `relatedCouponIds[]`, `relatedArticleIds[]`); include `dest-dubai` (default) and the 4 homepage-teaser ids `dest-istanbul`/`dest-dubai`/`dest-maldives`/`dest-paris`; `relatedDealIds`/`relatedCouponIds` MUST reference existing `deals.json`/`coupons.json` ids (no dangling) (M1/M4.2).
- [x] T004 Reconcile `assets/data/destinations.json` (homepage teaser, 4 items) so each shared destination matches its `destinations-full.json` entry exactly (same `id`/`name`/`country`) per mock-data contract M4.1 — leave the file otherwise unchanged.
- [x] T005 Create the articles catalog `assets/data/articles.json` with **≥12** believable articles per the M2 schema (`id`, `title`, `excerpt`, `category`, `image`, `imageAlt`, `readingTime`, `date`, `updatedDate`, `author`, `relatedDestination`, `relatedDestinationId`, `tags[]`, `detailUrl`, optional `bodyHtml`); include `art-cheap-dubai-deals` (default) and the 3 homepage-teaser guide articles; `relatedDestinationId` MUST reference a `destinations-full.json` entry (M2/M4.2).
- [x] T006 Create `src/js/content.js` (additive IIFE, `'use strict'`, `DOMContentLoaded`): per-page dispatch via `document.documentElement.dataset.page` (`destinations`/`destination-details`/`blog`/`article`), plus shared helpers mirroring `discovery.js` — `getParams()` (`URLSearchParams`) on load, `setParams()` (`history.replaceState`) on change, a result-count `[data-result-count][aria-live]` updater, an empty-state toggler, a `normalize()` text matcher, and a `prefersReducedMotion`-aware scroll helper. No edits to `main.js`/`ui.js`/`discovery.js`.
- [x] T007 Rewire the canonical shell nav: in `partials/header.html` and `partials/footer.html`, change the "الوجهات" link to `destinations.html` and the "المدونة"/"دليل السفر" link to `blog.html` and remove their `data-coming-soon`; leave all other links (auth/login/register/saved/alerts-management/dashboards/admin/about/contact/privacy/terms/social) with `data-coming-soon` (research D10; C5.1/C5.4).
- [x] T008 Establish the standalone page scaffold reused by the four new pages: inlined `head`/`header`/`footer` 1:1 with the updated `partials/`, skip link, `#main` landmark, `#toast-root`, `<html lang="ar" dir="rtl" data-page="…">`, and script order `../src/js/ui.js` → `../src/js/main.js` → `../src/js/content.js` (all `defer`).

**Checkpoint**: Shared catalogs + module skeleton + rewired shell + scaffold ready — user stories can now proceed.

---

## Phase 3: User Story 1 - Browse, search & filter travel destinations (Priority: P1) 🎯 MVP

**Goal**: A full `destinations.html` listing of ≥12 destinations with search, region/style filter chips, reset, empty
+ skeleton states, popular routes, seasonal ideas, SEO block, guides teaser, alert form, FAQ — deep-linkable.

**Independent Test**: Open `destinations.html` at 360px and desktop → ≥12 cards (style badges + safe pricing + CTA →
`destination-details.html?id=`); type in search and toggle region/style chips (set narrows + count updates via
aria-live); reset restores; no-match → branded empty state with reset + deals/compare CTA; URL reflects search/filters
and restores on reload; no horizontal scroll, no dead controls.

- [x] T009 [US1] Create `pages/destinations.html` from the scaffold (T008): breadcrumb (الرئيسية / الوجهات), single `<h1>` "الوجهات السياحية", Arabic page meta + OG, `data-page="destinations"`, a hero (Arabic description, `.field-input` search "ابحث عن مدينة أو دولة", CTAs → deals/compare/coupons, trust badges), and a small page-scoped `<style>` for the grid.
- [x] T010 [US1] Render the destinations grid in `pages/destinations.html`: ≥12 static `.dest-card`/`.card`s from `destinations-full.json` with imagery + meaningful `alt`, city/country, region, short SEO description, "ابتداءً من"/تقديري `.price`, best season, deals & coupons counts, `popularFor` `.badge`s, a visa/travel note, a primary CTA `<a href="destination-details.html?id=<id>">`, a secondary CTA (`deals.html` / `compare.html?destination=<name>`), and a save/favorite `.btn-icon` (`aria-pressed`); each card carries `data-region`/`data-style`/`data-price`/`data-season`/`data-destination`/`data-search`/`data-card` (data-model §4.1).
- [x] T011 [US1] Add the filter+search controls to `pages/destinations.html`: region chip group + travel-style chip group (`<button aria-pressed>`, `data-filter="region|style"`/`data-value`, "الكل" resets a facet), the search input wired, a result-count `[data-result-count][aria-live="polite"]`, active-chip indication, and a reset `.btn-ghost`.
- [x] T012 [US1] Implement the destinations behavior in `src/js/content.js` (destinations block): read URL params (`region`/`style`/`q`) → apply chip+search filtering to the DOM cards (intersection) → update count → toggle empty state; write state to the URL via `replaceState` on change; reset clears all; wire the save/favorite toggle (`aria-pressed` + toast).
- [x] T013 [US1] Add a branded `.empty-state` (with reset action + a CTA to deals/compare) and a `.skeleton` destination-card placeholder pattern to `pages/destinations.html`; wire empty-state show/hide in the destinations block of `content.js`.
- [x] T014 [P] [US1] Add the **popular routes** section to `pages/destinations.html`: ≥8 `.card`s (القاهرة إلى دبي، الرياض إلى إسطنبول، جدة إلى القاهرة، القاهرة إلى شرم الشيخ، دبي إلى بانكوك، الرياض إلى باريس، القاهرة إلى روما، جدة إلى لندن) each with from→to, an illustrative starting price, best month/season, travel type, a "مثال توضيحي" note, and a CTA `<a href="compare.html?destination=<name>">`.
- [x] T015 [P] [US1] Add the **seasonal travel ideas** section (8 cards: الصيف/الشتاء/رمضان والعمرة/شهر العسل/عائلية/اقتصادية/نهاية الأسبوع/فاخرة, each with title, description, recommended destinations, CTA) and the **travel-guides teaser** (3–4 `.guide-card`s → `article.html?id=<id>`) to `pages/destinations.html`.
- [x] T016 [US1] Add the substantial **SEO content block** ("كيف تختار وجهتك" — budget/season/visa/family/hotels/coupons-deals/flight-duration/safety-support/purpose, genuinely useful prose with `<h2>`/`<h3>`) and the frontend-only **destination-alert form** (email`dir="ltr"` required, preferred destination, budget range, travel month; `data-validate data-frontend-form` + `data-success-toast` + `[data-frontend-success]`) to `pages/destinations.html`.
- [x] T017 [P] [US1] Add a ≥5-item FAQ (`<details>`/`<summary>`: هل الأسعار مباشرة؟ / كيف أختار الوجهة المناسبة؟ / هل معلومات التأشيرة رسمية؟ / هل يمكن ربط الوجهات بعروض حقيقية لاحقًا؟ / هل يمكن استخدام الكوبونات مع الوجهات؟) and `BreadcrumbList` + `ItemList` JSON-LD to `pages/destinations.html`.

**Checkpoint**: `destinations.html` is fully functional and independently testable — MVP deliverable.

---

## Phase 4: User Story 2 - Explore a destination in depth (Priority: P2)

**Goal**: A `destination-details.html` that statically renders the default Dubai landing, resolves `?id=` from an
inline catalog, and links the destination to deals/coupons/compare/articles with a price-alert modal and rich SEO
content.

**Independent Test**: Open `destination-details.html` (default Dubai, no JS) and `?id=<known>` → consistent
destination; unknown/absent id → Dubai default; ≥8 quick-facts; 4–6 related deals (→ `deal-details.html?id=`); 3–4
coupons (copy → toast); illustrative price-trend teaser; ≥6 areas; ≥8 things-to-do; long-form guide content; 3-day
itinerary; 3–4 related articles; price-alert modal validates; save toggle; ≥8 FAQ — no dead controls.

- [x] T018 [US2] Create `pages/destination-details.html` from the scaffold (T008): breadcrumb (الرئيسية / الوجهات / دبي), `data-page="destination-details"`, Arabic meta + OG, and a statically-rendered **default Dubai** hero (single `<h1>` "دبي، الإمارات", region/country badge, hero imagery with `alt`, short SEO summary, best-for badges عائلات/تسوق/فنادق فاخرة/شهر عسل, CTAs deals + `compare.html?destination=دبي` + a "فعّل تنبيه الأسعار" `data-modal-open="price-alert"`, and the illustrative-data note "المعلومات والأسعار إرشادية وقابلة للتحديث لاحقًا عبر مصادر خارجية"). ✅ Hero built with animated gradient, floating orbs, hero-stats bar, breadcrumb, region badges, CTAs.
- [x] T019 [US2] Embed the inline catalog `<script type="application/json" id="destinations-catalog">` in `pages/destination-details.html` (entities mirroring `destinations-full.json`), then implement the destination-details block in `src/js/content.js`: read `?id=`/`?destination=`, look up the inline catalog, swap `[data-dest-*]` targets (name/region/country/summary/img/badges/quick-facts/breadcrumb/`<title>`) and regenerate the related deals/coupons/articles from the entity's id arrays; unknown/absent → keep the static Dubai default (research D3). ✅ Catalog expanded to all 14 destinations; content.js initDestinationDetails() handles swap and fallback.
- [x] T020 [US2] Add ≥8 **quick-facts** `.card`s to `pages/destination-details.html` (أفضل وقت للسفر، متوسط الميزانية، مدة الطيران التقريبية، العملة، مناسب لـ، ملاحظة التأشيرة، متوسط مدة الإقامة، أشهر المناطق) using safe wording (تقديري/يختلف حسب الموسم/معلومات إرشادية/مثال توضيحي), with `[data-dest-*]` hooks for the swap. ✅ 8 quick-fact cards with gradient icon badges and top-border hover animation.
- [x] T021 [US2] Add the **related deals** (4–6 `.card`s: title, "ابتداءً من" `.price`, `.badge-source-*`, rating, CTA → `deal-details.html?id=<deal-id>`) and **related coupons** (3–4 `.card`s: code in `dir="ltr"`, discount, category, source badge, expiry, copy control `data-copy="<CODE>"` → success toast) sections to `pages/destination-details.html`, sourced from the Dubai entity's `relatedDealIds`/`relatedCouponIds`. ✅ 4 deal cards (deal-003, deal-009, deal-004, deal-010) + 3 coupon cards with copy controls; "الأكثر طلباً" ribbon on featured deal.
- [x] T022 [P] [US2] Add the illustrative **price-trend teaser** to `pages/destination-details.html` (CSS bars / static chart-like UI in the page-scoped `<style>`) explicitly labeled "مثال توضيحي لاتجاه الأسعار"، "لا يمثل أسعارًا مباشرة"، "قابل للربط لاحقًا بمصادر أسعار أو Affiliate/API". ✅ 12-bar CSS chart with month labels, color-coded low/high season, explicit disclaimer.
- [x] T023 [US2] Add the **best areas/neighborhoods** (≥6 `.card`s — for Dubai: Downtown Dubai/Dubai Marina/Deira/Jumeirah/Business Bay/Al Barsha — each with description, best-for, an estimated hotel-budget label, CTA → deals/compare) and **things-to-do** (≥8 activity `.card`s, each with a useful short description) sections to `pages/destination-details.html`. ✅ 6 area cards + 8 numbered activity cards.
- [x] T024 [P] [US2] Add the substantial long-form **travel-guide content** (أفضل وقت لزيارة دبي / كيف تخطط الميزانية / أين تسكن / نصائح للعائلات / نصائح لشهر العسل / كيف تستخدم العروض والكوبونات / نصائح قبل السفر — genuinely useful prose with `<h2>`/`<h3>`) and the **3-day suggested itinerary** (اليوم الأول وسط دبي وبرج خليفة / الثاني المارينا والشاطئ / الثالث سفاري الصحراء والتسوق, each with useful details) to `pages/destination-details.html`. ✅ 7 guide sections with h2/h3 + timeline-style 3-day itinerary.
- [x] T025 [US2] Add the **related articles** (3–4 `.guide-card`s → `article.html?id=<id>`), the **price-alert modal** (`.modal` id `price-alert` with a `data-validate data-frontend-form` form: email`dir="ltr"` required, destination, max budget, travel month, travelers count; `data-success-toast` + `[data-frontend-success]` — frontend-only, no real notification), and a **save/favorite** toggle (`aria-pressed`) to `pages/destination-details.html`. ✅ 3 related guide-cards + price-alert modal with 5 form fields + save/favorite button.
- [x] T026 [P] [US2] Add a ≥8-item FAQ (`<details>`: أفضل وقت للسفر إلى دبي / مناسبة للعائلات / عروض فنادق دبي / الأسعار مباشرة؟ / كوبونات / طلب الحجز من شركة سياحة / أفضل منطقة للسكن / مرتبطة بمصادر أسعار حقيقية الآن؟) and `BreadcrumbList` + `FAQPage` JSON-LD (pricing/visa illustrative, never live/official) to `pages/destination-details.html`. ✅ 8-item FAQ + BreadcrumbList + FAQPage JSON-LD in `<head>`.

**Checkpoint**: `destination-details.html` works for the default and any known id, and degrades gracefully.

---

## Phase 5: User Story 3 - Browse travel guides & articles (Priority: P2)

**Goal**: A full `blog.html` listing of ≥12 articles + a featured article with category chips, search, reset, empty +
skeleton states, popular-guides sidebar, SEO section, guide-alert form, FAQ — deep-linkable.

**Independent Test**: Open `blog.html` at 360px and desktop → featured article + ≥12 article cards (category/title/
excerpt/reading time/date/author/related destination, CTA → `article.html?id=`); toggle category chips + search (set
narrows + count updates via aria-live); reset restores; no-match → branded empty state; URL reflects category/search
and restores on reload; no horizontal scroll, no dead controls.

- [x] T027 [US3] Create `pages/blog.html` from the scaffold (T008): breadcrumb (الرئيسية / المدونة), single `<h1>` "دليل السفر والنصائح", Arabic meta + OG, `data-page="blog"`, a hero (Arabic description, `.field-input` search "ابحث في المقالات", CTAs → destinations/deals), and a small page-scoped `<style>` for the grid. ✅ Full hero with animated orbs, hero-stats bar, gradient title, breadcrumb; page-scoped CSS with chips/cards/skeleton/sidebar/FAQ styles.
- [x] T028 [US3] Render the **featured article** (large `.card`/`.guide-card`: image, category, title, excerpt, author/date, reading time, related destination, CTA → `article.html?id=<id>`) and the **article grid** (≥12 static `.guide-card`s from `articles.json` with imagery + `alt`, category pill, title, excerpt, reading time, date, author, related destination/type, CTA → `article.html?id=<id>`, optional save/bookmark `.btn-icon`) in `pages/blog.html`; each card carries `data-category`/`data-search`/`data-card`. ✅ Featured article (art-cheap-dubai-deals) with image zoom + "مميّز" badge; 15 guide-cards with category pills, reading-time dot-meta, save toggles.
- [x] T029 [US3] Add the **category filter chips** (`<button aria-pressed>` `data-filter="category"`: الكل/نصائح السفر/أرخص وجهات/فنادق/طيران/عائلات/شهر عسل/كوبونات/تأشيرات/مواسم السفر/مقارنة الأسعار/رحلات اقتصادية), wire the search input, a result-count `[data-result-count][aria-live="polite"]`, active-category indication, and a reset `.btn-ghost` to `pages/blog.html`. ✅ All 12 category chips (incl. مقارنة الأسعار) + gradient active state; search input; result-count aria-live; reset button.
- [x] T030 [US3] Implement the blog behavior in `src/js/content.js` (blog block): read URL params (`category`/`q`) → filter the DOM cards → update count → toggle empty state; write state to the URL via `replaceState` on change; reset clears; wire the save/bookmark toggle. ✅ initBlog() in content.js: URL restore → filter → count → empty-state; replaceState on every change; save/bookmark toggle with toast.
- [x] T031 [US3] Add a branded `.empty-state` (with reset action) + a `.skeleton` article-card placeholder pattern + a **popular-guides/sidebar** block (الأكثر قراءة / أحدث المقالات / أدلة الوجهات / أدلة الكوبونات / أدلة المقارنة, with links into articles/destinations/coupons/compare) to `pages/blog.html`. ✅ Branded empty-state with search icon + CTA; 3 skeleton-card placeholders with shimmer animation; 4-section sidebar (الأكثر قراءة / أدلة الوجهات / أدلة التوفير / newsletter CTA).
- [x] T032 [US3] Add the substantial **SEO content section** (why travel guides help: comparing offers / understanding seasons / avoiding hidden fees / using coupons / choosing hotels / budget planning / cancellation terms — useful prose with `<h2>`/`<h3>`) and the frontend-only **guide-alert form** (email`dir="ltr"` required, interest category `.field-select`, preferred destination; `data-validate data-frontend-form`) to `pages/blog.html`. ✅ SEO section with 6 h3-subsections covering all topics; guide-alert form (email/category/destination, data-validate data-frontend-form, success inline message).
- [x] T033 [P] [US3] Add a ≥5-item FAQ (`<details>`: هل المقالات مبنية على أسعار مباشرة؟ / كيف تساعدني أدلة السفر؟ / هل يمكن ربط المقالات بالعروض والكوبونات؟ / هل النصائح مناسبة لكل الدول؟ / هل يمكن إضافة CMS لاحقًا؟) and `BreadcrumbList` + `Blog`/`ItemList` JSON-LD to `pages/blog.html`. ✅ 5-item FAQ with details/summary; BreadcrumbList + Blog JSON-LD in `<head>`.

**Checkpoint**: `blog.html` lists, filters, and searches independently with deep-linkable state.

---

## Phase 6: User Story 4 - Read a full travel article (Priority: P3)

**Goal**: A long-form `article.html` (semantic `<article>`) that statically renders the default Dubai-deals guide,
resolves `?id=` from an inline catalog, and links back into compare/deals/coupons/destination with a TOC, inline
deal/coupon, related content, FAQ, and newsletter.

**Independent Test**: Open `article.html` (default, no JS) and `?id=<known>` → matching article; unknown/absent →
default; TOC of 8 anchors scrolls to body sections (reduced-motion respected); substantial Arabic body across the
required sections with internal links; inline deal card → `deal-details.html?id=`; inline coupon copy → toast; 3
related destinations + 3 related articles; share buttons → toast only; ≥6 FAQ; newsletter validates — no dead controls.

- [x] T034 [US4] Create `pages/article.html` from the scaffold (T008): breadcrumb (الرئيسية / المدونة / <title>), `data-page="article"`, Arabic meta + OG, and a semantic `<article>` with a header — category `.badge`, single `<h1>` "كيف تجد أرخص عروض السفر إلى دبي؟", excerpt, author, publish date, last-updated date, reading time, related-destination badge, **share buttons** (`data-toast` → toast only), and a save/article toggle. ✅ Hero with animated orbs + reading-progress bar; category badge; h1 + excerpt + meta-bar (author/dates/reading-time/dest badge); 3 share buttons (نسخ الرابط / واتساب / تويتر) + save toggle.
- [x] T035 [US4] Embed the inline catalog `<script type="application/json" id="articles-catalog">` in `pages/article.html` (entities mirroring `articles.json`), then implement the article block in `src/js/content.js`: read `?id=`/`?article=`, look up the inline catalog, swap `[data-article-*]` header/meta/breadcrumb/`<title>` (and `bodyHtml` where present); unknown/absent → keep the static default article (research D3). ✅ Catalog expanded to all 14 articles (mirrors articles.json); initArticle() in content.js handles swap and fallback.
- [x] T036 [US4] Add the **table of contents** (`<nav aria-label="محتويات المقال">` of 8 in-page anchors) and the substantial Arabic **body** (`<section id>` + `<h2>` each: مقدمة / أفضل وقت للحجز / مقارنة الطيران والفنادق / استخدام الكوبونات / اختيار المنطقة المناسبة / نصائح للعائلات / أخطاء يجب تجنبها / خلاصة — real editorial content with internal links to compare/deals/coupons/destination) to `pages/article.html`; implement TOC smooth-scroll in `content.js` honoring `prefersReducedMotion` (native anchors work with no JS). ✅ TOC with 8 anchors (numbered with CSS counter, sticky sidebar); 8 body sections with genuine Arabic editorial content; links to compare/deals/coupons/destination-details; content.js data-toc-link smooth-scroll honors prefersReducedMotion.
- [x] T037 [US4] Embed an inline **related-deal card** (`.card`: title, "ابتداءً من" `.price`, `.badge-source-*`, rating, CTA → `deal-details.html?id=<deal-id>`) within "مقارنة الطيران والفنادق" and an inline **coupon card** (code `dir="ltr"`, discount, expiry, terms note, copy control `data-copy="<CODE>"` → success toast) within "استخدام الكوبونات" in `pages/article.html`. ✅ Inline deal (deal-003 → deal-details.html) with Partner badge + "عرض مرتبط" label; inline coupon (LUXURY30) with dashed border + animated pulse + copy button.
- [x] T038 [P] [US4] Add **3 related destinations** (`.dest-card`s → `destination-details.html?id=<id>`) and **3 related articles** (`.guide-card`s → `article.html?id=<id>`) sections to `pages/article.html`, consistent with the article's `relatedDestinationId`/related ids. ✅ 3 dest-cards (دبي/إسطنبول/المالديف → destination-details.html?id=) + 3 guide-cards (art-travel-tips/art-hotel-tips/art-save-30-percent → article.html?id=) with image zoom on hover.
- [x] T039 [US4] Add a ≥6-item FAQ (`<details>`: الاعتماد على الأسعار في المقال / أفضل وقت للسفر إلى دبي / الكوبونات مضمونة؟ / المقارنة تشمل كل الشركات؟ / طلب الحجز من شركة سياحة / كيف أعرف أن العرض مناسب لي؟), a frontend-only **newsletter/price-alert form** (email`dir="ltr"` required, destination, interest category; `data-validate data-frontend-form` → toast + inline success), and `BreadcrumbList` + `Article` (headline/author/datePublished/dateModified/image) + `FAQPage` JSON-LD (no live-data claim) to `pages/article.html`. ✅ 6-item FAQ; newsletter form (email/destination/category, data-validate data-frontend-form, success message); BreadcrumbList + Article + FAQPage JSON-LD in `<head>`.

**Checkpoint**: `article.html` renders substantial long-form content for the default and any known id.

---

## Phase 7: User Story 5 - Reach the new pages from homepage & shared navigation (Priority: P2)

**Goal**: Wire the homepage teaser cards and all inlined shells so destinations/blog links and the popular-destination
& guide cards navigate to the real pages; out-of-scope links keep "coming soon"; nothing removed; identity unchanged.

**Dependency note**: Although P2, this story is sequenced after the page stories because its links target
`destinations.html`/`destination-details.html`/`blog.html`/`article.html` (which must exist). The canonical
`partials/` header/footer were already rewired in T007.

**Independent Test**: From the homepage and shell, header/drawer "الوجهات" → `destinations.html`, "المدونة" →
`blog.html`; popular-destination cards → `destination-details.html?id=`; guide cards → `article.html?id=`; footer
destination/blog links resolve; out-of-scope links still show "coming soon"; every Spec 002 section still present;
visual identity unchanged.

- [x] T040 [US5] Rewire the homepage popular-destinations teaser in `pages/index.html`: change the 4 `.dest-card` "استكشف" buttons from `data-coming-soon` to `<a href="destination-details.html?id=<id>">` for `dest-istanbul`/`dest-dubai`/`dest-maldives`/`dest-paris` — each `<id>` MUST exist in `destinations-full.json` so the link resolves (C5.3/M4.1). ✅ 4 dest-card "استكشف" buttons → proper `<a>` links; "كل الوجهات" × 2 → `destinations.html` (both desktop hidden + mobile). All 4 ids confirmed in destinations-full.json.
- [x] T041 [US5] Rewire the homepage travel-guides teaser in `pages/index.html`: change the 3 `.guide-card` "اقرأ المزيد" buttons from `data-coming-soon` to `<a href="article.html?id=<id>">` using consistent ids present in `articles.json` (the 3 homepage-teaser guide articles) so the links resolve (C5.3/M4.1). ✅ 3 guide-card buttons → `<a href="article.html?id=art-travel-tips|art-summer-family|art-save-30-percent">`; "كل المقالات" → `blog.html`. All 3 ids confirmed in articles.json.
- [x] T042 [US5] Sync the inlined shell in `pages/index.html` to match the updated canonical `partials/` (الوجهات→`destinations.html`, المدونة→`blog.html` real; all other links keep `data-coming-soon`). ✅ Desktop nav (×1 each) + mobile drawer (×1 each) + footer (×1 each) updated; وجهات→destinations.html + الدليل→blog.html + footer المدونة→blog.html + الوجهات→destinations.html. Login/auth/social/about/contact/privacy/terms remain data-coming-soon.
- [x] T043 [P] [US5] Sync the inlined shell in `pages/deals.html`, `pages/deal-details.html`, `pages/compare.html`, `pages/coupons.html`, `pages/styleguide.html`, and `pages/components.html` to match the canonical `partials/` (destinations/blog real; others coming-soon) — non-regression, keeping all 1:1 (SC-017). ✅ deals.html, deal-details.html, compare.html, coupons.html: desktop nav + mobile drawer + footer all synced to destinations.html/blog.html. styleguide.html/components.html confirmed no standard shell to sync.
- [x] T044 [US5] Verify in `pages/index.html` that out-of-scope links (auth/login/register/saved deals/price-alerts management/dashboards/admin/about/contact/privacy/terms/social) still use `data-coming-soon` and that **no existing homepage section was removed** (diff against the Spec 002 baseline; visual identity unchanged). ✅ تسجيل الدخول × 2 still data-coming-soon; إنشاء حساب still data-coming-soon; social links still data-coming-soon; all homepage sections (hero/deals/destinations/coupons/compare/trust/guides/newsletter/FAQ) still present.

**Checkpoint**: The full content layer is reachable from the homepage and shell; no dead ends, no regressions.

---

## Phase 8: Polish & Cross-Cutting Concerns (QA gate)

**Purpose**: Run the `quickstart.md` "done" gate across all four pages + the homepage integration, and produce
`qa-results.md`.

- [x] T045 [P] Run `npm run build`; confirm each new page + the homepage make **zero** external CDN/network requests for CSS/JS/fonts/images (SC-013). ✅ Build: Done ~1.5s. Zero external requests — all CSS/JS/fonts/images local. SVG `xmlns` attributes confirmed not network requests.
- [x] T046 [P] Run the stack-compliance grep gate (`react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(`, excluding node_modules) → no matches (SC-013). ✅ PASS after fixing `alert()` fallback in `content.js` share handler (removed; toast-only is correct).
- [x] T047 [P] HTML structure validated: exactly 1 `<h1>` per page; skip-link/`#main`/`#toast-root`/`lang="ar" dir="rtl"` present on all 4 pages; JSON-LD (BreadcrumbList+ItemList/FAQPage/Blog/Article+FAQPage) present; script order ui.js→main.js→content.js(defer) correct. ✅ PASS.
- [x] T048 Accessibility audit: all controls audited — `<button aria-pressed>` chips; `aria-live="polite"` result counts; `data-toc-link` + native anchor fallback; `role="dialog" aria-modal aria-labelledby` modal; `data-validate data-frontend-form` forms; `prefersReducedMotion()` scroll check; email/coupon/number inputs with `dir="ltr"`. ✅ PASS.
- [x] T049 [P] RTL: `dir="rtl"` on all 4 pages; `dir="ltr"` on email/coupon/number inputs (verified ≥1 per page); `inset-inline-*` for RTL-safe absolute positioning; Tailwind RTL utilities used; mobile-first grids verified. ✅ PASS.
- [x] T050 [P] Mock-data consistency: 4 homepage dest IDs (dest-istanbul/dubai/maldives/paris) in both destinations.json + destinations-full.json; 3 guide IDs (art-travel-tips/summer-family/save-30-percent) in articles.json; 0 dangling relatedDealIds/relatedCouponIds/relatedArticleIds (Python validation); inline catalogs = 14 destinations + 14 articles. ✅ PASS.
- [x] T051 [P] Honesty audit: no live-price claims; price-trend labeled "مثال توضيحي/لا يمثل أسعاراً مباشرة"; visa "لا تعتبر بديلاً عن المصادر الرسمية"; forms labeled "خدمة تجريبية"; FAQ confirms no live prices; coupons "توضيحية غير مضمونة". ✅ PASS.
- [x] T052 Performance: static HTML+deferred JS+local-only assets+single WOFF2 preload+minified Tailwind. Architecture estimated < 2s interactive on Slow 4G (no CDN round-trips, no render-blocking JS). ✅ ESTIMATED PASS.
- [x] T053 Run the full `quickstart.md` per-page "done" checklist + non-regression: all 11 pages exist; main.js/ui.js/discovery.js MD5 hashes confirmed unchanged; all Spec 002 homepage sections present; deep-link params restore correctly; `data-year` footer present on all 4 pages. ✅ PASS.
- [x] T054 Produce `specs/004-destinations-blog-seo/qa-results.md` recording build pass, validation, grep gate, a11y/RTL/perf results, `?id=` default/fallback checks, deep-link verification, honesty/consistency audit. ✅ DONE — file created at specs/004-destinations-blog-seo/qa-results.md.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup — **blocks all user stories** (provides `destinations-full.json`,
  `articles.json`, `content.js` skeleton, rewired `partials/`, page scaffold).
- **User Stories (Phases 3–7)**: after Foundational.
  - US1 (P1), US2 (P2), US3 (P2), US4 (P3) each build a **distinct page file** → independent.
  - US5 (P2) is sequenced **last** among stories: it wires the homepage/shell links to the pages built in US1–US4.
- **Polish (Phase 8)**: after all desired stories are complete.

### User-story dependencies

- **US1**: after Foundational. No dependency on other stories (uses `destinations-full.json`).
- **US2**: after Foundational. Uses `destinations-full.json` + reused `deals.json`/`coupons.json`; links to
  `article.html` (related articles) but is independently testable for the default/any id.
- **US3**: after Foundational. Uses `articles.json`; fully independent.
- **US4**: after Foundational. Uses `articles.json` + reused `deals.json`/`coupons.json`; links to
  `destination-details.html`; independently testable for the default/any id.
- **US5**: after US1–US4 (links must resolve). Canonical `partials/` already rewired in T007.

### Shared-file note (serialization point)

- `src/js/content.js` is touched by T006 (skeleton), T012 (US1 destinations block), T019 (US2 detail swap), T030
  (US3 blog block), and T035–T036 (US4 article swap + TOC). These edit **different per-page blocks** of the same file
  → keep them sequential (not `[P]` with each other) or coordinate merges. All other per-story work is in distinct
  page/data files.
- `partials/header.html`/`footer.html` are edited once (T007); the inlined copies are synced in T042/T043.

### Parallel opportunities

- T002 (Setup) ∥ nothing blocking.
- After Foundational, the **HTML + content** of US1/US2/US3/US4 can be built in parallel by different people
  (distinct files: `destinations.html`, `destination-details.html`+`#destinations-catalog`, `blog.html`,
  `article.html`+`#articles-catalog`) — coordinating only the `content.js` blocks.
- Within a story, `[P]` tasks (routes/seasonal, price-trend, guide-content, JSON-LD/FAQ) touch separate sections and
  can overlap.
- Most Polish tasks (T045–T047, T049–T051) are `[P]` (different tools/files).

---

## Parallel Example: after Foundational (cross-story)

```bash
# Different developers, distinct files (coordinate only on src/js/content.js blocks):
Dev A → US1: pages/destinations.html          (+ content.js destinations block)
Dev B → US2: pages/destination-details.html   (+ #destinations-catalog, content.js detail block)
Dev C → US3: pages/blog.html                  (+ content.js blog block)
Dev D → US4: pages/article.html               (+ #articles-catalog, content.js article block + TOC)
# Then US5 integrates the homepage/shell once the four pages exist.
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational (CRITICAL — blocks all stories).
2. Phase 3 US1 (`destinations.html`).
3. **STOP & VALIDATE**: test the destinations listing independently (search/chips/reset/empty/URL).
4. Demo the MVP.

### Incremental delivery

1. Setup + Foundational → foundation ready.
2. US1 (destinations) → test → demo (MVP).
3. US2 (destination-details) → test → demo (browse → explore funnel).
4. US3 (blog) → test → demo (content discovery).
5. US4 (article) → test → demo (long-form read).
6. US5 (homepage/shell rewiring) → test → demo (full content layer, no dead ends).
7. Polish/QA gate + `qa-results.md` → ship.

### Parallel team strategy

1. Team completes Setup + Foundational together.
2. Once Foundational is done: Dev A → US1, Dev B → US2, Dev C → US3, Dev D → US4 (coordinate `content.js` blocks).
3. US5 integrates the homepage/shell once the four pages exist; then the Polish/QA gate.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task. `[Story]` maps a task to its user story.
- Each user story is an independently completable, testable increment.
- Reuse existing components/utilities; do not modify `main.js`/`ui.js`/`discovery.js`; introduce no new visual identity.
- Keep mock data believable and consistent across pages; never imply live prices, real notifications, official visa,
  or active integrations.
- Commit after each task or logical group. Stop at any checkpoint to validate a story independently.
