---
description: "Task list for Frontend Foundation & Design System (Travel SaaS Platform)"
---

# Tasks: Frontend Foundation & Design System (Travel SaaS Platform)

**Input**: Design documents from `specs/001-frontend-foundation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Automated test-code is NOT requested for this static foundation (no TDD requested in the spec).
Verification is done via the per-page QA checklist (`quickstart.md`) plus automated accessibility/SEO
audits (axe-core / Lighthouse) and a stack-compliance grep gate. These appear as explicit verification
tasks, not as unit-test tasks.

**Organization**: Tasks are grouped by user story. The reusable *system* (tokens, base layer, interaction
substrate) is blocking infrastructure and lives in Setup/Foundational; the user stories are the
independently-testable consumer slices.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 / US2 / US3 (Setup, Foundational, and Polish tasks have no story label)
- All paths are relative to the repository root; the frontend lives under `travel-saas-frontend/`

## Path Conventions

Static frontend project rooted at `travel-saas-frontend/` (see plan.md → Project Structure). No backend.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the project and the local Tailwind build pipeline (no design decisions yet).

- [X] T001 Create the project directory tree `travel-saas-frontend/` with subfolders `src/js/`, `assets/css/`, `assets/fonts/`, `assets/images/`, `assets/icons/`, `assets/data/`, `partials/`, `pages/`
- [X] T002 Create `travel-saas-frontend/package.json` with scripts (`build`, `watch`, `serve`, `format`, `lint:css`, `audit:a11y`) per quickstart.md
- [X] T003 Install dependencies in `travel-saas-frontend/`: `tailwindcss@^3.4`, `postcss`, `autoprefixer`, `@tailwindcss/forms` (dev: `serve`, `prettier`, `stylelint`, `html-validate`, `@axe-core/cli`) (depends on T002)
- [X] T004 [P] Create `travel-saas-frontend/postcss.config.js` wiring `tailwindcss` + `autoprefixer`
- [X] T005 [P] Create `travel-saas-frontend/tailwind.config.js` with `content` globs (`./pages/**/*.html`, `./partials/**/*.html`, `./src/js/**/*.js`) and the `@tailwindcss/forms` plugin (theme filled in Phase 2)
- [X] T006 [P] Create `travel-saas-frontend/src/input.css` with `@tailwind base; @tailwind components; @tailwind utilities;` and empty `@layer base {}` / `@layer components {}` blocks
- [X] T007 [P] Add tooling configs in `travel-saas-frontend/`: `.editorconfig`, `.prettierrc`, `.stylelintrc.json`, and `.gitignore` (ignore `node_modules/` and the build output `assets/css/tailwind.css`)
- [X] T008 [P] Add self-hosted Cairo `woff2` files (weights 400/500/600/700) to `travel-saas-frontend/assets/fonts/` and a `favicon.svg` to `travel-saas-frontend/assets/icons/` (Cairo is OFL-licensed; subset to Arabic + Latin glyphs only to minimize payload per SC-011)
- [X] T009 Smoke-test the pipeline: `npm run build` generates `travel-saas-frontend/assets/css/tailwind.css` and `npm run serve` serves `pages/` over `http://` (depends on T003, T004, T005, T006)

**Checkpoint**: Project scaffolded; CSS build pipeline works.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable design system + interaction substrate that EVERY user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T010 [P] Encode design tokens in `travel-saas-frontend/tailwind.config.js` `theme.extend` (colors `lagoon`/`sunset`/`ink` + semantic, `fontFamily` Cairo, `fontSize` scale, `borderRadius`, `boxShadow` soft/card/pop, `zIndex`, screens) per data-model.md §1 (depends on T005)
- [X] T011 Implement the base layer in `travel-saas-frontend/src/input.css` `@layer base`: `@font-face` Cairo, `html{lang/dir rtl}` defaults, body background/text, relaxed Arabic line-height, heading scale, `:focus-visible` ring, `.skip-link`, gradient + motion CSS custom properties, `prefers-reduced-motion` base, per data-model.md §1.6 (depends on T006, T010, T008)
- [X] T012 [P] Build the SVG icon sprite (`menu`, `close`, `search`, `chevron-down`, `star`, `shield-check`, `phone`, `location`, social icons) in `travel-saas-frontend/assets/icons/sprite.svg`
- [X] T013 [P] Implement the interaction substrate in `travel-saas-frontend/src/js/ui.js`: `window.TUI` namespace, `#toast-root` bootstrap, functional `TUI.toast(...)` (aria-live), and a `prefers-reduced-motion` helper; define stub method shells for `modal`/`drawer`/`validateForm`/`copyToClipboard`, per contracts/ui-utilities.contract.md
- [X] T014 Implement `travel-saas-frontend/src/js/main.js`: on `DOMContentLoaded`, bind declarative wiring (`data-toast`, `data-coming-soon`, `data-drawer-open/close`, `data-modal-open/close`, `data-copy`, `data-validate`) by delegating to `window.TUI` methods, failing silently for not-yet-implemented methods (depends on T013)

**Checkpoint**: Tokens, base styling, and the `window.TUI` substrate exist — user stories can now begin.

---

## Phase 3: User Story 1 - Premium, trustworthy public homepage shell (Priority: P1) 🎯 MVP

**Goal**: Deliver a complete, standalone, Arabic-RTL, mobile-first homepage with the shared shell (top bar
+ slide-in drawer, footer), trust signals, and believable mock content — every control functional.

**Independent Test**: Serve `pages/index.html`, open at 360px and desktop; confirm RTL, no horizontal
scroll, working drawer nav, visible trust signals, and zero dead controls / `alert()` / bare `#` links.

- [X] T015 [P] [US1] Implement the homepage-used component classes in `travel-saas-frontend/src/input.css` `@layer components`: `.btn` (+variants/sizes/icon/loading), `.card` (+media/body/title/meta/price), `.badge` (+status/source/verified/featured) per contracts/component-patterns.contract.md (depends on T011)
- [X] T016 [P] [US1] Implement `TUI.drawer.open/close/toggle` in `travel-saas-frontend/src/js/ui.js`: overlay + scrim, focus move-in, `Esc`/overlay/close dismissal, RTL start side, reduced-motion, per contracts/ui-utilities.contract.md (depends on T013)
- [X] T017 [P] [US1] Create `travel-saas-frontend/partials/head.html` implementing the `<head>` meta contract (charset, viewport, title, description, theme-color, Open Graph, icon, font preload, stylesheet link) **plus `Organization` + `WebSite` JSON-LD structured data** per contracts/page-shell.contract.md and FR-026 (depends on T011)
- [X] T018 [US1] Create `travel-saas-frontend/partials/header.html`: branded top bar (brand, primary nav from data-model §3, inert language-toggle affordance, primary CTA) + `.drawer.drawer-start` mobile nav markup wired with `data-drawer-*` (depends on T015, T016)
- [X] T019 [US1] Create `travel-saas-frontend/partials/footer.html`: trust row + footer nav groups + support/social per data-model §3 (depends on T015)
- [X] T020 [P] [US1] Create `travel-saas-frontend/assets/data/featured.json` with realistic mock featured items (deals/destinations) per data-model §4 (source badges, "ابتداءً من" pricing, ratings)
- [X] T021 [US1] Build `travel-saas-frontend/pages/index.html` as a standalone page per page-shell contract (skip-link, inlined header, `<main id="main">`, footer, `#toast-root`, `defer` scripts): hero (single `<h1>` + brand gradient + CTA), featured section (cards + source badges from `featured.json`), trust band, how-it-works, **help/FAQ section (≥3 traveler questions, FR-026)**, CTA band — Arabic RTL, mobile-first (depends on T017, T018, T019, T020)
- [X] T022 [US1] Wire homepage interactions in `travel-saas-frontend/pages/index.html`: mobile drawer toggle, `data-coming-soon` nav links → toast, inert language-toggle present; confirm no dead controls, no bare `#`, no `alert()` (depends on T021)
- [X] T023 [US1] QA gate for the homepage (per quickstart checklist): run the stack-compliance grep, `npm run audit:a11y` (0 WCAG 2.1 AA violations), 360px no-horizontal-scroll, **touch targets ≥ 44px (SC-004)**, RTL↔LTR mirror check, single-`<h1>`/heading order, valid JSON-LD, zero external CDN requests (depends on T022)

**Checkpoint**: MVP complete — the homepage is fully functional and independently demonstrable.

---

## Phase 4: User Story 2 - Consistent design system & project structure (Priority: P2)

**Goal**: Prove the design system is consistent and reusable so any future page can be built from shared
tokens with no ad-hoc styling.

**Independent Test**: Build the CSS, view the foundations reference, and confirm a sample renders entirely
from tokens, with zero external CDN requests and correct RTL↔LTR mirroring.

- [X] T024 [US2] Build `travel-saas-frontend/pages/styleguide.html` (foundations reference): a standalone RTL page rendering token swatches — color scales + AA pairings, type scale, spacing, radii, shadows, gradients — using only system tokens/utilities (depends on T011)
- [X] T025 [US2] Verify design-system consistency & reusability across `pages/index.html` and `pages/styleguide.html`: confirm ≥95% styling via tokens/utilities (no ad-hoc styles), zero external CDN CSS/JS requests, and that flipping `dir="ltr" lang="en"` mirrors layout with no breakage (records SC-003/SC-005/SC-006) (depends on T024, T021)
- [X] T026 [P] [US2] Document the design system + project structure in `travel-saas-frontend/README.md` (token reference, folder map, build/run/serve commands, links to the contracts) (depends on T010, T011)

**Checkpoint**: Design system is verified consistent, documented, and reusable.

---

## Phase 5: User Story 3 - Reusable UI pattern & interaction library (Priority: P3)

**Goal**: Complete the reusable pattern library (the pieces not used by the homepage) and the interaction
utilities, demonstrated in one place so future pages can drop them in.

**Independent Test**: From the components showcase, trigger every pattern — open/close a modal and drawer,
show a toast, copy a value with confirmation, and submit an empty required form to see inline validation —
all without any browser `alert()`/`confirm()`/`prompt()`.

- [X] T027 [P] [US3] Implement the remaining component classes in `travel-saas-frontend/src/input.css` `@layer components`: `.modal` (+overlay/panel/title/close), `.field` (label/input/textarea/select + valid/invalid/error/success/disabled states), `.skeleton`, `.empty-state`, `.inline-msg`, per contracts/component-patterns.contract.md (depends on T011)
- [X] T028 [P] [US3] Implement `TUI.modal` (APG dialog: focus trap, `Esc`, restore focus), `TUI.validateForm` (HTML constraints + inline states + `aria-invalid`/`aria-describedby`), and `TUI.copyToClipboard` (+ success/error toast) in `travel-saas-frontend/src/js/ui.js`, per contracts/ui-utilities.contract.md (depends on T013)
- [X] T029 [US3] Build `travel-saas-frontend/pages/components.html` showcase: a standalone RTL page demonstrating every pattern (buttons, cards, badges incl. source badges, modal, drawer, toast, validated form, skeleton, empty state, inline message) with live triggers via `data-*` wiring (depends on T015, T016, T027, T028)
- [X] T030 [US3] Verify the pattern library from the showcase: trigger modal/drawer/toast/copy/validation; confirm keyboard operability + focus management + reduced-motion + zero `alert()`/`confirm()`/`prompt()` + WCAG 2.1 AA (records SC-008/SC-012) (depends on T029)

**Checkpoint**: All reusable patterns and interactions are implemented and demonstrable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Repository-wide gates and final quality verification across all pages.

- [X] T031 [P] Run the repository-wide stack-compliance gate: `grep` for `react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(` across `*.html,*.js,*.css` (excluding `node_modules`) — must return zero matches (Principle II / SC-007)
- [X] T032 [P] Run Prettier + Stylelint across `travel-saas-frontend/` and fix formatting issues (supports reusable, consistent styling — FR-007)
- [X] T033 [P] Optimize & verify performance: minified CSS build, font preload + `font-display: swap`, lazy images; confirm the homepage is interactive < 2s under the defined profile — Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT) + 4× CPU throttle (SC-011) — and makes zero external CDN requests (SC-006)
- [X] T034 [P] Validate HTML with `html-validate` for `pages/index.html`, `pages/styleguide.html`, `pages/components.html` and fix issues
- [X] T035 Cross-page consistency check: confirm the header/footer in every page match the canonical `travel-saas-frontend/partials/` source and tokens are reused (≥95%); reconcile any drift back into `partials/`
- [X] T036 Final QA pass against the quickstart per-page checklist for all pages; record results in `specs/001-frontend-foundation/qa-results.md`

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: no dependencies — start immediately.
- **Foundational (Phase 2)**: depends on Setup — **blocks all user stories**.
- **User Story 1 (Phase 3)**: depends on Foundational only. Self-contained MVP (builds the components it
  needs); does **not** depend on US2 or US3.
- **User Story 2 (Phase 4)**: depends on Foundational; its verification (T025) also samples the homepage
  (T021) for the reusability check.
- **User Story 3 (Phase 5)**: depends on Foundational; reuses US1's button/card classes in its showcase
  (T029 references T015) but adds its own components/utilities.
- **Polish (Phase 6)**: depends on all desired user stories being complete.

### User story independence

- **US1 (P1)** is independently testable and is the recommended MVP.
- **US2 (P2)** is independently testable (foundations reference + verification) once Foundational is done.
- **US3 (P3)** is independently testable via the components showcase once Foundational is done, **but its
  showcase (T029) reuses US1's `.btn`/`.card`/`.badge` classes (T015)** — so US3 is *test-independent* yet
  has a *build dependency* on T015. Build T015 before T029 (or temporarily stub those classes in US3).
- **⚠️ Shared edit points**: US1 and US3 both edit `src/input.css` (T015 ↔ T027) and `src/js/ui.js`
  (T016 ↔ T028). These specific tasks MUST be serialized across the two stories to avoid merge collisions —
  the stories are *not* fully file-independent on those two files.

### Within each story

- US1: components/drawer/partials (T015–T020) → homepage assembly (T021) → interaction wiring (T022) → QA (T023).
- US2: foundations page (T024) → verification (T025); README (T026) in parallel.
- US3: components + utilities (T027, T028) → showcase (T029) → verification (T030).

---

## Parallel Opportunities

```text
# Phase 1 (after T001, T002→T003): config & asset scaffolding in parallel
T004 (postcss.config.js)  |  T005 (tailwind.config.js)  |  T006 (src/input.css)
T007 (tooling configs)    |  T008 (fonts + favicon)

# Phase 2: different files in parallel
T010 (tailwind.config tokens)  |  T012 (icon sprite)  |  T013 (ui.js substrate)
# then T011 (input.css base, needs T010) → T014 (main.js, needs T013)

# Phase 3 (US1): different files in parallel after Foundational
T015 (input.css components)  |  T016 (ui.js drawer)  |  T017 (partials/head.html)  |  T020 (featured.json)

# Phase 5 (US3): different files in parallel
T027 (input.css components)  |  T028 (ui.js modal/validate/copy)

# Phase 6: independent gates in parallel
T031 (stack grep)  |  T032 (format/lint)  |  T033 (performance)  |  T034 (HTML validate)
```

---

## Implementation Strategy

### MVP first (recommended)

1. Complete **Phase 1: Setup**.
2. Complete **Phase 2: Foundational** (tokens + base + `window.TUI` substrate).
3. Complete **Phase 3: User Story 1** — the standalone homepage.
4. **STOP and VALIDATE**: run T023 (homepage QA gate). This is a demonstrable MVP.

### Incremental delivery

1. Setup + Foundational → reusable system ready.
2. Add **US1** → standalone premium homepage (MVP). Validate → demo.
3. Add **US2** → design-system reference + consistency proof. Validate → demo.
4. Add **US3** → full pattern/interaction library + showcase. Validate → demo.
5. **Polish (Phase 6)** → repository-wide gates and final QA.

### Parallel team strategy

After Foundational completes, US1 / US2 / US3 can be staffed in parallel (US1 builds its own components;
US2 and US3 add verification and the remaining library), then converge in Polish. **Caveat**: coordinate
the shared files `src/input.css` (T015/T027) and `src/js/ui.js` (T016/T028) — serialize those edits, and
land US1's T015 before US3's T029, since the two stories are not file-independent there.

---

## Notes

- **No automated test-code tasks** (none requested). Verification = quickstart QA checklist + axe-core/
  Lighthouse (WCAG 2.1 AA) + the stack-compliance grep gate.
- `[P]` tasks touch different files with satisfied dependencies; tasks editing the same file
  (`src/input.css`, `src/js/ui.js`) are sequenced, not parallel. Note this holds **across stories too**:
  T015↔T027 (`src/input.css`) and T016↔T028 (`src/js/ui.js`) must not run concurrently.
- Every interactive element must produce a visible action (Principle VI); browser dialogs are forbidden.
- All content is Arabic RTL with English-ready structure; the language toggle is present but inert this
  phase (per spec Clarifications).
- Commit after each task or logical group; keep `partials/` as the single source of truth for the shell.
