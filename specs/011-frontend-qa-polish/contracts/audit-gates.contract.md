# Contract — Audit Gates (Spec 011)

**Purpose**: Define each automatable QA gate as a verifiable contract: the exact command, the pass condition, the scope, and how its result is recorded. These gates are the objective backbone of `QA-FRONTEND-CHECKLIST.md`. All commands run from `travel-saas-frontend/`.

> Paths use the three surfaces: `pages/*.html` (16), `dashboard/*.html` (9 present), `admin/*.html` (7). The 4 absent Spec 008 pages are never targets.

---

## G1 — Build gate

- **Command**: `npm run build`
- **Pass**: exit code 0; `assets/css/tailwind.css` regenerated without error.
- **Fail action**: read the tailwind error, fix the offending utility/config, re-run.
- **Records**: `build: PASS|FAIL` + duration.

## G2 — Stack-compliance grep (hard gate)

- **Command**:
  ```bash
  grep -RniE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
    --include=*.html --include=*.js --include=*.css . | grep -v node_modules
  ```
- **Pass**: 0 **real** hits. A hit is a **false positive** only if it is (a) a substring inside a legitimate Arabic word or identifier (e.g. `إعادة تفعيل` contains "react" transliteration artifacts in tooling, `onConfirm`/`confirmModal` identifiers contain "confirm"), or (b) a CSS class/var name unrelated to the forbidden tech. Every false positive MUST be quoted and justified in the report.
- **Also forbidden** (extended grep): external chart/table/date libs — `chart\.js|apexcharts|highcharts|echarts|d3|datatables|ag-grid|flatpickr|moment`.
- **Records**: `stack-grep: 0 real hits` + the documented false-positive list.

## G3 — HTML validation

- **Command**: `npx html-validate pages/*.html dashboard/*.html admin/*.html`
- **Pass**: 0 errors across all 32 pages.
- **Config invariant**: `.htmlvalidate.json` stays aligned to the project's real HTML5 output — `doctype-style: lowercase`, `void-style: selfclose` (matches Prettier v3 output). Do **not** loosen rules to mask a real defect.
- **Common fixes** (from Spec 010 precedent): add `type="button"` to non-submit buttons; add `aria-label` to icon-only buttons; add `scope="col"` to `<th>`; remove duplicate `id`.
- **Records**: `html-validate: PASS (0 errors, 32 pages)`.

## G4 — JS syntax / load-safety

- **Command**: `for f in src/js/*.js; do node --check "$f" || echo "FAIL $f"; done`
- **Pass**: every module parses. Plus a review that each page-scoped controller is behind its `data-page`/guard so it no-ops on other pages (prevents runtime `TypeError` on missing elements → console errors).
- **Records**: `js-syntax: all OK (7 modules)`.

## G5 — CSS lint

- **Command**: `npm run lint:css` (stylelint over `src/**/*.css`)
- **Pass**: 0 errors (auto-fixable issues fixed via `npx stylelint --fix "src/**/*.css"`).
- **Records**: `lint:css: PASS`.

## G6 — Link crawl (folder-aware)

- **Method** (research D3): for each page, extract internal `href`/`src`, resolve **relative to the page's folder**, assert the target exists.
- **Path rules**:
  | From | Public page | Merchant page | Asset | JS |
  |------|-------------|---------------|-------|-----|
  | `pages/*` | bare filename | `../dashboard/…` | `../assets/…` | `../src/js/…` |
  | `dashboard/*` | `../pages/…` | bare filename | `../assets/…` | `../src/js/…` |
  | `admin/*` | `../pages/…` | `../dashboard/…` | `../assets/…` | `../src/js/…` |
- **Pass**: every resolved internal target exists OR is an intentional `data-coming-soon` control (no `href` to a missing file); 0 bare `#`/empty `href` without a JS `data-*` handler; 0 links to the 4 absent Spec 008 pages.
- **Records**: `link-crawl: 0 broken, 0 dead, N coming-soon affordances verified`.

## G7 — Asset crawl

- **Method**: resolve every `<img src>`, `<use href="#sym">` (→ sprite symbol must exist in `assets/icons/sprite.svg`), `<link href>`, font `url()`.
- **Pass**: 0 missing files; 0 missing sprite symbols; CSS referenced with correct per-folder depth.
- **Records**: `asset-crawl: 0 missing`.

## G8 — Structural sweep

- **Checks** (grep/Node, per page):
  - exactly one `<h1>`; non-skipping heading order.
  - semantic landmarks present (`main`, `nav`, `footer`; `article`/`section` on content pages).
  - every `<script>` has `defer`.
  - Latin runs (coupon code / email / URL / invoice id / amount / phone) carry `dir="ltr"`.
  - dense tables have a table→cards affordance (`data-label` + stacking `@media`) **or** `overflow-x:auto` wrapper.
  - icon-only buttons have an accessible name (`aria-label`/`title`+`aria-label`).
  - dynamic count/status regions have `aria-live`.
- **Pass**: 0 violations (or each logged + fixed).
- **Records**: per-check pass counts in the inventory table.

## G9 — Content-honesty grep

- **Method** (research D10): bilingual forbidden-claim grep; each true hit rewritten to approved safe wording (see `content-honesty.contract.md`).
- **Pass**: 0 real dishonest claims remain; false positives documented.
- **Records**: `honesty-grep: 0 real hits`.

## G10 — JSON validity & cross-surface id consistency

- **Method**: parse each `assets/data/*.json`; spot-check that ids referenced across surfaces (a deal/coupon/destination/article id shown in admin/dashboard matches the public catalog) agree.
- **Pass**: all valid JSON; no contradictory id/label.
- **Records**: `json-validity: all valid; ids consistent`.

## G11 — Accessibility (axe-or-manual)

- **Preferred**: `npm run serve` (origin at `http://localhost:3000`), then `npx axe http://localhost:3000/<page>` for ≥1 representative page per surface.
- **Fallback** (if no headless driver): documented manual WCAG 2.1 AA audit covering the §G8 items plus focus visibility, keyboard order/no-trap, modal/drawer Esc + focus-return, contrast, ≥44px targets, reduced-motion.
- **Pass**: 0 serious/critical axe violations, OR a recorded manual sign-off with the limitation noted.
- **Records**: `a11y: axe PASS` or `a11y: manual AA (axe blocked: <reason>)`.

## G12 — Browser-manual (delegated)

- **Method**: `quickstart.md` viewport + console script the **user** runs via `npm run serve`.
- **Scope**: live console-clean per page; pixel responsive at 320/360/390/768/1024/1280; RTL/visual confirmation.
- **Records**: `browser-manual: ▶ delegated` until the user signs off; the report lists it under Remaining Notes if unconfirmed at write time.

---

## Gate ordering (recommended run order)

`G1 build` → `G2 stack-grep` → `G3 html-validate` → `G4 js-syntax` → `G5 lint:css` → `G6 link-crawl` → `G7 asset-crawl` → `G8 structural` → `G9 honesty` → `G10 json` → `G11 a11y` → `G12 browser-manual`. Re-run G1–G3 after any shared-file edit (non-regression).

## Acceptance

A gate is **green** only when its pass condition holds across **all in-scope files**, not a sample. The report MUST show each gate's command and result; a delegated/limited gate MUST say so explicitly (no silent "pass").
