# Quickstart: Merchant Dashboard Shell + Overview

**Feature**: `006-merchant-dashboard-shell` | **Date**: 2026-06-02

How to build, preview, and verify the first merchant dashboard page (`dashboard/index.html`) — the app shell + overview.
The toolchain is unchanged from Spec 001–005 (HTML + local Tailwind v3.4 build + vanilla JS, **no CDN, no framework, no
chart library**). This feature is static composition + mock content on the existing foundation, enhanced by one additive
JS module (`dashboard.js`), in a **new `dashboard/` directory**. Everything is **frontend-only**: no real merchant
account, session, live data, booking, analytics, integration, notification, subscription, or payment.

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only; already installed in Spec 001).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
# One-time additive config edit: add './dashboard/**/*.html' to tailwind.config.js `content` globs.
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → http://localhost:3000/dashboard/index.html
```

Preview the merchant overview end-to-end (`…/dashboard/index.html`):
- **Shell**: sidebar shows the 10 modules with الرئيسية active; click an unbuilt module (العروض/الكوبونات/…) → "coming
  soon" toast; click العودة للموقع → `../pages/index.html`. Open each topbar dropdown (notifications / quick-add / user
  menu); type in global search → "بحث تجريبي" toast/inline state; click logout → toast.
- **Mobile (360px)**: tap the menu button → sidebar drawer opens with scrim; tap scrim / press Escape → closes; confirm
  no horizontal scroll; the booking table shows as stacked labeled cards.
- **Overview**: read the welcome summary (company/plan/subscription/pending tasks) + the ≥8 KPI cards (trend
  indicators); click a summary CTA → coming-soon toast.
- **Bookings**: open a row action menu → change-status modal (pick a status, toggle notify-customer placeholder, save →
  toast + badge update); add-note modal (submit empty → error; valid → toast + inline success); contact-customer →
  toast; assign-user → modal/toast; view-details → coming-soon.
- **Performance**: top deals (≥5) — click a deal's public CTA → `../pages/deal-details.html?id=`; edit → coming-soon.
  Analytics preview renders CSS bars/sparklines (6 visuals); activity feed lists ≥5 items.
- **Operate**: quick actions (تصفح الموقع العام → public site; others coming-soon); integration readiness (≥11; action →
  toast/coming-soon; "no real integration active"); operational alerts (≥6; action → toast/coming-soon); onboarding
  checklist — toggle items → progress indicator updates (`aria-live`) + toast.

> Rebuild after editing markup so Tailwind's content scan picks up newly-used utility classes. The Tailwind config globs
> must include `./dashboard/**/*.html` (additive edit) in addition to `./pages/**/*.html`, `./partials/**/*.html`,
> `./src/js/**/*.js`.

## 2. Per-page "done" checklist (Constitution gate)

A page is **NOT done** until all pass.

**Shell & page basics**
- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network requests** for
      CSS/JS/fonts/images/charts (SC-001/SC-013).
- [ ] **Own app shell**: sidebar + topbar + mobile drawer + breadcrumb + page header + dashboard footer; the public
      marketing header/footer is **not** present (FR-006; SC-001).
- [ ] **No-JS baseline**: with JavaScript disabled, the shell + all overview sections render and are readable
      (SC-001/SC-018; FR-005).
- [ ] **Session-only honesty**: dropdown/drawer state, onboarding toggles + progress, mock status change, added note,
      search are in-memory; reload restores mock defaults; no copy claims server/permanent storage (FR-028; research D4).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; usable at 360px with **no horizontal scroll**; touch targets ≥
      ~44px; phone/amount/date/code/reference use `dir="ltr"` (SC-001/SC-011).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors the shell/grid/table with no structural breakage
      (SC-011).
- [ ] **Design-system fidelity**: ≥95% styling via tokens/utilities; only a small page-scoped `<style>` for shell/
      dropdowns/table/KPI-grid/chart-bars/onboarding-progress; no new visual identity (SC-012).
- [ ] **No dead interactions**: zero bare `#` without a handler, zero dead buttons, zero `alert()`/`confirm()`/
      `prompt()`; unbuilt-module links use coming-soon (no 404) (SC-002).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, the dashboard breadcrumb, required Arabic title/meta;
      `robots noindex` acceptable; any JSON-LD describes the frontend-only mock honestly (SC-014).
- [ ] **Honest copy**: no real merchant-account/session, live-data, real-booking, real-analytics, connected-integration,
      sent-notification, API-sync, scraping-queue, subscription, or payment claims; everything بيانات تجريبية / واجهة
      أمامية فقط / قابل للربط لاحقًا (SC-010).
- [ ] **Accessibility WCAG 2.1 AA**: `npm run audit:a11y` (pointed at the dashboard) → 0 violations; keyboard reaches/
      operates 100% of controls (sidebar links, mobile menu, the three dropdowns, search, KPI links, row action menus,
      status & note modals with managed focus, contact/assign actions, quick actions, integration actions, alert
      actions, onboarding checkboxes + CTAs, logout); visible focus; `aria-current` on active nav; `aria-expanded` on
      dropdown triggers; `aria-live` for status/progress; reduced-motion respected (SC-015).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-016).

**Sidebar / topbar (US1)**
- [ ] Sidebar: brand + 10 links; الرئيسية active (`aria-current`); العودة للموقع → `../pages/index.html`; 8 unbuilt
      modules → coming-soon (SC-003).
- [ ] Topbar: mobile menu button, breadcrumb/current area, company-switcher placeholder, global search, and 3 working
      dropdowns (notifications/quick-add/user) that close on outside-click/Escape; logout → toast; search → mock state
      (SC-003/SC-004).
- [ ] Mobile drawer opens via menu button, closes via scrim/Escape with managed focus; no horizontal overflow (SC-004).

**Welcome & KPIs (US2)**
- [ ] Welcome summary: company/welcome/plan badge/subscription mock/pending-tasks note + CTAs (navigate or coming-soon)
      (SC-005).
- [ ] ≥8 KPI cards: icon + label + realistic number + trend indicator + helper text; non-dead links (SC-005).

**Recent bookings (US3)**
- [ ] ≥8 rows: reference/customer/phone(`dir="ltr"`)/title/destination/amount/status badge/payment badge/created
      date/assigned user/row menu; table → stacked cards on mobile (SC-006).
- [ ] Row menu: view-details(coming-soon)/change-status(modal)/add-note(modal)/contact(toast)/assign(modal|toast); none
      dead (SC-006).
- [ ] Status modal (notify-customer toggle placeholder) → toast + optional badge update, no real-notification claim;
      add-note modal (required note) validates → toast + inline success, not persisted (SC-006).

**Top deals / analytics / activity (US4)**
- [ ] ≥5 top deals: title/destination/source badge/clicks/inquiries/coupon copies/conversion/status; public CTA →
      `../pages/deal-details.html?id=`; edit → coming-soon (SC-007).
- [ ] Analytics preview: 6 CSS/HTML-only visuals (booking inquiries over time, deal clicks, coupon copies, top
      destinations, traffic sources, device breakdown) with realistic mock numbers; **no external chart lib/CDN** (SC-007/SC-013).
- [ ] Activity feed: ≥5 items (icon + text + time + type) (SC-007).

**Quick actions / integrations / alerts / onboarding (US5)**
- [ ] Quick actions: 6 buttons, none dead (تصفح الموقع العام → public site) (SC-008).
- [ ] Integration readiness: ≥11 integrations, each name + honest status badge + description + action(toast/coming-soon);
      "no real integration active" framing (SC-008/SC-010).
- [ ] Operational alerts: ≥6 cards (severity + message + date/due + action) (SC-008).
- [ ] Onboarding checklist: 6 items toggle accessibly; progress indicator updates via `aria-live`; toast; CTAs navigate
      or coming-soon (SC-008).

**Empty/loading & footer**
- [ ] Reusable skeleton + empty-state patterns present (MAY be hidden) (SC-001).
- [ ] Dashboard footer: platform name + frontend-only note + copyright + link → `../pages/index.html` (FR-025).

**Non-regression**
- [ ] `src/js/main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` unchanged; sprite edits append-only; Tailwind edit
      is only the additive `./dashboard/**/*.html` glob (SC-017).
- [ ] Styleguide/components, the Spec 002 homepage, the Spec 003 discovery pages, the Spec 004 content pages, and the
      Spec 005 member pages still render; `partials/header.html`/`footer.html` and `pages/` unchanged (SC-017).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules) — forbidden tech + browser dialogs:
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules

# Must return NO matches — external chart libraries / chart CDNs on the dashboard:
grep -RInE "chart\.js|chartjs|apexcharts|highcharts|echarts|d3\.|recharts|plotly|googleapis.*chart" \
  dashboard/ src/js/dashboard.js | grep -v node_modules
```

Any match fails review (Principle II / SC-013).

## 4. Validation commands

```bash
npx html-validate dashboard/index.html                               # 0 errors
npx stylelint "src/**/*.css"                                         # 0 errors (only if input.css touched)
npx prettier --check "src/js/dashboard.js" "dashboard/*.html"
npm run serve & axe http://localhost:3000/dashboard/index.html      # 0 AA violations
```

## 5. Mock-data consistency check

- [ ] `merchant-dashboard.json` has `kpis`≥8, `alerts`≥6, `onboarding`=6, `activity`≥5, full `analytics` (6 datasets),
      `company`, `notifications`.
- [ ] `merchant-bookings-preview.json` ≥8 bookings (full schema; spread of statuses + payment states).
- [ ] `merchant-deals-preview.json` ≥5 top deals; each `dealId` resolves to an existing `deals.json` id (CTA →
      `../pages/deal-details.html?id=`) — no dangling links.
- [ ] `merchant-integrations-preview.json` ≥11 integrations; status spread; "no real integration active".
- [ ] Reused `deals.json`/`coupons.json`/`compare-offers.json` are unchanged.

## Where things live

- Page → `dashboard/index.html` (NEW `dashboard/` directory; merchant overview + reusable app shell).
- Reused tokens/components → `tailwind.config.js` (+ additive `./dashboard/**/*.html` glob), `src/input.css`
  (`.btn`/`.card`/`.badge*`/`.field*`/`.modal`/`.drawer*`/`.skeleton*`/`.empty-state`/`.inline-msg*`/`.breadcrumb*`).
- Reused `<head>` conventions → `partials/head.html` (CSS link, font preload, favicon, theme-color) — header/footer NOT
  used on the dashboard.
- Reused interactions → `src/js/ui.js` (`window.TUI`, incl. `validateForm(form,{rules})`) + `src/js/main.js`
  (declarative `data-*`, incl. `data-coming-soon`/`data-modal-open|close`/`data-drawer-open|close`/`data-toast`/
  `data-year`) + `discovery.js`/`content.js`/`member.js` — **all unchanged, none loaded by the dashboard**.
- New page logic → `src/js/dashboard.js` (sidebar/drawer toggle + scrim, topbar dropdowns, row action menus, status &
  note modals, onboarding toggle + progress, contact/assign/quick-action/integration toasts, search mock); loaded only
  by `dashboard/index.html`, dispatched by `<html data-page="merchant-dashboard">`.
- Mock content → `assets/data/merchant-dashboard.json` (NEW), `merchant-bookings-preview.json` (NEW; ≥8),
  `merchant-deals-preview.json` (NEW; ≥5), `merchant-integrations-preview.json` (NEW; ≥11); `deals.json`/`coupons.json`/
  `compare-offers.json` (referenced unchanged).
- Icons → `assets/icons/sprite.svg` (additive sidebar/topbar symbols; no existing symbol changed).
- Contracts → `specs/006-merchant-dashboard-shell/contracts/` (dashboard-page, mock-data).
- QA artifact → `qa-results.md` (produced after implementation).
