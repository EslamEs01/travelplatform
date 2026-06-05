---
description: "Task list — SaaS Owner Admin Dashboard (Spec 010)"
---

# Tasks: SaaS Owner Admin Dashboard (Travel SaaS Platform)

**Input**: Design documents from `specs/010-saas-owner-admin-dashboard/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅ (8 files), quickstart.md ✅

**Tests**: NOT requested. This is a frontend-only static prototype verified by manual QA + `html-validate` + axe-core + the stack-compliance grep gate (consistent with Specs 001–009). No unit/contract test tasks are generated.

**Organization**: Tasks are grouped by user story (US1–US7 from spec.md, priority order). Each story is an independently demonstrable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — **different file, no dependency on an incomplete task**.
- **[Story]**: US1–US7 (page phases only). Setup/Foundational/Polish carry no story label.

## ⚠️ Shared-file serialization (read before parallelizing)

- **`src/js/admin.js`** is edited by Foundational (shell-init + primitives) **and every per-page controller task** → all `admin.js` tasks are **sequential** (never `[P]` with each other).
- **`tailwind.config.js`** and **`assets/icons/sprite.svg`** are touched once (Setup) — do not parallelize edits to them.
- Each `admin/<page>.html` is a **distinct file** → page-authoring tasks for different pages are `[P]` with each other (after Foundational). Tasks editing the **same** page file are sequential.
- The 7 `assets/data/*.json` catalogs are distinct files → `[P]` with each other.

## Path conventions

Static frontend, single project under `travel-saas-frontend/`. Admin pages live in `travel-saas-frontend/admin/`; shared JS in `travel-saas-frontend/src/js/`; mock data in `travel-saas-frontend/assets/data/`. All relative paths in pages resolve from `admin/` (`../assets/…`, `../src/js/…`, `../pages/…`, `../dashboard/…`).

---

## Phase 1: Setup (shared infrastructure)

**Purpose**: Make the build aware of `admin/` and stand up the shared script + icons.

- [x] T001 Add `'./admin/**/*.html'` to the `content` array in `travel-saas-frontend/tailwind.config.js` (additive, one line) and create the `travel-saas-frontend/admin/` directory. Without this glob the admin pages render unstyled (research D4).
- [x] T002 [P] Append only genuinely-missing icon symbols to `travel-saas-frontend/assets/icons/sprite.svg` (candidates: `icon-dollar-sign`, `icon-file-text`, `icon-layers`, `icon-server`); skip any that already exist; do not modify existing symbols (additive only).
- [x] T003 [P] Create `travel-saas-frontend/src/js/admin.js` as a guarded IIFE skeleton: read `document.documentElement.dataset.page`, `_ADMIN_PAGES = ['admin-overview','admin-companies','admin-company-details','admin-plans','admin-subscriptions','admin-analytics','admin-content']`, early-return if not an admin page, `DOMContentLoaded` entry, and a `switch(page)` dispatch with 7 empty controller stubs. Reuse `window.TUI`; import/modify nothing else.

**Checkpoint**: Build scans `admin/`; `admin.js` loads and no-ops safely on non-admin pages.

---

## Phase 2: Foundational (blocking prerequisites for ALL user stories)

**Purpose**: The shared admin shell, the `admin.js` shell-wiring + reusable primitives, and the 7 backend-ready mock catalogs every page mirrors.

**⚠️ CRITICAL**: No user-story page can be completed until T004–T013 are done. (`admin.js` tasks T004→T005 are sequential — same file.)

- [x] T004 Implement the **shell init** in `travel-saas-frontend/src/js/admin.js` (runs on every admin page): sidebar drawer open/close + scrim + Esc + outside-click + `body` scroll-lock + focus move/return (via `data-drawer-*`/`TUI.drawer`); three topbar `DropdownController`s (notifications / admin user-menu / quick-action) with Esc + outside-click + roving focus + one-open-at-a-time; `data-year`. (depends T003)
- [x] T005 Implement the **shared primitives** in `travel-saas-frontend/src/js/admin.js`: a `TUI.toast` wrapper, a row-action-menu controller, `validateAndSubmit(form, rules, onSuccess)` over `TUI.validateForm` (inline `aria-invalid`/`aria-describedby` + `.field-error`), a shared confirm-modal helper (`confirm → callback → toast → close` via `TUI.modal`), a generic **filter/sort/search engine** (reads row `data-*`; show/hide + reorder; updates an `aria-live` result count + removable active-filter chips + reset; applies segment presets; toggles an empty state), and `slugify`. (depends T004 — same file)
- [x] T006 Author the **canonical admin shell + page-scoped `.admin-*` `<style>`** in `travel-saas-frontend/admin/index.html` (the reference all pages copy): `<html lang="ar" dir="rtl" data-page="admin-overview">`; own `<head>` from `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo preload, favicon, `theme-color`, **`robots noindex`**, Arabic title/description, BreadcrumbList JSON-LD); dark slate **`ink`** sidebar rail + gold **`sunset`** accent + "مالك المنصة · Owner Admin" brand; sidebar nav (10 items + targets per `contracts/admin-shell.contract.md`, active=`الرئيسية`, `aria-current="page"`); topbar (menu button + search + 3 dropdown triggers); mobile drawer + scrim; breadcrumb (لوحة الإدارة / الرئيسية); page-header region; small footer (`data-year` + honesty line); a single `#toast-root`; and the three `defer` scripts `../src/js/ui.js`, `../src/js/main.js`, `../src/js/admin.js`. Page-scoped `<style>` defines the `.admin-*` shell + reusable primitives (KPI grid, table→cards, CSS chart visuals, content tabs, usage bars). (depends T001)
- [x] T007 [P] Create `travel-saas-frontend/assets/data/admin-companies.json` — **≥12** companies with the full Company schema (data-model §1.1 / FR-064), valid enums, `usageLimits`/`recentActivity`/`adminNotes`, reusing `deals.json`/`merchant-deals.json`/`merchant-coupons.json` ids where referenced; emails/phones/websites LTR.
- [x] T008 [P] Create `travel-saas-frontend/assets/data/admin-plans.json` — **4** plans (Starter/Growth/Pro/Enterprise) with the full Plan schema (FR-065) + a comparison matrix of **≥14** feature rows.
- [x] T009 [P] Create `travel-saas-frontend/assets/data/admin-subscriptions.json` — `{ items[≥12], stats{8} }` (FR-066); each item's `company` references an `admin-companies.json` id; `mrrEstimate`/`arrEstimate` consistent with the items.
- [x] T010 [P] Create `travel-saas-frontend/assets/data/admin-integration-health.json` — the **8** integrations (Travelpayouts, Booking Affiliate, Coupon API, Email Notifications, WhatsApp, Scraping Review Queue, Amadeus API, Duffel API) with status/affectedCompanies/lastCheck/severity/errors (data-model §1.5).
- [x] T011 [P] Create `travel-saas-frontend/assets/data/admin-platform-analytics.json` — **≥12** KPIs + **8** visual series + **5** insight tables + **≥5** recommendations (data-model §1.7), consistent with the companies/subscriptions/integration catalogs.
- [x] T012 [P] Create `travel-saas-frontend/assets/data/admin-content.json` — homepage sections (7) + destinations + blog posts + featured deals + featured coupons + pending review + `stats{8}` (FR-067), reusing `destinations-full.json`/`articles.json`/`deals.json`/`merchant-coupons.json` ids.
- [x] T013 Create `travel-saas-frontend/assets/data/admin-overview.json` — **≥10** KPIs + activity **≥10** + topCompanies **≥8** + subscriptionAlerts(5) + previews(5) + checklist(5); KPI aggregates and top-companies/alerts must be **consistent** with T007/T009/T010 (depends T007, T009, T010).

**Checkpoint**: Shell + style + `admin.js` shell/primitives + all 7 catalogs exist and agree. User-story pages can now be built — most in parallel (different page files).

---

## Phase 3: User Story 1 — Platform overview + admin shell (Priority: P1) 🎯 MVP

**Goal**: The owner lands on `admin/index.html` and sees the whole platform (KPIs, activity, top companies, integration health, subscription alerts, CSS previews, checklist) on the distinct admin shell, and can reach every other area.

**Independent test**: Open `admin/index.html` (no backend, then JS-off): shell distinct from merchant, active=الرئيسية, ≥10 KPIs, ≥10 activity, ≥8 top companies (view→`company-details.html?id=`), 8 health cards, alerts, 5 CSS visuals, 7 quick actions, checklist toggles, drawer + 3 dropdowns work at 360px, honesty notes visible, no console error.

- [x] T014 [US1] Author the overview static content into `travel-saas-frontend/admin/index.html` (on the T006 shell), per `contracts/overview-page.contract.md`: page header (H1 "لوحة تحكم المنصة" + description + 4 quick-action buttons + safe note); **≥10 KPI cards**; activity feed **≥10** (icon+text+name+time+badge); top-companies table **≥8** (table→cards, row action menus: view→`company-details.html?id=<id>`, change-plan, suspend, contact-owner); **8** integration-health cards; subscription-alert cards (5 types); **5** CSS chart-like previews (+accessible text alternatives); quick-admin-actions grid (7); admin-notes checklist (5); and one empty + one skeleton example. Mirror `admin-overview.json`. (depends T006, T013)
- [x] T015 [US1] Implement the `admin-overview` controller in `travel-saas-frontend/src/js/admin.js`: checklist toggle (+ `aria-live` remaining count); quick-action + quick-admin buttons → navigate / open modal / toast; top-company row menus (view navigates; suspend → shared confirm modal; change-plan/contact-owner → modal/toast); integration-card + subscription-alert action buttons → toast (mock); export → toast ("لا يتم إنشاء ملف فعلي"). (depends T005, T014 — edits shared `admin.js`)

**Checkpoint**: US1 fully functional — the MVP owner dashboard is demonstrable standalone.

---

## Phase 4: User Story 2 — Companies management (Priority: P1)

**Goal**: Browse/search/filter/sort ≥12 companies with per-row + bulk frontend-only actions and validated modals.

**Independent test**: Open `admin/companies.html`: ≥12 rows; a filter narrows the set + updates an `aria-live` count + removable chips; reset restores; row menus open the right modal/toast; login-as is disabled/safe; bulk-suspend uses a custom confirm; Add/Change-plan/Suspend/Note modals validate→toast; 7 segment cards filter; FAQ ≥5; no dead control; no browser dialog.

- [x] T016 [P] [US2] Scaffold `travel-saas-frontend/admin/companies.html` by replicating the canonical admin shell (T006) with `data-page="admin-companies"`, active=`الشركات`, breadcrumb (لوحة الإدارة / الشركات), Arabic title/meta, the three `defer` scripts. (depends T006)
- [x] T017 [US2] Author the companies static content into `travel-saas-frontend/admin/companies.html` per `contracts/companies-page.contract.md §A`: header (CTA + export + safe note); **≥8** stats cards; search + **8** filters + reset; **6**-option sort; result-count + chips region (`aria-live`); **≥12-row** table (13 cols, email `dir="ltr"`, row `data-*` for the engine, table→cards ≤640px); per-row action menu (view / change-plan / suspend-reactivate / extend-trial / add-note / contact-owner / **login-as disabled-safe**); bulk-actions bar; the 4 modals (Add Company / Change Plan / Suspend-Reactivate / Add Note); **7** segment cards; empty + skeleton; FAQ **≥5**. Mirror `admin-companies.json`. (depends T016, T007 — same file as T016, sequential)
- [x] T018 [US2] Implement the `admin-companies` controller in `travel-saas-frontend/src/js/admin.js`: wire the shared filter/sort/search engine (filters + 6 sorts + count + chips + reset + empty state); segment cards apply presets; row menus → modals/toasts (login-as → safety modal); Add-Company validates (required + email) → toast + optional prepended mock row; Change-Plan/Suspend/Add-Note validate → toast (suspend may flip the status badge); bulk select count (`aria-live`) + **bulk-suspend confirm modal**; export → toast. (depends T005, T017 — edits shared `admin.js`)

**Checkpoint**: US1 + US2 demonstrable — the core owner product.

---

## Phase 5: User Story 3 — Company details (Priority: P2)

**Goal**: Inspect one company in depth and run the per-company frontend-only actions.

**Independent test**: Open `admin/company-details.html` with and without `?id=`: complete default profile renders; ≥8 usage bars (with near-limit warnings); ≥10 timeline items; top-deals + booking stats + 8 integration rows + billing timeline + notes + support panel; 7 modals incl. reset-usage confirm + login-as safety; invoice actions toast; no real billing/impersonation.

- [x] T019 [P] [US3] Scaffold `travel-saas-frontend/admin/company-details.html` from the canonical shell (T006) with `data-page="admin-company-details"`, active=`الشركات`, breadcrumb (لوحة الإدارة / الشركات / تفاصيل الشركة), title/meta, scripts. (depends T006)
- [x] T020 [US3] Author the company-details static content into `travel-saas-frontend/admin/company-details.html` per `contracts/companies-page.contract.md §B`: profile header + 7 actions + frontend-only note; subscription summary; **≥8** usage progress bars (used/limit/% + near-limit warning); activity timeline **≥10**; top-deals table (→ `../pages/deal-details.html?id=`); **7** booking-stat cards; **8** integration rows; billing timeline (invoice id `dir="ltr"`, view/download/send); admin notes + add-note; support/follow-up panel; the **7** action modals (change-plan / suspend-reactivate / extend-trial / add-note / contact-owner / reset-usage confirm / login-as safety); FAQ **≥5**. Default mock company works with/without `?id=`. Mirror `admin-companies.json`. (depends T019, T007 — same file, sequential)
- [x] T021 [US3] Implement the `admin-company-details` controller in `travel-saas-frontend/src/js/admin.js`: open/resolve the 7 action modals (reset-usage + suspend via confirm helper; login-as → safety modal); invoice view/download/send → toast (mock); optional `?id=` reflection into labels; near-limit bar warning state from `used/limit`. (depends T005, T020 — edits shared `admin.js`)

**Checkpoint**: US3 demonstrable; companies module (list + detail) complete.

---

## Phase 6: User Story 4 — SaaS plans (Priority: P2)

**Goal**: View/curate the 4 plans + comparison with frontend-only plan actions and a monthly/yearly toggle.

**Independent test**: Open `admin/plans.html`: 4 plan cards + comparison ≥14 rows; the monthly/yearly toggle updates 100% of displayed prices; create/edit validates→toast; duplicate acts; disable uses a custom confirm (companies-not-affected); view-companies acts; FAQ ≥5.

- [x] T022 [P] [US4] Scaffold `travel-saas-frontend/admin/plans.html` from the canonical shell (T006) with `data-page="admin-plans"`, active=`الخطط`, breadcrumb (لوحة الإدارة / الخطط), title/meta, scripts. (depends T006)
- [x] T023 [US4] Author the plans static content into `travel-saas-frontend/admin/plans.html` per `contracts/plans-page.contract.md`: header (CTA + monthly/yearly toggle + safe note); **4** plan cards (prices `data-price-monthly`/`data-price-yearly`, description, target user, active-companies, status, full limits/features, actions edit/duplicate/disable-enable/view-companies); features-comparison table **≥14 rows × 4**; create/edit plan modal (validated fields); disable confirmation modal (companies-not-affected warning); companies-on-plan preview; FAQ **≥5**. Mirror `admin-plans.json`. (depends T022, T008 — same file, sequential)
- [x] T024 [US4] Implement the `admin-plans` controller in `travel-saas-frontend/src/js/admin.js`: monthly/yearly toggle swaps all card prices + active state (session-only); create/edit modal validate → toast; duplicate → toast or pre-filled modal; disable/enable → confirm modal → toast (+ optional status flip); view-companies-on-plan → filter preview or navigate to `companies.html` (plan filter) + toast. (depends T005, T023 — edits shared `admin.js`)

**Checkpoint**: US4 demonstrable.

---

## Phase 7: User Story 5 — Subscriptions (Priority: P2)

**Goal**: Review ≥12 subscriptions with renewals/payments/invoices and frontend-only row + bulk actions.

**Independent test**: Open `admin/subscriptions.html`: ≥12 rows; MRR/ARR stats; filter+sort+search update the set + count; 8 row actions resolve; bulk works; detail/invoice/extend-trial modals open; cancel uses a custom confirm; no real billing.

- [x] T025 [P] [US5] Scaffold `travel-saas-frontend/admin/subscriptions.html` from the canonical shell (T006) with `data-page="admin-subscriptions"`, active=`الاشتراكات`, breadcrumb (لوحة الإدارة / الاشتراكات), title/meta, scripts. (depends T006)
- [x] T026 [US5] Author the subscriptions static content into `travel-saas-frontend/admin/subscriptions.html` per `contracts/subscriptions-page.contract.md`: header (CTA + export + safe note); **8** stats (incl. MRR/ARR estimate, failed payments); search + filters + reset; **5**-option sort; result count + chips (`aria-live`); **≥12-row** table (12 cols, invoice id + amount `dir="ltr"`, row `data-*`, table→cards); per-row action menu (**8** actions); bulk-actions bar; **styled empty state** (zero-match) + **skeleton/loading** placeholder (listing-page contract, Constitution VII); the 4 modals (subscription detail / invoice mock w/ line items / extend-trial / cancel confirm); FAQ **≥5**. Mirror `admin-subscriptions.json`. (depends T025, T009 — same file, sequential)
- [x] T027 [US5] Implement the `admin-subscriptions` controller in `travel-saas-frontend/src/js/admin.js`: wire the filter/sort/search engine (+ 5 sorts + count + reset); row menus (view-company navigates; change-plan/extend-trial/detail/invoice → modals; mark-paid/send-reminder/download-invoice → toast; cancel → confirm modal); extend-trial validates `extensionDays` (1–90) → toast; bulk count + **cancel-selected confirm** + other bulk toasts. (depends T005, T026 — edits shared `admin.js`)

**Checkpoint**: US5 demonstrable; commerce module (plans + subscriptions) complete.

---

## Phase 8: User Story 6 — Platform analytics (Priority: P3)

**Goal**: Platform-wide read-only analytics: ≥12 KPIs, 8 CSS visuals, 5 tables, recommendations, export mock.

**Independent test**: Open `admin/analytics.html`: ≥12 KPIs; 8 CSS visuals (zero chart/table-library refs); date-range/compare toggle active state + illustrative toast; 5 tables with action toasts; ≥5 recommendation cards; export modal; `#integrations` anchor present; FAQ ≥5.

- [ ] T028 [P] [US6] Scaffold `travel-saas-frontend/admin/analytics.html` from the canonical shell (T006) with `data-page="admin-analytics"`, active=`التحليلات`, breadcrumb (لوحة الإدارة / التحليلات), title/meta, scripts. (depends T006)
- [ ] T029 [US6] Author the analytics static content into `travel-saas-frontend/admin/analytics.html` per `contracts/analytics-page.contract.md`: header (date-range selector + compare toggle + export mock + safe note); **≥12** KPI cards; **8** CSS chart-like visuals (each + accessible text alternative + "بيانات تجريبية"); **5** insight tables (with `id="integrations"` on the integration-errors/health section); **≥5** recommendation cards; export/report modal (CSV/PDF/schedule/send-to-owner mocks); FAQ **≥5**. Mirror `admin-platform-analytics.json`. (depends T028, T011 — same file, sequential)
- [ ] T030 [US6] Implement the `admin-analytics` controller in `travel-saas-frontend/src/js/admin.js`: date-range selector + compare toggle change **active state only** + illustrative-data toast (no re-query); table/insight/recommendation action buttons → toast; export → open export modal; modal actions → toast (no real file/email). (depends T005, T029 — edits shared `admin.js`)

**Checkpoint**: US6 demonstrable.

---

## Phase 9: User Story 7 — Content management (Priority: P3)

**Goal**: Curate platform content across 6 tabs with frontend-only create/edit/feature/publish/delete/approve actions.

**Independent test**: Open `admin/content.html`: 8 stats; 6 tabs switch with all panels in the DOM (readable JS-off); 7 homepage sections + 5 tab tables; create/edit validates→toast; feature toggle flips+toasts; publish/delete use custom confirms; approve/reject toast; homepage preview reflects featured; FAQ ≥5.

- [ ] T031 [P] [US7] Scaffold `travel-saas-frontend/admin/content.html` from the canonical shell (T006) with `data-page="admin-content"`, active=`المحتوى`, breadcrumb (لوحة الإدارة / المحتوى), title/meta, scripts. (depends T006)
- [ ] T032 [US7] Author the content static content into `travel-saas-frontend/admin/content.html` per `contracts/content-page.contract.md`: header (CTA + export + safe note); **8** content stats; **6** tabs (`role=tablist`/`tab`/`tabpanel`, **all panels in DOM**); Homepage Sections tab (**7** sections + edit/reorder/preview); Destinations / Blog Posts / Featured Deals / Featured Coupons tables (coupon code `dir="ltr"`; reuse `destinations-full.json`/`articles.json`/`deals.json`/`merchant-coupons.json` ids); Pending Review tab (approve/reject/edit/add-note); create/edit content modal (validated); publish/unpublish + delete confirmation modals; homepage preview panel; FAQ **≥5**. Mirror `admin-content.json`. (depends T031, T012 — same file, sequential)
- [ ] T033 [US7] Implement the `admin-content` controller in `travel-saas-frontend/src/js/admin.js`: tab switch (visible panel + `aria-selected`/`aria-current`; panels stay in DOM; optional `#tab` deep link); create/edit validate → toast; feature/unfeature toggle → flip + toast; publish/unpublish + delete → confirm modal → toast; pending-review approve/reject → toast; homepage preview updates from the featured selection (session-only). (depends T005, T032 — edits shared `admin.js`)

**Checkpoint**: All 7 pages functional.

---

## Phase 10: Polish & cross-cutting concerns

**Purpose**: Accessibility, responsive, honesty, stack-compliance, regression, and the QA artifact. (Several are per-file audits → `[P]`; the build/grep/validate gates run once.)

- [ ] T034 [P] Accessibility pass across all 7 `admin/*.html`: visible focus states, full keyboard nav, modal focus management (via `TUI.modal`), labels on all form controls, `aria-invalid`/`aria-describedby` on validated fields, `aria-live` on dynamic count/status/toggle regions, `aria-label` on icon-only buttons, ~44px touch targets, `prefers-reduced-motion` respected.
- [ ] T035 [P] Responsive/360px audit across all 7 `admin/*.html`: no horizontal overflow at 360px; dense tables collapse to stacked labeled cards; KPI/plan/segment/stat grids reflow to one column; sidebar→drawer + scrim; topbar condenses.
- [ ] T036 [P] RTL/LTR audit across all 7 `admin/*.html`: RTL-native rendering correct; flipping `dir="ltr"` does not structurally break the shell, grids, tables→cards, or CSS visuals (English-ready structure).
- [ ] T037 [P] Product-honesty copy audit across all 7 pages: every mutating control carries approved safe wording; no claim of real admin login, suspension, plan/price change, billing, invoice, payment, impersonation, integration check, publishing, export, email/WhatsApp, or persistence; reload restores mock defaults (session-only).
- [ ] T038 Run `cd travel-saas-frontend && npm run build`; confirm the admin pages are fully styled (the T001 glob works) and `assets/css/tailwind.css` regenerates without error.
- [ ] T039 Stack-compliance hard gate (must return ZERO) over `travel-saas-frontend/admin/` + `src/js/admin.js`: `grep -RniE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\("`; external CDN (CSS/JS/font/image); and chart/table libraries (`chart.js|apexcharts|highcharts|d3|echarts|datatables|ag-grid`). Fix any hit.
- [ ] T040 [P] Run `npx html-validate admin/*.html` (all 7 valid: one `<h1>`, correct heading hierarchy, valid landmarks/ARIA); run `npm run format` and `npm run lint:css`.
- [ ] T041 [P] axe-core a11y spot-check each admin page (serve first) against WCAG 2.1 AA; resolve violations.
- [ ] T042 Regression check — open and confirm still render unchanged: Spec 001 `pages/styleguide.html`+`pages/components.html`; Spec 002 `pages/index.html`; Spec 003 `pages/{compare,deals,coupons,deal-details}.html`; Spec 004 `pages/{destinations,destination-details,blog,article}.html`; Spec 005 `pages/{login,register,saved-deals,price-alerts,profile}.html`; Spec 006 `dashboard/index.html`; Spec 007 `dashboard/{deals,create-deal,edit-deal,coupons,create-coupon}.html`; Spec 009 `dashboard/{analytics,integrations,settings}.html`. Confirm `ui.js`/`main.js`/`dashboard.js`/`discovery.js`/`content.js`/`member.js` and `partials/header.html`/`footer.html` are unchanged, and any links to unbuilt merchant bookings/customers (Spec 008) remain coming-soon (no 404).
- [ ] T043 Produce `specs/010-saas-owner-admin-dashboard/qa-results.md` recording every gate above (build pass; HTML validation ×7; zero forbidden-tech/CDN/chart-lib grep hits; **a per-page console-error check — open each of the 7 admin pages with devtools and confirm a clean console**; 360px no-overflow; RTL + LTR-structural; one-H1/hierarchy; admin relative paths; shell + active states + drawer + dropdowns per page; per-page interaction checks; listing-page empty/skeleton states (companies + subscriptions); all destructive actions via custom modals; login-as disabled/safe; all prior specs still render; honest copy) against `quickstart.md`.

---

## Dependencies & execution order

- **Setup (T001–T003)** → **Foundational (T004–T013)** → **User Stories (T014–T033)** → **Polish (T034–T043)**.
- Within Foundational: `admin.js` chain **T003 → T004 → T005** (same file, sequential); shell **T006** depends on T001; catalogs **T007–T012** are `[P]`; **T013** depends on T007/T009/T010.
- Each story: **scaffold (T0xx [P])** → **author page (same file, sequential)** → **controller (edits shared `admin.js`, sequential vs all other controllers)**.
- **`src/js/admin.js` is a global bottleneck**: T004 → T005 → T015 → T018 → T021 → T024 → T027 → T030 → T033 must be done one at a time (one file). The page-authoring tasks (different files) are where the real parallelism lives.
- Story priority order: US1 (P1) → US2 (P1) → US3, US4, US5 (P2) → US6, US7 (P3). After Foundational, US2–US7 page authoring can proceed in parallel; only their `admin.js` controllers serialize.

## Parallel execution examples

- **Foundational data (all distinct files)** — run together: T007, T008, T009, T010, T011, T012 `[P]`; then T013.
- **Page scaffolds (distinct files)** — after T006, run together: T016, T019, T022, T025, T028, T031 `[P]`.
- **Page authoring (distinct files)** — once each scaffold is done, T017 / T020 / T023 / T026 / T029 / T032 can proceed in parallel (each on its own page file); their controllers (T018/T021/T024/T027/T030/T033) then serialize on `admin.js`.
- **Polish audits (distinct concerns)** — T034, T035, T036, T037, T040, T041 `[P]`.

## Implementation strategy

- **MVP = US1** (Phase 3): the distinct admin shell + the platform overview on `admin/index.html` — independently demonstrable and the entry point to every other page. Ship/check this first.
- **Increment 2 = US2** (companies) completes the P1 core owner product (overview + manage agencies).
- **Increment 3 = US3–US5** (company details, plans, subscriptions) — the P2 management depth + commerce.
- **Increment 4 = US6–US7** (analytics, content) — the P3 reporting + curation.
- After each increment, run the relevant slice of Phase 10 (build + grep gate + the page's interaction checks) so regressions surface early. Finish with the full Phase 10 + `qa-results.md`.

**Total: 43 tasks** — Setup 3 · Foundational 10 · US1 2 · US2 3 · US3 3 · US4 3 · US5 3 · US6 3 · US7 3 · Polish 10.
