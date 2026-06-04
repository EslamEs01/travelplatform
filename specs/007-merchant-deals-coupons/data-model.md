# Phase 1 Data Model: Merchant Deals + Coupons Management

**Feature**: `007-merchant-deals-coupons` | **Date**: 2026-06-02

No backend data. The "model" here is the **page inventory + per-section inventory** for the five pages, the
**mock-content schemas** (new + reused), the **interaction map** (which control fires which existing `window.TUI` action,
`main.js` `data-*` behavior, or new `dashboard.js` controller behavior), the **frontend-only form models** (with
validation rules), and the **structured-data** notes. All values are realistic, clearly-mock, and never imply a real
publish, save, upload, coupon/link validation, connected API, active scraping source, payment, notification, or a coupon
active on a live system (Constitution IX; spec product-honesty). Every page reuses the **Spec 006 dashboard shell**
verbatim (research D1) and authors its own `<head>` from the `partials/head.html` conventions; rows/cards/fields are
static HTML carrying `data-*` so the enhancement layer (an additive extension of `dashboard.js`, research D2) acts on
the DOM with no fetch (research D3). All management state is frontend/session-only; reload restores mock defaults.

---

## 1. Page Inventory

| Page | `data-page` | H1 | Active sidebar | Breadcrumb | Role | Primary data |
|------|-------------|----|----------------|------------|------|--------------|
| `dashboard/deals.html` | `merchant-deals` | إدارة العروض | العروض | لوحة التحكم / العروض | Deals list/management | `merchant-deals.json` (≥12); reuse `deals.json` ids |
| `dashboard/create-deal.html` | `merchant-create-deal` | إضافة عرض جديد | إضافة عرض | لوحة التحكم / العروض / إضافة عرض جديد | Create-deal form | field vocab from `merchant-deals.json` |
| `dashboard/edit-deal.html` | `merchant-edit-deal` | تعديل العرض | العروض | لوحة التحكم / العروض / تعديل العرض | Edit-deal form (prefilled) | `merchant-deals.json` / `deals.json` (`?id`) |
| `dashboard/coupons.html` | `merchant-coupons` | إدارة الكوبونات | الكوبونات | لوحة التحكم / الكوبونات | Coupons list/management | `merchant-coupons.json` (≥12); reuse `coupons.json` ids |
| `dashboard/create-coupon.html` | `merchant-create-coupon` | إنشاء كوبون | الكوبونات | لوحة التحكم / الكوبونات / إنشاء كوبون | Create-coupon form | field vocab from `merchant-coupons.json` |

Each page sets `<html lang="ar" dir="rtl" data-page="…">`, authors its own `<head>` from the `partials/head.html`
conventions (CSS `../assets/css/tailwind.css`, Cairo font preload, favicon, theme-color, viewport, Arabic title/meta,
`robots noindex`), reuses the **Spec 006 app shell** (NOT `partials/header.html`/`footer.html`), loads `../src/js/ui.js`
→ `../src/js/main.js` → `../src/js/dashboard.js` (defer), and includes a small page-scoped `<style>` for the page-
specific primitives (stat grid / filter panel / responsive table→cards / bulk bar / sticky summary / preview / repeaters).
Exactly one `<h1>` per page (the page-header title); section headings `<h2>`; card/sub-section titles `<h3>`.

### Still-unbuilt merchant pages (navigation prepared, coming-soon only — NOT created)

`dashboard/bookings.html`, `booking-details.html`, `customers.html`, `customer-details.html`, `analytics.html`,
`integrations.html`, `settings.html` — every reference uses `data-coming-soon` (research D11). The now-built
deals/create-deal/edit-deal/coupons/create-coupon links are real (research D11; FR-043).

---

## 2. Shared Shell (reused from Spec 006 — research D1)

| # | Region | Per-page variation | Reused pattern |
|---|--------|--------------------|----------------|
| S1 | Skip link + `#main` landmark + `#toast-root` + `#dash-announcer` (`aria-live`) | — | `.skip-link`; `#toast-root`; the Spec 006 announcer |
| S2 | **Sidebar** (desktop fixed; mobile drawer) | active item: العروض (deals/edit-deal) · إضافة عرض (create-deal) · الكوبونات (coupons/create-coupon) | `.dash-sidebar`; nav links rewired: العروض→`deals.html`, إضافة عرض→`create-deal.html`, الكوبونات→`coupons.html`; طلبات الحجز/العملاء/التحليلات/التكاملات/الإعدادات stay `data-coming-soon`; العودة للموقع→`../pages/index.html` |
| S3 | Sidebar **drawer scrim** (mobile) | — | `.dash-scrim` + `dashboard.js`/`TUI.drawer` |
| S4 | **Topbar** | breadcrumb/current-area reflects the page | `.dash-topbar`: mobile-menu button, breadcrumb, company-switcher placeholder, global search, notifications/quick-add/user dropdowns; quick-add إضافة عرض→`create-deal.html`, إنشاء كوبون→`create-coupon.html` |
| S5 | **Breadcrumb** | per-page trail (see §1) | `.breadcrumb` |
| S6 | **Page header** | per-page title/description/actions/safe note | page-scoped header region; carries the single `<h1>` |
| S7 | **Page content** | the per-page sections (§3–§7) | — |
| S8 | **Dashboard footer** | — | `.dash-footer`: platform name, frontend-only note, copyright, link → `../pages/index.html`, `data-year` |
| — | Topbar **dropdown menus** + **delete/archive confirm modals** + **deal preview modal** | per-page | `DropdownController`, `.modal` + `TUI.modal` |
| — | Reusable **skeleton** + **empty-state** patterns | per list page | `.skeleton*`, `.empty-state` |

---

## 3. Section Inventory — `deals.html` (merchant-deals)

| § | Section | Reused patterns / notes |
|---|---------|-------------------------|
| 3.1 | **Page header** (FR-008) | `<h1>` إدارة العروض; description; CTAs: إضافة عرض جديد (`.btn-primary`→`create-deal.html`), تصدير تجريبي / استيراد تجريبي (`.btn-outline`→mock toast); safe note `.inline-msg-info` (الإجراءات هنا واجهة أمامية فقط) |
| 3.2 | **Stat mini-cards** (FR-009) | page-scoped `.stat-grid` of `.card`s (≥10): إجمالي العروض / النشطة / المسودات / المجدولة / الموقوفة / المنتهية / قاربت على الانتهاء / إجمالي الضغطات / طلبات الحجز / نسخ الكوبونات — value + icon + "تجريبية" |
| 3.3 | **Search + filters** (FR-010) | page-scoped `.filter-panel` `.card`: `.search-input` (title/destination/provider) + `.field-select`/controls for status, destination/region, deal type, source type, expiry status, price range, featured-only + reset (`.btn-ghost`, `icon-refresh`) |
| 3.4 | **Sort** (FR-010) | `.field-select`: الأحدث / آخر تحديث / الأقل سعرًا / الأعلى سعرًا / الأعلى ضغطات / الأعلى طلبات / الأقرب انتهاءً |
| 3.5 | **Result-count + active chips** (FR-011) | `.result-bar`: `.result-count-text` (`aria-live="polite"`) + `.filter-chip` (removable) per active filter + reset |
| 3.6 | **Deals table/card hybrid** (FR-012) | page-scoped `.dash-table` (Spec 006 pattern); **≥12 `<tr data-deal-row>`**; columns: checkbox / title / destination / type / price (`dir="ltr"`) / discount / source `.badge-source-*` / status `.badge` / expiry (`dir="ltr"`) / clicks / inquiries / last-updated / actions (`icon-more`). `data-*`: status/source/type/price/clicks/inquiries/expiry/updated/featured/title/destination/provider. md+ table → stacked labeled cards below md |
| 3.7 | **Row action menu** (FR-013) | `role="menu"`: view public page (`href="../pages/deal-details.html?id="`/safe toast, `icon-eye`) / edit (`href="edit-deal.html?id="`, `icon-edit`) / duplicate (`icon-duplicate`) / pause-activate (`icon-pause`/`icon-play`) / mark featured (`icon-star`) / archive (`icon-archive`, modal) / delete (`icon-trash`, modal) |
| 3.8 | **Bulk bar** (FR-014) | select-all + per-row checkbox → live selected-count (`aria-live`); bulk activate / pause / archive / delete (modal) / export (mock toast) |
| 3.9 | **Empty state** (FR-015) | `.empty-state`: message + reset-filters + إضافة عرض جديد CTA (shown when 0 rows match) |
| 3.10 | **Skeleton pattern** (FR-015) | `.skeleton` table-row/card pattern (reusable; MAY be hidden) |
| 3.11 | **Source/status legend** (FR-015) | `.card`: Manual Deal / Partner Link / Affiliate / API Ready / Scraped Pending Review + Draft/Active/Paused/Expired badges explained |
| 3.12 | **Help FAQ (≥5)** (FR-015) | `<details>`/accordion: هل يتم نشر العرض فعليًا؟ / ما الفرق بين Manual وAffiliate وAPI Ready؟ / هل يمكن رفع صور حقيقية الآن؟ / هل يمكن تكرار العرض؟ / ماذا يحدث عند إيقاف العرض؟ |

## 4. Section Inventory — `create-deal.html` (merchant-create-deal) & `edit-deal.html` (merchant-edit-deal)

Both pages share the form sections (FR-016–FR-023 / FR-024). `edit-deal.html` adds the edit-only sections (§4.E) and is
**prefilled** (research D6).

| § | Section | Fields / notes |
|---|---------|----------------|
| 4.0 | **Page header** | `<h1>` (إضافة عرض جديد / تعديل العرض); description; actions: حفظ كمسودة / نشر تجريبي / معاينة / رجوع للعروض (`href="deals.html"`); safe note (لا يتم حفظ العرض على خادم في هذه النسخة) |
| 4.1 | **Basic information** | title* (`.field-input`), deal type* (`.field-select`: Flight/Hotel/Package/Umrah/Honeymoon/Family/Business/Budget/Luxury), destination* , country, city, region, short description* (`.field-textarea`), full description (`.field-textarea`) |
| 4.2 | **Pricing** | currency, price before, price-from* , discount type (percentage/fixed/custom label), discount value, taxes/fees note, payment note, deposit note |
| 4.3 | **Travel dates & availability** | start date, end date, booking deadline, expiry date* , seats/rooms, flexible-dates toggle (`.field-check`/`role="switch"`), availability note |
| 4.4 | **Source & booking link** | source type* (`.field-select`: Manual Deal/Partner Link/Affiliate/API Ready/Scraped Pending Review), provider name, booking/affiliate URL, source URL, source notes, manual-review toggle; **conditional helper text** (configuration-ready, no link validation now; Scraped → review notice) |
| 4.5 | **Media (mock)** | cover-image placeholder, gallery placeholder, image alt text, remove/replace, preview placeholder; upload → preview/"لا يتم رفع ملفات حقيقية الآن" toast; no real upload |
| 4.6 | **Highlights (repeater)** | ≥3 initial rows; add/remove; `icon-plus`/`icon-trash` |
| 4.7 | **Included / Not-included (repeaters)** | two lists; add/remove rows; retain ≥1 each |
| 4.8 | **Terms** | cancellation, refund, important notes, child policy, visa/insurance note |
| 4.9 | **SEO preview** | SEO title, meta description, slug (+ slug preview + public-URL preview; auto-generated from title, overridable) |
| 4.10 | **Status & visibility** | status (Draft/Active/Scheduled), featured toggle, visible-on-homepage toggle, conditional schedule-publish date (when Scheduled) |
| 4.11 | **Preview modal** | `.modal` (`TUI.modal`): card preview — title, destination, price, source badge, CTA |
| 4.12 | **Sticky action summary** | page-scoped `.form-summary` (`position: sticky` on lg+): completion/missing-required, current status, save-draft, publish-mock |
| **4.E** | **(edit-deal only) edit header** (FR-025) | reference, current status `.badge`, last-updated, created-by, public URL, clicks, inquiries (static mock) |
| **4.E** | **(edit-deal only) activity mini-log (≥5)** (FR-025) | created / updated price / status changed / coupon attached / inquiry received — icon + text + relative time |
| **4.E** | **(edit-deal only) public-preview link** (FR-026) | `href="../pages/deal-details.html?id=<id>"` (navigate) or safe toast if id unknown |
| **4.E** | **(edit-deal only) edit actions** (FR-026) | save changes / save as draft / preview / duplicate (toast) / archive (modal) / pause-activate (toggle) / delete (modal) / back-to-deals (`deals.html`) |

## 5. Section Inventory — `coupons.html` (merchant-coupons)

| § | Section | Reused patterns / notes |
|---|---------|-------------------------|
| 5.1 | **Page header** (FR-027) | `<h1>` إدارة الكوبونات; description; CTAs: إنشاء كوبون (`.btn-primary`→`create-coupon.html`), تصدير/استيراد تجريبي (mock toast); safe note |
| 5.2 | **Stat mini-cards** (FR-028) | `.stat-grid` (≥9): إجمالي الكوبونات / النشطة / المسودات / المجدولة / الموقوفة / المنتهية / مرات النسخ / الاستخدام التجريبي / قاربت على الانتهاء |
| 5.3 | **Search + filters** (FR-029) | search (code/provider/deal) + status / discount type / provider / source type / category / related deal / expiry / usage limit + reset |
| 5.4 | **Sort** (FR-029) | الأحدث / الأقرب انتهاءً / الأكثر نسخًا / الأعلى استخدامًا / الخصم الأعلى |
| 5.5 | **Result-count + active chips** (FR-029) | `.result-bar` + `aria-live` + removable chips + reset |
| 5.6 | **Coupons table/card hybrid** (FR-030) | `.dash-table`; **≥12 `<tr data-coupon-row>`**; columns: checkbox / code (`dir="ltr"`) / discount / provider / category / source `.badge-source-*` / related deal / usage limit / used count / expiry / status `.badge` / actions. md+ table → cards below md |
| 5.7 | **Row action menu** (FR-031) | copy code (`data-copy`, `icon-copy`) / edit (mock-modal or coming-soon) / duplicate / pause-activate / view public coupon-deal (`href`/safe toast) / delete (modal) |
| 5.8 | **Bulk bar** (FR-032) | select-all + selected-count (`aria-live`) + activate / pause / delete (modal) / export (mock toast) |
| 5.9 | **Empty state** (FR-032) | `.empty-state`: message + reset + إنشاء كوبون CTA |
| 5.10 | **Skeleton pattern** (FR-032) | `.skeleton` rows/cards (reusable) |
| 5.11 | **Coupon-source explanation** (FR-032) | `.card`: Manual / Affiliate / Coupon API / Scraped Pending Review + why review is required |
| 5.12 | **Help FAQ (≥5)** (FR-032) | هل الكوبون يعمل فعليًا الآن؟ / هل يمكن ربطه بعرض معين؟ / هل يمكن نسخه من الموقع العام؟ / ما معنى Coupon API؟ / هل الكوبونات المسحوبة Scraped تنشر تلقائيًا؟ |

## 6. Section Inventory — `create-coupon.html` (merchant-create-coupon)

| § | Section | Fields / notes |
|---|---------|----------------|
| 6.0 | **Page header** (FR-033) | `<h1>` إنشاء كوبون; description; actions: حفظ كمسودة / نشر تجريبي / معاينة / رجوع للكوبونات (`href="coupons.html"`); safe note (لا يتم حفظ الكوبون على خادم في هذه النسخة) |
| 6.1 | **Basic information** (FR-034) | coupon code* (`.field-input`, `dir="ltr"`) + generate-random-code (`icon-wand`) + copy (`data-copy`/`icon-copy`); provider/source; category* (`.field-select`: Flights/Hotels/Packages/Activities/Car Rental/Travel Insurance/Umrah/Honeymoon); related-deal select; short description |
| 6.2 | **Discount** (FR-035) | discount type* (Percentage/Fixed amount/Free service/Custom offer); discount value* ; currency (conditional: Fixed amount); minimum booking; max discount |
| 6.3 | **Usage rules** (FR-035) | start date; expiry date* ; usage limit; per-user limit; first-booking-only toggle; new-customers-only toggle; selected destinations |
| 6.4 | **Source** (FR-036) | source type* (Manual/Affiliate/Coupon API/Scraped Pending Review); source URL; affiliate URL; review status; manual-review toggle; source notes; **Scraped Pending Review → warning** "لا يتم نشر أي كوبون مجمّع تلقائيًا قبل المراجعة" (`.inline-msg-warning`) |
| 6.5 | **Terms** (FR-037) | terms & conditions; exclusions; notes |
| 6.6 | **Status & visibility** (FR-037) | status (Draft/Active/Scheduled); visible-on-public-coupons toggle; featured toggle; conditional schedule-publish date (Scheduled) |
| 6.7 | **Live coupon preview card** (FR-037) | page-scoped `.coupon-preview` `.card`: discount, code (`dir="ltr"`), provider, source badge, expiry, copy-button preview; updates live from the form |
| 6.8 | **SEO / public display** (FR-037) | public title; meta description; slug preview |

---

## 7. Mock-Content Schemas

### 7.1 `assets/data/merchant-deals.json` (NEW; **≥12** items) — FR-039

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | reuse `deal-001…deal-010` for ≥10 records; new `deal-011`/`deal-012` for extras |
| `title` / `destination` / `country` / `city` / `region` | string (ar) | — |
| `dealType` | enum | Flight/Hotel/Package/Umrah/Honeymoon/Family/Business/Budget/Luxury |
| `priceBefore` / `priceFrom` | number | + `currency` (e.g., "ر.س") |
| `currency` | string | e.g., "ر.س" |
| `discountLabel` | string | e.g., "خصم 25%" / "وفّر 600 ر.س" |
| `sourceType` | enum | Manual Deal / Partner Link / Affiliate / API Ready / Scraped Pending Review |
| `providerName` | string | provider/brand |
| `status` | enum | Draft / Active / Scheduled / Paused / Expired / Archived |
| `expiryDate` / `travelDates` / `lastUpdated` | string | mock dates (`dir="ltr"`) |
| `availability` | string/number | seats/rooms note |
| `clicks` / `inquiries` / `couponCopies` | number | merchant metrics (mock) |
| `rating` | number | e.g., 4.6 |
| `createdBy` | string (ar) | mock teammate |
| `featured` | bool | featured flag |
| `publicUrl` | string | `../pages/deal-details.html?id=<id>` where id resolves |
| `image` / `imageAlt` | string | placeholder SVG + alt (ar) |
| `highlights` / `includedItems` / `notIncludedItems` | string[] (ar) | repeater seeds |
| `terms` | string (ar) | cancellation/refund/notes |
| `seoTitle` / `metaDescription` / `slug` | string | SEO preview seeds |

### 7.2 `assets/data/merchant-coupons.json` (NEW; **≥12** items) — FR-040

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | reuse `coupons.json` ids where applicable; new ids for extras |
| `code` | string (ltr) | e.g., `SUMMER25` — rendered `dir="ltr"` |
| `discountType` | enum | Percentage / Fixed amount / Free service / Custom offer |
| `discountValue` | number/string | + `currency` when Fixed amount |
| `currency` | string | when fixed (e.g., "ر.س") |
| `provider` | string | provider/source name |
| `sourceType` | enum | Manual / Affiliate / Coupon API / Scraped Pending Review |
| `category` | enum | Flights/Hotels/Packages/Activities/Car Rental/Travel Insurance/Umrah/Honeymoon |
| `relatedDeal` | string | a `deal-0xx` id (or null) — consistency with `deals.json` |
| `usageLimit` / `usedCount` | number | usage caps + mock usage |
| `startDate` / `expiryDate` / `lastUpdated` | string | mock dates (`dir="ltr"`) |
| `status` | enum | Draft / Active / Scheduled / Paused / Expired / Archived |
| `minimumBooking` | number | min booking amount |
| `terms` | string (ar) | conditions |
| `sourceUrl` / `affiliateUrl` | string | configuration-ready (not validated) |
| `reviewStatus` | string | e.g., "بانتظار المراجعة" / "تمت المراجعة" |

### 7.3 Reused data (REFERENCED, UNCHANGED)

- `deals.json` (`deal-001…deal-010`) — `merchant-deals.json` reuses ids; edit-deal `?id` resolves here; row/edit/public
  CTAs → `../pages/deal-details.html?id=`.
- `coupons.json` (`coupon-flights-15`, `coupon-hotel-20`, …) — `merchant-coupons.json` reuses ids/codes; related-deal /
  "copy from public" honesty.
- Spec 006 `merchant-dashboard.json` / `merchant-*-preview.json` — referenced for identity consistency; unchanged.

> Mock data **references** these by id/link; it does not duplicate or contradict the source data (FR-041/SC-010).

---

## 8. Interaction Map (control → mechanism → result)

### 8.1 Shared shell (all five pages)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Sidebar العروض / إضافة عرض / الكوبونات | plain `href` (rewired; active item `aria-current`) | Navigate to the new page |
| Sidebar طلبات الحجز/العملاء/التحليلات/التكاملات/الإعدادات | `data-coming-soon` (existing) | Info toast (no 404) |
| Sidebar العودة للموقع | plain `href="../pages/index.html"` | Navigate |
| Mobile menu / drawer scrim / Escape | `dashboard.js` (`TUI.drawer`) | Open/close sidebar drawer |
| Topbar dropdowns (notifications/quick-add/user) | `DropdownController` (existing) | Toggle; quick-add إضافة عرض→`create-deal.html`, إنشاء كوبون→`create-coupon.html` |
| Global search / logout | `dashboard.js` (existing) | Mock toast / logout toast |
| Footer link / year | plain `href` / `data-year` | Navigate / current year |

### 8.2 Deals list (`deals.html`)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Search / filter / sort change | `merchant-deals` controller | Show/hide + reorder `[data-deal-row]`; update count + chips (`aria-live`) |
| Reset filters / remove chip | controller | Clear filter(s); restore rows; update count |
| Zero matches | controller | Hide table, show `.empty-state` |
| إضافة عرض جديد | plain `href="create-deal.html"` | Navigate |
| تصدير / استيراد تجريبي | `data-toast` / controller | Mock toast (no real file) |
| Row menu trigger | row-action-menu controller (existing) | Open row menu |
| Row → view public page | plain `href="../pages/deal-details.html?id="` / safe toast | Navigate / toast |
| Row → edit | plain `href="edit-deal.html?id="` | Navigate |
| Row → duplicate | controller | Clone row (نسخة تجريبية) + toast |
| Row → pause/activate | controller | Swap status badge + `data-status` + toast |
| Row → mark featured | controller | Toggle `.badge-featured` + `data-featured` + toast |
| Row → archive | controller + `TUI.modal` | Confirm modal → status/visual change + toast |
| Row → delete | controller + `TUI.modal` | Confirm modal → remove row + toast |
| Select-all / row checkbox | controller | Update selected-count (`aria-live`); reveal bulk bar |
| Bulk activate/pause/archive | controller | Act on checked rows' badges + toast |
| Bulk delete | controller + `TUI.modal` | Confirm modal → remove checked rows + toast |
| Bulk export | `data-toast` | Mock "تصدير تجريبي" toast |

### 8.3 Coupons list (`coupons.html`)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Search / filter / sort / reset / chips | `merchant-coupons` controller | As deals (8.2) over `[data-coupon-row]` |
| إنشاء كوبون / export / import | `href="create-coupon.html"` / `data-toast` | Navigate / mock toast |
| Row → copy code | `data-copy` / `copyToClipboard` (existing) | Copy code + toast |
| Row → edit | controller (mock-modal) or `data-coming-soon` | Modal / coming-soon toast |
| Row → duplicate / pause-activate / delete | controller (+ `TUI.modal` for delete) | Clone+toast / badge swap+toast / confirm→remove+toast |
| Row → view public coupon/deal | plain `href` / safe toast | Navigate / toast |
| Bulk activate/pause / delete / export | controller (+ `TUI.modal` for delete) | Badges+toast / confirm→remove+toast / mock toast |

### 8.4 Forms (`create-deal.html`, `edit-deal.html`, `create-coupon.html`)

| Control | Mechanism | Result |
|---------|-----------|--------|
| نشر تجريبي (submit) | controller → `TUI.validateForm` | Validate; invalid → inline errors; valid → نشر تجريبي toast (no real publish) |
| حفظ كمسودة | controller | Frontend-only "تم الحفظ كمسودة (تجريبي)" toast |
| معاينة (deal) | `data-modal-open` + controller | Open preview modal (card preview) |
| رجوع للعروض/الكوبونات | plain `href` to the list | Navigate |
| Add/remove highlight / included / not-included | controller | Clone/remove repeater row (retain ≥1) |
| Title input (deal) | controller | Auto-generate slug + public-URL preview (overridable) |
| Source type change (deal) | controller | Reveal conditional helper text + scraped review notice |
| Discount type change (coupon) | controller | Reveal currency field when Fixed amount |
| Source type change (coupon) | controller | Scraped Pending Review → warning + review controls |
| Status change → Scheduled | controller | Reveal schedule-publish date |
| Flexible-dates toggle (deal) | controller | Adapt availability inputs |
| Media upload (deal) | controller | Mock preview / "لا يتم رفع ملفات حقيقية الآن" toast (no real upload) |
| Generate code (coupon) | controller | Write random code into the field (no `prompt()`) |
| Copy code (coupon) | `data-copy` / `copyToClipboard` | Copy + toast |
| Coupon form edits | controller | Live-update the preview card |
| (edit-deal) duplicate / archive / delete / pause-activate / public-preview | controller (+ `TUI.modal` for archive/delete) | Toast / confirm→toast(+nav) / status toggle / navigate-or-safe-toast |

> New wiring lives in the additive `dashboard.js` per-page controllers (D2). Coming-soon, modal open/close, copy, toast,
> and the footer year reuse existing `data-*` behaviors; every navigation is a plain link. No-JS baseline: all rows,
> sections, and form fields render statically; filtering/sort/menus/modals/repeaters/preview are progressive
> enhancements (their triggers are real buttons that do nothing harmful without JS), and native form `required` provides
> a validation baseline.

---

## 9. Frontend-Only Form Models (not persisted)

All validated via `window.TUI.validateForm`; nothing is stored/transmitted; no real publish, save, upload, validation,
payment, or notification. The forms supply their own success path (toast + optional preview/visual), so they use
`data-validate` driven by the controller (Spec 005/006 precedent).

### 9.1 Create-deal / Edit-deal form (required fields → inline errors)

| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| title | `.field-input` | non-empty | **yes** |
| dealType | `.field-select` | preset | **yes** |
| destination | `.field-input` | non-empty | **yes** |
| shortDescription | `.field-textarea` | non-empty | **yes** |
| priceFrom | `.field-input type=number` | numeric > 0 | **yes** |
| expiryDate | `.field-input type=date` | valid date | **yes** |
| sourceType | `.field-select` | preset | **yes** |
| (others: country/city/region/pricing notes/dates/media/highlights/included/terms/SEO/status/visibility) | mixed | format-only | no |

Success: نشر تجريبي → toast (no real publish); حفظ كمسودة → toast; preview → modal. Edit-deal: save-changes/save-draft →
toast; archive/delete → `TUI.modal` confirm; duplicate → toast; pause/activate → status toggle. Nothing persisted.

### 9.2 Create-coupon form (required fields → inline errors)

| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| code | `.field-input` (`dir="ltr"`) | non-empty | **yes** |
| category | `.field-select` | preset | **yes** |
| discountType | `.field-select` | preset | **yes** |
| discountValue | `.field-input` | non-empty (numeric unless Free service/Custom offer) | **yes** |
| expiryDate | `.field-input type=date` | valid date | **yes** |
| currency | `.field-input/select` | required **only** when discountType = Fixed amount | conditional |
| (others: provider/relatedDeal/usage/source/terms/status/SEO) | mixed | format-only | no |

Success: نشر تجريبي → toast (no real activation); حفظ كمسودة → toast; generate-code → fills field; copy → toast; preview
card updates live. Nothing persisted; no real coupon is active.

> Toggles (flexible-dates, featured, visible, first-booking-only, new-customers-only, manual-review), the
> generate-code/copy buttons, the repeater add/remove, the filter/sort controls, the row/bulk actions, and the preview
> are controller-handled — not validated forms. Coupon source = Scraped Pending Review surfaces the manual-review notice
> and never auto-publishes (IX).

---

## 10. Structured Data (JSON-LD)

| Page | Schemas | Notes |
|------|---------|-------|
| All five | `BreadcrumbList` (optional) | `robots noindex` (private merchant app); no real-publish/active/connected/payment/notification assertion |

Rules: exactly one `<h1>` per page and correct heading order; any structured data describes the frontend-only mock
experience honestly and never asserts a real publish, save, upload, validated coupon/link, connected API, active scraping
source, payment, notification, or a coupon active on a live system (IX; FR-050).

---

## 11. Mock-Data Consistency & Integrity Rules

- `merchant-deals.json` reuses `deal-001…deal-010` ids for ≥10 records (extras get new ids); each `publicUrl`/edit `?id`
  resolves to an existing `deals.json` id → `../pages/deal-details.html?id=`; a missing/invalid id degrades gracefully
  (edit-deal default deal; safe-toast CTA) — never a broken page or dead link. (FR-041/SC-010)
- `merchant-coupons.json` reuses `coupons.json` ids/codes where applicable; `relatedDeal` resolves to a `deal-0xx` id (or
  is null); codes render `dir="ltr"`. (FR-040/FR-041)
- `merchant-deals.json` `status` ∈ {Draft, Active, Scheduled, Paused, Expired, Archived}; `sourceType` ∈ {Manual Deal,
  Partner Link, Affiliate, API Ready, Scraped Pending Review}. `merchant-coupons.json` `status` (same six);
  `discountType` ∈ {Percentage, Fixed amount, Free service, Custom offer}; `sourceType` ∈ {Manual, Affiliate, Coupon API,
  Scraped Pending Review}; `category` ∈ {Flights, Hotels, Packages, Activities, Car Rental, Travel Insurance, Umrah,
  Honeymoon}. Each set MUST **spread** across its enum so badges/filters/stat-cards are meaningful (e.g., several Active,
  ≥1 Draft, ≥1 Paused, ≥1 Expired, ≥1 Scheduled; a spread of sources incl. ≥1 Scraped Pending Review). (FR-039/FR-040)
- The stat-card counts MUST be internally consistent with the rendered rows (e.g., "العروض النشطة" matches the count of
  Active rows; "المسودات" matches Draft rows). (FR-009/FR-028)
- Source/status badges reuse the canonical labels + `badge-source-*`/status badge classes; Scraped Pending Review always
  carries a manual-review notice and never auto-publishes. (IX)
- No field or copy asserts a real publish, database save, file/image upload, validated/guaranteed coupon or link,
  connected API, active scraping source, payment, sent notification, or a coupon active on a live system; everything is
  بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه النسخة / قابل للربط لاحقًا. (IX; FR-042)
- Latin/numeric values inside Arabic RTL (codes, prices, currencies, dates, references, percentages, URLs, brand names)
  render with correct direction (`dir="ltr"` where needed) and remain legible. (spec Edge Cases; FR-047)
