# Contract: Mock Data

**Feature**: `003-public-discovery-pages` | **Date**: 2026-06-01

Defines the shape and consistency rules for the mock content the new pages consume. All data is realistic but
**clearly mock**; it MUST NOT imply live prices or active integrations (Constitution IX). Data files are
additive and live under `travel-saas-frontend/assets/data/`. The static HTML on each page is the rendered
form of this data (research D1); `deal-details.html` additionally embeds the deals catalog inline (research
D5).

---

## M1. `deals.json` (NEW) — deals catalog, ≥9 items

Superset of the existing `featured.json` schema. Each item:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | unique, `deal-0NN`; used in `deal-details.html?id=` |
| `title` | string (ar) | yes | believable |
| `location` | string (ar) | yes | "city، country" |
| `region` | enum (ar) | yes | one of: الخليج / أوروبا / آسيا / مصر والشام / أفريقيا |
| `image` | string | yes | relative path under `assets/images/` |
| `imageAlt` | string (ar) | yes | meaningful |
| `gallery` | string[] | no | extra SVG paths for the detail view |
| `priceFrom` | number | yes | indicative "ابتداءً من"; never live |
| `currency` | string | yes | e.g. "ر.س" |
| `rating` | number | yes | 0–5, realistic |
| `reviewsCount` | number | yes | realistic |
| `source` | enum | yes | Partner / Affiliate / Manual Deal / API Ready |
| `badgeClass` | string | yes | matching `badge-source-*` |
| `badges` | string[] | no | e.g. ["موثّق","مميّز"] |
| `highlights` | string[] (ar) | yes | ≥4 inclusions for the detail view |
| `terms` | string (ar) | yes | illustrative; includes a "مثال توضيحي" framing |
| `cta` | `{label,kind}` | yes | safe label; `kind=details` |

## M2. `coupons.json` (EXTENDED) — ≥6 items

Existing fields retained; **adds** `category`. Each item:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | unique |
| `title` | string (ar) | yes | believable |
| `merchant` | string (ar) | yes | partner/source attribution |
| `category` | enum (ar) | yes | one of: طيران / فنادق / باقات / أنشطة |
| `source` | enum | yes | Partner / Affiliate / Manual Deal / API Ready |
| `badgeClass` | string | yes | `badge-source-*` |
| `discountLabel` | string (ar) | yes | e.g. "خصم 15%" |
| `code` | string | yes | Latin/numeric, copyable, rendered `dir="ltr"` |
| `expiry` | string (ar) | yes | illustrative validity |
| `terms` | string (ar) | yes | short illustrative note ("مثال توضيحي فقط") |

## M3. `compare-offers.json` (NEW) — destination → offer set

```jsonc
{
  "default": { "tripLabel": "<ar>", "offers": [ /* ≥4 Offer across ≥3 sources */ ] },
  "<destination-ar>": { "tripLabel": "<ar>", "offers": [ … ] }
}
```

Offer:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | resolves to a `deals.json` deal (for `?id=`) |
| `provider` | string (ar) | yes | provider/source display name |
| `source` | enum | yes | Partner / Affiliate / Manual Deal / API Ready |
| `priceFrom` | number | yes | "ابتداءً من" |
| `currency` | string | yes | "ر.س" |
| `rating` | number | yes | 0–5 |
| `inclusions` | string[] (ar) | yes | short comparison cells |
| `cta` | `{label,kind}` | yes | safe label; `kind=details` |

Each `default`/destination set MUST contain ≥4 offers spanning ≥3 distinct `source` values.

---

## M4. Consistency & integrity rules

- **M4.1** Every deal/coupon shared with the homepage has identical `id`/title/`priceFrom`/`source`/`code`
  on the new pages. `deals.json` is the single source of truth for deals; `featured.json` items are a
  consistent subset (or migrated to reference the same entities). (FR-005/FR-020; SC-009)
- **M4.2** Every `compare-offers.json` offer `id` and every rendered deal-card `?id=` resolves to a deal in
  the inline catalog used by `deal-details.html` — no dangling detail links. (data-model §8)
- **M4.3** `source` is exactly one of the four canonical values; `badgeClass` matches it; CTA labels are the
  safe set only. (IX)
- **M4.4** No field asserts a live/guaranteed price, real availability, or a completed booking; pricing is
  always "ابتداءً من" / illustrative. (IX; FR-031)
- **M4.5** Latin/numeric values inside Arabic RTL (codes, prices, dates) render with correct direction
  (`dir="ltr"` where needed) and remain legible. (spec Edge Cases)
