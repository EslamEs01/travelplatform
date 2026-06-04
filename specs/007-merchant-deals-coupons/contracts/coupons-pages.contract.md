# Contract: Merchant Coupons Pages (coupons.html + create-coupon.html)

**Feature**: `007-merchant-deals-coupons` | **Date**: 2026-06-02

This contract defines the **observable structure and behavior** the two coupons pages MUST satisfy — the coupons list and
the create-coupon form. It is the acceptance surface for `/speckit-tasks` and QA. "MUST" items trace to the spec's
FRs/SCs and the constitution. Both pages reuse the **Spec 006 dashboard shell** verbatim, the existing tokens/components,
`window.TUI`, and `main.js`'s `data-*`; only `src/js/dashboard.js` (additive per-page controllers), `merchant-coupons.json`,
additive sprite icons, and the **link-only** shared-shell edit are added (no change to `main.js`/`ui.js`/`discovery.js`/
`content.js`/`member.js`, the public/member `pages/`, `partials/header.html`/`footer.html`, or the Spec 006 overview).

---

## C0. Shared page contract (both coupons pages)

- **C0.1** Standalone HTML5 document: `<html lang="ar" dir="rtl" data-page="…">` (`merchant-coupons` /
  `merchant-create-coupon`), own `<head>` from the `partials/head.html` conventions (CSS `../assets/css/tailwind.css`,
  Cairo font preload, favicon, theme-color, viewport, Arabic title/meta, `robots noindex`), `#main`, skip link,
  `#toast-root`, `#dash-announcer`. No console errors; **zero external CDN/network requests**. (FR-005/FR-050; SC-001)
- **C0.2** Loads `../src/js/ui.js`, `../src/js/main.js`, `../src/js/dashboard.js` (defer). No inline page JS beyond
  optional JSON-LD / safe inline JSON. Does NOT load `discovery.js`/`content.js`/`member.js`. (FR-004; research D2)
- **C0.3** Reuses the **Spec 006 app shell**; **MUST NOT** include the public marketing header/footer. The sidebar marks
  الكوبونات active on both pages (`aria-current="page"`). (FR-002; SC-003)
- **C0.4** Exactly one `<h1>` per page (إدارة الكوبونات / إنشاء كوبون); `<h2>`/`<h3>` order correct; per-page breadcrumb;
  full meta. (FR-050; SC-015)
- **C0.5** Arabic RTL default, English-ready; mobile-first, usable 320–360px → desktop, **no horizontal scroll at 360px**,
  touch targets ≥ ~44px. Coupon code, discount, amount, currency, date, percentage, URL use `dir="ltr"` — **coupon codes
  render `dir="ltr"` in both the table and the preview**. (FR-047/FR-048; SC-008/SC-012)
- **C0.6** WCAG 2.1 AA (as deals C0.6): keyboard, focus management, labelled fields + `aria-invalid`/`aria-describedby`,
  `aria-pressed`/`aria-checked`, `aria-current`, `aria-expanded`, `aria-live` for count/selection, icon-only labels,
  reduced-motion. 0 audit violations. (FR-049; SC-016)
- **C0.7** No dead interactions; zero bare `#`; zero `alert()`/`confirm()`/`prompt()` (delete via `TUI.modal`;
  generate-code writes into the field). Forms show valid/invalid/error/success. (FR-045/FR-046; SC-002)
- **C0.8** ≥95% styling via tokens; small page-scoped `<style>` only (stat grid / filter panel / table→cards / bulk bar /
  coupon-preview); no new visual identity, no chart/table library. (FR-005; SC-013)
- **C0.9** Core content renders without JS: coupons.html ships ≥12 rows + all sections; create-coupon ships all sections.
  JS only enhances. (FR-006; SC-001)
- **C0.10** Management state is **frontend/session-only**; reload restores defaults; nothing persisted (لا يتم الحفظ على
  خادم في هذه النسخة). (research D3/D7; FR-042)
- **C0.11** Believable mock; coupon source badges limited to Manual/Affiliate/Coupon API/Scraped Pending Review; every
  surface states بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / قابل للربط لاحقًا; never implies a coupon active on a
  live system, a real save, a validated/guaranteed coupon, a connected API, an active scraping source, a payment, or a
  notification. (FR-042; IX)

## C1. Coupons list — `coupons.html` (US5)

- **C1.1** **Page header**: one `<h1>` إدارة الكوبونات, a description, CTAs إنشاء كوبون (→ `create-coupon.html`), تصدير
  تجريبي, استيراد تجريبي (mock toasts), and a safe frontend-only note. (FR-027; SC-008)
- **C1.2** **Stat mini-cards** (≥9): إجمالي الكوبونات / النشطة / المسودات / المجدولة / الموقوفة / المنتهية / مرات النسخ /
  الاستخدام التجريبي / قاربت على الانتهاء — mock numbers consistent with the rendered rows. (FR-028; SC-008)
- **C1.3** **Search + filters**: search (code/provider/deal) + filters for status, discount type, provider, source type,
  category, related deal, expiry, usage limit + reset. (FR-029; SC-008)
- **C1.4** **Sort**: الأحدث / الأقرب انتهاءً / الأكثر نسخًا / الأعلى استخدامًا / الخصم الأعلى. (FR-029; SC-008)
- **C1.5** **Result-count + active chips** (`aria-live`) + reset/chip-removal clear filters. (FR-029; SC-008)
- **C1.6** **Coupons table/card hybrid**: ≥12 rows render statically, each with checkbox / code (`dir="ltr"`) / discount /
  provider / category / source badge / related deal / usage limit / used count / expiry / status badge / actions; mobile
  → stacked labeled cards, no horizontal scroll. (FR-030; SC-008)
- **C1.7** **Row action menu**: copy code (via `copyToClipboard`/`data-copy` + toast) / edit (mock-modal or coming-soon) /
  duplicate (clone/toast) / pause-activate (status toggle) / view public coupon-deal (href/safe toast) / delete (custom
  modal) — none dead; delete never uses `confirm()`. (FR-031; SC-008)
- **C1.8** **Bulk bar**: select-all + selected-count (`aria-live`) + activate / pause / **delete (custom modal)** /
  **export (mock toast)**. (FR-032; SC-008)
- **C1.9** **Empty state** (no matches): message + reset + create-coupon CTA. (FR-032; SC-008)
- **C1.10** A reusable **skeleton** pattern, a **coupon-source explanation** (Manual / Affiliate / Coupon API / Scraped
  Pending Review + why review is required), and a **help FAQ ≥5** (incl. هل الكوبون يعمل فعليًا الآن؟ / ما معنى Coupon
  API؟ / هل الكوبونات المسحوبة Scraped تنشر تلقائيًا؟). (FR-032; SC-008)
- **C1.11** Copy-code copies the actual code; status toggles and duplicate/delete change only the session DOM + toast; no
  copy claims a coupon really works now or a real export/delete. (FR-031/FR-032; SC-008/SC-011)

## C2. Create-coupon — `create-coupon.html` (US6)

- **C2.1** **Page header**: one `<h1>` إنشاء كوبون, a description, actions حفظ كمسودة / نشر تجريبي / معاينة / رجوع
  للكوبونات (→ `coupons.html`), and a safe note (لا يتم حفظ الكوبون على خادم في هذه النسخة), in a professional
  multi-section, mobile-friendly layout. (FR-033; SC-009)
- **C2.2** **Form sections present and labeled**: basic information (code* + generate-random-code + copy / provider /
  category* [Flights/Hotels/Packages/Activities/Car Rental/Travel Insurance/Umrah/Honeymoon] / related-deal / short
  description), discount (type* [Percentage/Fixed amount/Free service/Custom offer] / value* / currency [conditional] /
  minimum booking / max discount), usage rules (start / expiry* / usage limit / per-user limit / first-booking-only
  toggle / new-customers-only toggle / selected destinations), source (type* [Manual/Affiliate/Coupon API/Scraped
  Pending Review] / source URL / affiliate URL / review status / manual-review toggle / notes), terms (terms /
  exclusions / notes), status & visibility (status [Draft/Active/Scheduled] / visible-on-public toggle / featured toggle
  / conditional schedule date), live coupon preview card, SEO/public display (public title / meta / slug preview).
  (FR-034–FR-037; SC-009)
- **C2.3** **Generate-random-code** writes a code into the code field **without** a browser `prompt()`; the **copy**
  control copies the current code via `copyToClipboard` + toast. (FR-034/FR-038; SC-009)
- **C2.4** **Conditional behaviors**: discount type = Fixed amount reveals the currency field; source type = Scraped
  Pending Review shows the warning "لا يتم نشر أي كوبون مجمّع تلقائيًا قبل المراجعة" + review controls; status = Scheduled
  reveals a schedule-publish date; affiliate/source URLs framed as configuration-ready (no validation now). (FR-035/
  FR-036/FR-037; SC-009)
- **C2.5** **Live coupon preview card** reflects the code (`dir="ltr"`), discount, provider, source badge, and expiry as
  the user edits, with a copy-button preview. (FR-037; SC-009)
- **C2.6** **Validation**: required fields (code, category, discountType, discountValue, expiryDate; currency when Fixed
  amount) validate inline with `aria-invalid`/`aria-describedby`; **publish-mock** blocks on invalid and on success shows
  a نشر تجريبي toast (no real-activation claim); **save-draft** shows a frontend-only toast; رجوع → `coupons.html`. No
  control is dead. (FR-038; SC-009)

## C3. Coming-soon, navigation rewiring & non-regression

- **C3.1** The sidebar الكوبونات → `coupons.html` and the create-coupon link wherever referenced (coupons-list CTA,
  topbar quick-add إنشاء كوبون, and the link-only Spec 006 `index.html` edit) navigate for real. (FR-043; SC-003)
- **C3.2** Every control targeting a still-unbuilt merchant page (`bookings.html`, `booking-details.html`,
  `customers.html`, `customer-details.html`, `analytics.html`, `integrations.html`, `settings.html`) uses
  `data-coming-soon`; those files are not created. (FR-044; SC-002)
- **C3.3** Non-regression: `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` unchanged; the Spec 006
  `merchant-dashboard` controller unchanged; sprite edits append-only; **no Tailwind config change**; the Spec 006
  overview sections/layout/copy preserved (only links rewired); Specs 001–005 pages still render. (FR-003; SC-018)
