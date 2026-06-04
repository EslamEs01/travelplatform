# Contract: Merchant Deals Pages (deals.html + create-deal.html + edit-deal.html)

**Feature**: `007-merchant-deals-coupons` | **Date**: 2026-06-02

This contract defines the **observable structure and behavior** the three deals pages MUST satisfy — the deals list, the
create-deal form, and the edit-deal form. It is the acceptance surface for `/speckit-tasks` and QA. "MUST" items are
non-negotiable; they trace to the spec's FRs/SCs and the constitution. All three pages reuse the **Spec 006 dashboard
shell** verbatim, the existing design tokens/components, `window.TUI`, and `main.js`'s `data-*`; only `src/js/dashboard.js`
(additive per-page controllers), `merchant-deals.json`, additive sprite icons, and a **link-only** edit to the shared
shell are added (no change to `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js`, the public/member `pages/`,
`partials/header.html`/`footer.html`, or the Spec 006 overview sections).

---

## C0. Shared page contract (all three deals pages)

- **C0.1** Standalone HTML5 document: `<html lang="ar" dir="rtl" data-page="…">` (`merchant-deals` / `merchant-create-deal`
  / `merchant-edit-deal`), own `<head>` built from the `partials/head.html` conventions (CSS `../assets/css/tailwind.css`,
  Cairo font preload, favicon, theme-color, viewport, Arabic title/meta, `robots noindex`), `#main` landmark, skip link,
  `#toast-root`, `#dash-announcer`. Renders with no console errors and **zero external CDN/network requests** for
  CSS/JS/fonts/images. (FR-005/FR-050; SC-001/SC-014)
- **C0.2** Loads `../src/js/ui.js`, `../src/js/main.js`, `../src/js/dashboard.js` (all `defer`). No inline page JS beyond
  optional JSON-LD and a safe inline JSON/mock-data block (e.g., edit-deal's `?id` data). Does NOT load `discovery.js`/
  `content.js`/`member.js`. (FR-004; research D2)
- **C0.3** Reuses the **Spec 006 app shell** (sidebar/topbar/drawer/breadcrumb/page-header/footer) and **MUST NOT**
  include the public marketing header/footer. The sidebar marks العروض active for deals.html & edit-deal.html and إضافة
  عرض active for create-deal.html (`aria-current="page"`). (FR-002; SC-003)
- **C0.4** Exactly one `<h1>` per page (إدارة العروض / إضافة عرض جديد / تعديل العرض); `<h2>` section headings; `<h3>`
  card/sub-section titles; correct heading order; the per-page breadcrumb; full meta. (FR-050; SC-015)
- **C0.5** Arabic RTL default, English-ready (logical properties; LTR mirrors with no structural breakage). Mobile-first,
  usable 320–360px → desktop, **no horizontal scroll at 360px**, touch targets ≥ ~44px. Price/amount/date/reference/URL
  use `dir="ltr"`. (FR-047/FR-048; SC-012)
- **C0.6** WCAG 2.1 AA: AA contrast, full keyboard operability + visible focus, focus-managed menus/modals (close on
  Escape), labelled fields with `aria-invalid`/`aria-describedby` on errors, `aria-pressed`/`aria-checked` for toggles,
  `aria-current` on the active sidebar item, `aria-expanded`/`aria-controls` on dropdown/menu triggers, `aria-live` for
  result-count/selection-count changes, accessible labels on icon-only controls, reduced-motion respected. `npm run
  audit:a11y` → 0 violations. (FR-049; SC-016)
- **C0.7** No dead interactions: every control navigates, opens/closes a menu/drawer/modal, toggles a visible state,
  applies/clears a filter/sort, updates a count, adds/removes a repeater row, copies, shows a toast, or submits a
  validated form. Zero bare `#` without a handler, zero `alert()`/`confirm()`/`prompt()`. (FR-045/FR-046; SC-002)
- **C0.8** ≥95% of styling via existing tokens/utilities; only a small page-scoped `<style>` for stat grid / filter panel
  / responsive table→cards / bulk bar / sticky summary / preview / repeaters. No new visual identity, no chart/table
  library. (FR-005; SC-013/SC-014)
- **C0.9** Core/default content renders with JavaScript disabled (static-HTML-first): deals.html ships its ≥12 rows + all
  sections; create-deal ships all form sections; edit-deal ships all sections **prefilled**. JS only enhances. (FR-006;
  SC-001)
- **C0.10** All management state is **frontend/session-only**: filter/sort/search, selection, status/featured toggles, a
  duplicated/added/removed row, typed values, generated code — in-memory; reload restores mock defaults; nothing
  persisted to a server (لا يتم الحفظ على خادم في هذه النسخة). (research D3–D6; FR-042)
- **C0.11** All content is believable mock; deal source badges limited to Manual Deal/Partner Link/Affiliate/API Ready/
  Scraped Pending Review; every surface states بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / قابل للربط لاحقًا; never
  implies a real publish, save, file/image upload, validated link, connected API, active scraping source, payment, or
  notification. (FR-042; IX)

## C1. Deals list — `deals.html` (US1, US2)

- **C1.1** **Page header**: one `<h1>` إدارة العروض, a description (agency deal-management workspace), CTAs إضافة عرض جديد
  (→ `create-deal.html`), تصدير تجريبي, استيراد تجريبي (mock toasts), and a safe note (الإجراءات هنا واجهة أمامية فقط).
  (FR-008; SC-004)
- **C1.2** **Stat mini-cards** (≥10): إجمالي العروض / النشطة / المسودات / المجدولة / الموقوفة / المنتهية / قاربت على
  الانتهاء / إجمالي الضغطات / طلبات الحجز / نسخ الكوبونات — realistic mock numbers consistent with the rendered rows.
  (FR-009; SC-004)
- **C1.3** **Search + filters**: text search (title/destination/provider) + filters for status, destination/region, deal
  type, source type, expiry status, price range, featured-only + a reset control. (FR-010; SC-004/SC-005)
- **C1.4** **Sort**: الأحدث / آخر تحديث / الأقل سعرًا / الأعلى سعرًا / الأعلى ضغطات / الأعلى طلبات / الأقرب انتهاءً.
  (FR-010; SC-005)
- **C1.5** **Result-count + active chips** (`aria-live`): the visible-deal count updates on every filter/search/sort
  change; a removable chip per active filter; reset clears all. (FR-011; SC-005)
- **C1.6** **Deals table/card hybrid**: ≥12 rows render statically, each with checkbox / title / destination / type /
  price / discount / source badge / status badge / expiry / clicks / inquiries / last-updated / actions menu; on mobile
  the table becomes stacked labeled cards with no horizontal scroll. (FR-012; SC-004)
- **C1.7** **Row action menu**: view public page (→ `../pages/deal-details.html?id=<id>` or safe toast), edit (→
  `edit-deal.html?id=<id>`), duplicate (clone/toast), pause/activate (status badge toggle), mark featured/unfeatured
  (badge toggle), archive (custom modal), delete (custom modal) — each operable, none dead, keyboard-operable, closes on
  outside-click/Escape. (FR-013; SC-005)
- **C1.8** **Bulk bar**: select-all + per-row checkboxes → live selected-count (`aria-live`); bulk activate / pause /
  archive / **delete (custom modal)** / **export (mock toast)**. (FR-014; SC-005)
- **C1.9** **Empty state** (no matches): message + reset-filters + create-deal CTA — shown when 0 rows match, never a
  blank/broken table. (FR-015; SC-004)
- **C1.10** A reusable **skeleton** pattern, a **source/status legend** (Manual Deal / Partner Link / Affiliate / API
  Ready / Scraped Pending Review + Draft/Active/Paused/Expired), and a **help FAQ ≥5** (incl. هل يتم نشر العرض فعليًا؟ /
  هل يمكن رفع صور حقيقية الآن؟ / هل يمكن تكرار العرض؟). (FR-015; SC-004)
- **C1.11** Status/featured toggles and duplicate/delete change only the **session DOM** (badge swap / clone / remove +
  toast); no copy claims a real publish/delete/export. (FR-013/FR-014; SC-005/SC-011)

## C2. Create-deal — `create-deal.html` (US3)

- **C2.1** **Page header**: one `<h1>` إضافة عرض جديد, a description, actions حفظ كمسودة / نشر تجريبي / معاينة / رجوع
  للعروض (→ `deals.html`), and a safe note (لا يتم حفظ العرض على خادم في هذه النسخة), in a professional multi-section,
  mobile-friendly layout. (FR-016; SC-006)
- **C2.2** **Form sections present and labeled**: basic information (title*/dealType*/destination*/country/city/region/
  shortDescription*/fullDescription), pricing (currency/priceBefore/priceFrom*/discountType/discountValue/taxes/payment/
  deposit), travel dates & availability (start/end/bookingDeadline/expiry*/availability/flexible-dates toggle/note),
  source & booking link (sourceType*/provider/booking-affiliate URL/source URL/notes/manual-review toggle + conditional
  helper text), media (mock upload/alt/remove-replace/preview), highlights repeater (≥3 initial), included/not-included
  repeaters, terms, SEO preview (title/meta/slug + slug & public-URL preview), status & visibility (status/featured/
  visible-on-homepage/conditional schedule date). (FR-017–FR-022; SC-006)
- **C2.3** **Validation**: required fields (title, dealType, destination, shortDescription, priceFrom, expiryDate,
  sourceType) validate inline with `aria-invalid`/`aria-describedby`; **publish-mock** blocks on invalid and on success
  shows a نشر تجريبي toast (no real-publish claim); **save-draft** shows a frontend-only toast (no server-save claim).
  (FR-023; SC-006)
- **C2.4** **Preview modal** opens showing a card preview (title, destination, price, source badge, CTA); a sticky action
  summary MAY show completion/missing-required + save/publish. (FR-023; SC-006)
- **C2.5** **Dynamic repeaters**: highlights start ≥3; add inserts a row; remove deletes it; ≥1 retained. Included/
  not-included add/remove likewise. (FR-021; SC-006)
- **C2.6** **Conditional behaviors**: slug auto-generates/previews from the title (overridable) with a public-URL preview;
  source-type reveals the right helper text (configuration-ready, no link validation now; Scraped → review notice);
  flexible-dates toggle adapts availability; status = Scheduled reveals a schedule-publish date; media upload shows a
  mock preview / "لا يتم رفع ملفات حقيقية الآن" toast (no real upload). No control is dead. (FR-018–FR-022; SC-006)

## C3. Edit-deal — `edit-deal.html` (US4)

- **C3.1** Reuses **all create-deal sections** (C2.2) **prefilled** with realistic mock data for the selected deal; one
  `<h1>` تعديل العرض. (FR-024; SC-007)
- **C3.2** Accepts optional `?id=<deal-id>` resolving against `merchant-deals.json`/`deals.json` ids (via an inline JSON
  block); a missing/unknown id **falls back to a default mock deal** and renders without error or 404. (FR-024; SC-007)
- **C3.3** **Edit header**: deal reference, current status badge, last-updated, created-by, public URL, clicks, inquiries
  (static mock). (FR-025; SC-007)
- **C3.4** **Activity mini-log** of ≥5 mock events (created / updated price / status changed / coupon attached / inquiry
  received), framed as a demo history. (FR-025; SC-007)
- **C3.5** **Public-preview link** → `../pages/deal-details.html?id=<id>` (navigates when the public page exists, else a
  safe frontend-only toast). (FR-026; SC-007)
- **C3.6** **Edit actions**: save changes / save as draft / preview / duplicate (toast) / archive (custom modal) /
  pause-activate (status toggle) / delete (custom modal) / back-to-deals (→ `deals.html`); archive & delete confirm via
  `TUI.modal`; nothing claims a real DB mutation. All create-form interactions (validation, repeaters, slug, conditional
  fields, mock upload, preview) work on the prefilled data; no control is dead. (FR-026; SC-007)

## C4. Coming-soon, navigation rewiring & non-regression

- **C4.1** The sidebar (on these pages and via the link-only edit to Spec 006 `index.html`) navigates العروض →
  `deals.html`, إضافة عرض → `create-deal.html`, الكوبونات → `coupons.html`; the topbar quick-add navigates إضافة عرض →
  `create-deal.html`, إنشاء كوبون → `create-coupon.html`; edit links use `edit-deal.html?id=<id>`. (FR-043; SC-003)
- **C4.2** Every control targeting a still-unbuilt merchant page (`bookings.html`, `booking-details.html`,
  `customers.html`, `customer-details.html`, `analytics.html`, `integrations.html`, `settings.html`) uses
  `data-coming-soon` (toast, no 404); those files are not created. (FR-044; SC-002)
- **C4.3** Non-regression: `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` unchanged; the Spec 006
  `merchant-dashboard` controller in `dashboard.js` unchanged; sprite edits append-only; **no Tailwind config change**
  (the `./dashboard/**/*.html` glob already exists); the Spec 006 overview sections/layout/copy preserved (only
  deals/coupons links rewired); Specs 001–005 pages still render. (FR-003; SC-018)
