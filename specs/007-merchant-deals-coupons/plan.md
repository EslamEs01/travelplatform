# Implementation Plan: Merchant Deals + Coupons Management (Travel SaaS Platform)

**Branch**: `007-merchant-deals-coupons` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/007-merchant-deals-coupons/spec.md`

## Summary

Build the **first real management modules of the merchant dashboard surface** — deals management and coupons management —
as **five new pages inside the existing `travel-saas-frontend/dashboard/` directory**: `deals.html`
(`merchant-deals`), `create-deal.html` (`merchant-create-deal`), `edit-deal.html` (`merchant-edit-deal`), `coupons.html`
(`merchant-coupons`), and `create-coupon.html` (`merchant-create-coupon`). Spec 006 opened this surface with
`dashboard/index.html` — both a merchant overview and the reusable app shell — and wired every operational module
(deals/coupons/bookings/…) as **coming-soon**. Spec 007 turns the **deals** and **coupons** modules into real screens
while keeping the other seven merchant pages coming-soon. Two pages are **list/management** workspaces (deals, coupons):
page header + CTAs, stat mini-cards, search + multi-filter, sort, result-count + active chips, a responsive
**table/card hybrid (≥12 rows)**, row action menus, bulk selection + bulk actions, branded empty state, skeleton
pattern, source/status legend or explanation, and a help FAQ (≥5). Three pages are **forms** (create-deal, edit-deal,
create-coupon): multi-section, mobile-friendly, inline-validated, with dynamic repeaters, conditional fields/helper
text/warnings, slug/code/preview helpers, a preview modal/card, and a sticky action summary — edit-deal additionally
prefilled with realistic mock data plus an edit header, an activity mini-log (≥5), a public-preview link, and
edit-specific actions (save/duplicate/archive/pause/delete). Everything is a **frontend-only** prototype that is
**explicit and honest**: nothing is really published, saved, uploaded, validated, connected, paid, or notified — every
surface uses the approved safe wording (بيانات تجريبية / واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه
النسخة / لا يتم نشر العرض فعليًا الآن / لا يتم رفع ملفات حقيقية الآن / قابل للربط لاحقًا بقاعدة بيانات / قابل للربط لاحقًا
بمصادر Affiliate/API / سيتم تفعيل هذا الإجراء لاحقًا مع الباك إند) while staying backend-ready.

**Technical approach**: Static composition + mock content + progressive enhancement, **reusing the Spec 006 dashboard
shell verbatim** (the same sidebar/topbar/mobile-drawer+scrim/breadcrumb/page-header/footer markup, only the active
sidebar item and breadcrumb change per page; the public marketing header/footer is never used). Each page authors its
own `<head>` from the `partials/head.html` conventions (`../assets/css/tailwind.css`, Cairo font preload, favicon,
theme-color, `robots noindex`) exactly like `dashboard/index.html`. All **core content is static HTML** so every page
renders without JavaScript (Constitution III): the list pages ship their ≥12 rows + all sections statically, and
`edit-deal.html` ships its prefilled values statically. The **existing `src/js/dashboard.js` is extended additively**
with five new per-page controllers dispatched by `<html data-page>` — reusing the module's existing reusable primitives
(`DropdownController`, the row-action-menu controller, the frontend-only form-submit wrapper, `window.TUI.modal`/`toast`/
`validateForm`/`copyToClipboard`, and `main.js`'s `data-*` delegation incl. `data-coming-soon`/`data-copy`/`data-modal-
open|close`/`data-toast`) — without changing any Spec 006 behavior. The list pages enhance the static rows with
**client-side filter/sort/search over the DOM** (rows carry `data-*`; matched rows show, others hide; result-count +
active chips update via `aria-live`; empty-state toggles when zero match) and **row/bulk actions** (status/featured
toggle = badge swap; duplicate = clone-node or toast; delete/bulk-delete = `TUI.modal` confirmation; export/import =
mock toasts). The forms enhance with `TUI.validateForm` inline validation, dynamic **repeaters** (clone a template
row), conditional fields (source-type helper text, discount-type→currency, Scheduled→date, flexible-dates, scraped-
review warning), **slug auto-generate** from the title, **generate-random-code** (writes into the field — no
`prompt()`), `copyToClipboard`, a **preview modal** (deal) / **live preview card** (coupon), and save-draft/publish-mock
toasts. **No browser dialogs anywhere.** Layout primitives the design system lacks (filter panel, the responsive
table→cards, stat-card grid, sticky action summary, preview card, repeater rows) are realised with a **small
page-scoped `<style>`** built from existing tokens — the same precedent `index.html` and the content pages use — and the
**responsive-table→cards** pattern is the same one Spec 006's booking table uses. New believable mock content lives in
two additive catalogs `assets/data/merchant-deals.json` (≥12) and `assets/data/merchant-coupons.json` (≥12), reusing
`deals.json` (`deal-001…deal-010`) and `coupons.json` ids where a deal/coupon is referenced so identity stays consistent;
the static HTML matches the catalogs (no runtime fetch for baseline — III). The shared dashboard nav is **rewired
(links only)** so the now-built pages navigate for real — العروض → `deals.html`, إضافة عرض → `create-deal.html`,
الكوبونات → `coupons.html`, إنشاء كوبون → `create-coupon.html`, edit → `edit-deal.html?id=` — across the shell
(including Spec 006 `index.html`'s sidebar + quick-add + any deals/coupons overview CTAs); the **Spec 006 overview's
sections/layout/copy are not removed or redesigned**, and the seven still-unbuilt merchant pages stay coming-soon (files
not created). The only icon touch is **additive sprite symbols** for management actions the sprite lacks (e.g.,
trash/pause/play/archive/duplicate/filter/sliders/upload/download/image/refresh/wand/percent/clock); existing icons
(edit/eye/copy/more/plus/tag/ticket/trend-up|down/calendar/check-circle/close/search/chevron-down) are reused.
**`tailwind.config.js` needs no change** — its `content` globs already include `./dashboard/**/*.html` (added in Spec
006). **No behavioral change** is made to `src/js/main.js`, `src/js/ui.js`, `src/js/discovery.js`, `src/js/content.js`,
or `src/js/member.js`; no existing public/member page or Spec 006 overview section is removed; no new visual identity;
no backend.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via the existing Tailwind CSS v3.4 local build (PostCSS/Autoprefixer); vanilla
JavaScript (ES2020, classic `defer` scripts — no bundler). Build-time runtime: Node.js ≥ 18 LTS + npm (unchanged from
Spec 001–006).
**Primary Dependencies**: None added. Reuses installed `tailwindcss@^3.4`, `postcss`, `autoprefixer`,
`@tailwindcss/forms`; the existing `window.TUI` namespace (`toast` / `modal.open|close` / `drawer.open|close|toggle` /
`validateForm(form,{rules})` / `copyToClipboard` / `prefersReducedMotion`); `main.js`'s declarative `data-*` delegation
(`data-coming-soon`, `data-modal-open|close`, `data-drawer-open|close|drawer`, `data-copy`/`data-copy-target`,
`data-toast`/`data-toast-type`, `data-validate`/`data-frontend-form`/`data-success-toast`, `data-year`); and the Spec
006 `dashboard.js` primitives (`DropdownController`, the row-action-menu controller, the frontend-only form-submit
wrapper, the sidebar/drawer + topbar-dropdown wiring). No runtime framework, no CDN, no external chart/table library.
The list pages' filter/sort/search and the forms operate on the in-page DOM; the JSON catalogs are backend-ready
reference data and the baseline content does **not** depend on `fetch` (a page MAY read an inline
`<script type="application/json">` block or `?id` param for enhancement only).
**Storage**: N/A — no backend/database/CMS/account store. Mock content is realistic, clearly-mock **static HTML**
mirroring small local `assets/data/*.json` files (`merchant-deals.json`, `merchant-coupons.json` new; `deals.json`/
`coupons.json` referenced unchanged). All management state (filter/sort/search, selection, status/featured toggles, a
duplicated/added/removed row, typed form values, a generated code) is **in-memory/session-only**; reload restores mock
defaults; nothing is persisted to a server. `localStorage` MAY be an optional convenience only and no copy claims
permanent/server storage (لا يتم الحفظ على خادم في هذه النسخة).
**Testing**: Manual QA against the per-page "done" checklist (`quickstart.md`) + automated accessibility audit (axe-core)
targeting WCAG 2.1 AA, HTML validation (`html-validate`) for all five pages, and Prettier/Stylelint. The
stack-compliance grep (forbidden tech + browser dialogs + external chart/table library) is a hard gate. No unit-test
framework (consistent with Spec 001–006). A `qa-results.md` is produced after implementation.
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major versions.
Mobile-first (~320–360px up to desktop); the pages must feel close to a native app on mobile (the tables collapse to
stacked labeled cards; the filter panel and forms reflow to one column).
**Project Type**: Static frontend web application (single project). This phase builds the **deals + coupons modules** of
the merchant surface: five new pages in the existing `dashboard/` directory. No backend tier.
**Performance Goals**: Each page interactive in < 2s under Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT) + 4× CPU
throttle (SC-017); minified CSS reused; lazy non-critical images; zero runtime CDN requests; no external chart/table
library; filter/sort/search/row-actions/forms operate on the in-page DOM (no network).
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no external chart/table lib; no
`alert()`/`confirm()`/`prompt()`); Arabic-RTL default + English-ready; WCAG 2.1 AA; standalone backend-ready pages
(render without JS, structured for later Django templating); no dead interactions (coming-soon for the seven still-
unbuilt merchant pages — no 404s); SEO/semantics baseline (semantic HTML, single `<h1>` per page, heading hierarchy,
breadcrumb, meta; `robots noindex` acceptable for these merchant surfaces); **product-honesty wording** (بيانات تجريبية
/ واجهة أمامية فقط / إجراء تجريبي / لا يتم الحفظ على خادم في هذه النسخة / لا يتم نشر العرض فعليًا الآن / لا يتم رفع ملفات
حقيقية الآن / قابل للربط لاحقًا بقاعدة بيانات / قابل للربط لاحقًا بمصادر Affiliate/API / سيتم تفعيل هذا الإجراء لاحقًا مع
الباك إند; never a real publish, save, upload, coupon/link validation, connected API, active scraping source, payment,
notification, or a coupon active on a live system). **Reuse the Spec 006 shell verbatim** and the Spec 001–006
foundation unchanged except: additive `dashboard.js` extension, two additive JSON catalogs, additive sprite icons, and
**link-only** rewiring of the deals/coupons entry points in the shared shell (incl. Spec 006 `index.html`). Preserve the
visual identity; remove no existing section; **do not use the public marketing header/footer**.
**Scale/Scope**: Five new pages in the existing `dashboard/` surface. Mock data: ≥12 merchant deals (full schema; reuse
`deal-001…deal-010` where applicable) + ≥12 merchant coupons (full schema; reuse `coupons.json`/`deals.json` ids).
Per-page minima — **deals.html**: page header + 3 CTAs + safe note; ≥10 stat mini-cards; search + 8 filters + reset;
7 sort options; result-count + chips; table/card hybrid **≥12 rows** (13 columns) + 7-action row menu; bulk bar
(5 actions); empty state; skeleton; source/status legend; FAQ (≥5). **create-deal.html**: 10 form sections (basic/
pricing/dates/source/media/highlights/included-notincluded/terms/SEO/status) + preview modal + sticky summary.
**edit-deal.html**: same sections **prefilled** + edit header + activity log (≥5) + public-preview link + 8 edit
actions. **coupons.html**: page header + 3 CTAs; ≥9 stat mini-cards; search + 9 filters + reset; 5 sort options;
result-count + chips; table/card hybrid **≥12 rows** (11 columns; code `dir="ltr"`) + 6-action row menu; bulk bar
(4 actions); empty state; skeleton; coupon-source explanation; FAQ (≥5). **create-coupon.html**: 7 form sections
(basic + generate-code/discount/usage/source+scraped-warning/terms/status/SEO) + live preview card. Navigation: rewire
4 built links across the shell; keep 7 merchant pages coming-soon.

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications (2026-06-02) resolved the nine open questions (page
location & `../` paths; Spec 006 shell reuse; additive `dashboard.js`; static-HTML-first; session-only state; custom
modals / no dialogs; mock publish/upload + configuration-ready URLs; link-only rewiring + coming-soon for unbuilt pages;
edit-deal `?id` fallback). See `research.md` for the derived technical decisions (D1–D11).*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend deals/coupons management; zero backend/database/account store, publish pipeline, upload service, coupon validator, or API. Publish/upload/save are mock; URLs are configuration-ready only. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | Existing local Tailwind build + vanilla JS only; the page logic is an **additive** extension of `dashboard.js`; **no external chart/table library**; no forbidden libs/CDN/dialogs (generate-code writes into the field — no `prompt()`; delete/archive use `TUI.modal` — no `confirm()`). Verified by the stack-compliance grep gate. |
| III. Standalone, Backend-Ready Pages | ✅ PASS | Five self-contained pages that **render core content without JS** (lists ship ≥12 rows + all sections statically; forms ship all fields; edit-deal ships prefilled values; JS only enhances). Each authors its own `<head>` from the shared `head` conventions; semantic, server-renderable regions ready for Django templating; no runtime fetch for baseline. |
| IV. Premium & Trustworthy | ✅ PASS | Reuses premium tokens + the Spec 006 app shell; trust/honesty framing throughout; reuses source badges (Manual Deal/Partner Link/Affiliate/API Ready) + status badges; no empty/broken UI — branded empty states + reusable skeletons + safe fallbacks for missing ids (edit-deal default deal). |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | `<html lang="ar" dir="rtl">`, logical-property utilities, mobile-first; tables collapse to stacked labeled cards, filter panels + form grids reflow to one column — no horizontal overflow at 360px; English-ready (LTR mirrors structurally); code/amount/date/reference/URL/percent use `dir="ltr"` (coupon codes `dir="ltr"` in table + preview). |
| VI. No Dead Interactions | ✅ PASS | Filters/sort/search update rows + count + chips; reset clears; row menus open; status/featured toggle badges; duplicate clones/toasts; delete/bulk-delete via `TUI.modal`; export/import toast; copy-code copies; forms validate inline; repeaters add/remove; slug/code/preview helpers act; conditional fields reveal; save-draft/publish-mock toast. No bare `#`, no `alert()`/`confirm()`/`prompt()`. Forms show valid/invalid/error/success states. |
| VII. Listing & Detail Contracts | ✅ PASS | **Now fully satisfied** for the two list pages: filters + sorting + empty state + skeleton/loading + a clear reset-filters action (the constitution's listing contract). The forms (create/edit) carry main info + a primary CTA (publish/save) + related help + the lists' FAQ; dashboards use believable, consistent static data reusing existing deal/coupon ids. |
| VIII. SaaS Direction Preserved | ✅ PASS | Builds the **deals + coupons management** modules the constitution names under the merchant dashboard — turning two coming-soon links into real pages while the other seven merchant pages stay anticipated/coming-soon and the SaaS-owner admin stays out of scope. The Spec 006 overview and the public/member surfaces are **not removed or downgraded** (only deals/coupons links rewired). |
| IX. Integration-Ready, Never Faked | ✅ PASS | Affiliate/partner/API/source URLs are **configuration-ready settings** with explicit "no link validation now"; Scraped Pending Review always carries a manual-review notice and never auto-publishes; all deals/coupons/metrics are believable mock; source badges + safe labels reused; every surface states frontend-only / قابل للربط لاحقًا; never implies a real publish, save, upload, validated/guaranteed coupon or link, connected API, active scraping source, payment, notification, or a coupon active on a live system. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, one `<h1>` per page, heading hierarchy, breadcrumb, Arabic title/meta; merchant surfaces MAY set `robots noindex` while staying structurally correct; substantial, non-thin pages (stat cards, ≥12 rows, legends, FAQ, full forms). |
| Technical Standards & File Organization | ✅ PASS | Adds five pages inside the canonical `dashboard/` directory the constitution prescribes; additive `assets/data/*.json`, additive `dashboard.js` extension, additive sprite icons; **no Tailwind config change** (the `./dashboard/**/*.html` glob already exists). Mock entities reuse existing deal/coupon ids. See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist in `quickstart.md`; stack-compliance hard gate; preservation rule honored (no Spec 006 overview section removed — only deals/coupons links rewired; `main.js`/`ui.js`/`discovery.js`/`content.js`/`member.js` behavior unchanged; the additive `dashboard.js` change does not alter existing controllers). |

**Result**: PASS — no violations. The only shared/existing-file touches are **additive or link-only**: the additive
`dashboard.js` extension (new per-page controllers, no existing controller changed), two new JSON catalogs, additive
sprite icon symbols, and **link-only** rewiring of the deals/coupons entry points in the shared shell (incl. Spec 006
`index.html`, with no section removed) — all logged in Complexity Tracking. Re-checked after Phase 1 design — still
PASS (no new global component, token, or visual identity; only a small page-scoped `<style>` per page for the filter
panel/table-cards/stat grid/sticky summary/preview/repeater primitives, exactly as the homepage, content pages, and
Spec 006 already do; no chart/table library).

## Project Structure

### Documentation (this feature)

```text
specs/007-merchant-deals-coupons/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications 2026-06-02)
├── research.md          # Phase 0 output — decisions D1–D11
├── data-model.md        # Phase 1 output — page/section inventory, mock schemas, interaction & form maps
├── quickstart.md        # Phase 1 output — build/preview + per-page QA gate
├── contracts/           # Phase 1 output
│   ├── deals-pages.contract.md     # deals.html + create-deal.html + edit-deal.html structural/behavioral contract
│   ├── coupons-pages.contract.md   # coupons.html + create-coupon.html structural/behavioral contract
│   └── mock-data.contract.md       # merchant-deals.json + merchant-coupons.json schemas + reuse & consistency rules
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── tailwind.config.js        # REUSED UNCHANGED — content globs already include ./dashboard/**/*.html (added in Spec 006)
├── src/
│   ├── input.css             # REUSED; additive only if an unavoidable composition class is needed (prefer page-scoped <style>)
│   └── js/
│       ├── ui.js             # REUSED UNCHANGED (window.TUI: toast/modal/drawer/validateForm/copyToClipboard/prefersReducedMotion)
│       ├── main.js           # REUSED UNCHANGED (declarative data-* wiring, incl. data-coming-soon/modal/drawer/copy/toast/validate)
│       ├── discovery.js      # REUSED UNCHANGED (Spec 003 — not loaded by the dashboard)
│       ├── content.js        # REUSED UNCHANGED (Spec 004 — not loaded by the dashboard)
│       ├── member.js         # REUSED UNCHANGED (Spec 005 — not loaded by the dashboard)
│       └── dashboard.js      # ★ EXTENDED (additive only) — adds 5 per-page controllers dispatched by <html data-page>
│                             #   (merchant-deals / merchant-create-deal / merchant-edit-deal / merchant-coupons /
│                             #   merchant-create-coupon): list filter/sort/search + count/chips + reset, row action menus,
│                             #   bulk selection + bulk actions, delete/archive confirm modals, status/featured toggles,
│                             #   duplicate, export/import toasts, copy-code; form validation + repeaters + slug preview +
│                             #   generate-code + conditional fields/warnings + mock upload + preview modal/card + save/publish
│                             #   toasts. REUSES existing DropdownController / row-action-menu / form-wrapper primitives;
│                             #   the Spec 006 merchant-dashboard controller is UNCHANGED.
├── assets/
│   ├── css/tailwind.css      # BUILD OUTPUT (regenerated; not hand-edited)
│   ├── icons/sprite.svg      # EDIT (additive only) — append management-action <symbol>s (trash/pause/play/archive/duplicate/
│   │                         #   filter/sliders/upload/download/image/refresh/wand/percent/clock); existing symbols unchanged
│   ├── data/
│   │   ├── merchant-deals.json     # NEW — ≥12 merchant deals (full schema; reuse deal-001…deal-010 ids where applicable)
│   │   ├── merchant-coupons.json   # NEW — ≥12 merchant coupons (full schema; reuse coupons.json/deals.json ids)
│   │   ├── deals.json        # REFERENCED unchanged — deal ids → ../pages/deal-details.html?id= ; edit-deal ?id resolve
│   │   ├── coupons.json      # REFERENCED unchanged — coupon identity / related-deal consistency
│   │   ├── merchant-dashboard.json / merchant-bookings-preview.json / merchant-deals-preview.json /
│   │   │                     #   merchant-integrations-preview.json — Spec 006 catalogs, REFERENCED unchanged
│   │   └── …                 # other existing catalogs unchanged
│   └── images/               # REUSED SVG placeholders; new additive only if needed (mock cover/gallery)
├── partials/                 # head conventions REUSED for each page <head>; header/footer NOT used on the dashboard
│   ├── head.html             # REUSED as the <head> convention source (CSS link, font preload, favicon, theme-color)
│   ├── header.html           # UNCHANGED — NOT inlined on the dashboard
│   └── footer.html           # UNCHANGED — NOT inlined on the dashboard
├── pages/                    # UNCHANGED — public + member pages; dashboard links back via ../pages/index.html / deal-details.html?id=
└── dashboard/                # merchant surface directory (created in Spec 006)
    ├── index.html            # ★ EDITED (link-only) — rewire العروض/إضافة عرض/الكوبونات (+ quick-add + any deals/coupons
    │                         #   overview CTAs) from data-coming-soon → real hrefs; NO section/layout/copy removed
    ├── deals.html            # ★ NEW — merchant-deals: list (stat cards + filters + sort + count/chips + ≥12-row table/cards
    │                         #   + row menus + bulk bar + empty + skeleton + legend + FAQ)
    ├── create-deal.html      # ★ NEW — merchant-create-deal: 10-section form + preview modal + sticky summary
    ├── edit-deal.html        # ★ NEW — merchant-edit-deal: prefilled form + edit header + activity log + public-preview + edit actions
    ├── coupons.html          # ★ NEW — merchant-coupons: list (stat cards + filters + sort + count/chips + ≥12-row table/cards
    │                         #   + row menus incl. copy + bulk bar + empty + skeleton + source explanation + FAQ)
    └── create-coupon.html    # ★ NEW — merchant-create-coupon: 7-section form + generate-code + live preview card
    # (still NOT created — coming-soon): bookings.html, booking-details.html, customers.html, customer-details.html,
    #  analytics.html, integrations.html, settings.html
```

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/` (unchanged from Spec 001–006). This
feature is **composition + mock content** (five new `dashboard/*.html` pages that reuse the Spec 006 shell) + **two
additive** mock-data catalogs + an **additive extension** of `src/js/dashboard.js` (new per-page controllers; existing
controllers untouched) + **additive** sprite icon symbols + a **link-only** edit to the shared shell (incl. Spec 006
`dashboard/index.html`). No foundation file is rebuilt or behaviorally changed; `src/js/main.js`, `src/js/ui.js`,
`src/js/discovery.js`, `src/js/content.js`, and `src/js/member.js` are untouched; the public/member `pages/` and the
shared `partials/header.html`/`footer.html` are untouched; the Spec 006 overview sections/layout/copy are preserved
(only deals/coupons links rewired). The pages **do not inline the public header/footer**; they author their own `<head>`
from the `head` conventions and reuse the Spec 006 app shell + a small per-page `<style>`. **Tailwind config note**: no
change is required — the `content` globs already include `./dashboard/**/*.html` (Spec 006), so the build scans the new
pages automatically.

## Complexity Tracking

> Only additive/justified shared-file touches are logged here. There are no principle violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Five new `dashboard/*.html` pages reusing the Spec 006 shell verbatim (own `<head>` from the `head` conventions; not the public header/footer) | The spec requires the real deals + coupons management modules in the canonical `dashboard/` location, consistent with the Spec 006 app experience. | Reusing the public marketing shell rejected (wrong for an app dashboard; spec-forbidden). Putting the pages under `pages/` rejected (violates the canonical merchant location + `../` path contract). A runtime-injected shared shell rejected (breaks standalone `file://` rendering — III). |
| **Additive extension** of `src/js/dashboard.js` (5 new per-page controllers dispatched by `<html data-page>`: list filter/sort/search + count/chips/reset, row + bulk actions, delete/archive confirm modals, status/featured toggles, duplicate, copy-code, export/import toasts; form validation + repeaters + slug/code/preview + conditional fields/warnings + mock upload) | The list-management and form behaviors are genuine page logic the declarative `data-*` layer does not cover; the spec scopes them into `dashboard.js` additively and they reuse the module's existing `DropdownController`/row-menu/form-wrapper primitives. | A new JS file per page rejected (the spec says extend `dashboard.js`; the shell behaviors already live there and the primitives are reusable). Extending `main.js` rejected (page-specific logic in a file every page loads → regression risk). Inline `<script>` rejected (the project uses defer modules; no bespoke inline JS). The existing Spec 006 `merchant-dashboard` controller and `main.js`/`ui.js`/the other feature modules stay unchanged. |
| New `assets/data/merchant-deals.json` (≥12) + `merchant-coupons.json` (≥12) | The lists/forms need believable, consistent mock catalogs as backend-ready reference data; reusing `deal-001…deal-010` / `coupons.json` ids keeps cross-page identity consistent (edit-deal `?id`, related-deal, public-deal CTAs). | Hardcoding everything inline only rejected (loses backend-ready reference data + cross-page consistency); JSON mirrors the existing `deals.json`/`merchant-*-preview.json` convention and is Django/CMS-ready. Static HTML still matches the catalogs (no runtime fetch for baseline — III). |
| Additive **management-action icon symbols** in `assets/icons/sprite.svg` (e.g., trash/pause/play/archive/duplicate/filter/sliders/upload/download/image/refresh/wand/percent/clock) | Row/bulk actions, filters/sort, mock upload, and generate-code need icons the current sprite lacks (it has edit/eye/copy/more/plus/tag/ticket/trend/calendar but no trash/pause/archive/filter/upload/wand). | A second sprite or per-icon `<img>` rejected (the project uses one sprite via `<use href="…sprite.svg#…">`). Reusing only existing icons rejected (ambiguous action icons hurt clarity/IV). Symbols are **appended** (no existing symbol changed) → zero regression. |
| **Link-only** rewiring of the deals/coupons entry points in the shared shell, incl. Spec 006 `dashboard/index.html` (sidebar العروض/إضافة عرض/الكوبونات + quick-add + any deals/coupons overview CTAs: `data-coming-soon` → real `href`) | The now-built pages must navigate for real wherever referenced (FR-043); the Spec 006 overview must not become a dead end to its newly-built modules. | Leaving them coming-soon rejected (the pages now exist → would be misleading/dead-ended). Removing/redesigning the Spec 006 overview sections rejected (preservation rule VIII; spec forbids it — only links change). Creating duplicate nav rejected (one shared shell). |
| Delete / archive / bulk-delete confirmation via the existing `.modal`/`window.TUI.modal` pattern; generate-random-code writes into the field | Constitution II/VI forbid `confirm()`/`prompt()`; destructive actions need a focus-managed confirmation and code generation must not use `prompt()`. | Browser `confirm()`/`prompt()` rejected (forbidden). A bespoke modal system rejected (`.modal` + `TUI.modal` already provides focus-managed, reduced-motion-aware dialogs). |
| List filter/sort/search + the responsive table→cards + stat grid + sticky summary + preview card + repeater rows via a small page-scoped `<style>` over tokens (no chart/table library) | `input.css` has no filter-panel/dashboard-table/stat-grid/sticky-summary/preview/repeater component; these are page-specific layout primitives. | Adding new global classes to `input.css` rejected (broader surface/regression risk; not needed beyond these pages). A JS-rendered table/list rejected (would not render without JS — III). An external table/datagrid library rejected (forbidden by II; the static table + CSS card transform is the Spec 006 precedent and no-JS-safe). |

## Phase status

- [x] Phase 0 — `research.md` (decisions D1–D11; no `NEEDS CLARIFICATION` remain)
- [x] Phase 1 — `data-model.md`, `contracts/deals-pages.contract.md`, `contracts/coupons-pages.contract.md`, `contracts/mock-data.contract.md`, `quickstart.md`; agent context (CLAUDE.md) updated to this feature
- [x] Constitution re-check after design — PASS (no new component/token/visual identity; page-scoped `<style>` + reused Spec 006 shell/primitives only; no chart/table library)
- [ ] Phase 2 — `tasks.md` (produced by `/speckit-tasks`, not this command)
```
