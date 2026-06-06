# Data Model — Final Frontend QA + Polish (Spec 011)

**Date**: 2026-06-06 | **Feature**: `011-frontend-qa-polish` | **Plan**: [plan.md](./plan.md)

This is a QA feature, so the "entities" are the **audit artifacts**: the page inventory under audit, the issue taxonomy that fixes are grouped by, the registry of automatable gates, and the schema of the deliverable report. These structures are what `/speckit-tasks` turns into per-area audit tasks and what `QA-FRONTEND-CHECKLIST.md` is rendered from.

---

## 1. Page Inventory (the audit surface)

The 32 existing pages, grouped by surface, each carrying audit-status flags. The 4 Spec 008 pages are listed as **ABSENT (coming-soon)**.

### 1.1 Public surface — `pages/` (16)

| # | Page | `data-page` (expected) | Type | Notes |
|---|------|------------------------|------|-------|
| 1 | `pages/index.html` | public homepage | marketing | hero search → compare; CTAs; newsletter |
| 2 | `pages/compare.html` | discovery | listing | query-param entry; source badges; filters/sort/empty/reset |
| 3 | `pages/deals.html` | discovery | listing | filters/sort/empty/skeleton/reset |
| 4 | `pages/coupons.html` | discovery | listing | copy-coupon; `dir="ltr"` codes |
| 5 | `pages/deal-details.html` | discovery | detail | booking-inquiry modal; related; FAQ; safe labels |
| 6 | `pages/destinations.html` | content/SEO | listing | semantic, non-thin |
| 7 | `pages/destination-details.html` | content/SEO | detail | substantial content; FAQ; JSON-LD |
| 8 | `pages/blog.html` | content/SEO | listing | article cards |
| 9 | `pages/article.html` | content/SEO | detail | substantial; ToC links; share |
| 10 | `pages/login.html` | member | form | validate; honest mock auth |
| 11 | `pages/register.html` | member | form | password-confirm; terms; honest |
| 12 | `pages/saved-deals.html` | member | listing | save toggles; empty state |
| 13 | `pages/price-alerts.html` | member | listing/form | alert modal; honest |
| 14 | `pages/profile.html` | member | form | settings toggles; honest |
| 15 | `pages/styleguide.html` | foundation | showcase | **must keep rendering; do not delete** |
| 16 | `pages/components.html` | foundation | showcase | **must keep rendering; do not delete** |

### 1.2 Merchant surface — `dashboard/` (9 present + 4 absent)

| # | Page | Status | Type | Notes |
|---|------|--------|------|-------|
| 17 | `dashboard/index.html` | present | overview | `.dash-*` shell; quick actions; checklist |
| 18 | `dashboard/deals.html` | present | listing | row menus; bulk; filters/reset |
| 19 | `dashboard/create-deal.html` | present | form | validate; honest |
| 20 | `dashboard/edit-deal.html` | present | form | validate; honest |
| 21 | `dashboard/coupons.html` | present | listing | copy code; row menus |
| 22 | `dashboard/create-coupon.html` | present | form | validate; honest |
| — | `dashboard/bookings.html` | **ABSENT** | — | Spec 008 never built → coming-soon only |
| — | `dashboard/booking-details.html` | **ABSENT** | — | Spec 008 never built → coming-soon only |
| — | `dashboard/customers.html` | **ABSENT** | — | Spec 008 never built → coming-soon only |
| — | `dashboard/customer-details.html` | **ABSENT** | — | Spec 008 never built → coming-soon only |
| 23 | `dashboard/analytics.html` | present | analytics | CSS visuals; date-range |
| 24 | `dashboard/integrations.html` | present | settings | mock config modals |
| 25 | `dashboard/settings.html` | present | settings/form | toggles; honest |

### 1.3 Owner surface — `admin/` (7)

| # | Page | `data-page` | Type | Notes |
|---|------|-------------|------|-------|
| 26 | `admin/index.html` | admin-overview | overview | `.admin-*` shell; KPIs; health; login-as disabled |
| 27 | `admin/companies.html` | admin-companies | listing | filters/sort/chips/reset; bulk confirm |
| 28 | `admin/company-details.html` | admin-company-details | detail | usage bars; timeline; reset-usage confirm |
| 29 | `admin/plans.html` | admin-plans | listing/detail | monthly/yearly; disable confirm |
| 30 | `admin/subscriptions.html` | admin-subscriptions | listing | MRR/ARR; cancel confirm |
| 31 | `admin/analytics.html` | admin-analytics | analytics | 8 CSS visuals; `#integrations` |
| 32 | `admin/content.html` | admin-content | tabs | 6 tabs all in DOM; publish/delete confirm |

### 1.4 Per-page audit-status flags (recorded in the report inventory table)

Each page row in `QA-FRONTEND-CHECKLIST.md` carries: `renders` · `nav checked` · `mobile checked` · `RTL checked` · `interactions checked` · `notes`. Flag domain: `✅ pass` | `⚠ fixed` (issue found & fixed) | `▶ manual` (delegated browser confirmation) | `n/a`.

### 1.5 Shared assets under audit (not pages, but in scope)

`src/js/{ui,main,dashboard,discovery,content,member,admin}.js` · `src/input.css` · `assets/css/tailwind.css` (build output) · `assets/icons/sprite.svg` · `assets/images/*` · `assets/data/*.json` · `partials/{head,header,footer}.html` · `tailwind.config.js` · `.prettierignore` · `.htmlvalidate.json`.

---

## 2. Issue Taxonomy (fix grouping)

Every found defect is recorded as an **Issue Record** and grouped under exactly one of the 11 categories used by both the tasks and the report's "issues found and fixed" section.

### 2.1 Issue Record schema

| Field | Values | Notes |
|-------|--------|-------|
| `id` | `ISSUE-NNN` | sequential |
| `category` | one of the 11 below | drives report grouping |
| `surface` | public \| merchant \| admin \| shared | |
| `location` | `file:line` or `file#selector` | clickable |
| `severity` | P1 \| P2 \| P3 | mirrors the user-story priority that owns it |
| `description` | text | what's wrong |
| `fix` | text | the surgical edit applied |
| `status` | fixed \| delegated(manual) \| documented(false-positive / known-limitation) | |
| `verified_by` | gate name (§3) | how the fix was confirmed |

### 2.2 The 11 categories

1. **navigation** — broken path, bare `#`, dead control, 404 link, stale coming-soon CTA, wrong cross-folder depth.
2. **responsive** — horizontal overflow, missing table→cards/scroll affordance, missing one-column grid fallback, sub-44px target, off-screen modal/dropdown.
3. **RTL** — physical-property misuse, missing `dir="ltr"` on a Latin run, wrong breadcrumb order, wrong drawer side.
4. **visual consistency** — ad-hoc style vs token, inconsistent button/badge/card/spacing, low contrast.
5. **JS interactions** — console error, duplicate listener/repeated toast, stuck dropdown/modal, lost focus return, stuck body-scroll, non-clearing reset, stale count, missing empty state, non-opening row menu, no-op toggle.
6. **forms** — missing label, missing inline error/`aria-invalid`/`aria-describedby`, no email/password-confirm/terms validation, dishonest success, unintended reload.
7. **accessibility** — missing focus state, keyboard trap, missing icon-button name, missing `aria-live`, contrast fail, missing table header/`scope`, button-vs-link misuse, reduced-motion ignored.
8. **SEO/semantics** — missing/duplicate `<h1>`, broken hierarchy, missing Arabic title/meta, non-semantic landmark, missing/invalid/misleading JSON-LD, thin content, missing FAQ.
9. **content honesty** — false live/real-backend claim, missing safe wording, missing source badge / unsafe booking label.
10. **performance/assets** — external CDN, non-`defer` script, duplicate script, broken image/SVG path, external chart/table lib, runtime-fetch core dependency.
11. **file cleanup** — stray backup/temp file, dead demo code, invalid/inconsistent data file, broken styleguide/components.

---

## 3. Audit-Gate Registry (automatable checks)

Each gate is a repeatable command with a defined pass condition; the report records each gate's result. Full command text lives in `quickstart.md` and the gate definitions in `contracts/audit-gates.contract.md`.

| Gate | Command (summary) | Pass condition | Verifies |
|------|-------------------|----------------|----------|
| `build` | `npm run build` | exit 0, `tailwind.css` regenerated | FR-013, SC-005 |
| `stack-grep` | `grep -RniE "react\|vue\|angular\|bootstrap\|jquery\|cdn.tailwindcss\|alert(\|confirm(\|prompt(" --include=*.{html,js,css}` excl. `node_modules` | 0 real hits (false positives documented) | FR-013, SC-004, SC-006 |
| `html-validate` | `npx html-validate pages/*.html dashboard/*.html admin/*.html` | 0 errors | FR-011, SC-005 |
| `js-syntax` | `node --check` per module | all OK | FR-008 |
| `lint-css` | `npm run lint:css` | 0 errors | FR-007 |
| `link-crawl` | folder-aware resolver (D3) | every internal target exists or is coming-soon; 0 bare-`#` dead | FR-003/004, SC-001/002 |
| `asset-crawl` | resolve every `img/use/href/src` + sprite symbol | 0 missing assets/symbols | FR-013, SC-003 |
| `structural-sweep` | one-`<h1>` + landmarks + `defer` + `dir="ltr"` + table→cards + icon-button `aria-label` grep | 0 violations | FR-005/006/011/012 |
| `honesty-grep` | bilingual forbidden-claim grep (D10) | 0 real hits | FR-010, SC-011 |
| `json-validity` | parse every `assets/data/*.json` | all valid; ids consistent | FR-014 |
| `a11y` | `@axe-core/cli` (served) **or** documented manual AA | 0 serious/critical, or manual sign-off | FR-012 |
| `browser-manual` | `quickstart.md` viewport/console script via `npm run serve` | user sign-off | FR-005/008 (delegated) |

---

## 4. QA Report Schema (`QA-FRONTEND-CHECKLIST.md`)

The deliverable's required structure (full contract in `contracts/qa-report.contract.md`):

1. **Summary** — project name; QA date; tested scope (32 pages / 3 surfaces / 7 JS modules; 4 absent documented); **final status** = PASS / PASS WITH NOTES / FAIL (rubric per research D16).
2. **Commands/checks run** — every gate from §3 with its exact command and result; static-vs-browser split called out.
3. **Page inventory table** — the §1 rows with the §1.4 status flags (path · renders · nav · mobile · RTL · interactions · notes).
4. **Issues found & fixed** — grouped by the §2.2 eleven categories; each an Issue Record (§2.1).
5. **Remaining notes / known limitations** — honest list (no backend → forms frontend-only; integrations/exports/charts are mock; axe blocked → manual; any browser-only confirmation delegated to the user).
6. **Final confirmation checklist** — the spec's acceptance bullets (all pages render; no dead buttons; no broken links; no console errors; no Tailwind CDN; no forbidden frameworks; no browser dialogs; mobile usable; RTL correct; forms validate; modals/toasts/dropdowns/drawers work; copy works; filters/sorts work; dashboards usable; admin usable; content honesty passed; client-presentable), each marked ✅ / ▶ manual / ⚠.

---

## 5. State & invariants

- **No persistence introduced**: every fix keeps state session-only; reload restores mock defaults (FR-010/017).
- **Shared-asset safety**: any edit to a `src/js/*` module, `src/input.css`, `partials/*`, or `assets/data/*` is followed by a non-regression re-render check of every surface that consumes it (FR-016).
- **No new file except the report**: the only added path is `travel-saas-frontend/QA-FRONTEND-CHECKLIST.md` (FR-001).
- **Absent-page invariant**: 0 references resolve to the 4 Spec 008 pages as real navigations (FR-002, SC-001).
- **Stack invariant**: the `stack-grep` gate stays at 0 real hits after all fixes (FR-013/017, SC-004/006).
