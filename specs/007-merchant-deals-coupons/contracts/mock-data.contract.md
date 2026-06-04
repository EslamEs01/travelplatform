# Contract: Merchant Deals + Coupons Mock Data

**Feature**: `007-merchant-deals-coupons` | **Date**: 2026-06-02

Defines the **schema + consistency rules** for the two new additive catalogs and the reuse rules for the existing
catalogs. These files are **backend-ready reference data**; the pages' baseline content is **static HTML** authored to
match them (no runtime fetch is required to render the main content — research D3/D8). "MUST" items trace to
FR-039–FR-042 and Constitution IX.

---

## M1. `assets/data/merchant-deals.json` (NEW; **≥12** items) — FR-039

- **M1.1** A JSON array of **≥12** merchant-deal objects. Each MUST carry: `id`, `title`, `destination`, `country`,
  `city`, `region`, `dealType`, `priceBefore`, `priceFrom`, `currency`, `discountLabel`, `sourceType`, `providerName`,
  `status`, `expiryDate`, `travelDates`, `availability`, `clicks`, `inquiries`, `couponCopies`, `rating`, `lastUpdated`,
  `createdBy`, `featured`, `publicUrl`, `image`, `imageAlt`, `highlights`, `includedItems`, `notIncludedItems`, `terms`,
  `seoTitle`, `metaDescription`, `slug`.
- **M1.2** `status` ∈ {Draft, Active, Scheduled, Paused, Expired, Archived}; `sourceType` ∈ {Manual Deal, Partner Link,
  Affiliate, API Ready, Scraped Pending Review}; `dealType` ∈ {Flight, Hotel, Package, Umrah, Honeymoon, Family,
  Business, Budget, Luxury}. `featured` is boolean. The set MUST **spread** across `status` (≥1 each of Draft, Active,
  Paused, Expired, Scheduled; Archived optional but recommended) and `sourceType` (incl. ≥1 Scraped Pending Review) so
  badges, filters, and stat-cards are meaningful. (FR-039; data-model §11)
- **M1.3** `id` MUST reuse `deals.json` ids (`deal-001…deal-010`) for ≥10 records; extra records get new ids (e.g.,
  `deal-011`, `deal-012`). `publicUrl` MUST be `../pages/deal-details.html?id=<id>` for records whose id resolves to a
  `deals.json` id; edit-deal `?id` resolves against these ids. A missing/invalid id MUST degrade gracefully (edit-deal
  default deal; safe-toast CTA) — never a broken page or dead link. (FR-041/SC-010)
- **M1.4** `highlights`, `includedItems`, `notIncludedItems` are string arrays (Arabic) that seed the create/edit
  repeaters. Prices/dates/references are `dir="ltr"`-safe values. No field implies a real publish, save, upload,
  validated link, or live metric; `clicks`/`inquiries`/`couponCopies`/`rating` are explicitly mock. (FR-042; IX)

## M2. `assets/data/merchant-coupons.json` (NEW; **≥12** items) — FR-040

- **M2.1** A JSON array of **≥12** merchant-coupon objects. Each MUST carry: `id`, `code`, `discountType`,
  `discountValue`, `currency` (when fixed), `provider`, `sourceType`, `category`, `relatedDeal`, `usageLimit`,
  `usedCount`, `startDate`, `expiryDate`, `status`, `minimumBooking`, `terms`, `sourceUrl`, `affiliateUrl`,
  `reviewStatus`, `lastUpdated`.
- **M2.2** `status` ∈ {Draft, Active, Scheduled, Paused, Expired, Archived}; `discountType` ∈ {Percentage, Fixed amount,
  Free service, Custom offer}; `sourceType` ∈ {Manual, Affiliate, Coupon API, Scraped Pending Review}; `category` ∈
  {Flights, Hotels, Packages, Activities, Car Rental, Travel Insurance, Umrah, Honeymoon}. The set MUST **spread** across
  `status`, `discountType`, `sourceType` (incl. ≥1 Scraped Pending Review), and `category` so badges/filters/stat-cards
  are meaningful. (FR-040; data-model §11)
- **M2.3** `code` is an `dir="ltr"` alphanumeric string (e.g., `SUMMER25`). `currency` MUST be present when `discountType`
  = Fixed amount. `relatedDeal` MUST be a `deal-0xx` id present in `deals.json`/`merchant-deals.json` (or `null`).
  `id`/`code` SHOULD reuse `coupons.json` values where a public coupon is referenced. (FR-040/FR-041)
- **M2.4** No field implies a coupon active on a live system, a real save, a validated/guaranteed coupon, a connected
  API, an active scraping source, a payment, or a notification; `sourceUrl`/`affiliateUrl` are configuration-ready (not
  validated); Scraped Pending Review records carry a `reviewStatus` indicating review is pending and never auto-publish.
  (FR-042; IX)

## M3. Reused catalogs (REFERENCED, UNCHANGED)

- **M3.1** `deals.json` (`deal-001…deal-010`) — `merchant-deals.json` reuses these ids; edit-deal `?id` and row/edit/
  public CTAs resolve to `../pages/deal-details.html?id=`. Unchanged. (FR-041)
- **M3.2** `coupons.json` (`coupon-flights-15`, `coupon-hotel-20`, `coupon-bundle-10`, `coupon-activity-25`,
  `coupon-winter-12`, `coupon-luxury-30`, `coupon-family-15`) — `merchant-coupons.json` reuses ids/codes where a public
  coupon is referenced; related-deal / "copy from public" honesty. Unchanged. (FR-041)
- **M3.3** Spec 006 `merchant-dashboard.json` / `merchant-bookings-preview.json` / `merchant-deals-preview.json` /
  `merchant-integrations-preview.json` — referenced for identity consistency only; unchanged.

## M4. Static-HTML matching & integrity

- **M4.1** The pages' baseline content (deals.html ≥12 rows + stat cards; coupons.html ≥12 rows + stat cards; edit-deal
  prefilled values) is **static HTML authored to match** these catalogs; no section depends on `fetch` to render.
  Enhancement (edit-deal `?id` prefill) MAY read an inline `<script type="application/json">` block mirroring the
  catalog. (research D3/D6/D8; FR-006)
- **M4.2** Stat-card counts MUST be internally consistent with the rendered rows (e.g., "العروض النشطة" = count of Active
  deal rows; "المسودات" = Draft rows; coupon "النشطة"/"المسودات" likewise). (FR-009/FR-028)
- **M4.3** Reused source/status labels stay canonical with matching `badge-source-*`/status-badge classes; a missing/
  invalid referenced id never breaks a page. (FR-041; IX)
- **M4.4** No catalog field or rendered copy asserts a real publish, database save, file/image upload, validated/
  guaranteed coupon or link, connected API, active scraping source, payment, sent notification, or a coupon active on a
  live system; everything is بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / قابل للربط لاحقًا. (FR-042; IX)
