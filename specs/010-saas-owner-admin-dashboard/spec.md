# Feature Specification: SaaS Owner Admin Dashboard (Travel SaaS Platform)

**Feature Branch**: `010-saas-owner-admin-dashboard`
**Created**: 2026-06-05
**Status**: Draft
**Input**: User description: "Create Spec 010: SaaS Owner Admin Dashboard for the Travel SaaS Platform. Build the owner/admin side after the public website (002), discovery (003), content/SEO (004), member pages (005), and merchant dashboard (006–009) are complete. Create and fully implement seven standalone pages inside a new `admin/` directory: `index.html` (admin-overview), `companies.html` (admin-companies), `company-details.html` (admin-company-details), `plans.html` (admin-plans), `subscriptions.html` (admin-subscriptions), `analytics.html` (admin-analytics), `content.html` (admin-content). Use a dedicated admin shell — visually related to the product but clearly distinct from the merchant dashboard shell — with RTL sidebar, topbar, mobile drawer, breadcrumb, page header, active states, notifications dropdown, admin user menu, quick-action dropdown, and a small footer. Reuse the Spec 001 foundation (local Tailwind build, design tokens, cards/badges/buttons/forms/modals/drawers/toasts/empty/skeleton states, `window.TUI`). Create or extend `src/js/admin.js` for admin interactions; avoid touching `ui.js`/`main.js`. The owner manages travel companies, SaaS plans, subscriptions, platform content, platform analytics, and integration health through frontend-only actions (modals, dropdowns, toggles, toasts, custom confirmations). Add backend-ready mock data (admin-overview / admin-companies / admin-plans / admin-subscriptions / admin-platform-analytics / admin-content / admin-integration-health JSON), reusing existing catalogs where useful; baseline content renders as static HTML without client-side fetch. Frontend-only honesty: never real admin login, company suspension, plan change, billing, invoices, payments, impersonation, integration monitoring, content publishing, exports, email/WhatsApp, or persistence — بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه النسخة / لا توجد مدفوعات فعلية / لا يتم تسجيل دخول كالشركة فعليًا / قابل للربط لاحقًا. Arabic RTL primary, English-ready, mobile-first (usable at 360px, no horizontal overflow), WCAG 2.1 AA, no browser dialogs, no chart library, no CDN, no forbidden frameworks. Do not rebuild Spec 001, do not rewrite Specs 002–009, do not change the constitution, do not remove existing sections; only safe link additions to merchant pages if needed. Produce a `qa-results.md` after implementation."

## Clarifications

### Resolved at authoring time (no clarification markers needed)

- **`مراقبة التكاملات` (Integration Monitoring) sidebar link**: There is no standalone integration-monitoring page in this feature's scope. Resolved by linking this sidebar item to the integration-health section of the analytics page (`analytics.html#integrations`), which both `admin/index.html` (Integration Health Overview) and `admin/analytics.html` (integration health trend + integration-errors table) surface. No dead link, no 404.
- **`الإعدادات` (Admin Settings) sidebar link**: No admin-settings page exists in this feature. Resolved by treating it as a **coming-soon** control: a visible toast ("قريبًا — إعدادات لوحة الإدارة / حالة تجريبية") rather than a link to a missing page. This honors the constitution's No-Dead-Interactions principle.
- **"Add company / add subscription / add content" creation**: These are **frontend-only**. On valid submit the page shows a success toast and MAY optimistically prepend a mock row/card to the visible list within the current session; nothing persists and a reload restores the mock defaults. No real record is created.
- **`?id=<company-id>` on `company-details.html`**: The page renders a complete default mock company from static HTML so it works with no query string. If an `id` is present it MAY be reflected in headings/labels for presentation, but the page never depends on a fetch to show baseline content.
- **"Login as company" impersonation**: Always rendered as a **visibly disabled / safe** control. Activating it (where surfaced) opens a safety modal/toast stating impersonation is not active in this frontend prototype — never a real session.
- **Numbering note**: `specs/008-` was never created (merchant bookings/customers, intended Spec 008, do not exist as files). This feature is **010** by explicit request and continues to treat the unbuilt merchant bookings/customers pages and any SaaS-owner billing/support surface beyond these seven pages as coming-soon, not as broken links.
- **Stack-context framing**: Following the established convention of prior specs in this project (006/007/009), this spec names already-fixed, constitution-mandated platform surfaces (the existing local Tailwind build, `window.TUI`, `data-*` patterns, `admin/` file paths, mock-data filenames) where they are **constraints inherited from the foundation**, not new technical decisions. The WHAT/WHY framing is preserved in user stories, requirements, and success criteria.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Platform owner sees the whole platform at a glance (Priority: P1)

The SaaS platform owner opens the admin workspace (`admin/index.html`) and immediately understands the health of the entire platform: how many travel companies exist and their states, how many subscriptions are active, an estimated revenue figure, which integrations have issues, which subscriptions need attention, and what happened recently — then jumps to any management area. This is the owner's home base and the entry point to every other admin page.

**Why this priority**: Without a working admin shell and an overview that orients the owner, none of the deeper management pages have a usable home or navigation. This story delivers the dedicated admin shell (sidebar, topbar, mobile drawer, breadcrumb, page header, dropdowns, footer) plus a client-presentable platform summary — the minimum that makes the owner side feel real and demonstrable on its own.

**Independent Test**: Open `admin/index.html` with no backend. Confirm the admin shell renders and is visually distinct from the merchant dashboard, the sidebar marks `الرئيسية` active, ≥10 platform KPI cards show, the activity feed lists ≥10 items, top companies (≥8) link to `company-details.html?id=…`, integration health and subscription-alert cards render, CSS chart-like previews appear with no chart library, the admin-notes checklist toggles, quick actions navigate/toast/modal, the mobile drawer and topbar dropdowns work at 360px with no horizontal overflow, and every honesty note ("بيانات تجريبية / إجراء تجريبي") is visible.

**Acceptance Scenarios**:

1. **Given** the owner loads `admin/index.html` with JavaScript disabled, **When** the page renders, **Then** the H1 "لوحة تحكم المنصة", all KPI cards, the activity feed, the top-companies list, integration health cards, subscription alerts, analytics previews, quick-action links, and the admin-notes checklist are all present and readable as static HTML.
2. **Given** the owner is on a 360px-wide viewport, **When** they open the mobile admin sidebar/drawer and the topbar notifications and user-menu dropdowns, **Then** each opens, is operable, traps/returns focus appropriately, and the layout has no horizontal scrollbar.
3. **Given** the owner clicks a top-company row action, **When** they choose "view company", **Then** the browser navigates to `company-details.html?id=<id>`; choosing change-plan / suspend / contact-owner opens a modal or shows a toast — never a browser dialog and never a dead button.
4. **Given** the owner toggles an admin-notes checklist item or clicks "Export mock", **When** the action fires, **Then** the checkbox state changes visibly (and/or a toast appears) and the copy makes clear no real export/persistence happened.

---

### User Story 2 - Owner manages the companies using the SaaS (Priority: P1)

The owner opens `admin/companies.html` to browse every travel company on the platform, search and filter by plan / subscription status / company status / country / activity / integration / trial-ending, sort the list, see a live result count with active-filter chips, and take frontend-only actions per company (view, change plan, suspend/reactivate, extend trial, add note, contact owner) plus bulk actions — all without touching a real account.

**Why this priority**: Managing the agencies on the platform is the core job of the SaaS owner. Combined with the overview (US1), browse-and-act on companies is the second half of a minimally useful owner product, so it is also P1.

**Independent Test**: Open `admin/companies.html`. Confirm ≥12 company rows/cards render statically, the search/filter/sort controls narrow the visible set and update an `aria-live` result count with removable active-filter chips and a reset, row action menus open the correct modals/toasts, "Login as company" is visibly disabled/safe, bulk select shows a count and offers bulk actions (bulk suspend via a custom confirm modal), the Add Company / Change Plan / Suspend-Reactivate / Add Note modals validate and toast on submit, and segment cards filter the list — all frontend-only with no dead controls.

**Acceptance Scenarios**:

1. **Given** the full company list, **When** the owner types an owner email into search and selects plan = Enterprise and status = Trial, **Then** only matching rows remain visible, the result count and active-filter chips update via `aria-live`, and "reset" restores the full list.
2. **Given** a company row, **When** the owner opens its action menu and selects "Suspend", **Then** a custom confirmation modal (reason + notify-owner placeholder) appears, and confirming shows a toast and may update the row's status badge visually — no real suspension, no `confirm()`.
3. **Given** the Add Company modal, **When** the owner submits with an empty required field or an invalid owner email, **Then** inline validation blocks submit with `aria-invalid`/`aria-describedby` messaging; **When** all required fields are valid, **Then** the modal closes, a success toast appears, an optional mock row may be prepended, and no real company is created.
4. **Given** several rows are selected, **When** the owner triggers "suspend selected", **Then** a custom confirmation modal appears showing the selected count, and confirming toasts the mock outcome.

---

### User Story 3 - Owner inspects one company in depth (Priority: P2)

From the companies list or the overview, the owner opens `admin/company-details.html?id=<id>` to review a single agency's profile, subscription summary, usage limits (progress bars), recent activity timeline, top deals, booking stats, integration status, a mock billing timeline, admin notes, and a support/follow-up panel — and to run the same per-company actions (change plan, suspend/reactivate, extend trial, add note, contact owner, reset usage, login-as-disabled) as frontend-only mocks.

**Why this priority**: Drill-down depth makes the companies module genuinely useful, but it builds on US2 (the list that links here) and the shell from US1, so it is P2.

**Independent Test**: Open `company-details.html` with and without an `?id=` value. Confirm a complete default company profile renders statically either way, the subscription summary and ≥8 usage progress bars show used/limit/percentage with near-limit warnings, the activity timeline lists ≥10 items, top-deals and integration-status sections render, the billing timeline shows mock invoices with view/download/send actions that toast, the admin-notes and support panels render, and every action modal (change plan, extend trial, suspend/reactivate, reset usage confirm, add note, login-as safety) opens and resolves to a toast — no real billing/impersonation/suspension.

**Acceptance Scenarios**:

1. **Given** the page loads with no `?id=`, **When** it renders, **Then** a complete default mock company profile and all detail sections appear without any failed fetch or empty primary content.
2. **Given** a usage bar at or above its near-limit threshold, **When** the page renders, **Then** that bar shows a visible warning treatment and an accessible label conveying used/limit/percentage.
3. **Given** the billing timeline, **When** the owner clicks "download invoice" or "send invoice", **Then** a toast confirms the mock action and the copy states no real invoice/file/email was produced.
4. **Given** the "reset usage" action, **When** the owner triggers it, **Then** a custom confirmation modal appears and confirming toasts the mock result without changing any real data.

---

### User Story 4 - Owner manages SaaS plans and limits (Priority: P2)

The owner opens `admin/plans.html` to view the four SaaS plans (Starter, Growth, Pro, Enterprise) as cards with mock monthly/yearly prices, per-plan limits and feature flags, and active-company counts; flips a monthly/yearly toggle that updates displayed prices; compares plans in a features table; and runs frontend-only plan actions (create/edit via validated modal, duplicate, disable/enable via custom confirm, view companies on a plan).

**Why this priority**: Plans define the commercial structure the owner curates, and they feed the subscriptions and company views; valuable but not part of the first usable slice, so P2.

**Independent Test**: Open `admin/plans.html`. Confirm four plan cards render statically with limits/features/status/active-company counts, the monthly/yearly toggle switches all displayed prices visually, the features-comparison table lists every limit/feature row across all four plans, the create/edit modal validates and toasts, duplicate toasts (or opens a pre-filled modal), disable uses a custom confirm modal that states companies are not affected in the prototype, and "view companies on plan" filters/links — no real pricing or plan change.

**Acceptance Scenarios**:

1. **Given** the plans page in monthly mode, **When** the owner flips the monthly/yearly toggle, **Then** every plan card's displayed price updates to its yearly value with a visible active-state on the toggle, and no network request occurs.
2. **Given** the create/edit plan modal, **When** the owner submits with a missing required field, **Then** validation blocks submit with accessible error messaging; **When** valid, **Then** a success toast appears and the copy notes no real plan/price change.
3. **Given** a plan card, **When** the owner chooses "disable", **Then** a custom confirmation modal warns that companies on this plan are not affected in the prototype, and confirming toasts the mock outcome.

---

### User Story 5 - Owner reviews subscriptions, renewals, and invoices (Priority: P2)

The owner opens `admin/subscriptions.html` to review every mock subscription with amounts, billing cycles, statuses, payment statuses, renewal/last-payment/trial dates and a mock invoice id; filter/sort/search; see stats (active/trial/past-due/cancelled/renewals/MRR/ARR/failed); and run frontend-only row and bulk actions (view company, change plan, extend trial, mark paid, send reminder, cancel via custom confirm, view/download invoice via mock modals).

**Why this priority**: Subscription oversight is essential owner work but depends on plans (US4) and companies (US2/US3) being meaningful first, so P2.

**Independent Test**: Open `admin/subscriptions.html`. Confirm ≥12 subscription rows render statically with all columns, stats cards show MRR/ARR estimates, search/filter/sort narrow the set with a result count, row actions open the right modals/toasts (subscription detail modal, invoice mock modal with line items, extend-trial modal, cancel confirm modal), bulk actions operate on the selected set, and "send reminder" / "mark paid" toast as mocks — no real billing, invoices, payments, or emails.

**Acceptance Scenarios**:

1. **Given** the subscriptions list, **When** the owner filters by status = Past Due and sorts by next-renewal, **Then** only matching rows remain, ordered correctly, with the result count updated.
2. **Given** a subscription row, **When** the owner opens "view invoice", **Then** an invoice mock modal shows id/company/amount/status/date/line-items with download/send actions that toast and state no real invoice/file was generated.
3. **Given** a subscription row, **When** the owner chooses "cancel subscription", **Then** a custom confirmation modal appears, and confirming toasts the mock cancellation without billing impact.

---

### User Story 6 - Owner reads platform-level analytics (Priority: P3)

The owner opens `admin/analytics.html` for a platform-wide view: a date-range selector and compare toggle (active-state only), ≥12 platform KPI cards, eight CSS/static chart-like visuals (companies growth, subscription distribution, top destinations, top coupon categories, booking inquiries over time, revenue estimate, trial-to-paid, integration health trend) built without any chart library, several insight tables (top companies / destinations / deals / integration errors / high-risk subscriptions), recommendation cards, and a mock export/report modal.

**Why this priority**: Analytics is high-value reporting but is read-only and depends on the rest of the model existing; it is a strong P3.

**Independent Test**: Open `admin/analytics.html`. Confirm ≥12 KPI cards and all eight chart-like visuals render with pure CSS/HTML (no external chart/table library), the date-range and compare controls toggle active state (and toast that data is illustrative), the five tables render with action toasts, recommendation cards render with action toasts, and the export/report modal offers CSV/PDF/schedule/send-to-owner mocks — all clearly labelled illustrative, not live tracking.

**Acceptance Scenarios**:

1. **Given** the analytics page, **When** it renders with no backend, **Then** all KPI cards and all eight chart-like visuals appear as CSS/HTML with no chart-library request and a visible "بيانات تجريبية وليست تتبعًا مباشرًا" note.
2. **Given** the date-range selector or compare toggle, **When** the owner changes it, **Then** the active state updates and a toast clarifies the data is illustrative — no live query.
3. **Given** the export/report modal, **When** the owner selects "export CSV/PDF" or "send to owner email", **Then** a toast confirms the mock action and states no real file/email was produced.

---

### User Story 7 - Owner manages platform content (Priority: P3)

The owner opens `admin/content.html` to curate platform content across tabs (Homepage Sections, Destinations, Blog Posts, Featured Deals, Featured Coupons, Pending Review): see content stats, switch tabs, view each tab's table/cards, run create/edit (validated modal), feature/unfeature toggles, publish/unpublish and delete via custom confirm modals, approve/reject pending review items, and preview the homepage featured selection — all frontend-only with no real CMS.

**Why this priority**: Content curation rounds out the owner toolkit and reuses existing catalogs, but it is the most peripheral to commercial operations, so P3.

**Independent Test**: Open `admin/content.html`. Confirm content stats and all six tabs render statically, tabs switch visibly, each tab's table/cards render with actions, the create/edit modal validates and toasts, feature/unfeature toggles flip with a toast, publish/unpublish and delete use custom confirm modals, pending-review approve/reject toast as mocks, and the homepage preview panel reflects the featured selection — no real publishing/deletion/persistence.

**Acceptance Scenarios**:

1. **Given** the content page, **When** the owner clicks a tab (e.g., "Pending Review"), **Then** that tab's panel becomes visible, the others hide, and the active tab is conveyed accessibly — with all tab panels present in the DOM so content is readable without JavaScript.
2. **Given** a content item, **When** the owner toggles "feature", **Then** the toggle flips visually, a toast confirms the mock change, and the copy states the homepage is not really affected in this version.
3. **Given** a content item, **When** the owner chooses "delete" or "publish/unpublish", **Then** a custom confirmation modal appears and confirming toasts the mock outcome without any real publish/delete.

---

### Edge Cases

- **No JavaScript**: every page's core content (KPIs, feeds, tables, cards, plan cards, comparison table, all tab panels, all modal *content* containers, FAQs, honesty notes) is present in the static HTML and remains readable; only enhancements (drawer, dropdowns, filters, sort, tab switching, toggles, modals, toasts) require JS.
- **Empty / loading**: each list/table/widget defines a styled empty state and a skeleton/loading placeholder so a future backend integration has a defined zero/loading view; filtering to zero results shows the empty state, not a blank area.
- **Narrow viewport (360px)**: dense tables collapse to stacked responsive cards; no element causes horizontal overflow; touch targets stay ~44px.
- **Destructive actions**: suspend, bulk suspend, cancel subscription, disable plan, reset usage, publish/unpublish, delete content, and login-as-company all route through custom `.modal` confirmations or safe modals — never `confirm()`/`alert()`/`prompt()`.
- **Impersonation safety**: "Login as company" is never functional; it is disabled or opens a safety modal explaining impersonation is inactive in the prototype.
- **Honesty under every mutating action**: any control implying a real effect (suspend, change plan, bill, invoice, pay, publish, export, send email/WhatsApp, save settings) is accompanied by visible safe wording; no copy claims a real backend effect.
- **Missing future surfaces**: `الإعدادات` (admin settings) and any unbuilt page/section show coming-soon toasts or safe placeholders, never 404s or dead controls.
- **`?id=` absent or unknown** on company-details: the page falls back to a complete default mock company rather than rendering blank.
- **RTL/LTR**: the layout is RTL-native; flipping to LTR (for the English-ready structure) must not structurally break the shell, grids, tables→cards, or chart-like visuals.

## Requirements *(mandatory)*

### Functional Requirements — Admin Shell & Navigation

- **FR-001**: The feature MUST deliver seven standalone static pages under a new `admin/` directory: `index.html`, `companies.html`, `company-details.html`, `plans.html`, `subscriptions.html`, `analytics.html`, `content.html`.
- **FR-002**: Every admin page MUST use one shared, dedicated **admin shell** consisting of an RTL sidebar, a topbar, a mobile sidebar/drawer, a breadcrumb, a page header, a notifications dropdown, an admin user-menu dropdown, a quick-action dropdown, and a small footer.
- **FR-003**: The admin shell MUST be visually related to the product (same brand tokens/foundation) yet **clearly distinct** from the merchant dashboard shell (e.g., distinct accent usage / operational owner-focused treatment), so an owner can tell at a glance they are in the platform-admin context, not a merchant account.
- **FR-004**: The admin sidebar MUST contain these items with these targets: `الرئيسية`→`index.html`, `الشركات`→`companies.html`, `الخطط`→`plans.html`, `الاشتراكات`→`subscriptions.html`, `التحليلات`→`analytics.html`, `المحتوى`→`content.html`, `مراقبة التكاملات`→`analytics.html#integrations`, `الإعدادات`→coming-soon toast (no page), `العودة للموقع`→`../pages/index.html`, `لوحة الشركات`→`../dashboard/index.html`.
- **FR-005**: Each page MUST mark the correct active sidebar item (overview→`الرئيسية`; companies & company-details→`الشركات`; plans→`الخطط`; subscriptions→`الاشتراكات`; analytics→`التحليلات`; content→`المحتوى`) and MUST render the specified breadcrumb trail per page.
- **FR-006**: Each page MUST set its specified `data-page` attribute on the root (`admin-overview`, `admin-companies`, `admin-company-details`, `admin-plans`, `admin-subscriptions`, `admin-analytics`, `admin-content`), exactly one `<h1>` with the specified Arabic title, and an Arabic `<title>` and meta description.
- **FR-007**: All relative paths MUST resolve from `admin/`: CSS at `../assets/css/tailwind.css`; scripts at `../src/js/ui.js`, `../src/js/main.js`, and `../src/js/admin.js`; assets at `../assets/…`; public pages at `../pages/…`; merchant dashboard at `../dashboard/…`. Intra-admin links MUST be relative within `admin/` (e.g., `company-details.html?id=…`).
- **FR-008**: The mobile drawer, the notifications dropdown, the admin user-menu dropdown, and the quick-action dropdown MUST all open/close and be keyboard- and touch-operable at 360px width, reusing existing `window.TUI` primitives and `data-*` patterns.
- **FR-009**: Admin interactions MAY live in a new or extended `src/js/admin.js` loaded with `defer`; the feature MUST NOT modify `src/js/ui.js` or `src/js/main.js` unless strictly unavoidable, and MUST NOT add inline page JavaScript except JSON-LD or safe inline mock data.

### Functional Requirements — Overview (`admin/index.html`)

- **FR-010**: The overview MUST present a page header with the H1 "لوحة تحكم المنصة", an owner-workspace description, quick-action buttons (إضافة شركة تجريبية / إنشاء خطة / مراجعة الاشتراكات / إدارة المحتوى), and a visible "البيانات والإجراءات هنا تجريبية" honesty note.
- **FR-011**: The overview MUST display **≥10 platform KPI cards** covering at least: total companies, active companies, trial accounts, suspended companies, active subscriptions, platform booking requests, total deals, total coupons, estimated MRR, integration issues, content pending review, and trials nearing expiry.
- **FR-012**: The overview MUST display a platform activity feed of **≥10 mock items**, each with an icon, event text, the related company/content name, a time, and a severity/type badge (covering registrations, plan upgrades, integration-test failures, expiring subscriptions, featured deals, pending coupons, content updates, trial extensions, suspensions, and support notes — all mock).
- **FR-013**: The overview MUST display a top-companies table/list of **≥8 companies** with columns company, plan, subscription status, deals, bookings, customers, last active, MRR mock, and an action menu offering view→`company-details.html?id=<id>`, change-plan (mock), suspend (mock), and contact-owner (mock).
- **FR-014**: The overview MUST display integration-health cards for Travelpayouts, Booking Affiliate, Coupon API, Email Notifications, WhatsApp, Scraping Review Queue, Amadeus API, and Duffel API — each with a status, an affected-companies count, a last-check (mock) time, and an action button.
- **FR-015**: The overview MUST display subscription-alert cards/list (trials ending, past due mock, renewal soon, cancelled mock, plan limit exceeded), each with an action.
- **FR-016**: The overview MUST display a platform-analytics preview using CSS/HTML chart-like visuals (companies growth, subscriptions distribution, top destinations, booking inquiries over time, estimated MRR trend) with **no external chart library**.
- **FR-017**: The overview MUST display a quick-admin-actions area (add company, create plan, review subscriptions, manage content, view analytics, integration health, export mock) where every action navigates, opens a modal, or shows a toast.
- **FR-018**: The overview MUST display an admin-notes/tasks checklist (مراجعة الشركات التجريبية / تحديث الخطط / مراجعة المحتوى المميز / مراجعة مشاكل التكاملات / متابعة اشتراكات قاربت على الانتهاء) whose items toggle visually.
- **FR-019**: The overview MUST include skeleton/loading and empty-state patterns for its dashboard widgets.

### Functional Requirements — Companies (`admin/companies.html`)

- **FR-020**: The page MUST present a header (H1 "الشركات", description, CTA "إضافة شركة تجريبية", export mock, honesty note "لا يتم إنشاء أو تعديل شركات حقيقية في هذه النسخة") and stats cards (total, active, trial, suspended mock, past due mock, enterprise, new this month, needs review).
- **FR-021**: The page MUST provide search (company/owner/email) and filters (plan, subscription status, company status, country, activity, integration status, trial ending) plus a reset control, and a sort selector (الأحدث / آخر نشاط / الأعلى طلبات / الأعلى إيرادًا تقديريًا / قاربت التجربة على الانتهاء / حسب الخطة).
- **FR-022**: Filtering/searching/sorting MUST update the visible set, a result count, and removable active-filter chips, announced via `aria-live`, with a reset that restores the full list.
- **FR-023**: The page MUST render **≥12 company rows** (table on wide viewports, stacked cards at 360px) with columns checkbox, company name, owner, email (`dir="ltr"`), country, plan, subscription status, company status, deals count, booking inquiries, last active, MRR mock, and an actions menu.
- **FR-024**: Each row's actions MUST include View details→`company-details.html?id=<id>`, Change plan, Suspend/reactivate, Extend trial, Add admin note, Contact owner (mock), and a **disabled/safe** "Login as company" control that (where activated) explains impersonation is inactive in this prototype.
- **FR-025**: The page MUST provide bulk actions (select all, selected count, change plan, extend trial, export, add note, suspend selected) where **bulk suspend uses a custom confirmation modal**.
- **FR-026**: The page MUST provide an Add Company modal (company name required, owner name required, owner email required `dir="ltr"`, phone, country, city, plan, trial days, notes) that validates required fields and email, toasts on valid submit, MAY prepend a mock row, and creates no real company.
- **FR-027**: The page MUST provide a Change Plan modal (company, current plan, new plan, billing cycle, reason/note) that toasts on save; a Suspend/Reactivate confirmation modal (reason, notify-owner placeholder toggle) that toasts and MAY update status visually; and an Add Admin Note modal (company, note required, note type, follow-up date) that toasts on save.
- **FR-028**: The page MUST display company-segment cards (Trials ending, Past due, Enterprise, Needs review, High usage, No activity, Integration issues) that, when clicked, filter the visible list.
- **FR-029**: The page MUST include styled empty and skeleton states and a FAQ of **≥5 questions** confirming companies are not really created, plans not really changed, companies not really suspended, no real impersonation, and no real owner notification.

### Functional Requirements — Company Details (`admin/company-details.html`)

- **FR-030**: The page MUST render a complete default mock company from static HTML (working with or without `?id=<company-id>`) and a profile header (company name, status badge, plan badge, owner, email, phone, country/city, website, last active) with actions change plan, suspend/reactivate, extend trial, add note, contact owner, login-as (disabled/safe), and back-to-companies; plus a frontend-only note ("هذا ملف شركة تجريبي / لا يتم تنفيذ تغييرات حقيقية").
- **FR-031**: The page MUST show a subscription summary (current plan, billing cycle, amount, subscription status, next renewal, trial ends, payment status mock, plan-usage summary, upgrade/downgrade mock action).
- **FR-032**: The page MUST show usage-limit progress bars for **≥8 dimensions** (deals, coupons, team users, integrations, booking inquiries, customers, storage placeholder, content pages), each conveying used, limit, percentage, and a near-limit warning treatment.
- **FR-033**: The page MUST show a recent-activity timeline of **≥10 mock items** (deal created, booking request, coupon created, integration configured, note added, plan changed mock, payment status updated mock, login mock, content updated, API test failed mock).
- **FR-034**: The page MUST show a top-deals table/list (deal title, destination, clicks, inquiries, coupon copies, status, action) and booking-stats cards (total requests, new, confirmed mock, pending payment, cancelled, average amount, top destination).
- **FR-035**: The page MUST show integration-status entries (Travelpayouts, Booking Affiliate, Coupon API, Email, WhatsApp, Scraping Queue, Amadeus, Duffel) each with a status and an action, and a billing timeline of mock invoices/payments (invoice id, date, amount, status, view/download/send mock actions) with **no real billing**.
- **FR-036**: The page MUST show admin notes (with an add-note form/modal) and a support/follow-up panel (priority, next follow-up date, assigned admin, issue summary, action buttons).
- **FR-037**: The page MUST provide action modals — change plan, suspend/reactivate confirmation, extend trial, add note, contact owner (mock), reset usage confirmation, and a login-as safety modal — and a FAQ of **≥5 questions** confirming no real plan change, no real invoices, no real impersonation, no real suspension, and that usage data is not live.

### Functional Requirements — Plans (`admin/plans.html`)

- **FR-038**: The page MUST present a header (H1 "الخطط والباقات", description, CTA "إنشاء خطة تجريبية", monthly/yearly toggle, honesty note "لا يتم إنشاء أو تعديل خطط حقيقية") and four plan cards (Starter, Growth, Pro, Enterprise).
- **FR-039**: Each plan card MUST show mock monthly and yearly prices, a description, a target user, an active-companies count, status, the full limit/feature set (deals, coupons, team users, booking inquiries, customers, integrations, analytics level, AI-recommendations placeholder, scraping review queue, support level, custom-domain placeholder), and actions edit, duplicate, disable/enable, and view-companies-on-plan.
- **FR-040**: The monthly/yearly toggle MUST switch all displayed plan prices visually with a clear active state and no network request.
- **FR-041**: The page MUST include a features-comparison table with rows for deals, coupons, team users, booking inquiries, customers, integrations, analytics, content pages, AI-recommendations placeholder, scraping review, support, custom domain, white-label placeholder, and API-access placeholder across all four plans.
- **FR-042**: The page MUST provide a create/edit plan modal (name, monthly price, yearly price, description, limits, feature toggles, status, support level, note) with validation that toasts on save; a duplicate action that toasts or opens a pre-filled modal; a disable confirmation modal stating companies on the plan are not affected in the prototype; a companies-on-plan preview (company, status, renewal, usage, action); and a FAQ of **≥5 questions** confirming no real price change, no effect on companies, Enterprise additions are mock, no real payment activation, and limits are backend-ready later.

### Functional Requirements — Subscriptions (`admin/subscriptions.html`)

- **FR-043**: The page MUST present a header (H1 "الاشتراكات", description, CTA "إضافة اشتراك تجريبي", export mock, honesty note "لا توجد مدفوعات أو فواتير حقيقية") and stats cards (active, trial, past due mock, cancelled mock, renewals this month, MRR estimate, ARR estimate, failed payments mock).
- **FR-044**: The page MUST provide search and filters (company, plan, status, billing cycle, renewal date, payment status, trial ending, reset) and a sort selector (next renewal, highest amount, newest, past due, trial ending) that update the visible set and a result count (announced via `aria-live`, with removable active-filter chips), a **styled empty state** shown when zero subscriptions match the active filters, and a **skeleton/loading** placeholder — satisfying the listing-page contract (Constitution VII).
- **FR-045**: The page MUST render **≥12 subscription rows** with columns checkbox, company, plan, amount, billing cycle, status, payment status, next renewal, last payment, trial ends, invoice mock, and an actions menu (view company, change plan, extend trial, mark paid mock, send reminder mock, cancel mock, view invoice mock, download invoice mock).
- **FR-046**: The page MUST provide bulk actions (export, send reminders, extend trials, mark review needed, cancel selected mock), a subscription detail modal (company, plan, amount, renewal, payment status, invoice list, notes), an invoice mock modal (invoice id, company, amount, status, date, line items, download/send mock), an extend-trial modal (company, current trial end, extension days, reason) that toasts on save, and a **cancel-subscription custom confirmation modal**.
- **FR-047**: The page MUST include a FAQ of **≥5 questions** confirming no real payment collection, no real invoices, that trials can be extended only as a mock, plans changed only as a mock, and no real reminder is sent.

### Functional Requirements — Analytics (`admin/analytics.html`)

- **FR-048**: The page MUST present a header (H1 "تحليلات المنصة", date-range selector, export mock, compare-period toggle, honesty note "البيانات تجريبية وليست تتبعًا مباشرًا") and **≥12 KPI cards** (total visitors mock, companies growth, active agencies, booking inquiries, deal clicks, coupon copies, estimated MRR, estimated ARR, churn risk mock, trial conversion mock, integration issues, content views).
- **FR-049**: The page MUST render **eight** CSS/HTML chart-like visuals (companies growth, subscription distribution, top destinations across platform, top coupon categories, booking inquiries over time, revenue estimate, trial-to-paid conversion, integration health trend) with **no external chart library**.
- **FR-050**: The page MUST render five insight tables — top companies (company, plan, revenue estimate, bookings, deals, status); top destinations (destination, visits, bookings, coupon copies, trend); top performing deals (deal, company, clicks, inquiries, conversion estimate); integration errors (integration, company, issue, severity, action); high-risk subscriptions (company, risk reason, renewal date, action) — with action controls that toast.
- **FR-051**: The page MUST provide platform-insight recommendation cards (improve onboarding, follow up trial accounts, review integration issues, promote top destinations, review coupons expiring soon) with action toasts; an export/report modal (export CSV, export PDF, schedule report, send-to-owner-email — all mock); date-range and compare controls that change active state only (with an illustrative-data toast); and a FAQ of **≥5 questions** confirming analytics are not live, can connect to Google Analytics later, revenue is not real, no real report export, and conversions are trackable later.

### Functional Requirements — Content (`admin/content.html`)

- **FR-052**: The page MUST present a header (H1 "إدارة المحتوى", description, CTA "إنشاء محتوى تجريبي", export mock, honesty note "لا يتم نشر محتوى حقيقي في هذه النسخة") and content stats (blog posts, destinations, featured deals, featured coupons, homepage sections, drafts, pending review, published mock).
- **FR-053**: The page MUST provide six tabs — Homepage Sections, Destinations, Blog Posts, Featured Deals, Featured Coupons, Pending Review — that switch visibly and accessibly, with **all tab panels present in the DOM** so content is readable without JavaScript.
- **FR-054**: The Homepage Sections tab MUST list the sections hero, featured deals, destinations teaser, coupons teaser, guides teaser, testimonials, and final CTA with columns section name, status, item count, last updated, featured order, and actions (edit mock, reorder mock, preview mock).
- **FR-055**: The Destinations tab MUST list destination, region, status, related deals, related articles, featured, last updated, actions; the Blog Posts tab MUST list title, category, author, status, reading time, related destination, last updated, actions.
- **FR-056**: The Featured Deals tab MUST list deal, company, destination, status, featured position, expiry, actions; the Featured Coupons tab MUST list coupon code (`dir="ltr"`), provider, discount, status, expiry, featured, actions.
- **FR-057**: The Pending Review tab MUST list content type, title, source, reason, submitted by, date, and actions approve mock, reject mock, edit mock, add note.
- **FR-058**: The page MUST provide a create/edit content modal (content type, title, slug, status, category, summary, featured toggle, notes) that toasts on save; feature/unfeature toggles that flip visually and toast; publish/unpublish and delete **custom confirmation modals**; a homepage preview panel reflecting the featured selection; and a FAQ of **≥5 questions** confirming no real publishing, CMS-connectable later, featured items do not really affect the live homepage now, imported content is reviewable, and no real deletion.

### Functional Requirements — Product Honesty (cross-cutting)

- **FR-059**: No page may claim that any admin action is saved to a database, that a company is really suspended/activated, that a plan/price is really changed, that a subscription is really billed, that an invoice/payment is real, that impersonation is active, that integration health is really checked, that content is really published, that an export file is generated, that an email/WhatsApp notification is sent, or that data is live.
- **FR-060**: Every mutating control MUST be accompanied by visible safe wording drawn from the approved set (بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه النسخة / لا يتم تنفيذ تغيير حقيقي / لا توجد مدفوعات فعلية / لا يتم تسجيل دخول كالشركة فعليًا / قابل للربط لاحقًا بلوحة إدارة حقيقية / قابل للربط لاحقًا بنظام اشتراكات ودفع / حالة تجريبية).
- **FR-061**: State is **frontend/session-only**: any optimistic UI change (added row, toggled status, checklist state) is not persisted, and a reload restores the mock defaults.

### Functional Requirements — Data (mock, backend-ready)

- **FR-062**: The feature MUST add local mock-data catalogs under `assets/data/`: `admin-overview.json`, `admin-companies.json`, `admin-plans.json`, `admin-subscriptions.json`, `admin-platform-analytics.json`, `admin-content.json`, and `admin-integration-health.json`, and MAY reuse existing catalogs (`merchant-deals.json`, `merchant-coupons.json`, `merchant-bookings.json`, `merchant-customers.json`, `destinations-full.json`, `articles.json`) where useful.
- **FR-063**: Pages MUST NOT depend on client-side fetch to display their primary content; baseline content is authored as static HTML, and the JSON catalogs exist as backend-ready reference/mock data.
- **FR-064**: The company catalog MUST carry at least: id, companyName, ownerName, ownerEmail, phone, country, city, website, plan, subscriptionStatus, companyStatus, dealsCount, couponsCount, bookingRequests, customersCount, integrationsEnabled, lastActive, trialEndsAt, monthlyRevenueMock, usageLimits, recentActivity, adminNotes — with company statuses drawn from {Active, Trial, Suspended mock, Past Due mock, Cancelled mock, Pending Review} and subscription statuses from {Active, Trial, Past Due mock, Cancelled mock, Expiring Soon, Manual Review}.
- **FR-065**: The plan catalog MUST carry at least: id, name, monthlyPrice, yearlyPrice, dealsLimit, couponsLimit, teamUsers, bookingInquiries, customersLimit, integrationsLimit, analyticsLevel, AIRecommendations, scrapingReviewQueue, supportLevel, customDomain, status — for plans Starter, Growth, Pro, Enterprise.
- **FR-066**: The subscription catalog MUST carry at least: id, company, plan, amount, billingCycle, status, paymentStatus, nextRenewal, lastPayment, trialEndsAt, invoiceMockId, notes.
- **FR-067**: The content catalog MUST cover homepage sections, destinations, blog posts, featured deals, featured coupons, and pending-review content, each carrying at least status, author, lastUpdated, and a featured flag.

### Functional Requirements — Accessibility, Performance & Compatibility (cross-cutting)

- **FR-068**: Every page MUST target WCAG 2.1 AA: visible focus states, full keyboard navigation, modal focus management via existing `window.TUI`, labels for all form controls, `aria-invalid`/`aria-describedby` on validated fields, `aria-live` for dynamic counts/status/toggle updates, `aria-label` on icon-only buttons, sufficient contrast, ~44px touch targets, and respect for reduced-motion preferences.
- **FR-069**: Every page MUST be mobile-first and usable at 360px with **no horizontal overflow**, exactly one `<h1>`, and a correct heading hierarchy.
- **FR-070**: The feature MUST use only the existing local Tailwind CSS build and existing design tokens/components; it MUST NOT introduce React, Vue, Angular, Bootstrap, jQuery, a Tailwind CDN, any external runtime CDN (CSS/JS/font/image), any external chart/table library, or any browser dialog (`alert()`/`confirm()`/`prompt()`); all scripts MUST load with `defer`.
- **FR-071**: Every interactive control MUST have a visible frontend effect (navigation, modal, toast, toggle, copy, or inline validation) — **no dead buttons** — and the pages MUST produce **no console errors**.
- **FR-072**: The feature MUST NOT rebuild Spec 001, rewrite Specs 002–009, remove any existing public/member/merchant sections, or change the constitution; changes to merchant/public pages are limited to safe link additions only if needed, and all pre-existing pages MUST continue to render.
- **FR-073**: After implementation, the feature MUST produce `specs/010-saas-owner-admin-dashboard/qa-results.md` recording the QA gate outcomes (build pass, HTML validation for all seven pages, zero forbidden-tech grep hits, no external CDN, no console errors, 360px no-overflow, RTL correctness, LTR structural integrity, one-H1/heading hierarchy, correct admin relative paths, shell/active-state/drawer/dropdown behavior per page, per-page interaction checks, all destructive actions via custom modals, all prior specs' pages still render, and honest copy throughout).

### Key Entities *(include if feature involves data)*

- **Company (Agency)**: a travel company using the SaaS — identity (id, companyName, ownerName, ownerEmail, phone, country, city, website), commercial state (plan, subscriptionStatus, companyStatus), usage signals (dealsCount, couponsCount, bookingRequests, customersCount, integrationsEnabled, lastActive, usageLimits), lifecycle (trialEndsAt), revenue (monthlyRevenueMock), and admin context (recentActivity, adminNotes). Statuses are mock labels.
- **Plan**: a SaaS subscription tier (Starter/Growth/Pro/Enterprise) — pricing (monthlyPrice, yearlyPrice), limits (dealsLimit, couponsLimit, teamUsers, bookingInquiries, customersLimit, integrationsLimit), feature levels (analyticsLevel, AIRecommendations, scrapingReviewQueue, supportLevel, customDomain), and status; relates to many Companies and Subscriptions.
- **Subscription**: a company's commercial relationship — company, plan, amount, billingCycle, status, paymentStatus, nextRenewal, lastPayment, trialEndsAt, invoiceMockId, notes; relates one Company to one Plan and to mock Invoices.
- **Invoice (mock)**: a billing artifact for presentation only — invoice id, company, amount, status, date, line items; no real generation, file, or payment.
- **Integration Health Entry**: a platform integration (Travelpayouts, Booking Affiliate, Coupon API, Email, WhatsApp, Scraping Review Queue, Amadeus, Duffel) with a mock status, affected-companies count, last-check time, and action; no real monitoring.
- **Content Item**: a curated platform-content record across types (homepage section, destination, blog post, featured deal, featured coupon, pending-review item) with status, author, lastUpdated, featured flag, and type-specific fields; relates to existing destinations/articles/deals/coupons catalogs.
- **Platform Analytics Snapshot**: aggregate platform metrics and series feeding KPI cards and chart-like visuals (companies growth, subscription distribution, top destinations/categories, booking inquiries over time, revenue estimate, trial-to-paid, integration health trend) — illustrative, not live.
- **Admin Note / Task**: an owner-authored note or checklist task attached to a company or the platform (note text, type, follow-up date, status); session-only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All **seven** admin pages exist and open standalone with no backend; with JavaScript disabled, 100% of each page's core content (KPIs, feeds, tables, plan cards, comparison table, all six content tab panels, FAQs, honesty notes) is present and readable.
- **SC-002**: On every page, the admin shell renders, the correct sidebar item is active, the breadcrumb is correct, and the shell is visually distinguishable from the merchant dashboard in a side-by-side check by an unprompted reviewer.
- **SC-003**: At 360px width, every page has **zero** horizontal overflow, dense tables present as stacked cards, and the mobile drawer plus all three topbar/quick-action dropdowns open and operate.
- **SC-004**: The overview shows ≥10 KPI cards, ≥10 activity items, ≥8 top companies, 8 integration-health cards, subscription alerts, 5 chart-like previews, a working checklist, and quick actions that each navigate/modal/toast — with no dead control.
- **SC-005**: The companies page renders ≥12 rows; applying a filter narrows the visible set and updates an `aria-live` result count and chips within one interaction; reset restores the full list; all row/bulk action menus resolve to modals or toasts; bulk suspend and any destructive action use custom confirmation modals.
- **SC-006**: The company-details page renders completely with and without `?id=`, shows ≥8 usage bars (with near-limit warnings) and ≥10 timeline items, and every action (incl. reset usage and login-as) resolves to a modal/toast — never a browser dialog and never a real billing/impersonation effect.
- **SC-007**: The plans page shows four plan cards and a full comparison table; the monthly/yearly toggle updates 100% of displayed prices; create/edit validates before toasting; disable uses a custom confirm that states companies are unaffected.
- **SC-008**: The subscriptions page renders ≥12 rows with MRR/ARR estimate stats; filter/sort/search update the result set; filtering to zero matches shows a styled empty state; the subscription-detail, invoice-mock, extend-trial, and cancel-confirm modals all open and resolve; no copy claims real payment/invoice.
- **SC-009**: The analytics page shows ≥12 KPI cards and **eight** chart-like visuals rendered purely with CSS/HTML (verified by zero external chart/table-library references), five insight tables, recommendation cards, and a mock export/report modal — all clearly labelled illustrative.
- **SC-010**: The content page's six tabs switch visibly with all panels in the DOM; create/edit, feature/unfeature, publish/unpublish, delete, and approve/reject all resolve to modals/toasts; destructive actions use custom confirmations; a homepage preview reflects the featured selection.
- **SC-011**: A stack-compliance grep across the seven pages and `admin.js` returns **zero** hits for react, vue, angular, bootstrap, jquery, cdn.tailwindcss, `alert(`, `confirm(`, `prompt(`, and zero external CSS/JS/font/image CDN references; the project build passes and HTML validation passes for all seven pages with **no console errors**.
- **SC-012**: A reviewer reading every mutating control finds honest frontend-only copy and **no** claim of real admin action, billing, payment, suspension, integration monitoring, publishing, export, impersonation, or persistence; reloading any page after optimistic UI changes restores mock defaults.
- **SC-013**: All previously shipped surfaces still render unchanged after this feature lands: Spec 001 styleguide/components, Spec 002 homepage, Spec 003 discovery pages, Spec 004 content pages, Spec 005 member pages, Spec 006 merchant overview, Spec 007 merchant deals/coupons, the Spec 008 merchant bookings/customers pages (never built — their links stay coming-soon, no 404), and Spec 009 merchant analytics/integrations/settings.

## Scope

### In scope

- The SaaS owner/admin dashboard shell (sidebar, topbar, mobile drawer, breadcrumb, page header, active states, notifications + user-menu + quick-action dropdowns, footer).
- Seven admin pages: overview, companies, company details, plans, subscriptions, platform analytics, content.
- Frontend-only admin actions via modals, dropdowns, toggles, toasts, and custom confirmations.
- Backend-ready mock owner/admin data catalogs and reuse of existing catalogs.
- Admin navigation and admin layout patterns; a new/extended `src/js/admin.js`.
- Page-scoped CSS (admin KPI grids, CSS chart-like visuals, plan-card/comparison grids, content tabs, usage bars, table→cards) within the existing Tailwind build.
- A `qa-results.md` documenting the QA gate.

### Out of scope

- Any backend, database, real authentication/admin login, real company activation/deactivation, real subscription billing, real invoices, real payments, real plan changes, real user impersonation, real API calls, real integration monitoring, real CMS persistence, real content publishing, real exports, real email/WhatsApp sending, or real account deletion.
- Implementation changes to merchant/public/member pages beyond safe link additions if needed.
- A standalone admin-settings page and a standalone integration-monitoring page (handled as a coming-soon toast and as a deep-link to the analytics integration section, respectively).
- The unbuilt merchant bookings/customers pages (intended Spec 008) and any SaaS-owner billing/support surface beyond these seven pages — kept coming-soon, not broken links.
- Any new visual identity, foundation rebuild, constitution change, or chart/table library.

## Assumptions

- The Spec 001 foundation is available and authoritative: local Tailwind CSS v3.4 build, design tokens, and reusable components (cards, badges, buttons, forms, modals, drawers, toasts, empty/skeleton states) exposed via `window.TUI` and `data-*` patterns.
- The merchant dashboard shell (Specs 006–009) exists and is the reference the admin shell must visually diverge from; the admin shell may reuse foundation primitives while applying distinct accent usage.
- The existing Tailwind content globs already include (or will trivially include) the new `admin/` directory so the build picks up admin pages; if a glob addition is unavoidable it counts as a safe, additive change rather than a foundation rebuild.
- Existing catalogs (`merchant-deals.json`, `merchant-coupons.json`, `merchant-bookings.json`, `merchant-customers.json`, `destinations-full.json`, `articles.json`) exist and may be referenced by id for cross-linking; where a referenced catalog is absent, the admin catalogs are self-sufficient because baseline content is static HTML.
- "Estimated" revenue figures (MRR/ARR) and all analytics are illustrative mock values, not derived from real activity.
- Arabic RTL is the primary direction; the structure is English-ready (LTR flip must not structurally break layout) but English translation content is not in scope.
- The seven pages are the complete owner/admin surface for this feature; any owner capability beyond them is coming-soon.
