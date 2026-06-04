---
description: "Task list for 006-merchant-dashboard-shell"
---

# Tasks: Merchant Dashboard Shell + Overview (Travel SaaS Platform)

**Input**: Design documents from `specs/006-merchant-dashboard-shell/`
**Prerequisites**: plan.md ✅, spec.md ✅ (5 user stories), research.md ✅ (D1–D11), data-model.md ✅, contracts/ ✅ (dashboard-page, mock-data)

**Tests**: No automated test suite is requested (per the constitution, QA is the manual per-page "done" checklist +
an automated accessibility/SEO/stack audit). Verification tasks live in the Polish phase. No unit/contract test tasks
are generated.

**Organization**: Tasks are grouped by user story (US1–US5) so each is an independently testable increment. Note this
feature delivers **one page** (`dashboard/index.html`) plus one module (`src/js/dashboard.js`): the user-story phases
build distinct **sections/behaviors** of those two shared files — see the **Shared-file note (serialization point)**
below.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — **different files**, no dependency on an incomplete task.
- **[Story]**: US1–US5 (Setup/Foundational/Polish have no story label).
- All paths are under `travel-saas-frontend/` unless noted.

## Conventions for this feature

- The dashboard is **standalone static HTML** in a **new `dashboard/` directory** (sibling of `pages/`); it uses its
  **own app shell** (sidebar/topbar/drawer/breadcrumb/page-header/footer) and does **NOT** inline the public
  `partials/header.html`/`footer.html`. It authors its own `<head>` from the `partials/head.html` conventions. Paths are
  `../assets/…`, `../src/js/…`, `../pages/…` (research D1/D2).
- Core/default content is **static HTML** (renders without JS). The new module `src/js/dashboard.js` only *enhances*
  (sidebar/drawer toggle + scrim, topbar dropdowns, table row action menus, status-change + add-note modals, onboarding
  toggle + progress, contact/assign/quick-action/integration toasts, search mock). It is loaded only by the dashboard,
  dispatched by `<html data-page="merchant-dashboard">` (research D5).
- `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, `src/js/member.js`, and
  `partials/header.html`/`footer.html` and the public/member `pages/` MUST remain **unchanged**. The only shared-asset
  touches are additive: `dashboard.js`, the four JSON catalogs, append-only sprite icons, and the one-line Tailwind
  content-glob (`./dashboard/**/*.html`).
- Confirmations (status-change, add-note, assign-user) use the existing `.modal` / `window.TUI.modal` — **no
  `alert()`/`confirm()`/`prompt()`** anywhere (research D10). Unbuilt merchant modules use `data-coming-soon` (toast, no
  404; files not created — research D9).
- Charts are **CSS/HTML only** — no external chart library/canvas/CDN (research D6). State is **frontend/session-only**
  (reload restores mock defaults). Reuse source badges Partner/Affiliate/Manual Deal/API Ready; never imply a real
  merchant account/session/live-data/booking/analytics/integration/notification/subscription/payment (بيانات تجريبية /
  واجهة أمامية فقط / قابل للربط لاحقًا).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline and prepare the build/asset scaffolding for the new `dashboard/` surface.

- [X] T001 Verify baseline: run `npm run build` in `travel-saas-frontend/` (regenerates `assets/css/tailwind.css`) and confirm the Spec 001 styleguide/components, the Spec 002 homepage, the Spec 003 pages (`deals`/`deal-details`/`compare`/`coupons`), the Spec 004 pages (`destinations`/`destination-details`/`blog`/`article`), and the Spec 005 pages (`login`/`register`/`saved-deals`/`price-alerts`/`profile`) render with no console errors and no external CDN requests (SC-017).
- [X] T002 [P] Add `./dashboard/**/*.html` to the `content` array in `travel-saas-frontend/tailwind.config.js` (additive only — no token/theme change) so the build scans the new directory, then re-run `npm run build` to confirm the config is valid (research D1; FR-004).
- [X] T003 [P] Append additive `<symbol>` icons to `assets/icons/sprite.svg` for the dashboard nav/topbar/row-actions the current sprite lacks — e.g., `icon-grid`, `icon-tag`, `icon-plus`, `icon-ticket`, `icon-calendar`, `icon-users`, `icon-bar-chart`, `icon-plug`, `icon-settings`, `icon-external`, `icon-bell`, `icon-more`, `icon-logout`, `icon-trend-up`, `icon-trend-down` (reuse existing `icon-search`/`icon-menu`/`icon-close`/`icon-chevron-down`/`icon-copy`/`icon-phone`/`icon-info`/`icon-check-circle`/`icon-alert-triangle`/`icon-location`/`icon-star` where they fit). **Append-only** — change no existing symbol (research D8; C8.1).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The four mock-data catalogs, the `dashboard.js` module skeleton, and the bare `dashboard/index.html` page
scaffold that ALL overview sections depend on.

**⚠️ CRITICAL**: No user-story section work should begin until this phase is complete.

- [X] T004 Create `assets/data/merchant-dashboard.json` per the M1 schema — `company` {name (شركة رحلات الشرق), plan ("Growth Plan"), subscriptionStatus (mock), user {name, role}, pendingTasksNote}; `kpis` (**≥8**: new booking requests, active deals, active coupons, customers, deal clicks, coupon copies, estimated conversions, deals nearing expiry — each `key`/`label`/`value`/`trendDirection`/`trendValue`/`helperText`/optional `link`); `analytics` {bookingInquiriesOverTime[], dealClicks[], couponCopies[], topDestinations[{label,value}], trafficSources[{label,value}], deviceBreakdown[{label,value}]}; `alerts` (**≥6**: severity/message/due/action); `onboarding` (**6**: label/description/done/cta); `activity` (**≥5**: icon/text/time/type); `notifications` (topbar: text/time/type). All realistic mock, honesty-safe (M1; M6).
- [X] T005 [P] Create `assets/data/merchant-bookings-preview.json` with **≥8** bookings per the M2 schema (`reference` ltr, `customerName`, `phone` ltr, `requestTitle`, `destination`, `amount`+`currency`, `status` ∈ {New,Contacted,Pending Payment,Confirmed,Cancelled,Completed}, `paymentStatus` ∈ {Unpaid,Deposit,Paid,Refunded}, `createdDate`, `assignedUser`); spread across several statuses and payment states so badges are meaningful (M2; M6).
- [X] T006 [P] Create `assets/data/merchant-deals-preview.json` with **≥5** top deals per the M3 schema (`dealId` reusing `deals.json` ids → `../pages/deal-details.html?id=`, `title`, `destination`, `sourceBadge` ∈ {Partner,Affiliate,Manual Deal,API Ready}, `clicks`, `inquiries`, `couponCopies`, `conversionEstimate`, `status`); metrics explicitly mock/تقديري (M3; M6).
- [X] T007 [P] Create `assets/data/merchant-integrations-preview.json` with **≥11** integrations per the M4 schema (`name` for Travelpayouts/Booking Affiliate/Expedia Partner/Skyscanner Partner/Amadeus API/Duffel API/Coupon API/Manual Deals/Scraping Review Queue/WhatsApp Notifications/Email Notifications, `status` ∈ {Connected mock,Not connected,API Ready,Coming soon,Needs configuration,Needs review}, `description`); include a spread of statuses; make clear no integration is really active (M4; M6).
- [X] T008 [P] Create `src/js/dashboard.js` (additive IIFE, `'use strict'`, `DOMContentLoaded`): dispatch only when `document.documentElement.dataset.page === 'merchant-dashboard'`; add shared helpers — a generic **dropdown controller** (toggle, `aria-expanded`, outside-click/Escape close, roving focus), an **`aria-live` announcer**, a **row-action-menu controller**, a `window.TUI.validateForm(form,{rules})` **submit wrapper** that renders frontend-only success (toast + optional in-place DOM update, no real action), and a `prefersReducedMotion`-aware helper. No edits to `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` (research D5; C8.1).
- [X] T009 Create the `dashboard/index.html` scaffold: `<html lang="ar" dir="rtl" data-page="merchant-dashboard">`; own `<head>` from the `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo font preload, favicon, theme-color, viewport, Arabic `<title>`/meta description, `<meta name="robots" content="noindex">`); `.skip-link`, `#main` landmark, `#toast-root`; a page-scoped `<style>` placeholder; the script order `../src/js/ui.js` → `../src/js/main.js` → `../src/js/dashboard.js` (all `defer`); and empty container regions for the shell + the 11 overview sections. Do **NOT** inline the public header/footer (research D2; C0.1–C0.3).

**Checkpoint**: Catalogs + module skeleton + page scaffold ready — user-story sections can now proceed (serially, on the one page).

---

## Phase 3: User Story 1 - Orient in an app-like merchant dashboard shell (Priority: P1) 🎯 MVP

**Goal**: A professional RTL **app shell** in `dashboard/index.html` — sidebar (10 modules + active state +
coming-soon), topbar (mobile menu + breadcrumb + company switcher + global search + notifications/quick-add/user
dropdowns), mobile drawer + scrim, breadcrumb, page header, and dashboard footer — the reusable layout foundation for
all future merchant pages.

**Independent Test**: Open `dashboard/index.html` at 360px and desktop → one `<h1>`, a dashboard shell (not the public
header/footer); sidebar with the 10 links and الرئيسية active; topbar with a working mobile menu button + 3 working
dropdowns + global search; `العودة للموقع` → `../pages/index.html`; every unbuilt module → coming-soon toast; on mobile
the sidebar opens as a drawer and closes via scrim/Escape; no horizontal scroll; no dead controls; no browser dialog.

- [X] T010 [US1] Build the **sidebar** in `dashboard/index.html`: brand/logo (`<a href="index.html">`) + a nav `<ul>` of the 10 links — الرئيسية (`href="index.html"`, `aria-current="page"`) / العروض / إضافة عرض / الكوبونات / طلبات الحجز / العملاء / التحليلات / التكاملات / الإعدادات (the eight unbuilt with `data-coming-soon`) / العودة للموقع (`href="../pages/index.html"`) — each with an icon via `<use href="../assets/icons/sprite.svg#icon-…">` and an accessible label (FR-008; C1.1).
- [X] T011 [US1] Build the **topbar** in `dashboard/index.html`: a mobile-menu button (`icon-menu`, `aria-controls`/`aria-expanded`, `aria-label`), a breadcrumb/current-area indicator, a company-switcher placeholder, a global search input (`.search-input-light`, `dir` correct), and the three dropdown triggers + menus — **notifications** (mock list from `merchant-dashboard.json`), **quick-add** (add deal / create coupon / add booking request — coming-soon items), **user menu** (profile/settings → coming-soon; logout) (FR-009; C1.2/C1.3).
- [X] T012 [US1] Add the **mobile drawer + overlay/scrim** markup in `dashboard/index.html` and author its page-scoped `<style>` for the shell: a CSS grid with a fixed sidebar column on `lg+` and an off-canvas `.drawer`-style sidebar + scrim below `lg`; topbar layout; the absolutely-positioned dropdown menus (`z-index: dropdown`, `role="menu"`/`role="menuitem"`); no horizontal overflow at 360px (FR-007/FR-010; C1.4; research D7).
- [X] T013 [US1] Build the **breadcrumb** (لوحة التحكم / الرئيسية, `.breadcrumb`), the **page header** region, and the **dashboard footer** (`.dash-footer`: platform name + frontend-only note + copyright + link → `../pages/index.html`) in `dashboard/index.html` (FR-007/FR-025; C1.6/C6.2).
- [X] T014 [US1] Implement the shell behaviors in `src/js/dashboard.js`: mobile sidebar/drawer open-close via `window.TUI.drawer` + the scrim (close on scrim-click/Escape, focus managed); the three topbar dropdowns via the dropdown controller (open/close, `aria-expanded`, outside-click/Escape close); the global-search mock state ("بحث تجريبي" toast/inline, no real backend); and logout (frontend-only toast, MAY navigate to `../pages/index.html`) (FR-009/FR-010; C1.3/C1.5).

**Checkpoint**: The app shell is fully functional and independently testable — the MVP deliverable and the layout foundation for all later sections.

---

## Phase 4: User Story 2 - See the business at a glance: welcome summary & KPIs (Priority: P1)

**Goal**: The overview headline — a welcome/agency summary (company, plan badge, subscription mock, pending-tasks note,
CTAs) and ≥8 KPI cards with trend indicators — rendered statically from `merchant-dashboard.json` values.

**Independent Test**: Open `dashboard/index.html` → welcome summary (company name, welcome, plan badge, subscription
mock, pending-tasks note, CTAs that navigate or coming-soon) + ≥8 KPI cards (icon + label + realistic number + trend +
helper text, non-dead links); reflows to one column at 360px with no horizontal scroll; all framed as mock.

- [X] T015 [US2] Build the **welcome / agency summary** in `dashboard/index.html` (carries the single `<h1>`): company name (شركة رحلات الشرق), welcome message, current-plan badge (Growth Plan, `.badge`), subscription-status mock, a pending-tasks note (`.inline-msg-info`), and CTAs إضافة عرض جديد / مراجعة طلبات الحجز / إعداد التكاملات (`data-coming-soon` for the unbuilt targets) — values consistent with `merchant-dashboard.json`; plan/subscription framed as mock (FR-011; C2.1).
- [X] T016 [US2] Build the **KPI cards** grid (**≥8**) in `dashboard/index.html` from `merchant-dashboard.json` `kpis` — طلبات الحجز الجديدة / العروض النشطة / الكوبونات المفعلة / العملاء / الضغطات على العروض / نسخ الكوبونات / التحويلات التقديرية / عروض قاربت على الانتهاء — each `.card` with an icon, label `<h3>`, value, a trend indicator (`icon-trend-up`/`icon-trend-down` + `.badge-success`/`.badge-danger` + value), helper text, and a non-dead link/action; add the page-scoped `.kpi-grid` style; values framed as بيانات تجريبية (FR-012; C2.2).

**Checkpoint**: The welcome summary + KPIs render statically with meaningful mock data, independently testable.

---

## Phase 5: User Story 3 - Triage recent booking requests with row actions & modals (Priority: P2)

**Goal**: A responsive recent-booking-requests table/card hybrid (≥8 rows) with row action menus and custom
status-change + add-note modals — the operational core.

**Independent Test**: Open `dashboard/index.html` at 360px and desktop → ≥8 rows with all columns + status/payment
badges + a working row action menu; status-change modal (notify-customer toggle placeholder) → toast + optional badge
update; add-note modal (required note) validates → toast + inline success; contact/assign produce feedback; table →
stacked labeled cards on mobile; no dead actions; no `alert()`/`confirm()`/`prompt()`.

- [X] T017 [US3] Build the **recent booking requests** responsive table/card hybrid in `dashboard/index.html` from `merchant-bookings-preview.json` (**≥8** rows) — columns reference / customer / phone (`dir="ltr"`) / request title / destination / amount (`dir="ltr"`) / status `.badge` / payment-status `.badge` / created date / assigned user / a row-action trigger (`icon-more`, `aria-haspopup`) — and author the page-scoped `.dash-table` style: a real `<table>` on `md+` that becomes stacked, labeled cards (`data-label` `::before`) below `md` with no horizontal overflow; carry `data-booking-row`/`data-booking-status` on each row (FR-013; C3.1; research D7).
- [X] T018 [US3] Build the **status-change modal** and **add-note modal** markup in `dashboard/index.html` using the existing `.modal` pattern: status-change → booking reference (read-only/hidden), new-status `.field-select` (the six statuses), note `.field-textarea`, a notify-customer toggle placeholder (`role="switch"` checkbox); add-note → reference (read-only/hidden), a **required** note `.field-textarea`, a note-type `.field-select`, an optional follow-up `.field-input type="date"`; wire `data-modal-open`/`data-modal-close` triggers (FR-015/FR-016; C3.3/C3.4).
- [X] T019 [US3] Implement the **booking behaviors** in `src/js/dashboard.js`: open/close the per-row action menu (view-details → `data-coming-soon`; change-status/add-note → open the prefilled modal; contact-customer → toast; assign-user → mock modal or toast); status-change save → `TUI.validateForm` → toast + MAY update the row's visible status badge in place (no real-notification claim); add-note save → validate (required note) → toast + inline success (not persisted) (FR-014/FR-015/FR-016; C3.2–C3.4; D10).
- [X] T020 [US3] Add the reusable **empty-state** for the bookings section (`.empty-state` with message + CTA, hidden by default) in `dashboard/index.html` for the no-data case (FR-024; C6.1).

**Checkpoint**: Recent bookings triage (row menus + status/note modals + contact/assign) works end-to-end on desktop and mobile, no browser dialogs.

---

## Phase 6: User Story 4 - Judge performance: top deals, analytics preview & activity (Priority: P2)

**Goal**: A top-performing-deals section (≥5), a CSS/HTML-only analytics preview (6 visuals), and an activity feed (≥5)
— all believable mock with no external chart library.

**Independent Test**: Open `dashboard/index.html` → ≥5 top deals (title/destination/source badge/clicks/inquiries/coupon
copies/conversion/status; public CTA → `../pages/deal-details.html?id=`; edit → coming-soon); 6 CSS/HTML chart visuals
with mock numbers and zero external chart/CDN requests; activity feed ≥5 items; reflows at 360px; no live-data claim.

- [X] T021 [US4] Build the **top performing deals** section in `dashboard/index.html` from `merchant-deals-preview.json` (**≥5**) — each `.card` row with title `<h3>`, destination, a **source badge** (`.badge-source-partner/affiliate/manual/api-ready`), clicks, inquiries, coupon copies, conversion estimate, status `.badge`, a CTA → `../pages/deal-details.html?id=<dealId>` (safe fallback if id missing), and an edit CTA → `data-coming-soon` (FR-017; C4.1; M3.2).
- [X] T022 [US4] Build the **analytics preview** in `dashboard/index.html` from `merchant-dashboard.json` `analytics` — **CSS/HTML-only** visuals for booking inquiries over time, deal clicks, coupon copies (vertical bars/sparkline rows), and top destinations, traffic sources, device breakdown (horizontal proportion / segmented bars) — each a `<figure>`+`<figcaption>` labeled "مثال توضيحي"; author the page-scoped `.chart-*` style sized from the mock numbers (e.g., `--h`/`width:NN%`), keyboard/AT-readable, reduced-motion-safe; **no chart library/canvas/CDN** (FR-018; C4.2; research D6).
- [X] T023 [US4] Build the **activity feed** in `dashboard/index.html` from `merchant-dashboard.json` `activity` (**≥5** items — icon + text + relative time + type/status), framed as بيانات تجريبية, not a real-time stream (FR-019; C4.3).

**Checkpoint**: Performance read (top deals + CSS analytics + activity) renders statically with no external chart library, independently testable.

---

## Phase 7: User Story 5 - Operate & grow: quick actions, integration readiness, alerts & onboarding (Priority: P2)

**Goal**: A quick-actions panel (6), an integration-readiness card (≥11), operational alerts (≥6), and an interactive
onboarding checklist with a live progress indicator — turning the overview into a workspace.

**Independent Test**: Open `dashboard/index.html` at 360px and desktop → 6 quick actions (none dead; تصفح الموقع العام →
public site); ≥11 integrations (name + honest status badge + description + toast/coming-soon action; "no real
integration active"); ≥6 alerts (severity + message + date/due + action); onboarding checklist toggles update a live
`aria-live` progress indicator + toast; all frontend-only; no dead controls.

- [X] T024 [US5] Build the **quick actions** panel in `dashboard/index.html` (6 `.btn`s: إضافة عرض جديد / إنشاء كوبون / مراجعة الطلبات / إعداد التكاملات → `data-coming-soon`; عرض صفحة الشركة → coming-soon or in-page; تصفح الموقع العام → `../pages/index.html`) + the page-scoped `.quick-actions` style; no dead action (FR-020; C5.1).
- [X] T025 [US5] Build the **integration readiness** card in `dashboard/index.html` from `merchant-integrations-preview.json` (**≥11** rows) — each name, an honest **status badge** (`.badge-success`/`.badge-neutral`/`.badge-source-api-ready`/`.badge-info`/`.badge-warning` per status), a short description, and an action button إعداد / اختبار / قريبًا (`data-coming-soon`/`data-toast`); state "لا يوجد تكامل مفعّل فعليًا — تكامل جاهز للإعداد لاحقًا" (FR-021; C5.2; M6.1).
- [X] T026 [US5] Build the **operational alerts** section in `dashboard/index.html` from `merchant-dashboard.json` `alerts` (**≥6** `.card`s: عروض قاربت على الانتهاء / كوبونات تحتاج مراجعة / طلبات لم يتم الرد عليها / تكامل غير مفعل / بيانات ناقصة في الشركة / باقة تجريبية قاربت على الانتهاء — each a severity badge (`.badge-danger`/`.badge-warning`/`.badge-info`), message, date/due note, action button → `data-toast`/`data-coming-soon`) (FR-022; C5.3).
- [X] T027 [US5] Build the **onboarding checklist** in `dashboard/index.html` from `merchant-dashboard.json` `onboarding` (6 items: أضف أول عرض / أنشئ أول كوبون / فعّل مصدر العروض / اضبط بيانات الشركة / راجع أول طلب حجز / فعّل تنبيهات البريد لاحقًا) — each a checkbox (`role`/native `type="checkbox"`), description, and CTA (built `href` or `data-coming-soon`) — plus a **progress indicator** (CSS proportion bar + an `aria-live` "x/6"/% text) and the page-scoped `.onboarding` style; carry `data-onboarding-item` (FR-023; C5.4).
- [X] T028 [US5] Implement the **onboarding + action behaviors** in `src/js/dashboard.js`: toggle an item's check state (`aria-checked`) → recompute and update the progress indicator (announced via `aria-live`) → toast; ensure the integration/alert/quick-action buttons fire their toast/coming-soon (reusing `data-toast`/`data-coming-soon` where possible, JS only where needed). State frontend-only (FR-021/FR-022/FR-023; C5.1–C5.4; D10).

**Checkpoint**: Quick actions, integration readiness, operational alerts, and the interactive onboarding checklist all work frontend-only, independently testable.

---

## Phase 8: Polish & Cross-Cutting Concerns (QA gate)

**Purpose**: Reusable patterns, accessibility/responsive/honesty/SEO passes, the hard stack gate, non-regression, and the QA artifact.

- [X] T029 [P] Add the reusable **skeleton-loading** pattern (`.skeleton` dashboard cards + table rows, hidden by default) in `dashboard/index.html` so future merchant pages can reuse it — never a blank/broken section (FR-024; C6.1).
- [X] T030 [P] **Accessibility pass** on `dashboard/index.html` + `src/js/dashboard.js`: keyboard operability + visible focus for every control (sidebar links, mobile menu, the 3 dropdowns, search, KPI links, row action menus, status/note modals, contact/assign, quick actions, integration/alert actions, onboarding checkboxes + CTAs, logout); `aria-current` on the active nav, `aria-expanded`/`aria-controls` on dropdown triggers, `aria-checked`/`aria-pressed` on toggles, `aria-live` for status/progress; managed dropdown/modal focus + Escape; icon-only `aria-label`s; reduced-motion respected. Run `npx @axe-core/cli http://localhost:3000/dashboard/index.html` → 0 AA violations (FR-034; SC-015).
- [X] T031 [P] **Responsive pass**: verify `dashboard/index.html` at 360px has no horizontal scroll (sidebar→drawer, topbar usable, KPI grid + charts reflow, booking table → stacked labeled cards, touch targets ≥ ~44px), and that flipping to `dir="ltr" lang="en"` mirrors the shell/grid/table with no structural breakage (FR-032/FR-033; SC-001/SC-011).
- [X] T032 [P] **Honesty/copy audit** of `dashboard/index.html` + the four catalogs: every section is framed بيانات تجريبية / واجهة أمامية فقط / قابل للربط لاحقًا / حالة تجريبية; the integration card states no real integration is active; no copy claims a real merchant account/session, live data, real booking, real analytics, connected integration, sent notification, active API sync, scraping queue, subscription, or payment (FR-028; SC-010; M6).
- [X] T033 [P] **SEO/semantics pass** on `dashboard/index.html`: exactly one `<h1>`, correct heading hierarchy, the Arabic `<title>`/meta description, the dashboard breadcrumb, `robots noindex`; any optional `BreadcrumbList` JSON-LD is valid and consistent with the visible mock content (no real-account/live-data/integration assertions) (FR-035; SC-014).
- [X] T034 [P] **Stack-compliance hard gate**: `grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" --include=*.html --include=*.js --include=*.css . | grep -v node_modules` returns no matches, **and** `grep -RInE "chart\.js|chartjs|apexcharts|highcharts|echarts|d3\.|recharts|plotly" dashboard/ src/js/dashboard.js` returns no matches (no external chart lib); `npm run build` regenerates cleanly; `npx html-validate dashboard/index.html` → 0 errors; `npx prettier --check "src/js/dashboard.js" "dashboard/*.html"`; zero external CDN requests and zero console errors on the dashboard (FR-004; SC-013).
- [X] T035 Confirm **non-regression**: `git diff` shows `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, `src/js/member.js`, `partials/header.html`, `partials/footer.html`, and the public/member `pages/` are unchanged; `assets/icons/sprite.svg` edits are append-only; `tailwind.config.js` change is only the additive glob; the Spec 001 styleguide/components, the Spec 002 homepage, the Spec 003/004/005 pages still render with no console errors (FR-002; SC-017; C8.1/C8.2).
- [X] T036 Produce `specs/006-merchant-dashboard-shell/qa-results.md` documenting every gate result: `npm run build` pass; `html-validate` pass; the two stack/chart greps = 0; zero external CDN; zero console errors; 360px no-overflow; RTL correct + LTR structural integrity; one `<h1>` + heading hierarchy; dashboard relative paths work from `/dashboard/`; sidebar desktop + mobile drawer; topbar dropdowns; row action menus; status modal; add-note modal; quick actions / integration actions not dead; onboarding checklist + progress; KPI cards + recent-bookings mobile usability; non-regression of Specs 001–005; and honesty of copy (SC-001–SC-018).

**Checkpoint**: All constitution/QA gates green; the dashboard is client-presentable and ships with `qa-results.md`.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: T001 first (baseline). T002/T003 are `[P]` (distinct files: `tailwind.config.js`, `sprite.svg`).
- **Foundational (Phase 2)**: depends on Setup. T004 then T005/T006/T007/T008 are `[P]` (distinct files: three JSON
  catalogs + `dashboard.js`). T009 (page scaffold) can start once T002 (glob) lands; it should be in place before any
  US section task. **Blocks all user stories.**
- **User Stories (Phases 3–7)**: all depend on Foundational. US1 is the MVP shell; US2–US5 each add their section(s) to
  the same page and read their catalog. Because they edit the **same two files** (`dashboard/index.html` +
  `dashboard.js`), run them in priority order (US1 → US2 → US3 → US4 → US5); they are logically separable but not
  file-parallel (see serialization note).
- **Polish (Phase 8)**: depends on the targeted sections existing. The audits T029–T034 are `[P]` (independent
  verification with localized fixes); T035 (non-regression) and T036 (qa-results) come last.

### User-story dependencies

- **US1 (P1)** — depends only on Foundational. Independently testable (the shell). 🎯 MVP.
- **US2 (P1)** — depends on Foundational (+ the scaffold/shell as its container). Independent of US3–US5.
- **US3 (P2)** — depends on Foundational; independent of US2/US4/US5 (its own section + modals + JS block).
- **US4 (P2)** — depends on Foundational; independent of the others (its own section).
- **US5 (P2)** — depends on Foundational; independent of the others (its own section + onboarding JS block).

### Shared-file note (serialization point)

- **`dashboard/index.html`** is authored by T009 (scaffold) then extended by T010–T013 (US1 shell), T015–T016 (US2),
  T017–T018/T020 (US3), T021–T023 (US4), T024–T027 (US5), and T029 (skeleton). These edit **different regions of the
  same file** → keep them **sequential** (not `[P]` with each other) or coordinate merges per region.
- **`src/js/dashboard.js`** is authored by T008 (skeleton) then extended by T014 (US1 behaviors), T019 (US3 behaviors),
  and T028 (US5 behaviors) → different blocks of one file → sequential / coordinate merges.
- All other work is in **distinct files** and genuinely parallel: the four catalogs (T004–T007), `sprite.svg` (T003),
  `tailwind.config.js` (T002).

### Parallel opportunities

- Setup: T002 ∥ T003.
- Foundational: T004 then T005 ∥ T006 ∥ T007 ∥ T008 (distinct files); T009 after T002.
- Polish: T029 ∥ T030 ∥ T031 ∥ T032 ∥ T033 ∥ T034 (independent audits/patterns), then T035 → T036.

---

## Parallel Example: after Setup (Foundational catalogs)

```bash
# Distinct files — safe to build in parallel before any page section:
Dev A → assets/data/merchant-dashboard.json            (T004)
Dev B → assets/data/merchant-bookings-preview.json     (T005)
Dev C → assets/data/merchant-deals-preview.json        (T006)
Dev D → assets/data/merchant-integrations-preview.json (T007)
Dev E → src/js/dashboard.js skeleton                   (T008)
# Then one developer authors dashboard/index.html section-by-section (US1→US5),
# coordinating the dashboard.js behavior blocks (T014, T019, T028).
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational (CRITICAL — blocks all stories).
2. Phase 3 US1 (the app shell: sidebar + topbar + drawer + footer + shell JS behaviors).
3. **STOP & VALIDATE**: navigate the sidebar (coming-soon for unbuilt modules), open the three dropdowns, open/close the
   mobile drawer, run the search mock and logout — at 360px and desktop, no horizontal scroll, no dead controls.
4. Demo the MVP (the reusable dashboard shell).

### Incremental delivery

1. Setup + Foundational → catalogs + module + scaffold ready.
2. US1 (shell) → test → demo (MVP: the app shell).
3. US2 (welcome + KPIs) → test → demo (the at-a-glance headline).
4. US3 (recent bookings + status/note modals) → test → demo (operational triage).
5. US4 (top deals + CSS analytics + activity) → test → demo (performance read).
6. US5 (quick actions + integrations + alerts + onboarding) → test → demo (the workspace).
7. Polish/QA gate + `qa-results.md` → ship the client-presentable overview.

### Parallel team strategy

1. Team completes Setup + Foundational together (catalogs/module/scaffold split by file — see Parallel Example).
2. One owner authors `dashboard/index.html` and `dashboard.js` section-by-section in priority order (US1→US5), since
   both are single shared files; reviewers can pick up the `[P]` Polish audits as each section lands.
3. Finish with the non-regression check and the `qa-results.md` artifact.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task. `[Story]` maps a task to its user story.
- This feature delivers **one page** + **one module**; user-story phases build distinct sections/behaviors of those
  shared files, so within-page tasks are sequential (logically separable) — see the serialization note.
- Reuse existing components/utilities; do **not** modify `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` or
  `partials/header.html`/`footer.html` or `pages/`; introduce no new visual identity (only a small page-scoped `<style>`
  for the shell/dropdowns/table/KPI-grid/chart-bars/onboarding-progress). Charts are CSS/HTML only.
- The dashboard uses its **own app shell** (not the public header/footer); unbuilt merchant modules use `data-coming-soon`
  (no 404; files not created). State is frontend/session-only; keep mock data believable and consistent (top deals reuse
  `deals.json` ids); never imply a real merchant account, session, live data, booking, analytics, integration,
  notification, subscription, or payment.
- Commit after each task or logical group. Stop at any checkpoint to validate a story independently.
