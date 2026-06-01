# Contract: Homepage Mock-Content Data

**Feature**: `002-public-homepage` | **Date**: 2026-05-31

Schemas for the homepage's mock-content JSON. All content is realistic but **clearly not live**; it MUST
never imply real prices or active integrations (Principle IX). Source labels and safe CTA labels follow the
constitution. Files live in `travel-saas-frontend/assets/data/` and mirror the existing `featured.json`
convention so they stay backend-ready (map to future Django view context).

## F1. `featured.json` (reused; ≥6 items)

Existing array of deal objects (schema unchanged). If extended, new items MUST keep the same fields and
remain consistent with content shown elsewhere.

```json
{
  "id": "deal-001",
  "type": "deal",
  "title": "عطلة في شرم الشيخ – 4 ليالٍ",
  "location": "شرم الشيخ، مصر",
  "image": "../assets/images/beach.svg",
  "imageAlt": "شاطئ رملي في شرم الشيخ",
  "priceFrom": 1950,
  "currency": "ر.س",
  "rating": 4.7,
  "reviewsCount": 248,
  "source": "Partner",
  "badgeClass": "badge-source-partner",
  "badges": ["موثّق", "مميّز"],
  "cta": { "label": "عرض التفاصيل", "kind": "quick-view" }
}
```

- `source` ∈ { `Partner`, `Affiliate`, `Manual Deal`, `API Ready` }; `badgeClass` matches.
- `cta.kind` ∈ { `quick-view`, `coming-soon` }; `cta.label` is a safe label (View Deal / Request Booking).
- `priceFrom` is always rendered with "ابتداءً من"; never labeled live/real.

## F2. `destinations.json` (NEW; ≥4 items)

```json
[
  {
    "id": "dest-istanbul",
    "name": "إسطنبول",
    "country": "تركيا",
    "image": "../assets/images/city.svg",
    "imageAlt": "أفق مدينة إسطنبول",
    "priceFrom": 2450,
    "currency": "ر.س",
    "dealsCount": 38
  }
]
```

- Either `priceFrom` (with "ابتداءً من") or `dealsCount` ("38 عرضاً") may be the indicative cue; at least one present.
- Reuse existing SVG images unless a new lightweight placeholder is added.

## F3. `coupons.json` (NEW; ≥3 items)

```json
[
  {
    "id": "coupon-flights-15",
    "title": "خصم على رحلات الطيران",
    "merchant": "شريك الطيران",
    "source": "Affiliate",
    "badgeClass": "badge-source-affiliate",
    "discountLabel": "خصم 15%",
    "code": "FLY15",
    "expiry": "حتى 31 ديسمبر 2026",
    "terms": "يُطبّق على رحلات مختارة. مثال توضيحي فقط."
  }
]
```

- `code` is Latin/numeric, rendered `dir="ltr"`, copied verbatim via `data-copy`.
- `source`/`badgeClass` per the source-badge system.
- `expiry`/`terms` are illustrative; MUST read as example/mock, never a binding live offer.

## F4. Inline content (testimonials, partners, guides)

These small sets MAY be authored inline in `index.html` (semantic markup) rather than JSON, but MUST follow
the data-model fields:

- **Testimonial**: `author` (name + city), `rating` (0–5), `quote`, `avatarInitial` (no external image).
- **Trusted Partner**: visible text `name` + `kind` ("شريك معتمد"); decorative `mark` SVG is `aria-hidden`.
- **Guide teaser**: `title`, `excerpt`, `category`, `image` (SVG placeholder), CTA → `data-coming-soon`.

## Consistency rules

- Currency consistent across the page (e.g., "ر.س").
- Any destination/deal that appears in multiple sections uses consistent name/price.
- All imagery referenced by data files MUST exist under `assets/images/` and carry meaningful `alt` at render.
- No field may state or imply that a price is live, real-time, or a guaranteed bookable rate.
