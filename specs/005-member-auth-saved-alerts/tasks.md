---
description: "Task list for 005-member-auth-saved-alerts"
---

# Tasks: Member Auth, Saved Deals & Price Alerts (Travel SaaS Platform)

**Input**: Design documents from `specs/005-member-auth-saved-alerts/`
**Prerequisites**: plan.md ✅, spec.md ✅ (5 user stories), research.md ✅ (D1–D10), data-model.md ✅, contracts/ ✅ (member-pages, mock-data)

**Tests**: No automated test suite is requested (per the constitution, QA is the manual per-page "done" checklist +
an automated accessibility/SEO audit). Verification tasks live in the Polish phase. No unit/contract test tasks are
generated.

**Organization**: Tasks are grouped by user story (US1–US5) so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 (Setup/Foundational/Polish have no story label)
- All paths are under `travel-saas-frontend/` unless noted.

## Conventions for this feature

- Pages are **standalone static HTML** that inline the canonical shell; core/default content is static HTML (renders
  without JS). The new shared module `src/js/member.js` only *enhances* (password-visibility toggles, member tabs,
  saved-item removal + empty-state, price-alert create/edit/pause-activate/delete with custom modals, notification
  toggles, save feedback, logout mock).
- `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js` (Spec 003), and `src/js/content.js` (Spec 004) MUST remain
  **unchanged** (research D4). `<html data-page>` dispatches `member.js`; member/auth state is **frontend/session-only**
  (reload restores mock defaults — no real account/session/server).
- Forms reuse `window.TUI.validateForm(form, {rules})`. Simple forms reuse the unchanged `data-validate
  data-frontend-form` auto-handler; cross-field/dynamic forms (register/change-password confirm-match + min-length;
  create/edit-alert method-dependent fields) are owned by `member.js` and **omit** `data-frontend-form` (research D5).
- Confirmations (forgot-password, edit-alert, delete-confirm) use the existing `.modal` / `window.TUI.modal` — **no
  `alert()`/`confirm()`/`prompt()`** anywhere (research D9).
- Reuse existing data unchanged: `deals.json` (`deal-001…deal-010`), `coupons.json`, `destinations-full.json`,
  `compare-offers.json`, `articles.json`. Source badges Partner/Affiliate/Manual Deal/API Ready; safe CTA labels;
  alerts "مثال توضيحي"; never a real account/session/storage/notification/password-change/price-monitoring/API/payment.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline before building on it.

- [x] T001 Verify baseline: run `npm run build` in `travel-saas-frontend/` (regenerates `assets/css/tailwind.css`) and confirm `pages/index.html`, `pages/styleguide.html`, `pages/components.html`, the Spec 003 pages (`pages/deals.html`, `pages/deal-details.html`, `pages/compare.html`, `pages/coupons.html`), and the Spec 004 pages (`pages/destinations.html`, `pages/destination-details.html`, `pages/blog.html`, `pages/article.html`) render with no console errors / no external CDN requests.
- [x] T002 [P] Audit `assets/images/` for the SVG placeholders the member pages need (avatar/initial, auth-hero illustration, saved-item thumbnails). Reuse existing SVGs (city/beach/heritage/luxury/etc.) where possible; add any missing additive SVG placeholder with a meaningful filename and alt-friendly content (no new visual identity).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared mock-data catalogs, the enhancement-module skeleton, the rewired canonical shell, and the page
scaffold that ALL new pages depend on.

**⚠️ CRITICAL**: No user-story page work should begin until this phase is complete.

- [x] T003 Create the saved-items catalog `assets/data/member-saved.json` per the M1 schema — a top-level object with `savedDeals` (**≥6**), `savedCoupons` (**≥4**), `savedDestinations` (**≥4**), `savedComparisons` (**≥4**), `savedArticles` (**≥3**); each item carries `id`, `type`, the type-appropriate display fields (image/imageAlt, destination, sourceBadge ∈ {Partner,Affiliate,Manual Deal,API Ready}, priceFrom/currency, discount, code, provider/category, rating, bestSeason, deals/coupons counts, route/travelMonth/travelers/maxBudget, lastViewed), `status`, `expiry`/`date`, and a `linkUrl`. Referenced ids MUST reuse existing `deals.json`/`coupons.json`/`destinations-full.json`/`compare-offers.json`/`articles.json` ids and `linkUrl`s MUST resolve to `deal-details.html?id=` / `coupons.html` / `destination-details.html?id=` / `compare.html?destination=` / `article.html?id=` — no dangling links (M1/M5.2).
- [x] T004 [P] Create the alerts catalog `assets/data/price-alerts.json` with **≥6** mock alerts per the M2 schema (`id`, `type` ∈ {flight,hotel,package,destination}, `from` when flight, `to`/`destination`, `travelMonth`, `maxBudget`+`currency`, `travelers`, `notifyMethod` ∈ {email,whatsapp,dashboard}, `notifyContact` placeholder, `status` ∈ {active,paused,triggered}, `currentSamplePrice`, `lastChecked`); include a spread of statuses (≥1 active/paused/triggered) and ≥2 types so the stats cards and badges are meaningful; all illustrative "مثال توضيحي" (M2/M5.1).
- [x] T005 [P] Create the member profile `assets/data/member-profile.json` with one mock member per the M3 schema (`name` e.g. "زائر تجريبي", `email`, `phone`, `country`, `city`, `memberSince`, `preferredLanguage`, `preferredCurrency`, `preferredDestinations[]` reusing `destinations-full.json` names/ids, `travelInterests[]` ⊆ {عائلات,شهر عسل,اقتصادي,فاخر,شواطئ,تسوق,عمرة}, `budgetRange`, hotel-stars/travel-season/default-travelers/airport-pref, `notificationPreferences` {7 booleans}, `security` placeholder {2FA off, mock active-sessions list}); values must match the static profile content authored later (M3).
- [x] T006 Create `src/js/member.js` (additive IIFE, `'use strict'`, `DOMContentLoaded`): per-page dispatch via `document.documentElement.dataset.page` (`login`/`register`/`saved-deals`/`price-alerts`/`profile`), plus shared helpers — a password-visibility toggle helper (`aria-pressed`/`aria-label`), an `aria-live` announcer, a `TUI.validateForm(form,{rules})` submit wrapper that renders frontend-only success (toast + reveal `[data-frontend-success]` + optional navigation/append), and a `prefersReducedMotion`-aware helper. No edits to `main.js`/`ui.js`/`discovery.js`/`content.js` (research D4).
- [x] T007 Rewire the canonical shell nav in `partials/header.html` (and `partials/footer.html` if member links belong there): change the desktop "تسجيل الدخول" CTA and the drawer "تسجيل الدخول" / "إنشاء حساب جديد" CTAs from `data-coming-soon` to real `<a href="login.html">` / `<a href="register.html">`; **additively** add a member entry point (e.g., "حسابي" → `profile.html` or `saved-deals.html`, and any "تنبيه الأسعار" affordance → `price-alerts.html`) without removing any existing element; leave all still-out-of-scope links (merchant dashboard, SaaS owner admin, about/contact/privacy/terms/partners, social) with `data-coming-soon` (research D10; C6.1/C6.2/C6.4).
- [x] T008 Establish the standalone page scaffold reused by the five new pages: inlined `head`/`header`/`footer` 1:1 with the updated `partials/`, skip link, `#main` landmark, `#toast-root`, `<html lang="ar" dir="rtl" data-page="…">`, optional `<meta name="robots" content="noindex">`, a small page-scoped `<style>` placeholder (auth split layout / tabs / toggle switches / stats grid / account sub-nav), and the script order `../src/js/ui.js` → `../src/js/main.js` → `../src/js/member.js` (all `defer`).

**Checkpoint**: Shared catalogs + module skeleton + rewired shell + scaffold ready — user stories can now proceed.

---

## Phase 3: User Story 1 - Sign in & create a member account experience (Priority: P1) 🎯 MVP

**Goal**: A premium `login.html` and `register.html` with full client-side validation, password-visibility toggles, a
forgot-password modal, social-login placeholders, benefits/trust panels, and an explicit frontend-only honesty contract;
valid submit → toast + inline success with a CTA to `saved-deals.html` (no real account/session).

**Independent Test**: Open `login.html` and `register.html` at 360px and desktop → single `<h1>`, breadcrumb, premium
split layout that stacks; login validates (email + required password), password toggle works, forgot-password modal
validates + "no real email" note; register validates (name/email/phone/password-min-length/confirm-match/required
terms), both password toggles work, password-rules panel present; social placeholders never imply real auth; valid
submit → toast + inline success → CTA to `saved-deals.html`; no horizontal scroll, no dead controls, no browser dialog.

- [x] T009 [US1] Create `pages/login.html` from the scaffold (T008): breadcrumb (الرئيسية / تسجيل الدخول), single `<h1>` "تسجيل الدخول", Arabic page meta + OG (+ `robots noindex`), `data-page="login"`, and a premium **split layout** (form panel + benefits/trust panel) via the page-scoped `<style>` that stacks cleanly ≤ the mobile breakpoint (C1.1).
- [x] T010 [US1] Build the **login form** in `pages/login.html`: required email `.field-input` (`type="email"`, `dir="ltr"`), required password `.field-input` with a show/hide `.btn-icon` (`aria-pressed`/`aria-label`), a remember-me `.field-check`, a forgot-password trigger (`data-modal-open="forgot-password"`), a submit `.btn-primary` with a loading style, a link to `register.html`, and a hidden `[data-frontend-success]` inline-success block with a CTA → `saved-deals.html` (C1.2/C1.3; data-model §5.1).
- [x] T011 [US1] Add the **forgot-password modal** to `pages/login.html`: a `.modal` (id `forgot-password`) with an email `.field-input` (`dir="ltr"`, required), a "لا يتم إرسال بريد حقيقي في هذه النسخة" note, and a validated submit (`data-validate data-frontend-form` + `data-success-toast` + `[data-frontend-success]`) → toast + inline success (C1.4; data-model §5.2).
- [x] T012 [P] [US1] Add the **benefits panel**, **frontend-only honesty block**, and **social-login placeholders** to `pages/login.html`: a benefits list (حفظ العروض المفضلة، تنبيهات الأسعار، تذكير بالكوبونات، متابعة طلبات الحجز لاحقًا، توصيات سفر مستقبلية، قابل للربط لاحقًا بحسابات حقيقية); an `.inline-msg-info` honesty block (نسخة واجهة أمامية فقط، لا يتم إنشاء جلسة حقيقية، قابل للربط لاحقًا بنظام حسابات وداتا حقيقي); and Google/Apple `.btn-outline` placeholders that are `disabled` or carry `data-toast`/`data-toast-type="info"` "قريبًا" (never implying real sign-in) (C1.5/C1.6).
- [x] T013 [US1] Implement the **login block** in `src/js/member.js` (page `login`): wire the password-visibility toggle; on valid login submit (email format + required password via `TUI.validateForm`) → toast + reveal the inline-success block (CTA → `saved-deals.html`) with the submit loading style; never claim a real session/redirect silently (C1.7; D3/D5).
- [x] T014 [US1] Create `pages/register.html` from the scaffold (T008): breadcrumb (الرئيسية / إنشاء حساب), single `<h1>` "إنشاء حساب", Arabic meta + OG (+ `robots noindex`), `data-page="register"`, and a premium **split layout** (form panel + benefits/preferences-preview panel) that stacks cleanly (C2.1).
- [x] T015 [US1] Build the **registration form** in `pages/register.html`: required full name; email (`type="email"`, `dir="ltr"`); phone (`type="tel"`, `dir="ltr"`); password (`minlength`); confirm-password; preferred destination; travel-interest `.field-select` (طيران/فنادق/باقات/عائلات/شهر عسل/عمرة/رحلات اقتصادية/رحلات فاخرة); budget-range control; notification-method control (Email / WhatsApp placeholder / Dashboard); required terms `.field-check`; submit `.btn-primary`; link to `login.html`; plus a hidden `[data-frontend-success]` block (CTA → `saved-deals.html`). Use `data-validate` **without** `data-frontend-form` (member.js owns the success path) (C2.2; data-model §5.3).
- [x] T016 [P] [US1] Add the **password-rules panel**, **dual password-visibility toggles**, **membership-benefits panel**, and **frontend-only trust note** to `pages/register.html`: a rules panel (`.inline-msg-info`/`.card`: الحد الأدنى للطول، تطابق التأكيد، تجنّب الكلمات الضعيفة); show/hide `.btn-icon` toggles on both the password and confirm-password fields; a benefits list (حفظ العروض والكوبونات، إنشاء تنبيهات أسعار، إدارة الوجهات المفضلة، تخصيص الاقتراحات لاحقًا، تسريع طلبات الحجز مستقبلًا); and a trust note (لا يتم إنشاء حساب حقيقي في النسخة الحالية، البيانات لا يتم إرسالها إلى خادم، الصفحة جاهزة للربط لاحقًا بباك إند) (C2.4/C2.5).
- [x] T017 [US1] Implement the **register block** in `src/js/member.js` (page `register`): wire both password-visibility toggles; on submit call `TUI.validateForm(form, {rules})` with rules for password `minlength`, confirm-password **match**, and required **terms** → on valid, toast + reveal inline success (CTA → `saved-deals.html`); no real-account claim (C2.3/C2.6; D5).

**Checkpoint**: `login.html` + `register.html` are fully functional and independently testable — MVP deliverable.

---

## Phase 4: User Story 2 - Manage a hub of saved deals, coupons, destinations & comparisons (Priority: P2)

**Goal**: A `saved-deals.html` member hub with a mock identity header + quick stats, five switchable tabs (deals/
coupons/destinations/comparisons/articles), per-item remove with stat updates and per-tab branded empty states, working
coupon copy, and a frontend-only honesty note.

**Independent Test**: Open `saved-deals.html` at 360px and desktop → member header (mock name + "تجربة تجريبية" badge +
quick stats + CTAs to `price-alerts.html`/`deals.html`/`coupons.html`); tabs switch accessibly (`aria-selected` +
aria-live) showing ≥6 deals / ≥4 coupons / ≥4 destinations / ≥4 comparisons / ≥3 articles; CTAs resolve to the correct
existing pages; coupon copy → toast; remove updates view + stat counts; emptied tab → branded empty state + mock-restore;
invalid mock id never breaks the page; no dead controls, no browser dialog.

- [x] T018 [US2] Create `pages/saved-deals.html` from the scaffold (T008): breadcrumb (الرئيسية / المحفوظات), single `<h1>` "المحفوظات", Arabic meta + OG (+ `robots noindex`), `data-page="saved-deals"`, a small page-scoped `<style>` for tabs + card grids, and a **member header** (mock member name + short welcome from `member-profile.json`, a "تجربة تجريبية" `.badge`, **quick stats** cards — saved deals/coupons/destinations counts + active alerts count, with `data-stat` hooks — and CTAs "إنشاء تنبيه سعر" → `price-alerts.html`, "تصفح العروض" → `deals.html`, "تصفح الكوبونات" → `coupons.html`) (C3.1).
- [x] T019 [US2] Add the **member tabs** to `pages/saved-deals.html`: a `role="tablist"` (العروض المحفوظة / الكوبونات / الوجهات / المقارنات / المقالات) with `role="tab"`/`aria-selected`/`aria-controls`, and five static `role="tabpanel"` `<section>`s (the default panel visible; others `hidden`) so content survives with no JS (C3.2; D7).
- [x] T020 [US2] Render the **saved deals** panel (**≥6** `.card`s from `member-saved.json` `savedDeals`: image+`alt`, title, destination, `.badge-source-*`, "ابتداءً من" `.price`, discount label, expiry, rating, CTA `<a href="deal-details.html?id=<deal-id>">`, a remove `.btn-icon`, and a "إنشاء تنبيه" `.btn-ghost` → `price-alerts.html`) and the **saved coupons** panel (**≥4** `.card`s: discount, code `dir="ltr"` + `data-copy="<CODE>"`, provider, category, expiry, a "استخدم الكوبون" → `coupons.html`, a remove `.btn-icon`) in `pages/saved-deals.html`; each item carries `data-saved-item`/`data-saved-type` (C3.3; data-model §3.1).
- [x] T021 [US2] Render the **saved destinations** panel (**≥4** `.card`/`.dest-card`s: destination/country, best season, related deals & coupons counts, CTA `<a href="destination-details.html?id=<destination-id>">`, compare `<a href="compare.html?destination=<name>">`, remove), the **saved comparisons** panel (**≥4** `.card`s: route/destination, travel month/date, travelers, max budget, last-viewed mock date, CTA `<a href="compare.html?destination=…">`, remove), and the **saved articles** panel (**≥3** `.card`/`.guide-card`s: title/excerpt/category, CTA `<a href="article.html?id=<article-id>">`, remove) in `pages/saved-deals.html` (C3.3).
- [x] T022 [P] [US2] Add a branded `.empty-state` to **each** of the five tabs in `pages/saved-deals.html` (message + a CTA to the relevant page — deals/coupons/destinations/compare/blog — + an optional "استعادة العناصر التجريبية" mock-restore action), and a **frontend-only note** (`.inline-msg-info`: المحفوظات هنا تجريبية؛ في النسخة الحقيقية سيتم حفظها في حساب المستخدم) (C3.4/C3.5).
- [x] T023 [US2] Implement the **saved-deals block** in `src/js/member.js` (page `saved-deals`): tab switching (toggle `hidden` + `aria-selected` + `aria-live` announce); item **remove** (`data-saved-item` → remove from DOM, update the relevant quick-stat count, toast); show the tab's `.empty-state` when its last item is removed; the **mock-restore** action (re-render the tab's default items + toast); the "إنشاء تنبيه" links navigate to `price-alerts.html`. Coupon copy reuses the existing `data-copy` wiring (no new code) (C3.4; D7).

**Checkpoint**: `saved-deals.html` switches tabs, removes items to empty states, and copies coupons independently.

---

## Phase 5: User Story 3 - Create & manage frontend-only price alerts (Priority: P2)

**Goal**: A `price-alerts.html` with a hero, stats cards, a validated create-alert form with method-dependent fields,
≥6 mock alert cards with edit/pause-activate/delete/view-deals/compare actions, custom edit + delete-confirm modals, a
how-it-works section, a branded empty state, and a FAQ — all frontend-only.

**Independent Test**: Open `price-alerts.html` at 360px and desktop → single `<h1>`, breadcrumb, hero (frontend-only/
integration-ready) + CTAs; stats cards consistent with the set; create-alert form validates with method-dependent
fields (Flight→from; Email→email; WhatsApp→phone), valid submit → toast + inline success (+ optional new card); ≥6
"مثال توضيحي" cards with edit (modal, validated), pause/activate (badge + stats), delete (custom confirm modal → remove
+ toast), view-deals/compare links; empty state when all deleted; FAQ ≥5; no browser `confirm()`.

- [x] T024 [US3] Create `pages/price-alerts.html` from the scaffold (T008): breadcrumb (الرئيسية / تنبيهات الأسعار), single `<h1>` "تنبيهات الأسعار", Arabic meta + OG (+ `robots noindex`), `data-page="price-alerts"`, a small page-scoped `<style>` for the stats grid + alert cards, and a **hero** (alerts for destinations/flights/hotels/packages; explicitly frontend-only + integration-ready; CTAs "إنشاء تنبيه جديد", "تصفح العروض" → `deals.html`, "قارن الأسعار" → `compare.html`) (C4.1).
- [x] T025 [P] [US3] Add the **stats cards** to `pages/price-alerts.html`: active / paused / triggered-mock alerts, destinations watched, average target budget — `.card`s with `data-stat` hooks, values consistent with the rendered alert set from `price-alerts.json` (C4.2).
- [x] T026 [US3] Build the **create-alert form** in `pages/price-alerts.html`: alert-type control (Flight/Hotel/Package/Destination); a "from" `.field-input` (shown/required when Flight); a required to/destination; a required travel month `.field-select`; a required max budget `.field-input` (`type="number"`); a travelers count; a notification-method control (Email/WhatsApp placeholder/Dashboard); an email `.field-input` (`dir="ltr"`, required when Email) and a phone `.field-input` (`dir="ltr"`, required/placeholder when WhatsApp); an optional notes `.field-textarea`; a hidden `[data-frontend-success]` block. Use `data-validate` **without** `data-frontend-form` (member.js owns success + dynamic fields) (C4.3; data-model §5.4).
- [x] T027 [US3] Render the **alert cards list** (**≥6** `.card`s from `price-alerts.json`) in `pages/price-alerts.html`, each with: alert type, route/destination, target price + current sample price, a status `.badge` (Active/Paused/Triggered mock), travel month, travelers, notification method (UI), last-checked mock date, a "مثال توضيحي" note, and actions edit (`data-modal-open="edit-alert"`), pause/activate, delete (`data-modal-open="delete-alert"`), "عروض مطابقة" → `deals.html`, and "قارن" → `compare.html?destination=…`; each card carries `data-alert`/`data-alert-status`/`data-alert-type` (C4.4; data-model §3.2).
- [x] T028 [US3] Add the **edit-alert modal** (`.modal` id `edit-alert`: destination/route, max budget `type="number"`, travel month, notification method, status — `data-validate`, no `data-frontend-form`), the **delete-confirm modal** (`.modal` id `delete-alert`: confirm/cancel — never `confirm()`), and a branded `.empty-state` (CTA "إنشاء تنبيه جديد" / "تصفح العروض" → `deals.html`) shown when all alerts are deleted, to `pages/price-alerts.html` (C4.5; data-model §5.5).
- [x] T029 [P] [US3] Add the **how-alerts-work** section (`<h2>` + prose: البيانات حالياً تجريبية؛ يمكن ربطها لاحقًا بـ APIs؛ يمكن إرسال الإشعارات لاحقًا عبر البريد/واتساب؛ تعتمد التنبيهات على تفضيلاتك ومصادر البيانات) and a **FAQ** of **≥5** `<details>` items (هل التنبيهات تعمل حقيقي الآن؟ / هل يمكن إرسال التنبيه على واتساب؟ / هل الأسعار مباشرة؟ / كيف يتم تحديد السعر المستهدف؟ / هل يمكن ربطها بمصادر أسعار مستقبلًا؟) + `BreadcrumbList` + `FAQPage` JSON-LD (no live-monitoring/notification assertion) to `pages/price-alerts.html` (C4.6/C4.7).
- [x] T030 [US3] Implement the **price-alerts block** in `src/js/member.js` (page `price-alerts`): method-dependent field toggling (Flight reveals/requires "from"; Email requires email; WhatsApp requires/placeholder phone) on `change`; create submit via `TUI.validateForm(form,{rules})` → toast + inline success + append a mock alert card + update stats; edit-modal pre-fill from the chosen card → validated save → update the visible card + toast + close; pause/activate → flip the status badge + update stats + toast; delete-confirm → remove the card + toast (+ show empty state if last); keep all confirmations in custom modals (C4.3–C4.5; D5/D9).

**Checkpoint**: `price-alerts.html` supports the full create/edit/pause/delete loop via custom modals, independently.

---

## Phase 6: User Story 4 - Manage profile, travel preferences & notification settings (Priority: P3)

**Goal**: A `profile.html` with a mock-identity header + account sub-nav, a validated personal-info form, a
travel-preferences form, seven notification toggles, and a security placeholder (change-password, 2FA, mock sessions,
logout) — all explicitly disclaiming real password/session/storage, plus a privacy note and a benefits card.

**Independent Test**: Open `profile.html` at 360px and desktop → single `<h1>`, breadcrumb, profile header (mock
identity + "تجربة تجريبية" badge + member-since + quick links) + account sub-nav; personal-info validates → "saved"
toast; travel-prefs save → toast; 7 toggles flip visible state (`aria-checked`) + confirmation; change-password
validates (min-length + confirm-match) → toast + "no real password" note; 2FA placeholder + mock sessions + logout →
toast (+ optional nav to `index.html`); privacy note + benefits card present; no dead controls, no browser dialog.

- [x] T031 [US4] Create `pages/profile.html` from the scaffold (T008): breadcrumb (الرئيسية / الملف الشخصي), single `<h1>` "الملف الشخصي", Arabic meta + OG (+ `robots noindex`), `data-page="profile"`, a small page-scoped `<style>` for the account sub-nav + toggle switches, a **profile header** (mock avatar/initial, name, email, "تجربة تجريبية" `.badge`, member-since date from `member-profile.json`, quick links → `saved-deals.html`/`price-alerts.html`/`deals.html`), and an **account sub-navigation** (الملف الشخصي / المحفوظات / تنبيهات الأسعار / تفضيلات السفر / الإشعارات / الأمان → page or in-page section) (C5.1).
- [x] T032 [US4] Build the validated **personal-information form** (name; email `.field-input` `dir="ltr"`; phone `dir="ltr"`; country; city; preferred language `.field-select`; preferred currency `.field-select`) and the **travel-preferences** form (preferred destinations; travel-interest checkbox group عائلات/شهر عسل/اقتصادي/فاخر/شواطئ/تسوق/عمرة; budget range; preferred hotel stars; preferred travel month/season; default travelers count; airport/city preference) in `pages/profile.html`, pre-filled from `member-profile.json`, each with a submit + a hidden `[data-frontend-success]` (C5.2/C5.3; data-model §5.6/§5.7).
- [x] T033 [P] [US4] Add the **notification-settings** section to `pages/profile.html`: 7 toggles built as native `<input type="checkbox" role="switch">` styled via the page-scoped `<style>` (email alerts، تذكير الكوبونات، تنبيهات هبوط السعر، تذكير انتهاء العروض المحفوظة، WhatsApp placeholder، النشرة البريدية، ملخص أسبوعي), with initial states from `member-profile.json` `notificationPreferences` and `data-notify-toggle` hooks (C5.4; D7).
- [x] T034 [US4] Add the **security placeholder** to `pages/profile.html`: a change-password form (current/new `minlength`/confirm-password — `data-validate`, no `data-frontend-form`) with a "لا يتم تغيير كلمة مرور حقيقية" note; a two-factor-authentication placeholder; a mock active-sessions list (from `member-profile.json` `security`); a **logout** button; plus a **privacy/data note** (`.inline-msg-info`: واجهة أمامية فقط؛ لا تخزين على خادم الآن؛ قابل للحفظ الآمن لاحقًا) and a **member-benefits card** (`.card`: saved deals، تنبيهات، توصيات لاحقًا، تسريع طلب الحجز لاحقًا) (C5.5).
- [x] T035 [US4] Implement the **profile block** in `src/js/member.js` (page `profile`): personal-info & travel-prefs submit → `TUI.validateForm` → "saved" toast (frontend-only); notification toggles → flip `aria-checked`/visual state + confirmation toast (no real-channel claim); change-password submit via `TUI.validateForm(form,{rules})` (min-length + confirm-match) → toast + "no real password changed" note; logout → toast + optional navigate to `index.html` (no real-session claim) (C5.2–C5.5; D5).

**Checkpoint**: `profile.html` validates its forms, flips toggles, and runs the mock change-password/logout independently.

---

## Phase 7: User Story 5 - Reach the member pages from the shell & rewire auth navigation (Priority: P2)

**Goal**: Sync the rewired canonical shell into every inlined copy so the auth CTAs and member entry points resolve to
the real pages across the platform; out-of-scope links keep "coming soon"; nothing removed; identity unchanged.

**Dependency note**: Although P2, this story is sequenced after the page stories because its links target `login.html`/
`register.html`/`saved-deals.html`/`price-alerts.html`/`profile.html` (which must exist). The canonical `partials/`
header/footer were already rewired in T007 and inlined into the five new pages via the scaffold (T008).

**Independent Test**: From the homepage and shell (across multiple pages), header/drawer "تسجيل الدخول" → `login.html`,
drawer "إنشاء حساب جديد" → `register.html`, member entry points → `saved-deals.html`/`price-alerts.html`/`profile.html`;
out-of-scope links still show "coming soon"; every existing section still present; visual identity unchanged.

- [x] T036 [US5] Sync the inlined shell in `pages/index.html` to match the updated canonical `partials/` (header "تسجيل الدخول" → `login.html`; drawer "تسجيل الدخول" → `login.html`, "إنشاء حساب جديد" → `register.html`; the added member entry point(s); all still-out-of-scope links keep `data-coming-soon`) — no homepage section removed (C6.3/C6.5).
- [x] T037 [P] [US5] Sync the inlined shell in the Spec 003 pages — `pages/deals.html`, `pages/deal-details.html`, `pages/compare.html`, `pages/coupons.html` — to match the canonical `partials/` (auth CTAs + member entry points real; others coming-soon), keeping all 1:1 (C6.3; SC-017).
- [x] T038 [P] [US5] Sync the inlined shell in the Spec 004 pages — `pages/destinations.html`, `pages/destination-details.html`, `pages/blog.html`, `pages/article.html` — to match the canonical `partials/`, keeping all 1:1 (C6.3; SC-017).
- [x] T039 [P] [US5] Sync the inlined shell in `pages/styleguide.html` and `pages/components.html` to match the canonical `partials/` (or confirm they carry no standard shell to sync), keeping all 1:1 (C6.3; SC-017).
- [x] T040 [US5] Verify across the shell that out-of-scope links (merchant dashboard, SaaS owner admin, about/contact/privacy/terms/partners, social) still use `data-coming-soon`, that the five member pages' own cross-links resolve (saved → create-alert → compare/deals; profile quick links; login↔register), and that **no existing section was removed** and the visual identity is unchanged vs the prior baseline (C6.4/C6.5; SC-009/SC-017).

**Checkpoint**: The full member layer is reachable from the homepage and shell; no dead ends, no regressions.

---

## Phase 8: Polish & Cross-Cutting Concerns (QA gate)

**Purpose**: Run the `quickstart.md` "done" gate across all five pages + the shell integration, and produce
`qa-results.md`.

- [x] T041 [P] Run `npm run build`; confirm each new page + the homepage make **zero** external CDN/network requests for CSS/JS/fonts/images (SC-013).
- [x] T042 [P] Run the stack-compliance grep gate (`react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(`, excluding node_modules) → no matches; pay special attention that no confirmation uses a browser dialog (SC-002/SC-013).
- [x] T043 [P] Validate HTML structure of the five pages: exactly one `<h1>` each; correct heading order; breadcrumb; skip-link/`#main`/`#toast-root`/`lang="ar" dir="rtl" data-page` present; `robots noindex` where set; any JSON-LD (BreadcrumbList; FAQPage on price-alerts) valid; script order ui.js→main.js→member.js (defer) (SC-014). Run `npx html-validate pages/login.html pages/register.html pages/saved-deals.html pages/price-alerts.html pages/profile.html` → 0 errors.
- [x] T044 Accessibility audit (`npm run audit:a11y` / axe per page → 0 AA violations): keyboard reaches/operates all controls (form fields, password toggles, tabs, remove/copy/create-alert, alert edit/pause/delete/view/compare, notification toggles, change-password, logout, all modals); managed modal focus via `window.TUI`; `aria-invalid`/`aria-describedby` on invalid fields; `aria-pressed`/`aria-checked` on toggles; `role="tab"`/`aria-selected` + `aria-live` on tabs/status; visible focus; reduced-motion respected (SC-015).
- [x] T045 [P] RTL/LTR: `dir="rtl"` default on all five pages; `dir="ltr"` on email/phone/coupon-code/price/number fields (≥1 verified per page); logical properties (no hard-coded LTR); flipping to `dir="ltr" lang="en"` mirrors with no structural breakage; mobile-first grids verified at 360px with no horizontal scroll (SC-001/SC-011).
- [x] T046 [P] Mock-data consistency: `member-saved.json` has `savedDeals`≥6/`savedCoupons`≥4/`savedDestinations`≥4/`savedComparisons`≥4/`savedArticles`≥3 and every `id`/`linkUrl` resolves to an existing entry/page (no dangling links); `price-alerts.json` ≥6 with a status/type spread and page stats consistent; `member-profile.json` values match the static profile header/forms and the initial toggle states (SC-008; M5.2).
- [x] T047 [P] Honesty audit: no copy claims a real account/session, server storage, sent email/WhatsApp notification, changed/reset password, monitored/live price, connected API, or payment; alerts labeled "مثال توضيحي"; auth/save/profile state تجريبية / واجهة أمامية فقط / قابل للربط لاحقًا; forgot-password "no real email"; change-password "no real password"; logout "no real session" (SC-010).
- [x] T048 Performance: static HTML + deferred JS + local-only assets + minified Tailwind → confirm each page interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-016).
- [x] T049 Run the full `quickstart.md` per-page "done" checklist + **non-regression**: confirm `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js` are byte-for-byte unchanged (hash check); the homepage (all Spec 002 sections), the four Spec 003 pages, the four Spec 004 pages, `styleguide.html`, `components.html` still render and their inlined shell matches canonical `partials/`; session-only behavior verified (reload restores mock defaults); zero console errors on the new pages (SC-017/SC-018).
- [x] T050 Produce `specs/005-member-auth-saved-alerts/qa-results.md` recording build pass, HTML validation, grep gate, a11y/RTL/perf results, login/register validation, password visibility, forgot-password modal, saved tabs/remove/empty-states, coupon copy, price-alert create/edit/delete + pause/activate, profile/settings validation, notification toggles, logout mock, navigation rewiring, non-regression of Spec 001–004, and the honesty audit.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup — **blocks all user stories** (provides `member-saved.json`,
  `price-alerts.json`, `member-profile.json`, the `member.js` skeleton, the rewired canonical `partials/`, and the page
  scaffold).
- **User Stories (Phases 3–7)**: after Foundational.
  - US1 (P1, login+register), US2 (P2, saved-deals), US3 (P2, price-alerts), US4 (P3, profile) each build **distinct
    page files** → independent.
  - US5 (P2) is sequenced **last** among stories: it syncs the shell into the existing pages and verifies the links to
    the pages built in US1–US4.
- **Polish (Phase 8)**: after all desired stories are complete.

### User-story dependencies

- **US1**: after Foundational. Builds `login.html` + `register.html`; no dependency on other stories.
- **US2**: after Foundational. Uses `member-saved.json` + reused catalogs; links to `price-alerts.html` but is
  independently testable.
- **US3**: after Foundational. Uses `price-alerts.json`; fully independent.
- **US4**: after Foundational. Uses `member-profile.json`; links to `saved-deals.html`/`price-alerts.html`;
  independently testable.
- **US5**: after US1–US4 (links must resolve). Canonical `partials/` already rewired in T007.

### Shared-file note (serialization point)

- `src/js/member.js` is touched by T006 (skeleton), T013 (US1 login block), T017 (US1 register block), T023 (US2
  saved-deals block), T030 (US3 price-alerts block), and T035 (US4 profile block). These edit **different per-page
  blocks** of the same file → keep them sequential (not `[P]` with each other) or coordinate merges. All other per-story
  work is in distinct page/data files.
- `partials/header.html`/`footer.html` are edited once (T007); the inlined copies are synced in T036–T039.

### Parallel opportunities

- T002 (Setup) ∥ nothing blocking; T003/T004/T005 (the three data catalogs) are `[P]` with each other.
- After Foundational, the **HTML + content** of US1/US2/US3/US4 can be built in parallel by different people (distinct
  files: `login.html`+`register.html`, `saved-deals.html`, `price-alerts.html`, `profile.html`) — coordinating only the
  `member.js` blocks.
- Within a story, `[P]` tasks (benefits/honesty panels, stats cards, how-it-works/FAQ, notification toggles) touch
  separate sections and can overlap.
- T037–T039 (US5 shell sync of distinct page sets) are `[P]`. Most Polish tasks (T041–T043, T045–T047) are `[P]`.

---

## Parallel Example: after Foundational (cross-story)

```bash
# Different developers, distinct files (coordinate only on src/js/member.js blocks):
Dev A → US1: pages/login.html + pages/register.html   (+ member.js login & register blocks)
Dev B → US2: pages/saved-deals.html                   (+ member.js saved-deals block)
Dev C → US3: pages/price-alerts.html                  (+ member.js price-alerts block)
Dev D → US4: pages/profile.html                       (+ member.js profile block)
# Then US5 syncs the shell across existing pages once the five member pages exist.
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational (CRITICAL — blocks all stories).
2. Phase 3 US1 (`login.html` + `register.html`).
3. **STOP & VALIDATE**: test sign-in/register independently (validation, password toggles, forgot-password modal,
   social placeholders, frontend-only success → CTA to `saved-deals.html`).
4. Demo the MVP.

### Incremental delivery

1. Setup + Foundational → foundation ready.
2. US1 (login + register) → test → demo (MVP: the member entry).
3. US2 (saved-deals) → test → demo (saved-items hub).
4. US3 (price-alerts) → test → demo (alerts CRUD).
5. US4 (profile) → test → demo (profile/preferences/notifications/security).
6. US5 (shell rewiring sync) → test → demo (full member layer reachable, no dead ends).
7. Polish/QA gate + `qa-results.md` → ship.

### Parallel team strategy

1. Team completes Setup + Foundational together.
2. Once Foundational is done: Dev A → US1, Dev B → US2, Dev C → US3, Dev D → US4 (coordinate `member.js` blocks).
3. US5 syncs the shell once the five pages exist; then the Polish/QA gate.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task. `[Story]` maps a task to its user story.
- Each user story is an independently completable, testable increment.
- Reuse existing components/utilities; do not modify `main.js`/`ui.js`/`discovery.js`/`content.js`; introduce no new
  visual identity (only a small page-scoped `<style>` per page for split layout/tabs/toggles/stats/account-nav).
- State is frontend/session-only; keep mock data believable and consistent across pages; never imply a real account,
  session, storage, notification, password change, price monitoring, API, or payment.
- Commit after each task or logical group. Stop at any checkpoint to validate a story independently.
