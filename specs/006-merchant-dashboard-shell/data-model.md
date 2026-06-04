# Phase 1 Data Model: Merchant Dashboard Shell + Overview

**Feature**: `006-merchant-dashboard-shell` | **Date**: 2026-06-02

No backend data. The "model" here is the **page inventory + shell + per-section inventory**, the **mock-content schemas**
(new + reused), the **interaction map** (which control fires which existing `window.TUI` action or `dashboard.js`
behavior), the **frontend-only form models** (with validation rules), and the **structured-data** notes. All values are
realistic, clearly-mock, and never imply a real merchant account, session, live data, booking, analytics, connected
integration, sent notification, subscription, or payment (Constitution IX; spec product-honesty). Cards/rows/items are
static HTML carrying `data-*` so the enhancement layer acts on the DOM (research D3). Dashboard state is frontend/
session-only; reload restores the mock defaults (research D4).

---

## 1. Page Inventory

| Page | `data-page` | Role | Contract | Primary new data |
|------|-------------|------|----------|------------------|
| `dashboard/index.html` | `merchant-dashboard` | Merchant overview + reusable app shell | Dashboard (shell + 11 overview sections + modals + empty/loading) | `merchant-dashboard.json` + `merchant-bookings-preview.json` + `merchant-deals-preview.json` + `merchant-integrations-preview.json`; reuses `deals.json`/`coupons.json`/`compare-offers.json` ids |

The page sets `<html lang="ar" dir="rtl" data-page="merchant-dashboard">`, authors its own `<head>` from the
`partials/head.html` conventions (CSS `../assets/css/tailwind.css`, Cairo font preload, favicon, theme-color, viewport,
Arabic title/meta, `robots noindex`), uses its **own app shell** (NOT `partials/header.html`/`footer.html`), loads
`../src/js/ui.js` → `../src/js/main.js` → `../src/js/dashboard.js` (defer), and includes a small page-scoped `<style>`
for the shell/dropdowns/table/KPI-grid/chart-bars/onboarding-progress. Exactly one `<h1>` (the welcome-summary heading);
section headings `<h2>`; card/sub-section titles `<h3>`.

### Unbuilt merchant pages (navigation prepared, coming-soon only — NOT created)

`dashboard/deals.html`, `create-deal.html`, `edit-deal.html`, `coupons.html`, `create-coupon.html`, `bookings.html`,
`booking-details.html`, `customers.html`, `customer-details.html`, `analytics.html`, `integrations.html`,
`settings.html` — every reference uses `data-coming-soon` (research D9).

---

## 2. Shell Inventory (`dashboard/index.html`)

| # | Region | Heading | Reused patterns / notes |
|---|--------|---------|-------------------------|
| S1 | Skip link + `#main` landmark + `#toast-root` | — | `.skip-link`; `#toast-root` for `TUI.toast` |
| S2 | **Sidebar** (desktop fixed; mobile drawer) | brand/logo (`<a>` → `index.html`) | page-scoped `.dash-sidebar`; nav `<ul>`: الرئيسية(active `aria-current`)/العروض/إضافة عرض/الكوبونات/طلبات الحجز/العملاء/التحليلات/التكاملات/الإعدادات/العودة للموقع; each link icon via `<use href="../assets/icons/sprite.svg#icon-…">` |
| S3 | Sidebar **drawer overlay/scrim** (mobile) | — | `.drawer-overlay` + `dashboard.js`/`TUI.drawer`; close on scrim/Escape |
| S4 | **Topbar** | — | page-scoped `.dash-topbar`: mobile-menu button (`icon-menu`, `aria-controls`), breadcrumb/current area, company-switcher placeholder, global search (`.search-input-light`), notifications dropdown (`icon-bell`), quick-add dropdown (`icon-plus`), user-menu dropdown (avatar) |
| S5 | **Breadcrumb** (لوحة التحكم / الرئيسية) | — | `.breadcrumb` |
| S6 | **Page header** | (page title region) | company name + a "بيانات تجريبية" badge; the welcome summary carries the single `<h1>` |
| S7 | **Dashboard content** | — | the 11 overview sections (§3) |
| S8 | **Dashboard footer** | — | page-scoped `.dash-footer`: platform name, frontend-only note, copyright, link → `../pages/index.html` |
| — | Topbar **dropdown menus** (notifications / quick-add / user) | — | page-scoped menu (`role="menu"`); `z-index: dropdown`; toggled by `dashboard.js` |
| — | **Status-change modal**, **add-note modal** (+ optional assign-user modal) | (dialogs) | `.modal` + `TUI.modal`; see §3.3/§5 |
| — | Reusable **skeleton** + **empty-state** patterns (hidden by default) | — | `.skeleton*`, `.empty-state` |

Sidebar nav links (S2):

| Label | Target | Behavior |
|-------|--------|----------|
| الرئيسية | `index.html` | Navigate (active, `aria-current="page"`) |
| العروض | `deals.html` (unbuilt) | `data-coming-soon` → toast |
| إضافة عرض | `create-deal.html` (unbuilt) | `data-coming-soon` → toast |
| الكوبونات | `coupons.html` (unbuilt) | `data-coming-soon` → toast |
| طلبات الحجز | `bookings.html` (unbuilt) | `data-coming-soon` → toast |
| العملاء | `customers.html` (unbuilt) | `data-coming-soon` → toast |
| التحليلات | `analytics.html` (unbuilt) | `data-coming-soon` → toast |
| التكاملات | `integrations.html` (unbuilt) | `data-coming-soon` → toast |
| الإعدادات | `settings.html` (unbuilt) | `data-coming-soon` → toast |
| العودة للموقع | `../pages/index.html` | Navigate |

---

## 3. Section Inventory (overview content)

### 3.1 Welcome / agency summary (FR-011) — carries the single `<h1>`
| Element | Reused patterns |
|---------|-----------------|
| `<h1>` welcome + company name (شركة رحلات الشرق) | page header; `.card` |
| Plan badge (Growth Plan) + subscription-status mock | `.badge`/`.badge-info`; "حالة تجريبية" |
| Pending-tasks note | `.inline-msg-info` |
| CTAs: إضافة عرض جديد / مراجعة طلبات الحجز / إعداد التكاملات | `.btn-primary`/`.btn-outline`; coming-soon for unbuilt targets |

### 3.2 KPI cards (≥8) (FR-012)
`.card` grid (page-scoped `.kpi-grid`); each card: icon (`<use>`), label `<h3>`/`<p>`, value, **trend indicator**
(`icon-trend-up`/`icon-trend-down` + `.badge-success`/`.badge-danger` + value), helper text, optional link/action
(navigate or coming-soon). Cards: طلبات الحجز الجديدة / العروض النشطة / الكوبونات المفعلة / العملاء / الضغطات على العروض /
نسخ الكوبونات / التحويلات التقديرية / عروض قاربت على الانتهاء.

### 3.3 Recent booking requests (≥8) (FR-013–FR-016)
| Element | Reused patterns |
|---------|-----------------|
| Section heading `<h2>` + "بيانات تجريبية" note | — |
| Responsive `<table>` (md+) → stacked labeled cards (≤md) | page-scoped `.dash-table` + `data-label` `::before` |
| Columns | reference, customer, phone (`dir="ltr"`), request title, destination, amount (`dir="ltr"`), **status** `.badge`, **payment status** `.badge`, created date, assigned user, **actions** (row menu) |
| Status badges | New `.badge-info` / Contacted `.badge-neutral` / Pending Payment `.badge-warning` / Confirmed `.badge-success` / Cancelled `.badge-danger` / Completed `.badge-success` (distinct style) |
| Payment badges | Unpaid `.badge-danger` / Deposit `.badge-warning` / Paid `.badge-success` / Refunded `.badge-neutral` |
| Row action menu | `icon-more` trigger → page-scoped menu: view-details (coming-soon) / change-status (modal) / add-note (modal) / contact-customer (toast) / assign-user (modal or toast) |
| **Status-change modal** | `.modal`: reference (read-only), new-status `.field-select`, note `.field-textarea`, notify-customer toggle placeholder (`role="switch"`); save → toast + optional in-place badge update |
| **Add-note modal** | `.modal`: reference (read-only), required note `.field-textarea`, note-type `.field-select`, optional follow-up `.field-input type=date`; save → toast + inline success |
| Empty-state (no bookings) | `.empty-state` (reusable pattern, hidden by default) |

### 3.4 Top performing deals (≥5) (FR-017)
`.card` rows; each: title `<h3>`, destination, **source badge** (`.badge-source-partner/affiliate/manual/api-ready`),
clicks, inquiries, coupon copies, conversion estimate, status `.badge`; CTA → `../pages/deal-details.html?id=<dealId>`
(when id exists); edit CTA → coming-soon (`edit-deal.html`).

### 3.5 Quick actions (FR-020)
Page-scoped `.quick-actions` grid of `.btn`s: إضافة عرض جديد (coming-soon) / إنشاء كوبون (coming-soon) / مراجعة الطلبات
(coming-soon) / إعداد التكاملات (coming-soon) / عرض صفحة الشركة (coming-soon or in-page) / تصفح الموقع العام →
`../pages/index.html`.

### 3.6 Integration readiness (≥11) (FR-021)
`.card` with rows; each: name, **status badge** (Connected mock `.badge-success` / Not connected `.badge-neutral` / API
Ready `.badge-source-api-ready` / Coming soon `.badge-info` / Needs configuration `.badge-warning` / Needs review
`.badge-warning`), short description, action button (إعداد / اختبار / قريبًا → toast/coming-soon). Rows: Travelpayouts,
Booking Affiliate, Expedia Partner, Skyscanner Partner, Amadeus API, Duffel API, Coupon API, Manual Deals, Scraping
Review Queue, WhatsApp Notifications, Email Notifications. Card states "لا يوجد تكامل مفعّل فعليًا — تكامل جاهز للإعداد
لاحقًا".

### 3.7 Analytics preview (6 visuals, CSS/HTML only) (FR-018)
Page-scoped `.chart-*`; each a `<figure>`+`<figcaption>` "مثال توضيحي": booking inquiries over time (vertical bars),
deal clicks (bars/sparkline), coupon copies (bars), top destinations (horizontal proportion bars), traffic sources
(segmented/stacked bar), device breakdown (proportion bars). No chart library/canvas.

### 3.8 Operational alerts (≥6) (FR-022)
`.card` cards; each: **severity badge** (`.badge-danger`/`.badge-warning`/`.badge-info`), message, date/due note, action
button (toast/coming-soon). Alerts: عروض قاربت على الانتهاء / كوبونات تحتاج مراجعة / طلبات لم يتم الرد عليها / تكامل غير
مفعل / بيانات ناقصة في الشركة / باقة تجريبية قاربت على الانتهاء.

### 3.9 Onboarding checklist (6 + progress) (FR-023)
Page-scoped `.onboarding`; each item: checkbox (`role="checkbox"`/native `type="checkbox"`), description, CTA
(coming-soon/navigate); a **progress indicator** (CSS proportion bar + `aria-live` "x/6" or %). Items: أضف أول عرض /
أنشئ أول كوبون / فعّل مصدر العروض / اضبط بيانات الشركة / راجع أول طلب حجز / فعّل تنبيهات البريد لاحقًا. Toggle → flip
state + update progress + toast.

### 3.10 Activity feed (≥5) (FR-019)
Page-scoped `.activity` list; each: icon, text, relative time, type/status. Items: Ahmed added a deal / Sara copied a
coupon / new booking request / integration status changed / deal expiring soon — all "بيانات تجريبية".

### 3.11 Empty / loading patterns (FR-024)
Reusable `.skeleton` card/row pattern + `.empty-state` (message + CTA) for recent-bookings/alerts — present, MAY be
hidden by default, for future merchant pages.

---

## 4. Mock-Content Schemas

### 4.1 `assets/data/merchant-dashboard.json` (NEW) — FR-026
Top-level object:

| Key | Type | Notes |
|-----|------|-------|
| `company` | object | `name` (ar), `plan` (e.g., "Growth Plan"), `subscriptionStatus` (ar, mock), `user` {name, role}, `pendingTasksNote` (ar) |
| `kpis` | array (≥8) | each: `key`, `label` (ar), `value`, `trendDirection` (up/down/neutral), `trendValue`, `helperText` (ar), optional `link` |
| `analytics` | object | `bookingInquiriesOverTime` (number[]), `dealClicks` (number[]), `couponCopies` (number[]), `topDestinations` ({label,value}[]), `trafficSources` ({label,value}[]), `deviceBreakdown` ({label,value}[]) |
| `alerts` | array (≥6) | each: `severity` (high/medium/info), `message` (ar), `due` (ar/date), `action` (label + coming-soon/toast) |
| `onboarding` | array (6) | each: `label` (ar), `description` (ar), `done` (bool), `cta` (label + target) |
| `activity` | array (≥5) | each: `icon`, `text` (ar), `time` (ar relative), `type` |
| `notifications` | array | topbar dropdown: each `text` (ar), `time` (ar), `type` |

### 4.2 `assets/data/merchant-bookings-preview.json` (NEW; ≥8 items) — FR-026
| Field | Type | Notes |
|-------|------|-------|
| `reference` | string (ltr) | e.g., `BR-10293` |
| `customerName` | string (ar) | mock name |
| `phone` | string (ltr) | `dir="ltr"` |
| `requestTitle` | string (ar) | deal/request title |
| `destination` | string (ar) | e.g., "دبي" |
| `amount` | number | + `currency` (e.g., "ر.س") |
| `status` | enum | New / Contacted / Pending Payment / Confirmed / Cancelled / Completed |
| `paymentStatus` | enum | Unpaid / Deposit / Paid / Refunded |
| `createdDate` | string | mock date |
| `assignedUser` | string (ar) | mock teammate |

### 4.3 `assets/data/merchant-deals-preview.json` (NEW; ≥5 items) — FR-026
| Field | Type | Notes |
|-------|------|-------|
| `dealId` | string | reuse `deals.json` id (e.g., `deal-003`) where applicable → `../pages/deal-details.html?id=` |
| `title` | string (ar) | deal title |
| `destination` | string (ar) | — |
| `sourceBadge` | enum | Partner / Affiliate / Manual Deal / API Ready |
| `clicks` / `inquiries` / `couponCopies` | number | merchant metrics (mock) |
| `conversionEstimate` | string/number | e.g., "3.2%" (تقديري) |
| `status` | string (ar) | e.g., "نشط" / "قارب على الانتهاء" |

### 4.4 `assets/data/merchant-integrations-preview.json` (NEW; ≥11 items) — FR-026
| Field | Type | Notes |
|-------|------|-------|
| `name` | string | brand (`dir="ltr"` where Latin): Travelpayouts/Booking Affiliate/Expedia Partner/Skyscanner Partner/Amadeus API/Duffel API/Coupon API/Manual Deals/Scraping Review Queue/WhatsApp Notifications/Email Notifications |
| `status` | enum | Connected mock / Not connected / API Ready / Coming soon / Needs configuration / Needs review |
| `description` | string (ar) | short purpose |

### 4.5 Reused data (REFERENCED, UNCHANGED)
- `deals.json` (`deal-001…deal-010`) — top-deal `dealId` → `../pages/deal-details.html?id=`.
- `coupons.json` — coupon identity consistency (if a coupon is referenced).
- `compare-offers.json` — route/compare context (if a compare CTA is used).

> Mock data **references** these by id/link; it does not duplicate or contradict the source data (FR-027/SC-009).

---

## 5. Interaction Map (control → mechanism → result)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Sidebar `الرئيسية` | plain `href="index.html"` (active) | Navigate / stay |
| Sidebar `العودة للموقع` | plain `href="../pages/index.html"` | Navigate |
| Sidebar unbuilt module (8 links) | `data-coming-soon` (existing) | Info toast (no 404) |
| Mobile menu button | `dashboard.js` (`TUI.drawer.open` + scrim) | Open sidebar drawer |
| Drawer scrim / Escape | `dashboard.js`/`TUI.drawer.close` | Close drawer |
| Topbar notifications trigger | `dashboard.js` (`aria-expanded`) | Toggle notifications dropdown (mock list) |
| Topbar quick-add trigger | `dashboard.js` | Toggle quick-add dropdown (add deal/create coupon/add booking — coming-soon items) |
| Topbar user-menu trigger | `dashboard.js` | Toggle user menu (profile/settings → coming-soon; logout) |
| Dropdown outside-click / Escape | `dashboard.js` | Close open dropdown |
| Global search submit/type | `dashboard.js` | "بحث تجريبي" toast / inline mock state |
| Logout (user menu) | `dashboard.js` | Frontend-only toast (+ optional nav → `../pages/index.html`) |
| Welcome CTA إضافة عرض جديد / مراجعة طلبات الحجز / إعداد التكاملات | `data-coming-soon` (existing) | Info toast |
| KPI card link/action | plain `href` (built) or `data-coming-soon` | Navigate / toast |
| Booking row action trigger | `dashboard.js` | Open row action menu |
| Row → view details | `data-coming-soon` | Toast (booking-details unbuilt) |
| Row → change status | `data-modal-open="status-modal"` + `dashboard.js` | Open status-change modal (prefilled reference) |
| Status-change save (valid) | `dashboard.js` → `TUI.validateForm` | Toast + optional in-place status badge update; no real notification |
| Row → add note | `data-modal-open="note-modal"` + `dashboard.js` | Open add-note modal (prefilled reference) |
| Add-note save (valid) | `dashboard.js` → `TUI.validateForm` | Toast + inline success; not persisted |
| Row → contact customer | `dashboard.js`/`data-toast` | Toast (no real message) |
| Row → assign user | `data-modal-open="assign-modal"` or `data-toast` | Modal or toast (mock assignment) |
| Top deal → view public deal | plain `href="../pages/deal-details.html?id=<id>"` | Navigate (invalid id → safe fallback, never broken) |
| Top deal → edit | `data-coming-soon` | Toast (edit-deal unbuilt) |
| Quick action تصفح الموقع العام | plain `href="../pages/index.html"` | Navigate |
| Quick action (others) | `data-coming-soon` | Toast |
| Integration action (إعداد/اختبار/قريبًا) | `data-coming-soon`/`data-toast` | Toast (no real integration) |
| Alert action | `data-coming-soon`/`data-toast` | Toast / navigate (planned) via coming-soon |
| Onboarding item toggle | `dashboard.js` (native checkbox + `aria-live`) | Flip check state + update progress indicator + toast |
| Onboarding item CTA | plain `href` (built) or `data-coming-soon` | Navigate / toast |
| Activity item (if linked) | plain `href` or static | Navigate / inert text |
| Footer link → public site | plain `href="../pages/index.html"` | Navigate |
| Footer year | `data-year` (existing) | Current year |

> New wiring lives in `dashboard.js` (drawer/dropdowns/row-menus/modals/onboarding/search). Coming-soon, modals (open/
> close), toasts, copy, and the year reuse existing `data-*` behaviors; every navigation is a plain link.

---

## 6. Frontend-Only Form Models (not persisted)

All validated via `window.TUI.validateForm`. Nothing is stored/transmitted; no real booking update, notification, or
assignment. The two modal forms are owned by `dashboard.js` (it supplies the success path — toast + optional in-place
update — so they use `data-validate` **without** `data-frontend-form`, research D5/Spec 005 precedent).

### 6.1 Status-change — status modal (`dashboard.js` rules)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| reference | read-only text/hidden | — | (prefilled) |
| newStatus | `.field-select` (the six statuses) | preset | yes |
| note | `.field-textarea` | — | no |
| notifyCustomer | `role="switch"` checkbox | — | no (placeholder) |
Success: toast + MAY update the row's visible status badge; copy states no real notification was sent.

### 6.2 Add-note — note modal (`dashboard.js` rules)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| reference | read-only text/hidden | — | (prefilled) |
| note | `.field-textarea` | non-empty | **yes** |
| noteType | `.field-select` (داخلية/متابعة/مكالمة) | preset | no |
| followUpDate | `.field-input type=date` | — | no |
Success: toast + inline success; not persisted to a backend.

### 6.3 Assign-user (optional) — assign modal (`dashboard.js`)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| assignee | `.field-select` (mock teammates) | preset | yes |
Success: toast (mock assignment). MAY be a toast-only flow instead of a modal.

> The topbar dropdowns, row action menus, onboarding toggles, and the notify-customer/search toggles are **not**
> validated forms — they are `dashboard.js` click/change handlers. No-JS baseline: the dashboard's static content renders
> fully; modals/dropdowns/row-menus are progressive enhancements (their triggers are real buttons that simply do nothing
> harmful without JS), and the onboarding checkboxes toggle natively.

---

## 7. Structured Data (JSON-LD)

| Page | Schemas | Notes |
|------|---------|-------|
| `dashboard/index.html` | `BreadcrumbList` (optional) | `robots noindex` (private merchant app); no real-account/session, live-data, real-booking, real-analytics, or connected-integration assertion |

Rules: exactly one `<h1>` and correct heading order; any structured data describes the frontend-only mock experience
honestly and never asserts a real merchant account, session, live data, booking, analytics, integration, notification,
subscription, or payment (IX; FR-035).

---

## 8. Mock-Data Consistency & Integrity Rules

- Top-deal `dealId`s resolve to existing `deals.json` ids and link to `../pages/deal-details.html?id=`; an invalid/
  missing id renders a safe fallback or is skipped — never a broken page or dead link. (FR-017/FR-027; SC-009)
- Reused deal/coupon source labels stay the four canonical values (Partner / Affiliate / Manual Deal / API Ready) with
  matching `badge-source-*`. (IX)
- `merchant-bookings-preview.json` `status` ∈ {New, Contacted, Pending Payment, Confirmed, Cancelled, Completed};
  `paymentStatus` ∈ {Unpaid, Deposit, Paid, Refunded}. The set MUST spread across several statuses/payment states so
  badges are meaningful. (FR-013)
- `merchant-integrations-preview.json` `status` ∈ {Connected mock, Not connected, API Ready, Coming soon, Needs
  configuration, Needs review}; the set MUST include a spread (e.g., ≥1 "Connected mock", ≥1 "API Ready", ≥1 "Needs
  configuration") and MUST state no integration is really active. (FR-021)
- KPI values, analytics arrays, alerts, onboarding states, activity items, and notifications are internally consistent
  with the rendered overview (e.g., the "new booking requests" KPI is plausible vs the bookings table; the onboarding
  progress matches the default `done` flags). (FR-012/FR-018)
- No field or copy asserts a real merchant account/session, live data, a real booking, real analytics, a connected
  integration, a sent notification, an active API sync, an active scraping queue, a real subscription/billing, or a
  payment; everything is بيانات تجريبية / مثال توضيحي / واجهة أمامية فقط / قابل للربط لاحقًا / حالة تجريبية. (IX; FR-028)
- Latin/numeric values inside Arabic RTL (phones, amounts, references, dates, brand names) render with correct direction
  (`dir="ltr"` where needed) and remain legible. (spec Edge Cases; FR-032)
