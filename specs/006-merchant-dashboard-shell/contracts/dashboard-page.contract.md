# Contract: Merchant Dashboard Shell + Overview Page

**Feature**: `006-merchant-dashboard-shell` | **Date**: 2026-06-02

This contract defines the **observable structure and behavior** `dashboard/index.html` MUST satisfy — the app shell, the
overview sections, the coming-soon navigation preparation, and the non-regression guarantees. It is the acceptance
surface for `/speckit-tasks` and QA. "MUST" items are non-negotiable; they trace to the spec's FRs/SCs and the
constitution. The page reuses existing design tokens, components, and `window.TUI`; only `src/js/dashboard.js`, four JSON
catalogs, additive sprite icons, and a one-line Tailwind content-glob are added (no change to `main.js`/`ui.js`/
`discovery.js`/`content.js`/`member.js`, the public/member `pages/`, or `partials/header.html`/`footer.html`).

---

## C0. Page contract (shared)

- **C0.1** Standalone HTML5 document: `<html lang="ar" dir="rtl" data-page="merchant-dashboard">`, own `<head>` built
  from the `partials/head.html` conventions (CSS `../assets/css/tailwind.css`, Cairo font preload, favicon, theme-color,
  viewport, Arabic title/meta, `robots noindex`), `#main` landmark, skip link, `#toast-root`. Renders with no console
  errors and **zero external CDN/network requests** for CSS/JS/fonts/images/**charts**. (FR-003/FR-004; SC-001/SC-013)
- **C0.2** Loads `../src/js/ui.js`, `../src/js/main.js`, `../src/js/dashboard.js` (all `defer`). No inline page JS beyond
  optional JSON-LD and any safe inline JSON/mock-data block. The dashboard does **NOT** load `discovery.js`/`content.js`/
  `member.js`. (research D5)
- **C0.3** Uses its **own app shell** (sidebar/topbar/drawer/breadcrumb/page-header/footer) and **MUST NOT** include the
  public marketing header/drawer/footer (`partials/header.html`/`footer.html` are not inlined). (FR-006; SC-001)
- **C0.4** Exactly one `<h1>` (the welcome-summary heading); `<h2>` section headings; `<h3>` card/sub-section titles;
  correct heading order; the dashboard breadcrumb; full meta. `robots noindex` acceptable. (FR-035; SC-014)
- **C0.5** Arabic RTL default, English-ready (logical properties; no hard-coded LTR; layout mirrors with no structural
  breakage when flipped). Mobile-first, usable 320–360px → desktop, **no horizontal scroll at 360px**, touch targets ≥
  ~44px. Phone/amount/date/code/reference use `dir="ltr"`. (FR-032/FR-033; SC-001/SC-011)
- **C0.6** WCAG 2.1 AA: AA contrast, full keyboard operability + visible focus, focus-managed dropdowns/modals (close on
  Escape), meaningful `alt`, labelled fields with programmatic error links (`aria-invalid`/`aria-describedby`),
  `aria-pressed`/`aria-checked` for toggles/checklist, `aria-current` on the active sidebar item, `aria-expanded`/
  `aria-controls` on dropdown triggers, `aria-live` for status/progress changes, accessible labels on icon-only
  controls, reduced-motion respected. `npm run audit:a11y` (pointed at the dashboard) → 0 violations. (FR-034; SC-015)
- **C0.7** No dead interactions: every control navigates, opens/closes a dropdown/drawer/modal, opens a row menu, toggles
  a visible state (onboarding/status), shows a toast, copies, or submits a validated form. Zero bare `#` without a
  handler, zero `alert()`/`confirm()`/`prompt()`. (FR-030/FR-031; SC-002)
- **C0.8** ≥95% of styling via existing tokens/utilities; only a small page-scoped `<style>` for the shell/dropdowns/
  responsive table/KPI grid/chart bars/onboarding progress. No new visual identity, no new global component. (FR-001;
  SC-012)
- **C0.9** Core/default content renders with JavaScript disabled (static-HTML-first): shell, welcome summary, KPI cards,
  booking table, top deals, integrations, analytics-preview bars, alerts, onboarding (default states), activity feed,
  footer. JS only enhances. (FR-005; SC-001/SC-018)
- **C0.10** Dashboard state is **frontend/session-only**: dropdown/drawer state, onboarding toggles + progress, a mock
  status change, an added note, search state are in-memory; reload restores the mock defaults; nothing is persisted to a
  server. (research D4; FR-028)
- **C0.11** All content is believable mock; reused deal source badges limited to Partner/Affiliate/Manual Deal/API
  Ready; integration card states "no real integration active"; every surface states بيانات تجريبية / واجهة أمامية فقط /
  قابل للربط لاحقًا; never implies a real merchant account, session, live data, booking, analytics, connected
  integration, sent notification, active API sync, scraping queue, subscription, or payment. (FR-028; IX)

## C1. Dashboard shell (US1)

- **C1.1** **Sidebar** with brand/logo (→ `index.html`) and the ten nav links (الرئيسية / العروض / إضافة عرض / الكوبونات
  / طلبات الحجز / العملاء / التحليلات / التكاملات / الإعدادات / العودة للموقع), with a visible + programmatic **active**
  state (`aria-current="page"`) on الرئيسية. `الرئيسية` → `index.html`; `العودة للموقع` → `../pages/index.html`; the
  eight unbuilt-module links use `data-coming-soon` (toast, no 404). (FR-007/FR-008; SC-003)
- **C1.2** **Topbar** with: a mobile menu button (opens the sidebar drawer; `aria-controls`/`aria-expanded`), a
  breadcrumb/current-area indicator, a company-switcher placeholder, a global search input, a notifications dropdown, a
  quick-add dropdown, and a user-menu dropdown. (FR-009; SC-003)
- **C1.3** The three **dropdowns** open/close, are keyboard-operable, close on outside-click/Escape, and contain no dead
  items: notifications shows mock notifications; quick-add shows add-deal/create-coupon/add-booking-request (coming-soon
  items); user menu shows profile/settings (coming-soon) + logout. (FR-009; SC-003)
- **C1.4** On mobile the sidebar **collapses to a drawer**: the menu button opens it with an **overlay/scrim**, the scrim
  and Escape close it with managed focus, the topbar stays usable, touch targets ≥ ~44px, and there is **no horizontal
  overflow at 360px**. (FR-010; SC-004)
- **C1.5** The global **search** shows a visible mock state ("بحث تجريبي"/frontend-only) and never implies a real search
  backend; **logout** is a frontend-only toast (MAY navigate to `../pages/index.html`) that never claims a real session.
  (FR-010; SC-002/SC-010)
- **C1.6** A **breadcrumb**, a **page header**, and a small **dashboard footer** (platform name + frontend-only note +
  copyright + link → `../pages/index.html`) are present. (FR-007/FR-025; SC-003)

## C2. Welcome summary & KPIs (US2)

- **C2.1** A **welcome/agency summary** with one `<h1>`, a mock company name (شركة رحلات الشرق), a welcome message, a
  current-plan badge (Growth Plan), a subscription-status mock, a pending-tasks note, and CTAs (إضافة عرض جديد / مراجعة
  طلبات الحجز / إعداد التكاملات) that each navigate or show a coming-soon toast — rendered statically. Plan/subscription
  framed as mock. (FR-011; SC-005)
- **C2.2** At least **8 KPI cards** (طلبات الحجز الجديدة / العروض النشطة / الكوبونات المفعلة / العملاء / الضغطات على
  العروض / نسخ الكوبونات / التحويلات التقديرية / عروض قاربت على الانتهاء), each with an icon, a label, a realistic mock
  number, a **trend indicator** (direction + value), short helper text, and a non-dead link/action. KPI values framed as
  بيانات تجريبية. (FR-012; SC-005)

## C3. Recent booking requests (US3)

- **C3.1** A **recent booking requests** section as a responsive **table/card hybrid** of **≥8** rows; each row has
  booking reference, customer name, phone (`dir="ltr"`), request title, destination, amount, a **status** badge (one of
  New/Contacted/Pending Payment/Confirmed/Cancelled/Completed), a **payment-status** badge (one of Unpaid/Deposit/Paid/
  Refunded), created date, assigned user, and a **row action menu** — rendered statically. On mobile the table becomes a
  stacked, labeled card layout usable with no horizontal overflow. (FR-013; SC-006)
- **C3.2** Each row's **action menu** offers view-details (coming-soon → `booking-details.html`), change-status,
  add-note, contact-customer, and assign-user — none dead. (FR-014; SC-006)
- **C3.3** The **status-change modal** (custom `.modal`, never a browser dialog) has the booking reference, a new-status
  control, a note field, and a **notify-customer toggle placeholder**; on save → toast, MAY update the visible row status
  in place, and no copy claims a real notification was sent. (FR-015; SC-006)
- **C3.4** The **add-note modal** has the reference, a **required** note textarea (invalid submit → error state), a
  note-type control, and an optional follow-up date; on valid submit → toast + inline success, not persisted.
  **Contact-customer** → toast; **assign-user** → mock modal or toast. (FR-016; SC-006)

## C4. Top deals, analytics preview, activity (US4)

- **C4.1** A **top performing deals** section of **≥5** deals, each with title, destination, a **source badge** (Partner/
  Affiliate/Manual Deal/API Ready), clicks, inquiries, coupon copies, a conversion estimate, a status, a CTA →
  `../pages/deal-details.html?id=<id>` where an id exists, and a coming-soon edit CTA. (FR-017; SC-007)
- **C4.2** An **analytics preview** built **only** from CSS/HTML (bars/sparklines/proportion bars) with realistic mock
  numbers for booking inquiries over time, deal clicks, coupon copies, top destinations, traffic sources, and device
  breakdown — each labeled mock; **zero** external chart-library/CDN requests. (FR-018; SC-007/SC-013)
- **C4.3** An **activity feed** of **≥5** mock items (icon + text + relative time + type), not a real-time stream.
  (FR-019; SC-007)

## C5. Quick actions, integrations, alerts, onboarding (US5)

- **C5.1** A **quick actions** section with six buttons (إضافة عرض جديد / إنشاء كوبون / مراجعة الطلبات / إعداد التكاملات
  / عرض صفحة الشركة / تصفح الموقع العام), each navigating, toasting, or opening a modal (تصفح الموقع العام →
  `../pages/index.html`). No dead action. (FR-020; SC-008)
- **C5.2** An **integration readiness** card with **≥11** integrations (Travelpayouts, Booking Affiliate, Expedia
  Partner, Skyscanner Partner, Amadeus API, Duffel API, Coupon API, Manual Deals, Scraping Review Queue, WhatsApp
  Notifications, Email Notifications), each with a name, an honest **status badge** (Connected mock / Not connected / API
  Ready / Coming soon / Needs configuration / Needs review), a short description, and an action (إعداد / اختبار / قريبًا
  → toast/coming-soon); the card explicitly states **no real integration is active**. (FR-021; SC-008/SC-010)
- **C5.3** **Operational alerts** as **≥6** cards (عروض قاربت على الانتهاء / كوبونات تحتاج مراجعة / طلبات لم يتم الرد
  عليها / تكامل غير مفعل / بيانات ناقصة في الشركة / باقة تجريبية قاربت على الانتهاء), each with a severity badge, a
  message, a date/due note, and a non-dead action button. (FR-022; SC-008)
- **C5.4** An **onboarding checklist** (أضف أول عرض / أنشئ أول كوبون / فعّل مصدر العروض / اضبط بيانات الشركة / راجع أول
  طلب حجز / فعّل تنبيهات البريد لاحقًا), each with a checkbox/visual check state, a description, a CTA, and a contribution
  to a **progress indicator**; toggling flips the state accessibly (`aria-checked`), updates the progress indicator
  (announced via `aria-live`), and shows a toast; each CTA navigates or coming-soons. State frontend-only. (FR-023;
  SC-008)

## C6. Empty / loading patterns & footer

- **C6.1** Reusable **skeleton** (dashboard cards/table rows) and **empty-state** (recent-bookings/alerts) patterns exist
  (MAY be hidden by default) for future merchant pages — never a blank/broken section. (FR-024; SC-001)
- **C6.2** A small **dashboard footer** with the platform name, a frontend-only note, a copyright line, and a link back
  to `../pages/index.html`. (FR-025)

## C7. Coming-soon & navigation preparation

- **C7.1** Every control targeting an **unbuilt** merchant page (`deals.html`, `create-deal.html`, `edit-deal.html`,
  `coupons.html`, `create-coupon.html`, `bookings.html`, `booking-details.html`, `customers.html`,
  `customer-details.html`, `analytics.html`, `integrations.html`, `settings.html`) uses **coming-soon** behavior (toast,
  no navigation to a non-existent file). The unbuilt page files are **NOT created** in this spec. (FR-029; SC-002)
- **C7.2** Built links navigate correctly: `index.html`, `../pages/index.html`, `../pages/deal-details.html?id=`,
  `../pages/deals.html`, `../pages/compare.html`. No 404s, no dead links. (FR-029; SC-002)

## C8. Non-regression contract

- **C8.1** `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, and `src/js/member.js` are
  **unchanged** (no behavioral diff). New behavior lives in the additive `src/js/dashboard.js`, loaded only by the
  dashboard. The only sprite edit is **append-only** symbols; the only Tailwind edit is the additive `./dashboard/**/*.html`
  content glob. (research D5/D8/D1)
- **C8.2** The styleguide/components showcase, the Spec 002 homepage (all sections), the Spec 003 discovery pages, the
  Spec 004 content pages, and the Spec 005 member pages still render and behave; `partials/header.html`/`footer.html` and
  the public/member `pages/` are unchanged. (SC-017)
- **C8.3** Stack-compliance grep gate returns no matches (react/vue/angular/bootstrap/jquery/cdn.tailwindcss/`alert(`/
  `confirm(`/`prompt(`) **and** no external chart-library/CDN reference; `npm run build` regenerates cleanly; zero
  console errors on the dashboard. (SC-013/SC-017)
