# Research & Decisions — Final Frontend QA + Polish (Spec 011)

**Date**: 2026-06-06 | **Feature**: `011-frontend-qa-polish` | **Plan**: [plan.md](./plan.md)

This is a QA/audit/polish feature, so "research" is the **methodology** for auditing, the **technical decisions** for how each gate is run and how each class of issue is fixed safely, and the **honest scoping** of what can be verified statically vs. only in a browser. No `NEEDS CLARIFICATION` items remained from the spec; the decisions below (D1–D16) make the spec's fourteen audit areas executable and unambiguous for `/speckit-tasks` and `/speckit-implement`.

---

## D1 — Audit-then-fix-then-verify, never rewrite

**Decision**: Each audit area runs as a three-step loop: (1) a repeatable check emits a categorized issue list; (2) each issue is fixed with the **smallest surgical edit** that resolves it; (3) the check re-runs to confirm zero remaining hits, plus a non-regression re-render of the affected surface. Pages are **never** rewritten; sections are **never** removed.

**Rationale**: The spec forbids new features/pages/frameworks and "prefer small fixes and consistency cleanup over rewriting pages." A rewrite would risk regressing Specs 001–010 and the believable mock-data consistency the constitution requires (VII). Surgical edits keep the blast radius minimal and auditable.

**Alternatives considered**: Page-by-page rebuild to a fresh template — rejected: violates the no-rewrite/preserve-working-sections rule, enormous regression surface, no added value. Auto-formatter "fix everything" pass — rejected: Prettier v3 corrupts inline `<style>` HTML (see D15).

---

## D2 — Gate tooling: reuse the installed Spec 001–010 toolchain only

**Decision**: All automatable gates use already-installed devDependencies: `npm run build` (tailwind), `npx html-validate admin/*.html pages/*.html dashboard/*.html`, `npm run lint:css` (stylelint over `src/**/*.css`), `node --check` per JS module, `@axe-core/cli` (when a served origin is up), and plain `grep`/`node` scripts for the stack-grep, link-crawl, structural sweep, and copy-honesty grep. `npm run serve` (`serve@^14`) provides the static origin for browser-only checks.

**Rationale**: Adding a new audit dependency would itself need stack-compliance justification and could drift from how Specs 001–010 were verified. The existing toolchain already covers build, HTML validity, CSS lint, and a11y.

**Alternatives considered**: Headless-browser crawler (Playwright/Puppeteer) for true console + visual checks — rejected as an added heavy dependency and because the executor environment has no browser; the browser-only checks are instead scripted in `quickstart.md` for the user (D16). Pa11y/Lighthouse-CI — rejected: redundant with axe + manual, extra deps.

---

## D3 — Navigation/link audit: a folder-aware crawler with explicit path rules

**Decision**: A Node/grep crawler extracts every internal `href`, `src`, and asset reference per page, then resolves it **relative to that page's folder** and asserts the target file exists. Path rules enforced:
- `pages/*` → siblings by bare filename (`compare.html`), assets via `../assets/…`, JS via `../src/js/…`.
- `dashboard/*` → public via `../pages/…`, assets `../assets/…`, JS `../src/js/…`, siblings by bare filename.
- `admin/*` → public via `../pages/…`, merchant via `../dashboard/…`, assets `../assets/…`, JS `../src/js/…`, siblings by bare filename.
A link is a **defect** if: the resolved file does not exist (404), it is a bare `#`/empty with no JS handler (`data-*` action), or it points at one of the 4 absent Spec 008 pages as a real navigation.

**Rationale**: Cross-surface relative-path depth is the most error-prone navigation failure (a block copied between folders keeps the wrong `../`). A folder-aware resolver catches exactly these.

**Alternatives considered**: Treating all links as root-relative — rejected: the project uses folder-relative paths (no server rewrite), so root-relative would mis-resolve. Manual click-through only — rejected: 32 pages × dozens of links is error-prone and unrepeatable.

---

## D4 — The 4 absent Spec 008 pages → coming-soon, never built

**Decision**: `dashboard/bookings.html`, `dashboard/booking-details.html`, `dashboard/customers.html`, `dashboard/customer-details.html` stay **unbuilt**. Any reference to them (merchant sidebar entry, overview CTA, cross-link) MUST resolve to a `data-coming-soon` toast (or a visibly "قريباً"-marked, non-navigating control) — never an `href` to the missing file. The QA report documents them as intentionally absent.

**Rationale**: The spec explicitly forbids adding new pages and requires absent pages "not [be] linked as a real destination." CLAUDE.md and the filesystem confirm Spec 008 was never built (only `merchant-bookings-preview.json` exists).

**Alternatives considered**: Build the 4 pages — rejected: out of scope ("do not add new pages / major features"). Delete the sidebar entries entirely — rejected: the SaaS direction (VIII) wants the surfaces visually anticipated; a coming-soon affordance preserves that intent honestly.

---

## D5 — Responsive audit: viewport matrix + static overflow-risk sweep + scripted manual check

**Decision**: Verified at 320/360/390/768/1024/1280px. Static proxies the executor can run: grep each dense table for a table→cards affordance (`data-label` cells + a `@media` stacking rule) **or** an `overflow-x:auto` wrapper; grep for fixed pixel widths / `width:100vw` / non-wrapping rows that risk overflow; confirm KPI/stat/plan/segment grids carry a one-column `@media` fallback; confirm sidebars have a drawer + scrim. True pixel overflow is confirmed by the user via the `quickstart.md` viewport script (devtools device toolbar).

**Rationale**: Horizontal overflow is browser-measured, but the **causes** (un-wrapped wide tables, fixed widths, missing one-column fallbacks) are statically detectable, so most defects are found without a browser; the residual is honestly delegated.

**Alternatives considered**: Asserting "responsive: pass" from CSS alone — rejected as dishonest (overflow needs measurement). Headless viewport screenshots — rejected (no browser/added dep, D2).

---

## D6 — RTL audit: logical-property + `dir="ltr"` Latin-run enforcement

**Decision**: Confirm `<html dir="rtl">` on all pages. Grep for RTL-breaking **physical** properties used directionally (`left:`/`right:`/`margin-left`/`padding-right`/`text-align:left|right`) inside page-scoped styles where a logical property (`inset-inline-*`, `margin-inline-*`, `text-align:start|end`) is required, and fix the ones that break mirroring. Confirm every Latin run that must read LTR (coupon code, email, URL, invoice id, money amount, phone) carries `dir="ltr"`. Confirm breadcrumb DOM order reads correctly RTL and the mobile drawer opens from the RTL-correct side.

**Rationale**: Most RTL bugs are either a hardcoded physical offset or an unmarked Latin run; both are grep-detectable. The platform is Arabic-first (V), so this is a correctness gate, not cosmetic.

**Alternatives considered**: Flip the whole stylesheet to a separate RTL build — rejected: the project is RTL-native with logical properties already; a separate build is a new mechanism the constitution doesn't use.

---

## D7 — Visual-consistency audit: token spot-check across one page per surface

**Decision**: Compare the shared component set (buttons, cards, badges, inputs, toggles, modals, drawers, toasts, dropdowns, action menus, table rows, empty/skeleton states, spacing, radii, shadows, gradients, icon sizes) on at least one representative page per surface (public + merchant + admin), checking they resolve to the **same design tokens / utility patterns** rather than ad-hoc values. Flag and normalize drift (a stray hex where a token exists, an off-scale padding, a low-contrast pair) to the existing token.

**Rationale**: One design system across three surfaces is what makes the prototype read as "one premium product" (IV). Token-based comparison is objective and avoids subjective redesign.

**Alternatives considered**: Full pixel design review of all 32 pages — rejected: subjective, slow, and risks scope-creeping into a redesign (forbidden). Restyling to a new component library — rejected (II/no-redesign).

---

## D8 — JS-interaction audit: per-primitive behavior review + console-clean proxies

**Decision**: For each interaction primitive (drawer, dropdown, modal, toast, copy, favorite/save toggle, filter/sort/reset/chips, tabs, accordion, row-action menu, bulk action, confirm modal), verify the wiring exists and is single-bound (a `_initialized`/guard pattern prevents duplicate listeners → repeated toasts), focus returns after modal/drawer close, body-scroll locks/unlocks, and resets clear state + update the `aria-live` count. Console-cleanliness proxies the executor can run: `node --check` per module (syntax), guard-list/`data-page` dispatch review, and `html-validate` (malformed DOM that throws at runtime). The live console check is scripted for the user (D16).

**Rationale**: The behaviors are in already-shipped JS; the realistic failure modes (duplicate listeners, lost focus, stuck scroll, stale counts) are reviewable in source, and syntax/DOM validity catches the errors that would actually throw.

**Alternatives considered**: Asserting console-clean without a browser — rejected as dishonest; instead delegate the live check and document it. Rewriting the JS modules — rejected (no-rewrite, D1).

---

## D9 — Forms audit: label + inline-error + honest-success contract

**Decision**: Every form is checked for: a label (or `aria-label`) on each control; required-field marking; inline error display via `aria-invalid` + `aria-describedby` pointing at a `.field-error`; email-format validation; password-confirm match where applicable; required terms checkbox where applicable; a success path that shows a **toast/inline message that does not imply server storage**; and `novalidate` + JS-prevented submit so no unintended reload occurs (only an intended GET search may navigate). Reuse `TUI.validateForm` / the `data-frontend-form` delegation — no new validation engine.

**Rationale**: Constitution VI requires visible validation states and VI/IX require honesty; reusing the existing validator keeps fixes surgical.

**Alternatives considered**: HTML5 native validation only — rejected: inconsistent styling/announcement and no honest-success control. A new validation lib — rejected (II).

---

## D10 — Content-honesty audit: forbidden-claim grep + safe-wording mapping

**Decision**: A bilingual grep flags risky claims (e.g. "تم الحجز"/"booked", "تم الدفع"/"payment processed", "تم الإرسال"/"sent", "مباشر"/"live", "تم الحفظ"/"saved", "تم تسجيل الدخول", real-invoice/real-API/real-scraping/real-analytics/visa-guarantee phrasing). Each true hit is rewritten to approved safe wording from the contract (بيانات تجريبية / إجراء تجريبي / أسعار إرشادية / قابل للربط لاحقًا / لا يتم تنفيذ إجراء حقيقي في هذه النسخة / لا يتم الحفظ على خادم حاليًا / لا يتم إرسال إشعارات حقيقية / لا يتم معالجة مدفوعات / يحتاج مراجعة قبل النشر / معلومات التأشيرة إرشادية…). Grep false positives (a substring inside a legitimate Arabic word, or "alert" inside an identifier) are documented, not "fixed."

**Rationale**: IX forbids faking live/real backend behavior; a grep + curated mapping makes the audit repeatable and the fixes consistent with the wording Specs 006–010 already use.

**Alternatives considered**: Manual read-through only — rejected: 32 pages, easy to miss a claim, unrepeatable. Blanket-append a disclaimer to every page — rejected: weak (doesn't fix the specific dishonest control) and clutters premium UI.

---

## D11 — SEO/semantics audit: structural sweep on public pages (+ admin/merchant H1)

**Decision**: Per public page assert exactly one `<h1>`, a non-skipping heading hierarchy, an Arabic `<title>` + meta description (and no duplicate title/meta across important public pages), semantic `main/section/article/nav/footer`, descriptive link text + `alt`, FAQ presence where the contract expects it, and any JSON-LD present being well-formed and **not** claiming live offers/prices. Dashboard/admin pages assert one `<h1>` + sensible hierarchy + semantic tables/lists/forms (their `robots noindex` is acceptable).

**Rationale**: X requires SEO-ready, non-thin, semantic public content; these checks are static and objective.

**Alternatives considered**: Lighthouse SEO score only — rejected: needs a browser and doesn't catch misleading JSON-LD. Adding new structured data — rejected: out of scope (audit, not enrich), beyond fixing invalid/misleading existing JSON-LD.

---

## D12 — Accessibility audit: axe-where-possible, else documented manual WCAG 2.1 AA

**Decision**: Run `@axe-core/cli` against representative pages **when** `npm run serve` provides an origin; otherwise perform and **document** a manual WCAG 2.1 AA audit covering: visible focus, keyboard order/no-trap, modal/drawer Esc + focus return, labels, `aria-invalid`/`aria-describedby`, `aria-live` on dynamic counts/status, icon-only-button accessible names, contrast, ≥44px targets, meaningful `alt`, reduced-motion respect, table headers/`scope`, and button-vs-link correctness. The report states which mode was used and why (honest limitation if axe was blocked).

**Rationale**: Constitution + spec mandate AA; axe may be environment-blocked (no headless driver), and the spec explicitly says to document that and substitute a manual audit rather than hide it.

**Alternatives considered**: Skip a11y if axe can't run — rejected (dishonest, violates the spec). Manual-only always — acceptable fallback but axe is preferred when available for objective coverage.

---

## D13 — Performance/assets audit: CDN/defer/broken-path/duplicate-script sweep

**Decision**: Grep all pages for external-origin `src`/`href`/`@import`/`url()` (must be none — local fonts/assets only); confirm every `<script>` is `defer` and no module is double-included; resolve every `<img src>`/`<use href="#…">`/sprite reference to an existing asset/symbol; confirm `assets/css/tailwind.css` is referenced with the correct per-folder depth and regenerates via `npm run build`; confirm no external chart/table/date library and no runtime `fetch` is required to render core content.

**Rationale**: XI/performance budget and II forbid CDNs and external libs; broken image/SVG paths are a common, statically-detectable polish defect.

**Alternatives considered**: Network-tab inspection only — rejected (browser-only, unrepeatable); static path resolution finds missing assets deterministically.

---

## D14 — File/structure cleanup: backups, dead demo code, data consistency

**Decision**: Scan for stray backup/temp files (`*.bak`, `*~`, `* copy.html`, `.orig`), duplicate/broken scripts, and dead commented-out demo blocks introduced during prior specs; verify `assets/data/*.json` are valid JSON and that ids referenced across surfaces agree (a deal/coupon/destination id shown in admin matches the public catalog). **Do not** delete `styleguide.html`/`components.html` (foundation QA — must keep rendering). Update README/QA notes where useful.

**Rationale**: XII/cleanliness and VII/consistent-mock-data; a stray backup or an id mismatch undermines the "finished product" impression.

**Alternatives considered**: Aggressive dead-code removal across JS — rejected: risks regressing shared modules; limit to clearly-dead, page-local, non-referenced blocks.

---

## D15 — Fix-safety: Prettier-v3 inline-`<style>` corruption guard + html-validate alignment

**Decision**: **Never** run `prettier --write` over HTML files that contain an inline `<style>` block. Prettier v3 corrupts them — it escapes `<`→`\3c` (destroying `<style>`/comments) and rewrites `@media (max-width:Npx)` into CSS-range syntax (`width <= Npx`) that the html-validate tokenizer rejects. The audit keeps/extends `.prettierignore` to cover such HTML (the admin pages are already listed; verify the public/dashboard pages with inline styles are too, or simply scope `npm run format` to JS/JSON/CSS). Keep `.htmlvalidate.json` aligned to the project's real HTML5 output (lowercase doctype, self-closing voids) so the gate reflects genuine defects, not formatter drift.

**Rationale**: This exact corruption was hit and resolved during the Spec 010 QA gate; re-running an unscoped formatter would silently break already-valid pages. Encoding it as a rule prevents recurrence.

**Alternatives considered**: Fix Prettier's behavior / upgrade — rejected: out of scope, not in our control. Move all inline `<style>` to external CSS — rejected: large, risky refactor of working pages (no-rewrite, D1); the pages intentionally ship page-scoped styles inline per the Spec 002–010 precedent.

---

## D16 — Honest static/browser split + the QA report status rubric

**Decision**: The report explicitly separates **statically-verified** gates (build, stack-grep, html-validate, link/asset crawl, structural sweep, copy-honesty grep, JSON validity) from **browser-confirmed** checks (live console-clean, pixel responsive/RTL/visual, axe-served), and `quickstart.md` scripts the latter for the user via `npm run serve`. **Status rubric**: **PASS** = all statically-verifiable gates green and no P1 acceptance criterion unmet; **PASS WITH NOTES** = all P1 green but a browser-only confirmation is delegated to the user or a known mock limitation remains (e.g. axe blocked → manual audit, integrations/exports/charts are mock); **FAIL** = any P1 acceptance criterion unmet (a real dead link/404, a forbidden-tech hit, a browser dialog, a dishonest live-backend claim, a console-throwing error found statically). All known limitations are listed honestly.

**Rationale**: The executor cannot run a browser, so asserting browser-only results as "done" would be dishonest (the spec demands honesty). The split + the rubric make the report truthful and still actionable, with a clear, bounded sign-off the user can complete.

**Alternatives considered**: Claim full PASS including visual/console — rejected (dishonest). Refuse to report browser-only areas at all — rejected: less useful than delegating them with an exact script.

---

## Summary of decisions

| # | Decision | Drives |
|---|----------|--------|
| D1 | Audit→fix→verify, never rewrite | All areas; FR-001…017 |
| D2 | Reuse installed toolchain only | Gates; FR-013 |
| D3 | Folder-aware link crawler + path rules | Navigation; FR-003/004 |
| D4 | 4 Spec 008 pages → coming-soon, unbuilt | Inventory/nav; FR-002 |
| D5 | Viewport matrix + static overflow sweep + manual script | Responsive; FR-005 |
| D6 | Logical-property + `dir="ltr"` enforcement | RTL; FR-006 |
| D7 | Token spot-check across surfaces | Consistency; FR-007 |
| D8 | Per-primitive review + console proxies | JS; FR-008 |
| D9 | Label+inline-error+honest-success contract | Forms; FR-009 |
| D10 | Forbidden-claim grep + safe-wording map | Honesty; FR-010 |
| D11 | Structural SEO/semantics sweep | SEO; FR-011 |
| D12 | axe-or-documented-manual AA | A11y; FR-012 |
| D13 | CDN/defer/broken-path/dup-script sweep | Perf/assets; FR-013 |
| D14 | Backups/dead-code/data-consistency scan | Cleanup; FR-014 |
| D15 | Prettier-corruption guard + html-validate alignment | Fix-safety; FR-016/017 |
| D16 | Static/browser split + status rubric | Report; FR-001, FR-015, SC-015 |

All decisions comply with Constitution v1.0.0 and add no dependency, page, framework, or backend. Ready for Phase 1 (data-model, contracts, quickstart).
