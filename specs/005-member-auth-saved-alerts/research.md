# Phase 0 Research: Member Auth, Saved Deals & Price Alerts

**Feature**: `005-member-auth-saved-alerts` | **Date**: 2026-06-02

No `NEEDS CLARIFICATION` items remained after the spec's Clarifications session (2026-06-02), which resolved the six open
questions (no real auth gate → mock member identity; state is frontend/session-only; login/register success = toast +
inline success with a CTA to `saved-deals.html`, never a silent real-auth redirect; rendering = static-HTML-first + JS
enhancement; page logic = a new additive `member.js`; confirmations via custom modal, never browser dialogs). This
document records the remaining technical decisions for building five standalone public member pages on top of the Spec
001 foundation, Spec 002 homepage, Spec 003 discovery pages, and Spec 004 content pages, with **no backend** and **no
change to the existing visual identity**.

The investigation grounded every decision in the real codebase: the shell is **inlined** into each page (canonical
source in `partials/head|header|footer.html`); pages set `<html lang="ar" dir="rtl" data-page="…">` and load
`../src/js/ui.js` → `../src/js/main.js` → `<feature module>` (all `defer`); the page dispatcher reads
`document.documentElement.dataset.page` (Spec 003 `discovery.js` and Spec 004 `content.js` both do this). `window.TUI`
exposes `toast`, `modal.open|close`, `drawer.open|close|toggle`, `validateForm(form, {rules})`, `copyToClipboard`, and
`prefersReducedMotion`. `validateForm` runs **HTML constraint validation** (`field.checkValidity()`) plus an optional
`{rules}` map of per-field callbacks `(value, field) => errorMessage|null`, and wires `aria-invalid` / `.field-error` /
`aria-describedby` automatically. `main.js` has a delegated `submit` listener: any `data-validate` form is validated, and
if it also carries `data-frontend-form` it is `preventDefault`-ed → success toast (`data-success-toast`) → reveal
`[data-frontend-success]` → `form.reset()`. The current auth CTAs in `partials/header.html` (desktop "تسجيل الدخول") and
the drawer ("تسجيل الدخول" + "إنشاء حساب جديد") carry `data-coming-soon` (handled by `main.js` → preventDefault + info
toast). `src/input.css` provides `.btn*`, `.card*`, `.badge*`/`.badge-source-*`, `.field*`, `.modal*`, `.skeleton*`,
`.empty-state`, `.inline-msg*`, `.price`, `.breadcrumb*`, `.chip-group*`, `.drawer*` — but **no** `.tab`, `.switch`/
`.toggle`, stats-grid, or account-nav component, so those are realised with a small page-scoped `<style>` (the same
approach `index.html` and the content pages already use). Spec 003/004 established the exact additive-module precedent
this feature reuses.

---

## D1. Rendering strategy — static HTML + progressive enhancement (NOT client-side fetch-render)

**Decision**: Author every page's core content as **static, server/CMS-renderable HTML** that mirrors the canonical mock
data, exactly like the Spec 002 homepage and the Spec 003/004 pages. The login/register forms; the member header + the
initial set of saved-item cards in each tab; the initial set of price-alert cards; and the profile forms pre-filled with
mock values are all hand-authored static HTML. JavaScript only *enhances* (password visibility, tab switching, item
removal + empty-state toggling, coupon copy, alert create/edit/pause/delete, notification toggles, save feedback,
logout); it never *renders* the baseline content. Cards/items carry machine-readable `data-*` (e.g.,
`data-saved-item`, `data-saved-type`, `data-alert`, `data-alert-status`, `data-alert-type`) so the enhancement layer
acts on the existing DOM with no fetch.

**Rationale**: Constitution III mandates pages that render correctly standalone with no runtime/router; FR-005 and the
JS-unavailable edge case require core content (forms, saved items, alert cards, profile fields, footer, FAQ) to be
readable without JavaScript. Static HTML also avoids layout shift, works on `file://`, and maps cleanly to future
Django/CMS templates. It matches the established homepage/discovery/content pattern.

**Alternatives considered**:
- *Client `fetch()` + render from JSON*: rejected — empty/broken page without JS, layout shift, fragile on `file://`,
  contradicts III/FR-005 and the no-JS edge case.
- *Build-time static-site generator*: rejected — no SSG in the toolchain (just the Tailwind CLI); out of scope.

---

## D2. Auth & member state — frontend/session-only, no real session, no auth gate (clarified)

**Decision**: There is **no real authentication and no auth gate**. All five pages are directly reachable standalone
public pages that render immediately. `saved-deals.html` and `profile.html` display a **mock member identity** (name,
email, member-since) authored statically and mirrored in `member-profile.json`. "Signing in" / "registering" produces a
**frontend-only** success (toast + inline message) and never creates a real account or session. All member mutations —
saved-item removal, alert create/edit/pause-activate/delete, notification-toggle flips, profile/preferences/password
saves — are **in-memory/session-only** changes to the current DOM; a page reload restores the static mock defaults.
`localStorage` MAY be used purely as an optional convenience but **no copy claims permanent or server-side storage**.
Logout is a frontend-only toast that MAY navigate to `index.html`.

**Rationale**: Clarified by the user and required by Constitution IX (never faked) and the spec's product-honesty rules.
Keeping state session-only avoids any implication of real persistence while still demonstrating the full interaction
loop. No client-side router or store is needed (III).

**Alternatives considered**: A real `localStorage`-backed "account" that survives reloads (rejected — risks reading as
real storage and complicates the honesty framing; reload-restores-defaults is the most honest demo); a gated
"logged-in-only" redirect for member pages (rejected — there is no real session to gate on, and gating would create dead
ends / break standalone rendering).

---

## D3. Login/register success behavior — toast + inline success + CTA to `saved-deals.html` (clarified)

**Decision**: On a **valid** login or register submit, the page shows a success **toast** and reveals an **inline
success** block whose primary CTA links to `saved-deals.html` (secondary path to `index.html`). The copy is explicitly
frontend-only ("تجربة تجريبية — لا يتم إنشاء حساب/جلسة حقيقية في هذه النسخة"). The page MAY navigate to
`saved-deals.html` when the visitor activates the CTA, but MUST NOT perform a **silent redirect** that mimics real
authentication, and MUST NOT claim a real session/account was created. The forgot-password modal validates an email and
shows toast + inline success with a "no real email is sent" note.

**Rationale**: Clarified by the user; honesty-first. A visible success-with-CTA both demonstrates the flow and keeps the
"no real auth" promise. Reuses the existing inline-success (`[data-frontend-success]`) + toast pattern.

**Alternatives considered**: Forced `window.location` redirect on submit (rejected — feels like a real session, and a
no-JS submit would post nowhere); toast-only with no inline success/CTA (rejected — the spec requires inline success and
a path onward).

---

## D4. Page-specific behavior — one new additive module `src/js/member.js`

**Decision**: Add a single **new** file `src/js/member.js`, loaded (via `defer`) **only** by the five new pages after
`ui.js`/`main.js`. It dispatches on `document.documentElement.dataset.page` (`login` | `register` | `saved-deals` |
`price-alerts` | `profile`) — the same dispatch Spec 003's `discovery.js` and Spec 004's `content.js` use — and owns:
password-visibility toggles; member **tabs** (ARIA tablist; show/hide panels; `aria-selected`; `aria-live` announce);
saved-item **removal** + per-tab quick-stat updates + empty-state toggling; price-alert **create** (append a mock card),
**edit** (modal), **pause/activate** (status toggle + stats), **delete** (delete-confirm modal + remove); notification
**toggles** (flip `aria-checked`/visual state + save toast); **save** feedback for profile/preferences/change-password;
and the **logout** mock (toast + optional nav). It calls `window.TUI` for toasts/modals and reuses the existing
`data-modal-open`/`data-modal-close`/`data-copy` wiring. **`main.js`, `ui.js`, `discovery.js`, and `content.js` are not
modified; `discovery.js`/`content.js` are not even loaded by these pages.**

**Rationale**: Tabs, item removal/empty-state, the alert CRUD with custom modals, toggles, and logout are genuine page
logic the declarative `data-*` layer does not cover. A dedicated additive module keeps `ui.js` (the `window.TUI`
contract), `main.js` (declarative wiring), `discovery.js`, and `content.js` untouched, and matches the canonical
structure that already anticipates multiple JS files. Keeping it separate avoids any Spec 003/004 regression risk and
matches the spec's explicit scoping (FR-002).

**Alternatives considered**: Inline `<script>` per page (rejected — ui-utilities contract says pages need no bespoke
inline JS); extending `main.js` (rejected — page-specific concerns in a file every page loads → regression risk);
extending `discovery.js`/`content.js` (rejected — risks Spec 003/004 behavior and conflates features' concerns).

---

## D5. Form validation & frontend-only submit — reuse `window.TUI.validateForm(form, {rules})`

**Decision**: All member forms reuse the existing `window.TUI.validateForm` utility (which already runs HTML constraint
validation and an optional per-field `{rules}` map, wiring `aria-invalid`/`.field-error`/`aria-describedby`).
- **Simple forms** (login, forgot-password, create-alert baseline, personal-info, travel-preferences) MAY reuse the
  unchanged `data-validate data-frontend-form` auto-handler in `main.js` (validate → toast → reveal inline success →
  reset).
- **Forms needing cross-field rules or dynamic/custom success** — register (confirm-password match, password min-length,
  required terms), change-password (confirm match + min-length), and the create/edit-alert forms (method-dependent
  required fields; success that *navigates*/*appends a card* rather than just resetting) — are owned by `member.js`,
  which attaches its own `submit` handler, calls `TUI.validateForm(form, {rules:{…}})` with the per-form rule callbacks,
  and renders the frontend-only success (toast + inline + optional navigation/append). To avoid double submit-handling,
  member-owned forms use `data-validate` but **omit** `data-frontend-form` (so `main.js` does not also run the generic
  success path); `member.js` supplies it.

Password **min-length** uses the native `minlength` attribute (caught by `checkValidity()`); **confirm-match** uses a
custom rule comparing the two fields; **required terms** uses `required` on the checkbox; **method-dependent** required
fields are toggled by `member.js` setting/removing `required` on the email/phone inputs as the notification method
changes (and showing/requiring "from" when the alert type is Flight).

**Rationale**: Reuses the proven validation utility and the inline-success/toast pattern without touching `main.js`/
`ui.js`. The `{rules}` hook is exactly the supported extension point for cross-field validation. Mirrors Spec 003/004's
form approach while honoring the member forms' extra needs.

**Alternatives considered**: A bespoke validation engine in `member.js` (rejected — `TUI.validateForm` already exists and
is the contract); modifying `main.js`'s submit handler to accept rules (rejected — regression risk on every page);
HTML-only cross-field validation (rejected — native HTML cannot compare two fields for confirm-match).

---

## D6. Listing & member-page contracts (Constitution VII applied to member surfaces)

**Decision**: Treat the saved-items hub and price-alerts list as **member listings** and the auth/profile pages as
member surfaces with main info + primary CTA + help:
- **Saved hub** (`saved-deals.html`): switchable tabs (deals/coupons/destinations/comparisons/articles); each tab has a
  branded **empty state** (message + CTA to the relevant page + an optional **mock-restore** action) shown when it has
  no items; per-item **remove** updates the view and the quick-stat counts. Filtering/sorting is **N/A** for these
  curated member lists (the tabs *are* the organization) — documented here so the VII "filters/sort" expectation is
  consciously scoped out for curated saved sets, while empty-state + reset(restore) are provided.
- **Price-alerts** (`price-alerts.html`): a create form, ≥6 alert cards, edit/pause/delete actions, a **how-alerts-work**
  help section, a **FAQ** (≥5), and a branded **empty state** when all alerts are deleted (CTA to create / browse deals).
- **Auth/profile**: login/register carry main form + primary CTA + benefits/help + honesty; profile carries header +
  account nav + forms + a privacy/help note + a benefits card.

**Rationale**: These are real member surfaces, so Principle VII's "empty state / reset / help-FAQ where relevant" applies;
sorting/filtering is genuinely not relevant to a small curated saved set or a personal alert list, and the spec does not
require it. Reuses existing `.card`, `.badge*`, `.btn`, `.field*`, `.empty-state`, `.modal`, `.skeleton` patterns.

**Alternatives considered**: Adding filters/sort to the saved tabs (rejected — out of spec scope and over-engineered for
curated sets); a single flat saved list without tabs (rejected — the spec requires typed tabs).

---

## D7. Tabs, toggle switches, stats & account-nav — page-scoped `<style>` over existing tokens

**Decision**: Because `input.css` has no `.tab`, `.switch`/`.toggle`, stats-grid, or account-nav component, realise them
with a **small page-scoped `<style>` block** per member page (the same approach `index.html` and the content pages use),
built from the existing design tokens:
- **Tabs**: an ARIA tablist (`role="tablist"` / `role="tab"` `aria-selected` `aria-controls` / `role="tabpanel"`); panels
  are static `<section>`s; `member.js` toggles a `hidden`/active class and announces via `aria-live`. With no JS, all
  panels can be shown (or the first panel is shown via `:target`/default) so content is never lost.
- **Notification toggles**: native `<input type="checkbox" role="switch">` styled as a switch via page-scoped CSS — works
  with **zero JS** (the checkbox toggles natively); `member.js` adds the "saved" toast and keeps `aria-checked` in sync.
- **Stats cards & account sub-nav**: composed from existing `.card`/`.btn-ghost`/`.badge`/`.breadcrumb` patterns plus a
  small grid/layout style.
- **Auth split layout**: a two-column CSS grid (form panel + benefits/trust panel) that stacks to one column ≤ the
  mobile breakpoint.

**Rationale**: Keeps ≥95% of styling in the existing design system (SC-012) while adding only thin, page-scoped layout
CSS — no new global component, no new visual identity (IV). Native checkbox switches and `:target`/default-visible tabs
keep the no-JS baseline functional (III).

**Alternatives considered**: Adding new global classes to `input.css` (rejected — broader surface/regression risk than a
page-scoped block, and not needed beyond these pages); a JS-only tab/toggle with no no-JS fallback (rejected — would
leave dead controls without JS, violating III/VI).

---

## D8. Mock data layout — additive catalogs reusing existing entity ids

**Decision**: Add three additive catalogs as backend-ready reference data:
- `assets/data/member-saved.json` — arrays for saved `deals` / `coupons` / `destinations` / `comparisons` / `articles`;
  each saved item carries `id`, `type`, type-appropriate display fields, and a `linkUrl` that resolves to an existing
  page (`deal-details.html?id=`, `coupons.html`, `destination-details.html?id=`, `compare.html?…`, `article.html?id=`).
  Referenced ids **reuse** the existing `deals.json`/`coupons.json`/`destinations-full.json`/`compare-offers.json`/
  `articles.json` so identity stays consistent across the platform.
- `assets/data/price-alerts.json` — ≥6 mock alerts with `id`, `type` (flight/hotel/package/destination), route/
  `destination` (+`from` when flight), `travelMonth`, `maxBudget`/target, `travelers`, notification-method UI, email/
  phone placeholder, `status` (active/paused/triggered-mock), `currentSamplePrice`, `lastChecked`.
- `assets/data/member-profile.json` — one mock member (`name`, `email`, `phone`, `country`, `city`,
  `preferredLanguage`, `preferredCurrency`, `preferredDestinations`, `travelInterests`, `budgetRange`,
  `notificationPreferences`, security placeholder).

The **static HTML** is authored to match these catalogs (the JSON is the backend-ready source of truth, not fetched at
runtime in the baseline). `member.js` MAY read a catalog as an inline `<script type="application/json">` block if it
needs to append a mock alert card from a template, mirroring Spec 003/004's inline-catalog pattern — but no page depends
on fetch to render its main content.

**Rationale**: Mirrors the existing `deals.json`/`featured.json` convention; reusing ids keeps cross-page identity
consistent (FR-028/SC-008) and avoids duplicating entity data; JSON is CMS/Django-ready. Honors III (no runtime fetch
for baseline content).

**Alternatives considered**: Hardcoding everything inline only (rejected — loses the backend-ready reference data and
cross-page consistency guarantee); fetching JSON at runtime to render (rejected — III/FR-005, fails on `file://`).

---

## D9. Custom modals & no browser dialogs (forgot-password, edit-alert, delete-confirm)

**Decision**: All secondary/confirmation flows use the existing `.modal` markup + `window.TUI.modal.open/close` +
declarative `data-modal-open`/`data-modal-close` wiring:
- **Forgot-password** (login): a `.modal` with an email `.field` (`dir="ltr"`, required) + a "no real email is sent"
  note; validated submit → toast + inline success.
- **Edit-alert** (price-alerts): a `.modal` pre-filled from the chosen alert card (destination/route, max budget, travel
  month, notification method, status); validated save → toast + update the visible card.
- **Delete-confirm** (price-alerts): a `.modal` confirming deletion; confirm → remove the card + toast; cancel → close.

Browser `alert()`, `confirm()`, and `prompt()` are **forbidden everywhere**; all feedback uses toast/modal/inline.

**Rationale**: Constitution II/VI forbid browser dialogs; the existing modal system already provides focus management and
reduced-motion-aware open/close (`window.TUI.modal`). Reuses proven components; adds markup + thin `member.js` glue only.

**Alternatives considered**: `confirm()` for deletion (rejected — forbidden); a brand-new modal system (rejected — the
existing `.modal`/`TUI.modal` is the contract).

---

## D10. Shell rewiring — update canonical `partials/` + every inlined copy; add member entry points

**Decision**: Update the canonical `partials/header.html` (and `footer.html` if member links belong there) so the auth
CTAs become real `href`s with `data-coming-soon` **removed**: desktop header "تسجيل الدخول" → `login.html`; drawer
"تسجيل الدخول" → `login.html`; drawer "إنشاء حساب جديد" → `register.html`. **Additively** add member entry points (e.g.,
an account/"حسابي" link → `profile.html` or `saved-deals.html`, and where a "create price alert" affordance exists →
`price-alerts.html`) without removing any existing element. Links to still-unbuilt surfaces (merchant dashboard, SaaS
owner admin, unbuilt about/contact/privacy/terms/partners, social) **keep** `data-coming-soon`. Because the shell is
**inlined** per page, apply the identical change to **every** page that inlines it — `index.html`, the four Spec 003
pages, the four Spec 004 pages, `styleguide.html`, `components.html`, and the five new pages — so all stay 1:1 with the
canonical source (SC-017). **No existing section is removed; the visual identity is unchanged.**

**Rationale**: FR-032–FR-034 require the rewiring; keeping inlined copies in sync with `partials/` upholds Constitution
III and the non-regression criterion (SC-017). The five member pages exist, so their links resolve (no dangling links).

**Alternatives considered**: Runtime partial injection via `fetch` to avoid duplication (rejected — breaks standalone
rendering on `file://` and III); leaving inlined copies stale (rejected — violates the 1:1 rule and SC-017); a JS
redirect for the auth CTAs (rejected — a plain `href` is simpler and works with zero JS).

---

## Summary of decisions

| # | Area | Decision |
|---|------|----------|
| D1 | Rendering | Static HTML baseline + JS enhancement; items/cards carry `data-*` for the enhancement layer |
| D2 | Auth/member state | No real auth gate; mock member identity; all mutations frontend/session-only; reload restores defaults |
| D3 | Login/register success | Toast + inline success + CTA to `saved-deals.html`; never a silent real-auth redirect; forgot-password "no real email" |
| D4 | Page logic | New additive `src/js/member.js` (5 new pages only), dispatched by `<html data-page>`; `main.js`/`ui.js`/`discovery.js`/`content.js` untouched |
| D5 | Form validation | Reuse `TUI.validateForm(form, {rules})`; simple forms reuse `data-validate data-frontend-form`; cross-field/dynamic forms owned by `member.js` (omit `data-frontend-form`) |
| D6 | Page contracts | Saved-hub + alerts behave as member listings (empty states + restore); auth/profile carry info/CTA/help; filters/sort N/A for curated sets |
| D7 | Tabs/toggles/stats | Small page-scoped `<style>` over existing tokens; ARIA tablist; native `role="switch"` checkboxes (no-JS safe) |
| D8 | Mock data | New `member-saved.json` + `price-alerts.json` (≥6) + `member-profile.json`; saved items reuse existing entity ids; static HTML matches catalogs |
| D9 | Modals / dialogs | Forgot-password, edit-alert, delete-confirm use existing `.modal` + `TUI.modal`; no `alert()`/`confirm()`/`prompt()` |
| D10 | Rewiring | Update canonical `partials/` + all inlined copies; auth CTAs → login/register; add member entry points; out-of-scope links keep coming-soon |

**Net shared-file impact**: **no behavioral change** to `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, or
`src/js/content.js`; additive only — one new `src/js/member.js`, new `assets/data/member-saved.json` +
`price-alerts.json` + `member-profile.json`, optional new SVG placeholders, and auth/member nav edits to the canonical
`partials/` and every inlined shell copy. `src/input.css` is reused; a small page-scoped `<style>` per member page (as on
the homepage) covers the auth split layout, tabs, toggle switches, stats grid, and account sub-nav. No
`NEEDS CLARIFICATION` remain.
