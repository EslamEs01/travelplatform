# Phase 0 Research: Merchant Analytics + Integrations + Settings

**Feature**: `009-merchant-analytics-integrations-settings` | **Date**: 2026-06-04
**Inputs**: `spec.md` (+ Clarifications 2026-06-04), Constitution v1.0.0, Specs 001/006/007 artifacts, the live codebase (`src/js/dashboard.js`, `src/js/ui.js`, `src/js/main.js`, `assets/icons/sprite.svg`, `dashboard/index.html`, `dashboard/deals.html`).

This phase records the technical decisions behind the plan. The spec's Clarifications already resolved the ten open product questions; the work below derives the **implementation** decisions (D1–D13) and confirms there are **no `NEEDS CLARIFICATION` items remaining**. Every decision is constrained by the Constitution (frontend-only, approved stack, standalone/backend-ready, RTL/mobile-first, no dead interactions, never-faked) and by the spec's honesty wording.

---

## D1. Reuse the Spec 006–007 dashboard shell verbatim across all three pages (clarified)

**Decision**: Compose `analytics.html`, `integrations.html`, and `settings.html` from the **exact** Spec 006 shell already carried through the Spec 007 pages — the same RTL sidebar (brand + nav), topbar (mobile menu button, breadcrumb/current area, company switcher, global search, notifications/quick-add/user dropdowns), mobile drawer + scrim, breadcrumb, page-header region, and dashboard footer. Only the **active sidebar item** (`aria-current="page"` on التحليلات / التكاملات / الإعدادات), the **breadcrumb tail**, and the **page-header title/description/CTAs** vary. Each page authors its own `<head>` from the `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo preload, favicon, theme-color, `robots noindex`). The public marketing `partials/header.html`/`footer.html` are **never** used.

**Rationale**: Visual + behavioral consistency with the rest of the merchant app; zero new shell code; honors the preservation rule (VIII) and standalone-page rule (III). The shell already exists and is proven across six pages.

**Alternatives considered**: A runtime-injected shared shell (rejected — breaks `file://` standalone rendering, III); the public header/footer (rejected — wrong surface, spec-forbidden); a brand-new dashboard layout (rejected — no new visual identity, IV/VIII).

## D2. Page logic — extend `dashboard.js` additively with three per-page controllers (clarified)

**Decision**: Add the three pages to the module's `_DASH_PAGES` guard array, add three `if (_currentPage === 'merchant-analytics' | 'merchant-integrations' | 'merchant-settings') { init…(); }` dispatch lines, and add three `init…()` controller functions inside the same IIFE. Reuse the module's existing primitives: `DropdownController` (row/action menus), the row-action-menu controller, the frontend-only form-submit wrapper, the **shared confirm-modal helper** (already present for Spec 007 delete/archive), and `window.TUI.modal`/`toast`/`validateForm`/`copyToClipboard`, plus `main.js`'s `data-*` delegation. **No existing controller is modified** (the Spec 006 `merchant-dashboard` controller and the five Spec 007 controllers are untouched); `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` are untouched.

**Rationale**: The spec scopes page logic into `dashboard.js` additively; the dispatch-by-`data-page` pattern and reusable primitives are already established (Specs 006–007); additive-only keeps regression risk at zero.

**Alternatives considered**: A new JS file per page (rejected — spec says extend `dashboard.js`; primitives already live there); extending `main.js` (rejected — page-specific logic in a globally-loaded file → regression risk); inline `<script>` (rejected — project uses `defer` modules, no bespoke inline JS except JSON-LD/mock JSON).

## D3. Analytics charts — CSS/static visuals only, static metrics (no library, no fake live query)

**Decision**: Render all four over-time visuals (booking inquiries, deal clicks, coupon copies, conversion estimate) and the traffic/device breakdowns as **pure CSS/HTML**: vertical/horizontal bars sized by inline `--val` custom properties or width %, sparkline-style mini bar rows, progress lines, and stacked/segmented percentage bars (a donut MAY use a `conic-gradient`). All numbers are **static** in the HTML. The date-range control changes the **active state** of the chosen range chip and (for نطاق مخصص) reveals from/to + apply and shows a frontend-only toast on apply (validating from ≤ to); the compare toggle flips a **visual** comparison state. The metrics do **not** silently recompute — that would fake a live re-query and is dishonest (IX). Copy explains the data is demo for the indicative period.

**Rationale**: Constitution II forbids external chart libraries; III requires no-JS rendering (CSS bars render statically); IX forbids faking live data. CSS visuals are polished, accessible (each bar/segment carries a text label + value, not color-only), and reduced-motion-safe.

**Alternatives considered**: An external chart library / Canvas (rejected — forbidden II + would not render without JS, III); JS that re-renders fake datasets per range (rejected — implies live tracking, IX); a `charts.js` module (rejected — the constitution lists it as optional but CSS is simpler and no-JS-safe; not added).

## D4. Analytics tables — static ranked rows reusing existing ids; copy + links + mock toasts; table→cards

**Decision**: The top-performing-deals table (≥8 rows) and coupon-performance table (≥8 rows) are **static `<table>`s** whose rows reuse `deals.json`/`merchant-deals.json` and `merchant-coupons.json` ids. Deal-row actions link to `../pages/deal-details.html?id=<id>` (view public deal) and `deals.html` (manage), with a mock toast for any non-navigational action; coupon-row actions copy the code (`copyToClipboard` + toast) and link to `coupons.html`. Both tables collapse to **stacked labeled cards** at ≤360px via the page-scoped `<style>` (the Spec 006/007 table→cards precedent). Coupon codes render `dir="ltr"`.

**Rationale**: Static-first (III); consistent identity across the platform (VII mock-data consistency); reuses the proven responsive-table pattern and `copyToClipboard`.

**Alternatives considered**: A JS-rendered datagrid (rejected — forbidden lib + no-JS fail); horizontal scroll on mobile (rejected — V no-overflow at 360px).

## D5. Integrations — static cards + client-side category filter + pre-authored configure modals

**Decision**: Author every integration as a **static card** carrying `data-category` (affiliate | apis | coupons | scraping | notifications | manual), a status badge, a credentials-required note, a last-sync mock, a health dot, an enable/disable toggle, a Configure button (`data-modal-open="cfg-<key>"`), and a Test button. The 7 category tabs are buttons with `role="tab"`/`aria-selected`; the controller shows/hides cards by `data-category` and updates an `aria-live` visible count (الكل shows all). Each Configure button opens a **pre-authored static `.modal`** (`[data-modal="cfg-<key>"]`) containing the specified fields; Save runs `validateForm` where fields are required then shows a mock toast (no persist, no credential validation); Test / Test-all / test-message show an "اختبار اتصال تجريبي — لا يتم الاتصال بأي مصدر خارجي" toast (no network). Enable/disable, auto-import, and manual-review toggles flip visual state (+ status text) only.

**Rationale**: Static-first (III — all cards + modals exist in the DOM); no network (IX); reuses `TUI.modal` + `validateForm` + `data-modal-open`. Filtering static DOM is the same technique Spec 007 lists use.

**Alternatives considered**: Fetching an integrations catalog to render cards (rejected — runtime fetch for baseline, III); building modal markup in JS (rejected — no-JS fail + heavier); one giant modal switching content (rejected — per-integration field sets differ; separate modals are clearer and focus-manageable).

## D6. Scraping / review honesty — baked into cards, the Scraping Review Queue modal, and the FAQ

**Decision**: The Scraping Review group (Scraping Review Queue, Source URL Monitor, Manual Approval Workflow, Duplicate Coupon Detector, Expiry Validator) and the Scraping Review Queue configure modal carry explicit, prominent copy: **no data is scraped in this frontend**, **sources must respect their policies**, **nothing is published automatically**, and **all imported content requires manual review before publishing** (لا يتم نشر أي كوبون أو عرض مجمّع تلقائيًا قبل المراجعة). The FAQ repeats "هل يتم تشغيل Scraping الآن؟ → لا" and "هل يتم نشر الكوبونات تلقائيًا؟ → لا، كل المصادر تحتاج مراجعة".

**Rationale**: IX (never-faked) + legal/ethical caution; this is the most sensitive surface in the feature and must be unambiguous.

**Alternatives considered**: A single global note (rejected — must appear at each scraping surface + the modal + FAQ to be unmissable).

## D7. Settings — tabbed sections, static-first; forms validated; branding live preview; mock save/upload

**Decision**: Render all seven sections (company / branding / booking / notifications / team / security / plan-usage) **in the DOM**. With no JS they stack and are all readable; the JS tab controller (`role="tablist"` buttons + panels) shows one panel at a time, sets `aria-selected`/`aria-current`, and honors a `#section` **deep-link** on load (and updates the hash on tab change). Company / booking / change-password / invite forms use `TUI.validateForm` (required + email + a custom new-password = confirm rule) and on valid submit show a mock toast (no persist; الإعدادات لا تُحفظ على خادم). Branding: primary/secondary color inputs and the public-slug input drive a **live preview** (brand card swatches + `https://…/<slug>` URL text). Logo/cover "upload" buttons show a mock toast (لا يتم رفع ملفات حقيقية الآن); an optional local `URL.createObjectURL` preview MAY be shown for UX without uploading.

**Rationale**: Static-first (III); reuses `validateForm`; live preview is a cheap, honest enhancement; matches the Spec 007 slug-preview precedent.

**Alternatives considered**: Tabs that lazy-inject section markup (rejected — no-JS fail, III); a real file upload (rejected — frontend-only, IX); separate pages per section (rejected — spec wants one tabbed settings page).

## D8. Team management — static table + invite/change-role/disable-remove via modals (no dialogs)

**Decision**: The team table is **static** (≥6 members from `merchant-team.json` identity: name, email `dir="ltr"`, role, status, last-active, permissions summary, actions menu). Invite-member opens a modal (name, email, role, permissions checkboxes, note) → `validateForm` → mock toast (no invite sent). Change-role opens a modal (member, new role, permissions, note) → on save a mock toast and MAY update the visible role cell + `aria-live`. Disable/enable and Remove open the **shared confirm-modal helper** / `TUI.modal` → on confirm a mock toast (and MAY flip the visible status). Resend-invite shows a mock toast. **No browser dialogs.**

**Rationale**: VI (no dead interactions, no `confirm()`); reuses the Spec 007 confirm-modal helper and `TUI.modal`/`validateForm`.

**Alternatives considered**: `confirm()`/`prompt()` (rejected — forbidden II/VI); inline-editable role cells (rejected — a modal is clearer + accessible + matches the spec).

## D9. Security placeholders — validated change-password, 2FA toggle, API + sessions/login-history mock

**Decision**: The change-password form validates current/new/confirm client-side (required + min length + new = confirm) and on valid submit shows a mock toast — **no password is changed** (تغيير تجريبي — لا يتم تغيير كلمة المرور فعليًا). 2FA is a placeholder toggle (visual state only; لا يتم تفعيل المصادقة الثنائية فعليًا). API access is a placeholder card (key shown masked / "قابل للربط لاحقًا"). Sessions + login-history are **static mock lists** clearly labelled as no-real-session/مثال توضيحي.

**Rationale**: IX (never-faked) + VI (validated forms with states); no auth backend exists (I).

**Alternatives considered**: A working password/2FA flow (rejected — no backend, frontend-only); hiding the section (rejected — the spec wants visible, honest placeholders to sell the roadmap).

## D10. Plan usage — CSS percentage bars; upgrade CTA → coming-soon (billing not built)

**Decision**: Plan usage is a set of **CSS percentage bars** (≥7: deals, coupons, team users, integrations, booking inquiries, customers, storage placeholder) sized by width %/`--pct`, each showing used/limit text and an `aria-valuenow`-style accessible label, sourced from `merchant-usage.json`. The current plan (Starter/Growth/Pro mock), renewal-date mock, and billing note render statically. The **upgrade CTA shows a coming-soon toast** because the SaaS-owner billing surface is out of scope/unbuilt.

**Rationale**: II (CSS, no chart lib), VI (coming-soon is a visible action, not dead), VIII (billing belongs to the SaaS-owner admin — anticipated, not built).

**Alternatives considered**: A progress library (rejected — forbidden II); a fake checkout (rejected — no billing, IX); a dead upgrade button (rejected — VI).

## D11. Mock-data catalogs — five additive backend-ready files reusing existing ids (clarified)

**Decision**: Add `merchant-analytics.json`, `merchant-integrations.json`, `merchant-settings.json`, `merchant-team.json`, and `merchant-usage.json` under `assets/data/` as **backend-ready reference data**, reusing `deals.json`/`merchant-deals.json` deal ids (top-deals rows, destination links) and `merchant-coupons.json` coupon ids (coupon-performance rows) so identity is consistent platform-wide. The static HTML mirrors these catalogs; the baseline does **not** fetch them at runtime (III). Schemas are defined in `contracts/mock-data.contract.md`.

**Rationale**: VII (believable, consistent mock data) + III (no runtime-fetch dependency) + backend-readiness (Django/CMS-ready), mirroring the existing `deals.json`/`merchant-*-preview.json` convention.

**Alternatives considered**: Inline-only data (rejected — loses backend-ready reference + cross-page consistency); one mega-file (rejected — five focused catalogs are clearer and map to the three pages' concerns).

## D12. Icons — additive sprite symbols; existing reused

**Decision**: Append the symbols the 53-symbol sprite lacks: `icon-mail`, `icon-whatsapp`, `icon-key`, `icon-lock`, `icon-credit-card`, `icon-palette`, `icon-link`, `icon-activity`, `icon-building`, `icon-award`, `icon-pie-chart`, `icon-map-pin`, `icon-shield`. Reuse existing symbols where they fit: `icon-bar-chart` (analytics), `icon-plug` (integrations), `icon-settings` (settings/configure), `icon-bell` (notifications/alerts), `icon-users`/`icon-user-plus` (team), `icon-trend-up|down` (trends), `icon-filter`/`icon-sliders` (category), `icon-upload`/`icon-download` (export/upload), `icon-refresh` (sync/test), `icon-wand` (recommendation), `icon-percent` (conversion), `icon-clock` (last-sync/response time), `icon-copy`/`icon-eye`/`icon-edit`/`icon-external`, `icon-globe`/`icon-tag`/`icon-ticket`/`icon-calendar`, `icon-shield-check`/`icon-check-circle`/`icon-close`/`icon-search`/`icon-chevron-down`/`icon-more`.

**Rationale**: One sprite via `<use href="…sprite.svg#…">`; appended symbols change nothing existing (zero regression); clear icons support IV.

**Alternatives considered**: A second sprite / per-icon `<img>` (rejected — one-sprite convention); reusing ambiguous icons (rejected — clarity, IV).

## D13. Navigation rewiring (link-only) of the shared shell; bookings/customers + admin stay coming-soon (clarified)

**Decision**: Rewire **only** التحليلات → `analytics.html`, التكاملات → `integrations.html`, الإعدادات → `settings.html` from `data-coming-soon` to real `href`s across the shell — in Spec 006 `index.html` (sidebar + quick-add + any analytics/integration/settings overview CTAs) **and** in the five Spec 007 pages' sidebars — each new page setting `aria-current` on its own item. The intended **Spec 008 bookings/customers pages are absent from the repository** and the **SaaS-owner admin/billing/support** surface is out of scope, so their controls keep `data-coming-soon` (visible toast, no navigation to a missing file — no 404). No Spec 006/007 section/layout/copy is removed or redesigned.

**Rationale**: VI (no dead interactions, no 404) + VIII (preserve existing sections; anticipate unbuilt ones). The spec's "only rewire links to pages that now exist" rule resolves the user's rewiring list against the actual repo state (bookings/customers files do not exist).

**Alternatives considered**: Rewiring bookings/customers too (rejected — files don't exist → 404/dead link, VI); creating bookings/customers here (rejected — out of scope; that is Spec 008); removing the coming-soon links (rejected — VIII anticipation + the shell stays complete).

---

## Summary of decisions

| # | Decision | Primary constitutional driver |
|---|---|---|
| D1 | Reuse Spec 006–007 shell verbatim across the 3 pages (vary active item/breadcrumb/header only) | III, IV, VIII |
| D2 | Extend `dashboard.js` additively (3 controllers + 3 guard/dispatch entries; reuse primitives; nothing existing changed) | II, Dev-Workflow |
| D3 | Analytics visuals = CSS/HTML only, static metrics; date-range = active-state + toast (no fake live query) | II, III, IX |
| D4 | Analytics tables = static rows reusing existing ids; copy/links/mock toasts; table→cards at 360px | III, V, VII |
| D5 | Integrations = static cards + client-side category filter + pre-authored `.modal` configure dialogs (Save/Test = mock toasts) | III, IX |
| D6 | Scraping/review honesty baked into cards + modal + FAQ (no scrape, no auto-publish, manual review) | IX |
| D7 | Settings = all 7 sections in DOM (no-JS stacked) + tab/anchor nav; forms validated; branding live preview; mock save/upload | III, VI, IX |
| D8 | Team = static table + invite/change-role/disable-remove via `TUI.modal`/confirm helper (no dialogs) | VI |
| D9 | Security = validated change-password (no real change) + 2FA/API placeholders + mock sessions/login-history | I, IX |
| D10 | Plan usage = CSS percentage bars; upgrade CTA → coming-soon toast | II, VI, VIII |
| D11 | Five additive backend-ready JSON catalogs reusing existing deal/coupon ids; static HTML is baseline | III, VII |
| D12 | Additive sprite symbols (mail/whatsapp/key/lock/credit-card/palette/link/activity/building/award/pie-chart/map-pin/shield) | IV |
| D13 | Link-only nav rewiring of the 3 built pages across the shell; bookings/customers + admin stay coming-soon (no 404) | VI, VIII |

**No `NEEDS CLARIFICATION` items remain.** All product questions were resolved in the spec's Clarifications (2026-06-04); the decisions above are implementation-level and fully constrained by the Constitution. Ready for Phase 1.
