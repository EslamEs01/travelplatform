# Contract: Merchant Dashboard Mock Data

**Feature**: `006-merchant-dashboard-shell` | **Date**: 2026-06-02

Defines the **schema + consistency rules** for the four new additive catalogs and the reuse rules for the existing
catalogs. These files are **backend-ready reference data**; the dashboard's baseline content is static HTML authored to
match them (no runtime fetch is required to render the main content — research D3/D11). "MUST" items trace to FR-026–
FR-028 and Constitution IX.

---

## M1. `assets/data/merchant-dashboard.json` (NEW) — FR-026

- **M1.1** A top-level object with: `company`, `kpis` (**≥8**), `analytics`, `alerts` (**≥6**), `onboarding` (**6**),
  `activity` (**≥5**), `notifications`.
- **M1.2** `company` MUST carry `name` (ar), `plan` (e.g., "Growth Plan"), `subscriptionStatus` (ar, mock), `user`
  ({`name`, `role`}), and `pendingTasksNote` (ar).
- **M1.3** Each `kpis[]` item MUST carry `key`, `label` (ar), `value`, `trendDirection` (`up`/`down`/`neutral`),
  `trendValue`, `helperText` (ar), and an optional `link`. The eight required keys cover: new booking requests, active
  deals, active coupons, customers, deal clicks, coupon copies, estimated conversions, deals nearing expiry.
- **M1.4** `analytics` MUST carry `bookingInquiriesOverTime` (number[]), `dealClicks` (number[]), `couponCopies`
  (number[]), `topDestinations` ({`label`,`value`}[]), `trafficSources` ({`label`,`value`}[]), and `deviceBreakdown`
  ({`label`,`value`}[]) — realistic mock numbers driving the CSS/HTML-only visuals.
- **M1.5** Each `alerts[]` item MUST carry `severity` (`high`/`medium`/`info`), `message` (ar), a `due` (ar/date), and an
  `action` (label + coming-soon/toast target). Each `onboarding[]` item MUST carry `label` (ar), `description` (ar),
  `done` (bool), and a `cta` (label + target). Each `activity[]` item MUST carry `icon`, `text` (ar), `time` (ar
  relative), and `type`. Each `notifications[]` item MUST carry `text` (ar), `time` (ar), and `type`.

## M2. `assets/data/merchant-bookings-preview.json` (NEW; **≥8** items) — FR-026

- **M2.1** Each booking MUST carry: `reference` (ltr), `customerName` (ar), `phone` (ltr), `requestTitle` (ar),
  `destination` (ar), `amount` (number) + `currency`, `status`, `paymentStatus`, `createdDate`, `assignedUser` (ar).
- **M2.2** `status` ∈ {New, Contacted, Pending Payment, Confirmed, Cancelled, Completed}; `paymentStatus` ∈ {Unpaid,
  Deposit, Paid, Refunded}. The set MUST spread across several statuses and payment states so the badges are meaningful.
  (FR-013)
- **M2.3** No field implies a real booking, customer record, payment, or notification; amounts/phones/references are
  illustrative `dir="ltr"` values. (IX; FR-028)

## M3. `assets/data/merchant-deals-preview.json` (NEW; **≥5** items) — FR-026

- **M3.1** Each top deal MUST carry: `title` (ar), `destination` (ar), `sourceBadge` (Partner/Affiliate/Manual Deal/API
  Ready), `clicks`, `inquiries`, `couponCopies`, `conversionEstimate`, `status` (ar), and a public `dealId` (reusing
  `deals.json`) where applicable.
- **M3.2** `dealId` MUST resolve to an existing `deals.json` id so the CTA links to `../pages/deal-details.html?id=<id>`;
  a missing/invalid id MUST degrade gracefully (safe fallback or skipped CTA) — never a broken page or dead link.
  (FR-017/SC-009)
- **M3.3** Metrics (clicks/inquiries/couponCopies/conversionEstimate) are explicitly mock/تقديري; no field implies real/
  live analytics. (IX)

## M4. `assets/data/merchant-integrations-preview.json` (NEW; **≥11** items) — FR-026

- **M4.1** Each integration MUST carry: `name`, `status`, `description` (ar). The eleven required names: Travelpayouts,
  Booking Affiliate, Expedia Partner, Skyscanner Partner, Amadeus API, Duffel API, Coupon API, Manual Deals, Scraping
  Review Queue, WhatsApp Notifications, Email Notifications.
- **M4.2** `status` ∈ {Connected mock, Not connected, API Ready, Coming soon, Needs configuration, Needs review}. The
  set MUST include a spread (e.g., ≥1 "Connected mock", ≥1 "API Ready", ≥1 "Needs configuration"/"Needs review") so the
  badges are meaningful, and MUST make clear **no integration is really active**. (FR-021)

## M5. Reused catalogs (REFERENCED, UNCHANGED)

- **M5.1** `deals.json` (`deal-001…deal-010`), `coupons.json`, and `compare-offers.json` are **referenced unchanged**;
  this feature only **references** their ids/links (top-deal `dealId` → `deal-details.html?id=`; coupon/route identity).
  No edits to these files. (FR-002/FR-027)

## M6. Honesty & integrity (all catalogs)

- **M6.1** No field or copy asserts a real merchant account/session, live data, a real booking, real analytics, a
  connected integration, a sent notification, an active API sync, an active scraping queue, a real subscription/billing,
  or a payment. Company/KPIs/bookings/deal-metrics/integrations/analytics/alerts/notifications are بيانات تجريبية /
  مثال توضيحي / واجهة أمامية فقط / قابل للربط لاحقًا / حالة تجريبية. (IX; FR-028; SC-010)
- **M6.2** A missing/invalid referenced id MUST degrade gracefully (safe fallback or skipped item) — never a broken page
  or a dead link. (FR-027; spec Edge Cases)
- **M6.3** Latin/numeric values (phones, amounts, references, dates, brand names) carry `dir="ltr"` where rendered inside
  the Arabic RTL layout and remain legible. (FR-032)
- **M6.4** Page-derived figures MUST be internally consistent with the rendered set (e.g., KPI counts plausible vs the
  bookings table; integration-card framing vs the alert "تكامل غير مفعل"; onboarding progress vs the default `done`
  flags). (FR-012/FR-021/FR-023)
