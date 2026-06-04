---
description: "Task list for 007-merchant-deals-coupons"
---

# Tasks: Merchant Deals + Coupons Management (Travel SaaS Platform)

**Input**: Design documents from `specs/007-merchant-deals-coupons/`
**Prerequisites**: plan.md ✅, spec.md ✅ (6 user stories), research.md ✅ (D1–D11), data-model.md ✅, contracts/ ✅ (deals-pages, coupons-pages, mock-data)

**Tests**: No automated test suite is requested (per the constitution, QA is the manual per-page "done" checklist + an
automated accessibility/SEO/stack audit). Verification tasks live in the Polish phase. No unit/contract test tasks are
generated.

**Organization**: Tasks are grouped by user story (US1–US6) so each is an independently testable increment. This feature
delivers **five new pages** in `dashboard/` + an **additive extension** of `src/js/dashboard.js` + **two** mock catalogs
+ a **link-only** rewire of the Spec 006 shell. US1+US2 build the same file (`deals.html`); US3/US4/US5/US6 build
**distinct** files (`create-deal.html` / `edit-deal.html` / `coupons.html` / `create-coupon.html`) — so their HTML is
genuinely file-parallel — but all six add a controller block to the **shared** `src/js/dashboard.js` (a serialization
point). See the **Shared-file note** below.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — **different files**, no dependency on an incomplete task.
- **[Story]**: US1–US6 (Setup/Foundational/Polish have no story label).
- All paths are under `travel-saas-frontend/` unless noted.

## Conventions for this feature

- All five pages are **standalone static HTML** inside the existing `dashboard/` directory and **reuse the Spec 006
  dashboard shell verbatim** (sidebar/topbar/mobile drawer/breadcrumb/page-header/footer) — varying only the active
  sidebar item (`aria-current`), the breadcrumb, and the page header. They author their own `<head>` from the
  `partials/head.html` conventions and do **NOT** inline the public `partials/header.html`/`footer.html`. Paths are
  `../assets/…`, `../src/js/…`, `../pages/…` (research D1).
- Core/default content is **static HTML** (renders without JS): the list pages ship their ≥12 rows + all sections; the
  forms ship all fields; `edit-deal.html` ships its prefilled values. The **existing** `src/js/dashboard.js` is
  **EXTENDED additively** with 5 new per-page controllers dispatched by `<html data-page>` (`merchant-deals` /
  `merchant-create-deal` / `merchant-edit-deal` / `merchant-coupons` / `merchant-create-coupon`), reusing the Spec 006
  `DropdownController`/row-menu/form-wrapper primitives; the Spec 006 `merchant-dashboard` controller stays **unchanged**
  (research D2).
- `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, `src/js/member.js`, and
  `partials/header.html`/`footer.html` and the public/member `pages/` MUST remain **unchanged**. The Spec 006
  `dashboard/index.html` is edited **links-only** (no section/layout/copy removed). `tailwind.config.js` needs **no
  change** (its `content` globs already include `./dashboard/**/*.html`). Sprite edits are **append-only**.
- Confirmations (delete, archive, bulk-delete) use the existing `.modal`/`window.TUI.modal`; generate-random-code writes
  into the field — **no `alert()`/`confirm()`/`prompt()`** anywhere (research D4/D7). The seven still-unbuilt merchant
  pages use `data-coming-soon` (toast, no 404; files not created — research D11).
- **No external chart/table/datagrid library** (research D10). State is **frontend/session-only** (reload restores mock
  defaults). Reuse source badges (Manual Deal/Partner Link/Affiliate/API Ready for deals; Manual/Affiliate/Coupon API/
  Scraped Pending Review for coupons) + status badges; never imply a real publish, database save, file/image upload,
  validated/guaranteed coupon or link, connected API, active scraping source, payment, or notification (بيانات تجريبية /
  واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه النسخة / قابل للربط لاحقًا).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline and prepare the additive sprite icons the new pages need.

- [x] T001 Verify baseline: run `npm run build` in `travel-saas-frontend/` (regenerates `assets/css/tailwind.css`) and confirm the Spec 001 styleguide/components, the Spec 002 homepage, the Spec 003 pages (`deals`/`deal-details`/`compare`/`coupons`), the Spec 004 pages (`destinations`/`destination-details`/`blog`/`article`), the Spec 005 pages (`login`/`register`/`saved-deals`/`price-alerts`/`profile`), and the Spec 006 `dashboard/index.html` render with no console errors and no external CDN requests. Confirm `tailwind.config.js` already includes `./dashboard/**/*.html` (no change needed) (SC-018; research D10).
- [x] T002 [P] Append additive `<symbol>` icons to `assets/icons/sprite.svg` for the management actions the current sprite lacks — e.g., `icon-trash`, `icon-pause`, `icon-play`, `icon-archive`, `icon-duplicate`, `icon-filter`, `icon-sliders`, `icon-upload`, `icon-download`, `icon-image`, `icon-refresh`, `icon-wand`, `icon-percent`, `icon-clock` (reuse existing `icon-edit`/`icon-eye`/`icon-copy`/`icon-more`/`icon-plus`/`icon-tag`/`icon-ticket`/`icon-trend-up`/`icon-trend-down`/`icon-calendar`/`icon-check-circle`/`icon-close`/`icon-search`/`icon-chevron-down`/`icon-star` where they fit). **Append-only** — change no existing symbol (research D9; deals C0.8).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The two mock-data catalogs, the additive `dashboard.js` shared primitives, and the link-only nav rewire of
the Spec 006 shell that ALL five pages depend on.

**⚠️ CRITICAL**: No user-story page work should begin until this phase is complete.

- [x] T003 Create `assets/data/merchant-deals.json` with **≥12** merchant deals per the M1 schema — each `id`, `title`, `destination`, `country`, `city`, `region`, `dealType` (Flight/Hotel/Package/Umrah/Honeymoon/Family/Business/Budget/Luxury), `priceBefore`, `priceFrom`, `currency`, `discountLabel`, `sourceType` (Manual Deal/Partner Link/Affiliate/API Ready/Scraped Pending Review), `providerName`, `status` (Draft/Active/Scheduled/Paused/Expired/Archived), `expiryDate`, `travelDates`, `availability`, `clicks`, `inquiries`, `couponCopies`, `rating`, `lastUpdated`, `createdBy`, `featured`, `publicUrl` (`../pages/deal-details.html?id=<id>`), `image`, `imageAlt`, `highlights`, `includedItems`, `notIncludedItems`, `terms`, `seoTitle`, `metaDescription`, `slug`. Reuse `deal-001…deal-010` ids for ≥10 records (extras → `deal-011`/`deal-012`); spread `status`/`sourceType`/`dealType`/`featured` across their enums so badges/filters/stat-cards are meaningful; all honesty-safe mock (M1; data-model §7.1/§11).
- [x] T004 [P] Create `assets/data/merchant-coupons.json` with **≥12** merchant coupons per the M2 schema — each `id`, `code` (ltr), `discountType` (Percentage/Fixed amount/Free service/Custom offer), `discountValue`, `currency` (when fixed), `provider`, `sourceType` (Manual/Affiliate/Coupon API/Scraped Pending Review), `category` (Flights/Hotels/Packages/Activities/Car Rental/Travel Insurance/Umrah/Honeymoon), `relatedDeal` (a `deal-0xx` id or null), `usageLimit`, `usedCount`, `startDate`, `expiryDate`, `status` (Draft/Active/Scheduled/Paused/Expired/Archived), `minimumBooking`, `terms`, `sourceUrl`, `affiliateUrl`, `reviewStatus`, `lastUpdated`. Reuse `coupons.json` ids/codes where a public coupon is referenced; spread the enums (incl. ≥1 Scraped Pending Review); `currency` present when Fixed amount; honesty-safe mock (M2; data-model §7.2/§11).
- [x] T005 [P] Extend `src/js/dashboard.js` (additive only): generalise the top-level guard so the module also runs for `data-page` ∈ {`merchant-deals`,`merchant-create-deal`,`merchant-edit-deal`,`merchant-coupons`,`merchant-create-coupon`} and dispatches to a per-page controller, **without altering** the Spec 006 `merchant-dashboard` controller or its helpers. Add shared primitives the new controllers reuse: a **list controller factory** (filter/search/sort over `[data-*-row]` → show/hide + reorder; result-count + removable `.filter-chip`s + `aria-live`; reset; empty-state toggle), a **bulk-selection controller** (select-all + per-row checkboxes → live selected-count + reveal bulk bar), a **confirm helper** (open a `.modal` via `TUI.modal`, resolve on confirm — for delete/archive/bulk-delete), a **repeater helper** (clone/remove a row, retain ≥1), and `slugify`/`generateCode`/`livePreview` helpers. Reuse the existing `DropdownController`, row-action-menu controller, and form-submit wrapper. No edits to `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` (research D2; deals C0.2/C4.3).
- [x] T006 Rewire (links only) the shared dashboard shell in `dashboard/index.html`: change العروض (`data-coming-soon` → `href="deals.html"`), إضافة عرض (→ `href="create-deal.html"`), الكوبونات (→ `href="coupons.html"`) in the sidebar; the topbar quick-add إضافة عرض (→ `create-deal.html`) and إنشاء كوبون (→ `create-coupon.html`); and any Spec 006 overview CTAs targeting deals/coupons (e.g., welcome/quick-action إضافة عرض جديد / إنشاء كوبون) → real `href`s. **Remove no section/layout/copy**; keep طلبات الحجز/العملاء/التحليلات/التكاملات/الإعدادات on `data-coming-soon` (research D11; FR-043; deals C4.1/coupons C3.1).

**Checkpoint**: Catalogs + `dashboard.js` shared primitives + the rewired shell ready — page work can begin (US1/US2 serialize on `deals.html`; US3–US6 pages are file-parallel; all controllers serialize on `dashboard.js`).

---

## Phase 3: User Story 1 - Manage the agency's deals from a powerful list (Priority: P1) 🎯 MVP

**Goal**: A professional deals workspace `dashboard/deals.html` — page header + CTAs, ≥10 stat mini-cards, search + 8
filters, 7 sort options, result-count + active chips, a responsive table/card hybrid of **≥12 deal rows**, empty state,
skeleton, source/status legend, and a help FAQ (≥5) — the reusable list-management pattern.

**Independent Test**: Open `dashboard/deals.html` at 360px and desktop → one `<h1>` إدارة العروض inside the Spec 006
shell (العروض active, breadcrumb لوحة التحكم / العروض); search/filter/sort narrow & reorder ≥12 rows and update the
count + chips; reset clears; zero matches → empty state; the table → stacked cards on mobile; legend + ≥5 FAQ present; no
dead controls, no browser dialog.

- [x] T007 [US1] Create the `dashboard/deals.html` scaffold: `<html lang="ar" dir="rtl" data-page="merchant-deals">`; own `<head>` from the `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo font preload, favicon, theme-color, viewport, Arabic `<title>`/meta, `robots noindex`); `.skip-link`, `#main`, `#toast-root`, `#dash-announcer`; **reuse the Spec 006 shell** (sidebar with العروض `aria-current="page"`; topbar; mobile drawer + scrim; breadcrumb لوحة التحكم / العروض; page-header region; `.dash-footer`); script order `../src/js/ui.js` → `../src/js/main.js` → `../src/js/dashboard.js` (defer); a page-scoped `<style>` placeholder; empty containers for the list sections. Do NOT inline the public header/footer (deals C0.1–C0.4; research D1).
- [x] T008 [US1] Build the **page header** + **stat mini-cards** in `dashboard/deals.html`: H1 إدارة العروض, a description, CTAs إضافة عرض جديد (`.btn-primary` → `create-deal.html`), تصدير تجريبي / استيراد تجريبي (`.btn-outline`, `data-toast` mock), a safe note (`.inline-msg-info` الإجراءات هنا واجهة أمامية فقط); and a page-scoped `.stat-grid` of ≥10 `.card`s (إجمالي العروض / النشطة / المسودات / المجدولة / الموقوفة / المنتهية / قاربت على الانتهاء / إجمالي الضغطات / طلبات الحجز / نسخ الكوبونات) with counts consistent with the rendered rows (FR-008/FR-009; deals C1.1/C1.2).
- [x] T009 [US1] Build the **search + filter panel** + **sort** in `dashboard/deals.html`: a `.search-input` (title/destination/provider) and `.field-select`/controls for status, destination/region, deal type, source type, expiry status, price range, featured-only, plus a reset control (`icon-refresh`); a sort `.field-select` (الأحدث / آخر تحديث / الأقل سعرًا / الأعلى سعرًا / الأعلى ضغطات / الأعلى طلبات / الأقرب انتهاءً); author the page-scoped `.filter-panel` style (responsive grid → one column at 360px) (FR-010; deals C1.3/C1.4).
- [x] T010 [US1] Build the **result-count + active-chips bar** and the **deals table/card hybrid** in `dashboard/deals.html`: a `.result-bar` (`.result-count-text` `aria-live="polite"` + `.filter-chip`s + reset); a `<table>` of **≥12 `<tr data-deal-row>`** (columns checkbox / title / destination / type / price `dir="ltr"` / discount / source `.badge-source-*` / status `.badge` / expiry `dir="ltr"` / clicks / inquiries / last-updated / actions `icon-more`), each row carrying `data-status`/`data-source`/`data-type`/`data-price`/`data-clicks`/`data-inquiries`/`data-expiry`/`data-updated`/`data-featured`/`data-title`/`data-destination`/`data-provider`; author the page-scoped `.dash-table` style (md+ table → stacked labeled cards via `data-label` `::before` below md, no horizontal overflow); add the branded `.empty-state` (message + reset + إضافة عرض جديد CTA, hidden until 0 matches) and a reusable `.skeleton` row pattern (FR-011/FR-012/FR-015; deals C1.5/C1.6/C1.9/C1.10; research D3).
- [x] T011 [US1] Build the **source/status legend** + **help FAQ (≥5)** in `dashboard/deals.html`: a `.card` explaining Manual Deal / Partner Link / Affiliate / API Ready / Scraped Pending Review + Draft/Active/Paused/Expired; a `<details>`/accordion FAQ (هل يتم نشر العرض فعليًا؟ / ما الفرق بين Manual وAffiliate وAPI Ready؟ / هل يمكن رفع صور حقيقية الآن؟ / هل يمكن تكرار العرض؟ / ماذا يحدث عند إيقاف العرض؟) (FR-015; deals C1.10).
- [x] T012 [US1] Implement the **`merchant-deals` list controller** in `src/js/dashboard.js` (using the T005 list-controller factory): wire the search/filters/sort to show/hide + reorder `[data-deal-row]`; update `.result-count-text` (`aria-live`) and render/remove `.filter-chip`s; reset (and chip-removal) clears filters and restores all rows; toggle the `.empty-state` when 0 rows match (FR-010/FR-011/FR-015; deals C1.5/C1.9; research D3).

**Checkpoint**: The deals list (filters/sort/search/count/chips/reset/empty + table→cards) works and is independently testable — the MVP and the reusable list pattern.

---

## Phase 4: User Story 2 - Act on a deal: row actions & bulk operations (Priority: P1)

**Goal**: Per-row action menus (view/edit/duplicate/pause-activate/featured/archive/delete) and a bulk-selection bar
(activate/pause/archive/delete/export) on `dashboard/deals.html`, with delete/archive via custom modals — making the
list a true management surface.

**Independent Test**: On `dashboard/deals.html`, a row menu offers all 7 actions; edit → `edit-deal.html?id=`, view →
`../pages/deal-details.html?id=` (or safe toast), duplicate → toast/clone, pause-activate/featured → badge toggle,
delete → custom modal removes the row; select-all + bulk activate/pause/archive/delete(modal)/export(toast) work; no dead
controls, no `confirm()`/`alert()`/`prompt()`.

- [x] T013 [US2] Add the **row action menu** + **bulk bar** + **confirm modals** markup in `dashboard/deals.html`: per-row `icon-more` trigger (`aria-haspopup`/`aria-expanded`) → a `role="menu"` with view public page (`icon-eye`) / edit (`icon-edit`) / duplicate (`icon-duplicate`) / pause-activate (`icon-pause`/`icon-play`) / mark featured (`icon-star`) / archive (`icon-archive`) / delete (`icon-trash`); a bulk bar (select-all checkbox + selected-count `aria-live` + bulk activate/pause/archive/delete/export buttons); and the delete + archive (and bulk-delete) `.modal` confirmation dialogs (FR-013/FR-014; deals C1.7/C1.8).
- [x] T014 [US2] Implement the **`merchant-deals` row/bulk behaviors** in `src/js/dashboard.js` (reusing the row-action-menu controller + the T005 bulk controller + confirm helper): edit/view = navigate (view → `../pages/deal-details.html?id=<id>` when it resolves, else safe toast); duplicate → clone the row (نسخة تجريبية) + toast; pause-activate → swap status `.badge` + `data-status` + toast; mark featured → toggle `.badge-featured` + `data-featured` + toast; archive/delete + bulk-delete → `TUI.modal` confirm then visual change/removal + toast; bulk activate/pause/archive act on checked rows; export/import → mock "تجريبي" toast; maintain the selected-count (`aria-live`). No browser dialogs; session-only (FR-013/FR-014; deals C1.7/C1.8/C1.11; research D4).

**Checkpoint**: Deals row + bulk actions work end-to-end with custom confirmations; deals.html is a complete management screen.

---

## Phase 5: User Story 3 - Create a new travel deal through a complete form (Priority: P1)

**Goal**: A professional multi-section create-deal form `dashboard/create-deal.html` — basic info, pricing, dates/
availability, source/booking, media (mock), highlights/included/not-included repeaters, terms, SEO preview, status/
visibility — plus a preview modal, sticky summary, inline validation, and save-draft/publish-mock.

**Independent Test**: Open `dashboard/create-deal.html` → H1 إضافة عرض جديد (إضافة عرض active, breadcrumb …/إضافة عرض
جديد); publish-mock with required fields empty → inline errors; valid → نشر تجريبي toast; save-draft → toast; preview
modal; repeaters add/remove (highlights ≥3); slug preview from title; source-type helper; flexible-dates + scheduled-date
conditionals; mock upload (no real file); no dead controls.

- [x] T015 [P] [US3] Create the `dashboard/create-deal.html` scaffold + **page header**: `<html … data-page="merchant-create-deal">`; own `<head>` (Arabic title/meta, `robots noindex`); **reuse the Spec 006 shell** (sidebar إضافة عرض `aria-current`; breadcrumb لوحة التحكم / العروض / إضافة عرض جديد); script order (defer); page-scoped `<style>` placeholder; H1 إضافة عرض جديد + a description + actions حفظ كمسودة / نشر تجريبي / معاينة / رجوع للعروض (`href="deals.html"`) + a safe note (لا يتم حفظ العرض على خادم في هذه النسخة) (FR-016; deals C0.1–C0.4/C2.1).
- [x] T016 [US3] Build form **sections 1–6** in `dashboard/create-deal.html` with `.field*` components: basic information (title* / dealType* / destination* / country / city / region / shortDescription* / fullDescription), pricing (currency / priceBefore / priceFrom* / discountType / discountValue / taxes / payment / deposit), travel dates & availability (start / end / bookingDeadline / expiry* / availability / flexible-dates toggle / note), source & booking link (sourceType* / provider / booking-affiliate URL / source URL / notes / manual-review toggle + conditional-helper-text placeholders), media mock-upload (cover/gallery placeholders, alt text, remove/replace, preview), and the highlights **repeater** (≥3 initial rows) with a page-scoped repeater style (FR-017/FR-018/FR-019/FR-020/FR-021; deals C2.2).
- [x] T017 [US3] Build form **sections 7–10 + preview + summary** in `dashboard/create-deal.html`: included-items & not-included **repeaters**; terms (cancellation / refund / important notes / child policy / visa-insurance); SEO preview (SEO title / meta description / slug + slug-preview + public-URL preview); status & visibility (status Draft/Active/Scheduled, featured toggle, visible-on-homepage toggle, conditional schedule-publish date); a **preview modal** (`.modal`: title/destination/price/source badge/CTA); and a page-scoped sticky **action summary** (completion/missing-required + save-draft + publish-mock) (FR-021/FR-022/FR-023; deals C2.2/C2.4).
- [x] T018 [US3] Implement the **`merchant-create-deal` controller** in `src/js/dashboard.js`: `TUI.validateForm` for required fields (title/dealType/destination/shortDescription/priceFrom/expiryDate/sourceType) with `aria-invalid`/`aria-describedby`; publish-mock → validate → نشر تجريبي toast (no real-publish claim); save-draft → toast; repeater add/remove (retain ≥1); slug auto-generate/preview from the title (+ public-URL preview, overridable); source-type → conditional helper text (+ scraped review notice); flexible-dates + status=Scheduled conditionals; mock media upload → preview / "لا يتم رفع ملفات حقيقية الآن" toast (no real upload); preview-modal open (FR-018–FR-023; deals C2.3/C2.5/C2.6; research D5).

**Checkpoint**: The create-deal form validates, repeats, previews, and handles conditionals — independently testable.

---

## Phase 6: User Story 4 - Edit an existing deal with its history in view (Priority: P2)

**Goal**: A prefilled edit-deal form `dashboard/edit-deal.html` reusing the create-deal sections, plus an edit header,
an activity mini-log (≥5), a public-preview link, and edit actions (save/duplicate/archive/pause/delete) — with `?id`
selection and a default-deal fallback.

**Independent Test**: Open `dashboard/edit-deal.html` (and `?id=deal-003`) → H1 تعديل العرض (العروض active, breadcrumb
…/تعديل العرض); form **prefilled**; unknown `?id` → default deal (no 404); edit header + ≥5-event activity log +
public-preview link; save-changes/save-draft → toast; duplicate → toast; pause-activate → status toggle; archive & delete
→ custom modal; all create-form interactions work; no dead controls.

- [x] T019 [P] [US4] Create `dashboard/edit-deal.html`: `<html … data-page="merchant-edit-deal">`; own `<head>`; **reuse the Spec 006 shell** (sidebar العروض `aria-current`; breadcrumb لوحة التحكم / العروض / تعديل العرض); script order (defer); H1 تعديل العرض + page header. Reuse **all create-deal form sections (4.1–4.10) prefilled** with a realistic default deal authored as **static HTML** (renders without JS); embed an inline `<script type="application/json" id="merchant-deals-data">` mirroring `merchant-deals.json` (reuse `deal-001…deal-010`) for `?id` enhancement (FR-024; deals C3.1/C3.2; research D6).
- [x] T020 [US4] Add the **edit-only sections + actions** in `dashboard/edit-deal.html`: an **edit header** (reference / current status `.badge` / last-updated / created-by / public URL / clicks / inquiries — static mock); an **activity mini-log** of ≥5 events (created / updated price / status changed / coupon attached / inquiry received — icon + text + relative time); a **public-preview link** (`href="../pages/deal-details.html?id=<id>"`); the **edit actions** (save changes / save as draft / preview / duplicate / archive / pause-activate / delete / back-to-deals → `deals.html`); and the archive + delete `.modal` confirmation dialogs (FR-025/FR-026; deals C3.3–C3.6).
- [x] T021 [US4] Implement the **`merchant-edit-deal` controller** in `src/js/dashboard.js`: on load read `?id` → prefill the form fields from the inline JSON (fallback to the static default deal if missing/unknown — never error/404); reuse the create-deal interactions (validate / repeaters / slug / conditional fields / mock upload / preview); save-changes & save-draft → toast (no server-save claim); duplicate → toast; pause-activate → toggle the header status badge; archive & delete → `TUI.modal` confirm then toast (delete MAY navigate to `deals.html`); public-preview link → navigate or safe toast if id unknown (FR-024/FR-026; deals C3.2/C3.6; research D6).

**Checkpoint**: Edit-deal is prefilled, `?id`-aware with a safe fallback, and its edit actions + history work — independently testable.

---

## Phase 7: User Story 5 - Manage coupons: list, copy, row & bulk actions (Priority: P2)

**Goal**: A coupons workspace `dashboard/coupons.html` mirroring the deals list — page header + CTAs, ≥9 stat mini-cards,
search + 9 filters, 5 sort options, result-count + chips, a responsive table/card hybrid of **≥12 coupon rows** (code
`dir="ltr"`), row menus (incl. copy code), a bulk bar, empty state, skeleton, coupon-source explanation, and FAQ (≥5).

**Independent Test**: Open `dashboard/coupons.html` at 360px and desktop → H1 إدارة الكوبونات (الكوبونات active,
breadcrumb لوحة التحكم / الكوبونات); search/filter/sort/reset over ≥12 rows update count + chips; copy-code copies +
toasts; row menu (copy/edit/duplicate/pause-activate/view-public/delete) and bulk (activate/pause/delete(modal)/
export(toast)) work; codes shown `dir="ltr"`; table → cards on mobile; source explanation + ≥5 FAQ; no dead controls, no
browser dialog.

- [x] T022 [P] [US5] Create the `dashboard/coupons.html` scaffold + **page header** + **stat mini-cards**: `<html … data-page="merchant-coupons">`; own `<head>` (`robots noindex`); **reuse the Spec 006 shell** (sidebar الكوبونات `aria-current`; breadcrumb لوحة التحكم / الكوبونات); script order (defer); page-scoped `<style>` placeholder; H1 إدارة الكوبونات + description + CTAs إنشاء كوبون (`.btn-primary` → `create-coupon.html`) / تصدير-استيراد تجريبي (`data-toast`) + safe note; a `.stat-grid` of ≥9 `.card`s (إجمالي الكوبونات / النشطة / المسودات / المجدولة / الموقوفة / المنتهية / مرات النسخ / الاستخدام التجريبي / قاربت على الانتهاء) consistent with the rendered rows (FR-027/FR-028; coupons C0.1–C0.4/C1.1/C1.2).
- [x] T023 [US5] Build the **search + filters + sort + result-bar + coupons table/card hybrid** in `dashboard/coupons.html`: search (code/provider/deal) + filters for status / discount type / provider / source type / category / related deal / expiry / usage limit + reset; sort (الأحدث / الأقرب انتهاءً / الأكثر نسخًا / الأعلى استخدامًا / الخصم الأعلى); a `.result-bar` (`aria-live` + chips + reset); a `<table>` of **≥12 `<tr data-coupon-row>`** (columns checkbox / code `dir="ltr"` / discount / provider / category / source `.badge-source-*` / related deal / usage limit / used count / expiry / status `.badge` / actions), each carrying `data-status`/`data-source`/`data-discount-type`/`data-provider`/`data-category`/`data-related`/`data-expiry`/`data-used`/`data-copies`/`data-code`; reuse the `.dash-table` (table → cards) + `.filter-panel` styles; add the `.empty-state` (message + reset + إنشاء كوبون CTA) + a `.skeleton` pattern (FR-029/FR-030/FR-032; coupons C1.3–C1.6/C1.9/C1.10; research D3).
- [x] T024 [US5] Build the **row action menu** + **bulk bar** + **source explanation** + **FAQ** + **delete modal** in `dashboard/coupons.html`: per-row menu copy code (`data-copy`/`icon-copy`) / edit (mock-modal or `data-coming-soon`) / duplicate / pause-activate / view public coupon-deal (`href`/safe toast) / delete; a bulk bar (select-all + count `aria-live` + activate/pause/delete/export); a coupon-source explanation `.card` (Manual / Affiliate / Coupon API / Scraped Pending Review + why review is required); a ≥5-item FAQ (هل الكوبون يعمل فعليًا الآن؟ / هل يمكن ربطه بعرض معين؟ / هل يمكن نسخه من الموقع العام؟ / ما معنى Coupon API؟ / هل الكوبونات المسحوبة Scraped تنشر تلقائيًا؟); and the delete `.modal` (FR-031/FR-032; coupons C1.7/C1.8/C1.10).
- [x] T025 [US5] Implement the **`merchant-coupons` controller** in `src/js/dashboard.js` (reusing the T005 list + bulk + confirm primitives and the row-menu controller): filter/search/sort over `[data-coupon-row]` → show/hide + reorder + count + chips (`aria-live`) + reset + empty-state toggle; copy-code via `copyToClipboard`/`data-copy` + toast; duplicate → clone/toast; pause-activate → status badge swap + toast; delete + bulk-delete → `TUI.modal` confirm → remove + toast; bulk activate/pause; export/import → mock toast; selected-count (`aria-live`) (FR-029/FR-031/FR-032; coupons C1.6/C1.7/C1.8/C1.11; research D3/D4).

**Checkpoint**: The coupons list (filters/sort/search + copy + row/bulk actions) works on desktop and mobile — independently testable; proves the list pattern reused on a second data type.

---

## Phase 8: User Story 6 - Create a coupon with a live preview (Priority: P2)

**Goal**: A multi-section create-coupon form `dashboard/create-coupon.html` — basic info (generate-code/copy), discount,
usage rules, source (scraped warning), terms, status/visibility, a live coupon preview card, and SEO/public display —
with inline validation and conditional fields.

**Independent Test**: Open `dashboard/create-coupon.html` → H1 إنشاء كوبون (الكوبونات active, breadcrumb …/إنشاء كوبون);
generate-random-code fills the code field (no `prompt()`); copy copies + toasts; Fixed amount → currency field; Scraped
Pending Review → warning; Scheduled → date; the live preview card (code `dir="ltr"`) updates; publish-mock validates;
save-draft → toast; no dead controls.

- [x] T026 [P] [US6] Create the `dashboard/create-coupon.html` scaffold + **page header**: `<html … data-page="merchant-create-coupon">`; own `<head>` (`robots noindex`); **reuse the Spec 006 shell** (sidebar الكوبونات `aria-current`; breadcrumb لوحة التحكم / الكوبونات / إنشاء كوبون); script order (defer); page-scoped `<style>` placeholder; H1 إنشاء كوبون + description + actions حفظ كمسودة / نشر تجريبي / معاينة / رجوع للكوبونات (`href="coupons.html"`) + safe note (لا يتم حفظ الكوبون على خادم في هذه النسخة) (FR-033; coupons C0.1–C0.4/C2.1).
- [x] T027 [US6] Build the **form sections + live preview** in `dashboard/create-coupon.html` with `.field*`: basic info (code* `dir="ltr"` + generate-random-code button `icon-wand` + copy `data-copy`/`icon-copy`; provider; category* [Flights/Hotels/Packages/Activities/Car Rental/Travel Insurance/Umrah/Honeymoon]; related-deal select; short description); discount (type* [Percentage/Fixed amount/Free service/Custom offer]; value*; currency [conditional, Fixed amount]; minimum booking; max discount); usage rules (start; expiry*; usage limit; per-user limit; first-booking-only toggle; new-customers-only toggle; selected destinations); source (type* [Manual/Affiliate/Coupon API/Scraped Pending Review]; source URL; affiliate URL; review status; manual-review toggle; notes; a `.inline-msg-warning` placeholder "لا يتم نشر أي كوبون مجمّع تلقائيًا قبل المراجعة"); terms (terms/exclusions/notes); status & visibility (status Draft/Active/Scheduled; visible-on-public toggle; featured toggle; conditional schedule date); a page-scoped `.coupon-preview` **live card** (discount / code `dir="ltr"` / provider / source badge / expiry / copy-button preview); and SEO/public display (public title / meta / slug preview) (FR-034–FR-037; coupons C2.2/C2.5).
- [x] T028 [US6] Implement the **`merchant-create-coupon` controller** in `src/js/dashboard.js`: generate-random-code → write a code into the field (no `prompt()`); copy → `copyToClipboard` + toast; `TUI.validateForm` for required fields (code/category/discountType/discountValue/expiryDate; currency when Fixed amount) with `aria-invalid`/`aria-describedby`; publish-mock → validate → نشر تجريبي toast (no real-activation claim); save-draft → toast; discount type = Fixed amount → reveal currency; source type = Scraped Pending Review → show the warning + review controls; status = Scheduled → reveal schedule date; update the live preview card on every relevant input (FR-034–FR-038; coupons C2.3/C2.4/C2.5/C2.6; research D5/D7).

**Checkpoint**: The create-coupon form generates/copies codes, validates, handles conditionals + the scraped warning, and live-updates the preview — independently testable.

---

## Phase 9: Polish & Cross-Cutting Concerns (QA gate)

**Purpose**: Accessibility/responsive/honesty/SEO passes across all five pages, the hard stack gate, non-regression
(incl. the Spec 006 overview), and the QA artifact.

- [x] T029 [P] **Accessibility pass** on all five pages + `src/js/dashboard.js`: keyboard operability + visible focus for every control (filters/search/sort/reset, chips, table checkboxes + select-all, row action menus, bulk buttons, confirm modals with managed focus + Escape, copy controls, every form field, repeater add/remove, generate-code, mock-upload, preview modal, status/visibility toggles, edit/archive/delete/duplicate/pause-activate, public-preview); `aria-current` on the active nav; `aria-expanded`/`aria-controls` on menu triggers; `aria-invalid`/`aria-describedby` on invalid fields; `aria-checked`/`aria-pressed` on toggles; `aria-live` for result-count/selection-count; reduced-motion respected. Run axe per page → 0 AA violations (FR-049; SC-016).
- [x] T030 [P] **Responsive pass**: verify each of the five pages at 360px has no horizontal scroll (sidebar→drawer, topbar usable, stat grid + filter panel + form grid reflow to one column, tables → stacked labeled cards, sticky summary stacks, touch targets ≥ ~44px), and that flipping to `dir="ltr" lang="en"` mirrors the shell/filter/table/form/preview with no structural breakage (FR-047/FR-048; SC-012).
- [x] T031 [P] **Honesty/copy audit** of the five pages + `merchant-deals.json`/`merchant-coupons.json`: every page surfaces ≥1 safe note; coupon codes are `dir="ltr"`; no copy claims a real publish, database save, file/image upload, validated/guaranteed coupon or link, connected API, active scraping source, payment, sent notification, or a coupon active on a live system; affiliate/source URLs framed configuration-ready; Scraped Pending Review carries the manual-review notice (FR-042; SC-011; M4).
- [x] T032 [P] **SEO/semantics pass** on the five pages: exactly one `<h1>` each with the specified Arabic heading, correct heading hierarchy, the Arabic `<title>`/meta description, the dashboard breadcrumb, `robots noindex`; any optional `BreadcrumbList` JSON-LD is valid and consistent with the visible mock content (FR-050; SC-015).
- [x] T033 [P] **Stack-compliance hard gate**: `grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" --include=*.html --include=*.js --include=*.css . | grep -v node_modules` returns no matches, **and** `grep -RInE "chart\.js|chartjs|apexcharts|highcharts|echarts|d3\.|recharts|plotly|datatables|ag-grid|tabulator" dashboard/ src/js/dashboard.js` returns no matches; `npm run build` regenerates cleanly; `npx html-validate dashboard/deals.html dashboard/create-deal.html dashboard/edit-deal.html dashboard/coupons.html dashboard/create-coupon.html` → 0 errors; `npx prettier --check "src/js/dashboard.js" "dashboard/*.html"`; zero external CDN requests and zero console errors on all five pages (FR-005; SC-014).
- [x] T034 Confirm **non-regression**: `git diff` shows `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`, `src/js/member.js`, `partials/header.html`, `partials/footer.html`, and the public/member `pages/` are unchanged; the Spec 006 `merchant-dashboard` controller in `dashboard.js` is unchanged; `assets/icons/sprite.svg` edits are append-only; `tailwind.config.js` is unchanged; the Spec 006 `dashboard/index.html` change is **links-only** (its sections/layout/copy preserved); the Spec 001 styleguide/components, Spec 002 homepage, Spec 003/004/005 pages, and the Spec 006 overview still render with no console errors (FR-003; SC-018; deals C4.3/coupons C3.3).
- [x] T035 Produce `specs/007-merchant-deals-coupons/qa-results.md` documenting every gate result: `npm run build` pass; `html-validate` of all five pages pass; the two stack/chart-table greps = 0; zero external CDN; zero console errors; 360px no-overflow; RTL correct + LTR structural integrity; one `<h1>` + heading hierarchy per page; dashboard relative paths work from `/dashboard/`; shell consistency with Spec 006 + correct sidebar active states; mobile drawer + topbar dropdowns; deals filters/sort/search + row + bulk actions; create-deal validation + repeaters + preview; edit-deal prefill + `?id` fallback + archive/delete confirmations; coupons filters/sort/search + copy + row/bulk actions; create-coupon validation + generate-code + source-type conditional warning; delete/archive via custom modals; non-regression of Specs 001–006 (incl. the Spec 006 overview); and honesty of copy (SC-001–SC-019).

**Checkpoint**: All constitution/QA gates green; the five pages are client-presentable and ship with `qa-results.md`.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: T001 first (baseline). T002 (sprite) is `[P]` (distinct file).
- **Foundational (Phase 2)**: depends on Setup. T003 then T004 ∥ T005 are `[P]` (distinct files: two JSON catalogs +
  `dashboard.js`). T006 (rewire `index.html`) is independent (`dashboard/index.html`). **Blocks all user stories.**
- **User Stories (Phases 3–8)**: all depend on Foundational.
  - **US1 → US2** edit the **same file** (`deals.html`) + the **shared** `dashboard.js` → run in order (US1 then US2).
  - **US3 / US4 / US5 / US6** build **distinct HTML files** → their page tasks are file-parallel with each other and with
    US1/US2's HTML; but every story's **`dashboard.js` controller task** (T012, T014, T018, T021, T025, T028) edits the
    one shared module → serialize those (see Shared-file note).
- **Polish (Phase 9)**: depends on the pages existing. T029–T033 are `[P]` (independent audits/localized fixes); T034
  (non-regression) and T035 (qa-results) come last.

### User-story dependencies

- **US1 (P1)** — depends only on Foundational. Independently testable (the deals list). 🎯 MVP.
- **US2 (P1)** — depends on Foundational + US1 (adds actions to `deals.html`). Independently testable (row/bulk actions).
- **US3 (P1)** — depends on Foundational; independent of the others (its own file `create-deal.html`).
- **US4 (P2)** — depends on Foundational + the US3 form pattern (reused, prefilled in `edit-deal.html`); independently
  testable.
- **US5 (P2)** — depends on Foundational; independent of the others (its own file `coupons.html`).
- **US6 (P2)** — depends on Foundational; independent of the others (its own file `create-coupon.html`).

### Shared-file note (serialization points)

- **`src/js/dashboard.js`** is extended by T005 (skeleton + shared primitives) then by the six controller tasks T012
  (deals list), T014 (deals row/bulk), T018 (create-deal), T021 (edit-deal), T025 (coupons), T028 (create-coupon) →
  different blocks of **one** file → keep them **sequential** (not `[P]` with each other) or coordinate merges per block.
  The Spec 006 `merchant-dashboard` controller is never touched.
- **`dashboard/deals.html`** is authored by T007 (scaffold) then T008–T011 (US1) and T013 (US2) → different regions of
  **one** file → sequential.
- **`dashboard/index.html`** is edited once (T006, links only).
- The **other four pages** (`create-deal.html`, `edit-deal.html`, `coupons.html`, `create-coupon.html`) and the **two
  catalogs** + **sprite** are distinct files → genuinely parallel where marked `[P]`.

### Parallel opportunities

- Setup: T002 ∥ (after) T001.
- Foundational: T003 → T004 ∥ T005; T006 independent.
- Page scaffolds across stories: T015 (create-deal) ∥ T019 (edit-deal) ∥ T022 (coupons) ∥ T026 (create-coupon) — distinct
  files (their `dashboard.js` controller tasks still serialize).
- Polish: T029 ∥ T030 ∥ T031 ∥ T032 ∥ T033, then T034 → T035.

---

## Parallel Example: page scaffolds (after Foundational)

```bash
# Distinct HTML files — safe to scaffold in parallel:
Dev A → dashboard/deals.html        (T007 → T008–T011)   # US1 list
Dev B → dashboard/create-deal.html  (T015 → T016–T017)   # US3 form
Dev C → dashboard/edit-deal.html    (T019 → T020)        # US4 form
Dev D → dashboard/coupons.html      (T022 → T023–T024)   # US5 list
Dev E → dashboard/create-coupon.html(T026 → T027)        # US6 form
# Then one owner adds each page's controller block to the shared src/js/dashboard.js
# in sequence: T012 → T014 → T018 → T021 → T025 → T028.
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational (CRITICAL — blocks all stories).
2. Phase 3 US1 (the deals list: header + stat cards + filters/sort + table ≥12 rows + empty/skeleton + legend + FAQ +
   the list controller).
3. **STOP & VALIDATE**: search/filter/sort/reset narrow the rows + update count/chips; empty state; table → cards at
   360px; no dead controls.
4. Demo the MVP (the deals management list + the reusable list pattern).

### Incremental delivery

1. Setup + Foundational → catalogs + `dashboard.js` primitives + rewired shell ready.
2. US1 (deals list) → test → demo (MVP).
3. US2 (deals row + bulk actions) → test → demo (deals management complete).
4. US3 (create deal) → test → demo.
5. US4 (edit deal) → test → demo (deal lifecycle complete).
6. US5 (coupons list) → test → demo.
7. US6 (create coupon) → test → demo (coupons lifecycle complete).
8. Polish/QA gate + `qa-results.md` → ship the five client-presentable pages.

### Parallel team strategy

1. Team completes Setup + Foundational together (catalogs + `dashboard.js` skeleton + the `index.html` rewire).
2. Split the five pages across developers (distinct HTML files — see Parallel Example); one owner serialises the
   per-page controller blocks into the shared `src/js/dashboard.js` (T012 → T014 → T018 → T021 → T025 → T028).
3. Reviewers pick up the `[P]` Polish audits as each page lands; finish with non-regression + `qa-results.md`.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task. `[Story]` maps a task to its user story.
- This feature delivers **five pages** + an **additive extension** of one module; the per-page controller tasks all edit
  the shared `dashboard.js` (serialize), while the five HTML files are distinct (parallel) — see the Shared-file note.
- Reuse existing components/utilities + the **Spec 006 shell**; do **not** modify `main.js`/`ui.js`/`discovery.js`/
  `content.js`/`member.js`, `partials/header.html`/`footer.html`, `pages/`, or the Spec 006 `merchant-dashboard`
  controller; do not remove any Spec 006 overview section (rewire links only); introduce no new visual identity (only a
  small page-scoped `<style>` per page) and no chart/table library; make **no `tailwind.config.js` change**.
- Confirmations + generate-code use `.modal`/`TUI.modal` + field writes — no `alert()`/`confirm()`/`prompt()`. The seven
  still-unbuilt merchant pages use `data-coming-soon` (no 404; files not created). State is frontend/session-only; keep
  mock data believable and consistent (reuse `deals.json`/`coupons.json` ids); never imply a real publish, save, upload,
  validation, API, scraping, payment, or notification.
- Commit after each task or logical group. Stop at any checkpoint to validate a story independently.
