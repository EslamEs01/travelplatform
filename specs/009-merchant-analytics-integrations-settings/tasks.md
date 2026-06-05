---
description: "Task list for 009-merchant-analytics-integrations-settings"
---

# Tasks: Merchant Analytics + Integrations + Settings (Travel SaaS Platform)

**Input**: Design documents from `specs/009-merchant-analytics-integrations-settings/`
**Prerequisites**: plan.md ✅, spec.md ✅ (5 user stories), research.md ✅ (D1–D13), data-model.md ✅, contracts/ ✅ (analytics-page, integrations-page, settings-page, mock-data)

**Tests**: No automated test suite is requested (per the constitution, QA is the manual per-page "done" checklist + an
automated accessibility/SEO/stack audit). Verification tasks live in the Polish phase. No unit/contract test tasks are
generated.

**Organization**: Tasks are grouped by user story (US1–US5) so each is an independently testable increment. This feature
delivers **three new pages** in `dashboard/` (`analytics.html` / `integrations.html` / `settings.html`) + an **additive
extension** of `src/js/dashboard.js` + **five** mock catalogs + a **link-only** rewire of the Spec 006 `index.html` and
the five Spec 007 pages. US1/US2/US3 build **distinct** HTML files (genuinely file-parallel) but each adds a controller
block to the **shared** `src/js/dashboard.js` (a serialization point). US4 is the cross-shell nav rewire; US5 (honesty +
accessibility) is cross-cutting and is realized in the Polish phase. See the **Shared-file note** below.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — **different files**, no dependency on an incomplete task.
- **[Story]**: US1–US4 (Setup/Foundational/Polish have no story label; US5 is cross-cutting → Polish).
- All paths are under `travel-saas-frontend/` unless noted.

## Conventions for this feature

- All three pages are **standalone static HTML** inside the existing `dashboard/` directory and **reuse the Spec 006–007
  dashboard shell verbatim** (sidebar/topbar/mobile drawer/breadcrumb/page-header/footer) — varying only the active
  sidebar item (`aria-current`), the breadcrumb, and the page header. They author their own `<head>` from the
  `partials/head.html` conventions and do **NOT** inline the public `partials/header.html`/`footer.html`. Paths are
  `../assets/…`, `../src/js/…`, `../pages/…` (research D1).
- Core/default content is **static HTML** (renders without JS): analytics ships KPI cards + all CSS visuals + all tables;
  integrations ships all cards + all modal content; settings ships all seven sections (stacked when JS is off). The
  **existing** `src/js/dashboard.js` is **EXTENDED additively** with 3 new per-page controllers dispatched by `<html
  data-page>` (`merchant-analytics` / `merchant-integrations` / `merchant-settings`) — added to `_DASH_PAGES` + 3
  dispatch lines — reusing the `DropdownController`/row-menu/form-wrapper/**shared confirm-modal helper** primitives; the
  Spec 006 `merchant-dashboard` controller and the five Spec 007 controllers stay **unchanged** (research D2).
- `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, `src/js/member.js`, and
  `partials/header.html`/`footer.html` and the public/member `pages/` MUST remain **unchanged**. The Spec 006
  `dashboard/index.html` and the five Spec 007 pages are edited **links-only** (no section/layout/copy removed).
  `tailwind.config.js` needs **no change** (its `content` globs already include `./dashboard/**/*.html`). Sprite edits
  are **append-only**.
- All chart-like visuals are **pure CSS/HTML — no external chart/table/datagrid library** (research D3/D10). All
  confirmations (configure / invite / change-role / disable-remove / danger-zone) use the existing `.modal`/
  `window.TUI.modal`; the upgrade CTA shows a coming-soon toast — **no `alert()`/`confirm()`/`prompt()`** anywhere
  (research D5/D8/D10). State is **frontend/session-only** (reload restores mock defaults).
- The still-unbuilt **bookings/customers pages** (intended Spec 008 — files absent) and the **SaaS-owner admin/billing/
  support** surface use `data-coming-soon` (toast, no 404; files not created — research D13). Never imply real
  analytics/tracking, API connection, validated key, sync, scraping, coupon import, email/WhatsApp, settings
  persistence, team invitation, password change, 2FA, subscription upgrade, billing, or export (بيانات تجريبية / واجهة
  أمامية فقط / مثال توضيحي / لا يتم الاتصال بأي API الآن / لا يتم حفظ الإعدادات على خادم الآن / قابل للربط لاحقًا /
  اختبار اتصال تجريبي / لا يتم إرسال إشعارات حقيقية / لا يتم تشغيل scraping فعليًا / كل المصادر تحتاج مراجعة قبل النشر).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline and prepare the additive sprite icons the new pages need.

- [X] T001 Verify baseline: run `npm run build` in `travel-saas-frontend/` (regenerates `assets/css/tailwind.css`) and confirm the Spec 001 styleguide/components, the Spec 002 homepage, the Spec 003 pages, the Spec 004 pages, the Spec 005 pages, the Spec 006 `dashboard/index.html`, and the five Spec 007 pages (`deals`/`create-deal`/`edit-deal`/`coupons`/`create-coupon`) render with no console errors and no external CDN requests. Confirm `tailwind.config.js` already includes `./dashboard/**/*.html` (no change needed) (SC-009; research D10).
- [X] T002 [P] Append additive `<symbol>` icons to `assets/icons/sprite.svg` for surfaces the current 53-symbol sprite lacks — `icon-mail`, `icon-whatsapp`, `icon-key`, `icon-lock`, `icon-credit-card`, `icon-palette`, `icon-link`, `icon-activity`, `icon-building`, `icon-award`, `icon-pie-chart`, `icon-map-pin`, `icon-shield` (reuse existing `icon-bar-chart`/`icon-plug`/`icon-settings`/`icon-bell`/`icon-users`/`icon-user-plus`/`icon-trend-up`/`icon-trend-down`/`icon-filter`/`icon-sliders`/`icon-upload`/`icon-download`/`icon-refresh`/`icon-wand`/`icon-percent`/`icon-clock`/`icon-copy`/`icon-eye`/`icon-edit`/`icon-external`/`icon-globe`/`icon-tag`/`icon-ticket`/`icon-calendar`/`icon-shield-check`/`icon-check-circle`/`icon-close`/`icon-search`/`icon-chevron-down`/`icon-more` where they fit). **Append-only** — change no existing symbol (research D12).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The five mock-data catalogs and the additive `dashboard.js` guard/dispatch + shared helper reuse that ALL
three pages depend on.

**⚠️ CRITICAL**: No user-story page work should begin until this phase is complete.

- [X] T003 Create `assets/data/merchant-analytics.json` per the mock-data contract §1 — `dateRange`, `compare`, `kpis[]` (**≥10**: visits, dealClicks, bookingInquiries, couponCopies, conversionEstimate, topDestination, revenueEstimate, averageRequestValue, newCustomers, mostViewedDeals — each labelAr/value/unit/trend/helperAr), `series{inquiries,dealClicks,couponCopies,conversion}` (each ≥6 points), `trafficSources[]` (**≥8**), `devices[]` (3, %=100), `topDeals[]` (**≥8**, `dealId` ∈ `deals.json`/`merchant-deals.json`), `topDestinations[]` (**≥7**: Dubai/Istanbul/Cairo/Riyadh/Sharm El Sheikh/Paris/Bangkok), `couponPerformance[]` (**≥8**, ids ∈ `merchant-coupons.json`, codes match), `insights[]` (**≥6**), `recommendations[]` (**≥6**, action link|toast). Enforce `clicks ≤ views`, `inquiries ≤ clicks`, traffic %≈100; honesty-safe mock (mock-data §1/§6; data-model §6.1/§10).
- [X] T004 [P] Create `assets/data/merchant-integrations.json` per the mock-data contract §2 — `stats{connected,notConnected,apiReady,needsConfig,needsReview,comingSoon}`, `integrations[]` (every named card across the 6 categories from integrations-page.contract §B4: key/name/category/status/descriptionAr/credentialsAr/enabled/lastSyncMock/health/configFields[]/warningsAr — scraping cards carry the no-auto-publish warning), `activity[]` (**≥8** events with severity), `health{overall,issues,warnings,reviewNeeded,lastCheckMock}`. Credential fields empty/placeholder; no real secrets (mock-data §2/§6; data-model §6.2).
- [X] T005 [P] Create `assets/data/merchant-settings.json` per the mock-data contract §3 — `company{name,businessType,phone,email,website,address,country,city,supportContact,workingHours,license}`, `branding{primary,secondary,slug,publicUrlBase,socials{}}`, `booking{currency,mode∈inquiry|redirect|manual,confirmationMessage,minDeposit,cancellationNote,refundNote,workingHours,responseTime,requiredDocs[]}`, `notifications[]` (**≥9**: each key/labelAr/channels{dashboard,email,whatsapp}) (mock-data §3; data-model §6.3).
- [X] T006 [P] Create `assets/data/merchant-team.json` per the mock-data contract §4 — `members[]` (**≥6**: id/name/email/role∈Owner|Manager|Agent|Marketing|Support/status∈active|invited|disabled/lastActiveMock/permissionsAr); spread roles + statuses; emails `dir="ltr"`-safe (mock-data §4; data-model §6.4).
- [X] T007 [P] Create `assets/data/merchant-usage.json` per the mock-data contract §5 — `plan{name∈Starter|Growth|Pro,renewalMock,billingNoteAr}` and `usage[]` (**≥7**: deals/coupons/teamUsers/integrations/bookingInquiries/customers/storage — each used/limit, storage = explicit placeholder); enforce `used ≤ limit` and consistency with the team/deals/coupons shown elsewhere (mock-data §5; data-model §6.5).
- [X] T008 Extend `src/js/dashboard.js` (additive only): add `merchant-analytics`, `merchant-integrations`, `merchant-settings` to the top-level `_DASH_PAGES` guard list and add three `if (_currentPage === …) { init…(); }` dispatch lines + three empty `initMerchantAnalytics()` / `initMerchantIntegrations()` / `initMerchantSettings()` controller stubs, **without altering** the Spec 006 `merchant-dashboard` controller or the five Spec 007 controllers/helpers. Confirm the new controllers can reuse the existing `DropdownController`, the row-action-menu controller, the frontend-only form-submit wrapper, and the **shared confirm-modal helper**. No edits to `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` (research D2; plan Complexity Tracking).

**Checkpoint**: Five catalogs + the `dashboard.js` guard/dispatch skeleton ready — page work can begin (the three HTML
files are file-parallel; the three controllers serialize on `dashboard.js`).

---

## Phase 3: User Story 1 - Understand agency performance from an analytics workspace (Priority: P1) 🎯 MVP

**Goal**: A professional analytics workspace `dashboard/analytics.html` — date-range + compare + export header, **≥10 KPI
cards**, four CSS over-time visuals (no library), traffic (≥8) + device breakdowns, a top-deals table (≥8), a
top-destinations section (≥7), a coupon-performance table (≥8), insight cards (≥6), recommendation cards (≥6), an export
mock, empty/skeleton states, and a FAQ (≥5).

**Independent Test**: Open `dashboard/analytics.html` at 360px and desktop → one `<h1>` التحليلات inside the shell
(التحليلات active, breadcrumb لوحة التحكم / التحليلات); date-range chips change active + custom-range apply toast; compare
toggles; export → toasts; ≥10 KPI cards + 4 CSS visuals + ≥8 traffic sources + device bars; top-deals (≥8) → view-public/
manage; coupon table (≥8) copy-code; ≥6 insights + ≥6 recommendations; tables → cards on mobile; FAQ ≥5; no dead
controls, no browser dialog.

- [X] T009 [US1] Create the `dashboard/analytics.html` scaffold: `<html lang="ar" dir="rtl" data-page="merchant-analytics">`; own `<head>` from the `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo preload, favicon, theme-color, viewport, Arabic `<title>`/meta, `robots noindex`); `.skip-link`, `#main`, `#toast-root`, an `aria-live` announcer; **reuse the Spec 006–007 shell** (sidebar with التحليلات `aria-current="page"` and the التكاملات/الإعدادات links pointing to `integrations.html`/`settings.html`; topbar; mobile drawer + scrim; breadcrumb لوحة التحكم / التحليلات; page-header region; `.dash-footer`); script order `../src/js/ui.js` → `../src/js/main.js` → `../src/js/dashboard.js` (defer); a page-scoped `<style>` placeholder; empty containers for the sections. Do NOT inline the public header/footer (analytics-page.contract §A/§B1; research D1).
- [X] T010 [US1] Build the **page header** + **KPI cards** in `dashboard/analytics.html`: H1 التحليلات + description; a date-range selector (اليوم / آخر 7 أيام / آخر 30 يوم / هذا الشهر / آخر 90 يوم / نطاق مخصص + from/to + apply); a compare-period toggle; an export-report mock button; the safe note (البيانات هنا تجريبية ولا تمثل تتبعًا مباشرًا); and a page-scoped `.kpi-grid` of **≥10** `.card`s (الزيارات / الضغطات على العروض / طلبات الحجز / نسخ الكوبونات / معدل التحويل التقديري / الوجهة الأعلى / الإيراد التقديري / متوسط قيمة الطلب / العملاء الجدد / العروض الأكثر مشاهدة) — each icon + number + label + trend (`icon-trend-up`/`down` + %) + helper + demo label (FR-010/FR-011/FR-012; analytics-page.contract §B1/§B2).
- [X] T011 [US1] Build the **over-time visuals + traffic + device** in `dashboard/analytics.html`: four CSS/HTML chart-like visuals (booking inquiries / deal clicks / coupon copies / conversion estimate) using page-scoped `.chart-bars`/sparkline/progress styles (each bar/point carries an accessible text value — **no chart library**); a traffic-sources list/chart of **≥8** (Organic Search, Direct, Social, Referral, Coupon pages, Deal pages, Email mock, WhatsApp mock — visits + % + trend); and a device breakdown (mobile/desktop/tablet, % bars summing 100) (FR-013/FR-014; analytics-page.contract §B3/§B4/§B5; research D3).
- [X] T012 [US1] Build the **top-deals table**, **top-destinations**, and **coupon-performance table** in `dashboard/analytics.html`: a `<table>` of **≥8 `<tr>`** (deal title / destination / source `.badge-source-*` / views / clicks / inquiries / coupon copies / conversion est. / status `.badge` / action → view-public `../pages/deal-details.html?id=<id>` + manage `deals.html`); a top-destinations section of **≥7** cards/bars (Dubai/Istanbul/Cairo/Riyadh/Sharm El Sheikh/Paris/Bangkok — visits/deal-clicks/inquiries/trend + CTA); and a coupon-performance `<table>` of **≥8 `<tr>`** (code `dir="ltr"` / provider / category / source badge / copies / usage mock / related deal / expiry / status / action → copy-code + manage `coupons.html`); author the page-scoped `.dash-table` (table → stacked labeled cards below md) (FR-015/FR-016/FR-017; analytics-page.contract §B6/§B7/§B8; research D4).
- [X] T013 [US1] Build the **insights**, **recommendations**, **export mock**, **empty/skeleton**, and **FAQ** in `dashboard/analytics.html`: **≥6** insight `.card`s (highest-value segment / most-requested type / avg response time mock / follow-up needs / pending payments / family travel trend); **≥6** recommendation `.card`s (priority badge + explanation + action button → relevant page or toast); an export/report mock (PDF / CSV / schedule → `data-toast` or a small `.modal`); a hidden analytics `.empty-state` + a `.skeleton` KPI/chart/table pattern; and a `<details>` FAQ of **≥5** (هل التحليلات حقيقية؟ / هل يتم تتبع الزوار الآن؟ / هل يمكن ربط Google Analytics لاحقًا؟ / ما معنى معدل التحويل التقديري؟ / هل يمكن تصدير تقارير حقيقية لاحقًا؟) (FR-018/FR-019; analytics-page.contract §B9–B13).
- [X] T014 [US1] Implement the **`merchant-analytics` controller** in `src/js/dashboard.js`: date-range chip click → set active (`aria-pressed`) + non-custom toast (metrics stay static); نطاق مخصص → reveal from/to + apply, validate `from ≤ to` → toast (inline/toast message if invalid); compare toggle → flip visual state; export PDF/CSV/schedule → `data-toast` ("تصدير تجريبي — لا يتم إنشاء ملف فعلي"); coupon-row copy-code → `copyToClipboard` + toast (graceful fallback); recommendation action → link or toast. No browser dialogs; session-only (FR-011/FR-019; analytics-page.contract §C; research D3).

**Checkpoint**: The analytics workspace renders and all its interactions work — the MVP, independently testable.

---

## Phase 4: User Story 2 - Prepare future data & monetization sources from an integrations workspace (Priority: P1)

**Goal**: A configuration workspace `dashboard/integrations.html` — header (3 CTAs + no-connection note), 6 overview
stats, 7 category tabs, integration cards across all categories, **≥10 configure modals**, an activity log (≥8), a health
panel, and a FAQ (≥6) — with prominent scraping/review honesty.

**Independent Test**: Open `dashboard/integrations.html` at 360px and desktop → one `<h1>` التكاملات (التكاملات active,
breadcrumb لوحة التحكم / التكاملات); category tabs filter the cards + update the `aria-live` count; each card has status/
toggle/configure/test; the ≥10 configure modals open and Save/Test show frontend-only toasts; toggles flip state;
test-all → toast; scraping honesty copy present; activity log ≥8; health panel; FAQ ≥6; no real call, no dead control, no
browser dialog.

- [X] T015 [P] [US2] Create the `dashboard/integrations.html` scaffold + **page header** + **overview stats** + **category tabs**: `<html … data-page="merchant-integrations">`; own `<head>` (`robots noindex`); **reuse the Spec 006–007 shell** (sidebar التكاملات `aria-current`; breadcrumb لوحة التحكم / التكاملات); script order (defer); page-scoped `<style>` placeholder; H1 التكاملات + description + safe note (لا يتم الاتصال بأي مصدر خارجي في هذه النسخة) + CTAs إضافة تكامل تجريبي / اختبار كل التكاملات تجريبيًا / مراجعة المصادر; a 6-tile overview-stats row (connected mock / not connected / API ready / needs configuration / needs review / coming soon); and the 7 category tabs (`role="tab"` + `aria-selected`: الكل / Affiliate / Travel APIs / Coupons / Scraping Review / Notifications / Manual) (FR-020/FR-021/FR-022; integrations-page.contract §A/§B1–B3).
- [X] T016 [US2] Build the **integration cards** across all six categories in `dashboard/integrations.html` (page-scoped `.integration-grid`): Affiliate (Travelpayouts, Booking.com Affiliate, Expedia Partner, Skyscanner Partner, Kiwi/Tequila, Partner Link Template); Travel APIs (Amadeus, Duffel, Expedia Rapid, Hotelbeds); Coupons (Coupon API, Affiliate Coupon Feed, Manual Coupons, Coupon Import Review); Scraping/Review (Scraping Review Queue, Source URL Monitor, Manual Approval Workflow, Duplicate Coupon Detector, Expiry Validator); Notifications (Email, WhatsApp, Dashboard Alerts, Daily Summary, Weekly Reports). **Each card**: icon, name, category, status `.badge` (Connected mock / Not connected / API Ready / Coming soon / Needs configuration / Needs review / Disabled), short description, credentials-required note, last-sync mock, health dot, enable/disable toggle, Configure button (`data-modal-open="cfg-<key>"`), Test-connection button, optional action menu; carry `data-category`. The Scraping cards carry the no-scrape / no-auto-publish / manual-review honesty copy. Also add a hidden filter-empty `.empty-state` placeholder (shown when a selected category matches 0 cards — no skeleton needed, the cards are static) (FR-022/FR-023/FR-024/FR-027; integrations-page.contract §B4/§B8/§E; research D6).
- [X] T017 [US2] Build the **≥10 configure modals** + **activity log** + **health panel** + **FAQ** in `dashboard/integrations.html`: pre-authored static `.modal`s (`[data-modal="cfg-<key>"]`) for Travelpayouts (Marker ID, API Token, currency, language, products Flights/Hotels/Tours/Insurance/Car rental, tracking parameter, Save, Test), Booking, Expedia, Skyscanner, Amadeus (env Test/Production-disabled), Duffel, Coupon API (auto-import + manual-review toggles), Scraping Review Queue (source name/URL, crawl-frequency, manual-review + duplicate-check + expiry-validation toggles, notes, status + **warning** لا يتم نشر أي كوبون أو عرض مجمّع تلقائيًا قبل المراجعة), Email, WhatsApp — each with the fields from integrations-page.contract §C + Save/Test buttons; an **activity log** of **≥8** events (configured / test failed / source added / review required / test sent / disabled / key updated / sync skipped); a **health panel** (overall / issues / warnings / review-needed / last mock check); and a `<details>` FAQ of **≥6** (متصلة فعليًا؟ / Travelpayouts لاحقًا؟ / Amadeus|Duffel؟ / Scraping الآن؟ / WhatsApp|Email؟ / نشر تلقائي؟) (FR-025/FR-027/FR-028; integrations-page.contract §C/§B5–B7).
- [X] T018 [US2] Implement the **`merchant-integrations` controller** in `src/js/dashboard.js`: category tab → `aria-selected` + show/hide cards by `data-category` (الكل = all) + `aria-live` visible count, revealing the filter-empty `.empty-state` placeholder when 0 cards match (no blank region); Configure → open the matching `.modal` (`TUI.modal`, focus managed); modal Save → `validateForm` on required → toast (تم حفظ الإعداد تجريبي — لا يتم الحفظ على خادم; no persist/validation); Test / card Test / اختبار كل التكاملات تجريبيًا / test-email / test-message → toast (اختبار اتصال تجريبي — لا يتم الاتصال بأي مصدر خارجي; no network); enable/disable + auto-import + manual-review toggles → flip state + status text + `aria-live`, guarding rapid toggling so the visual state stays consistent without stacking duplicate toasts; activity action / إضافة تكامل تجريبي → toast; مراجعة المصادر → scroll/focus the scraping section; documentation placeholder → toast/`قابل للربط لاحقًا`. No browser dialogs; no real calls (FR-022/FR-026; integrations-page.contract §D; research D5).

**Checkpoint**: The integrations workspace filters, configures, tests, and toggles — all frontend-only — independently testable.

---

## Phase 5: User Story 3 - Configure the company and account from a settings workspace (Priority: P1)

**Goal**: A tabbed account workspace `dashboard/settings.html` — 7-section nav (company / branding / booking /
notifications / team / security / plan-usage), validated forms, branding live preview, mock save/upload, a team table
(≥6) with invite/role/disable-remove modals, security placeholders, plan usage (≥7) + upgrade→coming-soon, a public-page
preview, a danger zone, and a FAQ (≥6).

**Independent Test**: Open `dashboard/settings.html` at 360px and desktop → one `<h1>` الإعدادات (الإعدادات active,
breadcrumb لوحة التحكم / الإعدادات); the 7 tabs switch sections (+ `#section` deep link); company/booking/password forms
validate; color + slug live preview; upload → mock toast; ≥9 notification toggles × 3 channels; team (≥6) invite/role/
disable-remove modals; change-password (new=confirm) → mock toast; ≥7 usage bars + upgrade → coming-soon toast; danger
zone → custom confirm modals; FAQ ≥6; no dead controls, no browser dialog.

- [X] T019 [P] [US3] Create the `dashboard/settings.html` scaffold + **page header** + **settings nav**: `<html … data-page="merchant-settings">`; own `<head>` (`robots noindex`); **reuse the Spec 006–007 shell** (sidebar الإعدادات `aria-current`; breadcrumb لوحة التحكم / الإعدادات); script order (defer); page-scoped `<style>` placeholder; H1 الإعدادات + description + `حفظ كل التغييرات` (mock) + `إعادة التعيين` (mock) + safe note (الإعدادات هنا تجريبية ولا يتم حفظها على خادم); and a 7-item settings navigation (`role="tablist"` or anchors: بيانات الشركة / الهوية البصرية / تفضيلات الحجز / الإشعارات / الفريق / الأمان / الباقة والاستخدام, each section with a stable `id`) (FR-030/FR-031; settings-page.contract §A/§B).
- [X] T020 [US3] Build settings **sections 1–3** in `dashboard/settings.html`: **Company Profile** form (company name* / business type / phone* / email* `dir="ltr"` / website `dir="ltr"` / address / country / city / support contact / working hours / license placeholder) with `.field*` + required markers; **Branding** (mock logo + cover upload buttons; primary + secondary color `<input type="color">`; public slug input + public-URL preview text; a brand-preview `.card`; social-link placeholders); **Booking Preferences** (default currency; booking mode Request inquiry/Redirect to partner/Manual confirmation; confirmation message; min-deposit placeholder; cancellation note; refund note; working hours; response-time promise; required-documents checklist passport/ID/receipt/traveler names/visa) (FR-032/FR-033/FR-034; settings-page.contract §B1–B3).
- [X] T021 [US3] Build settings **sections 4–7** in `dashboard/settings.html`: **Notification Preferences** (**≥9** toggles — new booking inquiry / booking status changes / coupon copied / deal expiring soon / integration failed / daily summary / weekly analytics / payment pending mock / customer follow-up — across Dashboard / Email / WhatsApp channels); **Team Members** table (**≥6**: name / email `dir="ltr"` / role / status `.badge` / last active / permissions summary / actions menu) + an invite-member CTA; **Security** (change-password form current/new/confirm; 2FA placeholder toggle; API-access placeholder card; sessions mock list; login-history mock list — all marked no-real-session/placeholder); **Plan Usage** (page-scoped `.usage-bar` × **≥7**: deals/coupons/team users/integrations/booking inquiries/customers/storage placeholder; current plan Starter/Growth/Pro; renewal mock; billing note; upgrade CTA) (FR-035/FR-036/FR-038/FR-039; settings-page.contract §B4–B7).
- [X] T022 [US3] Build the **Public Page Preview**, **Danger Zone**, **modals**, and **FAQ** in `dashboard/settings.html`: a public-page preview `.card` (company name / logo placeholder / public slug / support info / CTA to `../pages/index.html` or coming-soon); a **Danger Zone** (deactivate company / reset settings / delete account); the **Invite Member** `.modal` (name / email* `dir="ltr"` / role / permissions checkboxes / note), the **Change Role** `.modal` (member / new role* / permissions / note), the **Disable/Remove** confirmation `.modal`, and the **Danger-Zone** confirmation `.modal`(s); and a `<details>` FAQ of **≥6** (حفظ فعلي؟ / تغيير الرابط؟ / إرسال دعوة؟ / ربط واتساب؟ / تغيير كلمة المرور حقيقي؟ / ترقية الآن؟) (FR-037/FR-039/FR-040; settings-page.contract §B/§C).
- [X] T023 [US3] Implement the **`merchant-settings` controller** in `src/js/dashboard.js`: tab click → show matching panel + set `aria-selected`/hash + honor a `#section` deep link on load; save-all / per-section save → `validateForm` (where forms exist) → toast (حُفظت الإعدادات تجريبي — لا يتم الحفظ على خادم); reset → confirm modal → toast; company form → `validateForm` (name/phone/email required + email format); logo/cover upload → toast (لا يتم رفع ملفات حقيقية الآن; optional object-URL preview); primary/secondary color + public-slug inputs → live brand-preview / public-URL update; notification toggles (≥9 × 3) → flip + `aria-live`; invite → modal + `validateForm` → toast (دعوة تجريبية — لا يتم إرسال دعوة فعلية); change-role → modal → toast (MAY update the visible cell); disable/enable + remove → confirm modal → toast; resend → toast; change-password → `validateForm` (current/new/confirm required + new ≥8 + **new = confirm**) → toast (تغيير تجريبي — لا يتم تغيير كلمة المرور); 2FA → flip placeholder state; upgrade → **coming-soon** toast; danger-zone (deactivate/reset/delete) → confirm modal → frontend-only warning toast (no destructive action). Reuse the shared confirm-modal helper / `TUI.modal`; no browser dialogs (FR-031/FR-032/FR-037/FR-038/FR-039; settings-page.contract §D; research D7/D8/D9/D10).

**Checkpoint**: The settings workspace — tabs, validated forms, previews, team/security/plan, and danger zone — works frontend-only; independently testable.

---

## Phase 6: User Story 4 - Complete and honest dashboard navigation (Priority: P2)

**Goal**: Rewire (links only) the three now-built entries across the existing shell so they navigate for real, while
bookings/customers (absent Spec 008) and the SaaS-owner admin/billing/support surface stay coming-soon (no 404). No
existing section/layout/copy is removed.

**Independent Test**: From `dashboard/index.html` and each Spec 007 page, the sidebar/topbar/quick-add التحليلات/التكاملات/
الإعدادات entries navigate to the real pages with correct active state; bookings/customers + admin/billing entries show a
coming-soon toast and never 404; no Spec 006/007 section was removed.

- [X] T024 [US4] Rewire (links only) the shared dashboard shell in `dashboard/index.html`: change التحليلات (`data-coming-soon` → `href="analytics.html"`), التكاملات (→ `href="integrations.html"`), الإعدادات (→ `href="settings.html"`) in the sidebar; rewire any topbar quick-add and any Spec 006 overview CTAs that target analytics/integrations/settings (e.g., integration-readiness "إعداد التكاملات", analytics-preview, settings/company links) → real `href`s. **Remove no section/layout/copy**; keep طلبات الحجز/العملاء (bookings/customers) and any SaaS-owner admin/billing entries on `data-coming-soon` (FR-050/FR-051; research D13).
- [X] T025 [US4] Rewire (links only) the same three sidebar entries (التحليلات → `analytics.html`, التكاملات → `integrations.html`, الإعدادات → `settings.html`) across the five Spec 007 pages — `dashboard/deals.html`, `dashboard/create-deal.html`, `dashboard/edit-deal.html`, `dashboard/coupons.html`, `dashboard/create-coupon.html` — leaving their content/layout/copy untouched; verify each new page (analytics/integrations/settings) marks its own item `aria-current="page"`, and that bookings/customers + admin/billing remain `data-coming-soon` (no 404) across every shell instance (FR-050/FR-051; research D13).

**Checkpoint**: Every dashboard page reaches the three new modules for real; nothing dead, nothing 404s — independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns (QA gate — delivers US5)

**Purpose**: Realize **US5** (honest, frontend-only, accessible) — accessibility/responsive/honesty/SEO passes across all
three pages, the hard stack gate, non-regression (incl. Spec 006/007), and the QA artifact.

- [X] T026 [P] **Accessibility pass** (US5) on the three pages + `src/js/dashboard.js`: keyboard operability + visible focus for every control (date-range chips/compare/export, category tabs, configure modals with managed focus + Escape, every enable/auto-import/manual-review/notification/2FA toggle, copy controls, settings tabs, every form field, invite/change-role/disable-remove/danger-zone modals, upgrade); `aria-current` on the active nav; `aria-selected`/`aria-expanded`/`aria-controls` on tabs/menus; `aria-invalid`/`aria-describedby` on invalid fields; `aria-pressed`/`aria-checked` on toggles; `aria-live` for the date-range/compare/category-count/toggle/role/status announcements; `aria-label` on icon-only buttons; reduced-motion respected; rapid toggling (enable/disable, auto-import, manual-review, notifications, 2FA) keeps a consistent state and announces via `aria-live` without piling up duplicate toasts. Run axe per page → 0 AA violations (FR-054; SC-006; spec Edge Cases).
- [X] T027 [P] **Responsive pass** (US5): verify each of the three pages at 360px has no horizontal scroll (sidebar→drawer, topbar usable, KPI grid + chart visuals + integration card grid + settings forms reflow to one column, the analytics tables + team table → stacked labeled cards, category tabs + settings tabs scroll/wrap, touch targets ≥ ~44px), and that flipping to `dir="ltr" lang="en"` mirrors the shell/grids/cards/tabs/forms with no structural breakage (FR-053; SC-002).
- [X] T028 [P] **Honesty/copy audit** (US5) of the three pages + the five JSON catalogs: every page surfaces its required safe note; coupon codes + emails are `dir="ltr"`; no copy claims real analytics/tracking, API connection, validated key, sync, scraping, coupon import, email/WhatsApp sending, settings persistence, team invitation, password change, 2FA, subscription upgrade, billing, or export; the scraping cards + the Scraping Review Queue modal + the integrations FAQ all state no-scrape / no-auto-publish / manual-review; statuses like "Connected mock"/"API Ready" never imply a live connection; no real secrets in credential fields (FR-055; SC-007; mock-data §6).
- [X] T029 [P] **SEO/semantics pass** (US5) on the three pages: exactly one `<h1>` each (التحليلات / التكاملات / الإعدادات), correct heading hierarchy, the Arabic `<title>`/meta description, the dashboard breadcrumb, `robots noindex`; any optional `BreadcrumbList` JSON-LD is valid and consistent with the visible mock content (data-model §9).
- [X] T030 [P] **Stack-compliance hard gate**: `grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" --include=*.html --include=*.js --include=*.css . | grep -v node_modules` returns no matches; `grep -RInE "chart\.js|chartjs|apexcharts|highcharts|echarts|d3\.|recharts|plotly|datatables|ag-grid|tabulator" dashboard/analytics.html dashboard/integrations.html dashboard/settings.html src/js/dashboard.js` returns no matches; the external-CDN grep over the three pages returns no matches; `npm run build` regenerates cleanly; `npx html-validate dashboard/analytics.html dashboard/integrations.html dashboard/settings.html` → 0 errors; `npx prettier --check "src/js/dashboard.js" "dashboard/analytics.html" "dashboard/integrations.html" "dashboard/settings.html"`; zero external CDN requests and zero console errors on all three pages (FR-056; SC-008; quickstart §3).
- [X] T031 Confirm **non-regression**: `git diff` shows `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, `src/js/member.js`, `partials/header.html`, `partials/footer.html`, and the public/member `pages/` are unchanged; the Spec 006 `merchant-dashboard` controller and the five Spec 007 controllers in `dashboard.js` are unchanged; `assets/icons/sprite.svg` edits are append-only; `tailwind.config.js` is unchanged; the `dashboard/index.html` + five Spec 007 page edits are **links-only** (sections/layout/copy preserved); the Spec 001 styleguide/components, Spec 002 homepage, Spec 003/004/005 pages, the Spec 006 overview, and the Spec 007 deals/coupons pages still render with no console errors (FR-005; SC-009).
- [X] T032 Produce `specs/009-merchant-analytics-integrations-settings/qa-results.md` documenting every gate result: `npm run build` pass; `html-validate` of all three pages pass; the forbidden-tech + chart/table + CDN greps = 0; zero external CDN; zero console errors; **no-JS baseline** (core content renders with JavaScript disabled — FR-004) and **session-only state** (reload restores mock defaults — FR-007); 360px no-overflow; RTL correct + LTR structural integrity; one `<h1>` + heading hierarchy per page; dashboard relative paths work from `/dashboard/`; shell consistency with Spec 006–007 + correct sidebar active states; mobile drawer + topbar dropdowns; analytics date-range/compare/export + coupon copy + CSS visuals (no library); integrations category filter + configure modals + Save/Test mock toasts + toggles + scraping honesty; settings tabs + form validation + upload/color/slug previews + notification toggles + invite/change-role/disable-remove + change-password + 2FA + upgrade coming-soon + danger-zone confirmations; nav rewiring complete (bookings/customers + admin coming-soon, no 404); non-regression of Specs 001–007; and honesty of copy (SC-001–SC-011).

**Checkpoint**: All constitution/QA gates green; the three pages are client-presentable and ship with `qa-results.md` — the merchant dashboard is complete.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: T001 first (baseline). T002 (sprite) is `[P]` (distinct file).
- **Foundational (Phase 2)**: depends on Setup. T003 then T004 ∥ T005 ∥ T006 ∥ T007 are `[P]` (five distinct JSON files);
  T008 (`dashboard.js` guard/dispatch skeleton) is its own edit. **Blocks all user stories.**
- **User Stories (Phases 3–5)**: all depend on Foundational. US1/US2/US3 build **distinct HTML files** → their page
  tasks are file-parallel with each other; but every story's **`dashboard.js` controller task** (T014, T018, T023) edits
  the one shared module → serialize those (see Shared-file note).
- **US4 (Phase 6)**: depends on the three new pages existing (so links don't 404) → run after US1–US3. T024 (`index.html`)
  ∥ T025 (five Spec 007 pages) are different files but both link-only.
- **Polish (Phase 7)**: depends on all pages + nav. T026–T030 are `[P]` (independent audits/localized fixes); T031
  (non-regression) and T032 (qa-results) come last.

### User-story dependencies

- **US1 (P1)** — depends only on Foundational. Independently testable (the analytics workspace). 🎯 MVP.
- **US2 (P1)** — depends only on Foundational; independent of the others (its own file `integrations.html`).
- **US3 (P1)** — depends only on Foundational; independent of the others (its own file `settings.html`).
- **US4 (P2)** — depends on US1–US3 (rewires links to the now-built pages); independently testable (nav).
- **US5 (P3)** — cross-cutting; realized in Polish (Phase 7) across all three pages.

### Shared-file note (serialization points)

- **`src/js/dashboard.js`** is extended by T008 (guard/dispatch skeleton) then by the three controller tasks T014
  (analytics), T018 (integrations), T023 (settings) → different blocks of **one** file → keep them **sequential** (not
  `[P]` with each other) or coordinate merges per block. The Spec 006 `merchant-dashboard` controller and the five Spec
  007 controllers are never touched.
- **`dashboard/analytics.html`** is authored by T009 (scaffold) then T010–T013 → different regions of **one** file →
  sequential. Same for `integrations.html` (T015 → T016–T017) and `settings.html` (T019 → T020–T022).
- **`dashboard/index.html`** is edited once (T024, links only); the five Spec 007 pages once (T025, links only).
- The **three pages** + the **five catalogs** + **sprite** are distinct files → genuinely parallel where marked `[P]`.

### Parallel opportunities

- Setup: T002 ∥ (after) T001.
- Foundational: T003 → T004 ∥ T005 ∥ T006 ∥ T007; then T008.
- Page scaffolds across stories: T009 (analytics) ∥ T015 (integrations) ∥ T019 (settings) — distinct files (their
  `dashboard.js` controller tasks T014 → T018 → T023 still serialize).
- US4: T024 ∥ T025 (distinct files).
- Polish: T026 ∥ T027 ∥ T028 ∥ T029 ∥ T030, then T031 → T032.

---

## Parallel Example: page scaffolds (after Foundational)

```bash
# Distinct HTML files — safe to scaffold + build in parallel:
Dev A → dashboard/analytics.html     (T009 → T010–T013)   # US1 analytics
Dev B → dashboard/integrations.html  (T015 → T016–T017)   # US2 integrations
Dev C → dashboard/settings.html      (T019 → T020–T022)   # US3 settings
# Then one owner adds each page's controller block to the shared src/js/dashboard.js
# in sequence: T014 → T018 → T023.
# Finally one owner does the link-only rewire: T024 (index.html) ∥ T025 (5 Spec 007 pages).
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational (CRITICAL — blocks all stories).
2. Phase 3 US1 (the analytics workspace: header + date-range + ≥10 KPIs + 4 CSS visuals + traffic/device + top-deals/
   destinations/coupon tables + insights + recommendations + export + empty/skeleton + FAQ + the controller).
3. **STOP & VALIDATE**: date-range/compare/export act; visuals render with no library; tables → cards at 360px; copy-code
   works; no dead controls.
4. Demo the MVP (the agency analytics workspace).

### Incremental delivery

1. Setup + Foundational → five catalogs + `dashboard.js` skeleton ready.
2. US1 (analytics) → test → demo (MVP).
3. US2 (integrations) → test → demo (the SaaS data/monetization-readiness story).
4. US3 (settings) → test → demo (company/account control).
5. US4 (nav rewiring) → test → demo (the merchant dashboard is navigationally complete).
6. Polish/QA gate (delivers US5) + `qa-results.md` → ship the three client-presentable pages.

### Parallel team strategy

1. Team completes Setup + Foundational together (five catalogs + `dashboard.js` skeleton).
2. Split the three pages across developers (distinct HTML files — see Parallel Example); one owner serialises the
   per-page controller blocks into the shared `src/js/dashboard.js` (T014 → T018 → T023).
3. One owner does the link-only rewire (T024 ∥ T025) once the three pages exist.
4. Reviewers pick up the `[P]` Polish audits as each page lands; finish with non-regression + `qa-results.md`.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task. `[Story]` maps a task to its user story.
- This feature delivers **three pages** + an **additive extension** of one module; the per-page controller tasks all edit
  the shared `dashboard.js` (serialize), while the three HTML files are distinct (parallel) — see the Shared-file note.
- Reuse existing components/utilities + the **Spec 006–007 shell**; do **not** modify `main.js`/`ui.js`/`discovery.js`/
  `content.js`/`member.js`, `partials/header.html`/`footer.html`, `pages/`, the Spec 006 `merchant-dashboard` controller,
  or the five Spec 007 controllers; do not remove any Spec 006/007 section (rewire links only); introduce no new visual
  identity (only a small page-scoped `<style>` per page) and **no chart/table library**; make **no `tailwind.config.js`
  change**.
- All confirmations use `.modal`/`TUI.modal`; the upgrade CTA shows a coming-soon toast — no `alert()`/`confirm()`/
  `prompt()`. The still-unbuilt bookings/customers (absent Spec 008) + SaaS-owner admin/billing use `data-coming-soon`
  (no 404; files not created). State is frontend/session-only; keep mock data believable and consistent (reuse
  `deals.json`/`merchant-deals.json`/`merchant-coupons.json` ids); never imply real analytics, connection, validation,
  sync, scraping, sending, persistence, invitation, password change, 2FA, upgrade, billing, or export.
- Commit after each task or logical group. Stop at any checkpoint to validate a story independently.
