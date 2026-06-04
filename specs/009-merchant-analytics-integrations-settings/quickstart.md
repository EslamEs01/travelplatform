# Quickstart: Merchant Analytics + Integrations + Settings

**Feature**: `009-merchant-analytics-integrations-settings` | **Date**: 2026-06-04
Build/preview steps + the per-page "done" checklist (Constitution gate) + the stack-compliance hard gate for `analytics.html`, `integrations.html`, and `settings.html`.

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only; already installed in Spec 001).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
# No tailwind.config.js change needed — './dashboard/**/*.html' is already in the content globs (added in Spec 006).
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → http://localhost:3000/dashboard/analytics.html
```

Preview each page end-to-end:

- **`analytics.html`**: shell with التحليلات active + breadcrumb لوحة التحكم / التحليلات; read the ≥10 KPI cards; click date-range chips (active state changes; نطاق مخصص reveals from/to + apply → toast; from>to → inline/toast message); toggle compare (visual state); export PDF/CSV/schedule → toasts ("تصدير تجريبي"); confirm the 4 over-time CSS visuals render with **no library**; ≥8 traffic sources + 3-device bars; top-deals table ≥8 rows → view-public (`../pages/deal-details.html?id=`)/manage (`deals.html`); ≥7 destinations; coupon table ≥8 rows → copy-code (copies + toast)/manage (`coupons.html`); ≥6 insight cards; ≥6 recommendation cards (action → link/toast); empty + skeleton exist (hidden); FAQ ≥5; **mobile 360px**: tables → stacked cards, KPI grid + visuals one column, no horizontal scroll.
- **`integrations.html`**: shell with التكاملات active + breadcrumb لوحة التحكم / التكاملات; read the 6 overview stats; click the 7 category tabs → active state + cards filter (الكل = all) + `aria-live` count; confirm cards across all categories (Travelpayouts, Booking.com, Expedia Partner, Skyscanner, Kiwi/Tequila, Partner Link, Amadeus, Duffel, Expedia Rapid, Hotelbeds, Coupon API, Affiliate Coupon Feed, Manual Coupons, Coupon Import Review, Scraping Review Queue, Source URL Monitor, Manual Approval Workflow, Duplicate Coupon Detector, Expiry Validator, Email, WhatsApp, Dashboard Alerts, Daily Summary, Weekly Reports) — each with icon/status badge/credentials note/last-sync/health/enable toggle/configure/test; open each configure modal (≥10) → Save (validates required → "تم حفظ الإعداد (تجريبي)") / Test ("اختبار اتصال تجريبي — لا يتم الاتصال بأي مصدر خارجي"); toggle enable/disable + auto-import + manual-review (visual); اختبار كل التكاملات تجريبيًا → toast; مراجعة المصادر → scrolls to scraping section; confirm the scraping honesty copy on the cards + the Scraping Review Queue modal warning; activity log ≥8; health panel; FAQ ≥6; **mobile**: cards one column, tabs scroll/wrap, no horizontal scroll.
- **`settings.html`**: shell with الإعدادات active + breadcrumb لوحة التحكم / الإعدادات; click the 7 settings tabs (or `settings.html#team` deep link) → section shows; **Company**: submit empty name/phone/email → inline errors; valid → "حُفظت الإعدادات (تجريبي)"; email/website `dir="ltr"`; **Branding**: change primary/secondary color → brand-preview swatch updates; type slug → public-URL preview updates; logo/cover upload → "لا يتم رفع ملفات حقيقية الآن"; **Booking**: mode select + required-docs checklist; **Notifications**: ≥9 toggles × Dashboard/Email/WhatsApp flip state; **Team** (≥6): invite → modal (validate name/email/role → "دعوة تجريبية")/change-role → modal (toast, MAY update cell)/disable-enable + remove → confirm modal → toast/resend → toast; **Security**: change password (new≠confirm → error; valid → "تغيير تجريبي")/2FA toggle (placeholder)/API placeholder/sessions+login-history mock lists; **Plan usage**: ≥7 bars + plan + renewal + upgrade → **coming-soon** toast; public-page preview card; **Danger zone**: deactivate/reset/delete → custom confirm modal → warning toast (no destructive action); save-all + reset (confirm) → toasts; FAQ ≥6; **mobile**: tabs scroll/wrap, team table → cards, forms one column, no horizontal scroll.
- **Nav rewiring**: from `dashboard/index.html` (Spec 006 overview) and each Spec 007 page, confirm التحليلات/التكاملات/الإعدادات (sidebar + quick-add + any matching overview CTAs) now **navigate** to the new pages; the Spec 006/007 sections/layout/copy are unchanged; طلبات الحجز/العملاء (bookings/customers) and any SaaS-owner admin/billing entries still show coming-soon (no 404).

> Rebuild after editing markup so Tailwind's content scan picks up newly-used utility classes (the globs already include `./dashboard/**/*.html`).

## 2. Per-page "done" checklist (Constitution gate)

A page is **NOT done** until all pass.

**Shell & page basics (all three)**
- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network requests** for CSS/JS/fonts/images (SC-001/SC-008).
- [ ] **Spec 006–007 shell reuse**: sidebar + topbar + mobile drawer + breadcrumb + page header + dashboard footer, identical to the existing dashboard; the public marketing header/footer is **not** present; correct active sidebar item (`aria-current`) + correct breadcrumb (FR-001/FR-002).
- [ ] **No-JS baseline**: with JavaScript disabled, analytics renders KPI cards + all visuals + all tables; integrations renders all cards + all modals' content; settings renders all seven sections stacked (FR-004; SC-001).
- [ ] **Session-only honesty**: date-range/compare, category filter, tab selection, toggles, typed values, color/slug preview, a changed role are in-memory; reload restores mock defaults; no copy claims server/permanent storage (FR-007).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; usable at 360px with **no horizontal scroll**; touch targets ≥ ~44px; code/amount/date/email/website/URL/percent `dir="ltr"` (coupon codes + emails `dir="ltr"`) (SC-002).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors the shell/KPI grid/visuals/cards/tabs/forms with no structural breakage (SC-002).
- [ ] **Design-system fidelity**: ≥95% styling via tokens/utilities; only a small page-scoped `<style>` for the KPI grid/CSS chart visuals/integration card grid/settings tabs/usage bars/table→cards; no new visual identity; **no chart/table library** (SC-008).
- [ ] **No dead interactions**: zero bare `#` without a handler, zero dead buttons, zero `alert()`/`confirm()`/`prompt()`; bookings/customers + admin/billing links use coming-soon (no 404) (SC-006/SC-011).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, the dashboard breadcrumb, required Arabic title/meta; `robots noindex` acceptable; any JSON-LD describes the frontend-only mock honestly.
- [ ] **Honest copy**: no real analytics/tracking, API connection, validation, sync, scraping, email/WhatsApp, settings persistence, team invitation, password change, 2FA, subscription upgrade, billing, or export claims; every page surfaces its required safe note (SC-007).
- [ ] **Accessibility WCAG 2.1 AA**: `npm run audit:a11y` (per page) → 0 violations; keyboard reaches/operates 100% of controls (date-range chips/compare/export, category tabs, configure modals with managed focus, every toggle, copy, settings tabs, every form field, invite/role/disable-remove/danger-zone modals, 2FA, upgrade); visible focus; `aria-current`; `aria-expanded`/`aria-selected`; `aria-live` for count/status/toggle; reduced-motion respected (SC-006).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU.

**Analytics — analytics.html (US1)**
- [ ] Page header (H1 التحليلات + description + date-range + compare + export + safe note); ≥10 KPI cards (SC-003).
- [ ] Date-range 6 options change active; نطاق مخصص from/to + apply → toast (from>to handled); compare toggle changes state (SC-003).
- [ ] 4 over-time CSS visuals (no library); ≥8 traffic sources (visits+%+trend); 3-device bars (sum 100%) (SC-003).
- [ ] Top-deals table ≥8 rows (10 cols) → view-public/manage; → stacked cards on mobile (SC-003).
- [ ] ≥7 destinations; coupon table ≥8 rows (code `dir="ltr"`) → copy-code (copies+toast)/manage (SC-003).
- [ ] ≥6 insight cards; ≥6 recommendation cards (priority + explanation + link/toast action) (SC-003).
- [ ] Export mock (PDF/CSV/schedule → toasts); empty + skeleton present (hidden); FAQ ≥5 (SC-003).

**Integrations — integrations.html (US2)**
- [ ] Page header (H1 التكاملات + description + note + 3 CTAs); 6 overview stats; 7 category tabs filter cards + count (SC-004).
- [ ] Integration cards across all categories, each with icon/name/category/status badge/description/credentials note/last-sync/health/enable toggle/configure/test (SC-004).
- [ ] ≥10 configure modals open with the specified fields; Save validates required → mock toast (no persist); Test → "اختبار اتصال تجريبي" (no network) (SC-004).
- [ ] Enable/disable + auto-import + manual-review toggles flip state; test-all → toast; activity log ≥8; health panel; FAQ ≥6 (SC-004).
- [ ] Scraping honesty copy present on the scraping cards + the Scraping Review Queue modal warning + the FAQ (no scrape, no auto-publish, manual review) (SC-007).

**Settings — settings.html (US3)**
- [ ] Page header (H1 الإعدادات + description + save-all + reset + safe note); 7-tab nav switches sections (+ `#section` deep link) (SC-005).
- [ ] Company form validates (name/phone/email required + email format); save → toast; email/website `dir="ltr"` (SC-005).
- [ ] Branding: color + slug live preview; logo/cover upload → mock toast (SC-005).
- [ ] Booking prefs (currency/mode/confirmation/deposit/cancellation/refund/hours/response/required-docs); ≥9 notification toggles × 3 channels (SC-005).
- [ ] Team table ≥6; invite modal (validate → toast); change-role modal (toast, MAY update cell); disable-enable + remove confirm modals (toast); resend → toast (SC-005).
- [ ] Security: change-password validates (incl. new=confirm) → mock toast (no real change); 2FA placeholder toggle; API placeholder; sessions + login-history mock lists (SC-005).
- [ ] Plan usage ≥7 bars + plan + renewal + billing note; upgrade → **coming-soon** toast; public-page preview card; danger zone (deactivate/reset/delete) → custom confirm modals → warning toast (no destructive action); FAQ ≥6 (SC-005).

**Navigation & non-regression**
- [ ] Sidebar التحليلات/التكاملات/الإعدادات + quick-add + any Spec 006 overview CTAs rewired to real navigation across `dashboard/index.html` + the five Spec 007 pages (SC-011).
- [ ] bookings/customers (intended Spec 008 — absent) + SaaS-owner admin/billing stay coming-soon (no files created, no 404) (SC-011).
- [ ] `src/js/main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` unchanged; the Spec 006 `merchant-dashboard` controller + the five Spec 007 controllers in `dashboard.js` unchanged; sprite edits append-only; **no Tailwind config change**; Spec 006/007 sections/layout/copy preserved (SC-009).
- [ ] Styleguide/components, the Spec 002 homepage, the Spec 003 discovery pages, the Spec 004 content pages, the Spec 005 member pages, the **Spec 006 `dashboard/index.html`**, and the **Spec 007 deals/coupons pages** still render; `partials/header.html`/`footer.html` and `pages/` unchanged (SC-009).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules) — forbidden tech + browser dialogs:
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules

# Must return NO matches — external chart/table/datagrid libraries on the new pages:
grep -RInE "chart\.js|chartjs|apexcharts|highcharts|echarts|d3\.|recharts|plotly|datatables|ag-grid|tabulator" \
  dashboard/analytics.html dashboard/integrations.html dashboard/settings.html src/js/dashboard.js | grep -v node_modules

# Must return NO matches — external CDN hosts in the three new pages:
grep -RInE "https?://(cdn|unpkg|jsdelivr|cdnjs|fonts\.googleapis|fonts\.gstatic|ajax\.googleapis)" \
  dashboard/analytics.html dashboard/integrations.html dashboard/settings.html
```

Any match fails review (Principle II / SC-008).

## 4. Validation commands

```bash
npx html-validate dashboard/analytics.html dashboard/integrations.html dashboard/settings.html   # 0 errors
npx stylelint "src/**/*.css"                                       # 0 errors (only if input.css touched)
npx prettier --check "src/js/dashboard.js" "dashboard/analytics.html" "dashboard/integrations.html" "dashboard/settings.html"
npm run serve & for p in analytics integrations settings; do \
  axe "http://localhost:3000/dashboard/$p.html"; done             # 0 AA violations each
```

## 5. Mock-data consistency check

- [ ] `merchant-analytics.json`: ≥10 KPIs, 4 series, ≥8 traffic sources, 3 devices, ≥8 top-deals (ids ∈ `deals.json`/`merchant-deals.json`), ≥7 destinations, ≥8 coupon-performance rows (ids ∈ `merchant-coupons.json`), ≥6 insights, ≥6 recommendations; `clicks ≤ views`, `inquiries ≤ clicks`, traffic % ≈ 100, device % = 100.
- [ ] `merchant-integrations.json`: all named cards across 6 categories with valid `status`/`health` enums + config fields; ≥8 activity events; scraping integrations carry the no-auto-publish warning; no real secrets.
- [ ] `merchant-settings.json`: company/branding/booking/notifications (≥9) present; `mode` ∈ inquiry/redirect/manual; requiredDocs from the allowed set.
- [ ] `merchant-team.json`: ≥6 members; roles spread Owner/Manager/Agent/Marketing/Support; statuses spread active/invited/disabled; emails `dir="ltr"`-safe.
- [ ] `merchant-usage.json`: ≥7 usage rows with `used ≤ limit`; plan ∈ Starter/Growth/Pro; storage is an explicit placeholder.
- [ ] Reused `deals.json`/`merchant-deals.json`/`merchant-coupons.json` (and the Spec 006 catalogs) are unchanged; a missing/invalid referenced id never breaks a page.

## Where things live

- Pages: `travel-saas-frontend/dashboard/{analytics,integrations,settings}.html`
- Logic: `travel-saas-frontend/src/js/dashboard.js` (additive `initMerchantAnalytics`/`initMerchantIntegrations`/`initMerchantSettings`)
- Data: `travel-saas-frontend/assets/data/{merchant-analytics,merchant-integrations,merchant-settings,merchant-team,merchant-usage}.json`
- Icons: `travel-saas-frontend/assets/icons/sprite.svg` (append-only)
- Shell source: `dashboard/index.html` (Spec 006) + the Spec 007 pages; `partials/head.html` conventions
