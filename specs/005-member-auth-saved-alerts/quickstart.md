# Quickstart: Member Auth, Saved Deals & Price Alerts

**Feature**: `005-member-auth-saved-alerts` | **Date**: 2026-06-02

How to build, preview, and verify the five new public member pages (`login.html`, `register.html`, `saved-deals.html`,
`price-alerts.html`, `profile.html`) plus the shell navigation rewiring. The toolchain is unchanged from Spec 001–004
(HTML + local Tailwind v3.4 build + vanilla JS, **no CDN, no framework**). This feature is static composition + mock
content on the existing foundation, enhanced by one additive JS module (`member.js`). Everything is **frontend-only**:
no real account, session, storage, notification, or price monitoring.

## Prerequisites

- Node.js ≥ 18 LTS + npm (build-time only; already installed in Spec 001).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Build & preview

```bash
cd travel-saas-frontend
npm run build      # regenerate assets/css/tailwind.css from src/input.css (--minify)
npm run watch      # incremental during development
npm run serve      # static server → http://localhost:3000/pages/login.html
```

Preview the member loop end-to-end:
- `…/pages/index.html` → header "تسجيل الدخول" → `login.html`; drawer "إنشاء حساب جديد" → `register.html`
- `…/pages/login.html` → toggle password visibility; submit empty (errors) then valid (toast + inline success → CTA to `saved-deals.html`); open forgot-password modal → validate email → toast; click a social placeholder → "coming soon" toast
- `…/pages/register.html` → toggle both password fields; submit with mismatched confirm / unchecked terms (errors) then valid (toast + inline success)
- `…/pages/saved-deals.html` → switch all 5 tabs; copy a saved coupon (toast); remove items until a tab empties (empty state) → mock-restore; "create alert" → `price-alerts.html`
- `…/pages/price-alerts.html` → create an alert (type=Flight reveals "from"; method=Email requires email) → toast + new card; edit a card (modal) → toast; pause/activate a card (badge + stats update); delete a card (custom confirm modal) → toast; delete all → empty state
- `…/pages/profile.html` → save personal info / preferences (toast); flip notification toggles (toast); change password mismatch (error) then valid (toast + "no real password" note); logout → toast (+ nav to `index.html`)

> Rebuild after editing markup so Tailwind's content scan picks up newly-used utility classes. The Tailwind config globs
> (`./pages/**/*.html`, `./partials/**/*.html`, `./src/js/**/*.js`) already cover the new pages and `member.js`.

## 2. Per-page "done" checklist (Constitution gate)

A page is **NOT done** until all pass. Run for **each** of the five pages.

**All pages**
- [ ] **Standalone**: renders served as a static file; no console errors; **zero external CDN/network requests** for
      CSS/JS/fonts/images (SC-013).
- [ ] **No-JS baseline**: with JavaScript disabled, the core content (auth forms / member header + initial saved items /
      initial alert cards / profile forms with mock values) renders and is readable (SC-001/SC-018; FR-005).
- [ ] **Session-only honesty**: removals / alert CRUD / toggles / saves are in-memory; reload restores mock defaults; no
      copy claims server-side or permanent storage (FR-031; research D2).
- [ ] **RTL + mobile-first**: Arabic `dir="rtl"` default; usable at 360px with **no horizontal scroll** (SC-001); touch
      targets ≥ ~44px; email/phone/coupon-code/price use `dir="ltr"` (SC-011/SC-015).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors layout with no structural breakage (SC-011).
- [ ] **Design-system fidelity**: ≥95% styling via tokens/utilities; only a small page-scoped `<style>` for split
      layout / tabs / toggles / stats / account-nav; no new visual identity (SC-012).
- [ ] **No dead interactions**: zero bare `#` without a handler, zero dead buttons, zero `alert()`/`confirm()`/
      `prompt()` — all confirmations use custom modals (SC-002).
- [ ] **SEO/semantics**: exactly one `<h1>`, correct heading order, the specified breadcrumb, required Arabic
      title/meta; member/auth pages MAY be `robots noindex`; any JSON-LD describes the frontend-only mock honestly
      (SC-014).
- [ ] **Honest copy**: no real-account/session/storage/notification/password-change/price-monitoring/API/payment claims;
      alerts "مثال توضيحي"; auth/save/profile state تجريبية / واجهة أمامية فقط / قابل للربط لاحقًا (SC-010).
- [ ] **Accessibility WCAG 2.1 AA**: `npm run audit:a11y` → 0 violations; keyboard reaches/operates 100% of controls
      (form fields, password toggles, tabs, remove/copy/create-alert, alert edit/pause/delete/view/compare, notification
      toggles, change-password, logout, all modals); visible focus; managed modal focus; reduced-motion respected;
      `[aria-live]` announces tab/status changes (SC-015).
- [ ] **Performance**: interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-016).

**`login.html`**
- [ ] Split layout (form + benefits/trust) stacks cleanly; one `<h1>` "تسجيل الدخول"; breadcrumb (SC-003).
- [ ] Login form validates (email format + required password); password-visibility toggle works (SC-003).
- [ ] Forgot-password modal validates email + "no real email" note → toast + inline success (SC-003).
- [ ] Social-login placeholders never imply real auth; benefits panel + frontend-only honesty block present (SC-003/SC-010).
- [ ] Valid submit → toast + inline success with CTA → `saved-deals.html`; no real-session claim (SC-003/SC-010).

**`register.html`**
- [ ] Split layout; one `<h1>` "إنشاء حساب"; breadcrumb (SC-004).
- [ ] Validates name/email/phone/password-min-length/confirm-match/required-terms; both password toggles work;
      password-rules panel present (SC-004).
- [ ] Membership-benefits panel + frontend-only trust note; valid submit → frontend-only success (CTA → `saved-deals.html`),
      no real-account claim (SC-004/SC-010).

**`saved-deals.html`**
- [ ] Member header (mock name + "تجربة تجريبية" badge + quick stats + CTAs to `price-alerts.html`/`deals.html`/`coupons.html`) (SC-005).
- [ ] Tabs switch accessibly (`aria-selected` + aria-live): ≥6 deals / ≥4 coupons / ≥4 destinations / ≥4 comparisons /
      ≥3 articles (SC-005).
- [ ] CTAs resolve to the correct existing pages (`deal-details.html?id=`, `coupons.html`, `destination-details.html?id=`,
      `compare.html?destination=`, `article.html?id=`); coupon copy → toast; remove updates view + stat counts; emptied
      tab → branded empty state + mock-restore (SC-005).
- [ ] Frontend-only note; invalid/missing mock id never breaks the page (SC-005/SC-010).

**`price-alerts.html`**
- [ ] Hero (frontend-only/integration-ready) + CTAs; stats cards consistent with the set; one `<h1>` "تنبيهات الأسعار" (SC-006).
- [ ] Create-alert form validates with method-dependent fields (Flight→from; Email→email; WhatsApp→phone); valid submit
      → toast + inline success (+ optional new card); no real-notification claim (SC-006).
- [ ] ≥6 alert cards ("مثال توضيحي") with edit (modal, validated), pause/activate (badge + stats), delete (custom confirm
      modal → remove + toast), view-deals/compare links; empty state when all deleted (SC-006).
- [ ] How-alerts-work section + FAQ ≥5; JSON-LD BreadcrumbList + FAQPage (no live-monitoring claim) (SC-006/SC-014).

**`profile.html`**
- [ ] Profile header (mock identity + "تجربة تجريبية" badge + member-since + quick links) + account sub-nav; one `<h1>`
      "الملف الشخصي" (SC-007).
- [ ] Personal-info form validates → "saved" toast; travel-preferences save → toast (SC-007).
- [ ] 7 notification toggles flip visible state (`aria-checked`) + frontend-only confirmation (SC-007).
- [ ] Security: change-password validates (min-length + confirm-match) → toast + "no real password" note; 2FA
      placeholder; mock active-sessions list; logout → toast (+ optional nav to `index.html`); privacy note + benefits
      card present (SC-007/SC-010).

**Navigation rewiring + non-regression**
- [ ] Header "تسجيل الدخول" → `login.html`; drawer "تسجيل الدخول" → `login.html`, "إنشاء حساب جديد" → `register.html`;
      member entry points → `saved-deals.html`/`price-alerts.html`/`profile.html`; out-of-scope links keep "coming soon"
      (SC-009).
- [ ] **No existing section removed**; visual identity unchanged vs the prior baseline (SC-009/SC-017).
- [ ] `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js` unchanged; the homepage, the four Spec
      003 pages, the four Spec 004 pages, `styleguide.html`, `components.html` still render and their shell matches
      canonical `partials/` (SC-017).

## 3. Stack-compliance hard gate

```bash
# Must return NO matches (excluding node_modules):
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
```

Any match fails review (Principle II / SC-013).

## 4. Validation commands

```bash
npx html-validate pages/login.html pages/register.html pages/saved-deals.html pages/price-alerts.html pages/profile.html  # 0 errors
npx stylelint "src/**/*.css"                                          # 0 errors (only if input.css touched)
npx prettier --check "src/js/**/*.js" "pages/*.html"
npm run serve & axe http://localhost:3000/pages/login.html            # repeat per page → 0 AA violations
```

## 5. Mock-data consistency check

- [ ] `member-saved.json` has `savedDeals`≥6 / `savedCoupons`≥4 / `savedDestinations`≥4 / `savedComparisons`≥4 /
      `savedArticles`≥3; every `id`/`linkUrl` resolves to an existing entry/page — no dangling links.
- [ ] `price-alerts.json` ≥6 alerts (full schema; mix of active/paused/triggered; ≥2 types); page stats consistent with
      the set.
- [ ] `member-profile.json` one member; values match the static profile-header + form defaults; `notificationPreferences`
      match the initial toggle states.
- [ ] Reused `deals.json`/`coupons.json`/`destinations-full.json`/`compare-offers.json`/`articles.json` are unchanged.

## Where things live

- Pages → `pages/login.html`, `pages/register.html`, `pages/saved-deals.html`, `pages/price-alerts.html`,
  `pages/profile.html`.
- Reused shell → `partials/head.html`, `partials/header.html`, `partials/footer.html` (header/footer updated for the
  auth/member nav rewiring; copies inlined per page).
- Reused tokens/components → `tailwind.config.js`, `src/input.css` (`.btn`/`.card`/`.badge*`/`.field*`/`.modal`/
  `.empty-state`/`.inline-msg`/`.breadcrumb`/`.chip-group`).
- Reused interactions → `src/js/ui.js` (`window.TUI`, incl. `validateForm(form,{rules})`) + `src/js/main.js`
  (declarative `data-*`, incl. `data-coming-soon`, `data-validate`/`data-frontend-form`) + `src/js/discovery.js` (Spec
  003) + `src/js/content.js` (Spec 004) — **all unchanged**.
- New page logic → `src/js/member.js` (password toggles, tabs, saved-item removal + empty-state, alert CRUD + custom
  modals, notification toggles, save feedback, logout); loaded on the five new pages only, dispatched by `<html
  data-page>`.
- Mock content → `assets/data/member-saved.json` (NEW), `price-alerts.json` (NEW), `member-profile.json` (NEW);
  `deals.json`/`coupons.json`/`destinations-full.json`/`compare-offers.json`/`articles.json` (reused unchanged);
  `assets/images/*` (reused SVG placeholders).
- Contracts → `specs/005-member-auth-saved-alerts/contracts/` (member-pages, mock-data).
- QA artifact → `qa-results.md` (produced after implementation).
