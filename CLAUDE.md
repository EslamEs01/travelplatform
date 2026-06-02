<!-- SPECKIT START -->
## Active feature: 005-member-auth-saved-alerts

Frontend-first **Travel SaaS Platform**. Current phase builds the **public member layer** the shell only teased —
`login.html` (member sign-in), `register.html` (registration + travel prefs), `saved-deals.html` (saved-items hub:
deals/coupons/destinations/comparisons/articles in switchable tabs), `price-alerts.html` (frontend-only alerts:
create/edit/pause/delete), `profile.html` (profile + travel prefs + notification toggles + security placeholder) —
then **rewires** the shell so header/drawer "تسجيل الدخول"→`login.html`, "إنشاء حساب جديد"→`register.html`, and member
entry points → `saved-deals.html`/`price-alerts.html`/`profile.html` (out-of-scope links keep "coming soon"). Build by
composition on the Spec 001 foundation + Spec 002 homepage + Spec 003 discovery + Spec 004 content: reuse the inlined
shell, design tokens, components, and `window.TUI` (`data-*`). Core content is **static HTML** (renders without JS);
one **new additive** `src/js/member.js` (5 new pages only, dispatched by `<html data-page>`) adds password-visibility
toggles, member tabs, saved-item removal + empty-state, price-alert create/edit/pause/delete (+ edit & delete-confirm
**custom modals**), notification toggles, save feedback, and the logout mock. Forms reuse `window.TUI.validateForm(form,
{rules})`; simple forms reuse `data-validate data-frontend-form`, while cross-field/dynamic forms (register/
change-password confirm-match + min-length; create/edit-alert method-dependent fields) are owned by `member.js` (omit
`data-frontend-form`). Confirmations use the existing `.modal`/`TUI.modal` — **no browser dialogs**. State is
**frontend/session-only** (in-memory; reload restores mock defaults — no real account/session/server). New mock data:
`assets/data/member-saved.json` + `price-alerts.json` (≥6) + `member-profile.json`; saved items **reuse** existing
`deals`/`coupons`/`destinations-full`/`compare-offers`/`articles` ids & links. `src/js/main.js` + `src/js/ui.js` +
`src/js/discovery.js` + `src/js/content.js` stay **unchanged**. No new visual identity, no foundation rebuild, no
backend/CMS, no existing section removed. Product honesty: never a real account, session, storage, notification,
password change, price monitoring, API, or payment — تجريبية / واجهة أمامية فقط / قابل للربط لاحقًا.

**Key decisions (research D1–D10)**: static-HTML + JS-enhancement; no real auth gate → mock member identity; state
session-only (reload restores defaults); login/register success = toast + inline + CTA to `saved-deals.html` (no silent
real-auth redirect); new additive `member.js` (5 pages, `<html data-page>` dispatch); reuse `TUI.validateForm(form,
{rules})` for cross-field validation; tabs/toggles/stats/account-nav via small page-scoped `<style>` (no new global
component); custom modals for forgot-password/edit-alert/delete-confirm; new `member-saved.json`/`price-alerts.json`
(≥6)/`member-profile.json` reusing existing entity ids.

**Read the current plan and its design artifacts:**

- Plan: `specs/005-member-auth-saved-alerts/plan.md`
- Spec: `specs/005-member-auth-saved-alerts/spec.md`
- Research (decisions D1–D10): `specs/005-member-auth-saved-alerts/research.md`
- Page/section inventory, schemas, interaction & form maps: `specs/005-member-auth-saved-alerts/data-model.md`
- Contracts: `specs/005-member-auth-saved-alerts/contracts/` (member-pages, mock-data)
- Quickstart & QA gate: `specs/005-member-auth-saved-alerts/quickstart.md`
- Reused content pages (Spec 004): `specs/004-destinations-blog-seo/`
- Reused discovery pages (Spec 003): `specs/003-public-discovery-pages/`
- Reused homepage (Spec 002): `specs/002-public-homepage/`
- Foundation reused (Spec 001): `specs/001-frontend-foundation/` (page-shell, ui-utilities, component-patterns)
- Governing constitution: `.specify/memory/constitution.md`

**Stack (non-negotiable)**: HTML + local Tailwind CSS v3.4 build (PostCSS) + vanilla JS only.
Forbidden: React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN, browser `alert()`. Arabic RTL primary,
English-ready, mobile-first, WCAG 2.1 AA, standalone backend-ready pages, no CDN at runtime.
<!-- SPECKIT END -->
