# Phase 0 Research: Merchant Dashboard Shell + Overview

**Feature**: `006-merchant-dashboard-shell` | **Date**: 2026-06-02

No `NEEDS CLARIFICATION` items remained after the spec's Clarifications session (2026-06-02), which resolved the nine
open questions (dashboard directory & `../` paths; no real merchant auth gate → mock identity; static-HTML-first; new
additive `dashboard.js`; CSS/HTML-only charts; the dashboard uses its own app shell, not the public marketing header/
footer; frontend/session-only state; custom modals / no browser dialogs; coming-soon for unbuilt merchant modules). This
document records the technical decisions for building the first merchant dashboard page on top of the Spec 001
foundation (and consistent with the Spec 002–005 pattern), with **no backend** and **no change to the existing visual
identity**.

The investigation grounded every decision in the real codebase: public pages **inline** the canonical shell (`partials/
head|header|footer.html`), set `<html lang="ar" dir="rtl" data-page="…">`, and load `../src/js/ui.js` →
`../src/js/main.js` → `<feature module>` (all `defer`); each feature module dispatches on
`document.documentElement.dataset.page` (Spec 003 `discovery.js`, Spec 004 `content.js`, Spec 005 `member.js` all do).
`window.TUI` exposes `toast`, `modal.open|close`, `drawer.open|close|toggle`, `validateForm(form,{rules})`,
`copyToClipboard`, and `prefersReducedMotion`. `main.js` provides a delegated `data-*` layer: `data-coming-soon`
(preventDefault + info toast), `data-modal-open|close`, `data-drawer-open|close|drawer`, `data-copy`/`data-copy-target`,
`data-toast`/`data-toast-type`, `data-validate`/`data-frontend-form`/`data-success-toast`/`data-frontend-success`, and
`data-year`. `tailwind.config.js` defines the tokens (lagoon/sunset/ink colors; `soft`/`card`/`pop` shadows; z-index
`dropdown:1000`/`drawer:1040`/`modal:1060`/`toast:1080`; the standard breakpoints) and the content globs `./pages/**/*.html`,
`./partials/**/*.html`, `./src/js/**/*.js`. `src/input.css` provides `.btn*`, `.card*`, `.badge*`/`.badge-source-*`,
`.field*`, `.modal*`, `.drawer*`, `.toast*`, `.skeleton*`, `.empty-state`, `.inline-msg*`, `.breadcrumb*`, `.chip-group`,
`.price`, `.search-input*` — but **no** sidebar, topbar, dropdown-menu, dashboard-table, KPI-grid, or chart-bar
component, so those are realised with a small page-scoped `<style>` (the same approach `index.html` and the content pages
use). The icon sprite (`assets/icons/sprite.svg`) currently has menu/search/close/chevron-down/copy/phone/info/star/
location/globe/plane/shield-check/check-circle/alert-triangle/arrow-left/copy + social icons — but **no** dashboard/
settings/users/bell/chart/plug icons, so additive symbols are needed.

---

## D1. Surface & directory — a new `dashboard/` area with `../` paths (clarified)

**Decision**: Create the merchant surface in a **new `travel-saas-frontend/dashboard/` directory** (the constitution's
canonical merchant location), a sibling of `pages/`. `dashboard/index.html` therefore references shared assets/scripts
with the same `../` prefix the public pages use from `pages/`: CSS `../assets/css/tailwind.css`; icons
`../assets/icons/sprite.svg`; images `../assets/images/…`; fonts `../assets/fonts/…`; scripts `../src/js/ui.js`,
`../src/js/main.js`, `../src/js/dashboard.js`; public site `../pages/index.html` (and `../pages/deal-details.html?id=`,
`../pages/deals.html`, `../pages/compare.html`). Future merchant pages will live **inside** `dashboard/` (e.g.,
`deals.html`) but are coming-soon for now. The `tailwind.config.js` `content` globs gain `./dashboard/**/*.html` (a
one-line additive edit) so the build scans the new directory.

**Rationale**: The constitution's Technical Standards already lists `dashboard/` with exactly these pages; mirroring the
`pages/` `../` convention keeps the asset/script/back-to-site paths correct and predictable, and keeps the page
backend-ready for Django (a `dashboard/` app/templates dir maps cleanly). Extending the Tailwind globs is required or the
dashboard's utility classes would be purged.

**Alternatives considered**: Putting the page under `pages/` (rejected — violates the canonical structure and the `../`
contract, and conflates the public and merchant surfaces); a separate top-level project (rejected — one static project,
shared tokens/components/JS, is the established model).

---

## D2. App shell, not the public marketing header/footer (clarified)

**Decision**: The dashboard authors **its own app shell** — a fixed RTL **sidebar** of merchant modules, a **topbar**
(mobile-menu button, breadcrumb/current area, company-switcher placeholder, global search, notifications dropdown,
quick-add dropdown, user-menu dropdown), a **mobile drawer + scrim**, a **breadcrumb**, a **page header**, the
**content**, and a small **dashboard footer** — and does **not** inline `partials/header.html` or `partials/footer.html`.
It **does** reuse the `partials/head.html` conventions for its own `<head>` (the `../assets/css/tailwind.css` link, the
Cairo font preload, the favicon, the theme-color, the viewport) plus dashboard-specific `<title>`/meta/`robots noindex`.
The shell is built from existing tokens/components + a small page-scoped `<style>` for the sidebar/topbar grid, the
dropdown menus, the responsive table, the KPI grid, and the chart bars.

**Rationale**: A merchant app needs app chrome, not a marketing nav; the spec explicitly forbids the public header/footer
here. Reusing the `head` conventions keeps the document meta/CSS/font/favicon consistent and avoids drift. Building the
shell from tokens keeps ≥95% styling in the design system (SC-012) and introduces no new visual identity (IV).

**Alternatives considered**: Inlining the public header/footer (rejected — wrong for an app and spec-forbidden); a
runtime-injected shell via `fetch` (rejected — breaks standalone rendering on `file://`, violates III).

---

## D3. Rendering strategy — static HTML + progressive enhancement (NOT client-side fetch-render)

**Decision**: Author the entire dashboard's core content as **static, server/CMS-renderable HTML** that mirrors the
canonical mock data — the shell, the welcome summary, the ≥8 KPI cards, the ≥8 booking rows, the ≥5 top deals, the ≥11
integrations, the 6 analytics-preview visuals, the ≥6 alerts, the onboarding checklist (with default states), the
activity feed, and the footer are all hand-authored static HTML. JavaScript only *enhances* (drawer toggle, dropdowns,
row action menus, modals, toasts, checklist toggling + progress, search mock); it never *renders* the baseline. Cards/
rows/items carry machine-readable `data-*` (e.g., `data-booking-row`, `data-booking-status`, `data-onboarding-item`,
`data-integration`, `data-dropdown`, `data-kpi`) so the enhancement layer acts on the existing DOM with no fetch.

**Rationale**: Constitution III + the spec's static-HTML-first clarification + the JS-unavailable edge case require core
content to render and be readable with no backend and no JS. Static HTML avoids layout shift, works on `file://`, and
maps cleanly to Django templates. Matches the homepage/discovery/content/member pattern exactly.

**Alternatives considered**: Client `fetch()` + render from the JSON catalogs (rejected — empty/broken page without JS,
layout shift, fragile on `file://`, contradicts III); a build-time SSG (rejected — no SSG in the toolchain).

---

## D4. No real merchant auth gate; mock identity; session-only state (clarified)

**Decision**: There is **no real authentication and no auth gate**. `dashboard/index.html` is a directly-reachable
standalone page that renders immediately and shows a **mock merchant identity** (company "شركة رحلات الشرق", a mock
dashboard user, "Growth Plan") authored statically and mirrored in `merchant-dashboard.json`. All dashboard mutations —
dropdown/drawer open-close, onboarding-item toggling + progress, a mock booking-status change, an added note, search
state — are **in-memory/session-only** changes to the current DOM; a reload restores the static mock defaults.
`localStorage` MAY be used only as an optional convenience but **no copy claims permanent or server-side storage**. The
user-menu **logout** is a frontend-only toast that MAY navigate to `../pages/index.html`, never claiming a real session.

**Rationale**: Required by Constitution IX (never faked) and the spec's product-honesty rules; session-only state
demonstrates the full interaction loop without implying real persistence. No client-side router/store is needed (III).

**Alternatives considered**: A `localStorage`-backed "logged-in merchant" that survives reloads (rejected — risks
reading as real auth/persistence); a gated redirect for the dashboard (rejected — there is no real session to gate on and
it would break standalone rendering / create dead ends).

---

## D5. Page-specific behavior — one new additive module `src/js/dashboard.js`

**Decision**: Add a single **new** file `src/js/dashboard.js`, loaded (via `defer`) **only** by `dashboard/index.html`
after `ui.js`/`main.js`. It dispatches on `document.documentElement.dataset.page === 'merchant-dashboard'` — the same
dispatch Spec 003/004/005 modules use — and owns: the **mobile sidebar/drawer** open-close (reusing `window.TUI.drawer`
+ an overlay/scrim, close on scrim/Escape); the three **topbar dropdowns** (notifications, quick-add, user-menu — open/
close, outside-click/Escape close, ARIA `aria-expanded`/`aria-controls`, roving focus); the **table row action menus**
(open/close per row, items → modal/toast/coming-soon); the **status-change** and **add-note** modals (open via
`data-modal-open`, validate via `TUI.validateForm`, on save toast + optional in-place status update); **contact-customer**,
**assign-user**, **quick-action**, and **integration-action** toasts; the **onboarding checklist** toggling (flip
`aria-checked`/visual state + update a live `aria-live` progress indicator + toast); and the **global-search** mock state
(submit/typing → "بحث تجريبي" toast or inline state). It calls `window.TUI` for toasts/modals/drawer and reuses existing
`data-modal-open`/`data-modal-close`/`data-coming-soon`/`data-toast` wiring. **`main.js`, `ui.js`, `discovery.js`,
`content.js`, and `member.js` are not modified; only `ui.js`/`main.js`/`dashboard.js` are loaded by the dashboard.**

**Rationale**: Dropdown menus, row-action menus, the status/note modals, and checklist-progress are genuine page logic
the declarative `data-*` layer does not cover. A dedicated additive module keeps `ui.js` (the `window.TUI` contract),
`main.js` (declarative wiring), and the other feature modules untouched, matches the canonical multi-JS structure, and is
reusable by future merchant pages. Keeping it separate avoids any Spec 003/004/005 regression risk and matches the
spec's explicit scoping (FR-002).

**Alternatives considered**: Inline `<script>` (rejected — pages need no bespoke inline JS); extending `main.js`
(rejected — page-specific concerns in a file every page loads → regression risk); extending an existing feature module
(rejected — conflates concerns / regression risk).

---

## D6. Analytics preview — CSS/HTML-only bars & sparklines, no chart library (clarified)

**Decision**: Build the analytics-preview "charts" **only** from CSS/HTML, sized from realistic mock numbers in
`merchant-dashboard.json`:
- **Booking inquiries over time / deal clicks / coupon copies**: a row of vertical bars (`.chart-bar` height via an
  inline `height`/`--h` custom property as a percentage) or a sparkline-like baseline row, with an accessible caption +
  data labels.
- **Top destinations / traffic sources / device breakdown**: horizontal proportion bars or a segmented/stacked bar
  (`width:NN%`), each labeled with the value and an accessible name.
Each chart is wrapped in a `<figure>`/`<figcaption>` (or a labelled region) with a "بيانات تجريبية / مثال توضيحي" note,
is keyboard/AT-readable as static markup, respects reduced-motion (no bar-grow animation when reduced), and adds **zero**
external requests. No `<canvas>`, no chart library, no chart CDN/service.

**Rationale**: Constitution II + the spec forbid an external chart library/CDN; CSS bars are semantic, no-JS-safe, AT
readable, and fast. Keeps the "no external runtime CDN" and "no external chart library" gates green (SC-007/SC-013).

**Alternatives considered**: Chart.js/ApexCharts/Recharts (rejected — external libs/CDN, forbidden by II); SVG
`<canvas>` hand-drawing (rejected — not readable as static markup / weaker AT story than CSS bars + labels).

---

## D7. Dashboard layout primitives — page-scoped `<style>` over existing tokens

**Decision**: Because `input.css` has no sidebar/topbar/dropdown-menu/dashboard-table/KPI-grid/chart-bar component,
realise them with a **small page-scoped `<style>` block** in `dashboard/index.html` (the same approach `index.html` and
the content pages use), built from existing tokens:
- **App shell grid**: a CSS grid with a fixed-width sidebar column + a content column on `lg+`; the sidebar becomes a
  `.drawer`-style off-canvas panel below `lg` (reusing `.drawer*` semantics + a scrim).
- **Topbar dropdowns**: an absolutely-positioned `.card`/`.modal`-shadowed menu (`z-index: dropdown`) toggled by
  `dashboard.js`, with `role="menu"`/`role="menuitem"` and `aria-expanded` on the trigger.
- **Responsive table → cards**: a real `<table>` on `md+`; below `md` each `<tr>` becomes a stacked labeled card via
  CSS (`display:block` + `data-label` `::before`) so it stays readable at 360px with no horizontal scroll.
- **KPI grid / stat cards / quick-actions / integration rows / alert cards / activity feed**: composed from existing
  `.card`/`.badge*`/`.btn*` plus small grid/layout CSS.
- **Onboarding progress**: a CSS proportion bar + an `aria-live` text indicator (x/6 or %).

**Rationale**: Keeps ≥95% styling in the existing design system (SC-012) while adding only thin, page-scoped layout CSS —
no new global component, no new visual identity (IV). The native `<table>` + CSS card transform keeps the no-JS baseline
usable on mobile (III).

**Alternatives considered**: Adding new global classes to `input.css` (rejected — broader surface/regression risk; not
needed beyond the dashboard, though future merchant pages may later promote shared dashboard classes); a JS-built table
(rejected — would not render without JS, violating III).

---

## D8. Icons — additive sidebar/topbar symbols in the existing sprite

**Decision**: Append **new `<symbol>` icons** to `assets/icons/sprite.svg` for the dashboard nav/topbar/row-actions that
the current sprite lacks — e.g., `icon-grid` (الرئيسية/overview), `icon-tag` (العروض), `icon-plus` (إضافة عرض/quick-add),
`icon-ticket` (الكوبونات), `icon-calendar`/`icon-clipboard` (طلبات الحجز), `icon-users` (العملاء), `icon-bar-chart`
(التحليلات), `icon-plug` (التكاملات), `icon-settings` (الإعدادات), `icon-external` (العودة للموقع), `icon-bell`
(notifications), `icon-more` (row-action kebab), `icon-logout`, and `icon-trend-up`/`icon-trend-down` (KPI trends).
Existing icons are reused where they fit (`icon-search`, `icon-menu`, `icon-close`, `icon-chevron-down`, `icon-copy`,
`icon-phone`, `icon-check-circle`, `icon-alert-triangle`, `icon-info`, `icon-location`, `icon-star`). All additions are
**append-only** — no existing symbol is modified.

**Rationale**: The project renders icons via one sprite (`<use href="…sprite.svg#icon-…">`); the dashboard needs clear,
distinct nav/topbar icons for IV (premium/clear). Appending symbols is additive and zero-regression. Reusing existing
icons where sensible minimizes additions.

**Alternatives considered**: A second sprite or inline `<img>` per icon (rejected — breaks the single-sprite
convention); reusing only existing icons for everything (rejected — ambiguous nav icons hurt clarity/premium feel).

---

## D9. Coming-soon navigation for unbuilt merchant modules (clarified)

**Decision**: Every sidebar item and in-page CTA targeting an **unbuilt** merchant page — `dashboard/deals.html`,
`create-deal.html`, `edit-deal.html`, `coupons.html`, `create-coupon.html`, `bookings.html`, `booking-details.html`,
`customers.html`, `customer-details.html`, `analytics.html`, `integrations.html`, `settings.html` — uses the existing
`data-coming-soon` behavior (info toast via `main.js`, no navigation to a non-existent file). The unbuilt page files are
**not created** in this spec. The only live links are `الرئيسية` → `index.html`, `العودة للموقع` →
`../pages/index.html`, and public CTAs that resolve to already-built public pages (`../pages/deal-details.html?id=`,
`../pages/deals.html`, `../pages/compare.html`, `../pages/index.html`). No control is dead and nothing 404s.

**Rationale**: Constitution VI (no dead interactions, no bare `#`) + the spec's coming-soon requirement; reusing the
established `data-coming-soon` toast keeps the behavior consistent with how the public shell already handles unbuilt
surfaces, with zero new code.

**Alternatives considered**: Creating empty stub pages for the 12 modules (rejected — out of scope; thin/dead pages
violate VII/X); leaving the links as bare `#` (rejected — dead controls, forbidden by VI).

---

## D10. Custom modals & no browser dialogs (status-change, add-note, assign-user)

**Decision**: All secondary/confirmation flows use the existing `.modal` markup + `window.TUI.modal.open/close` +
declarative `data-modal-open`/`data-modal-close` wiring:
- **Status-change** (booking row): a `.modal` pre-filled with the booking reference, a new-status `.field-select`, a
  note `.field-textarea`, and a **notify-customer toggle placeholder** (native `role="switch"` checkbox); validated save
  → toast + MAY update the visible row status badge.
- **Add-note** (booking/customer): a `.modal` with the reference, a **required** note `.field-textarea`, a note-type
  control, and an optional follow-up date; validated submit → toast + inline success (not persisted).
- **Assign-user** (optional): a `.modal` (or a toast) to pick a mock teammate; on confirm → toast.
Browser `alert()`, `confirm()`, and `prompt()` are **forbidden everywhere**; all feedback uses toast/modal/inline.

**Rationale**: Constitution II/VI forbid browser dialogs; the existing modal system already provides focus management and
reduced-motion-aware open/close (`window.TUI.modal`). Reuses proven components; adds markup + thin `dashboard.js` glue.

**Alternatives considered**: `confirm()`/`prompt()` for status/notes (rejected — forbidden); a brand-new modal system
(rejected — `.modal`/`TUI.modal` is the contract).

---

## D11. Mock data layout — additive catalogs reusing existing entity ids

**Decision**: Add four additive catalogs as backend-ready reference data:
- `assets/data/merchant-dashboard.json` — `company` (name/plan/subscriptionStatus/user/pendingTasks), `kpis` (≥8),
  `analytics` (bookingInquiriesOverTime, dealClicks, couponCopies, topDestinations, trafficSources, deviceBreakdown),
  `alerts` (≥6), `onboarding` (6 tasks), `activity` (≥5), `notifications` (topbar).
- `assets/data/merchant-bookings-preview.json` — **≥8** booking requests, each `reference`, `customerName`, `phone`,
  `requestTitle`, `destination`, `amount` (+`currency`), `status` (New/Contacted/Pending Payment/Confirmed/Cancelled/
  Completed), `paymentStatus` (Unpaid/Deposit/Paid/Refunded), `createdDate`, `assignedUser`.
- `assets/data/merchant-deals-preview.json` — **≥5** top deals: `title`, `destination`, `sourceBadge`, `clicks`,
  `inquiries`, `couponCopies`, `conversionEstimate`, `status`, and a public `dealId` (reusing `deals.json`) where
  applicable.
- `assets/data/merchant-integrations-preview.json` — **≥11** integrations: `name`, `status` (Connected mock / Not
  connected / API Ready / Coming soon / Needs configuration / Needs review), `description`.

The **static HTML** is authored to match these catalogs (the JSON is the backend-ready source of truth, not fetched at
runtime for the baseline). `dashboard.js` MAY read an inline `<script type="application/json">` block (mirroring the
Spec 003/004 inline-catalog pattern) if it needs a row/card template, but no section depends on fetch to render.

**Rationale**: Mirrors the existing `deals.json`/`featured.json` convention; reusing deal ids keeps cross-page identity
consistent (FR-027/SC-009) and lets top-deal CTAs resolve to real public deal pages; JSON is CMS/Django-ready. Honors III
(no runtime fetch for baseline content).

**Alternatives considered**: Hardcoding everything inline only (rejected — loses backend-ready reference data + cross-
page consistency); fetching JSON at runtime to render (rejected — III/FR-005, fails on `file://`).

---

## Summary of decisions

| # | Area | Decision |
|---|------|----------|
| D1 | Surface/dir & paths | New `dashboard/` dir (sibling of `pages/`); `../assets`/`../src/js`/`../pages` paths; add `./dashboard/**/*.html` to Tailwind globs |
| D2 | Shell | Own app shell (sidebar/topbar/drawer/breadcrumb/page-header/footer); reuse `head` conventions; **not** the public header/footer |
| D3 | Rendering | Static HTML baseline + JS enhancement; cards/rows carry `data-*` for the enhancement layer |
| D4 | Auth/state | No real auth gate; mock merchant identity; all mutations frontend/session-only; reload restores defaults; logout = toast |
| D5 | Page logic | New additive `src/js/dashboard.js` (dashboard only), dispatched by `<html data-page>`; `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` untouched |
| D6 | Charts | Analytics preview = CSS/HTML bars/sparklines + labels; no chart library/canvas/CDN; reduced-motion respected |
| D7 | Layout primitives | Small page-scoped `<style>` over tokens for shell/dropdowns/table→cards/KPI grid/chart bars/onboarding progress |
| D8 | Icons | Additive sidebar/topbar `<symbol>`s appended to the sprite; reuse existing where they fit; no existing symbol changed |
| D9 | Coming-soon | All 12 unbuilt merchant modules use `data-coming-soon` (toast, no 404); files not created; live links = index/back-to-site/public CTAs |
| D10 | Modals/dialogs | Status-change + add-note (+ optional assign) via existing `.modal`/`TUI.modal`; no `alert()`/`confirm()`/`prompt()` |
| D11 | Mock data | New `merchant-dashboard.json` + `merchant-bookings-preview.json` (≥8) + `merchant-deals-preview.json` (≥5) + `merchant-integrations-preview.json` (≥11); reuse `deals`/`coupons`/`compare-offers` ids; static HTML matches catalogs |

**Net shared-file impact**: **no behavioral change** to `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`,
`src/js/content.js`, or `src/js/member.js`; additive only — one new `src/js/dashboard.js`, four new
`assets/data/merchant-*.json` catalogs, additive `assets/icons/sprite.svg` symbols, and a one-line `tailwind.config.js`
content-glob add (`./dashboard/**/*.html`). `src/input.css` is reused; a small page-scoped `<style>` in
`dashboard/index.html` (as on the homepage) covers the shell, dropdowns, the responsive table, the KPI grid, the CSS
chart bars, and the onboarding progress. The public/member `pages/` and `partials/header.html`/`footer.html` are
unchanged. No `NEEDS CLARIFICATION` remain.
