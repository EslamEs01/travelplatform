# Phase 1 Data Model: Merchant Analytics + Integrations + Settings

**Feature**: `009-merchant-analytics-integrations-settings` | **Date**: 2026-06-04
**Source**: `spec.md` (FR-001…FR-056, Key Entities), `research.md` (D1–D13). This is the **page/section inventory**, **mock-data schemas**, **interaction map**, and **frontend-only form models** for implementation. There is **no backend data model** — these are static-HTML content shapes mirrored by backend-ready JSON reference catalogs.

---

## 1. Page Inventory

| Page | `data-page` | H1 | Active sidebar | Breadcrumb | Notes |
|---|---|---|---|---|---|
| `dashboard/analytics.html` | `merchant-analytics` | التحليلات | التحليلات | لوحة التحكم / التحليلات | Read-heavy performance workspace |
| `dashboard/integrations.html` | `merchant-integrations` | التكاملات | التكاملات | لوحة التحكم / التكاملات | Configuration workspace |
| `dashboard/settings.html` | `merchant-settings` | الإعدادات | الإعدادات | لوحة التحكم / الإعدادات | Tabbed account workspace |

All three: `<html lang="ar" dir="rtl" data-page="…">`, own `<head>` from `partials/head.html` conventions, `robots noindex`, paths `../assets/…` + `../src/js/{ui,main,dashboard}.js` (defer) + `../pages/…`, single `<h1>`, reuse the Spec 006–007 shell, **no public header/footer**.

### Link-only edits (no content removed)
- `dashboard/index.html` (Spec 006): rewire التحليلات/التكاملات/الإعدادات (sidebar + quick-add + any matching overview CTAs) `data-coming-soon` → real `href`.
- `dashboard/deals.html`, `create-deal.html`, `edit-deal.html`, `coupons.html`, `create-coupon.html` (Spec 007): rewire the same three sidebar links.

### Still-unbuilt (navigation prepared, coming-soon only — NOT created)
`bookings.html`, `booking-details.html`, `customers.html`, `customer-details.html` (intended Spec 008 — absent from repo) and the SaaS-owner admin/billing/support surface keep `data-coming-soon`.

---

## 2. Shared Shell (reused from Spec 006–007 — research D1)

Identical markup across all three pages; only the active item / breadcrumb / page-header vary:
- **Sidebar**: brand; nav links (الرئيسية, العروض, إضافة عرض, الكوبونات, طلبات الحجز*, العملاء*, **التحليلات**, **التكاملات**, **الإعدادات**) — `*` = coming-soon; correct `aria-current="page"`.
- **Topbar**: mobile menu button (opens drawer), breadcrumb/current-area, company switcher placeholder, global search (mock), notifications/quick-add/user dropdowns (`DropdownController`).
- **Mobile drawer + scrim**, **page-header region** (title + description + safe note + CTAs), **dashboard footer** (`data-year`), `#toast-root`.

---

## 3. Section Inventory — `analytics.html` (merchant-analytics)

| # | Section | Key content | Min |
|---|---|---|---|
| 1 | Page header | H1 التحليلات; description; **date-range selector** (6 options + custom from/to + apply); **compare-period toggle**; **export-report** mock; safe note (البيانات هنا تجريبية ولا تمثل تتبعًا مباشرًا) | — |
| 2 | KPI cards | icon + number + label + trend + helper + demo label | **≥10** |
| 3 | Over-time visuals | booking inquiries / deal clicks / coupon copies / conversion estimate — CSS bars/sparkline/progress (no library) | 4 |
| 4 | Traffic sources | Organic/Direct/Social/Referral/Coupon pages/Deal pages/Email mock/WhatsApp mock — visits + % + trend | **≥8** |
| 5 | Device breakdown | mobile/desktop/tablet — % bars | 3 |
| 6 | Top-performing-deals table | title, destination, source badge, views, clicks, inquiries, coupon copies, conversion est., status, action | **≥8 rows** |
| 7 | Top destinations | Dubai/Istanbul/Cairo/Riyadh/Sharm El Sheikh/Paris/Bangkok — visits/clicks/inquiries/trend + CTA | **≥7** |
| 8 | Coupon-performance table | code `dir="ltr"`, provider, category, source badge, copies, usage mock, related deal, expiry, status, action | **≥8 rows** |
| 9 | Customer & booking insights | highest-value segment / most-requested type / avg response time mock / follow-up needs / pending payments / family trend | **≥6** |
| 10 | Recommendations | priority badge + explanation + action button (link or toast) | **≥6** |
| 11 | Export / report mock | export PDF / export CSV / schedule report — toasts (or small modal) | — |
| 12 | Empty + skeleton | analytics empty state + skeleton KPI/chart/table (hidden by default) | — |
| 13 | FAQ | ≥5 Qs (حقيقية؟ / تتبع الآن؟ / Google Analytics لاحقًا؟ / معنى معدل التحويل؟ / تصدير حقيقي لاحقًا؟) | **≥5** |

## 4. Section Inventory — `integrations.html` (merchant-integrations)

| # | Section | Key content | Min |
|---|---|---|---|
| 1 | Page header | H1 التكاملات; description; safe note (لا يتم الاتصال بأي مصدر خارجي في هذه النسخة); CTAs: إضافة تكامل تجريبي / اختبار كل التكاملات تجريبيًا / مراجعة المصادر | — |
| 2 | Overview stats | connected mock / not connected / API ready / needs configuration / needs review / coming soon | 6 |
| 3 | Category tabs/filters | الكل / Affiliate / Travel APIs / Coupons / Scraping Review / Notifications / Manual | 7 |
| 4 | Affiliate cards | Travelpayouts, Booking.com Affiliate, Expedia Partner, Skyscanner Partner, Kiwi/Tequila, Partner Link Template | 6 |
| 5 | Travel API cards | Amadeus, Duffel, Expedia Rapid, Hotelbeds | 4 |
| 6 | Coupon cards | Coupon API, Affiliate Coupon Feed, Manual Coupons, Coupon Import Review | 4 |
| 7 | Scraping/Review cards | Scraping Review Queue, Source URL Monitor, Manual Approval Workflow, Duplicate Coupon Detector, Expiry Validator | 5 |
| 8 | Notification cards | Email, WhatsApp, Dashboard Alerts, Daily Summary, Weekly Reports | 5 |
| 9 | Configure modals | Travelpayouts, Booking, Expedia, Skyscanner, Amadeus, Duffel, Coupon API, Scraping Review Queue, Email, WhatsApp | **≥10** |
| 10 | Activity log | configured / test failed / source added / review required / test sent / disabled / key updated / sync skipped | **≥8** |
| 11 | Health panel | overall health / issues / warnings / review-needed / last mock check | — |
| 12 | FAQ | ≥6 Qs (متصلة فعليًا؟ / Travelpayouts لاحقًا؟ / Amadeus/Duffel؟ / Scraping الآن؟ / WhatsApp/Email؟ / نشر تلقائي؟) | **≥6** |

**Each card** (FR-024): icon, name, category, status badge, short description, credentials-required note, last-sync mock, health/status indicator, enable/disable toggle, Configure button, Test-connection button (+ optional action menu). Status enum: Connected mock / Not connected / API Ready / Coming soon / Needs configuration / Needs review / Disabled.

*Listing-contract note (Constitution VII): a **filter-empty placeholder** handles the zero-match case (FR-022); a **skeleton/loading** state is not required for integrations because all cards are static (no fetch).*

## 5. Section Inventory — `settings.html` (merchant-settings)

| # | Section (tab) | Key content | Min |
|---|---|---|---|
| 0 | Page header | H1 الإعدادات; description; save-all-changes mock; reset mock; safe note (الإعدادات هنا تجريبية ولا يتم حفظها على خادم) | — |
| 0b | Settings nav | بيانات الشركة / الهوية البصرية / تفضيلات الحجز / الإشعارات / الفريق / الأمان / الباقة والاستخدام (tabs/anchors) | 7 |
| 1 | Company Profile | name*, business type, phone*, email* `dir="ltr"`, website `dir="ltr"`, address, country, city, support contact, working hours, license placeholder | validated |
| 2 | Branding | logo + cover mock upload, primary + secondary color pickers, public slug, public-URL preview, brand-preview card, social placeholders (live preview) | — |
| 3 | Booking Preferences | currency, booking mode (Request inquiry/Redirect to partner/Manual confirmation), confirmation message, min-deposit placeholder, cancellation note, refund note, working hours, response-time promise, required-docs checklist (passport/ID/receipt/traveler names/visa) | — |
| 4 | Notification Preferences | ≥9 toggles × Dashboard/Email/WhatsApp channels | **≥9** |
| 5 | Team Members | table: name, email `dir="ltr"`, role, status, last active, permissions summary, actions; invite/change-role/disable-enable/resend/remove | **≥6** |
| 6 | Security | change-password form (current/new/confirm), 2FA placeholder, API-access placeholder, sessions mock list, login-history mock list | — |
| 7 | Plan Usage | ≥7 usage bars (deals/coupons/team/integrations/inquiries/customers/storage) + current plan (Starter/Growth/Pro) + renewal mock + billing note + upgrade CTA (coming-soon) | **≥7** |
| 8 | Public Page Preview | company name, logo placeholder, public slug, support info, CTA | — |
| 9 | Danger Zone | deactivate company / reset settings / delete account — each a custom confirmation modal | 3 |
| 10 | FAQ | ≥6 Qs (حفظ فعلي؟ / تغيير الرابط؟ / إرسال دعوة؟ / ربط واتساب؟ / تغيير كلمة المرور حقيقي؟ / ترقية الآن؟) | **≥6** |

**Modals**: Invite Member, Change Role, Disable/Remove confirmation, Danger-Zone (deactivate/reset/delete) — all custom `TUI.modal`.

---

## 6. Mock-Content Schemas

Full field lists + reuse rules live in `contracts/mock-data.contract.md`. Summary of the **five new** catalogs (backend-ready reference; static HTML is the source of baseline content — III):

### 6.1 `merchant-analytics.json`
`dateRange` (key + label + from/to), `compare` (period + deltas), `kpis[]` (key, labelAr, value, unit, trend{dir,pct}, helperAr), `series{ inquiries[], dealClicks[], couponCopies[], conversion[] }` (each `[{ period, value }]`), `trafficSources[]` (name, visits, pct, trend), `devices[]` (name, pct), `topDeals[]` (dealId→`deals.json`, title, destination, source, views, clicks, inquiries, couponCopies, conversionEst, status), `topDestinations[]` (name, visits, dealClicks, inquiries, trend), `couponPerformance[]` (couponId→`merchant-coupons.json`, code, provider, category, source, copies, usageMock, relatedDealId, expiry, status), `insights[]` (key, labelAr, valueAr), `recommendations[]` (priority, titleAr, explanationAr, action{type:link|toast, href?}).

### 6.2 `merchant-integrations.json`
`stats{ connected, notConnected, apiReady, needsConfig, needsReview, comingSoon }`, `integrations[]` (key, name, category ∈ affiliate|apis|coupons|scraping|notifications|manual, status, descriptionAr, credentialsAr, enabled, lastSyncMock, health ∈ ok|warn|review|off, configFields[] {name, labelAr, type, placeholder?, options?, required?}, warningsAr?), `activity[]` (timeMock, event, severity ∈ info|warn|error). `health{ overall, issues, warnings, reviewNeeded, lastCheckMock }`.

### 6.3 `merchant-settings.json`
`company{ name, businessType, phone, email, website, address, country, city, supportContact, workingHours, license }`, `branding{ primary, secondary, slug, publicUrlBase, socials{} }`, `booking{ currency, mode, confirmationMessage, minDeposit, cancellationNote, refundNote, workingHours, responseTime, requiredDocs[] }`, `notifications[]` (key, labelAr, channels{ dashboard, email, whatsapp }).

### 6.4 `merchant-team.json`
`members[]` (id, name, email, role ∈ Owner|Manager|Agent|Marketing|Support, status ∈ active|invited|disabled, lastActiveMock, permissionsAr) — **≥6**.

### 6.5 `merchant-usage.json`
`plan{ name ∈ Starter|Growth|Pro, renewalMock, billingNoteAr }`, `usage[]` (key, labelAr, used, limit, unit?) — **≥7** (deals, coupons, teamUsers, integrations, bookingInquiries, customers, storage).

### 6.6 Reused data (REFERENCED, UNCHANGED)
`deals.json` / `merchant-deals.json` (deal ids → top-deals rows + `../pages/deal-details.html?id=` + `deals.html`); `merchant-coupons.json` (coupon ids → coupon-performance rows + `coupons.html`); destinations names align with the public destinations set.

---

## 7. Interaction Map (control → mechanism → result)

### 7.1 Shared shell (all three pages)
| Control | Mechanism | Result |
|---|---|---|
| Mobile menu button | `dashboard.js` drawer wiring | Opens drawer + scrim; Esc/scrim closes; focus managed |
| Notifications / quick-add / user | `DropdownController` | Toggles dropdown; outside-click/Esc close; arrow-key nav |
| Global search | mock | Submit → toast (frontend-only) |
| Coming-soon links (bookings/customers/admin/billing) | `data-coming-soon` (main.js) | Toast; no navigation |
| Footer year | `data-year` | Current year |

### 7.2 Analytics (`analytics.html`)
| Control | Mechanism | Result |
|---|---|---|
| Date-range chips (6) | controller | Sets active chip (`aria-pressed`); non-custom → toast "نطاق تجريبي"; metrics stay static |
| نطاق مخصص from/to + apply | controller + validate | Reveals inputs; apply validates from ≤ to → toast; inline message if invalid |
| Compare toggle | controller | Flips visual compare state (`aria-pressed`) + shows delta styling |
| Export report (PDF/CSV/schedule) | controller / modal | Toast(s) — "تصدير تجريبي، لا يتم إنشاء ملف فعلي" |
| Top-deal row action: view public | link | → `../pages/deal-details.html?id=<id>` |
| Top-deal row action: manage | link | → `deals.html` |
| Coupon row: copy code | `copyToClipboard` | Copies + toast; fallback toast if unavailable |
| Coupon row: manage | link | → `coupons.html` |
| Recommendation action | controller | Link to relevant page OR toast |

### 7.3 Integrations (`integrations.html`)
| Control | Mechanism | Result |
|---|---|---|
| Category tab (7) | controller | Sets `aria-selected`; show/hide cards by `data-category`; `aria-live` count updates; الكل = all; 0 matches → `.empty-state` placeholder (no skeleton) |
| Configure (per card) | `data-modal-open` / `TUI.modal` | Opens that integration's modal; focus trapped/restored |
| Modal Save | `validateForm` (required) → toast | "تم حفظ الإعداد (تجريبي) — لا يتم الحفظ على خادم"; no persist/validation |
| Modal Test / card Test / Test-all | controller | Toast "اختبار اتصال تجريبي — لا يتم الاتصال بأي مصدر خارجي"; no network |
| Enable/disable toggle | controller | Flips state + status text; `aria-live` |
| Auto-import / manual-review toggle | controller | Flips state; manual-review surfaces honesty copy |
| Documentation placeholder | `data-coming-soon` / link | Toast or `قابل للربط لاحقًا` |
| Activity action | controller | Toast |
| إضافة تكامل تجريبي / مراجعة المصادر | controller | Toast / scrolls to scraping section |

### 7.4 Settings (`settings.html`)
| Control | Mechanism | Result |
|---|---|---|
| Settings tab (7) | controller | Shows matching panel; sets `aria-selected`/hash; deep-link `#section` on load |
| Save all changes / per-section save | `validateForm` → toast | "حُفظت الإعدادات (تجريبي) — لا يتم الحفظ على خادم" |
| Reset mock | confirm modal → toast | Restores visible defaults + toast |
| Company form submit | `validateForm` (name/phone/email required, email format) | Inline errors / success toast |
| Logo / cover upload | controller | Toast "لا يتم رفع ملفات حقيقية الآن" (+ optional object-URL preview) |
| Primary/secondary color input | controller | Live brand-preview swatch update |
| Public slug input | controller | Live `https://…/<slug>` preview text |
| Booking-prefs controls | controller / validate | Toggles/selects update; validation where applicable |
| Notification toggles (≥9 × 3) | controller | Flip state; `aria-live` |
| Invite member | `data-modal-open` → `validateForm` → toast | Validates name/email/role; toast "دعوة تجريبية — لا يتم إرسال دعوة فعلية" |
| Change role | modal → toast | Validates; toast; MAY update visible role cell |
| Disable/enable, Remove | confirm modal (shared helper / `TUI.modal`) → toast | MAY flip status; "إجراء تجريبي" |
| Resend invite | controller | Toast |
| Change password | `validateForm` (required + min + new=confirm) | Inline errors / success toast "تغيير تجريبي — لا يتم تغيير كلمة المرور" |
| 2FA toggle | controller | Flips placeholder state; "لا يتم تفعيل المصادقة الثنائية فعليًا" |
| Upgrade plan | controller | **Coming-soon** toast (billing not built) |
| Danger zone (deactivate/reset/delete) | confirm modal | On confirm → frontend-only warning toast; no destructive action |

---

## 8. Frontend-Only Form Models (not persisted)

All validated via `window.TUI.validateForm(form, { rules })`; on success → toast; **nothing persists** (reload restores mock defaults). `aria-invalid` + `aria-describedby` on errors.

### 8.1 Company Profile (settings)
Required: `companyName`, `phone`, `email` (email format). Optional: businessType, website (url-ish), address, country, city, supportContact, workingHours, license. `email`/`website` render `dir="ltr"`.

### 8.2 Change Password (security)
Required: `currentPassword`, `newPassword` (min length, e.g. ≥8), `confirmPassword`. Custom rule: `confirmPassword === newPassword` → else inline mismatch error. Success → mock toast (no real change).

### 8.3 Invite Member (team modal)
Required: `inviteName`, `inviteEmail` (email format, `dir="ltr"`), `inviteRole`. Optional: permissions checkboxes, note. Success → toast (no invite sent).

### 8.4 Change Role (team modal)
Required: `newRole`. Optional: permissions, note. Success → toast; MAY update visible role cell + `aria-live`.

### 8.5 Integration Configure modals (integrations)
Required fields per modal as listed in `contracts/integrations-page.contract.md` (e.g., Travelpayouts: Marker ID, API Token). Save → `validateForm` on required → mock toast (no persist, no credential validation). Test → mock toast (no network).

### 8.6 Booking Preferences (settings)
No hard-required fields beyond sensible selects; confirmation message length soft-limit; required-docs checklist is multi-select. Save with the section/all-changes button → toast.

---

## 9. Structured Data (JSON-LD)

Merchant app pages are `robots noindex`; rich SEO JSON-LD is **not required**. A minimal `BreadcrumbList` JSON-LD MAY be included for consistency with other dashboard pages. No `Product`/`Offer`/`FAQPage` schema is needed (internal app surface). Any inline JSON is limited to JSON-LD or a safe `<script type="application/json">` mock block (FR-005).

---

## 10. Mock-Data Consistency & Integrity Rules

1. **Identity reuse**: top-deals rows reference real `deals.json`/`merchant-deals.json` ids (so view-public → `deal-details.html?id=` and manage → `deals.html` are consistent); coupon-performance rows reference real `merchant-coupons.json` ids (codes match `coupons.json`/`merchant-coupons.json`).
2. **Destinations** align with the public destinations set (Dubai/Istanbul/Cairo/Riyadh/Sharm El Sheikh/Paris/Bangkok).
3. **Numbers are believable & internally coherent** (e.g., clicks ≤ views; inquiries ≤ clicks; traffic-source percentages sum ≈ 100%; device percentages sum = 100%; usage `used ≤ limit`).
4. **Static HTML is the source of truth for baseline**; JSON mirrors it as backend-ready reference (no runtime fetch for baseline — III).
5. **Honesty**: every metric/status/credential/test/save/invite/upgrade/delete surface carries approved frontend-only wording; statuses like "Connected mock" never imply a live connection.
6. **No real secrets**: credential fields are empty/placeholder; any shown key is obviously masked/sample (e.g., `tp_********`).
