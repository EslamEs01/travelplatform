# Contract: Mock Data

**Feature**: `004-destinations-blog-seo` | **Date**: 2026-06-01

Defines the shape and consistency rules for the mock content the new pages consume. All data is realistic but
**clearly mock/editorial**; it MUST NOT imply live prices, real notifications, official visa rules, or active
integrations (Constitution IX). New data files are additive under `travel-saas-frontend/assets/data/`. The static HTML
on each page is the rendered form of this data (research D1); the two detail pages additionally embed their catalog
inline (research D3). Related deals/coupons reuse the existing `deals.json`/`coupons.json` ids unchanged.

---

## M1. `destinations-full.json` (NEW) — destinations catalog, ≥12 items

Each item:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | unique, `dest-<slug>`; used in `destination-details.html?id=` |
| `name` | string (ar) | yes | believable |
| `country` | string (ar) | yes | believable |
| `city` | string (ar) | yes | believable |
| `region` | enum (ar) | yes | one of: الشرق الأوسط / أوروبا / آسيا / أفريقيا / مصر والشام / الخليج |
| `slug` | string | yes | latin; optional `?destination=` form |
| `detailUrl` | string | yes | `destination-details.html?id=<id>` |
| `image` | string | yes | relative path under `assets/images/` |
| `imageAlt` | string (ar) | yes | meaningful |
| `description` | string (ar) | yes | short SEO-friendly summary |
| `priceFrom` | number | yes | indicative "ابتداءً من"/تقديري; never live |
| `currency` | string | yes | e.g. "ر.س" |
| `bestSeason` | string (ar) | yes | illustrative; "يختلف حسب الموسم" allowed |
| `dealsCount` | number | yes | illustrative |
| `couponsCount` | number | yes | illustrative |
| `popularFor` | string[] (ar) | yes | ⊆ {عائلات، شهر عسل، اقتصادي، فاخر، شواطئ، تسوق، ثقافة، مغامرات، نهاية الأسبوع، تأشيرة سهلة} |
| `visaNote` | string (ar) | yes | illustrative; includes "لا تعتبر بديلاً عن المصادر الرسمية" framing |
| `flightTimeNote` | string (ar) | yes | approximate; "تقديري" |
| `averageBudget` | string (ar) | yes | illustrative range |
| `bestAreas` | `{name,note}[]` | yes | ≥6 for Dubai (Downtown Dubai/Dubai Marina/Deira/Jumeirah/Business Bay/Al Barsha) |
| `relatedDealIds` | string[] | yes | each resolves to a `deals.json` deal |
| `relatedCouponIds` | string[] | yes | each resolves to a `coupons.json` coupon |
| `relatedArticleIds` | string[] | yes | each resolves to an `articles.json` article |

MUST include `dest-dubai` (the default detail) and the 4 homepage-teaser ids `dest-istanbul`/`dest-dubai`/
`dest-maldives`/`dest-paris` (consistent subset of `destinations.json`).

## M2. `articles.json` (NEW) — articles catalog, ≥12 items

Each item:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | unique, `art-<slug>`; used in `article.html?id=` |
| `title` | string (ar) | yes | believable headline |
| `excerpt` | string (ar) | yes | 1–2 sentence summary |
| `category` | enum (ar) | yes | one of: نصائح السفر / أرخص وجهات / فنادق / طيران / عائلات / شهر عسل / كوبونات / تأشيرات / مواسم السفر / مقارنة الأسعار / رحلات اقتصادية |
| `image` | string | yes | relative path under `assets/images/` |
| `imageAlt` | string (ar) | yes | meaningful |
| `readingTime` | string (ar) | yes | e.g. "٦ دقائق قراءة" |
| `date` | string | yes | publish date |
| `updatedDate` | string | yes | last-updated date |
| `author` | string (ar) | yes | editorial placeholder |
| `relatedDestination` | string (ar) | yes | e.g. "دبي" |
| `relatedDestinationId` | string | yes | resolves to `destinations-full.json` |
| `tags` | string[] (ar) | yes | search/filter keywords |
| `detailUrl` | string | yes | `article.html?id=<id>` |
| `bodyHtml` | string | no | full long-form body for non-default `?id=` swap (the default article's body is authored statically) |

MUST include `art-cheap-dubai-deals` (default article, "كيف تجد أرخص عروض السفر إلى دبي؟") and the 3 homepage-teaser
guide articles (so the rewired `#guides` cards resolve).

## M3. Reused data (UNCHANGED)

- `deals.json` — `deal-001…deal-010`; full schema unchanged. Source of truth for related-deal cards.
- `coupons.json` — `coupon-flights-15`…`coupon-family-15` (codes `FLY15`…`FAMILY15`; categories طيران/فنادق/باقات/أنشطة); unchanged.
- `compare-offers.json` — destination→offer sets; unchanged (route/destination CTAs link to `compare.html?destination=`).
- `destinations.json` — homepage teaser (4: `dest-istanbul`/`dest-dubai`/`dest-maldives`/`dest-paris`); unchanged; a
  consistent subset of `destinations-full.json`.

---

## M4. Consistency & integrity rules

- **M4.1** A destination shared with the homepage teaser has identical `id`/`name`/`country` in
  `destinations-full.json`. The 4 teaser destinations + the 3 teaser guide articles exist in the new catalogs so the
  rewired homepage links resolve. (FR-024/FR-027; SC-008)
- **M4.2** Every `relatedDealIds`/`relatedCouponIds`/`relatedArticleIds`/`relatedDestinationId` value, and every
  rendered `?id=`/`?destination=`/`?article=`/`deal-details.html?id=`, resolves to a real catalog entry or the
  documented default — no dangling links. (data-model §8)
- **M4.3** `region`, `popularFor`, and `category` use only the enumerated values. Reused deal/coupon `source` stays
  one of the four canonical values with matching `badge-source-*`; CTA labels are the safe set only (View Deal /
  Request Booking / Compare Offer / Get Coupon, in Arabic). (IX)
- **M4.4** No field asserts a live/guaranteed price, real availability, official/guaranteed visa info, a completed
  booking, a sent notification, or active AI; pricing is "ابتداءً من"/تقديري, the price-trend is "مثال توضيحي … لا
  يمثل أسعارًا مباشرة … قابل للربط لاحقًا", visa is "لا تعتبر بديلاً عن المصادر الرسمية". (IX; FR-025)
- **M4.5** Latin/numeric values inside Arabic RTL (slugs, prices, dates, coupon codes) render with correct direction
  (`dir="ltr"` where needed) and remain legible/copyable. (spec Edge Cases)
