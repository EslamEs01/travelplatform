<!-- SPECKIT START -->
## Active feature: 009-merchant-analytics-integrations-settings

Frontend-first **Travel SaaS Platform**. Current phase **completes the merchant dashboard** by building its final three
modules — analytics + integrations + settings — as **three new pages inside the existing `dashboard/` directory**:
`analytics.html` (`merchant-analytics`), `integrations.html` (`merchant-integrations`), `settings.html`
(`merchant-settings`). They **reuse the Spec 006–007 dashboard shell verbatim** (sidebar + topbar + mobile drawer +
breadcrumb + page header + footer; only the active sidebar item + breadcrumb + page header vary) and author their **own
`<head>`** from `partials/head.html` — they do **NOT** use the public `partials/header.html`/`footer.html`. Paths are
`../assets/css/tailwind.css`, `../src/js/{ui,main,dashboard}.js`, `../pages/deal-details.html?id=`. **analytics.html**:
date-range (6 options + custom) + compare toggle + export mock; **≥10 KPI cards**; 4 **CSS/static chart-like visuals**
(inquiries/clicks/coupon-copies/conversion over time — **no chart library**); traffic sources (≥8) + device breakdown;
top-deals table (≥8) + top-destinations (≥7) + coupon-performance table (≥8, code `dir="ltr"`); insight cards (≥6) +
recommendation cards (≥6); export/report mock; empty + skeleton; FAQ (≥5). **integrations.html**: 3 CTAs + overview
stats (6) + category tabs (7); integration cards across Affiliate/Travel APIs/Coupons/Scraping Review/Notifications/
Manual (each: icon + status badge + enable toggle + last-sync mock + configure + test); **≥10 configure modals**
(Travelpayouts/Booking/Expedia/Skyscanner/Amadeus/Duffel/Coupon API/Scraping Review Queue/Email/WhatsApp); activity log
(≥8); health panel; FAQ (≥6); prominent **scraping/review honesty** (no scrape, no auto-publish, manual review).
**settings.html**: tabbed 7-section nav (company/branding/booking/notifications/team/security/plan-usage); company form
(validated); branding (color/slug **live preview** + mock upload); booking prefs; ≥9 notification toggles × 3 channels;
team table (≥6) + invite/change-role/disable-remove modals; security (change-password validation + 2FA placeholder + API
placeholder + mock sessions/login-history); plan usage (≥7 bars + plan + upgrade→**coming-soon**); public-page preview;
**danger zone** (deactivate/reset/delete via custom confirm modals); FAQ (≥6). Core content is **static HTML** (renders
without JS — all KPI/visuals/tables/cards/modals/sections in the DOM); the existing `src/js/dashboard.js` is **EXTENDED
additively** with 3 new per-page controllers dispatched by `<html data-page>` (added to `_DASH_PAGES` + 3 dispatch
lines) — date-range/compare/export/copy/insight toasts; category filter + configure modals + Save/Test/test-all mock
toasts + toggles; settings tab/anchor nav + `TUI.validateForm` (company/booking/password/invite, incl. new=confirm rule)
+ color/slug preview + mock upload + notification toggles + change-role/disable-remove/danger-zone modals + 2FA toggle +
upgrade coming-soon — reusing the `DropdownController`/row-menu/form-wrapper/**shared confirm-modal helper** primitives;
the Spec 006 `merchant-dashboard` controller and the 5 Spec 007 controllers are **unchanged**. All confirmations use
`.modal`/`TUI.modal` — **no browser dialogs** (no `confirm()`/`prompt()`). State is **frontend/session-only** (reload
restores mock defaults). New mock data: `merchant-analytics.json` + `merchant-integrations.json` +
`merchant-settings.json` + `merchant-team.json` (≥6) + `merchant-usage.json` (≥7), reusing `deals.json`/
`merchant-deals.json`/`merchant-coupons.json` ids. The shared shell nav is **rewired (links only)** so
التحليلات→`analytics.html`, التكاملات→`integrations.html`, الإعدادات→`settings.html` across Spec 006 `index.html` + the 5
Spec 007 pages (**no overview/management section/layout/copy removed**); the still-unbuilt **bookings/customers pages
(intended Spec 008 — files absent)** and the **SaaS-owner admin/billing/support** surface stay **coming-soon** (no 404).
`src/js/main.js` + `ui.js` + `discovery.js` + `content.js` + `member.js` and `partials/header.html`/`footer.html` +
`pages/` stay **unchanged**; **`tailwind.config.js` needs no change** (the `./dashboard/**/*.html` glob already exists).
No new visual identity, no foundation rebuild, no backend, **no chart/table library**. Product honesty: never real
analytics/tracking, API connection, validated key, sync, scraping, coupon import, email/WhatsApp, settings persistence,
team invitation, password change, 2FA, subscription upgrade, billing, or export — بيانات تجريبية / واجهة أمامية فقط /
مثال توضيحي / لا يتم الاتصال بأي API الآن / لا يتم حفظ الإعدادات على خادم الآن / قابل للربط لاحقًا / اختبار اتصال تجريبي /
لا يتم إرسال إشعارات حقيقية / لا يتم تشغيل scraping فعليًا / كل المصادر تحتاج مراجعة قبل النشر.

**Key decisions (research D1–D13)**: reuse the Spec 006–007 shell verbatim on all 3 pages (vary active item/breadcrumb/
header only); extend `dashboard.js` additively (3 per-page controllers + 3 guard/dispatch entries, existing controllers
untouched); analytics visuals = **CSS/HTML only, static metrics** (date-range = active-state + toast, no fake live
query); analytics tables = static rows reusing existing deal/coupon ids (copy/links/mock toasts, table→cards at 360px);
integrations = static cards + client-side category filter + pre-authored `.modal` configure dialogs (Save/Test = mock
toasts, no network); scraping/review honesty baked into cards + modal + FAQ; settings = all 7 sections in DOM (no-JS
stacked) + tab/anchor nav + validated forms + branding live preview + mock save/upload; team/danger-zone via
`TUI.modal`/confirm helper; security = validated change-password (no real change) + 2FA/API placeholders; plan usage =
CSS bars + upgrade→coming-soon; 5 new backend-ready JSON catalogs reusing existing ids; additive sprite symbols
(mail/whatsapp/key/lock/credit-card/palette/link/activity/building/award/pie-chart/map-pin/shield); **link-only** nav
rewiring of the 3 built pages across the shell; small page-scoped `<style>` for KPI grid/CSS visuals/integration card
grid/settings tabs/usage bars/table→cards; no Tailwind config change. **Spec numbering note**: no `specs/008-` exists —
the intended bookings/customers module was never built; this feature is **009** by explicit request and keeps
bookings/customers coming-soon.

**Read the current plan and its design artifacts:**

- Plan: `specs/009-merchant-analytics-integrations-settings/plan.md`
- Spec: `specs/009-merchant-analytics-integrations-settings/spec.md`
- Research (decisions D1–D13): `specs/009-merchant-analytics-integrations-settings/research.md`
- Page/section inventory, schemas, interaction & form maps: `specs/009-merchant-analytics-integrations-settings/data-model.md`
- Contracts: `specs/009-merchant-analytics-integrations-settings/contracts/` (analytics-page, integrations-page, settings-page, mock-data)
- Quickstart & QA gate: `specs/009-merchant-analytics-integrations-settings/quickstart.md`
- Reused merchant deals/coupons (Spec 007): `specs/007-merchant-deals-coupons/`
- Reused merchant shell/overview (Spec 006): `specs/006-merchant-dashboard-shell/`
- Reused member pages (Spec 005): `specs/005-member-auth-saved-alerts/`
- Reused content pages (Spec 004): `specs/004-destinations-blog-seo/`
- Reused discovery pages (Spec 003): `specs/003-public-discovery-pages/`
- Reused homepage (Spec 002): `specs/002-public-homepage/`
- Foundation reused (Spec 001): `specs/001-frontend-foundation/` (page-shell, ui-utilities, component-patterns)
- Governing constitution: `.specify/memory/constitution.md`

**Stack (non-negotiable)**: HTML + local Tailwind CSS v3.4 build (PostCSS) + vanilla JS only.
Forbidden: React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN, external chart library, browser `alert()`. Arabic RTL
primary, English-ready, mobile-first, WCAG 2.1 AA, standalone backend-ready pages, no CDN at runtime.
<!-- SPECKIT END -->
