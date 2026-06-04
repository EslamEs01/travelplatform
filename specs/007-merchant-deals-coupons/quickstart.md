# Quickstart: Merchant Deals + Coupons Management

**Feature**: `007-merchant-deals-coupons` | **Date**: 2026-06-02

How to build, preview, and verify the five new merchant management pages — `deals.html`, `create-deal.html`,
`edit-deal.html`, `coupons.html`, `create-coupon.html` — inside the existing `dashboard/` directory. The toolchain is
unchanged from Spec 001–006 (HTML + local Tailwind v3.4 build + vanilla JS, **no CDN, no framework, no chart/table
library**). This feature is static composition + mock content on top of the **Spec 006 dashboard shell**, enhanced by an
**additive extension** of `dashboard.js`. Everything is **frontend-only**: nothing is really published, saved, uploaded,
validated, connected, paid, or notified.

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only; already installed in Spec 001).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
# No tailwind.config.js change needed — './dashboard/**/*.html' is already in the content globs (added in Spec 006).
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → http://localhost:3000/dashboard/deals.html
```

Preview each page end-to-end:

- **`deals.html`**: shell with العروض active + breadcrumb لوحة التحكم / العروض; read the stat mini-cards; type a search /
  pick filters / change sort → rows narrow & reorder, the result-count + chips update, reset clears; open a row menu →
  view-public (→ `../pages/deal-details.html?id=`/safe toast), edit (→ `edit-deal.html?id=`), duplicate (toast/clone),
  pause-activate (badge toggle), mark-featured (badge toggle), archive (modal), delete (modal → row removed); select-all
  + bulk activate/pause/archive/delete(modal)/export(toast); filter to zero → empty state; confirm the source/status
  legend + ≥5 FAQ; **mobile 360px**: table → stacked cards, drawer opens/closes, no horizontal scroll.
- **`create-deal.html`**: shell with إضافة عرض active; fill the multi-section form; نشر تجريبي with required fields empty →
  inline errors; valid → نشر تجريبي toast; حفظ كمسودة → toast; معاينة → preview modal (card); add/remove highlights
  (≥3 start) + included/not-included; type a title → slug + public-URL preview; pick a source type → conditional helper
  text; pick Scheduled → schedule date; toggle flexible-dates; click upload → mock preview / "لا يتم رفع ملفات حقيقية
  الآن" toast; رجوع للعروض → `deals.html`.
- **`edit-deal.html`** (and `edit-deal.html?id=deal-003`): shell with العروض active; the form is **prefilled**; an
  unknown `?id` falls back to a default deal (no error); read the edit header (reference/status/last-updated/created-by/
  public URL/clicks/inquiries) + the ≥5-event activity log; public-preview link → `../pages/deal-details.html?id=`;
  save-changes/save-draft → toast; duplicate → toast; pause-activate → status toggle; archive & delete → modal; all
  create-form interactions still work on the prefilled data.
- **`coupons.html`**: shell with الكوبونات active + breadcrumb لوحة التحكم / الكوبونات; stat mini-cards; search/filter/
  sort/reset over ≥12 coupon rows (codes shown `dir="ltr"`); open a row menu → copy-code (copies + toast), edit, duplicate
  (toast/clone), pause-activate (badge toggle), view public coupon/deal, delete (modal); select-all + bulk activate/pause/
  delete(modal)/export(toast); zero matches → empty state; confirm the coupon-source explanation + ≥5 FAQ; **mobile**:
  table → cards, no horizontal scroll.
- **`create-coupon.html`**: shell with الكوبونات active; fill the form; generate-random-code → fills the code field (no
  `prompt()`); copy → toast; pick Fixed amount → currency field appears; pick Scraped Pending Review → "لا يتم نشر أي
  كوبون مجمّع تلقائيًا قبل المراجعة" warning; pick Scheduled → schedule date; the live preview card updates from the form
  (code `dir="ltr"`); نشر تجريبي with required empty → errors; valid → نشر تجريبي toast; حفظ كمسودة → toast; رجوع
  للكوبونات → `coupons.html`.
- **Nav rewiring**: from `dashboard/index.html` (Spec 006 overview) confirm العروض/إضافة عرض/الكوبونات (sidebar) + the
  quick-add إضافة عرض/إنشاء كوبون + any deals/coupons overview CTAs now **navigate** to the new pages; the Spec 006
  overview sections/layout/copy are unchanged; طلبات الحجز/العملاء/التحليلات/التكاملات/الإعدادات still show coming-soon.

> Rebuild after editing markup so Tailwind's content scan picks up newly-used utility classes (the globs already include
> `./dashboard/**/*.html`).

## 2. Per-page "done" checklist (Constitution gate)

A page is **NOT done** until all pass.

**Shell & page basics (all five)**
- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network requests** for
      CSS/JS/fonts/images (SC-001/SC-014).
- [ ] **Spec 006 shell reuse**: sidebar + topbar + mobile drawer + breadcrumb + page header + dashboard footer, identical
      to Spec 006; the public marketing header/footer is **not** present; correct active sidebar item (`aria-current`) +
      correct breadcrumb (FR-002; SC-003).
- [ ] **No-JS baseline**: with JavaScript disabled, the list pages render ≥12 rows + all sections and the forms render all
      fields (edit-deal prefilled) (SC-001; FR-006).
- [ ] **Session-only honesty**: filter/sort/search, selection, status/featured toggles, duplicated/added/removed rows,
      typed values, generated code are in-memory; reload restores mock defaults; no copy claims server/permanent storage
      (FR-042; research D3).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; usable at 360px with **no horizontal scroll**; touch targets ≥
      ~44px; code/amount/date/reference/URL `dir="ltr"` (coupon codes `dir="ltr"` in table + preview) (SC-008/SC-012).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors the shell/filter panel/table/form grid/preview with no
      structural breakage (SC-012).
- [ ] **Design-system fidelity**: ≥95% styling via tokens/utilities; only a small page-scoped `<style>` for stat grid/
      filter panel/table→cards/bulk bar/sticky summary/preview/repeaters; no new visual identity; **no chart/table
      library** (SC-013).
- [ ] **No dead interactions**: zero bare `#` without a handler, zero dead buttons, zero `alert()`/`confirm()`/
      `prompt()`; unbuilt-module links use coming-soon (no 404) (SC-002).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, the dashboard breadcrumb, required Arabic title/meta;
      `robots noindex` acceptable; any JSON-LD describes the frontend-only mock honestly (SC-015).
- [ ] **Honest copy**: no real publish, database save, file/image upload, validated/guaranteed coupon or link, connected
      API, active scraping source, payment, or notification claims; every page surfaces ≥1 safe note (e.g., الإجراءات هنا
      واجهة أمامية فقط / لا يتم الحفظ على خادم في هذه النسخة) (SC-011).
- [ ] **Accessibility WCAG 2.1 AA**: `npm run audit:a11y` (per page) → 0 violations; keyboard reaches/operates 100% of
      controls (filters/search/sort/reset, chips, table checkboxes + select-all, row menus, bulk buttons, confirm modals
      with managed focus, copy, every form field, repeater add/remove, generate-code, mock-upload, preview modal, status/
      visibility toggles, edit/archive/delete/duplicate/pause-activate, public-preview); visible focus; `aria-current`;
      `aria-expanded`; `aria-live` for count/selection; reduced-motion respected (SC-016).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-017).

**Deals list — deals.html (US1/US2)**
- [ ] Page header (H1 إدارة العروض + description + CTAs + safe note); ≥10 stat mini-cards (SC-004).
- [ ] Search + 8 filters + reset; 7 sort options; result-count + chips (`aria-live`) (SC-004/SC-005).
- [ ] Table/card hybrid ≥12 rows (13 columns) → stacked cards on mobile (SC-004).
- [ ] Row menu: view-public(href/safe toast)/edit(`edit-deal.html?id=`)/duplicate(toast)/pause-activate(badge)/featured(badge)/archive(modal)/delete(modal); none dead (SC-005).
- [ ] Bulk bar: select-all + count + activate/pause/archive/delete(modal)/export(toast) (SC-005).
- [ ] Empty state (message + reset + create); skeleton pattern; source/status legend; FAQ ≥5 (SC-004).

**Create deal — create-deal.html (US3)**
- [ ] H1 إضافة عرض جديد + actions + safe note; all 10 form sections present (SC-006).
- [ ] Required-field validation blocks publish-mock (`aria-invalid`/`aria-describedby`); valid → نشر تجريبي toast; save-draft → toast (SC-006).
- [ ] Preview modal (card); highlights (≥3 start) + included/not-included repeaters add/remove; slug preview from title; source-type helper text; flexible-dates + Scheduled-date conditionals; mock upload (no real upload) (SC-006).

**Edit deal — edit-deal.html (US4)**
- [ ] H1 تعديل العرض; all create-deal sections **prefilled**; `?id` selects, missing/unknown → default deal (no 404) (SC-007).
- [ ] Edit header (reference/status/last-updated/created-by/public URL/clicks/inquiries); activity log ≥5; public-preview link (SC-007).
- [ ] save-changes/save-draft → toast; preview modal; duplicate → toast; pause-activate → status toggle; archive & delete → custom modal; no dead controls (SC-007).

**Coupons list — coupons.html (US5)**
- [ ] H1 إدارة الكوبونات + CTAs + safe note; ≥9 stat mini-cards (SC-008).
- [ ] Search + 9 filters + reset; 5 sort options; result-count + chips (SC-008).
- [ ] Table/card hybrid ≥12 rows (11 columns; code `dir="ltr"`) → cards on mobile (SC-008).
- [ ] Row menu: copy-code(copies+toast)/edit/duplicate/pause-activate/view-public/delete(modal) (SC-008).
- [ ] Bulk bar: select-all + count + activate/pause/delete(modal)/export(toast); empty state; skeleton; coupon-source explanation; FAQ ≥5 (SC-008).

**Create coupon — create-coupon.html (US6)**
- [ ] H1 إنشاء كوبون + actions + safe note; all 7 form sections + live preview card (code `dir="ltr"`) (SC-009).
- [ ] generate-random-code fills the field (no `prompt()`); copy copies + toast (SC-009).
- [ ] Required-field validation blocks publish-mock; valid → نشر تجريبي toast; Fixed amount → currency field; Scraped Pending Review → warning; Scheduled → date; preview reflects edits (SC-009).

**Navigation & non-regression**
- [ ] Sidebar العروض/إضافة عرض/الكوبونات + quick-add + Spec 006 overview deals/coupons CTAs rewired to real navigation; edit → `edit-deal.html?id=` (SC-003).
- [ ] The 7 still-unbuilt merchant pages remain coming-soon (no files created, no 404) (SC-002).
- [ ] `src/js/main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` unchanged; the Spec 006 `merchant-dashboard` controller in `dashboard.js` unchanged; sprite edits append-only; **no Tailwind config change**; the Spec 006 overview sections/layout/copy preserved (SC-018).
- [ ] Styleguide/components, the Spec 002 homepage, the Spec 003 discovery pages, the Spec 004 content pages, the Spec 005 member pages, and the **Spec 006 `dashboard/index.html` overview** still render; `partials/header.html`/`footer.html` and `pages/` unchanged (SC-018).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules) — forbidden tech + browser dialogs:
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules

# Must return NO matches — external chart/table/datagrid libraries on the new pages:
grep -RInE "chart\.js|chartjs|apexcharts|highcharts|echarts|d3\.|recharts|plotly|datatables|ag-grid|tabulator" \
  dashboard/ src/js/dashboard.js | grep -v node_modules
```

Any match fails review (Principle II / SC-014).

## 4. Validation commands

```bash
npx html-validate dashboard/deals.html dashboard/create-deal.html dashboard/edit-deal.html \
  dashboard/coupons.html dashboard/create-coupon.html              # 0 errors
npx stylelint "src/**/*.css"                                       # 0 errors (only if input.css touched)
npx prettier --check "src/js/dashboard.js" "dashboard/*.html"
npm run serve & for p in deals create-deal edit-deal coupons create-coupon; do \
  axe "http://localhost:3000/dashboard/$p.html"; done             # 0 AA violations each
```

## 5. Mock-data consistency check

- [ ] `merchant-deals.json` has **≥12** deals (full schema); `status`/`sourceType`/`dealType` use the allowed enums and
      spread across them; ≥10 ids reuse `deal-001…deal-010`; each resolving `publicUrl`/edit `?id` → `../pages/deal-
      details.html?id=`; stat-card counts match the rendered rows.
- [ ] `merchant-coupons.json` has **≥12** coupons (full schema); `status`/`discountType`/`sourceType`/`category` use the
      allowed enums and spread; `currency` present when Fixed amount; `relatedDeal` resolves to a `deal-0xx` id (or null);
      ids/codes reuse `coupons.json` where applicable; codes are `dir="ltr"`-safe.
- [ ] A missing/invalid referenced id never breaks a page (edit-deal default deal; safe-toast CTA).
- [ ] Reused `deals.json`/`coupons.json` (and the Spec 006 catalogs) are unchanged.

## Where things live

- Pages → `dashboard/deals.html`, `dashboard/create-deal.html`, `dashboard/edit-deal.html`, `dashboard/coupons.html`,
  `dashboard/create-coupon.html` (NEW; reuse the Spec 006 shell). Plus a **link-only** edit to `dashboard/index.html`.
- Reused tokens/components → `tailwind.config.js` (UNCHANGED — `./dashboard/**/*.html` glob already present), `src/input.css`
  (`.btn`/`.card`/`.badge*`/`.field*`/`.modal`/`.drawer*`/`.skeleton*`/`.empty-state`/`.inline-msg*`/`.breadcrumb*`/
  `.filter-chip`/`.result-bar`/`.search-input*`).
- Reused `<head>` conventions → `partials/head.html` — header/footer NOT used on the dashboard.
- Reused interactions → `src/js/ui.js` (`window.TUI`, incl. `validateForm`/`copyToClipboard`/`modal`/`toast`/`drawer`) +
  `src/js/main.js` (declarative `data-*`, incl. `data-coming-soon`/`data-modal-open|close`/`data-copy`/`data-toast`/
  `data-year`) + `discovery.js`/`content.js`/`member.js` — **all unchanged, none loaded by the dashboard**.
- New page logic → `src/js/dashboard.js` (★ EXTENDED additively — 5 per-page controllers dispatched by `<html
  data-page>`; the Spec 006 `merchant-dashboard` controller + `DropdownController`/row-menu/form-wrapper primitives are
  reused unchanged).
- Mock content → `assets/data/merchant-deals.json` (NEW; ≥12), `assets/data/merchant-coupons.json` (NEW; ≥12);
  `deals.json`/`coupons.json` (referenced unchanged).
- Icons → `assets/icons/sprite.svg` (additive management-action symbols; no existing symbol changed).
- Contracts → `specs/007-merchant-deals-coupons/contracts/` (deals-pages, coupons-pages, mock-data).
- QA artifact → `qa-results.md` (produced after implementation).
```
