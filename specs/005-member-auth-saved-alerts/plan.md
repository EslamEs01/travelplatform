# Implementation Plan: Member Auth, Saved Deals & Price Alerts (Travel SaaS Platform)

**Branch**: `005-member-auth-saved-alerts` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-member-auth-saved-alerts/spec.md`

## Summary

Build the five real public **member-layer** pages the shell only teased — `login.html` (member sign-in), `register.html`
(member registration + initial travel preferences), `saved-deals.html` (saved-items hub: deals/coupons/destinations/
comparisons/articles in switchable tabs), `price-alerts.html` (frontend-only price-alerts management with create/edit/
pause/delete), and `profile.html` (profile + travel preferences + notification settings + security placeholder) — then
**rewire** the shared shell so the header/drawer auth CTAs and the member entry points navigate to these real pages
instead of the "coming soon" toast (out-of-scope links keep "coming soon"). This completes the public visitor → member
experience (sign in / register → manage saved items → manage price alerts → tune profile/notifications → logout) on top
of the Spec 001 foundation, Spec 002 homepage, Spec 003 discovery pages, and Spec 004 content pages — as a believable,
clearly-mock, frontend-only prototype that is **explicit and honest** that no real account, session, storage, notification,
or price monitoring exists, while being integration-ready for a future accounts/notifications backend.

**Technical approach**: Static composition + mock content, mirroring the homepage and Spec 003/004 pattern exactly. Each
page is a standalone HTML document that **inlines** the canonical shell (`partials/head|header|footer.html`), reuses the
design tokens (`tailwind.config.js`), component classes (`src/input.css`: `.btn`/`.card`/`.badge*`/`.badge-source-*`/
`.field*`/`.modal`/`.skeleton`/`.empty-state`/`.inline-msg`/`.price`/`.breadcrumb`/`.chip-group`), and the `window.TUI`
utilities wired declaratively via `data-*`. Core content (auth forms; the member header + the initial saved items per
tab; the initial alert cards; the profile forms pre-filled with mock values) is **static HTML** so pages render without
JavaScript (Constitution III); a single **new additive** module `src/js/member.js` (loaded only by the five new pages,
dispatched by `<html data-page>`) enhances them with: password-visibility toggles, member tabs, saved-item removal +
empty-state toggling, price-alert create/edit/pause-activate/delete (with the edit + delete-confirm **custom modals**),
notification toggles, save-profile/settings feedback, and the logout mock — exactly the additive-module precedent set by
Spec 003's `discovery.js` and Spec 004's `content.js`. Form validation reuses the existing `window.TUI.validateForm(form,
{rules})` utility: simple forms reuse the unchanged `data-validate data-frontend-form` auto-handler from `main.js`; forms
needing **cross-field rules** (register/change-password confirm-match + min-length + terms) or **dynamic behavior**
(create/edit-alert method-dependent required fields; success that navigates instead of resetting) are owned by
`member.js` (which calls `TUI.validateForm` with per-form rules). Confirmations (forgot-password, edit-alert,
delete-alert) use the existing `.modal` / `window.TUI.modal` pattern — **no browser dialogs**. Member/auth state is
**frontend/session-only** (in-memory; reload restores mock defaults — no real session, no server). New believable mock
content lives in additive `assets/data/member-saved.json`, `price-alerts.json` (≥6), and `member-profile.json`; saved
items reuse the existing `deals.json`/`coupons.json`/`destinations-full.json`/`compare-offers.json`/`articles.json` ids &
links. **No behavioral change** is made to `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, or `src/js/content.js`;
the only shared-file edits are the constitutionally-required auth/member nav rewiring to `partials/` (+ every inlined
shell copy). No visual identity change; no foundation rebuild; no Spec 002/003/004 surface removed; no backend.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via the existing Tailwind CSS v3.4 local build (PostCSS/Autoprefixer); vanilla
JavaScript (ES2020, classic `defer` scripts — no bundler). Build-time runtime: Node.js ≥ 18 LTS + npm (unchanged from
Spec 001–004).
**Primary Dependencies**: None added. Reuses installed `tailwindcss@^3.4`, `postcss`, `autoprefixer`,
`@tailwindcss/forms`, and the existing `window.TUI` namespace (`toast` / `modal.open|close` / `drawer.open|close|toggle`
/ `validateForm` / `copyToClipboard` / `prefersReducedMotion`). No URL-state requirement is core to this feature (member
pages are not deep-link-filtered like the listings); `member.js` MAY pre-seed an alert from a query param (e.g.,
`price-alerts.html?from=<deal-id>`) but this is an enhancement only. No runtime framework, no CDN.
**Storage**: N/A — no backend/database/CMS/account store. Mock content is realistic, clearly-mock static HTML mirroring
small local `assets/data/*.json` files (`member-saved.json`, `price-alerts.json`, `member-profile.json` new;
`deals.json`/`coupons.json`/`destinations-full.json`/`compare-offers.json`/`articles.json` reused unchanged). Member
state (removals, alert CRUD, toggles, profile saves) is **in-memory/session-only**; reload restores mock defaults;
nothing is persisted to a server. `localStorage` MAY be used only as an optional frontend convenience and no copy claims
permanent/server storage.
**Testing**: Manual QA against the per-page "done" checklist (`quickstart.md`) + automated accessibility audit (axe-core)
targeting WCAG 2.1 AA, HTML validation (`html-validate`), and Prettier/Stylelint. The stack-compliance grep is a hard
gate. No unit-test framework (consistent with Spec 001–004). A `qa-results.md` is produced after implementation.
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major versions.
Mobile-first (~320–360px up to desktop).
**Project Type**: Static frontend web application (single project; five member pages in scope this phase, plus shell
rewiring). No backend tier.
**Performance Goals**: Each page interactive in < 2s under Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT) + 4× CPU
throttle (SC-016); minified CSS reused; lazy non-hero images; zero runtime CDN requests; tabs/CRUD/toggles operate on
the in-page DOM (no network).
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no
`alert()`/`confirm()`/`prompt()`); Arabic-RTL default + English-ready; WCAG 2.1 AA; standalone backend-ready pages
(render without JS); no dead interactions; SEO baseline (semantic HTML, single `<h1>`, heading hierarchy, breadcrumb,
meta); **product-honesty wording** (frontend-only / تجريبية / قابل للربط لاحقًا; never a real account, session, storage,
notification, password change, price monitoring, API, or payment). Reuse the Spec 001–004 foundation unchanged except
additive mock data + the new `member.js` + the required auth/member nav rewiring; preserve the visual identity; remove no
existing section.
**Scale/Scope**: Five pages + shell rewiring. Mock data: saved items (≥6 deals / ≥4 coupons / ≥4 destinations / ≥4
comparisons / ≥3 articles, reusing existing ids), ≥6 price alerts (full schema), one mock member profile. Per-page minima:
login (form + forgot-password modal + benefits + honesty + social placeholders); register (fuller form + password-rules
+ dual visibility toggles + benefits + honesty); saved-deals (member header + 5 tabs + the saved-item minima + per-tab
empty states + honesty note); price-alerts (hero + stats + create form + ≥6 alert cards + edit modal + delete-confirm
modal + how-it-works + empty state + ≥5 FAQ); profile (header + account nav + personal-info + travel-prefs + 7
notification toggles + security placeholder + privacy note + benefits card).

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications (2026-06-02) resolved the six open questions (no real
auth gate / mock identity; session-only state; login-register success behavior; static-HTML-first; new additive
`member.js`; custom-modal confirmations). See `research.md` for the derived technical decisions (D1–D10).*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend member pages; zero backend/account store/notification service. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | Existing local Tailwind build + vanilla JS only; one additive `member.js`. No forbidden libs/CDN/dialogs. Verified by the stack-compliance grep gate. |
| III. Standalone, Backend-Ready Pages | ✅ PASS | Each page is self-contained and **renders core content without JS** (static auth forms; static member header + initial saved items; static initial alert cards; static profile forms with mock values; JS only enhances). Shell inlined 1:1 with `partials/`; semantic, server/CMS-renderable. |
| IV. Premium & Trustworthy | ✅ PASS | Reuses premium tokens + trust signals (source badges on saved deals/coupons, ratings, terms/expiry indicators, explicit frontend-only honesty blocks). No empty/broken UI — branded per-tab and per-list empty states; safe fallbacks for missing mock ids. |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | Inlines `<html lang="ar" dir="rtl">` shell, logical-property utilities, mobile-first breakpoints; English-ready; the auth split layouts, tabs, card grids, and multi-section profile forms reflow to a single column at ≤360px; email/phone/coupon-code/price use `dir="ltr"`. |
| VI. No Dead Interactions | ✅ PASS | Forms validate→toast/inline; password-visibility toggles; tabs switch; saved items remove + empty-state; coupons copy + toast; create/edit/pause/delete alerts via validated forms + **custom modals**; notification toggles flip state; logout toast(+nav); out-of-scope links → coming-soon toast. No bare `#`, no `alert()`/`confirm()`/`prompt()`. |
| VII. Listing & Detail Contracts | ✅ PASS | The saved-items hub and price-alerts list behave as listings: they ship empty states (per tab / when all deleted) and reset/restore (mock-restore) affordances; sorting/filtering is N/A for these curated member lists (documented). The member surfaces carry main info + primary CTA + related actions + FAQ/help (price-alerts FAQ; profile help notes). |
| VIII. SaaS Direction Preserved | ✅ PASS | Adds the public **Member/Traveler** surfaces (auth, saved deals, price alerts, profile) the constitution anticipates; rewires toward them; still-unbuilt surfaces (merchant dashboard, SaaS owner admin, unbuilt about/contact/privacy/terms) keep "coming soon". Nothing removed or simplified. |
| IX. Integration-Ready, Never Faked | ✅ PASS | All member identity/saved-items/alerts/profile are believable mock; reused deal/coupon source badges (Partner/Affiliate/Manual Deal/API Ready) and safe labels; alerts explicitly "مثال توضيحي"; every auth/save/alert/notify/profile surface states frontend-only / تجريبية / قابل للربط لاحقًا; never implies a real account, session, storage, sent notification, changed/reset password, monitored price, connected API, or payment. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, single `<h1>`, heading hierarchy, breadcrumb, per-page Arabic meta; member/auth pages MAY mark `robots noindex` (frontend-only) while staying structurally correct; substantial honest copy + FAQ on price-alerts. Not thin. |
| Technical Standards & File Organization | ✅ PASS | Stays within `travel-saas-frontend/`; additive `assets/data/*.json`, optional `assets/images/*`, `src/js/member.js`; auth/member nav edits to `partials/` + inlined copies. The canonical structure already lists `login`, `register` under `pages/`. See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist in `quickstart.md`; stack-compliance hard gate; preservation rule honored (no existing section removed; `main.js`/`ui.js`/`discovery.js`/`content.js` behavior unchanged). |

**Result**: PASS — no violations. The only shared-file edits are the constitutionally-required auth/member nav rewiring
(FR-032–FR-034) plus additive files; logged in Complexity Tracking. Re-checked after Phase 1 design — still PASS (no new
components, tokens, or visual identity introduced; only a small page-scoped `<style>` per page for the auth split layout,
tabs, toggle-switch visuals, and stats/account-nav, exactly as the homepage and content pages already do).

## Project Structure

### Documentation (this feature)

```text
specs/005-member-auth-saved-alerts/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications 2026-06-02)
├── research.md          # Phase 0 output — decisions D1–D10
├── data-model.md        # Phase 1 output — page/section inventory, schemas, interaction & form maps
├── quickstart.md        # Phase 1 output — build/preview + per-page QA gate
├── contracts/           # Phase 1 output
│   ├── member-pages.contract.md  # per-page structural/behavioral + nav-rewiring + non-regression
│   └── mock-data.contract.md     # member-saved/price-alerts/member-profile schemas + reuse & consistency rules
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── tailwind.config.js        # REUSED unchanged (design tokens; content globs already cover pages/partials/src/js)
├── src/
│   ├── input.css             # REUSED; additive only if an unavoidable composition class is needed
│   └── js/
│       ├── ui.js             # REUSED UNCHANGED (window.TUI; validateForm supports {rules} cross-field validation)
│       ├── main.js           # REUSED UNCHANGED (declarative data-* wiring, incl. data-coming-soon, data-validate/data-frontend-form)
│       ├── discovery.js      # REUSED UNCHANGED (Spec 003 — loaded only by the 4 discovery pages)
│       ├── content.js        # REUSED UNCHANGED (Spec 004 — loaded only by the 4 content pages)
│       └── member.js         # ★ NEW additive — password toggles, tabs, saved-item removal + empty-state,
│                             #   price-alert create/edit/pause/delete (+ edit & delete-confirm modals),
│                             #   notification toggles, save feedback, logout mock; dispatched by <html data-page>;
│                             #   loaded only by the 5 new pages; uses window.TUI (no change to other modules)
├── assets/
│   ├── css/tailwind.css      # BUILD OUTPUT (regenerated; not hand-edited)
│   ├── data/
│   │   ├── member-saved.json   # NEW — saved deals/coupons/destinations/comparisons/articles (ids reuse existing catalogs)
│   │   ├── price-alerts.json   # NEW — ≥6 mock alerts (full schema)
│   │   ├── member-profile.json # NEW — one mock member (personal info + preferences + notification settings)
│   │   ├── deals.json          # REUSED unchanged — saved-deal ids (deal-001…deal-010)
│   │   ├── coupons.json        # REUSED unchanged — saved-coupon ids
│   │   ├── destinations-full.json # REUSED unchanged — saved-destination ids
│   │   ├── compare-offers.json # REUSED unchanged — saved-comparison context (compare.html?destination=)
│   │   └── articles.json       # REUSED unchanged — saved-article ids (article.html?id=)
│   └── images/               # REUSED SVG placeholders (city/beach/heritage/etc.); new additive only if needed
├── partials/                 # CANONICAL shell — auth/member nav links rewired
│   ├── head.html             # REUSED unchanged
│   ├── header.html           # EDIT — "تسجيل الدخول" CTA → login.html (remove data-coming-soon); add member entry point
│   └── footer.html           # EDIT (if applicable) — add/rewire member links; out-of-scope links keep data-coming-soon
└── pages/
    ├── login.html            # ★ NEW — member sign-in (split layout, forgot-password modal, social placeholders)
    ├── register.html         # ★ NEW — member registration (fuller form, password rules, dual visibility toggles)
    ├── saved-deals.html      # ★ NEW — saved-items hub (member header + 5 tabs + per-tab empty states)
    ├── price-alerts.html     # ★ NEW — alerts management (create form + ≥6 cards + edit/delete modals + FAQ)
    ├── profile.html          # ★ NEW — profile/settings (personal-info + travel-prefs + notification toggles + security)
    ├── index.html            # EDIT (sync inlined shell only) — Spec 002 homepage still renders
    ├── deals.html            # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── deal-details.html     # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── compare.html          # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── coupons.html          # EDIT (sync inlined shell only) — Spec 003 page still renders
    ├── destinations.html     # EDIT (sync inlined shell only) — Spec 004 page still renders
    ├── destination-details.html # EDIT (sync inlined shell only) — Spec 004 page still renders
    ├── blog.html             # EDIT (sync inlined shell only) — Spec 004 page still renders
    ├── article.html          # EDIT (sync inlined shell only) — Spec 004 page still renders
    ├── styleguide.html       # EDIT (sync inlined shell only) — still renders, 1:1 with partials
    └── components.html       # EDIT (sync inlined shell only) — still renders, 1:1 with partials
```

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/` (unchanged from Spec 001–004). The
feature is **composition + mock content** (five new `pages/*.html`) + **additive** mock-data JSON (`member-saved.json`,
`price-alerts.json`, `member-profile.json`) + one **additive** `src/js/member.js` + the required **auth/member nav
rewiring** to the canonical `partials/` and every inlined shell copy. No foundation file is rebuilt or behaviorally
changed; `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, and `src/js/content.js` are untouched; the shared shell
stays canonical in `partials/`. The header/footer auth-CTA + member-entry-point change must be applied to every page that
inlines the shell (the five new pages, `index.html`, the four Spec 003 pages, the four Spec 004 pages, `styleguide.html`,
`components.html`) so all stay 1:1 with the canonical source (SC-017). A small page-scoped `<style>` per member page (as
`index.html` and the content pages already do) covers the auth split layout, tabs, toggle-switch visuals, stats grid, and
account sub-nav.

## Complexity Tracking

> Only additive/justified shared-file touches are logged here. There are no principle violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| New `src/js/member.js` (password-visibility toggles, member tabs, saved-item removal + empty-state toggling, price-alert create/edit/pause-activate/delete with custom modals, notification toggles, save feedback, logout mock) | The member pages need tab switching, in-session item removal + empty-state, the full alert CRUD with custom modals, and toggle/logout behaviors that neither the declarative `data-*` layer nor `discovery.js`/`content.js` covers. | Inline `<script>` per page rejected (ui-utilities contract: pages need no bespoke inline JS; a shared module is reusable). Extending `main.js` rejected (adds page-specific concerns to a file loaded by **every** page — regression risk). Extending `discovery.js`/`content.js` rejected (they are the Spec 003/004 modules; mixing member logic risks regressions and the spec scopes a separate file). `main.js`/`ui.js`/`discovery.js`/`content.js` stay unchanged. |
| Auth/member nav edits to `partials/header.html` (+ `footer.html` if applicable) and every inlined copy (`index`/`login`/`register`/`saved-deals`/`price-alerts`/`profile`/`deals`/`deal-details`/`compare`/`coupons`/`destinations`/`destination-details`/`blog`/`article`/`styleguide`/`components`) | FR-032/FR-033 require "تسجيل الدخول"→`login.html`, "إنشاء حساب جديد"→`register.html`, and member entry points → `saved-deals.html`/`price-alerts.html`/`profile.html`; the shell is inlined per page so copies must stay 1:1 with the canonical source. | Runtime partial injection via `fetch` rejected (breaks standalone rendering on `file://`, violates III); leaving inlined copies stale rejected (violates the 1:1 rule and SC-017). Out-of-scope links keep `data-coming-soon`. |
| New `assets/data/member-saved.json` + `price-alerts.json` (≥6) + `member-profile.json` | The member pages need believable, consistent mock catalogs as backend-ready reference data; saved items reuse existing deal/coupon/destination/comparison/article ids so identity stays consistent; alerts/profile mirror the static page content. | Hardcoding everything inline rejected for consistency/reuse; JSON mirrors the existing `deals.json`/`featured.json` convention and is backend/CMS-ready. Saved items reference existing ids rather than duplicating data. |
| Custom **edit-alert** modal + **delete-confirm** modal (and the login **forgot-password** modal) via the existing `.modal`/`window.TUI.modal` pattern | Constitution VI + FR-036 forbid `confirm()`; alert edit/delete and password recovery need confirmation/secondary flows. | Browser `confirm()`/`prompt()` rejected (forbidden by II/VI). A bespoke modal system rejected (the existing `.modal` + `TUI.modal.open/close` + `data-modal-open/close` already provides focus-managed, reduced-motion-aware modals). |
| Member forms validated via `member.js` calling `window.TUI.validateForm(form, {rules})` for cross-field/dynamic cases; simple forms reuse the unchanged `data-validate data-frontend-form` auto-handler | Register/change-password need cross-field rules (confirm-match, min-length, required terms); create/edit-alert need method-dependent required toggling; some successes navigate rather than reset — none of which the generic `data-frontend-form` auto-handler does. | A new validation engine rejected (`TUI.validateForm` already supports a `{rules}` map of per-field callbacks). Modifying `main.js`'s handler rejected (regression risk on every page). Member-owned forms use `data-validate` but **omit** `data-frontend-form` so only `member.js` supplies their success path (no double-handling). |
