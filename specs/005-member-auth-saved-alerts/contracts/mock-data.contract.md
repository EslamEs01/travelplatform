# Contract: Member Mock Data

**Feature**: `005-member-auth-saved-alerts` | **Date**: 2026-06-02

Defines the **schema + consistency rules** for the three new additive catalogs and the reuse rules for the existing
catalogs. These files are **backend-ready reference data**; the pages' baseline content is static HTML authored to match
them (no runtime fetch is required to render the main content — research D1/D8). "MUST" items trace to FR-028–FR-031 and
Constitution IX.

---

## M1. `assets/data/member-saved.json` (NEW) — FR-028

- **M1.1** A top-level object with five arrays: `savedDeals` (**≥6**), `savedCoupons` (**≥4**), `savedDestinations`
  (**≥4**), `savedComparisons` (**≥4**), `savedArticles` (**≥3**).
- **M1.2** Every item MUST carry at least: `id`, `type` (`deal`/`coupon`/`destination`/`comparison`/`article`), `title`,
  the type-appropriate display fields (image/imageAlt, destination, sourceBadge, priceFrom/currency, discount, code,
  provider/category, rating, bestSeason, deals/coupons counts, route/travelMonth/travelers/maxBudget, lastViewed),
  a `status`, an `expiry`/`date` where applicable, and a `linkUrl`.
- **M1.3** `linkUrl` MUST resolve to an existing page: saved deal → `deal-details.html?id=<deal-id>`; saved coupon →
  `coupons.html`; saved destination → `destination-details.html?id=<destination-id>`; saved comparison →
  `compare.html?destination=<name>` (+ optional context params); saved article → `article.html?id=<article-id>`.
- **M1.4** Referenced `id`s MUST reuse the existing catalogs (`deals.json` `deal-001…deal-010`; `coupons.json` codes;
  `destinations-full.json` `dest-…`; `articles.json` `art-…`) — no duplicated or contradictory entity data. (SC-008)
- **M1.5** `sourceBadge` on saved deals/coupons ∈ {Partner, Affiliate, Manual Deal, API Ready}; prices are indicative
  "ابتداءً من"/تقديري; nothing asserts a guaranteed/live price or a real booking. (IX)

## M2. `assets/data/price-alerts.json` (NEW; **≥6** items) — FR-029

- **M2.1** Each alert MUST carry: `id`, `type` (`flight`/`hotel`/`package`/`destination`), `to`/`destination`,
  `travelMonth`, `maxBudget` (+`currency`), `travelers`, `notifyMethod` (`email`/`whatsapp`/`dashboard`),
  `notifyContact` (email/phone placeholder), `status` (`active`/`paused`/`triggered`), `currentSamplePrice`,
  `lastChecked`; plus `from` when `type=flight`.
- **M2.2** The set MUST include a spread of statuses (≥1 active, ≥1 paused, ≥1 triggered-mock) and ≥2 types so the stats
  cards and status badges are meaningful. Page stats (active/paused/triggered counts, destinations watched, average
  target budget) MUST be consistent with the rendered set. (FR-018)
- **M2.3** `currentSamplePrice` and `lastChecked` are explicitly illustrative ("مثال توضيحي"); no field implies a real
  monitored/live price or a sent notification. (IX; FR-031)

## M3. `assets/data/member-profile.json` (NEW; 1 item) — FR-030

- **M3.1** MUST carry: `name`, `email`, `phone`, `country`, `city`, `memberSince`, `preferredLanguage`,
  `preferredCurrency`, `preferredDestinations`, `travelInterests`, `budgetRange`, plus preference fields (hotel stars,
  travel month/season, default travelers, airport/city pref), `notificationPreferences` (the 7 toggle booleans), and a
  `security` placeholder (2FA off; mock active-sessions list).
- **M3.2** Values MUST match the static profile-header and form defaults on `profile.html` (and the member name/email on
  `saved-deals.html`); `notificationPreferences` MUST match the initial toggle states. (SC-007)
- **M3.3** `travelInterests` ⊆ {عائلات, شهر عسل, اقتصادي, فاخر, شواطئ, تسوق, عمرة}; `preferredDestinations` reuse
  destination names/ids from `destinations-full.json`. (consistency)

## M4. Reused catalogs (UNCHANGED)

- **M4.1** `deals.json`, `coupons.json`, `destinations-full.json`, `compare-offers.json`, and `articles.json` are
  **reused unchanged**; this feature only **references** their ids/links from `member-saved.json` and from the static
  saved-item cards. No edits to these files. (FR-002/FR-028)

## M5. Honesty & integrity (all catalogs)

- **M5.1** No field or copy asserts a real account/session, server-side storage, a sent email/WhatsApp notification, a
  changed/reset password, a monitored/live price, a connected API, or a payment. Member identity, saved items, alerts,
  and profile are تجريبية / واجهة أمامية فقط / قابل للربط لاحقًا; alerts are "مثال توضيحي". (IX; FR-031; SC-010)
- **M5.2** A missing/invalid referenced id MUST degrade gracefully (safe fallback or skipped item) — never a broken page
  or a dead link. (FR-016; spec Edge Cases)
- **M5.3** Latin/numeric values (emails, phones, coupon codes, prices, dates) carry `dir="ltr"` where rendered inside the
  Arabic RTL layout and remain legible/copyable. (FR-037)
