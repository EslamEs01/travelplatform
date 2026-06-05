<!-- SPECKIT START -->
## Active feature: 010-saas-owner-admin-dashboard

Frontend-first **Travel SaaS Platform**. Current phase builds the **SaaS owner/admin surface** — the platform-owner
control room above the public site (002–005) and merchant dashboard (006–009) — as **seven new standalone pages in a new
`admin/` directory**: `index.html` (`admin-overview`), `companies.html` (`admin-companies`), `company-details.html`
(`admin-company-details`), `plans.html` (`admin-plans`), `subscriptions.html` (`admin-subscriptions`), `analytics.html`
(`admin-analytics`), `content.html` (`admin-content`). They use a **NEW dedicated admin shell** that is visually related
to the product but **clearly distinct** from the merchant `.dash-*` shell: a dark slate **`ink`** sidebar rail + gold
**`sunset`** accent + "مالك المنصة · Owner Admin" brand label, via page-scoped `.admin-*` classes (same tokens, different
role — no new identity). Each page authors its **own `<head>`** from `partials/head.html` (NOT the public
`header.html`/`footer.html`); paths resolve from `admin/`: `../assets/css/tailwind.css`, `../src/js/{ui,main,admin}.js`,
`../pages/…`, `../dashboard/…`, `company-details.html?id=`. Core content is **static HTML** (renders without JS — every
KPI/feed/table/card/plan/comparison/all-6-content-tab-panels/usage-bar/billing/modal-content-container in the DOM). A
**NEW self-contained `src/js/admin.js`** (loaded `defer` after ui.js+main.js; mirrors the `dashboard.js` IIFE pattern,
imports/modifies nothing) carries an `_ADMIN_PAGES` guard on `<html data-page>` + shell init (sidebar drawer + 3 topbar
dropdowns) + shared primitives (TUI.toast wrapper, `DropdownController`, row-action-menu, `validateAndSubmit` over
`TUI.validateForm`, **shared confirm-modal helper**, a generic **filter/sort/search engine** w/ `aria-live` count +
removable chips + reset, slugify) + **7 per-page controllers**. It **reuses** `window.TUI` (toast/modal/drawer/
validateForm/copyToClipboard) and `main.js`'s declarative `data-*` (drawer/modal/coming-soon/copy/toast/validate/year)
**unchanged**. **index**: 4 quick actions + ≥10 KPIs + activity (≥10) + top companies (≥8 → details) + 8 integration-
health cards + subscription alerts + **5 CSS visuals** + 7 quick actions + checklist (5) + empty/skeleton. **companies**:
≥8 stats + search/8 filters/6-sort + count/chips/reset + **≥12 rows** (table→cards) + row menu (view/change-plan/suspend/
extend-trial/add-note/contact/**login-as disabled-safe**) + bulk (**suspend-selected confirm**) + 4 modals + 7 segment
filters + FAQ ≥5. **company-details**: default mock company w/ or w/o `?id=` + profile + **≥8 usage bars** (warnings) +
timeline ≥10 + top-deals + 7 booking stats + 8 integration rows + billing timeline + notes + support panel + 7 modals
(incl. **reset-usage confirm** + **login-as safety**) + FAQ ≥5. **plans**: 4 plan cards + monthly/yearly toggle +
comparison table (≥14 rows) + create/edit modal + duplicate + **disable confirm** + companies-on-plan + FAQ ≥5.
**subscriptions**: 8 stats (MRR/ARR) + search/filters/5-sort/count + **≥12 rows** + 8 row actions + bulk + detail/invoice/
extend-trial modals + **cancel confirm** + FAQ ≥5. **analytics**: date-range + compare + export + ≥12 KPIs + **8 CSS
visuals** (no chart lib) + 5 tables + ≥5 recommendations + export modal + `#integrations` anchor + FAQ ≥5. **content**: 8
stats + **6 tabs** (all panels in DOM) + 7 homepage sections + 5 tab tables + create/edit modal + feature toggle +
**publish/delete confirms** + approve/reject + homepage preview + FAQ ≥5. All confirmations use `.modal`/`TUI.modal` — **no
browser dialogs**. State is **session-only** (reload restores mock defaults). **All chart-like visuals are CSS/HTML — no
chart/table library.**

**Key decisions (research D1–D13)**: new distinct admin shell (ink rail + sunset accent + `.admin-*`; D1); 7 standalone
`admin/*.html`, own `<head>`, `../` paths (D2); **new self-contained `admin.js`** — NOT extending `dashboard.js` — guard +
shell init + 7 controllers, reuse TUI + main.js data-* (D3); **one-line additive `tailwind.config.js` glob**
`./admin/**/*.html` — the build does NOT yet scan `admin/`, so without it the pages render unstyled (D4, the single
foundation-config touch — differs from Spec 009); static-HTML-first, JSON = backend-ready reference, no baseline fetch
(D5); CSS/HTML visuals only — bars/conic-gradient donut/trend/stacked (D6); one client-side filter/sort/search engine w/
aria-live count + chips + reset, segment cards drive presets (D7); all destructive actions via `.modal`/`TUI.modal`
confirm helper, no dialogs (D8); **"Login as company" always disabled/safe + impersonation safety modal** (D9);
session-only state (D10); 7 backend-ready JSON catalogs (`admin-overview/-companies≥12/-plans×4/-subscriptions≥12/
-platform-analytics/-content/-integration-health×8`) reusing `deals/merchant-deals/merchant-coupons/destinations-full/
articles` ids — **self-sufficient where `merchant-bookings.json`/`merchant-customers.json` are ABSENT (only
`merchant-bookings-preview.json` exists; Spec 008 pages were never built)** (D11); `مراقبة التكاملات`→`analytics.html#
integrations`, `الإعدادات`→coming-soon toast, unbuilt 008 + owner billing/support stay coming-soon, **no merchant/public
page edited** (D12); table→cards + grids reflow + sidebar→drawer + ~44px + reduced-motion at 360px (D13). Sprite already
has building/credit-card/award/pie-chart/activity/plug/users/bar-chart/map-pin/shield/trend-* (added in 009) — append
only if genuinely missing (dollar-sign/file-text/layers/server). Small page-scoped `<style>` per page for KPI/plan/
segment grids + CSS visuals + content tabs + usage bars + table→cards. `ui.js`/`main.js`/`dashboard.js`/`discovery.js`/
`content.js`/`member.js`, the public/member `pages/`, the merchant `dashboard/` pages, and `partials/header.html`/
`footer.html` stay **unchanged**. No new visual identity, no foundation rebuild, no backend.

**Product honesty**: never real admin login, company suspension/activation, plan/price change, subscription billing,
invoice, payment, impersonation, integration monitoring, content publishing, export, email/WhatsApp, or persistence —
بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه النسخة / لا يتم تنفيذ تغيير حقيقي / لا توجد
مدفوعات فعلية / لا يتم تسجيل دخول كالشركة فعليًا / قابل للربط لاحقًا بلوحة إدارة حقيقية / قابل للربط لاحقًا بنظام اشتراكات
ودفع / حالة تجريبية.

**Read the current plan and its design artifacts:**

- Plan: `specs/010-saas-owner-admin-dashboard/plan.md`
- Spec: `specs/010-saas-owner-admin-dashboard/spec.md`
- Research (decisions D1–D13): `specs/010-saas-owner-admin-dashboard/research.md`
- Page/section inventory, schemas, interaction & form maps: `specs/010-saas-owner-admin-dashboard/data-model.md`
- Contracts: `specs/010-saas-owner-admin-dashboard/contracts/` (admin-shell, overview-page, companies-page, plans-page, subscriptions-page, analytics-page, content-page, mock-data)
- Quickstart & QA gate: `specs/010-saas-owner-admin-dashboard/quickstart.md`
- Reused merchant analytics/integrations/settings (Spec 009): `specs/009-merchant-analytics-integrations-settings/`
- Reused merchant deals/coupons (Spec 007): `specs/007-merchant-deals-coupons/`
- Reused merchant shell/overview (Spec 006): `specs/006-merchant-dashboard-shell/`
- Reused member pages (Spec 005): `specs/005-member-auth-saved-alerts/`
- Reused content pages (Spec 004): `specs/004-destinations-blog-seo/`
- Reused discovery pages (Spec 003): `specs/003-public-discovery-pages/`
- Reused homepage (Spec 002): `specs/002-public-homepage/`
- Foundation reused (Spec 001): `specs/001-frontend-foundation/` (page-shell, ui-utilities, component-patterns)
- Governing constitution: `.specify/memory/constitution.md`

**Stack (non-negotiable)**: HTML + local Tailwind CSS v3.4 build (PostCSS) + vanilla JS only.
Forbidden: React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN, external chart/table library, browser
`alert()`/`confirm()`/`prompt()`. Arabic RTL primary, English-ready, mobile-first (usable at 360px, no horizontal
overflow), WCAG 2.1 AA, standalone backend-ready pages, no CDN at runtime.
<!-- SPECKIT END -->
