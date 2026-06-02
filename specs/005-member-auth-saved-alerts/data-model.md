# Phase 1 Data Model: Member Auth, Saved Deals & Price Alerts

**Feature**: `005-member-auth-saved-alerts` | **Date**: 2026-06-02

No backend data. The "model" here is the **page inventory + per-page section inventory**, the **mock-content schemas**
(new + reused), the **interaction map** (which control fires which existing `window.TUI` action or `member.js` behavior),
the **frontend-only form models** (with validation rules), and the **structured-data** notes. All values are realistic,
clearly-mock, and never imply a real account, session, storage, sent notification, changed/reset password, monitored
price, connected API, or payment (Constitution IX; spec product-honesty). Cards/items are static HTML carrying `data-*`
so the enhancement layer can act on the DOM (research D1). Member/auth state is frontend/session-only; reload restores
the mock defaults (research D2).

---

## 1. Page Inventory

| Page | `data-page` | Role | Contract | Primary new data |
|------|-------------|------|----------|------------------|
| `pages/login.html` | `login` | Member sign-in (split layout) | Auth (form + benefits + honesty + forgot-pw modal) | — (forms only) |
| `pages/register.html` | `register` | Member registration + preferences | Auth (fuller form + password rules + benefits + honesty) | — (forms only) |
| `pages/saved-deals.html` | `saved-deals` | Saved-items hub (tabs) | Member listing (tabs + per-tab empty states) | `member-saved.json` + reused `deals`/`coupons`/`destinations-full`/`compare-offers`/`articles` |
| `pages/price-alerts.html` | `price-alerts` | Alerts management (CRUD) | Member listing (create + cards + modals + FAQ + empty) | `price-alerts.json` |
| `pages/profile.html` | `profile` | Profile/settings | Member surface (info/prefs/notifications/security) | `member-profile.json` |

All five inline the canonical shell (`partials/head|header|footer.html`), set `<html lang="ar" dir="rtl" data-page="…">`,
load `../src/js/ui.js` → `../src/js/main.js` → `../src/js/member.js` (defer), and include a small page-scoped `<style>`
for the auth split layout / tabs / toggle switches / stats grid / account sub-nav (as `index.html` does). Exactly one
`<h1>` per page; section headings `<h2>`; card/sub-section titles `<h3>`. Member/auth pages MAY set `<meta name="robots"
content="noindex">` (frontend-only) while staying structurally SEO-correct.

---

## 2. Section Inventory (per page)

### 2.1 `login.html` (FR-006–FR-008)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / تسجيل الدخول) | — | `.breadcrumb` |
| 2 | Auth split layout — form panel | `<h1>` تسجيل الدخول | page-scoped grid; `.card` |
| 3 | Login form | — | `.field*` (email `dir="ltr"` req, password req), remember-me `.field-check`, forgot-pw trigger, submit `.btn-primary` (loading style), link → `register.html` |
| 4 | Password visibility toggle | — | `.btn-icon` (`aria-pressed`/`aria-label`), `member.js` |
| 5 | Social-login placeholders | — | `.btn-outline` disabled or `data-toast` "coming soon" |
| 6 | Benefits / trust panel | `<h2>` | `.card`, list (حفظ العروض، تنبيهات الأسعار، تذكير بالكوبونات، متابعة الحجوزات لاحقًا، توصيات مستقبلية، قابل للربط لاحقًا) |
| 7 | Frontend-only honesty block | `<h2>`/`<h3>` | `.inline-msg-info` (نسخة واجهة أمامية فقط، لا جلسة حقيقية، قابل للربط لاحقًا) |
| — | Forgot-password modal | (dialog) | `.modal` + email `.field` (`dir="ltr"` req) + "no real email" note |
| — | Inline success (post-submit) | — | `[data-frontend-success]` → CTA `saved-deals.html` |

### 2.2 `register.html` (FR-009–FR-011)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / إنشاء حساب) | — | `.breadcrumb` |
| 2 | Auth split layout — form panel | `<h1>` إنشاء حساب | page-scoped grid; `.card` |
| 3 | Register form | — | `.field*`: full name req; email `dir="ltr"` req; phone req; password req (`minlength`); confirm-password req; preferred destination; travel-interest `.field-select`; budget range; notification-method (Email/WhatsApp placeholder/Dashboard); terms `.field-check` req; submit; link → `login.html` |
| 4 | Password-rules panel | `<h3>` | `.card`/`.inline-msg-info` (min length، تطابق التأكيد، تجنّب كلمات ضعيفة) |
| 5 | Password visibility toggles (×2) | — | `.btn-icon` (`aria-pressed`) on password + confirm |
| 6 | Membership benefits / preferences preview | `<h2>` | `.card`, list (حفظ العروض والكوبونات، تنبيهات أسعار، إدارة الوجهات، تخصيص الاقتراحات لاحقًا، تسريع طلبات الحجز) |
| 7 | Frontend-only trust note | `<h2>`/`<h3>` | `.inline-msg-info` (لا حساب حقيقي، لا إرسال للخادم، جاهزة للربط لاحقًا) |
| — | Inline success (post-submit) | — | `[data-frontend-success]` → CTA `saved-deals.html` |

### 2.3 `saved-deals.html` (FR-012–FR-016)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / المحفوظات) | — | `.breadcrumb` |
| 2 | Member header | `<h1>` المحفوظات | mock name + welcome, `.badge` "تجربة تجريبية", quick stats (deals/coupons/destinations/active-alerts) `.card`, CTAs → `price-alerts.html`/`deals.html`/`coupons.html` |
| 3 | Member tabs (tablist) | — | page-scoped tabs (`role="tablist"`): العروض / الكوبونات / الوجهات / المقارنات / المقالات |
| 4 | Saved deals panel (≥6) | (cards `<h3>`) | `.card`, `.badge-source-*`, `.price`, → `deal-details.html?id=`; remove `.btn-icon`; "create alert" `.btn-ghost` → `price-alerts.html` |
| 5 | Saved coupons panel (≥4) | (cards `<h3>`) | `.card`, code `dir="ltr"` + `data-copy`, provider/category/expiry, "use coupon" → `coupons.html`, remove |
| 6 | Saved destinations panel (≥4) | (cards `<h3>`) | `.card`/`.dest-card`, best season, deals/coupons counts, → `destination-details.html?id=`, compare → `compare.html?destination=`, remove |
| 7 | Saved comparisons panel (≥4) | (cards `<h3>`) | `.card`, route/month/travelers/budget, last-viewed date, → `compare.html?destination=…`, remove |
| 8 | Saved articles panel (≥3) | (cards `<h3>`) | `.card`/`.guide-card`, → `article.html?id=`, remove |
| 9 | Per-tab empty states | — | `.empty-state` (message + CTA to relevant page + optional mock-restore) |
| 10 | Frontend-only note | `<h2>`/`<h3>` | `.inline-msg-info` (المحفوظات تجريبية؛ ستُحفظ في حساب المستخدم لاحقًا) |

### 2.4 `price-alerts.html` (FR-017–FR-022)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / تنبيهات الأسعار) | — | `.breadcrumb` |
| 2 | Hero | `<h1>` تنبيهات الأسعار | frontend-only/integration-ready copy; CTAs (إنشاء تنبيه / `deals.html` / `compare.html`) |
| 3 | Stats cards | `<h2>` | `.card` grid: active / paused / triggered-mock / destinations-watched / avg target budget |
| 4 | Create-alert form | `<h2>` | `.field*`: type (Flight/Hotel/Package/Destination); from (Flight); to/destination req; travel month req; max budget req; travelers; method (Email/WhatsApp/Dashboard) + dynamic email/phone; notes |
| 5 | Alert cards list (≥6) | (cards `<h3>`) | `.card`, type, route/destination, target + current sample price, status `.badge` (Active/Paused/Triggered mock), month, travelers, method, last-checked, "مثال توضيحي" note; actions edit/pause-activate/delete/view-deals/compare |
| 6 | Empty state (all deleted) | — | `.empty-state` (CTA create / browse deals) |
| 7 | How alerts work | `<h2>` | prose (mock now; future APIs; future email/WhatsApp; depends on prefs/sources) |
| 8 | FAQ (≥5) | `<h2>` | native `<details>`/`<summary>` |
| — | Edit-alert modal | (dialog) | `.modal` + `.field*` (destination/route, max budget, travel month, method, status) |
| — | Delete-confirm modal | (dialog) | `.modal` (confirm/cancel) |

### 2.5 `profile.html` (FR-023–FR-027)
| # | Section | Heading | Reused patterns |
|---|---------|---------|-----------------|
| 1 | Breadcrumb (الرئيسية / الملف الشخصي) | — | `.breadcrumb` |
| 2 | Profile header | `<h1>` الملف الشخصي | mock avatar/initial, name, email, `.badge` "تجربة تجريبية", member-since, quick links → `saved-deals.html`/`price-alerts.html`/`deals.html` |
| 3 | Account sub-navigation | — | page-scoped nav (`.nav-link`/`.btn-ghost`): الملف / المحفوظات / التنبيهات / تفضيلات السفر / الإشعارات / الأمان (→ page or in-page section) |
| 4 | Personal-information form | `<h2>` | `.field*`: name; email `dir="ltr"`; phone; country; city; preferred language; preferred currency |
| 5 | Travel-preferences form | `<h2>` | preferred destinations; travel interests (عائلات/شهر عسل/اقتصادي/فاخر/شواطئ/تسوق/عمرة); budget range; hotel stars; travel month/season; default travelers; airport/city pref |
| 6 | Notification settings | `<h2>` | 7 toggles (`role="switch"`): email alerts، تذكير الكوبونات، تنبيهات هبوط السعر، تذكير انتهاء العروض المحفوظة، WhatsApp placeholder، النشرة البريدية، ملخص أسبوعي |
| 7 | Security placeholder | `<h2>`/`<h3>` | change-password form (current/new `minlength`/confirm); 2FA placeholder; mock active-sessions list; logout `.btn` |
| 8 | Privacy / data note | `<h2>`/`<h3>` | `.inline-msg-info` (واجهة أمامية فقط؛ لا تخزين على خادم الآن؛ قابل للحفظ الآمن لاحقًا) |
| 9 | Plan / benefits card | `<h2>` | `.card` (saved deals، تنبيهات، توصيات لاحقًا، تسريع طلب الحجز لاحقًا) |

---

## 3. Mock-Content Schemas

### 3.1 Saved items — `assets/data/member-saved.json` (NEW) — FR-028
Top-level object with five arrays: `savedDeals`, `savedCoupons`, `savedDestinations`, `savedComparisons`, `savedArticles`
(minima 6 / 4 / 4 / 4 / 3). Referenced ids reuse the existing catalogs so identity stays consistent.

| Field | Type | Applies to | Notes |
|-------|------|-----------|-------|
| `id` | string | all | reuses existing entity id (e.g., `deal-003`, coupon code, `dest-dubai`, `art-…`) where applicable |
| `type` | enum | all | `deal` / `coupon` / `destination` / `comparison` / `article` |
| `title` | string (ar) | all | display title |
| `image` / `imageAlt` | string | deal/destination/article | relative SVG path + meaningful alt |
| `destination` | string (ar) | deal/destination/comparison | e.g., "دبي" |
| `sourceBadge` | enum | deal/coupon | Partner / Affiliate / Manual Deal / API Ready |
| `priceFrom` / `currency` | number/string | deal | indicative "ابتداءً من"/تقديري |
| `discount` | string (ar) | deal/coupon | e.g., "خصم 20%" |
| `code` | string (ltr) | coupon | copyable, `dir="ltr"` |
| `provider` / `category` | string (ar) | coupon | provider + category |
| `rating` | number | deal | illustrative |
| `bestSeason` | string (ar) | destination | illustrative |
| `dealsCount` / `couponsCount` | number | destination | illustrative |
| `route` / `travelMonth` / `travelers` / `maxBudget` | mixed | comparison | saved-search context |
| `lastViewed` | string | comparison | mock date |
| `status` | string (ar) | all | e.g., "محفوظ"، "ساري"، "منتهٍ قريبًا" |
| `expiry` / `date` | string | deal/coupon/article | mock date |
| `linkUrl` | string | all | `deal-details.html?id=` / `coupons.html` / `destination-details.html?id=` / `compare.html?destination=…` / `article.html?id=` |

### 3.2 Price alert — `assets/data/price-alerts.json` (NEW; ≥6 items) — FR-029
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key, e.g. `alert-001` |
| `type` | enum | `flight` / `hotel` / `package` / `destination` |
| `from` | string (ar) | origin city — present when `type=flight` |
| `to` | string (ar) | destination |
| `destination` | string (ar) | route label or destination name |
| `travelMonth` | string (ar) | e.g., "أكتوبر 2026" |
| `maxBudget` | number | target price |
| `currency` | string | e.g., "ر.س" |
| `travelers` | number | count |
| `notifyMethod` | enum | `email` / `whatsapp` (placeholder) / `dashboard` |
| `notifyContact` | string | email/phone placeholder (illustrative) |
| `status` | enum | `active` / `paused` / `triggered` (mock) |
| `currentSamplePrice` | number | illustrative "مثال توضيحي" |
| `lastChecked` | string | mock date |

### 3.3 Member profile — `assets/data/member-profile.json` (NEW; 1 item) — FR-030
| Field | Type | Notes |
|-------|------|-------|
| `name` | string (ar) | e.g., "زائر تجريبي" |
| `email` | string (ltr) | demo email |
| `phone` | string (ltr) | demo phone |
| `country` / `city` | string (ar) | e.g., "السعودية" / "الرياض" |
| `memberSince` | string | mock date |
| `preferredLanguage` | string | e.g., "العربية" |
| `preferredCurrency` | string | e.g., "ر.س" |
| `preferredDestinations` | string[] (ar) | reuse destination names/ids |
| `travelInterests` | string[] (ar) | عائلات/شهر عسل/اقتصادي/فاخر/شواطئ/تسوق/عمرة |
| `budgetRange` | string (ar) | illustrative |
| `hotelStars` / `travelSeason` / `defaultTravelers` / `airportPref` | mixed | preferences |
| `notificationPreferences` | object<bool> | the 7 toggle states |
| `security` | object | placeholder (2FA off; mock active-sessions list) |

### 3.4 Reused data (UNCHANGED)
- `deals.json` (`deal-001…deal-010`) — saved-deal items + "view deal" links.
- `coupons.json` — saved-coupon items (code/category/provider/expiry).
- `destinations-full.json` — saved-destination items (→ `destination-details.html?id=`).
- `compare-offers.json` — saved-comparison context (`compare.html?destination=`).
- `articles.json` — saved-article items (→ `article.html?id=`).

> Saved items **reference** these by id/link; they do not duplicate or contradict the source data (FR-028/SC-008).

---

## 4. Interaction Map (control → mechanism → result)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Header "تسجيل الدخول" CTA | plain `href="login.html"` (coming-soon removed) | Navigate |
| Drawer "تسجيل الدخول" / "إنشاء حساب جديد" | plain `href` to `login.html` / `register.html` | Navigate |
| Shell member entry point (account/saved/alerts) | plain `href` to `profile.html`/`saved-deals.html`/`price-alerts.html` | Navigate |
| Out-of-scope shell links | `data-coming-soon` (kept) | Info toast |
| Password-visibility toggle | `member.js` (`click`, `aria-pressed`) | Flip input type + label |
| Login submit (valid) | `data-validate data-frontend-form` (existing) **or** `member.js` | Toast + inline success (CTA → `saved-deals.html`) |
| Forgot-password trigger | `data-modal-open="forgot-password"` (existing) | Open modal |
| Forgot-password submit (valid) | `data-validate data-frontend-form` (existing) | Toast + inline success (no real email) |
| Social-login placeholder | disabled `.btn` or `data-toast` (existing) | Coming-soon toast / inert |
| Register submit | `member.js` → `TUI.validateForm(form,{rules})` | Validate (confirm-match, min-length, terms) → toast + inline success (CTA → `saved-deals.html`) |
| Member tab | `member.js` (`click`, ARIA tablist) | Show panel + hide others + `aria-selected` + `aria-live` announce |
| Saved-item remove | `member.js` (`click`) | Remove item + update quick-stat count + toast; show empty state if tab empty |
| Saved-coupon copy | `data-copy="<CODE>"` (existing) | Copy + success toast |
| Saved-deal "create alert" | plain `href="price-alerts.html"` (optionally `?from=<id>`) | Navigate (member.js MAY pre-seed) |
| Saved-item / quick-link / CTA | plain `href` to existing page | Navigate (invalid mock id → safe fallback, never broken) |
| Empty-state mock-restore | `member.js` (`click`) | Restore the tab's mock items + toast |
| Create-alert: type change | `member.js` (`change`) | Show/require "from" when Flight |
| Create-alert: method change | `member.js` (`change`) | Toggle required on email/phone per method |
| Create-alert submit (valid) | `member.js` → `TUI.validateForm(form,{rules})` | Toast + inline success + append mock alert card (+ stats) |
| Alert "edit" | `data-modal-open="edit-alert"` + `member.js` | Open modal pre-filled from card |
| Edit-alert save (valid) | `member.js` → `TUI.validateForm` | Toast + update visible card + close modal |
| Alert "pause"/"activate" | `member.js` (`click`) | Flip status badge + update stats + toast |
| Alert "delete" | `data-modal-open="delete-alert"` + `member.js` | Open delete-confirm modal |
| Delete-confirm "confirm" | `member.js` | Remove card + toast (+ empty state if last) |
| Alert "view deals" / "compare" | plain `href` `deals.html` / `compare.html?destination=…` | Navigate |
| Notification toggle | native `role="switch"` checkbox + `member.js` | Flip visual/`aria-checked` + "saved" toast |
| Personal-info / travel-prefs save | `data-validate data-frontend-form` or `member.js` | Validate → "saved" toast (frontend-only) |
| Change-password submit | `member.js` → `TUI.validateForm(form,{rules})` | Validate (confirm-match, min-length) → toast (no real change) |
| Logout | `member.js` (`click`) | Toast (frontend-only) + optional `href`/nav → `index.html` |
| FAQ items | native `<details>`/`<summary>` | Expand/collapse |
| Footer year | `data-year` (existing) | Current year |

> No new wiring tokens beyond `member.js`'s toggles/tabs/CRUD handlers. Coupon copy, modals, and simple forms reuse
> existing `data-*` behaviors; every navigation is a plain link.

---

## 5. Frontend-Only Form Models (not persisted)

All validated via `window.TUI.validateForm`. Nothing is stored/transmitted; no real account/session/notification/
password change. Member-owned forms (register, change-password, create/edit-alert) use `data-validate` **without**
`data-frontend-form` (so only `member.js` runs the success path); simple forms MAY use `data-validate
data-frontend-form` (research D5).

### 5.1 Login — `login.html`
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| email | `.field-input` type=email `dir="ltr"` | HTML email constraint | yes |
| password | `.field-input` type=password | non-empty | yes |
| remember | `.field-check` checkbox | — | no |
Success: toast + reveal `[data-frontend-success]` with CTA → `saved-deals.html`.

### 5.2 Forgot-password — `login.html` modal
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| email | `.field-input` type=email `dir="ltr"` | HTML email constraint | yes |
Success: toast + inline success + "no real email is sent" note.

### 5.3 Register — `register.html` (member.js rules)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| name | `.field-input` | non-empty | yes |
| email | `.field-input` type=email `dir="ltr"` | HTML email constraint | yes |
| phone | `.field-input` type=tel `dir="ltr"` | non-empty | yes |
| password | `.field-input` type=password | `minlength` (≥8) | yes |
| confirmPassword | `.field-input` type=password | **rule**: equals password | yes |
| preferredDestination | `.field-input`/`.field-select` | — | no |
| travelInterest | `.field-select` | preset option | no |
| budgetRange | `.field-select`/range | — | no |
| notifyMethod | `.field-select`/radios | preset | no |
| terms | `.field-check` | **rule/required**: must be checked | yes |
Success: toast + inline success + CTA → `saved-deals.html` (no real account).

### 5.4 Create-alert — `price-alerts.html` (member.js rules + dynamic fields)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| type | `.field-select`/radios | preset (flight/hotel/package/destination) | yes |
| from | `.field-input` | non-empty **when** type=flight | conditional |
| to/destination | `.field-input` | non-empty | yes |
| travelMonth | `.field-select` | preset | yes |
| maxBudget | `.field-input` type=number | numeric > 0 | yes |
| travelers | `.field-select`/number | preset | no |
| notifyMethod | `.field-select`/radios | preset | yes |
| email | `.field-input` type=email `dir="ltr"` | required **when** method=email | conditional |
| phone | `.field-input` type=tel `dir="ltr"` | required/placeholder **when** method=whatsapp | conditional |
| notes | `.field-textarea` | — | no |
Success: toast + inline success + append a mock alert card (+ update stats); no real notification.

### 5.5 Edit-alert — `price-alerts.html` modal (member.js rules)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| destination/route | `.field-input` | non-empty | yes |
| maxBudget | `.field-input` type=number | numeric > 0 | yes |
| travelMonth | `.field-select` | preset | yes |
| notifyMethod | `.field-select` | preset | yes |
| status | `.field-select` | active/paused/triggered | yes |
Success: toast + update visible card + close modal.

### 5.6 Personal-information — `profile.html`
name (req), email (`dir="ltr"`, email constraint, req), phone (req), country, city, preferred language, preferred
currency. Success: "saved" toast (frontend-only).

### 5.7 Travel-preferences — `profile.html`
preferred destinations, travel interests (checkbox group), budget range, hotel stars, travel month/season, default
travelers, airport/city pref. Success: "saved" toast (frontend-only).

### 5.8 Change-password — `profile.html` security (member.js rules)
| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| currentPassword | `.field-input` type=password | non-empty | yes |
| newPassword | `.field-input` type=password | `minlength` (≥8) | yes |
| confirmPassword | `.field-input` type=password | **rule**: equals newPassword | yes |
Success: toast + explicit "no real password is changed" note.

> Member tabs, notification toggles, password-visibility toggles, item-remove, alert pause/activate/delete are **not**
> validated forms — they are `member.js` click/change handlers (tabs use ARIA tablist; toggles are native
> `role="switch"` checkboxes). No-JS baseline: forms submit nowhere harmful (native `required`/`type=email` give a
> baseline), tabs show content (default/`:target`), toggles flip natively.

---

## 6. Structured Data (JSON-LD) per page

| Page | Schemas | Notes |
|------|---------|-------|
| `login.html` | `BreadcrumbList` (optional) | `robots noindex`; no account/auth assertion |
| `register.html` | `BreadcrumbList` (optional) | `robots noindex`; no account assertion |
| `saved-deals.html` | `BreadcrumbList` (optional) | `robots noindex`; no real-storage assertion |
| `price-alerts.html` | `BreadcrumbList` + `FAQPage` (mirrors the visible FAQ) | `robots noindex`; no live-monitoring/notification assertion |
| `profile.html` | `BreadcrumbList` (optional) | `robots noindex`; no real-account/session assertion |

Rules: each page keeps exactly one `<h1>` and correct heading order; any structured data describes the frontend-only mock
experience honestly and never asserts a real account, session, storage, sent notification, monitored price, or live data
(IX; FR-041). `FAQPage` on `price-alerts.html` mirrors the visible FAQ Q&A.

---

## 7. Mock-Data Consistency & Integrity Rules

- Every saved-item `id`/`linkUrl` resolves to an existing entry/page: saved deals → `deals.json` ids +
  `deal-details.html?id=`; saved coupons → `coupons.json`; saved destinations → `destinations-full.json` ids +
  `destination-details.html?id=`; saved comparisons → `compare.html?destination=…` context; saved articles →
  `articles.json` ids + `article.html?id=`. No dangling links. An invalid/missing mock id renders a safe fallback or is
  skipped — never a broken page. (FR-028/FR-016; SC-008)
- Reused deal/coupon source labels stay the four canonical values (Partner / Affiliate / Manual Deal / API Ready) with
  matching `badge-source-*`; safe action labels only (View Deal/Request Booking/Compare Offer/Get Coupon in Arabic).
  (IX)
- `price-alerts.json` `type` ∈ {flight, hotel, package, destination}; `status` ∈ {active, paused, triggered};
  `notifyMethod` ∈ {email, whatsapp, dashboard}. Stats on the page (active/paused/triggered counts, destinations
  watched, avg target budget) are derived from / consistent with the rendered alert set. (FR-018/FR-029)
- `member-profile.json` values match the static profile-header and form defaults; `notificationPreferences` match the
  initial toggle states. (FR-030)
- No field or copy asserts a real account/session, server storage, a sent email/WhatsApp notification, a changed/reset
  password, a monitored/live price, a connected API, or a payment; alerts are "مثال توضيحي"; everything is تجريبية /
  واجهة أمامية فقط / قابل للربط لاحقًا. (IX; FR-031)
- Latin/numeric values inside Arabic RTL (emails, phones, coupon codes, prices, dates) render with correct direction
  (`dir="ltr"` where needed) and remain legible/copyable. (spec Edge Cases; FR-037)
