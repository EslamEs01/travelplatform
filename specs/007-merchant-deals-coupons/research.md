# Phase 0 Research: Merchant Deals + Coupons Management

**Feature**: `007-merchant-deals-coupons` | **Date**: 2026-06-02

No `NEEDS CLARIFICATION` items remained after the spec's Clarifications session (2026-06-02), which resolved the nine
open questions (page location & `../` paths; Spec 006 shell reuse; additive `dashboard.js` extension; static-HTML-first;
session-only state; custom modals / no browser dialogs; mock publish/upload + configuration-ready URLs; link-only nav
rewiring + coming-soon for the still-unbuilt pages; edit-deal `?id` fallback). This document records the technical
decisions for building the first two real merchant management modules (deals + coupons) on top of the Spec 006 dashboard
shell and the Spec 001 foundation, with **no backend** and **no change to the existing visual identity**. The Spec 006
research (D1–D11) already settled the surface foundations (the `dashboard/` directory + `../` paths, the own-app-shell,
static-HTML-first, no-auth/mock-identity, session-only state, CSS-only charts, page-scoped `<style>` primitives, additive
sprite icons, coming-soon for unbuilt modules, custom modals, additive mock catalogs); this spec **inherits** those and
adds the decisions specific to the list/form workspaces below.

The investigation grounded every decision in the real codebase. `dashboard/index.html` already implements the app shell
(page-scoped `.dash-sidebar`/`.dash-topbar`/`.dash-main`/`.dash-scrim`/`.dash-footer`, the sidebar nav with section
labels, the topbar with mobile-menu/search/notifications/quick-add/user-menu, a responsive `.dash-table`→cards pattern,
KPI/stat cards, and modals) and sets `<html lang="ar" dir="rtl" data-page="merchant-dashboard">`, loading
`../src/js/ui.js` → `../src/js/main.js` → `../src/js/dashboard.js` (all `defer`). `src/js/dashboard.js` (539 lines)
guards on `document.documentElement.dataset.page === 'merchant-dashboard'` and already exposes reusable primitives:
**`DropdownController`** (trigger + menu; `aria-expanded`, outside-click/Escape close, roving focus), a **row-action-menu
controller** (per-row open/close, Escape close), a **frontend-only form-submit wrapper** (preventDefault → validate →
`onSuccess`), the **sidebar/drawer** toggle (reusing `window.TUI.drawer` + `.dash-scrim`), the **topbar dropdowns**, and
the **status/note modal** glue. `window.TUI` exposes `toast`, `modal.open|close`, `drawer.open|close|toggle`,
`validateForm(form,{rules})`, `copyToClipboard`, `prefersReducedMotion`. `main.js` provides the delegated `data-*` layer
(`data-coming-soon`, `data-modal-open|close`, `data-drawer-open|close|drawer`, `data-copy`/`data-copy-target`,
`data-toast`/`data-toast-type`, `data-validate`/`data-frontend-form`/`data-success-toast`, `data-year`). `tailwind.config.js`
**already** includes `./dashboard/**/*.html` in its `content` globs (Spec 006), so no config edit is needed.
`src/input.css` provides `.btn*`, `.card*`, `.badge*`/`.badge-source-*`, `.field*` (incl. `.field-error`/`.field-hint`/
`.field-success-msg`/`.field-check`), `.modal*`, `.drawer*`, `.toast*`, `.skeleton*`, `.empty-state`, `.inline-msg*`,
`.breadcrumb*`, `.chip-group`, `.filter-chip`, `.result-bar`/`.result-count-text`, `.search-input*`, `.price` — but
**no** filter-panel, dashboard-table (it's page-scoped in `index.html`), stat-grid, sticky-summary, preview-card, or
repeater component, so those are page-scoped `<style>` (the same approach `index.html`/content pages use). The icon
sprite has edit/eye/copy/more/plus/tag/ticket/trend-up|down/calendar/check-circle/close/search/chevron-down/bell/
settings/users/grid/plug/info/star/location but **no** trash/pause/play/archive/duplicate/filter/sliders/upload/
download/image/refresh/wand/percent/clock, so additive symbols are needed. Existing catalogs: `deals.json`
(`deal-001…deal-010`) and `coupons.json` (`coupon-flights-15`, `coupon-hotel-20`, `coupon-bundle-10`, `coupon-activity-25`,
`coupon-winter-12`, `coupon-luxury-30`, `coupon-family-15`) are reused for id consistency.

---

## D1. Reuse the Spec 006 dashboard shell verbatim across all five pages (clarified)

**Decision**: Every page reuses the **exact Spec 006 app shell** — the same page-scoped `.dash-sidebar` (brand + nav with
section labels), `.dash-topbar` (mobile-menu button, breadcrumb/current-area, company-switcher placeholder, global
search, notifications/quick-add/user dropdowns), `.dash-scrim` mobile drawer, `.dash-main` content area, breadcrumb,
page-header region, and `.dash-footer` — copied into each new page so it renders standalone (III). Only three things vary
per page: (a) the **active sidebar item** (`aria-current="page"` on العروض for deals.html & edit-deal.html, إضافة عرض for
create-deal.html, الكوبونات for coupons.html & create-coupon.html), (b) the **breadcrumb trail**, and (c) the page-
header title/description/actions. The public marketing header/footer is never used. The shared shell markup (sidebar nav
links, the page-scoped shell `<style>`) is kept byte-consistent across pages so the surface feels like one app.

**Rationale**: Constitution III requires standalone pages (no runtime shell injection); the spec mandates Spec 006 shell
reuse and forbids the public header/footer. Copying the shell keeps each page self-contained and Django-template-ready
(the shell maps to a shared `base.html` later) while the active-state/breadcrumb/header deltas keep navigation honest.

**Alternatives considered**: A `fetch`/JS-injected shared shell (rejected — breaks standalone `file://` rendering,
violates III). A server-include now (rejected — no backend yet; static-first). Diverging shell markup per page (rejected
— inconsistency reads as broken; the surface must feel unified — IV).

---

## D2. Page logic — extend `dashboard.js` additively with five per-page controllers (clarified)

**Decision**: Add five new controllers to the **existing** `src/js/dashboard.js`, each gated by
`document.documentElement.dataset.page` — `merchant-deals`, `merchant-create-deal`, `merchant-edit-deal`,
`merchant-coupons`, `merchant-create-coupon` — alongside (not replacing) the Spec 006 `merchant-dashboard` controller.
The module's top-level guard is generalised to run when the `data-page` is any of the dashboard pages, then dispatches to
the matching controller; the Spec 006 controller and its helpers (`DropdownController`, the row-action-menu controller,
the form-submit wrapper, the sidebar/drawer + topbar-dropdown wiring, `toast`/`announce`/`comingSoonToast` helpers)
are **reused unchanged** and shared by the new controllers. All five pages load `../src/js/dashboard.js` with `defer`
after `ui.js`/`main.js`. `main.js`, `ui.js`, `discovery.js`, `content.js`, and `member.js` are **not modified**.

**Rationale**: The spec explicitly scopes the new logic into `dashboard.js` additively; the shell behaviors and the
reusable `DropdownController`/row-menu/form-wrapper primitives already live there, so the list/form controllers compose
with them with zero duplication and zero regression to the Spec 006 controller. Matches the project's single-dashboard-
module model and keeps `main.js`/`ui.js` (the shared contracts) untouched.

**Alternatives considered**: A separate `deals.js`/`coupons.js` per module (rejected — the spec says extend
`dashboard.js`, and the shell + primitives are already there). Extending `main.js` (rejected — page-specific logic in a
file every page loads → regression risk). Inline `<script>` per page (rejected — the project uses defer modules; no
bespoke inline JS except JSON-LD / safe JSON blocks).

---

## D3. List pages — client-side filter/sort/search over static rows (no fetch, no library)

**Decision**: `deals.html` and `coupons.html` author their **≥12 rows as static HTML** (a real `<table>` on `md+`, each
`<tr>` carrying machine-readable `data-*`: e.g., `data-deal-row`/`data-coupon-row`, `data-status`, `data-source`,
`data-type`/`data-category`, `data-price`/`data-discount`, `data-clicks`/`data-inquiries`/`data-used`/`data-copies`,
`data-expiry`, `data-updated`, `data-featured`, `data-title`/`data-destination`/`data-provider`/`data-code`). The
controller reads the filter/search/sort controls and **shows/hides + reorders** existing rows in the DOM — it never
fetches or re-renders from JSON. Search matches title/destination/provider (deals) or code/provider/deal (coupons);
filters narrow by the listed facets; sort reorders by reading the `data-*` numerics/dates. A **result-count** text node
and **active-filter chips** (`.filter-chip` with a remove control) update with each change and are announced via
`aria-live`; a **reset** clears all controls + chips; when zero rows match, the **empty-state** block is shown and the
table hidden. The `<table>`→**stacked labeled cards** transform below `md` reuses the Spec 006 `.dash-table` +
`data-label` `::before` pattern so mobile stays usable with no horizontal scroll.

**Rationale**: Constitution III + the static-HTML-first clarification require the rows to render and be readable with no
JS and no backend; filtering the existing DOM (vs fetch-render) preserves that, avoids layout shift, works on `file://`,
and needs no table/datagrid library (II). Reusing the Spec 006 responsive-table pattern keeps mobile parity.

**Alternatives considered**: `fetch()` the catalog + render rows (rejected — empty list without JS; violates III/FR-006).
An external datagrid/table library (rejected — forbidden by II; unnecessary). Pagination (rejected — out of scope; ≥12
rows fit a single filterable view; can be added with the future backend).

---

## D4. Row actions & bulk actions — toggles, clone, and `TUI.modal` confirmations (no dialogs)

**Decision**: Reuse the existing **row-action-menu controller** (kebab `icon-more` trigger → a page-scoped
`role="menu"`). Per the spec, menu items map to: **edit** → plain `href="edit-deal.html?id=<id>"`; **view public page** →
plain `href="../pages/deal-details.html?id=<id>"` when the id resolves, else a safe toast; **duplicate** → clone the row
node (visually inserted, marked "نسخة تجريبية") and/or a toast; **pause/activate** → swap the status `.badge` class +
`data-status` and toast; **mark featured/unfeatured** → toggle a `.badge-featured` + `data-featured` and toast;
**archive** → a `TUI.modal` confirmation then a toast + visual state; **delete** → a `TUI.modal` confirmation then remove
the row node + toast. The **bulk bar** uses a select-all + per-row checkboxes driving a live selected-count (`aria-live`);
bulk activate/pause/archive act on checked rows' badges, **bulk delete** opens a `TUI.modal` confirmation before removal,
and **bulk export** (and export/import in the page header) are **mock toasts** (تصدير/استيراد تجريبي — no real file).
Coupons add **copy code** via `copyToClipboard`/`data-copy` + toast. No `confirm()`/`alert()`/`prompt()` anywhere.

**Rationale**: Constitution VI (no dead interactions; every control produces observable feedback) + II/VI (no browser
dialogs). The row-menu and `TUI.modal` already exist; toggling badge classes and cloning/removing nodes are the
session-only, honest way to demonstrate management without faking a real publish/delete/export (IX).

**Alternatives considered**: `confirm()` for delete (rejected — forbidden). Persisting changes to `localStorage` to
survive reload (rejected — risks reading as a real save; spec mandates session-only, reload restores defaults). A real
file download for export (rejected — out of scope; "تصدير تجريبي" toast is the honest mock).

---

## D5. Forms — multi-section, inline validation, repeaters, conditional fields, preview

**Decision**: `create-deal.html`, `edit-deal.html`, and `create-coupon.html` are **static multi-section forms** (section
`.card`s with `<h2>`/`<h3>` headings) using the existing `.field*` components, validated inline via
`window.TUI.validateForm(form,{rules})` (required fields → `.field-error` + `aria-invalid`/`aria-describedby`). The
controllers add:
- **Dynamic repeaters** (highlights ≥3 initial, included, not-included for deals): an "add" button clones a hidden
  `<template>`/reference row; each row has a "remove" button; at least one row is retained. Pure DOM, no framework.
- **Conditional fields** via `change` handlers: deal **source type** → reveal the right helper text (affiliate/partner/
  API = configuration-ready, "no link validation now"; Scraped Pending Review → manual-review notice); deal/coupon
  **status = Scheduled** → reveal a schedule-publish date; deal **flexible-dates** toggle → adapt availability inputs;
  coupon **discount type = Fixed amount** → reveal the currency field; coupon **source = Scraped Pending Review** →
  show "لا يتم نشر أي كوبون مجمّع تلقائيًا قبل المراجعة" + review controls.
- **Slug helper** (deals): typing the title auto-generates a `slug` (lowercase, hyphenate, strip unsafe chars) into a
  preview + a public-URL preview; the slug stays user-overridable.
- **Mock media upload** (deals): a placeholder/preview UI; clicking upload shows a preview placeholder and/or a "لا يتم
  رفع ملفات حقيقية الآن" toast; a local object-URL preview MAY be shown for UX only — no file is sent anywhere.
- **Preview**: deal forms open a **`TUI.modal`** showing a card preview (title/destination/price/source badge/CTA);
  the coupon form shows a **live preview card** that updates from the form (discount, code `dir="ltr"`, provider, source
  badge, expiry, copy-button preview).
- **Actions**: حفظ كمسودة → frontend-only toast (no server-save claim); نشر تجريبي → validate first, then a success toast
  framed as نشر تجريبي (no real-publish claim); رجوع → plain `href` to the list. A **sticky action summary** (deal forms)
  MAY show completion/missing-required state + save/publish.

**Rationale**: Constitution VI requires forms to render valid/invalid/error/success states; `TUI.validateForm` is the
established validator (Spec 005 member forms + Spec 006 modals use it). Repeaters/conditionals/slug/preview are DOM-only
enhancements over a fully static form, so the form is usable without JS (III) and honest about publish/upload (IX).

**Alternatives considered**: HTML5-only validation (rejected — `TUI.validateForm` gives consistent, accessible,
styled errors and a single success path). A JS-templated form (rejected — would not render without JS — III). Real
`FileReader` upload to a server (rejected — no backend; mock only).

---

## D6. edit-deal prefill, `?id` fallback, activity log & public-preview link (clarified)

**Decision**: `edit-deal.html` ships **one realistic deal's values prefilled as static HTML** (the default deal), so it
renders fully without JS (III). The controller reads `?id=<deal-id>`; if it matches a record in an inline
`<script type="application/json" id="merchant-deals-data">` block (mirroring `merchant-deals.json`, reusing
`deal-001…deal-010` ids), it overwrites the field values for enhancement; an **unknown/missing id falls back to the
static default** without error or 404. The page adds: an **edit header** (reference, current status, last-updated,
created-by, public URL, clicks, inquiries — static mock), an **activity mini-log** of ≥5 static mock events (created /
updated price / status changed / coupon attached / inquiry received), a **public-preview link** → `../pages/deal-
details.html?id=<id>` (a real navigation since `deals.json` ids exist; a safe toast if the id is unknown), and the
**edit-specific actions** (save changes / save as draft / preview / duplicate / archive / pause-activate / delete /
back-to-deals), with archive + delete via `TUI.modal` confirmations, duplicate via toast, and pause/activate toggling
the header status.

**Rationale**: Static prefill keeps III intact and gives a believable edit experience even with JS off; the inline JSON +
`?id` is a progressive enhancement that resolves against the real `deals.json` ids (cross-page consistency, FR-041); the
fallback prevents any dead-end/404 (VI). The activity log is a demo history, framed as mock (IX).

**Alternatives considered**: `fetch('../assets/data/merchant-deals.json')` then prefill (rejected — fails on `file://`,
empty form without JS; III). No `?id` support (rejected — the spec allows it and the row "edit" action passes it). A real
audit trail (rejected — no backend; static mock log).

---

## D7. create-coupon specifics — generate-code (no prompt), copy, live preview, scraped warning

**Decision**: The coupon code field has a **generate-random-code** button whose handler builds a short alphanumeric code
(varied by a non-`Date`/`Math.random`-free approach is not required here — a simple in-page random string is acceptable
on the client) and **writes it directly into the input** (`input.value = …`) — never a browser `prompt()`. A **copy**
control copies the current code via `copyToClipboard` + toast. A **live preview card** (page-scoped `.coupon-preview`)
reflects the code (`dir="ltr"`), discount, provider, source badge, and expiry as the user edits, and shows a copy-button
preview. Choosing **Scraped Pending Review** as the source reveals the warning "لا يتم نشر أي كوبون مجمّع تلقائيًا قبل
المراجعة" and the review controls; choosing **Fixed amount** reveals the currency field; **Scheduled** reveals the
schedule date. Validation, save-draft, and publish-mock behave as in D5.

**Rationale**: Constitution VI forbids `prompt()`; writing into the field is the honest, accessible alternative. The live
preview + scraped warning make the coupon honest (IX) and demonstrate the feature without claiming a real active coupon.

**Alternatives considered**: `prompt()` for the code (rejected — forbidden). Submitting to a generator endpoint (rejected
— no backend). A static (non-updating) preview (rejected — the spec asks the preview to reflect edits).

---

## D8. Mock-data catalogs — two additive files reusing existing ids (clarified)

**Decision**: Add two additive catalogs as backend-ready reference data, matched by the static HTML (no runtime fetch for
baseline — D3/III):
- `assets/data/merchant-deals.json` — **≥12** merchant deals, each with the full schema: `id`, `title`, `destination`,
  `country`, `city`, `region`, `dealType`, `priceBefore`, `priceFrom`, `currency`, `discountLabel`, `sourceType`,
  `providerName`, `status`, `expiryDate`, `travelDates`, `availability`, `clicks`, `inquiries`, `couponCopies`, `rating`,
  `lastUpdated`, `createdBy`, `featured`, `publicUrl`, `image`, `imageAlt`, `highlights`, `includedItems`,
  `notIncludedItems`, `terms`, `seoTitle`, `metaDescription`, `slug`. `status` ∈ {Draft, Active, Scheduled, Paused,
  Expired, Archived}; `sourceType` ∈ {Manual Deal, Partner Link, Affiliate, API Ready, Scraped Pending Review}. Reuse
  `deal-001…deal-010` ids (and `publicUrl` → `../pages/deal-details.html?id=`) for ≥10 of the records so edit-deal `?id`
  and the public-deal CTAs resolve; the extra records get new ids (e.g., `deal-011`, `deal-012`).
- `assets/data/merchant-coupons.json` — **≥12** merchant coupons, each with the full schema: `id`, `code`, `discountType`,
  `discountValue`, `currency` (when fixed), `provider`, `sourceType`, `category`, `relatedDeal`, `usageLimit`,
  `usedCount`, `startDate`, `expiryDate`, `status`, `minimumBooking`, `terms`, `sourceUrl`, `affiliateUrl`,
  `reviewStatus`, `lastUpdated`. `status` ∈ {Draft, Active, Scheduled, Paused, Expired, Archived}; `sourceType` ∈
  {Manual, Affiliate, Coupon API, Scraped Pending Review}; reuse `coupons.json` codes/ids and set `relatedDeal` to a
  `deal-0xx` id where applicable.

The **status/source sets MUST spread** across the enums so badges/filters are meaningful. A missing/invalid referenced id
never breaks a page (safe fallback / graceful skip / edit-deal default).

**Rationale**: Mirrors the existing `deals.json`/`merchant-*-preview.json` convention; reusing ids keeps cross-page
identity consistent (FR-041/SC-010) and lets edit + public-deal links resolve; JSON is CMS/Django-ready. Honors III (no
runtime fetch for baseline).

**Alternatives considered**: Hardcoding everything inline only (rejected — loses backend-ready reference data + cross-
page consistency). Inventing brand-new ids everywhere (rejected — breaks identity consistency with `deals.json`/
`coupons.json`). Fetching JSON at runtime to render (rejected — III/FR-006; fails on `file://`).

---

## D9. Icons — additive management-action symbols in the existing sprite

**Decision**: Append **new `<symbol>` icons** to `assets/icons/sprite.svg` for the management actions the sprite lacks —
e.g., `icon-trash` (delete), `icon-pause`/`icon-play` (pause/activate), `icon-archive`, `icon-duplicate` (or reuse
`icon-copy`), `icon-filter`/`icon-sliders` (filters/sort), `icon-upload`/`icon-download` (mock upload / export),
`icon-image` (media placeholder), `icon-refresh` (reset), `icon-wand` (generate code), `icon-percent`/`icon-clock`
(discount/expiry). Existing icons are reused where they fit (`icon-edit`, `icon-eye` view, `icon-copy`, `icon-more` row
kebab, `icon-plus` add, `icon-tag`/`icon-ticket`, `icon-trend-up|down`, `icon-calendar`, `icon-check-circle`,
`icon-close`, `icon-search`, `icon-chevron-down`). All additions are **append-only** — no existing symbol is modified.

**Rationale**: The project renders icons via one sprite (`<use href="…sprite.svg#icon-…">`); clear, distinct action
icons support IV (premium/clear). Appending symbols is additive and zero-regression; reusing existing icons minimizes
additions.

**Alternatives considered**: A second sprite or inline `<img>` per icon (rejected — breaks the single-sprite
convention). Reusing only existing icons for everything (rejected — ambiguous action icons hurt clarity/IV).

---

## D10. Layout primitives — page-scoped `<style>` over tokens; no chart/table library

**Decision**: Because `input.css` lacks a filter-panel, dashboard-table, stat-grid, sticky-summary, preview-card, and
repeater-row component, realise them with a **small page-scoped `<style>`** per page (the `index.html`/content-page
precedent), built from existing tokens and reusing the Spec 006 shell `<style>`:
- **Stat mini-cards**: a CSS grid of `.card`s with icon + label + value (reusing the Spec 006 KPI-card look).
- **Filter panel**: a `.card` wrapping `.field*` controls in a responsive grid; collapses to one column at 360px; a
  result-count + `.filter-chip` row + reset.
- **Responsive table → cards**: a real `<table>` on `md+`; below `md` each `<tr>` becomes a stacked labeled card
  (`display:block` + `data-label` `::before`) — the same pattern as the Spec 006 booking table — so it stays usable at
  360px with no horizontal scroll. Coupon code cells render `dir="ltr"`.
- **Bulk bar**: a sticky/inline action bar revealed when ≥1 row is selected.
- **Sticky action summary** (deal forms): a `position: sticky` side panel on `lg+` that stacks below the form on mobile.
- **Preview card / coupon-preview**: a `.card` mimicking the public deal/coupon card; the deal preview lives in a
  `.modal`, the coupon preview is inline and live-updating.
- **Repeater rows**: a flex row (input + remove button) cloned from a reference/`<template>`.

**Rationale**: Keeps ≥95% styling in the existing design system (SC-013) while adding only thin, page-scoped layout CSS —
no new global component, no new visual identity (IV), no chart/table library (II). The native `<table>` + CSS card
transform keeps the no-JS baseline usable on mobile (III).

**Alternatives considered**: Adding new global classes to `input.css` (rejected — broader surface/regression risk; not
needed beyond these pages — though future merchant pages may later promote shared dashboard-list classes). An external
table/datagrid or chart library (rejected — forbidden by II; unnecessary). A JS-built table (rejected — would not render
without JS — III).

---

## D11. Navigation rewiring (link-only) of the shared shell incl. Spec 006 `index.html` (clarified)

**Decision**: Rewire **only the links** for the now-built pages wherever they appear in the shared dashboard shell —
the sidebar (العروض → `deals.html`, إضافة عرض → `create-deal.html`, الكوبونات → `coupons.html`), the topbar quick-add
dropdown (إضافة عرض → `create-deal.html`, إنشاء كوبون → `create-coupon.html`), and any Spec 006 overview CTAs that target
deals/coupons (e.g., a welcome/quick-action "إضافة عرض جديد" / "إنشاء كوبون") — changing them from `data-coming-soon` to a
plain `href`. On each new page the same sidebar marks the correct item active (`aria-current="page"`); edit links use
`edit-deal.html?id=<id>`. The Spec 006 `dashboard/index.html`'s **sections, layout, content, and copy are not removed or
redesigned** — only these links change. The seven still-unbuilt merchant pages (`bookings.html`, `booking-details.html`,
`customers.html`, `customer-details.html`, `analytics.html`, `integrations.html`, `settings.html`) keep `data-coming-soon`
and their files are not created.

**Rationale**: Constitution VI (no dead/misleading controls) + the spec (FR-043): now that the pages exist, their entry
points must navigate for real, and the Spec 006 overview must not dead-end to its own built modules. The preservation
rule (VIII) is honored — nothing is removed, only links flip from coming-soon to real.

**Alternatives considered**: Leaving the links coming-soon (rejected — misleading/dead-ended now that the pages exist).
Removing/redesigning Spec 006 overview sections (rejected — preservation rule; spec forbids it). Building a separate nav
for the new pages (rejected — one shared shell; consistency).

---

## Summary of decisions

| # | Area | Decision |
|---|------|----------|
| D1 | Shell reuse | Reuse the Spec 006 app shell verbatim on all five pages; vary only active item + breadcrumb + page-header; never the public header/footer |
| D2 | Page logic | Extend `dashboard.js` additively — 5 new per-page controllers dispatched by `<html data-page>`, reusing existing `DropdownController`/row-menu/form-wrapper; Spec 006 controller + `main.js`/`ui.js`/others unchanged |
| D3 | List filter/sort/search | Static ≥12 rows carry `data-*`; client-side show/hide + reorder; result-count + chips + `aria-live`; reset; empty-state toggle; `<table>`→cards on mobile; no fetch, no table library |
| D4 | Row & bulk actions | Reuse row-menu; edit/view = href; duplicate = clone/toast; pause/featured = badge swap; delete/archive/bulk-delete = `TUI.modal`; export/import = mock toast; copy-code = `copyToClipboard`; no dialogs |
| D5 | Forms | Static multi-section; `TUI.validateForm` inline; DOM repeaters; conditional fields/helper/warnings; slug auto-gen; mock upload; deal preview modal / coupon live card; save-draft/publish-mock toasts |
| D6 | edit-deal | Static prefilled default; `?id` overrides from inline JSON (reuse `deal-0xx`); unknown id → default (no 404); edit header + activity log (≥5) + public-preview link (`../pages/deal-details.html?id=`) + edit actions |
| D7 | create-coupon | generate-code writes into field (no `prompt()`); copy via `copyToClipboard`; live preview card; Fixed-amount→currency; Scraped→warning; Scheduled→date |
| D8 | Mock data | New `merchant-deals.json` (≥12) + `merchant-coupons.json` (≥12), full schemas + spread enums; reuse `deal-001…deal-010`/`coupons.json` ids; static HTML matches; not a render dependency |
| D9 | Icons | Additive management-action `<symbol>`s (trash/pause/play/archive/duplicate/filter/sliders/upload/download/image/refresh/wand/percent/clock); reuse existing; no symbol changed |
| D10 | Layout primitives | Small page-scoped `<style>` over tokens for stat grid/filter panel/table→cards/bulk bar/sticky summary/preview/repeaters; reuse Spec 006 shell + table pattern; no chart/table library |
| D11 | Nav rewiring | Link-only flip of العروض/إضافة عرض/الكوبونات/إنشاء كوبون (sidebar + quick-add + deals/coupons overview CTAs, incl. Spec 006 `index.html`) coming-soon → real `href`; 7 other merchant pages stay coming-soon; no section removed |

**Net shared-file impact**: **no behavioral change** to `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`,
`src/js/content.js`, or `src/js/member.js`, and **no change** to the Spec 006 `merchant-dashboard` controller in
`dashboard.js`. Additive only — five new `dashboard/*.html` pages (reusing the Spec 006 shell), an additive extension of
`src/js/dashboard.js` (5 new controllers), two new `assets/data/merchant-{deals,coupons}.json` catalogs, additive
`assets/icons/sprite.svg` symbols, and a **link-only** edit to the shared shell (incl. Spec 006 `dashboard/index.html`,
no section removed). `tailwind.config.js` needs **no edit** (the `./dashboard/**/*.html` glob already exists). `src/input.css`
is reused; a small page-scoped `<style>` per page (as on the homepage / Spec 006) covers the stat grid, filter panel,
responsive table→cards, bulk bar, sticky summary, preview card, and repeater rows. The public/member `pages/` and
`partials/header.html`/`footer.html` are unchanged. No `NEEDS CLARIFICATION` remain.
