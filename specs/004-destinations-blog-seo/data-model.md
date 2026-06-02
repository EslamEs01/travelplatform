# Phase 1 Data Model: Destinations & Blog SEO Content Pages

**Feature**: `004-destinations-blog-seo` | **Date**: 2026-06-01

No backend data. The "model" here is the **page inventory + per-page section inventory**, the **mock-content schemas**
(new + reused), the **filter/search/URL contract**, the **interaction map** (which control fires which existing
`window.TUI` action or `content.js` behavior), the **frontend-only form models**, and the **structured-data**
payloads. All values are realistic, clearly-mock/editorial, and never imply live data, real notifications, or official
visa rules (Constitution IX). Cards are static HTML carrying `data-*` so the enhancement layer can search/filter the
DOM (research D1/D6). Detail/article pages embed an inline JSON catalog + a static default for the `?id=` swap
(research D3).

---

## 1. Page Inventory

| Page | `data-page` | Role | Contract | Primary new data |
|------|-------------|------|----------|------------------|
| `pages/destinations.html` | `destinations` | Destinations listing (catalog) | Listing (search/filter/empty/skeleton/reset) | `destinations-full.json` (NEW) |
| `pages/destination-details.html` | `destination-details` | Single-destination landing (default Dubai) | Detail (info/CTA/related/FAQ) | `destinations-full.json` (inline catalog) + reused `deals`/`coupons`/`articles` |
| `pages/blog.html` | `blog` | Travel-guides listing | Listing (search/filter/empty/skeleton/reset) | `articles.json` (NEW) |
| `pages/article.html` | `article` | Long-form article (default Dubai-deals guide) | Detail (info/TOC/related/FAQ) | `articles.json` (inline catalog) + reused `deals`/`coupons`/`destinations` |

All four inline the canonical shell (`partials/head|header|footer.html`), set `<html lang="ar" dir="rtl"
data-page="…">`, load `../src/js/ui.js` → `../src/js/main.js` → `../src/js/content.js` (defer), and may include a
small page-scoped `<style>` for grid / price-trend bars / TOC layout (as `index.html` does). Exactly one `<h1>` per
page; section headings `<h2>`; card/sub-section titles `<h3>`. `article.html` wraps its body in a semantic
`<article>`.

---

## 2. Section Inventory (per page)

### 2.1 `destinations.html` (FR-006–FR-009)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Hero / page header + breadcrumb | `<h1>` الوجهات السياحية | breadcrumb, search `.field-input`, CTA `.btn` (deals/compare/coupons), trust badges `.badge` |
| 2 | Region + travel-style filter chips | — | chip buttons (`aria-pressed`, `data-filter`/`data-value`), groups "المنطقة"/"نمط السفر" |
| 3 | Result count + active filters + reset | — | `[data-result-count][aria-live="polite"]`, removable chips, reset `.btn-ghost` |
| 4 | Destinations grid (≥12) | (cards `<h3>`) | `.dest-card`/`.card`, `.badge`, `.price`, save toggle `.btn-icon` |
| 5 | Empty state | — | `.empty-state` + reset + CTA to deals/compare |
| 6 | Skeleton (init/async) | — | `.skeleton` destination-card placeholders |
| 7 | Popular routes (≥8) | `<h2>` | `.card`, from→to, "مثال توضيحي", CTA → `compare.html?destination=` |
| 8 | Seasonal travel ideas (8) | `<h2>` | `.card` grid |
| 9 | SEO content block (how to choose) | `<h2>` + `<h3>` | prose section |
| 10 | Travel-guides teaser (3–4) | `<h2>` | `.guide-card`/`.card` → `article.html?id=` |
| 11 | Destination-alert form | `<h2>` | `.field*` + `data-validate data-frontend-form` |
| 12 | FAQ (≥5) | `<h2>` | native `<details>`/`<summary>` |

### 2.2 `destination-details.html` (FR-010–FR-013)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / الوجهات / <name>) | — | breadcrumb |
| 2 | Destination hero | `<h1>` <name>، <country> | `.card-media`/hero, region badge, best-for `.badge`, CTAs, illustrative note `.inline-msg` |
| 3 | Quick-facts cards (≥8) | `<h2>` | `.card` grid, safe wording |
| 4 | Related deals (4–6) | `<h2>` | `.card`, `.badge-source-*`, `.price`, → `deal-details.html?id=` |
| 5 | Related coupons (3–4) | `<h2>` | `.card`, code `dir="ltr"`, copy `data-copy` |
| 6 | Price-trend teaser (illustrative) | `<h2>` | CSS bars + explicit "مثال توضيحي…لا يمثل أسعارًا مباشرة…قابل للربط لاحقًا" |
| 7 | Best areas / neighborhoods (≥6) | `<h2>` | `.card` grid, budget label, CTA → deals/compare |
| 8 | Things to do (≥8) | `<h2>` | `.card` grid |
| 9 | Travel-guide content (long-form) | `<h2>` + `<h3>` | prose sections |
| 10 | Suggested 3-day itinerary | `<h2>` + `<h3>` (per day) | timeline/list |
| 11 | Related articles (3–4) | `<h2>` | `.guide-card`/`.card` → `article.html?id=` |
| 12 | FAQ (≥8) | `<h2>` | `<details>` + `FAQPage` JSON-LD |
| — | Price-alert modal | (dialog) | `.modal` + `data-validate data-frontend-form` |
| — | Save/favorite toggle | — | `.btn-icon` (`aria-pressed`) |

### 2.3 `blog.html` (FR-014–FR-016)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Hero + breadcrumb | `<h1>` دليل السفر والنصائح | breadcrumb, search `.field-input`, CTAs (destinations/deals) |
| 2 | Category filter chips | — | chip buttons (`aria-pressed`, `data-filter="category"`) |
| 3 | Result count + reset | — | `[data-result-count][aria-live]`, reset `.btn-ghost` |
| 4 | Featured article | `<h3>` | large `.card`/`.guide-card` → `article.html?id=` |
| 5 | Article grid (≥12) | (cards `<h3>`) | `.guide-card`/`.card`, category pill, save/bookmark `.btn-icon` |
| 6 | Empty state | — | `.empty-state` + reset |
| 7 | Skeleton | — | `.skeleton` article-card placeholders |
| 8 | Popular guides / sidebar | `<h2>`/`<h3>` | lists (الأكثر قراءة، أحدث، أدلة الوجهات/الكوبونات/المقارنة) |
| 9 | SEO content section | `<h2>` + `<h3>` | prose section |
| 10 | Guide-alert form | `<h2>` | `.field*` + `data-validate data-frontend-form` |
| 11 | FAQ (≥5) | `<h2>` | `<details>` |

### 2.4 `article.html` (FR-017–FR-021)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / المدونة / <title>) | — | breadcrumb |
| 2 | Article header (in `<article>`) | `<h1>` <title> | category `.badge`, meta (author/date/updated/reading time), related-dest badge, share buttons (toast), save toggle |
| 3 | Table of contents | `<h2>` (or aria-label nav) | `<nav>` of in-page anchors (8 sections) |
| 4 | Body — مقدمة | `<h2 id>` | prose |
| 5 | Body — أفضل وقت للحجز | `<h2 id>` | prose |
| 6 | Body — مقارنة الطيران والفنادق | `<h2 id>` | prose + internal links to compare/deals |
| 7 | Body — استخدام الكوبونات (+ inline coupon) | `<h2 id>` | prose + inline coupon `.card` (`data-copy`) |
| 8 | Body — اختيار المنطقة المناسبة | `<h2 id>` | prose (Downtown/Marina/Deira/Jumeirah/Business Bay) |
| 9 | Body — نصائح للعائلات | `<h2 id>` | prose |
| 10 | Body — أخطاء يجب تجنبها | `<h2 id>` | prose list |
| 11 | Body — خلاصة | `<h2 id>` | prose + CTAs to compare/deals/coupons |
| 12 | Inline related deal card | — | `.card`, `.badge-source-*`, `.price` → `deal-details.html?id=` |
| 13 | Related destinations (3) | `<h2>` | `.dest-card`/`.card` → `destination-details.html?id=` |
| 14 | Related articles (3) | `<h2>` | `.guide-card`/`.card` → `article.html?id=` |
| 15 | FAQ (≥6) | `<h2>` | `<details>` + `FAQPage` JSON-LD |
| 16 | Newsletter / price-alert form | `<h2>` | `.field*` + `data-validate data-frontend-form` |

---

## 3. Mock-Content Schemas

### 3.1 Destination — `assets/data/destinations-full.json` (NEW catalog; ≥12 items) — FR-022

`destinations.json` (homepage teaser, 4 items: `dest-istanbul`/`dest-dubai`/`dest-maldives`/`dest-paris`) is a
**consistent subset**: overlapping ids reuse the same `id`/`name`/`country`. `dest-dubai` is the default for
`destination-details.html`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key, e.g. `dest-dubai`; used in `?id=` |
| `name` | string (ar) | e.g. "دبي" |
| `country` | string (ar) | e.g. "الإمارات" |
| `city` | string (ar) | e.g. "دبي" |
| `region` | enum (ar) | الشرق الأوسط / أوروبا / آسيا / أفريقيا / مصر والشام / الخليج |
| `slug` | string | latin, e.g. `dubai` (optional `?destination=` form) |
| `detailUrl` | string | `destination-details.html?id=<id>` |
| `image` | string | relative SVG path under `assets/images/` |
| `imageAlt` | string (ar) | meaningful alt |
| `description` | string (ar) | short SEO-friendly summary |
| `priceFrom` | number | indicative "ابتداءً من"/تقديري — never live |
| `currency` | string | e.g. "ر.س" |
| `bestSeason` | string (ar) | e.g. "نوفمبر – مارس"؛ "يختلف حسب الموسم" |
| `dealsCount` | number | illustrative |
| `couponsCount` | number | illustrative |
| `popularFor` | string[] (ar) | travel-style badges: عائلات / شهر عسل / اقتصادي / فاخر / شواطئ / تسوق / ثقافة / مغامرات / نهاية الأسبوع / تأشيرة سهلة |
| `visaNote` | string (ar) | illustrative; "لا تعتبر بديلاً عن المصادر الرسمية" |
| `flightTimeNote` | string (ar) | approximate, "تقديري" |
| `averageBudget` | string (ar) | illustrative range/day |
| `bestAreas` | `{name, note}[]` | neighborhoods (≥6 for Dubai: Downtown Dubai، Dubai Marina، Deira، Jumeirah، Business Bay، Al Barsha) |
| `relatedDealIds` | string[] | resolve to `deals.json` (`deal-001…deal-010`) |
| `relatedCouponIds` | string[] | resolve to `coupons.json` (`coupon-…`) |
| `relatedArticleIds` | string[] | resolve to `articles.json` (`art-…`) |

### 3.2 Article — `assets/data/articles.json` (NEW catalog; ≥12 items) — FR-023

Includes the default article `art-cheap-dubai-deals` ("كيف تجد أرخص عروض السفر إلى دبي؟") and the 3
homepage-teaser guides (so the rewired `#guides` cards resolve).

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key, e.g. `art-cheap-dubai-deals`; used in `?id=` |
| `title` | string (ar) | believable headline |
| `excerpt` | string (ar) | 1–2 sentence summary |
| `category` | enum (ar) | نصائح السفر / أرخص وجهات / فنادق / طيران / عائلات / شهر عسل / كوبونات / تأشيرات / مواسم السفر / مقارنة الأسعار / رحلات اقتصادية |
| `image` | string | relative SVG path |
| `imageAlt` | string (ar) | meaningful alt |
| `readingTime` | string (ar) | e.g. "٦ دقائق قراءة" |
| `date` | string | publish date (e.g. "2026-05-12"), rendered ar |
| `updatedDate` | string | last-updated date |
| `author` | string (ar) | editorial placeholder, e.g. "فريق رحلاتي" |
| `relatedDestination` | string (ar) | e.g. "دبي" |
| `relatedDestinationId` | string | resolve to `destinations-full.json` |
| `tags` | string[] (ar) | filter/search keywords |
| `detailUrl` | string | `article.html?id=<id>` |

> The **default** article's full long-form body is authored statically in `article.html` (D3). Non-default articles
> may carry a stored `bodyHtml` field in the catalog for full swap, or the swap updates header/meta + links onward;
> the default is always complete and static.

### 3.3 Reused data (UNCHANGED)
- `deals.json` (`deal-001…deal-010`) — related-deal cards (detail/article) + the secondary destination-card CTA.
- `coupons.json` (`FLY15`/`HOTEL20`/`BUNDLE10`/`ACT25`/`WINTER12`/`LUXURY30`/`FAMILY15`; categories طيران/فنادق/باقات/أنشطة) — related/inline coupons.
- `compare-offers.json` — `compare.html?destination=` context for route/destination CTAs.
- `destinations.json` (4) — homepage teaser; kept consistent with `destinations-full.json`.

---

## 4. Filter / Search + URL Contract

### 4.1 Card `data-*` (read by `content.js`, no fetch)
| Attribute | On | Example | Used for |
|-----------|----|---------|----------|
| `data-destination` | destination card | `دبي` | search match + label |
| `data-region` | destination card | `الخليج` | region chip filter |
| `data-style` | destination card | `عائلات تسوق فاخر` | style chip filter (space-separated) |
| `data-price` | destination card | `1850` | price label (sort optional) |
| `data-season` | destination card | `شتاء` | season label |
| `data-search` | destination/article card | `dubai دبي الإمارات` | free-text search haystack |
| `data-category` | article card | `طيران` | category chip filter |
| `data-card` | all listing cards | — | filter target |

### 4.2 URL parameters (D2)
| Page | Params | Default when absent/invalid |
|------|--------|-----------------------------|
| `destinations.html` | `region`, `style`, `q` | all destinations |
| `blog.html` | `category`, `q` | all articles |
| `destination-details.html` | `id` (or `destination=` slug) | Dubai default (`dest-dubai`) |
| `article.html` | `id` (or `article=` slug) | default article (`art-cheap-dubai-deals`) |

On listing change: `history.replaceState` with the rebuilt query (no reload). On load: parse → apply chips/search →
update result count (`[aria-live="polite"]`) → toggle empty state when zero matches. On detail load: parse `?id=` →
swap from inline catalog → fall back to the static default when unknown/absent.

---

## 5. Frontend-Only Form Models (not persisted)

All reuse the existing `data-validate data-frontend-form` handler → on valid submit: `preventDefault` → success toast
+ inline confirmation (`[data-frontend-success]`) + `form.reset()`. Nothing stored/transmitted; never implies a real
subscription/notification.

### 5.1 Destination price-alert — `destination-details.html` modal
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| email | `.field-input` type=email, `dir="ltr"` | HTML email constraint | yes |
| destination | `.field-input`/`.field-select` | non-empty | yes |
| maxBudget | `.field-input` type=number | numeric if provided | no |
| travelMonth | `.field-select` | preset option | no |
| travelers | `.field-select` | preset option | no |

### 5.2 Destination-alert — `destinations.html`
email (req), preferred destination, budget range, travel month.

### 5.3 Guide-alert — `blog.html`
email (req), interest category (`.field-select`), preferred destination.

### 5.4 Newsletter / price-alert — `article.html`
email (req), destination, interest category.

> Filter/search controls are NOT validated forms: chips are `<button aria-pressed>` and the search box is a plain
> `.field-input`; `content.js` listens for `input`/`click`, filters the DOM, syncs the URL, and updates the count.
> No-JS baseline shows all cards.

---

## 6. Interaction Map (control → mechanism → result)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Header/drawer/footer الوجهات·المدونة links | plain `href` (coming-soon removed) | Navigate to `destinations.html` / `blog.html` |
| Header/drawer/footer out-of-scope links | `data-coming-soon` (kept) | Info toast "هذه الصفحة قيد الإنشاء" |
| Homepage popular-destination card | `href="destination-details.html?id=<id>"` | Navigate |
| Homepage travel-guide card | `href="article.html?id=<id>"` | Navigate |
| Destination card primary CTA | `href="destination-details.html?id=<id>"` | Navigate |
| Destination card secondary CTA | `href="deals.html"` / `compare.html?destination=<name>` | Navigate |
| Route card CTA | `href="compare.html?destination=<name>"` | Navigate |
| Article card / featured CTA | `href="article.html?id=<id>"` | Navigate |
| Listing search input | `content.js` (`input`) | Filter DOM + URL sync + count |
| Filter chip (region/style/category) | `content.js` (`click`, `aria-pressed`) | Toggle facet + filter DOM + URL + count |
| Reset filters | `content.js` (button) | Clear chips/search + URL + restore full set |
| Save / bookmark toggle | `content.js` (`click`, `aria-pressed`) | Toggle visible state + toast |
| Coupon "copy code" (detail/article) | `data-copy="<CODE>"` (existing) | Copy + success toast |
| Price-alert CTA (detail) | `data-modal-open="price-alert"` (existing) | Open price-alert modal |
| Alert/guide/newsletter form submit | `data-validate data-frontend-form` (existing) | Validate → success toast/inline + reset |
| Article TOC link | in-page `href="#sec-…"` + `content.js` smooth-scroll | Scroll to section (reduced-motion respected) |
| Article share button | `data-toast` (existing) or `content.js` → toast | Toast only (no real share) |
| Related deal card | `href="deal-details.html?id=<id>"` | Navigate |
| FAQ items | native `<details>`/`<summary>` | Expand/collapse |
| Footer year | `data-year` (existing) | Current year |

> No new wiring tokens beyond `content.js`'s search/filter/save/TOC handlers. Coupon copy, price-alert modal, and all
> forms reuse existing `data-*` behaviors; every other control is a plain link.

---

## 7. Structured Data (JSON-LD) per page

| Page | Schemas |
|------|---------|
| `destinations.html` | `BreadcrumbList` + `ItemList` (visible destinations) |
| `destination-details.html` | `BreadcrumbList` + `FAQPage` (mirrors visible FAQ) [+ optional `TouristDestination`] |
| `blog.html` | `BreadcrumbList` + `Blog`/`ItemList` (visible articles) |
| `article.html` | `BreadcrumbList` + `Article` (headline/author/datePublished/dateModified/image) + `FAQPage` |

Rules: each page keeps exactly one `<h1>` and correct heading order; structured data describes mock/editorial content
honestly; prices are the indicative "ابتداءً من"/تقديري value and never asserted as live/guaranteed; visa notes never
asserted official; `FAQPage` mirrors the visible FAQ Q&A (IX/FR-025/FR-036).

---

## 8. Mock-Data Consistency & Integrity Rules

- A destination shared with the homepage teaser MUST have identical `id`/`name`/`country` in
  `destinations-full.json` (the 4 teaser destinations are a subset). (FR-024/SC-008)
- Every `relatedDealIds` entry resolves to a deal in `deals.json`; every `relatedCouponIds` to a coupon in
  `coupons.json`; every `relatedArticleIds`/`relatedDestinationId` to an entry in the corresponding catalog — no
  dangling links. Every rendered `?id=`/`?destination=`/`?article=` resolves to a catalog entry or the documented
  default. (FR-024)
- The 4 homepage-teaser destination ids (`dest-istanbul`/`dest-dubai`/`dest-maldives`/`dest-paris`) and the 3
  homepage-teaser guide article ids exist in the new catalogs so the rewired homepage links resolve. (D10)
- `region` ∈ {الشرق الأوسط، أوروبا، آسيا، أفريقيا، مصر والشام، الخليج}; `popularFor` ⊆ the 10 travel styles;
  `category` ∈ the 11 article categories. Source labels on reused deal/coupon cards stay the four canonical values
  with matching `badge-source-*`; safe CTA labels only. (FR-022/FR-023; IX)
- No field asserts a live/guaranteed price, real availability, official/guaranteed visa info, a completed booking, a
  sent notification, or active AI; pricing is always "ابتداءً من"/تقديري, the price-trend is "مثال توضيحي … لا يمثل
  أسعارًا مباشرة", visa is "لا تعتبر بديلاً عن المصادر الرسمية". (IX; FR-025)
- Latin/numeric values inside Arabic RTL (slugs, prices, dates, coupon codes) render with correct direction
  (`dir="ltr"` where needed) and remain legible/copyable. (spec Edge Cases)
