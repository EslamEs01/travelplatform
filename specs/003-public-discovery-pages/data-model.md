# Phase 1 Data Model: Public Discovery & Monetization Pages

**Feature**: `003-public-discovery-pages` | **Date**: 2026-06-01

No backend data. The "model" here is the **page inventory + per-page section inventory**, the
**mock-content schemas** (reused + new), the **filter/URL contract**, the **interaction map** (which control
fires which existing `window.TUI` action or `discovery.js` behavior), the **frontend-only form models**, and
the **structured-data** payloads. All values are realistic, clearly-mock, and never imply live data
(Constitution IX). Cards are static HTML carrying `data-*` so the enhancement layer can filter/sort the DOM
(see research D1).

---

## 1. Page Inventory

| Page | Role | Listing/Detail contract | Primary new data |
|------|------|--------------------------|------------------|
| `pages/deals.html` | Deals listing (catalog) | Listing (filters/sort/empty/skeleton/reset) | `deals.json` (NEW) |
| `pages/deal-details.html` | Single deal detail | Detail (info/CTA/related/FAQ) | `deals.json` (inline catalog) |
| `pages/compare.html` | Single-trip source-offer comparison | Listing-like (sort/filter/empty) | `compare-offers.json` (NEW) |
| `pages/coupons.html` | Coupons listing | Listing (filters/empty/reset) | `coupons.json` (extended) |

All four inline the canonical shell (`partials/head|header|footer.html`), load
`../src/js/ui.js` → `../src/js/main.js` → `../src/js/discovery.js` (defer), and may include a small
page-scoped `<style>` for grid layout (as `index.html` does). Exactly one `<h1>` per page; section headings
`<h2>`; card titles `<h3>`.

---

## 2. Section Inventory (per page)

### 2.1 `deals.html`
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Page header / breadcrumb | `<h1>` عروض السفر | breadcrumb, `.section-*` |
| 2 | Filter + sort bar | — | `.field`, `.field-select`, `.btn`, `.badge` (active chips), reset `.btn-ghost` |
| 3 | Result count + active filters | — | `[aria-live]` count, removable filter chips |
| 4 | Deals grid | (cards `<h3>`) | `.card`, `.badge-source-*`, `.badge-verified/featured`, `.price`, star meta |
| 5 | Empty state | — | `.empty-state` + reset action |
| 6 | Skeleton (init/async) | — | `.skeleton` card placeholders |
| 7 | FAQ (deals help) | `<h2>` | native `<details>`/`<summary>` |

### 2.2 `deal-details.html`
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb | — | breadcrumb |
| 2 | Deal hero (gallery + key facts) | `<h1>` deal title | `.card-media`/gallery, `.badge-source-*`, `.price`, rating |
| 3 | Highlights / inclusions | `<h2>` | list, icons |
| 4 | Terms / cancellation (illustrative) | `<h2>` | `.badge`, `.inline-msg` |
| 5 | Primary CTA → inquiry modal | — | `.btn-primary` + `data-modal-open` |
| 6 | Trust signals | — | trust band/badges (reused) |
| 7 | Related deals (≥3) | `<h2>` | `.card` grid |
| 8 | Help / FAQ (≥3) | `<h2>` | `<details>` + `FAQPage` JSON-LD |
| — | Inquiry modal | (dialog) | `.modal` + `data-validate data-frontend-form` |
| — | Not-found panel (fallback) | — | `.empty-state` linking to `deals.html` |

### 2.3 `compare.html`
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb + trip-context echo | `<h1>` مقارنة العروض | `.inline-msg` / context banner |
| 2 | Filter (source) + sort (price/rating) bar | — | `.field-select`, `.btn`, reset |
| 3 | Result count | — | `[aria-live]` |
| 4 | Offers comparison (cards on mobile, table/columns ≥md) | (offer `<h3>`) | `.card`, `.badge-source-*`, `.price`, rating |
| 5 | Empty state | — | `.empty-state` + reset |
| 6 | "How comparison works" + trust | `<h2>` | steps/trust (reused) |
| 7 | FAQ (comparison help) | `<h2>` | `<details>` |

### 2.4 `coupons.html`
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Page header / breadcrumb | `<h1>` كوبونات الخصم | breadcrumb |
| 2 | Filter (source + category) bar | — | `.field-select`, `.btn`, reset |
| 3 | Result count + active filters | — | `[aria-live]`, chips |
| 4 | Coupons grid | (coupon `<h3>`) | `.card`, `.badge-source-*`, copy control (`data-copy`) |
| 5 | Empty state | — | `.empty-state` + reset |
| 6 | FAQ (coupons help) | `<h2>` | `<details>` |

---

## 3. Mock-Content Schemas

### 3.1 Deal — `assets/data/deals.json` (NEW catalog; ≥9 items)

Extends the existing `featured.json` schema; the homepage's featured deals are a consistent subset (same
`id`/title/price/source). Catalog adds the fields the details/compare/filter views need.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key, e.g. `deal-007`; used in `?id=` |
| `title` | string (ar) | e.g. "عطلة في شرم الشيخ – 4 ليالٍ" |
| `location` | string (ar) | e.g. "شرم الشيخ، مصر" |
| `region` | enum (ar) | filter facet, e.g. "الخليج"، "أوروبا"، "آسيا"، "مصر والشام"، "أفريقيا" |
| `image` | string | relative SVG path in `assets/images/` |
| `imageAlt` | string (ar) | meaningful alt |
| `gallery` | string[] | optional extra SVG paths for details |
| `priceFrom` | number | framed "ابتداءً من" — never live |
| `currency` | string | e.g. "ر.س" |
| `rating` | number (0–5) | realistic |
| `reviewsCount` | number | e.g. 248 |
| `source` | `Partner`\|`Affiliate`\|`Manual Deal`\|`API Ready` | source label |
| `badgeClass` | string | `badge-source-*` |
| `badges` | string[] | e.g. ["موثّق","مميّز"] |
| `highlights` | string[] (ar) | inclusions/highlights for details (≥4) |
| `terms` | string (ar) | illustrative cancellation/terms note |
| `cta` | `{ label, kind }` | safe label; `kind=details` (→ `deal-details.html?id=`) |

### 3.2 Coupon — `assets/data/coupons.json` (extended; ≥6 items)

Existing schema retained; adds `category` for the coupons filter. Homepage coupons remain a consistent
subset.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key |
| `title` | string (ar) | e.g. "خصم على رحلات الطيران" |
| `merchant` | string (ar) | partner/source attribution |
| `category` | enum (ar) | filter facet: "طيران"، "فنادق"، "باقات"، "أنشطة" |
| `source` | `Partner`\|`Affiliate`\|`Manual Deal`\|`API Ready` | → badge |
| `badgeClass` | string | `badge-source-*` |
| `discountLabel` | string (ar) | e.g. "خصم 15%" |
| `code` | string (Latin/numeric) | copyable, rendered `dir="ltr"` |
| `expiry` | string (ar) | illustrative validity |
| `terms` | string (ar) | short illustrative terms; "مثال توضيحي فقط" |

### 3.3 Compare Offer — `assets/data/compare-offers.json` (NEW)

A map of representative destination → offer set (each set ≥4 offers across ≥3 distinct sources). The default
trip's offers render statically; `discovery.js` swaps the set when a known `?destination=` is supplied. The
incoming free-text `?destination=` is normalized (trim + case/diacritic-insensitive contains-match) against
the keys; an unmatched destination falls back to `default`.

```jsonc
{
  "default": { "tripLabel": "إسطنبول – 5 ليالٍ لشخصين", "offers": [ /* Offer[] */ ] },
  "إسطنبول": { "tripLabel": "…", "offers": [ … ] }
}
```

Offer item:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | maps to a `deal-…` for `deal-details.html?id=` |
| `provider` | string (ar) | provider/source name shown on the row |
| `source` | `Partner`\|`Affiliate`\|`Manual Deal`\|`API Ready` | → `badge-source-*` |
| `priceFrom` | number | "ابتداءً من" |
| `currency` | string | "ر.س" |
| `rating` | number (0–5) | realistic |
| `inclusions` | string[] (ar) | short comparison cells (e.g., أمتعة، إلغاء مجاني) |
| `cta` | `{ label, kind }` | safe label; `kind=details` |

---

## 4. Filter / Sort + URL Contract

### 4.1 Card `data-*` (read by `discovery.js`, no fetch)
| Attribute | On | Example | Used for |
|-----------|----|---------|----------|
| `data-source` | deal/coupon/offer card | `Partner` | source filter |
| `data-region` | deal card | `الخليج` | region filter |
| `data-price` | deal/offer card | `1950` | price-range filter + price sort |
| `data-rating` | deal/offer card | `4.7` | rating sort |
| `data-category` | coupon card | `طيران` | category filter |

### 4.2 URL parameters (D2)
| Page | Params | Default when absent/invalid |
|------|--------|-----------------------------|
| `deals.html` | `source`, `region`, `priceMax`, `sort` (`price-asc`\|`price-desc`\|`rating-desc`) | all deals, default order |
| `coupons.html` | `source`, `category` | all coupons |
| `compare.html` | `destination`, `dates`, `travelers`, `source`, `sort` | default trip + all offers |
| `deal-details.html` | `id` | default representative deal (or not-found panel) |

On change: `history.replaceState` with the rebuilt query (no reload). On load: parse → apply → update result
count (`[aria-live="polite"]`) → toggle empty state when zero matches.

---

## 5. Frontend-Only Form Models (not persisted)

### 5.1 Booking Inquiry — `deal-details.html` modal (`data-validate data-frontend-form`)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| name | `.field-input` text | non-empty, ≥2 chars | yes |
| email/contact | `.field-input` type=email, `dir="ltr"` | HTML email constraint | yes |
| travelDate | `.field-input` (date/month) | valid if provided | no |
| travelers | `.field-select` | preset option | no |
| notes | `.field-textarea` | — | no |

On valid submit: existing `data-frontend-form` handler → `preventDefault` → success toast + inline
confirmation + `form.reset()`. Nothing stored/transmitted; never implies a real booking/payment.

### 5.2 Filter forms — `deals.html` / `coupons.html` / `compare.html`
Native controls (`<select>`/range/checkbox) inside a `<form>` (no required validation). `discovery.js`
listens for `input`/`change`, filters the DOM, syncs the URL, and updates the count. No-JS baseline: the
form may `method="get"` round-trip (all items remain visible; filtering is a JS enhancement).

---

## 6. Interaction Map (control → mechanism → result)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Header/drawer/footer deals·compare·coupons links | plain `href` (coming-soon removed) | Navigate to real page |
| Header/drawer/footer out-of-scope links | `data-coming-soon` (kept) | Info toast |
| Homepage hero search submit | native `method="get" action="compare.html"` + `data-validate` | Validate → navigate with query params |
| Deal card / "view all deals" | `href="deal-details.html?id="` / `href="deals.html"` | Navigate |
| Coupon card / "get coupon" / browse | `href="coupons.html"` | Navigate |
| Listing filter/sort change | `discovery.js` (`input`/`change`) | Filter/sort DOM + URL sync + count |
| Reset filters | `discovery.js` (button) | Clear filters + URL + restore full set |
| Coupon "copy code" | `data-copy="<CODE>"` (existing) | Copy + success toast |
| Deal-details primary CTA | `data-modal-open="inquiry"` (existing) | Open inquiry modal |
| Inquiry form submit | `data-validate data-frontend-form` (existing) | Validate → success toast/inline + reset |
| Compare offer "View Deal" | `href="deal-details.html?id="` | Navigate |
| FAQ items | native `<details>`/`<summary>` | Expand/collapse |
| Footer year | `data-year` (existing) | Current year |

> No new wiring tokens are introduced. `discovery.js` enhances filter/sort/URL/detail-swap; every other
> control reuses an existing `data-*` behavior or a plain link.

---

## 7. Structured Data (JSON-LD) per page

| Page | Schemas |
|------|---------|
| `deals.html` | `BreadcrumbList` + `ItemList` (visible deals) |
| `coupons.html` | `BreadcrumbList` + `ItemList` (visible coupons) |
| `compare.html` | `BreadcrumbList` + `ItemList` (offers for the trip) |
| `deal-details.html` | `BreadcrumbList` + `Product`/`Offer` (+ `aggregateRating`) + `FAQPage` |

Rules: each page keeps exactly one `<h1>` and correct heading order; structured data describes mock content
honestly; pricing is the indicative "ابتداءً من" value and never asserted as live/guaranteed (IX/FR-031).
`FAQPage` must mirror the visible FAQ Q&A.

---

## 8. Mock-Data Consistency Rules

- A deal/coupon shown on the homepage MUST have identical `id`/title/price/source on the new pages
  (FR-005/FR-020/SC-009). `deals.json` is the single source of truth for deals; `featured.json` items are a
  consistent subset (or are migrated to reference `deals.json` entities).
- Every `compare-offers.json` offer `id` and every deal card `?id=` MUST resolve to a deal present in the
  inline catalog used by `deal-details.html` (no dangling links).
- Source labels are limited to the four canonical values; safe CTA labels only (View Deal / Request Booking /
  Compare Offer / Get Coupon, in Arabic).
