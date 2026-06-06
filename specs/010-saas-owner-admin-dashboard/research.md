# Phase 0 Research — SaaS Owner Admin Dashboard (Spec 010)

All decisions are derived from the spec (+ its 2026-06-05 Clarifications), the Constitution v1.0.0, and the **actual** Spec 001–009 codebase (verified against `tailwind.config.js`, `src/js/{ui,main,dashboard}.js`, `partials/head.html`, the `dashboard/*.html` shell, `assets/icons/sprite.svg`, and `assets/data/`). No `NEEDS CLARIFICATION` items remain.

---

### D1 — A new, dedicated admin shell that is distinct from the merchant shell (same tokens, different role)

**Decision**: Author a **new** admin app shell (RTL sidebar + topbar + mobile drawer + scrim + breadcrumb + page header + notifications/user-menu/quick-action dropdowns + small footer) using page-scoped `.admin-*` classes and CSS variables, repeated consistently across all seven pages (only active item / breadcrumb / page header vary). Make it **visually distinct** from the merchant shell using the **existing palette**: the merchant rail is dark teal/lagoon (`--sidebar-bg:#042B2E`, active `#0E8186`, text lagoon-200); the **admin rail is a dark slate `ink`** (`--admin-sidebar-bg` ≈ `ink-900 #161C26` / a near-black `#11151d`) **with a gold `sunset` accent** (`--admin-sidebar-active` ≈ `sunset-500 #E08D12`, active text/indicator gold) and an explicit **"مالك المنصة · Owner Admin"** brand label. Keep the merchant teal as the body/link accent so the product still feels like one family.

**Rationale**: The spec mandates "clearly distinct from merchant dashboard pages" yet "same brand tokens, different accent usage if already supported," and Constitution IV/VIII require a premium, role-appropriate surface that preserves the product family. A dark-slate rail + gold accent reads as an "operational owner control room," is instantly distinguishable from the teal merchant rail, and introduces **no new tokens** (ink + sunset already exist). Page-scoped `.admin-*` classes avoid any collision with the merchant `.dash-*` classes.

**Alternatives considered**: Reuse the `.dash-*` shell verbatim (rejected — violates the distinctiveness requirement); invent a new color/identity (rejected — Constitution forbids a new visual identity; spec says reuse tokens); a light-rail admin (rejected — weaker distinction from the already-light merchant content area and less "owner control-room" gravity).

---

### D2 — Seven standalone pages in a new `admin/` directory; each authors its own `<head>`

**Decision**: Create `travel-saas-frontend/admin/{index,companies,company-details,plans,subscriptions,analytics,content}.html`, each a complete standalone file with `<html lang="ar" dir="rtl" data-page="admin-…">`, its own `<head>` following the `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo font preload, favicon, `theme-color`, `robots noindex`, Arabic title/meta, a BreadcrumbList JSON-LD), and the admin shell + a small page-scoped `<style>`. All paths resolve from `admin/`: CSS `../assets/css/tailwind.css`; JS `../src/js/{ui,main,admin}.js`; assets `../assets/…`; public `../pages/…`; merchant `../dashboard/…`; intra-admin links relative (`company-details.html?id=…`).

**Rationale**: Constitution III (standalone, backend-ready) + the canonical file layout list `admin/{index,companies,company-details,plans,subscriptions,analytics,content}` explicitly. The dashboard pages already prove the "own `<head>`, not the public header/footer" pattern with `../` paths; admin mirrors it one level deep.

**Alternatives considered**: A shared runtime-injected `<head>`/shell (rejected — breaks `file://` standalone rendering — III); using the public `header.html`/`footer.html` (rejected — wrong chrome for an app surface).

---

### D3 — A new self-contained `src/js/admin.js` (mirrors the `dashboard.js` pattern; does not extend it)

**Decision**: Add **one new file** `src/js/admin.js`, loaded `defer` after `ui.js` + `main.js` on every admin page. Structure mirrors `dashboard.js`: an IIFE with an `_ADMIN_PAGES` guard list (`admin-overview`, `admin-companies`, `admin-company-details`, `admin-plans`, `admin-subscriptions`, `admin-analytics`, `admin-content`) read from `document.documentElement.dataset.page`; early-return if not an admin page; on `DOMContentLoaded`, run shared **shell init** (sidebar open/close + scrim, the three topbar `DropdownController`s, `data-year`) and shared **primitives** (a `TUI.toast` wrapper, a row-action-menu controller, a `validateAndSubmit` wrapper over `TUI.validateForm`, a shared confirm-modal helper, a generic **filter/sort/search engine**, `slugify`), then dispatch to the matching **per-page controller**. It **reuses** `window.TUI` and `main.js`'s declarative `data-*` delegation (drawer/modal/coming-soon/copy/toast/validate) and **imports/modifies nothing** in the existing JS.

**Rationale**: Constitution II (vanilla JS, only when needed) + the workflow's preservation rule. Keeping admin logic in its own file isolates the owner tenant from the merchant tenant (zero merchant-regression risk), while mirroring the proven `dashboard.js` IIFE/guard/dispatch shape keeps the codebase consistent. `ui.js`/`main.js` already provide toasts, modals, drawers, validation, copy, and `data-*` wiring, so `admin.js` only adds genuinely page-specific behavior.

**Alternatives considered**: Extend `dashboard.js` (rejected — couples two tenants; merchant-regression risk; the spec says create/extend `admin.js`); extend `main.js` (rejected — every page loads it → regression risk); per-page inline `<script>` (rejected — spec forbids inline page JS except JSON-LD/safe mock data).

---

### D4 — One-line additive Tailwind `content` glob for `admin/`

**Decision**: Add `'./admin/**/*.html'` to the `content` array in `tailwind.config.js` (joining `./pages`, `./partials`, `./dashboard`, `./src/js`). No theme/token/plugin change.

**Rationale**: Verified the current globs do **not** include `admin/`; without the glob, Tailwind's purge drops every utility class the admin pages use and they render unstyled. This is the single, unavoidable foundation-config touch (the one difference from Spec 009, whose `./dashboard` glob already existed) and it is purely additive.

**Alternatives considered**: Inline all admin styles in page `<style>` (rejected — defeats the utility build; unmaintainable); a second Tailwind config/build for `admin/` (rejected — a redundant pipeline for one folder); a `safelist` (rejected — unbounded, fragile).

---

### D5 — Static-HTML-first; JSON catalogs are backend-ready reference, never a baseline dependency

**Decision**: Author every page's core content (KPIs, feeds, all table rows, every card, all six content tab panels, usage bars, billing timeline, comparison table, and every modal's content container) as **static HTML**. The seven `admin-*.json` catalogs exist as **backend-ready reference/mock data** that the static HTML mirrors 1:1; pages do **not** `fetch` to render baseline content. A page MAY read a `#hash` deep link (e.g., `#integrations`) or an inline `<script type="application/json">` block for **enhancement only**.

**Rationale**: Constitution III + the spec's explicit "do not make pages depend on client-side fetch." This guarantees `file://` and no-JS rendering and maps cleanly to future Django templates fed by the same shapes.

**Alternatives considered**: `fetch()`-render the catalogs on load (rejected — fails no-JS/`file://` and III); a JS template engine (rejected — forbidden framework surface, fails III).

---

### D6 — All chart-like visuals are pure CSS/HTML — no chart library

**Decision**: Build the overview's 5 analytics previews, the analytics page's **8** visuals, and all usage/plan/progress bars as **CSS/HTML** from existing tokens in a page-scoped `<style>`: vertical/horizontal **bars** (flex + `height/width:%`), **trend/area lines** as bar-columns with a gradient fill or a CSS sparkline, **distribution donuts** via `conic-gradient`, **stacked-percentage** bars, and labeled legends. Each visual has an accessible text alternative (visually-hidden summary or a `<table>`/`<dl>` of the same values) and a visible "بيانات تجريبية" label.

**Rationale**: Constitution II forbids external chart libraries; III requires no-JS rendering. CSS visuals render statically, match the Spec 006–009 precedent (`charts.js` is referenced by the constitution but does not exist — the dashboards already use CSS visuals), and stay premium.

**Alternatives considered**: Chart.js/ApexCharts/D3 (rejected — forbidden + would not render without JS); inline SVG generated by JS (rejected — fails no-JS baseline); static raster chart images (rejected — not responsive/RTL-flexible, not token-driven).

---

### D7 — A generic client-side filter/sort/search engine with `aria-live` count, removable chips, and reset

**Decision**: `admin.js` exposes one reusable engine used by companies + subscriptions (and the content tabs' lightweight filtering): it reads `data-*` attributes on each row/card (e.g., `data-plan`, `data-sub-status`, `data-company-status`, `data-country`, `data-activity`, `data-integration`, `data-trial-ending`, `data-mrr`, `data-last-active`, `data-name`/`data-owner`/`data-email` for search), shows/hides rows, recomputes a visible **result count** announced via an `aria-live="polite"` region, renders **removable active-filter chips**, supports the per-page **sort** options (reordering DOM nodes), and a **reset** that clears all filters/search/sort. The companies **segment cards** are buttons that apply a preset filter through the same engine; an **empty state** shows when zero rows match.

**Rationale**: Constitution VII (listing pages need filters/sort/empty/reset) + the spec's per-page filter/sort/count/chips requirements + WCAG `aria-live`. A single engine keeps companies and subscriptions consistent and avoids duplicated logic.

**Alternatives considered**: Per-page bespoke filtering (rejected — duplication/inconsistency); a datagrid library (rejected — forbidden by II); server-side filtering (rejected — no backend).

---

### D8 — Every confirmation/destructive action uses `.modal`/`TUI.modal`; no browser dialogs

**Decision**: Pre-author each modal's markup statically (`[data-modal="…"]` + `.modal-panel`) and open/close via `data-modal-open|close` (main.js) or `TUI.modal.open|close`. A shared **confirm-modal helper** in `admin.js` wires "confirm → run callback → toast → close" for destructive actions: **bulk-suspend, suspend/reactivate, cancel-subscription, disable-plan, reset-usage, publish/unpublish, delete-content**, and the **login-as safety** modal. Validated form modals (add-company, change-plan, extend-trial, add-note, create/edit-plan, create/edit-content) use `validateAndSubmit` → inline `aria-invalid`/`aria-describedby` errors → success toast → close (+ optional optimistic row).

**Rationale**: Constitution II/VI forbid `alert()`/`confirm()`/`prompt()`; `ui.js` already provides focus-managed, reduced-motion-aware modals + toasts.

**Alternatives considered**: Browser dialogs (rejected — forbidden); a bespoke modal system (rejected — `TUI.modal` already exists); confirm-on-click without a dialog for destructive actions (rejected — unsafe/UX-poor; spec mandates custom confirmations).

---

### D9 — "Login as company" is always disabled/safe with an impersonation-honesty safety modal

**Decision**: Render every "Login as company / تسجيل الدخول كشركة" control as **visibly disabled** (or styled as safe-only). Where it is actionable (company row menu + company-details header), clicking opens a **safety modal/toast** stating impersonation is not active in this frontend prototype (لا يتم تسجيل دخول كالشركة فعليًا), never a real session.

**Rationale**: Spec + Constitution IX (never faked). Impersonation is high-risk; honesty and a safe affordance are mandatory.

**Alternatives considered**: A functional impersonation stub (rejected — dishonest, out of scope); hiding the control entirely (rejected — the spec wants it visible-but-safe to communicate the future capability).

---

### D10 — Session-only state; reload restores mock defaults

**Decision**: All interactions mutate **in-memory DOM only** — added/edited rows, toggled company/subscription status, feature/checklist toggles, filter/sort/search selections, monthly/yearly + date-range + compare selections, bulk selection. Nothing persists; a reload restores the static mock defaults. `localStorage` MAY be used only as an optional convenience and **no copy claims server/permanent storage** (لا يتم الحفظ على خادم في هذه النسخة).

**Rationale**: Spec FR-061 + Constitution I/IX. Keeps the prototype honest and backend-ready without faking persistence.

**Alternatives considered**: `localStorage`-backed persistence presented as "saved" (rejected — implies a real backend; dishonest); IndexedDB (rejected — overkill, same honesty problem).

---

### D11 — Seven backend-ready JSON catalogs; reuse existing ids; self-sufficient where merchant catalogs are absent

**Decision**: Add `admin-overview.json`, `admin-companies.json` (≥12), `admin-plans.json` (4 + comparison matrix), `admin-subscriptions.json` (≥12), `admin-platform-analytics.json` (≥12 KPIs + 8 series + 5 tables + recommendations), `admin-content.json` (homepage sections + destinations + blog + featured deals/coupons + pending review), and `admin-integration-health.json` (8 integrations) under `assets/data/`. Reuse `deals.json`/`merchant-deals.json` deal ids (top-deals, featured deals → `../pages/deal-details.html?id=`), `merchant-coupons.json` coupon ids (featured coupons, coupon performance), `destinations-full.json` destination ids (top destinations, content destinations), and `articles.json` article ids (content blog). Where an intended source is **absent** — `merchant-bookings.json`/`merchant-customers.json` were never created (only `merchant-bookings-preview.json` exists) and the Spec 008 merchant bookings/customers pages were never built — the admin catalogs carry their own believable booking/customer counts (the static HTML is self-sufficient).

**Rationale**: Spec FR-062–067 + Constitution VII (believable, consistent mock data) + the data-as-reference convention. Reusing ids keeps platform identity consistent across tenants.

**Alternatives considered**: Inventing parallel deal/coupon/destination ids (rejected — breaks cross-page consistency); depending on the absent merchant-bookings/customers catalogs (rejected — they don't exist; admin must be self-sufficient).

---

### D12 — Integration-monitoring deep-link + settings coming-soon; unbuilt surfaces stay coming-soon; no merchant/public edits

**Decision**: The admin sidebar links the seven real pages; `مراقبة التكاملات` deep-links to `analytics.html#integrations` (the integration-health section surfaced on both overview and analytics); `الإعدادات` is a **coming-soon toast** (no admin-settings page in scope); `العودة للموقع`→`../pages/index.html`; `لوحة الشركات`→`../dashboard/index.html`. The unbuilt merchant bookings/customers pages and any owner billing/support surface beyond these seven pages stay **coming-soon** (no 404). **No existing public/member/merchant page is edited** — the merchant shell already keeps the owner-admin surface coming-soon, so no link rewiring is required (the spec permits safe link additions but does not require them).

**Rationale**: Constitution VI (no dead links/404s) + the spec's coming-soon directives + the preservation rule (don't touch existing pages unless required). Linking integration-monitoring to the analytics section avoids a thin standalone page while honoring the sidebar item.

**Alternatives considered**: A standalone integration-monitoring page (rejected — out of scope; duplicates the analytics/overview health surfaces); rewiring merchant pages to link into admin (rejected — not required; would edit preserved merchant pages); leaving `الإعدادات` as a dead link (rejected — Constitution VI).

---

### D13 — Mobile-first responsive behavior: table→cards, grids reflow, sidebar→drawer, ~44px targets, reduced-motion

**Decision**: At ≤ ~640px the companies/subscriptions/comparison/insight tables collapse to **stacked labeled cards** (the Spec 006–009 `data-label` pattern); the KPI / integration-health / plan / segment / booking-stat / recommendation grids reflow to one column; the content tabs become a scrollable/stacked tab strip with all panels in the DOM; the sidebar becomes an off-canvas **drawer with a scrim** (toggled by the topbar menu button, closable via Esc/scrim/`data-drawer-close`); touch targets stay ~44px; `prefers-reduced-motion` disables non-essential transitions; nothing overflows horizontally at 360px.

**Rationale**: Constitution V (mobile-first, near-native) + the spec's 360px/no-overflow requirement + WCAG AA. Reuses the established table→cards and drawer patterns.

**Alternatives considered**: Horizontal-scroll tables on mobile (rejected — overflow + poor UX); hiding columns (rejected — data loss); a separate mobile layout (rejected — duplication; one responsive layout suffices).

---

**Resolved**: no open questions. The seven authoring-time clarifications (D1, D9, D12 cover the spec's five resolved ambiguities + the 008-absent note) are encoded above. Phase 1 (`data-model.md`, `contracts/*`, `quickstart.md`) proceeds on these decisions.
