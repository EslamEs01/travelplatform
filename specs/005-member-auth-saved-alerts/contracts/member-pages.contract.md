# Contract: Member Auth, Saved Deals & Price Alerts Pages

**Feature**: `005-member-auth-saved-alerts` | **Date**: 2026-06-02

This contract defines the **observable structure and behavior** each new page MUST satisfy, plus the shell
**navigation-rewiring** contract. It is the acceptance surface for `/speckit-tasks` and QA. "MUST" items are
non-negotiable; they trace to the spec's FRs/SCs and the constitution. All pages reuse the inlined shell, design tokens,
components, and `window.TUI`; only `src/js/member.js` is added (no change to `main.js`/`ui.js`/`discovery.js`/`content.js`).

---

## C0. Shared page contract (all five pages)

- **C0.1** Standalone HTML5 document: `<html lang="ar" dir="rtl" data-page="…">`, inlined `head`/`header`/`footer` 1:1
  with `partials/`, `#main` landmark, skip link, `#toast-root`. Renders with no console errors and **zero external
  CDN/network requests** for CSS/JS/fonts/images. (FR-003/FR-004; SC-001/SC-013)
- **C0.2** Loads `../src/js/ui.js`, `../src/js/main.js`, `../src/js/member.js` (all `defer`). No inline page JS beyond
  optional JSON-LD and any safe inline JSON/mock-data block. (research D4)
- **C0.3** Exactly one `<h1>`; `<h2>` section headings; `<h3>` card/sub-section titles; correct heading order; the
  specified breadcrumb; full meta (Arabic title + description, viewport, theme-color, OG baseline). Member/auth pages MAY
  set `<meta name="robots" content="noindex">` while remaining structurally correct. (FR-040; SC-014)
- **C0.4** Arabic RTL default, English-ready (logical properties; no hard-coded LTR). Mobile-first, usable 320–360px →
  desktop, **no horizontal scroll**, touch targets ≥ ~44px. Email/phone/coupon-code/price use `dir="ltr"`.
  (FR-037/FR-038; SC-001/SC-011)
- **C0.5** WCAG 2.1 AA: AA contrast, full keyboard operability + visible focus, focus-managed modals, meaningful `alt`,
  labelled fields with programmatic error links (`aria-invalid`/`aria-describedby`), `aria-pressed`/`aria-checked` for
  toggles, `role="tab"`/`aria-selected` (or equivalent) + `aria-live` for tabs/status changes, accessible labels on
  icon-only controls, reduced-motion respected. `npm run audit:a11y` → 0 violations. (FR-039; SC-015)
- **C0.6** No dead interactions: every control navigates, opens/closes the modal/drawer, switches a tab, toggles a
  visible state (save/remove/notification/status/password-visibility), shows a toast, copies, or submits a validated
  form. Zero bare `#` without a handler, zero `alert()`/`confirm()`/`prompt()`. (FR-035/FR-036; SC-002)
- **C0.7** ≥95% of styling via existing tokens/utilities; only a small page-scoped `<style>` for the auth split layout /
  tabs / toggle-switch visuals / stats grid / account sub-nav (as `index.html`). No new visual identity. (FR-001;
  SC-012)
- **C0.8** All content is believable mock; reused deal/coupon source badges limited to Partner/Affiliate/Manual
  Deal/API Ready; safe labels only; alerts explicitly "مثال توضيحي"; every auth/save/alert/notify/profile surface states
  frontend-only / تجريبية / قابل للربط لاحقًا; never implies a real account, session, storage, sent notification,
  changed/reset password, monitored price, connected API, or payment. (FR-031; IX)
- **C0.9** Core/default content renders with JavaScript disabled (static-HTML-first): auth forms; member header +
  initial saved items; initial alert cards; profile forms with mock values. JS only enhances. (FR-005; SC-001/SC-018)
- **C0.10** Member/auth state is **frontend/session-only**: removals, alert CRUD, toggles, and saves are in-memory;
  reload restores the mock defaults; nothing is persisted to a server. (research D2; FR-031)

---

## C1. `login.html` — member sign-in (US1)

- **C1.1** Premium **split layout** (form panel + benefits/trust panel) that stacks cleanly on mobile, with one `<h1>`
  "تسجيل الدخول" and a breadcrumb (الرئيسية / تسجيل الدخول). (FR-006; SC-003)
- **C1.2** Login form with a required email (`type="email"`, `dir="ltr"`), a required password, a remember-me checkbox, a
  forgot-password trigger, a submit button (with a loading style on submit), and a link to `register.html`. Client-side
  validation shows visible valid/invalid/error states (`aria-invalid`/`aria-describedby`). (FR-006; SC-003)
- **C1.3** A **password-visibility** toggle with an accessible label/state. (FR-007; SC-003)
- **C1.4** A **forgot-password modal** (custom `.modal`) with an email field, a "no real email is sent" note, and a
  validated submit → toast + inline success. (FR-007; SC-003)
- **C1.5** A **benefits panel** (حفظ العروض، تنبيهات الأسعار، تذكير بالكوبونات، متابعة الحجوزات لاحقًا، توصيات مستقبلية،
  قابل للربط لاحقًا) and a **frontend-only honesty block** (نسخة واجهة أمامية فقط، لا جلسة حقيقية، قابل للربط لاحقًا).
  (FR-007; SC-003/SC-010)
- **C1.6** **Social-login placeholders** (Google/Apple) that are disabled or show a "coming soon" toast and never imply
  real social sign-in. (FR-007; SC-002/SC-010)
- **C1.7** On **valid** submit: success toast + inline success (frontend-only) with a primary CTA to `saved-deals.html`;
  no silent real-auth redirect, no real-session claim. (FR-008; SC-003/SC-010)

## C2. `register.html` — member registration (US1)

- **C2.1** Premium **split layout** (form + benefits/preferences-preview) that stacks cleanly, one `<h1>` "إنشاء حساب",
  breadcrumb (الرئيسية / إنشاء حساب). (FR-009; SC-004)
- **C2.2** Registration form: required full name, email (`type="email"`, `dir="ltr"`), phone, password, confirm-password;
  preferred destination; travel-interest select (طيران/فنادق/باقات/عائلات/شهر عسل/عمرة/رحلات اقتصادية/رحلات فاخرة); budget
  range; notification method (Email/WhatsApp placeholder/Dashboard); required terms checkbox; submit; link to
  `login.html`. (FR-009; SC-004)
- **C2.3** Client-side validation: required fields, email format, non-empty phone, password **min length**,
  **confirm-password match**, **required terms** — visible valid/invalid/error states. (FR-011; SC-004)
- **C2.4** A **password-rules panel** (min length، تطابق التأكيد، تجنّب الكلمات الضعيفة) and **password-visibility
  toggles for both** password fields. (FR-010; SC-004)
- **C2.5** A **membership-benefits** panel and a **frontend-only trust note** (لا حساب حقيقي، لا إرسال للخادم، جاهزة
  للربط لاحقًا). (FR-010; SC-004/SC-010)
- **C2.6** On **valid** submit: frontend-only success (toast + inline) with a CTA to `saved-deals.html`; no real-account
  claim. (FR-011; SC-004/SC-010)

## C3. `saved-deals.html` — saved-items hub (US2)

- **C3.1** Member header with one `<h1>` "المحفوظات", breadcrumb (الرئيسية / المحفوظات), a mock member name + welcome, a
  "تجربة تجريبية" badge, **quick stats** (saved deals/coupons/destinations + active alerts), and CTAs ("إنشاء تنبيه سعر"
  → `price-alerts.html`, "تصفح العروض" → `deals.html`, "تصفح الكوبونات" → `coupons.html`) — rendered statically.
  (FR-012; SC-005)
- **C3.2** **Member tabs** (العروض المحفوظة / الكوبونات / الوجهات / المقارنات / المقالات) that switch the visible panel
  with `aria-selected` + an `aria-live` announcement; tab content is static, switching is a JS enhancement. (FR-013;
  SC-005)
- **C3.3** Tabs contain **≥6** saved deals (image+alt, title, destination, source badge, "starting from" price, discount,
  expiry, rating, CTA → `deal-details.html?id=`, remove, "create alert"), **≥4** saved coupons (discount, code
  `dir="ltr"`, provider, category, expiry, copy, "use coupon" → `coupons.html`, remove), **≥4** saved destinations
  (destination/country, best season, deals/coupons counts, CTA → `destination-details.html?id=`, compare →
  `compare.html?destination=`, remove), **≥4** saved comparisons (route/destination, month, travelers, max budget,
  last-viewed date, CTA → `compare.html?…`, remove), and **≥3** saved articles (CTA → `article.html?id=`). Saved-item
  ids/links reuse the existing catalogs. (FR-014; SC-005)
- **C3.4** **Remove** visually removes the item, updates the relevant quick-stat count, and shows a toast; **copy** (saved
  coupons) copies the `dir="ltr"` code with a success confirmation; **"create alert"** navigates to `price-alerts.html`
  (optionally pre-seeding context). Each tab shows a branded **empty state** (message + CTA + optional mock-restore) when
  it has no items. No browser dialog. (FR-015; SC-005)
- **C3.5** A **frontend-only note** (المحفوظات تجريبية؛ ستُحفظ في حساب المستخدم في النسخة الحقيقية). Every saved-item CTA
  resolves to a valid existing page; an invalid/missing mock id never breaks the page. (FR-016; SC-005/SC-010)

## C4. `price-alerts.html` — alerts management (US3)

- **C4.1** One `<h1>` "تنبيهات الأسعار", breadcrumb (الرئيسية / تنبيهات الأسعار), and a **hero** stating alerts are
  frontend-only/integration-ready with CTAs ("إنشاء تنبيه جديد", "تصفح العروض" → `deals.html`, "قارن الأسعار" →
  `compare.html`). (FR-017; SC-006)
- **C4.2** **Stats cards**: active / paused / triggered-mock alerts, destinations watched, average target budget —
  consistent with the rendered alert set. (FR-018; SC-006)
- **C4.3** A validated **create-alert form**: type (Flight/Hotel/Package/Destination); "from" shown/required when Flight;
  required to/destination; required travel month; required max budget; travelers; method (Email/WhatsApp/Dashboard) with
  email required when Email and phone required/【placeholder】when WhatsApp; optional notes. On valid submit → toast +
  inline success + MAY append a mock alert card; no real-notification claim. (FR-019; SC-006)
- **C4.4** **≥6** alert cards, each with type, route/destination, target + current sample price, status badge
  (Active/Paused/Triggered mock), travel month, travelers, notification method, last-checked date, a "مثال توضيحي" note,
  and actions edit / pause-activate / delete / view-deals (→ `deals.html`) / compare (→ `compare.html?destination=…`).
  (FR-020; SC-006)
- **C4.5** An **edit-alert modal** (destination/route, max budget, travel month, method, status) validated → toast +
  update the visible card; a **custom delete-confirm modal** (never `confirm()`) → remove the card + toast; a
  **pause/activate** toggle flipping the status badge (+ stats) with a toast; a branded **empty state** (CTA create /
  browse deals) when all alerts are deleted. (FR-021; SC-006)
- **C4.6** A **how-alerts-work** section (mock now; future APIs; future email/WhatsApp; depends on prefs/sources) and a
  **FAQ ≥5** (incl. هل التنبيهات تعمل حقيقي الآن؟ / واتساب؟ / أسعار مباشرة؟ / تحديد السعر المستهدف؟ / ربط بمصادر لاحقًا؟).
  (FR-022; SC-006)
- **C4.7** JSON-LD: `BreadcrumbList` + `FAQPage` (mirrors the FAQ); no live-monitoring/notification assertion. (FR-041)

## C5. `profile.html` — profile/settings (US4)

- **C5.1** One `<h1>` "الملف الشخصي", breadcrumb (الرئيسية / الملف الشخصي), a **profile header** (mock avatar/initial,
  name, email, "تجربة تجريبية" badge, member-since, quick links → `saved-deals.html`/`price-alerts.html`/`deals.html`),
  and an **account sub-navigation** (الملف / المحفوظات / التنبيهات / تفضيلات السفر / الإشعارات / الأمان). (FR-023;
  SC-007)
- **C5.2** A validated **personal-information form** (name; email `dir="ltr"`; phone; country; city; preferred language;
  preferred currency) → "saved" toast (frontend-only). (FR-024; SC-007)
- **C5.3** A **travel-preferences** form (preferred destinations; interests عائلات/شهر عسل/اقتصادي/فاخر/شواطئ/تسوق/عمرة;
  budget range; hotel stars; travel month/season; default travelers; airport/city pref) → "saved" toast. (FR-025;
  SC-007)
- **C5.4** **Notification-settings toggles** (email alerts, coupon reminders, price-drop alerts, saved-deal expiry
  reminders, WhatsApp placeholder, newsletter, weekly travel summary), each flipping visible state accessibly
  (`aria-checked`) with a frontend-only confirmation; never claims a real channel was enabled. (FR-026; SC-007)
- **C5.5** A **security placeholder**: a validated change-password form (current/new `minlength`/confirm-match) → toast +
  "no real password is changed" note; a 2FA placeholder; a mock active-sessions list; a **logout** button → toast + MAY
  navigate to `index.html` (no real session claim). Plus a **privacy/data note** and a **member-benefits card**.
  (FR-027; SC-007/SC-010)

---

## C6. Navigation rewiring contract (US5)

- **C6.1** Canonical `partials/header.html` updated so the desktop **"تسجيل الدخول"** CTA → `login.html` and the drawer
  **"تسجيل الدخول"** / **"إنشاء حساب جديد"** → `login.html` / `register.html`, with `data-coming-soon` **removed**.
  (FR-032)
- **C6.2** **Member entry points** added additively to the shell (e.g., an account/"حسابي" link → `profile.html` or
  `saved-deals.html`; a "create price alert" affordance → `price-alerts.html`) without removing any existing element.
  (FR-033)
- **C6.3** The identical shell change is applied to **every inlined copy** — `index.html`, the four Spec 003 pages
  (`deals`/`deal-details`/`compare`/`coupons`), the four Spec 004 pages
  (`destinations`/`destination-details`/`blog`/`article`), `styleguide.html`, `components.html`, and the five new pages —
  so all stay 1:1 with `partials/`. (FR-032; SC-009/SC-017)
- **C6.4** Links to still-out-of-scope surfaces (merchant dashboard, SaaS owner admin, unbuilt about/contact/privacy/
  terms/partners, social) **keep** `data-coming-soon`. No navigation to non-existent pages. (FR-034)
- **C6.5** **No existing section is removed**; the visual identity is unchanged; the homepage still renders all Spec 002
  sections. (FR-034; SC-009/SC-017)

---

## C7. Non-regression contract

- **C7.1** `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, and `src/js/content.js` are **unchanged** (no
  behavioral diff). New behavior lives in the additive `src/js/member.js`, loaded only by the five new pages. (research
  D4)
- **C7.2** The homepage (all Spec 002 sections), the four Spec 003 pages, the four Spec 004 pages, `styleguide.html`, and
  `components.html` still render; their inlined shell matches the updated canonical `partials/`. (SC-017)
- **C7.3** Stack-compliance grep gate returns no matches (react/vue/angular/bootstrap/jquery/cdn.tailwindcss/`alert(`/
  `confirm(`/`prompt(`); `npm run build` regenerates cleanly; zero console errors on the new pages. (SC-013/SC-017)
