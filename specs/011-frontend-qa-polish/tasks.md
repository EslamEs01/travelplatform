---
description: "Task list — Final Frontend QA + Polish (Spec 011)"
---

# Tasks: Final Frontend QA + Polish (Travel SaaS Platform)

**Input**: Design documents from `specs/011-frontend-qa-polish/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅ (D1–D16), data-model.md ✅, contracts/ ✅ (4 files), quickstart.md ✅

**Tests**: NOT requested. This is a QA/audit/polish pass verified by repeatable gates (build, stack-grep, html-validate, link/asset crawl, structural sweep, honesty grep, axe-or-manual) — consistent with Specs 001–010. No unit/contract test tasks are generated. **Each user story is an audit concern; "done" = its gate is green platform-wide.**

**Organization**: Tasks are grouped by user story (US1–US9 from spec.md, priority order). Each story audits one concern across all surfaces and fixes every issue it finds, then re-verifies its gate. The deliverable `QA-FRONTEND-CHECKLIST.md` is assembled in the final phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — **different files, no dependency on an incomplete task**.
- **[Story]**: US1–US9 (audit-concern phases only). Setup/Foundational/Polish carry no story label.

## ⚠️ Shared-file serialization (read before parallelizing)

- The three surfaces are **distinct file sets** — `pages/*.html` (16), `dashboard/*.html` (9), `admin/*.html` (7) — so a story's per-surface audit/fix tasks are `[P]` **with each other**. Two tasks editing the **same page file** are sequential.
- **`src/js/{ui,main,dashboard,discovery,content,member,admin}.js`** is a serialization bottleneck: any task that edits a shared JS module is **sequential** with every other JS-editing task (never `[P]`). Most nav/honesty/RTL/SEO fixes are HTML-only and reuse existing `main.js` `data-*` + `window.TUI` (no JS edit) — keep it that way.
- **`src/input.css`** (design tokens) is shared: a visual-consistency fix that touches it serializes and triggers a `npm run build` + re-render (non-regression).
- **Config** (`.prettierignore`, `.htmlvalidate.json`, `tailwind.config.js`) is touched once in Setup — do not parallelize edits to it.
- **`specs/011-frontend-qa-polish/audit-notes.md`** (the working issue log) is appended by every story's re-verify task — keep those re-verify tasks sequential within their phase.

## Fix-safety rules (apply to EVERY fix task — research D1/D15)

- **Surgical edits only** — no page rewrite, no section removal, no new framework/page/backend; reuse `window.TUI` + `main.js` declarative `data-*`.
- **NEVER** run `prettier --write` over HTML that contains an inline `<style>` block (Prettier v3 escapes `<`→`\3c` and rewrites `@media` into tokenizer-breaking range syntax). Keep `npm run format` scoped to JS/JSON/CSS.
- After any edit to a **shared** file (`src/js/*`, `src/input.css`, `partials/*`, `assets/data/*`), re-run G1–G3 and re-render every consuming surface (non-regression).
- **Do not** delete `pages/styleguide.html` / `pages/components.html`.
- All state stays **session-only**; no fix introduces real persistence.

## Path conventions

Static frontend under `travel-saas-frontend/`. Public pages `pages/`, merchant `dashboard/`, owner `admin/`, shared JS `src/js/`, tokens `src/input.css`, mock data `assets/data/`, sprite `assets/icons/sprite.svg`. Gate commands run from `travel-saas-frontend/` (see `quickstart.md`).

---

## Phase 1: Setup (baseline + fix-safety config)

**Purpose**: Establish a safe starting state — confirm the audit surface and lock the two fix-safety configs before any edit.

- [X] T001 Confirm the page inventory in `specs/011-frontend-qa-polish/audit-notes.md` (create the file): all 32 pages exist (`pages/*.html` ×16, `dashboard/*.html` ×9, `admin/*.html` ×7) and the 4 Spec 008 pages (`dashboard/{bookings,booking-details,customers,customer-details}.html`) are ABSENT — record each with its expected `data-page` and surface (data-model §1; FR-002).
- [X] T002 [P] Fix-safety: verify/extend `travel-saas-frontend/.prettierignore` so **every** HTML file containing an inline `<style>` block (admin already listed; audit `pages/*.html` + `dashboard/*.html` for inline `<style>`) is excluded from Prettier, and confirm `npm run format` is effectively scoped to JS/JSON/CSS (research D15).
- [X] T003 [P] Fix-safety: verify `travel-saas-frontend/.htmlvalidate.json` is aligned to the project's real HTML5 output (`doctype-style: lowercase`, `void-style: selfclose`) and that no rule is loosened to mask a real defect (research D15; audit-gates G3).

**Checkpoint**: Surface confirmed; formatter/validator configs safe — edits will not corrupt already-valid pages.

---

## Phase 2: Foundational (issue log + baseline gate sweep)

**Purpose**: Seed the working issue log every story appends to, and capture the initial state of every machine gate.

**⚠️ CRITICAL**: No user-story audit can be marked complete until the baseline exists (each story re-verifies against it).

- [X] T004 Scaffold the working issue log in `specs/011-frontend-qa-polish/audit-notes.md`: the 11 issue categories (data-model §2.2) + the page-inventory status table skeleton (path · renders · nav · mobile · RTL · interactions · notes) (data-model §4 / §1.4).
- [X] T005 Run the **baseline machine-gate sweep** from `travel-saas-frontend/` and record raw results + the seeded issue list into `audit-notes.md`: `npm run build` (G1), stack-grep (G2), `npx html-validate pages/*.html dashboard/*.html admin/*.html` (G3), `node --check` ×7 modules (G4), `npm run lint:css` (G5), folder-aware link-crawl (G6), asset/sprite crawl (G7), structural sweep (G8), honesty grep (G9), JSON validity (G10) — per `quickstart.md §1` and `contracts/audit-gates.contract.md`.

**Checkpoint**: Baseline captured; every story now audits its slice, fixes, and re-verifies its gate to green.

---

## Phase 3: User Story 1 — No dead ends: navigation & link integrity (Priority: P1) 🎯 MVP

**Goal**: Every link/CTA/row-action/modal-action across all 32 pages resolves to a real page, modal, drawer, toggle, copy, filter, form, toast, coming-soon, or confirm — with correct cross-folder relative paths and zero references to the 4 absent Spec 008 pages as real destinations.

**Independent test**: `link-crawl` (G6) reports 0 broken internal links, 0 bare-`#`/dead controls, 0 absent-page-as-real-navigation; the three end-to-end flow link paths resolve; stale coming-soon CTAs whose page now exists are repointed.

- [X] T006 [P] [US1] Audit + fix navigation in **public** `travel-saas-frontend/pages/*.html` (16 files): navbar, mobile drawer, footer, homepage hero/section CTAs, deal/destination/article card links, breadcrumbs, member-area links, cross-surface links (`../dashboard/…`, `../admin/…`) — repoint broken paths, convert bare-`#`/404 links to a real behavior or `data-coming-soon`, repoint stale coming-soon CTAs (navigation-audit.contract §2/§4).
- [X] T007 [P] [US1] Audit + fix navigation in **merchant** `travel-saas-frontend/dashboard/*.html` (9 files): `.dash-*` sidebar (the 4 absent Spec 008 entries → `data-coming-soon`, never an `href` to the missing file), topbar, quick actions, table row-action menus, bulk-action bar, modal actions, "back to site" → `../pages/index.html` (navigation-audit.contract §3/§4; FR-002).
- [X] T008 [P] [US1] Audit + fix navigation in **owner** `travel-saas-frontend/admin/*.html` (7 files): `.admin-*` sidebar (7 pages + `analytics.html#integrations` deep-link + settings coming-soon), topbar dropdowns, quick actions, row-action menus (**login-as stays disabled/safe** — never a real session), bulk actions, modal actions, "back to site" → `../pages/index.html`, "companies dashboard" → `../dashboard/index.html` (navigation-audit.contract §4).
- [X] T009 [US1] Re-run `link-crawl` + `asset-crawl` (G6/G7) → assert 0 broken / 0 dead-`#` / 0 absent-as-real; walk the three end-to-end flow link paths (quickstart §2); record nav issues-found-and-fixed + set the inventory `nav` flags in `audit-notes.md`.

**Checkpoint**: US1 done — the platform has no dead ends or broken links (the MVP of "client-presentable"). Independently demonstrable.

---

## Phase 4: User Story 2 — Honest about mock/frontend-only data (Priority: P1)

**Goal**: No copy or mutating control claims a real backend action; every such surface carries approved safe wording; source badges + safe booking labels present; login-as disabled/safe; state session-only.

**Independent test**: `honesty-grep` (G9) returns 0 real hits (false positives documented); spot-check that every mutating control shows mock wording and reload restores defaults.

- [X] T010 [P] [US2] Honesty audit + fix **public** `travel-saas-frontend/pages/*.html` (16): prices → `أسعار إرشادية`; booking buttons → safe labels (View Deal / Request Booking / Compare Offer / Get Coupon); login/register/saved/alerts → honest mock (no "account created"/"saved on server"); visa/destination claims → `معلومات التأشيرة إرشادية…`; confirm source badges (Partner/Affiliate/Manual Deal/API Ready) present (content-honesty.contract §1–§3).
- [X] T011 [P] [US2] Honesty audit + fix **merchant** `travel-saas-frontend/dashboard/*.html` (9): create/edit deal + create coupon + settings + integrations → `إجراء تجريبي` / `لا يتم الحفظ على خادم حاليًا` / `قابل للربط لاحقًا`; no "sent/saved/connected" as real (content-honesty.contract §1–§4).
- [X] T012 [P] [US2] Honesty audit + fix **owner** `travel-saas-frontend/admin/*.html` (7): suspend/plan-change/billing/invoice/payment/publish/export/email/impersonation → safe wording (`لا يتم تنفيذ إجراء حقيقي في هذه النسخة` / `لا توجد مدفوعات فعلية` / `لا يتم تسجيل دخول كالشركة فعليًا`); session-only confirmed.
- [X] T013 [US2] Re-run `honesty-grep` (G9) → 0 real hits; quote + justify any false positive (e.g. `onConfirm` identifier, honest Arabic substring); record honesty issues-found-and-fixed in `audit-notes.md` (content-honesty.contract §5; SC-011).

**Checkpoint**: US2 done — every page is honest about being a frontend-only mock. Independently demonstrable.

---

## Phase 5: User Story 3 — Technically sound: clean build, clean console, compliant stack (Priority: P1)

**Goal**: Build succeeds; zero forbidden tech / CDN / browser dialogs / external chart libs; html-validate clean on all 32 pages; JS parses and no page-controller throws cross-page; all assets resolve; scripts `defer`.

**Independent test**: G1 build PASS, G2 stack-grep 0 real hits, G3 html-validate 0 errors, G4 all modules OK, G7 0 missing assets — all green.

- [X] T014 [US3] Run `npm run build` (G1) → fix any Tailwind/config error; confirm `assets/css/tailwind.css` regenerates and `tailwind.config.js` content globs cover all three surfaces (serialize — shared build output).
- [X] T015 [P] [US3] Stack-compliance hard gate (G2) over all `*.html`/`*.js`/`*.css` excl. `node_modules`: `react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(` + external chart/table/date libs → fix any real hit; quote + justify false positives in `audit-notes.md` (SC-004/006).
- [X] T016 [P] [US3] `npx html-validate pages/*.html dashboard/*.html admin/*.html` (G3) → fix every error (e.g. `type="button"` on non-submit buttons, `aria-label` on icon-only buttons, `scope="col"` on `<th>`, remove duplicate `id`) until 0 errors across all 32 pages (SC-005).
- [X] T017 [US3] `node --check` all 7 `travel-saas-frontend/src/js/*.js` (G4) + review each page controller is behind its `data-page`/guard so it no-ops elsewhere (prevents runtime `TypeError` → console error); run `npm run lint:css` (G5) clean (serialize — touches shared JS/CSS if a fix is needed).
- [X] T018 [US3] Asset crawl (G7): resolve every `<img src>`, `<use href="#icon-…">` vs `assets/icons/sprite.svg`, font `url()`, and per-folder `tailwind.css` ref → fix broken paths/missing sprite symbols; confirm 0 external-origin assets and every `<script>` is `defer`; record in `audit-notes.md` (FR-013; SC-003).

**Checkpoint**: US3 done — the platform builds clean, validates clean, and is stack-compliant with no missing assets. P1 set (US1–US3) complete = the demo-critical core.

---

## Phase 6: User Story 4 — Usable on mobile across every surface (Priority: P2)

**Goal**: No horizontal overflow at 320/360/390/768/1024/1280px; dense tables → stacked cards or scroll-with-affordance; grids reflow to one column; sidebars → drawers; modals/dropdowns on-screen; ≥44px targets.

**Independent test**: the responsive static sweep (overflow-risk + table→cards affordance + one-column grid fallback + drawer/scrim) is clean per surface; the delegated browser viewport script (quickstart §2) is recorded for user sign-off.

- [X] T019 [P] [US4] Responsive static sweep + fix **public** `travel-saas-frontend/pages/*.html` (16): flag fixed-pixel widths / `100vw` / non-wrapping rows; ensure dense lists have a table→cards (`data-label` + stacking `@media`) or `overflow-x:auto` affordance; KPI/card grids carry a one-column `@media` fallback; ≥44px tap targets (FR-005).
- [X] T020 [P] [US4] Responsive static sweep + fix **merchant** `travel-saas-frontend/dashboard/*.html` (9): dense deal/coupon tables → stacked labeled cards at ≤640px; `.dash-*` sidebar → drawer + scrim; modals/dropdowns stay on-screen; no overflow.
- [X] T021 [P] [US4] Responsive static sweep + fix **owner** `travel-saas-frontend/admin/*.html` (7): companies/subscriptions/comparison/insight tables → stacked cards; KPI/stat/plan/segment grids reflow to one column; `.admin-*` sidebar → drawer; content tabs + usage bars reflow.
- [X] T022 [US4] Record the delegated browser viewport checklist (320/360/390/768/1024/1280 per surface, quickstart §2) into the report's manual section; set the inventory `mobile` flags in `audit-notes.md` (research D5/D16).

**Checkpoint**: US4 done — every surface is statically overflow-safe and the live viewport check is scripted for the user.

---

## Phase 7: User Story 5 — Native Arabic RTL everywhere (Priority: P2)

**Goal**: Correct RTL on all surfaces — logical CSS properties, `dir="ltr"` on every Latin run (coupon codes/emails/URLs/invoice ids/amounts/phones), correct breadcrumb order and drawer open-side.

**Independent test**: the `dir="ltr"` structural sweep finds every Latin run marked; no RTL-breaking physical property remains; breadcrumb/drawer side correct.

- [X] T023 [P] [US5] RTL audit + fix **public** `travel-saas-frontend/pages/*.html` (16): `dir="ltr"` on coupon codes / emails / URLs / phone numbers; convert RTL-breaking physical `left/right`/`text-align:left|right` in page-scoped styles to logical (`inset-inline-*`, `text-align:start|end`); breadcrumb DOM order + mobile drawer open from RTL-correct side (FR-006; research D6).
- [X] T024 [P] [US5] RTL audit + fix **merchant** `travel-saas-frontend/dashboard/*.html` (9): `dir="ltr"` on amounts / coupon codes / ids; logical properties; table action column on the correct side.
- [X] T025 [P] [US5] RTL audit + fix **owner** `travel-saas-frontend/admin/*.html` (7): `dir="ltr"` on owner emails / invoice ids / amounts / percentages; logical properties; usage-bar + timeline direction.
- [X] T026 [US5] Re-run the structural `dir="ltr"` + physical-property sweep (G8) → 0 violations; set the inventory `RTL` flags in `audit-notes.md` (SC-008).

**Checkpoint**: US5 done — Arabic reads native across the whole platform.

---

## Phase 8: User Story 6 — One consistent design system across all surfaces (Priority: P2)

**Goal**: Buttons, cards, badges, inputs, toggles, modals, drawers, toasts, dropdowns, action menus, table rows, empty/skeleton states, spacing, typography, shadows, radii, gradients, icon sizes are consistent across public/merchant/admin via the shared tokens — no ad-hoc drift, weak spacing, or low contrast.

**Independent test**: a token spot-check across one representative page per surface shows shared components resolving to the same tokens; flagged drift normalized; `npm run build` + `lint:css` still clean.

- [X] T027 [US6] Token spot-check across one page per surface (`pages/index.html`, `dashboard/index.html`, `admin/index.html`): compare button/badge/card/input/modal/empty/skeleton variants + spacing/radii/shadow/contrast; list the ad-hoc drift to normalize in `audit-notes.md` (research D7; FR-007).
- [X] T028 [P] [US6] Normalize flagged drift in **public** `travel-saas-frontend/pages/*.html` to the existing tokens/utilities (no redesign, no new component) — fix stray hex where a token exists, off-scale paddings, low-contrast pairs.
- [X] T029 [P] [US6] Normalize flagged drift in **merchant + owner** `travel-saas-frontend/dashboard/*.html` + `admin/*.html` to the shared tokens — keep each surface's role (public premium / merchant practical / admin operator) while sharing the design language.
- [X] T030 [US6] If any fix touched `travel-saas-frontend/src/input.css` tokens, re-run `npm run build` + `npm run lint:css` + re-render all three surfaces (non-regression); record visual-consistency issues-found-and-fixed in `audit-notes.md`.

**Checkpoint**: US6 done — the three surfaces read as one premium product.

---

## Phase 9: User Story 7 — Accessible to WCAG 2.1 AA (Priority: P3)

**Goal**: Visible focus, keyboard nav (no trap), modal/drawer Esc + focus-return, form labels, `aria-invalid`/`aria-describedby`, `aria-live` on dynamic regions, icon-only-button names, contrast, ≥44px targets, meaningful `alt`, reduced-motion, table headers, button-vs-link correctness.

**Independent test**: `@axe-core/cli` reports 0 serious/critical on a representative page per surface (when serveable), OR a documented manual WCAG 2.1 AA audit is signed off; the structural a11y sweep (icon-button names, `aria-live`, `scope`) is clean.

- [X] T031 [US7] Run `@axe-core/cli` (G11) on `pages/index.html` + `dashboard/index.html` + `admin/index.html` via `npm run serve` if a driver is available; ELSE perform + document a manual WCAG 2.1 AA audit and record the axe-blocked reason in `audit-notes.md` (research D12; FR-012).
- [X] T032 [P] [US7] Fix a11y in **public** `travel-saas-frontend/pages/*.html` (16): visible focus, icon-only-button `aria-label`, `aria-live` on dynamic counts, meaningful `alt`, contrast, reduced-motion, button-vs-link correctness.
- [X] T033 [P] [US7] Fix a11y in **merchant** `travel-saas-frontend/dashboard/*.html` (9): modal focus-trap + return, table `<th scope>`, labels + `aria-invalid`/`aria-describedby` on form fields, icon-button names.
- [X] T034 [P] [US7] Fix a11y in **owner** `travel-saas-frontend/admin/*.html` (7): same set — focus return, table headers/`scope`, `aria-live` on filter counts, icon-button names.
- [X] T035 [US7] Re-run `npx html-validate` (G3) + the structural a11y sweep (G8) → clean; record a11y issues-found-and-fixed + the audit mode used (axe / manual) in `audit-notes.md`.

**Checkpoint**: US7 done — WCAG 2.1 AA concerns addressed and the audit mode documented honestly.

---

## Phase 10: User Story 8 — Sound SEO and semantics (Priority: P3)

**Goal**: Public pages have one `<h1>`, correct hierarchy, Arabic title + meta description (non-duplicated), semantic landmarks, descriptive links/alt, substantial content, valid non-misleading JSON-LD; dashboard/admin have one `<h1>` + semantic tables/lists/forms.

**Independent test**: the structural sweep finds exactly one `<h1>` + proper landmarks per page; Arabic title/meta present and non-duplicated on key public pages; JSON-LD (where present) validates and claims no live offers.

- [X] T036 [P] [US8] SEO audit + fix **public** `travel-saas-frontend/pages/*.html` (16): exactly one `<h1>` + non-skipping hierarchy; Arabic `<title>` + meta description (de-duplicate across important pages); semantic `main/section/article/nav/footer`; descriptive link text + `alt`; FAQ present where the contract expects; validate any JSON-LD is well-formed and **not** claiming live prices/offers; flag/expand any thin blog/article/destination page note (no new page) (FR-011; research D11).
- [X] T037 [P] [US8] Semantics check **merchant + owner** `travel-saas-frontend/dashboard/*.html` + `admin/*.html`: exactly one `<h1>` + sensible hierarchy + semantic tables/lists/forms (their `robots noindex` is acceptable).
- [X] T038 [US8] Re-run the structural sweep (one-`<h1>` + landmarks, G8) + JSON-LD validity → clean; record SEO/semantics issues-found-and-fixed in `audit-notes.md` (SC-012).

**Checkpoint**: US8 done — public pages are SEO-sound and no structured data is misleading.

---

## Phase 11: User Story 9 — Forms and interactions all work and stay honest (Priority: P3)

**Goal**: Every form validates inline (labels + `aria-invalid`/`aria-describedby`) with honest success and no unintended reload; every interaction primitive (drawer/dropdown/modal/toast/copy/toggle/filter/sort/reset/chips/tabs/accordion/row-menu/bulk/confirm) works with no console error, no duplicate-listener repeated toasts, correct focus/scroll handling.

**Independent test**: each form shows inline errors on invalid + honest toast on valid with no reload; the three end-to-end flows exercise every primitive with no console error / repeated toast / stuck scroll.

- [X] T039 [P] [US9] Forms audit + fix **public** `travel-saas-frontend/pages/*.html` (16): homepage search/newsletter, login, register (password-confirm + terms), forgot-password, saved/price-alert, profile — labels, inline `aria-invalid`/`aria-describedby`, email validation, honest success toast, `novalidate` + JS-prevented submit (no reload) reusing `data-frontend-form`/`TUI.validateForm` (FR-009; research D9).
- [X] T040 [P] [US9] Forms audit + fix **merchant + owner** `travel-saas-frontend/dashboard/*.html` + `admin/*.html`: create/edit deal, create coupon, settings, integration-config modals, admin company/plan/subscription/content modals — same label+inline-error+honest-success contract; destructive actions gated by a custom confirm modal (never a browser dialog).
- [X] T041 [US9] Interaction-primitive review across shared `travel-saas-frontend/src/js/{ui,main,dashboard,discovery,content,member,admin}.js` (serialize — shared files): confirm single-bound listeners (no duplicate → repeated toasts), focus returns after modal/drawer close, body-scroll locks/unlocks, reset clears state + updates the `aria-live` count, row menus open, toggles flip — fix surgically; re-run `node --check` after any edit.
- [X] T042 [US9] Record forms/interactions issues-found-and-fixed + set the inventory `interactions` flags in `audit-notes.md`; note the delegated live-console check (quickstart §2) for user sign-off.

**Checkpoint**: All 9 audit concerns complete — forms validate honestly and every interaction works.

---

## Phase 12: Polish & cross-cutting (non-regression, cleanup, deliverable)

**Purpose**: Final non-regression, file cleanup, scoped formatting, and assembly of the deliverable QA report.

- [X] T043 Non-regression: re-run `npm run build` (G1) + stack-grep (G2) + `npx html-validate pages/*.html dashboard/*.html admin/*.html` (G3) after all fixes → all green; spot-confirm Specs 001–010 still render (incl. `pages/styleguide.html` + `pages/components.html` — **not deleted**); confirm the 4 absent Spec 008 references still resolve to coming-soon (FR-016; SC-014). **FR-017 closure assertion**: confirm the pass introduced **0 new pages** (page count still 32: `pages/` ×16, `dashboard/` ×9, `admin/` ×7; the 4 Spec 008 pages still absent), **0 new dependencies** (`package.json` unchanged — `git diff --stat package.json` empty), **0 new framework/backend**, and **only one added file** (`QA-FRONTEND-CHECKLIST.md`) — record this assertion in `audit-notes.md` (FR-017).
- [X] T044 [P] File cleanup (FR-014): scan for stray backup/temp files (`*.bak`, `*~`, `* copy.html`, `.orig`) + dead commented-out demo blocks; validate every `assets/data/*.json` parses and that ids referenced across surfaces agree (a deal/coupon/destination id in admin/dashboard matches the public catalog); record in `audit-notes.md`.
- [X] T045 [P] Run `npm run format` **scoped to JS/JSON/CSS only** (inline-`<style>` HTML excluded via `.prettierignore`, research D15) + `npm run lint:css` → clean; confirm no HTML with inline `<style>` was reformatted (re-run G3 to prove it).
- [X] T046 Assemble the delegated browser-manual section: consolidate the viewport (T022), live-console (T042), and axe-or-manual (T031) results into the report's manual block with the static-vs-browser split (research D16; quickstart §2/§4).
- [X] T047 Produce **`travel-saas-frontend/QA-FRONTEND-CHECKLIST.md`** per `contracts/qa-report.contract.md` (6 sections: Summary+status · Commands/checks run · 32-page inventory table + 4 documented-absent · issues-found-and-fixed grouped by the 11 categories · remaining notes/known limitations · final confirmation checklist) sourced from `audit-notes.md`; assign the final status via the rubric — **PASS WITH NOTES** expected (all P1 static gates green; browser-only confirmations delegated; mock limitations documented); **FAIL** only on an unmet P1 (FR-001/015; SC-015). **Browser-only delegation (must be explicit)**: in §5 "remaining notes" flag **SC-003** (live console-clean), **SC-007** (pixel overflow at 320/360/390/768/1024/1280), and **SC-013** (full interactive end-to-end flows) as `▶ manual` — verifiable only by the user via `quickstart.md §2` (`npm run serve`); the executor confirmed their static proxies (T018 assets, T019–T021 overflow-risk sweep, T009 flow link paths) but cannot run a browser (research D16).

**Checkpoint**: `QA-FRONTEND-CHECKLIST.md` exists, every gate is recorded, all 9 concerns are green, and the platform is client-presentable.

---

## Dependencies & execution order

- **Setup (T001–T003)** → **Foundational (T004–T005)** → **User Stories (T006–T042)** → **Polish (T043–T047)**.
- **Priority order**: US1 (P1) → US2 (P1) → US3 (P1) → US4, US5, US6 (P2) → US7, US8, US9 (P3). The P1 trio (US1–US3) is the demo-critical core and should be completed and verified first.
- **Within each story**: the per-surface audit/fix tasks are `[P]` (distinct file sets); the story's **re-verify task is sequential** (it re-runs the gate and appends to `audit-notes.md`).
- **`src/js/*` bottleneck**: T017 (US3 guard review) and T041 (US9 primitive review) both edit shared JS — they are **sequential** with each other and with any other JS-touching fix. Keep most fixes HTML-only (reuse `main.js` `data-*` + `window.TUI`) to preserve per-surface parallelism.
- **`src/input.css` bottleneck**: T030 (US6) may touch tokens → serialize + rebuild.
- **Config**: T002/T003 (Setup) are the only edits to `.prettierignore`/`.htmlvalidate.json`; T014 is the only edit to `tailwind.config.js` (if a glob gap is found).
- **Deliverable**: T047 depends on every story's re-verify task + T043–T046.

## Parallel execution examples

- **Setup fix-safety** — run together: T002, T003 `[P]`.
- **US1 navigation (distinct surfaces)** — run together: T006, T007, T008 `[P]`; then T009.
- **US2 honesty** — T010, T011, T012 `[P]`; then T013.
- **US3 gates** — T015, T016 `[P]` (read-only greps/validation on distinct concerns); T014 then T017 then T018 sequence on shared build/JS/asset state.
- **US4 / US5 / US7 / US8 / US9 per-surface fixes** — the three surface tasks in each story are `[P]` with each other; the re-verify task closes the phase.
- **Polish** — T044, T045 `[P]`; then T046; then T047.

## Implementation strategy

- **MVP = the P1 trio (US1 → US2 → US3)**: no dead ends + honest copy + clean build/console/stack. This is the "client-presentable" core — complete and re-verify it first, then stop and validate against the three end-to-end flows.
- **Increment 2 = P2 (US4 → US5 → US6)**: mobile-usable + native RTL + one design system — the "premium feel" layer.
- **Increment 3 = P3 (US7 → US8 → US9)**: WCAG 2.1 AA + SEO/semantics + forms/interactions — the consolidating regression layer.
- **Always**: after any shared-file edit, re-run G1–G3 (non-regression); never `prettier --write` inline-`<style>` HTML; surgical edits only; keep state session-only.
- **Finish**: assemble `QA-FRONTEND-CHECKLIST.md` and assign the honest final status (PASS WITH NOTES expected for a browserless executor).

## Notes

- `[P]` = different files, no dependency — the three surfaces (`pages/` ×16, `dashboard/` ×9, `admin/` ×7) are distinct file sets, so per-surface audit/fix tasks parallelize.
- `[Story]` maps each task to its audit concern (US1–US9) for traceability into the report's issue categories.
- Each user story is independently testable: its gate (link-crawl / honesty-grep / build+stack+html-validate / responsive sweep / dir=ltr sweep / token spot-check / axe-or-manual / structural SEO / forms+interactions) goes green platform-wide.
- `audit-notes.md` is the **working** log (in the spec dir); `QA-FRONTEND-CHECKLIST.md` is the **deliverable** (at the project root) — do not confuse them.
- No browser is available to the executor → live console/pixel-responsive/visual confirmations are delegated to the user via `quickstart.md §2` and reported under "remaining notes" (research D16).
- Avoid: page rewrites, section removal, new framework/page/backend, shared-file conflicts, and reformatting inline-`<style>` HTML with Prettier.
