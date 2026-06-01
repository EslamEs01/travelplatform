---
description: "Task list for Public Homepage (Travel SaaS Platform)"
---

# Tasks: Public Homepage (Travel SaaS Platform)

**Input**: Design documents from `specs/002-public-homepage/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Automated test-code is NOT requested for this static page (consistent with Spec 001). Verification
is done via the per-page QA checklist (`quickstart.md`) plus automated accessibility/SEO audits (axe-core /
Lighthouse), HTML validation, and the stack-compliance grep gate. These appear as explicit verification tasks.

**Organization**: Tasks are grouped by user story (US1/US2/US3 from spec.md). This feature is **composition +
content** on the completed Spec 001 foundation; the foundation is reused, not rebuilt.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 / US2 / US3 (Setup, Foundational, and Polish tasks have no story label)
- All paths are relative to the repository root; the frontend lives under `travel-saas-frontend/`

## Path Conventions

Static frontend project rooted at `travel-saas-frontend/` (see plan.md → Project Structure). The single page
deliverable is `travel-saas-frontend/pages/index.html`. No backend.

> **⚠️ Shared-file constraint (read first)**: US1, US2, and US3 all edit the **same file**
> `travel-saas-frontend/pages/index.html`. Therefore page-edit tasks across the three stories are **NOT
> file-independent** and MUST be serialized in priority order (US1 → US2 → US3). Only the separate mock-data
> JSON files (`featured.json`, `destinations.json`, `coupons.json`), new imagery, and `src/js/main.js` are
> `[P]`-eligible against the page edits. Each story remains independently *testable* once its sections exist.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing foundation builds and serves; establish a non-regression baseline.

- [x] T001 Verify the Spec 001 foundation: from `travel-saas-frontend/`, run `npm run build` (regenerates `assets/css/tailwind.css`) and `npm run serve`, and confirm `pages/index.html`, `pages/styleguide.html`, and `pages/components.html` all render with no console errors (baseline for non-regression SC-014)

**Checkpoint**: Foundation confirmed working; the homepage can be composed on top of it.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Land the one additive, opt-in interaction enhancement that the US1 search form and US3
newsletter form both depend on.

**⚠️ CRITICAL**: The frontend-only form handler (T002) blocks US1's search and US3's newsletter.

- [x] T002 Implement an additive, opt-in frontend-only form handler in `travel-saas-frontend/src/js/main.js`: for a `<form data-validate data-frontend-form>` that passes validation, call `preventDefault()`, show a success toast (message from `data-success-toast` or a sensible default), reveal an inline confirmation element `[data-frontend-success]` within the form if present, and reset the form — while leaving existing `data-validate` forms (without `data-frontend-form`) behaving exactly as before (non-breaking, per plan Complexity Tracking)
- [x] T003 Verify non-regression of the shared interaction layer: confirm the `components.html` validated form and all existing `data-*` wiring (`data-coming-soon`, `data-drawer-*`, `data-modal-*`, `data-copy`, `data-toast`, `data-year`) still behave as before after the T002 change (depends on T002)

**Checkpoint**: `window.TUI` substrate + the new opt-in form completion exist — user stories can begin.

---

## Phase 3: User Story 1 - Understand the value & start a comparison (Priority: P1) 🎯 MVP

**Goal**: A premium Arabic-RTL hero communicating the core value proposition with a prominent, validated
search/comparison entry that completes frontend-only (no navigation, no dead controls).

**Independent Test**: Open `pages/index.html` at 360px and desktop. Confirm one clear `<h1>` value prop, a
visible search entry; empty submit → inline validation (blocked); valid submit → success toast + inline echo
of the destination, no navigation, no horizontal scroll, no `alert()`.

- [x] T004 [US1] Upgrade the hero section in `travel-saas-frontend/pages/index.html` per contracts/homepage-content.contract.md §C1: single `<h1>` value proposition (compare best travel deals in one place), supporting subtext, and credibility cues — reusing existing hero styles/tokens (no new visual identity)
- [x] T005 [US1] Add the search/comparison form inside the hero in `travel-saas-frontend/pages/index.html` using the shared `.field` patterns: destination (`required`, `minlength=2`, linked `.field-error`), travel dates, and travelers `.field-select`; mark the form `data-validate data-frontend-form data-success-toast="…"` and include a hidden `[data-frontend-success]` inline `.inline-msg-success` echo element (per §C1) (depends on T004)
- [x] T006 [US1] Verify the search interaction in `travel-saas-frontend/pages/index.html`: empty/invalid submit shows inline error and blocks; valid submit shows the success toast and reveals the inline echo referencing the entered destination, with no navigation and no browser dialog (depends on T002, T005)
- [x] T007 [US1] QA gate for US1 (per quickstart checklist): single `<h1>`, 360px no-horizontal-scroll, touch targets ≥ 44px, keyboard-operable search with visible focus, zero dead controls / bare `#` / `alert()`; run the stack-compliance grep (depends on T006)

**Checkpoint**: MVP — the hero + working search/comparison entry is demonstrable and independently testable.

---

## Phase 4: User Story 2 - Explore deals, destinations & coupons (Priority: P2)

**Goal**: Three believable, card-based explore sections — featured deals (source badges, safe labels, ≥1
quick-view modal), popular destinations, and coupons with copyable codes — all reusing the foundation card/
badge patterns and `TUI.copyToClipboard`.

**Independent Test**: From the homepage, view the deals/destinations/coupons sections. Confirm cards render
with correct source badges and safe CTA labels, "starting from" pricing (never live), a deal opens a
quick-view modal (focus-managed, `Esc`/overlay/close), and each coupon code copies with a success toast.

- [x] T008 [P] [US2] Extend `travel-saas-frontend/assets/data/featured.json` to ≥6 consistent mock deals per contracts/mock-data.contract.md §F1 (source badges, "ابتداءً من" pricing, ratings, safe CTA labels)
- [x] T009 [P] [US2] Create `travel-saas-frontend/assets/data/destinations.json` with ≥4 mock destinations per contracts/mock-data.contract.md §F2
- [x] T010 [P] [US2] Create `travel-saas-frontend/assets/data/coupons.json` with ≥3 mock coupons per contracts/mock-data.contract.md §F3 (Latin/numeric `code`, source badge, illustrative expiry/terms)
- [x] T011 [P] [US2] Add any additional lightweight SVG imagery placeholders required for destinations/coupons to `travel-saas-frontend/assets/images/` (only if existing placeholders are insufficient; meaningful `alt` planned at render)
- [x] T012 [US2] Upgrade the featured-deals section in `travel-saas-frontend/pages/index.html` per §C2: ≥6 `.card`s mirroring `featured.json` with `.card-badge-wrap` source badges, `<h3>` titles, `.card-meta` (location · rating), `.price` "ابتداءً من", lazy images with real `alt`, and safe-labeled CTAs (depends on T008)
- [x] T013 [US2] Add the deal quick-view `.modal` markup (`data-modal="deal-quickview"`, `role="dialog" aria-modal="true"`, labelled, overlay/close `data-modal-close`) near the end of `<body>` in `travel-saas-frontend/pages/index.html` and wire ≥1 deal CTA with `data-modal-open="deal-quickview"` (per §C2) (depends on T012)
- [x] T014 [US2] Add the popular-destinations section in `travel-saas-frontend/pages/index.html` per §C3: ≥4 destination `.card`s (image+alt, name+country, indicative "ابتداءً من" price or deals count) with a visible action on select (depends on T009)
- [x] T015 [US2] Add the coupons/offers section in `travel-saas-frontend/pages/index.html` per §C4: ≥3 coupon `.card`s with source badge, discount label, code rendered `dir="ltr"`, illustrative expiry/terms, a copy control `data-copy="<CODE>"`, and a safe "Get Coupon" CTA (depends on T010)
- [x] T016 [US2] Verify explore interactions in `travel-saas-frontend/pages/index.html`: coupon copy → success toast (zero browser dialogs), deal quick-view modal opens/closes via overlay/close/`Esc` with focus managed and restored, and coming-soon CTAs → info toast; confirm no dead controls (depends on T013, T014, T015)
- [x] T017 [US2] QA gate for US2: content is believable mock that never claims live prices, source badges (Partner/Affiliate/Manual Deal/API-Ready) correct, safe CTA labels used, copy works with zero dialogs, modal is keyboard/focus-managed, heading hierarchy `h2`→`h3` correct (depends on T016)

**Checkpoint**: The platform's explore substance is demonstrable; US2 is independently testable.

---

## Phase 5: User Story 3 - Build trust & capture intent (Priority: P3)

**Goal**: Social proof (testimonials + trusted partners), a travel-guides teaser, an enhanced FAQ with
`FAQPage` structured data, and a frontend-only price-alert/newsletter capture.

**Independent Test**: From the homepage, confirm testimonials/partners render as believable mock content with
ratings; guides/FAQ present substantial semantic content (FAQ ≥ 3 questions with matching `FAQPage` JSON-LD);
submitting the newsletter empty shows inline validation and a valid email yields a visible success
confirmation that persists nothing.

- [x] T018 [US3] Add the social-proof section in `travel-saas-frontend/pages/index.html` per §C6: ≥3 testimonial cards (author label, ⭐ rating, quote, initial avatar — no external image) and ≥3 trusted-partner items (visible text label; decorative mark `aria-hidden`), clearly mock
- [x] T019 [US3] Add the travel-guides teaser section in `travel-saas-frontend/pages/index.html` per §C7: ≥3 guide `.card`s (`<h3>` title, excerpt, category, image) with "اقرأ المزيد" → `data-coming-soon`; substantial, semantic, SEO-friendly content (depends on T018)
- [x] T020 [US3] Add the price-alert/newsletter section in `travel-saas-frontend/pages/index.html` per §C8: email `.field-input` (`type=email`, `required`, `dir="ltr"`, linked `.field-error`) in a `<form data-validate data-frontend-form data-success-toast="…">` with a hidden `[data-frontend-success]` inline confirmation (depends on T002, T019)
- [x] T021 [US3] Enhance the FAQ in `travel-saas-frontend/pages/index.html` (retain ≥3 substantial traveler questions using `<details>`/`<summary>`) and add a `FAQPage` JSON-LD block in `<head>` whose Q&A exactly mirrors the visible FAQ, per §C9 and data-model §5 (depends on T020)
- [x] T022 [US3] Polish the retained why-us/how-it-works + trust band (§C5) and the final CTA band (§C9) in `travel-saas-frontend/pages/index.html` for consistency with the new sections (safe-labeled CTAs, anchors or `data-coming-soon`; no dead links) (depends on T021)
- [x] T023 [US3] Verify intent-capture & guide interactions in `travel-saas-frontend/pages/index.html`: newsletter invalid/empty → inline error blocked; valid → success toast + inline confirmation persisting nothing and never implying server-side storage; repeated submits produce consistent, non-duplicated feedback (no stacked broken states); guide "read more" → coming-soon toast (depends on T020, T022)
- [x] T024 [US3] QA gate for US3: testimonials/partners clearly mock, newsletter frontend-only, `FAQPage` JSON-LD valid and mirrors the visible FAQ, keyboard operability + visible focus + reduced-motion respected (depends on T023)

**Checkpoint**: Trust + intent-capture complete; the full real homepage is demonstrable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Repository-wide gates and final quality + non-regression verification.

- [x] T025 [P] Run the stack-compliance gate: `grep` for `react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(` across `*.html,*.js,*.css` in `travel-saas-frontend/` (excluding `node_modules`) — must return zero matches (Principle II / SC-010)
- [x] T026 [P] Run Prettier + Stylelint (Stylelint only if `src/input.css` was touched) and `npx html-validate travel-saas-frontend/pages/index.html` — fix any issues to reach 0 errors (SC-011 structure)
- [x] T027 [P] Performance verification: rebuild minified CSS, confirm font preload + `font-display: swap`, lazy non-hero images, and zero external CDN requests for CSS/JS/fonts/images; confirm homepage interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU (SC-009, SC-013)
- [x] T028 [P] Accessibility audit: `npm run audit:a11y` → 0 WCAG 2.1 AA violations; keyboard-only reaches and operates 100% of interactive elements (search, deal quick-view modal, coupon copy, drawer, newsletter); visible focus; focus management; reduced-motion (SC-012)
- [x] T029 Non-regression + design-system fidelity check: confirm `pages/styleguide.html` and `pages/components.html` still render unchanged, the homepage header/footer match the canonical `travel-saas-frontend/partials/` source (SC-014), and **≥95% of the homepage's styling is expressed through existing tokens/utilities with no new ad-hoc page-specific styles and no new visual identity introduced** (SC-008)
- [x] T030 RTL↔LTR mirror check: flip `dir="ltr" lang="en"` in dev and confirm the homepage layout mirrors with no overlap/clipping/breakage (SC-007)
- [x] T031 Final QA pass against the quickstart per-page checklist for `pages/index.html`; record results in `specs/002-public-homepage/qa-results.md`

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: no dependencies — start immediately.
- **Foundational (Phase 2)**: depends on Setup; T002 (`main.js` handler) **blocks US1 search and US3 newsletter**.
- **User Story 1 (Phase 3)**: depends on Foundational. Self-contained MVP.
- **User Story 2 (Phase 4)**: depends on Foundational; its data tasks (T008–T011) are file-independent of US1.
- **User Story 3 (Phase 5)**: depends on Foundational (T002 for the newsletter).
- **Polish (Phase 6)**: depends on all desired user stories being complete.

### ⚠️ Shared-file serialization (critical)

- US1, US2, and US3 **all edit `pages/index.html`**. Their page-edit tasks are therefore **serialized** in
  priority order: complete US1's page edits (T004→T006) before US2's (T012→T016) before US3's (T018→T023).
  The stories stay independently *testable* once their sections exist, but they are **not** file-independent.
- Only these are `[P]`-eligible because they touch different files: T008 (`featured.json`), T009
  (`destinations.json`), T010 (`coupons.json`), T011 (`assets/images/`), and the Phase 6 gates T025–T028.

### Within each story

- US1: hero (T004) → search form (T005) → verify (T006) → QA (T007).
- US2: data files (T008–T011, parallel) → deals (T012) → quick-view modal (T013) → destinations (T014) →
  coupons (T015) → verify (T016) → QA (T017).
- US3: social proof (T018) → guides (T019) → newsletter (T020) → FAQ + `FAQPage` (T021) → retained sections
  polish (T022) → verify (T023) → QA (T024).

---

## Parallel Opportunities

```text
# Phase 4 (US2): mock-data files are different files — build in parallel BEFORE the page edits
T008 (featured.json)  |  T009 (destinations.json)  |  T010 (coupons.json)  |  T011 (images)
# then the index.html sections T012 → T013 → T014 → T015 (sequential — same file)

# Phase 6: independent gates in parallel
T025 (stack grep)  |  T026 (format/lint/html-validate)  |  T027 (performance)  |  T028 (a11y)
```

---

## Implementation Strategy

### MVP first (recommended)

1. Complete **Phase 1: Setup** (verify foundation builds).
2. Complete **Phase 2: Foundational** (additive `main.js` form handler).
3. Complete **Phase 3: User Story 1** — hero + working search/comparison entry.
4. **STOP and VALIDATE**: run T007. This is a demonstrable MVP of the real homepage.

### Incremental delivery

1. Setup + Foundational → ready.
2. Add **US1** → premium hero + search (MVP). Validate → demo.
3. Add **US2** → deals + destinations + coupons. Validate → demo.
4. Add **US3** → trust + intent capture + FAQ/structured data. Validate → demo.
5. **Polish (Phase 6)** → repository-wide gates, non-regression, RTL↔LTR, final QA.

### Note on team strategy

Because all three stories edit `pages/index.html`, parallel staffing across stories is **not** recommended
for the page edits (merge conflicts on one file). One developer should build the page sections in priority
order; the mock-data JSON files (T008–T011) can be prepared in parallel by a second contributor.

---

## Notes

- **No automated test-code tasks** (none requested). Verification = quickstart QA checklist + axe-core/
  Lighthouse (WCAG 2.1 AA) + `html-validate` + the stack-compliance grep gate.
- **Foundation is reused, not rebuilt** — the only shared-file code change is the additive, opt-in `main.js`
  handler (T002); `ui.js`, `tailwind.config.js`, `partials/`, and the existing component CSS are reused as-is.
- Every interactive element must produce a visible action (Principle VI); browser dialogs are forbidden.
- All content is Arabic RTL with English-ready structure; the existing language toggle stays inert this phase.
- Keep `partials/` as the single source of truth for the shell; do not let the homepage's header/footer drift.
- Commit after each task or logical group.
