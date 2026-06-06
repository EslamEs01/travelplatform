# Quickstart & QA Gate — SaaS Owner Admin Dashboard (Spec 010)

## Build & preview

```bash
cd travel-saas-frontend
npm install                 # if not already
npm run build               # tailwindcss -i src/input.css -o assets/css/tailwind.css --minify
                            #   PREREQUISITE: tailwind.config.js content globs MUST include './admin/**/*.html'
npm run serve               # npx serve .  → open http://localhost:3000/admin/index.html
```

Open each page and walk the flows:
`/admin/index.html` · `/admin/companies.html` · `/admin/company-details.html` (and `?id=co-014`) · `/admin/plans.html` · `/admin/subscriptions.html` · `/admin/analytics.html` (and `#integrations`) · `/admin/content.html`.

> If admin pages render **unstyled**, the Tailwind `content` glob for `./admin/**/*.html` is missing — add it and rebuild (D4).

## Per-page "done" checklist (Constitution §Development Workflow)

For **every** admin page:
- [ ] Renders standalone with **JS disabled** — all core content (KPIs/feeds/tables/cards/plan cards/comparison/all 6 content panels/usage bars/billing/FAQ/honesty notes) visible.
- [ ] `<html lang="ar" dir="rtl">`, exactly **one `<h1>`**, correct heading hierarchy, Arabic `<title>`+meta, `robots noindex`, breadcrumb present.
- [ ] Admin shell present, correct **active** sidebar item + breadcrumb; **visually distinct** from `../dashboard/index.html` (dark slate rail + gold accent).
- [ ] Relative paths resolve from `admin/` (CSS/JS/assets/`../pages`/`../dashboard`); intra-admin links work; `company-details.html?id=` works.
- [ ] Mobile drawer + 3 topbar dropdowns operate at **360px**; **no horizontal overflow**; ~44px targets; dense tables → stacked cards.
- [ ] No dead controls — every button navigates / modals / toasts / toggles / copies / validates; `الإعدادات` + unbuilt surfaces → coming-soon toast (no 404).
- [ ] All destructive actions (bulk-suspend, suspend, cancel, disable-plan, reset-usage, publish/unpublish, delete) use **custom confirm modals**; **login-as is disabled/safe**.
- [ ] Honest copy — no claim of real admin action, login, suspension, plan change, billing, invoice, payment, impersonation, integration check, publishing, export, email/WhatsApp, or persistence; safe wording present on every mutating control.
- [ ] No console errors; reload restores mock defaults (session-only state).

## Page-specific minimums
- [ ] **index** — ≥10 KPIs · activity ≥10 · top companies ≥8 (view → details) · 8 health cards · subscription alerts · 5 CSS visuals · 7 quick actions · checklist (5) · empty+skeleton.
- [ ] **companies** — ≥8 stats · search+8 filters+reset · 6 sort · `aria-live` count+chips · ≥12 rows (table→cards) · 7 row actions (login-as disabled) · bulk (suspend confirm) · 4 modals · 7 segments · FAQ ≥5.
- [ ] **company-details** — complete with/without `?id=` · ≥8 usage bars (warnings) · timeline ≥10 · top-deals · 7 booking stats · 8 integration rows · billing timeline · notes+support · 7 modals (reset-usage + login-as safety) · FAQ ≥5.
- [ ] **plans** — 4 plan cards · monthly/yearly toggle updates all prices · comparison ≥14 rows · create/edit validated · duplicate · disable confirm · companies-on-plan · FAQ ≥5.
- [ ] **subscriptions** — 8 stats (MRR/ARR) · search+filters+5 sort+count+chips · ≥12 rows · 8 row actions · bulk (cancel confirm) · empty+skeleton states · detail+invoice+extend-trial modals · FAQ ≥5.
- [ ] **analytics** — ≥12 KPIs · **8** CSS visuals (no chart lib) · 5 tables · ≥5 recommendations · export modal · date-range/compare active state · `#integrations` anchor · FAQ ≥5.
- [ ] **content** — 8 stats · 6 tabs (all panels in DOM) · 7 homepage sections + 5 tab tables · create/edit validated · feature toggle · publish/delete confirms · approve/reject · homepage preview · FAQ ≥5.

## Stack-compliance hard gate (must return ZERO)

```bash
cd travel-saas-frontend
# Forbidden tech + browser dialogs across the 7 pages + admin.js:
grep -RniE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" admin/ src/js/admin.js
# External runtime CDN (CSS/JS/font/image) — expect none:
grep -RniE "https?://[^\"' ]+\.(js|css|woff2?|png|jpg|svg)" admin/ | grep -viE "rihlaty\.example\.com|schema\.org"
# External chart/table library — expect none:
grep -RniE "chart\.js|chartjs|apexcharts|highcharts|d3|echarts|datatables|ag-grid" admin/ src/js/admin.js
```

## Automated checks
```bash
npx html-validate admin/*.html          # all 7 pages valid
npm run format                           # prettier
npm run lint:css                         # stylelint (if page-scoped <style> touches src)
# axe-core a11y (serve first), spot-check each page against WCAG 2.1 AA
```

## Regression — prior specs still render (open each)
- [ ] Spec 001 `pages/styleguide.html` + `pages/components.html`
- [ ] Spec 002 `pages/index.html`
- [ ] Spec 003 `pages/{compare,deals,coupons,deal-details}.html`
- [ ] Spec 004 `pages/{destinations,destination-details,blog,article}.html`
- [ ] Spec 005 `pages/{login,register,saved-deals,price-alerts,profile}.html`
- [ ] Spec 006 `dashboard/index.html`
- [ ] Spec 007 `dashboard/{deals,create-deal,edit-deal,coupons,create-coupon}.html`
- [ ] Spec 008 merchant bookings/customers — **not built** (coming-soon; confirm admin links to them stay coming-soon, no 404)
- [ ] Spec 009 `dashboard/{analytics,integrations,settings}.html`
- [ ] `tailwind.config.js` change is the single `./admin/**/*.html` glob addition; `ui.js`/`main.js`/`dashboard.js`/`discovery.js`/`content.js`/`member.js` unchanged.

## Output
Produce `specs/010-saas-owner-admin-dashboard/qa-results.md` recording every box above (build pass, HTML validation ×7, zero grep hits, no console errors, 360px no-overflow, RTL + LTR-structural, one-H1/hierarchy, paths, shell/active/drawer/dropdowns, per-page interactions, destructive-via-modal, all prior specs render, honest copy).
