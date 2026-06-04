# Implementation Plan: Merchant Dashboard Shell + Overview (Travel SaaS Platform)

**Branch**: `006-merchant-dashboard-shell` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/006-merchant-dashboard-shell/spec.md`

## Summary

Open the **merchant (travel-agency) surface** of the platform with its first dashboard page — `dashboard/index.html`
(`data-page="merchant-dashboard"`) — which is **both** a complete, client-presentable merchant **overview** **and** the
reusable **app-like dashboard shell** (sidebar + topbar + mobile drawer + breadcrumb + page header + footer + empty/
loading patterns) every future merchant page (deals, coupons, bookings, customers, analytics, integrations, settings)
will be composed from. The overview presents a believable, clearly-mock snapshot of an agency's operation: a welcome/
agency summary (company, plan badge, subscription-status mock, pending-tasks note, CTAs), ≥8 KPI cards, a recent
booking-requests table/card hybrid (≥8 rows) with row action menus + status-change and add-note **custom modals**, ≥5
top-performing deals, a quick-actions panel, an integration-readiness card (≥11), an analytics preview built from
**pure CSS/HTML** (no chart library), ≥6 operational alerts, an onboarding checklist with a live progress indicator, an
activity feed, and reusable skeleton/empty patterns — all on top of the Spec 001 foundation and consistent with the Spec
002–005 pattern, as a frontend-only prototype that is **explicit and honest** (no real account/session, live data,
booking, analytics, integration, notification, subscription, or payment) while staying backend-ready.

**Technical approach**: Static composition + mock content, mirroring the Spec 002–005 pattern, but adapting the design
language into an **app shell** rather than the public marketing header/footer. The page lives in a **new `dashboard/`
directory** (a sibling of `pages/`, per the constitution's canonical structure) and authors its own `<head>` using the
shared conventions from `partials/head.html` (same `../assets/css/tailwind.css`, Cairo font preload, favicon, theme
color) — it does **not** inline `partials/header.html` or `partials/footer.html`. The dashboard chrome (RTL sidebar of
merchant modules, topbar with mobile-menu/search/notifications/quick-add/user-menu dropdowns, mobile drawer + scrim,
breadcrumb, page header, dashboard footer) is built from existing tokens (`tailwind.config.js` — lagoon/sunset/ink,
shadows, z-index `dropdown`/`drawer`/`modal`/`toast`) and component classes (`src/input.css`: `.btn*`, `.card*`,
`.badge*`/`.badge-source-*`, `.field*`, `.modal*`, `.drawer*`, `.skeleton*`, `.empty-state`, `.inline-msg*`,
`.breadcrumb*`, `.toast*`), plus a **small page-scoped `<style>`** for the dashboard-specific layout primitives (sidebar/
topbar grid, dropdown menus, the responsive table→cards, the KPI grid, and the CSS-only chart bars/sparklines) — exactly
the page-scoped-style precedent `index.html` and the content pages already use. **All core content is static HTML** so
the dashboard renders without JavaScript (Constitution III); a single **new additive** module `src/js/dashboard.js`
(loaded only by the dashboard, dispatched by `<html data-page="merchant-dashboard">`, the same dispatch Spec 003's
`discovery.js` / Spec 004's `content.js` / Spec 005's `member.js` use) enhances it with: mobile sidebar/drawer toggle
(reusing `window.TUI.drawer` + scrim), the three topbar dropdowns, table row action menus, the status-change and
add-note modals (reusing `window.TUI.modal` + `validateForm`), contact-customer/assign-user/quick-action/integration
toasts, onboarding-checklist toggling with a live `aria-live` progress update, and the global-search mock state.
Confirmations and secondary flows use the existing `.modal`/`TUI.modal` pattern — **no browser dialogs**. Every control
targeting an **unbuilt** merchant page (deals, create-deal, edit-deal, coupons, create-coupon, bookings, booking-details,
customers, customer-details, analytics, integrations, settings) uses the existing `data-coming-soon` behavior (info
toast, no 404); the only live links are `الرئيسية → index.html`, `العودة للموقع → ../pages/index.html`, and public deal/
compare CTAs. New believable mock content lives in additive `assets/data/merchant-dashboard.json`,
`merchant-bookings-preview.json` (≥8), `merchant-deals-preview.json` (≥5), and `merchant-integrations-preview.json`
(≥11); deal/coupon/route references reuse existing `deals.json`/`coupons.json`/`compare-offers.json` ids. The only
shared-asset touches are **additive**: the new `dashboard.js`, the four new JSON catalogs, and **additive sidebar/topbar
icon symbols** appended to `assets/icons/sprite.svg` (no existing symbol changed). **No behavioral change** is made to
`src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, or `src/js/member.js`; no existing public/
member page or section is removed; no new visual identity is introduced; no backend.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via the existing Tailwind CSS v3.4 local build (PostCSS/Autoprefixer); vanilla
JavaScript (ES2020, classic `defer` scripts — no bundler). Build-time runtime: Node.js ≥ 18 LTS + npm (unchanged from
Spec 001–005).
**Primary Dependencies**: None added. Reuses installed `tailwindcss@^3.4`, `postcss`, `autoprefixer`,
`@tailwindcss/forms`, and the existing `window.TUI` namespace (`toast` / `modal.open|close` / `drawer.open|close|toggle`
/ `validateForm(form,{rules})` / `copyToClipboard` / `prefersReducedMotion`) and `main.js`'s declarative `data-*`
delegation (`data-coming-soon`, `data-modal-open|close`, `data-drawer-open|close|drawer`, `data-copy`, `data-toast`,
`data-validate`/`data-frontend-form`, `data-year`). No runtime framework, no CDN, no external chart library. `dashboard.js`
MAY read a query param or an inline `<script type="application/json">` mock block but the baseline content does **not**
depend on `fetch`.
**Storage**: N/A — no backend/database/CMS/account/subscription store. Mock content is realistic, clearly-mock static
HTML mirroring small local `assets/data/*.json` files (`merchant-dashboard.json`, `merchant-bookings-preview.json`,
`merchant-deals-preview.json`, `merchant-integrations-preview.json` new; `deals.json`/`coupons.json`/`compare-offers.json`
referenced unchanged). Dashboard state (dropdown/drawer open-close, onboarding toggles + progress, a mock booking-status
change, an added note, search state) is **in-memory/session-only**; reload restores mock defaults; nothing is persisted
to a server. `localStorage` MAY be used only as an optional frontend convenience and no copy claims permanent/server
storage.
**Testing**: Manual QA against the per-page "done" checklist (`quickstart.md`) + automated accessibility audit (axe-core)
targeting WCAG 2.1 AA, HTML validation (`html-validate`), and Prettier/Stylelint. The stack-compliance grep (now also
asserting **zero external chart library**) is a hard gate. No unit-test framework (consistent with Spec 001–005). A
`qa-results.md` is produced after implementation.
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major versions.
Mobile-first (~320–360px up to desktop); the dashboard must feel close to a native app on mobile.
**Project Type**: Static frontend web application (single project). This phase opens the **merchant surface**: one new
`dashboard/` directory + one page (`dashboard/index.html`) in scope; future merchant pages are coming-soon only. No
backend tier.
**Performance Goals**: Dashboard interactive in < 2s under Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT) + 4× CPU
throttle (SC-016); minified CSS reused; lazy non-critical images; zero runtime CDN requests; **no external chart
library** (charts are CSS/HTML); dropdowns/modals/checklist/table-actions operate on the in-page DOM (no network).
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no external chart lib; no
`alert()`/`confirm()`/`prompt()`); Arabic-RTL default + English-ready; WCAG 2.1 AA; standalone backend-ready pages
(render without JS, structured for later Django templating); no dead interactions (coming-soon for unbuilt merchant
pages — no 404s); SEO/semantics baseline (semantic HTML, single `<h1>`, heading hierarchy, breadcrumb, meta; `robots
noindex` acceptable for this merchant surface); **product-honesty wording** (بيانات تجريبية / واجهة أمامية فقط / قابل
للربط لاحقًا / لا توجد بيانات مباشرة في هذه النسخة / تكامل جاهز للإعداد لاحقًا / حالة تجريبية / لا يتم تنفيذ إجراءات حقيقية
الآن; never a real merchant account, session, live data, booking, analytics, integration, notification, subscription, or
payment). Reuse the Spec 001–005 foundation unchanged except additive mock data + the new `dashboard.js` + additive
sprite icons; preserve the visual identity; remove no existing section; **do not use the public marketing header/footer**.
**Scale/Scope**: One new page + the new `dashboard/` surface scaffolding. Mock data: ≥8 booking requests (full schema),
≥5 top deals (merchant metrics; reuse public deal ids), ≥11 integrations (status + description), plus company/plan/
subscription, ≥8 KPIs, 6 analytics-preview datasets, ≥6 operational alerts, 6 onboarding tasks, ≥5 activity items, and
topbar notifications. Per-section minima (overview): welcome summary; ≥8 KPI cards; recent bookings (≥8 rows + row
actions + status & note modals); top deals (≥5); quick actions (6); integration readiness (≥11); analytics preview (6
CSS-only visuals); operational alerts (≥6); onboarding checklist (6 + progress); activity feed (≥5); empty/skeleton
patterns; dashboard footer. Navigation prep: 12 future merchant pages (coming-soon).

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications (2026-06-02) resolved the nine open questions
(dashboard directory & paths; no real merchant auth gate / mock identity; static-HTML-first; new additive `dashboard.js`;
CSS/HTML-only charts; own app shell not the public header/footer; session-only state; custom-modals/no-dialogs; coming-
soon for unbuilt modules). See `research.md` for the derived technical decisions (D1–D11).*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend merchant overview; zero backend/database/account/subscription store, analytics service, booking engine, or integration. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | Existing local Tailwind build + vanilla JS only; one additive `dashboard.js`; **charts are CSS/HTML, no chart library**. No forbidden libs/CDN/dialogs. Verified by the stack-compliance grep gate (incl. chart-lib/CDN check). |
| III. Standalone, Backend-Ready Pages | ✅ PASS | Single self-contained page that **renders core content without JS** (static shell + all overview sections with mock values; JS only enhances). Authors its own `<head>` from the shared `head` conventions; semantic, server-renderable shell regions (sidebar/topbar/breadcrumb/page-header/content/footer) ready for Django templating. |
| IV. Premium & Trustworthy | ✅ PASS | Reuses premium tokens + an app-like layout; trust/honesty framing throughout (بيانات تجريبية / قابل للربط لاحقًا); reuses source badges (Partner/Affiliate/Manual Deal/API Ready) on top deals; no empty/broken UI — reusable skeleton + branded empty-state patterns; safe fallbacks for missing mock ids. |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | `<html lang="ar" dir="rtl">`, logical-property utilities, mobile-first; the sidebar collapses to a drawer, the topbar stays usable, the KPI grid reflows, the booking table becomes stacked labeled cards, charts reflow — no horizontal overflow at 360px; English-ready; phone/amount/date/code use `dir="ltr"`. |
| VI. No Dead Interactions | ✅ PASS | Sidebar links navigate or coming-soon-toast; topbar dropdowns open; drawer toggles; row action menus open modals/toasts/coming-soon; status & note modals validate→toast; checklist toggles + progress; integration/quick-action/alert actions toast or coming-soon; search shows a mock state; logout toast. No bare `#`, no `alert()`/`confirm()`/`prompt()`. |
| VII. Listing & Detail Contracts | ✅ PASS | "Dashboards MUST use realistic static data" — satisfied; the overview ships **empty-state** and **skeleton/loading** patterns (the constitution's listing expectation), and as an overview carries main info + primary CTAs + related sections. Full filter/sort listings are deferred to the future deals/bookings pages (out of scope). |
| VIII. SaaS Direction Preserved | ✅ PASS | This **opens the Merchant (travel agency) dashboard surface** the constitution names — overview now, with navigation prepared for deals/coupons/bookings/customers/analytics/integrations/settings (coming-soon). The public + member surfaces are untouched; the SaaS-owner admin stays anticipated/out-of-scope. Nothing removed or simplified. |
| IX. Integration-Ready, Never Faked | ✅ PASS | The integration-readiness card is **settings-driven and explicitly "no real integration active"**; all KPIs/bookings/deal-metrics/analytics/alerts/notifications are believable mock; source badges + safe labels reused; every surface states frontend-only / قابل للربط لاحقًا; never implies a real account, session, live data, booking, analytics, connected integration, sent notification, active API sync, scraping queue, subscription, or payment. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, single `<h1>`, heading hierarchy, breadcrumb, Arabic title/meta; the merchant surface MAY set `robots noindex` (private app) while staying structurally correct; substantial, non-thin overview content. |
| Technical Standards & File Organization | ✅ PASS | Adds the canonical `dashboard/` directory the constitution already prescribes; additive `assets/data/*.json`, additive `src/js/dashboard.js`, additive sprite icons. Mock entities (deals/coupons) stay consistent with existing catalogs. See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist in `quickstart.md`; stack-compliance hard gate; preservation rule honored (no existing section removed; `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` behavior unchanged). |

**Result**: PASS — no violations. The only shared-asset touches are **additive** (new `dashboard.js`, four new JSON
catalogs, additive sprite icon symbols); logged in Complexity Tracking. Re-checked after Phase 1 design — still PASS (no
new global component, token, or visual identity introduced; only a small page-scoped `<style>` for the dashboard shell/
table/chart primitives, exactly as the homepage and content pages already do; charts remain CSS/HTML-only).

## Project Structure

### Documentation (this feature)

```text
specs/006-merchant-dashboard-shell/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications 2026-06-02)
├── research.md          # Phase 0 output — decisions D1–D11
├── data-model.md        # Phase 1 output — page/section inventory, mock schemas, interaction & form maps
├── quickstart.md        # Phase 1 output — build/preview + per-page QA gate
├── contracts/           # Phase 1 output
│   ├── dashboard-page.contract.md  # shell + per-section structural/behavioral + coming-soon + non-regression
│   └── mock-data.contract.md       # merchant-dashboard/bookings/deals/integrations schemas + reuse & consistency rules
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── tailwind.config.js        # REUSED unchanged — tokens cover the dashboard; content globs add ./dashboard/**/*.html (see below)
├── src/
│   ├── input.css             # REUSED; additive only if an unavoidable composition class is needed (prefer page-scoped <style>)
│   └── js/
│       ├── ui.js             # REUSED UNCHANGED (window.TUI: toast/modal/drawer/validateForm/copyToClipboard/prefersReducedMotion)
│       ├── main.js           # REUSED UNCHANGED (declarative data-* wiring, incl. data-coming-soon, data-modal/drawer/copy/toast/validate)
│       ├── discovery.js      # REUSED UNCHANGED (Spec 003 — not loaded by the dashboard)
│       ├── content.js        # REUSED UNCHANGED (Spec 004 — not loaded by the dashboard)
│       ├── member.js         # REUSED UNCHANGED (Spec 005 — not loaded by the dashboard)
│       └── dashboard.js      # ★ NEW additive — sidebar/drawer toggle + scrim, topbar dropdowns (notifications/quick-add/user),
│                             #   table row action menus, status-change + add-note modals, contact/assign/quick-action/integration
│                             #   toasts, onboarding toggle + progress, search mock; dispatched by <html data-page>; loaded only by
│                             #   dashboard/index.html; uses window.TUI (no change to other modules)
├── assets/
│   ├── css/tailwind.css      # BUILD OUTPUT (regenerated; not hand-edited)
│   ├── icons/sprite.svg      # EDIT (additive only) — append sidebar/topbar <symbol> icons (grid/tag/plus/ticket/calendar/users/
│   │                         #   bar-chart/plug/settings/bell/more/external/logout/trend); no existing symbol changed
│   ├── data/
│   │   ├── merchant-dashboard.json           # NEW — company/plan/subscription, KPIs, analytics-preview, alerts, onboarding, activity, notifications
│   │   ├── merchant-bookings-preview.json    # NEW — ≥8 booking requests (full schema)
│   │   ├── merchant-deals-preview.json       # NEW — ≥5 top deals with merchant metrics (reuse public dealId)
│   │   ├── merchant-integrations-preview.json# NEW — ≥11 integrations (name + status + description)
│   │   ├── deals.json        # REFERENCED unchanged — top-deal dealId → ../pages/deal-details.html?id=
│   │   ├── coupons.json      # REFERENCED unchanged — coupon identity consistency
│   │   └── compare-offers.json # REFERENCED unchanged — route/compare context
│   └── images/               # REUSED SVG placeholders; new additive only if needed
├── partials/                 # head conventions REUSED for the dashboard <head>; header/footer NOT used on the dashboard
│   ├── head.html             # REUSED as the <head> convention source (CSS link, font preload, favicon, theme-color)
│   ├── header.html           # UNCHANGED — NOT inlined on the dashboard (dashboard has its own sidebar/topbar)
│   └── footer.html           # UNCHANGED — NOT inlined on the dashboard (dashboard has its own footer)
├── pages/                    # UNCHANGED — public + member pages; dashboard links back via ../pages/index.html etc.
│   └── …                     # index/compare/deals/coupons/deal-details/destinations/…/login/register/saved-deals/price-alerts/profile
└── dashboard/                # ★ NEW merchant surface directory (sibling of pages/)
    └── index.html            # ★ NEW — merchant overview (data-page="merchant-dashboard"): shell + all overview sections
    # (NOT created this spec; referenced as coming-soon): deals.html, create-deal.html, edit-deal.html, coupons.html,
    #  create-coupon.html, bookings.html, booking-details.html, customers.html, customer-details.html, analytics.html,
    #  integrations.html, settings.html
```

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/` (unchanged from Spec 001–005). This
feature is **composition + mock content** (one new `dashboard/index.html`) in a **new `dashboard/` directory** +
**additive** mock-data JSON (4 catalogs) + one **additive** `src/js/dashboard.js` + **additive** sprite icon symbols. No
foundation file is rebuilt or behaviorally changed; `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`,
`src/js/content.js`, and `src/js/member.js` are untouched; the public/member `pages/` and the shared `partials/header.html`
/`partials/footer.html` are untouched. The dashboard **does not inline the public header/footer**; it authors its own
`<head>` from the `head` conventions and builds the app shell from existing tokens/components + a small page-scoped
`<style>`. **Tailwind config note**: the dashboard markup and `dashboard.js` use existing utility classes; the
`tailwind.config.js` `content` globs (`./pages/**/*.html`, `./partials/**/*.html`, `./src/js/**/*.js`) must be extended
with `./dashboard/**/*.html` so the build scans the new directory — this is a **one-line additive config edit** (no token
or theme change), logged in Complexity Tracking.

## Complexity Tracking

> Only additive/justified shared-file touches are logged here. There are no principle violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| New `dashboard/` directory + `dashboard/index.html` (own app shell: sidebar/topbar/drawer/breadcrumb/page-header/footer, not the public header/footer) | The merchant surface is a distinct app experience the constitution prescribes under `dashboard/`; the spec forbids the public marketing header/footer here. | Reusing the public shell rejected (a marketing header/footer is wrong for an app dashboard and the spec forbids it). Putting the page under `pages/` rejected (violates the constitution's canonical merchant location and the `../` path contract). |
| New `src/js/dashboard.js` (sidebar/drawer toggle + scrim, topbar dropdowns, row action menus, status/note modals, onboarding toggle + progress, search mock, contact/assign/quick-action/integration toasts) | The dashboard needs dropdown menus, a responsive table's row-action menus, the status/note modals, and checklist-progress behavior that the declarative `data-*` layer does not cover. | Inline `<script>` rejected (pages need no bespoke inline JS; a module is reusable by future merchant pages). Extending `main.js` rejected (page-specific concerns in a file every page loads → regression risk). Extending `discovery.js`/`content.js`/`member.js` rejected (those are other features' modules; mixing risks regressions and the spec scopes a separate file). `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` stay unchanged. |
| New `assets/data/merchant-dashboard.json` + `merchant-bookings-preview.json` (≥8) + `merchant-deals-preview.json` (≥5) + `merchant-integrations-preview.json` (≥11) | The overview needs believable, consistent mock catalogs as backend-ready reference data; top deals reuse public deal ids so identity stays consistent across the platform. | Hardcoding everything inline only rejected (loses backend-ready reference data + cross-page consistency); JSON mirrors the existing `deals.json`/`featured.json` convention and is Django/CMS-ready. Static HTML still matches the catalogs (no runtime fetch for baseline — III). |
| Additive **sidebar/topbar icon symbols** in `assets/icons/sprite.svg` (e.g., grid/tag/plus/ticket/calendar/users/bar-chart/plug/settings/bell/more/external/logout/trend) | The dashboard nav/topbar/row-actions need icons the current sprite lacks (it has menu/search/close/chevron/copy/phone/info/star/location/check-circle/alert-triangle/etc. but no dashboard/settings/bell/users icons). | A second sprite or per-icon `<img>` rejected (the project uses one sprite via `<use href="…sprite.svg#…">`). Reusing only existing icons rejected (some modules would share ambiguous icons, hurting clarity/IV). Symbols are **appended** (no existing symbol changed) → zero regression. |
| One-line `content` glob add (`./dashboard/**/*.html`) in `tailwind.config.js` | Tailwind only emits utilities for files it scans; the new `dashboard/` directory must be in the content globs or used classes get purged. | Hand-editing `tailwind.css` rejected (it's build output). Authoring all dashboard styling in a page-scoped `<style>` to avoid the config edit rejected (defeats design-system reuse / SC-012; the config add is additive and changes no token/theme). |
| Status-change modal + add-note modal (+ optional assign-user modal) via the existing `.modal`/`window.TUI.modal` pattern | Constitution VI + spec forbid `confirm()`/`prompt()`; status change and internal notes need validated, focus-managed modal flows. | Browser `confirm()`/`prompt()` rejected (forbidden by II/VI). A bespoke modal system rejected (the existing `.modal` + `TUI.modal.open/close` + `data-modal-open/close` already provides focus-managed, reduced-motion-aware modals). |
| Analytics preview as **CSS/HTML-only** bars/sparklines (no chart library) | The spec/constitution forbid an external chart library/CDN; the preview must still read as charts. | Chart.js/ApexCharts/etc. rejected (external lib/CDN — forbidden by II). `<canvas>` hand-drawing rejected (not keyboard/AT-readable as static markup; CSS bars are semantic and no-JS-safe). |

## Phase status

- [x] Phase 0 — `research.md` (decisions D1–D11; no `NEEDS CLARIFICATION` remain)
- [x] Phase 1 — `data-model.md`, `contracts/dashboard-page.contract.md`, `contracts/mock-data.contract.md`, `quickstart.md`; agent context (CLAUDE.md) updated to this feature
- [x] Constitution re-check after design — PASS (no new component/token/visual identity; page-scoped `<style>` + CSS-only charts only)
- [ ] Phase 2 — `tasks.md` (produced by `/speckit-tasks`, not this command)
