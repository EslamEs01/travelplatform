---
description: "Task list for 003-public-discovery-pages"
---

# Tasks: Public Discovery & Monetization Pages (Travel SaaS Platform)

**Input**: Design documents from `specs/003-public-discovery-pages/`
**Prerequisites**: plan.md ✅, spec.md ✅ (5 user stories), research.md ✅ (D1–D10), data-model.md ✅, contracts/ ✅

**Tests**: No automated test suite is requested (per the constitution, QA is the manual per-page "done"
checklist + an automated accessibility/SEO audit). Verification tasks live in the Polish phase. No unit/contract
test tasks are generated.

**Organization**: Tasks are grouped by user story (US1–US5) so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 (Setup/Foundational/Polish have no story label)
- All paths are under `travel-saas-frontend/` unless noted.

## Conventions for this feature

- Pages are **standalone static HTML** that inline the canonical shell; core content is static HTML (renders
  without JS). The shared module `src/js/discovery.js` only *enhances* (filter/sort/URL/`?id=` swap/compare echo).
- `src/js/main.js` and `src/js/ui.js` MUST remain **unchanged** (research D4). Cross-page state = URL query params.
- Source badges: Partner/Affiliate/Manual Deal/API Ready; safe CTA labels only; "ابتداءً من" pricing; never live.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a clean baseline before building on it.

- [x] T001 Verify baseline: run `npm run build` in `travel-saas-frontend/` (regenerates `assets/css/tailwind.css`) and confirm `pages/index.html`, `pages/styleguide.html`, `pages/components.html` render with no console errors / no CDN requests.
- [x] T002 [P] Audit `assets/images/` for the SVG placeholders the new pages need (beach/city/luxury already exist); add any missing additive SVG placeholders with meaningful filenames.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data, the enhancement module skeleton, and the rewired shell that ALL new pages depend on.

**⚠️ CRITICAL**: No user-story page work should begin until this phase is complete.

- [x] T003 Create the deals catalog `assets/data/deals.json` with ≥9 believable deals per the M1 schema (`id`, `title`, `location`, `region`, `image`, `imageAlt`, `priceFrom`, `currency`, `rating`, `reviewsCount`, `source`, `badgeClass`, `badges`, `highlights[≥4]`, `terms`, `cta`); include the homepage's featured-deal ids as a consistent subset.
- [x] T004 Reconcile `assets/data/featured.json` so every homepage featured deal matches its `deals.json` entry exactly (same `id`/title/`priceFrom`/`source`) per mock-data contract M4.1.
- [x] T005 Create `src/js/discovery.js` (additive IIFE, `'use strict'`, `DOMContentLoaded`): per-page dispatch via a `data-page` attribute, plus shared helpers — `URLSearchParams` read on load, `history.replaceState` write on change, result-count `[aria-live]` updater, and empty-state toggler. No edits to `main.js`/`ui.js`.
- [x] T006 Rewire the canonical shell nav: in `partials/header.html` and `partials/footer.html`, change the deals/compare/coupons links to real hrefs (`deals.html`/`compare.html`/`coupons.html`) and remove their `data-coming-soon`; leave all other links (destinations/blog/auth/about/contact/partners/terms/privacy/social) with `data-coming-soon`.
- [x] T007 Establish the standalone page scaffold reused by the four new pages: inlined `head`/`header`/`footer` 1:1 with the updated `partials/`, skip link, `#main` landmark, `#toast-root`, and script order `../src/js/ui.js` → `../src/js/main.js` → `../src/js/discovery.js` (all `defer`).

**Checkpoint**: Shared data + module skeleton + rewired shell ready — user stories can now proceed.

---

## Phase 3: User Story 1 - Browse, filter & sort travel deals (Priority: P1) 🎯 MVP

**Goal**: A full `deals.html` listing of ≥9 deals with working filters, sort, reset, empty + skeleton states, and deep-linkable URL state.

**Independent Test**: Open `deals.html` at 360px and desktop → ≥9 cards with source badges + safe CTAs; apply source/region/price filters (set narrows + count updates); sort by price/rating (reorders); reset (restores); filters with no match → branded empty state; URL reflects filters and restores on reload; no horizontal scroll, no dead controls.

- [x] T008 [US1] Create `pages/deals.html` from the scaffold (T007): breadcrumb, single `<h1>` "عروض السفر", page meta + OG, `data-page="deals"`, small page-scoped `<style>` for the grid.
- [x] T009 [US1] Render the deals grid in `pages/deals.html`: ≥9 static `.card`s from `deals.json` with `.badge-source-*`, "ابتداءً من" `.price`, rating meta, and a safe CTA `<a href="deal-details.html?id=<id>">`; each card carries `data-source`/`data-region`/`data-price`/`data-rating` for filtering (data-model §4.1).
- [x] T010 [US1] Add the filter+sort bar to `pages/deals.html`: `source`, `region`, `priceMax` controls (`.field-select`/range), a `sort` select (price-asc/price-desc/rating-desc), a result-count `[aria-live="polite"]`, removable active-filter chips, and a reset `.btn-ghost`.
- [x] T011 [US1] Implement the deals behavior in `src/js/discovery.js` (deals block): read URL params → apply filter/sort to the DOM cards → update count → toggle empty state; write state to the URL via `replaceState` on change; reset clears all.
- [x] T012 [US1] Add a branded `.empty-state` (with reset action) and a `.skeleton` card placeholder pattern to `pages/deals.html`; wire empty-state show/hide in the deals block of `discovery.js`.
- [x] T013 [P] [US1] Add a deals help FAQ (`<details>`/`<summary>`) and `BreadcrumbList` + `ItemList` JSON-LD to `pages/deals.html`.

**Checkpoint**: `deals.html` is fully functional and independently testable — MVP deliverable.

---

## Phase 4: User Story 2 - View a deal's full details & take a safe action (Priority: P2)

**Goal**: A `deal-details.html` that resolves `?id=` from an inline catalog, shows full info + related deals + FAQ, and opens a validated inquiry modal.

**Independent Test**: Open `deal-details.html?id=<known>` → that deal's full info (title `<h1>`, gallery, price, rating, ≥4 highlights, source badge, terms); unknown/absent id → default deal or branded not-found linking to deals; primary CTA opens a validated inquiry modal (valid/invalid/error/success), frontend-only; ≥3 related deals; help/FAQ ≥3.

- [x] T014 [US2] Create `pages/deal-details.html` from the scaffold (T007): breadcrumb, `data-page="deal-details"`, and a statically-rendered representative default deal (single `<h1>` title, gallery/media with `alt`, "ابتداءً من" price+currency, rating+reviews, ≥4 highlights/inclusions, `.badge-source-*`, illustrative terms/cancellation).
- [x] T015 [US2] Embed the inline catalog `<script type="application/json" id="deals-catalog">` in `pages/deal-details.html` (entities mirroring `deals.json`) so the `?id=` swap needs no network (research D5).
- [x] T016 [US2] Implement the deal-details block in `src/js/discovery.js`: read `?id=`, look up the inline catalog, swap title/image/price/rating/highlights/source badge/terms in place; unknown/absent → keep default or reveal a `.empty-state` not-found panel linking to `deals.html`.
- [x] T017 [US2] Add the inquiry `.modal` (`data-modal-open="inquiry"`) to `pages/deal-details.html` with a `data-validate data-frontend-form` form (name + email`dir="ltr"` required; travel date/travelers/notes optional; `data-success-toast` + `[data-frontend-success]`) reusing the existing handler — frontend-only, persists nothing.
- [x] T018 [P] [US2] Add a related-deals section (≥3 `.card`s linking to their own `deal-details.html?id=`) and trust signals to `pages/deal-details.html`.
- [x] T019 [P] [US2] Add a help/FAQ (≥3 `<details>`) and `BreadcrumbList` + `Product`/`Offer` (+`aggregateRating`) + `FAQPage` JSON-LD to `pages/deal-details.html` (pricing illustrative, never live).

**Checkpoint**: `deal-details.html` works independently for any known id and degrades gracefully.

---

## Phase 5: User Story 3 - Compare offers across trusted sources (Priority: P3)

**Goal**: A `compare.html` single-trip source-offer comparison that echoes `?destination=`, with sort/filter and safe per-offer actions.

**Independent Test**: Open `compare.html` (and via the homepage hero search) at 360px and desktop → ≥4 offers across ≥3 sources for one trip with source badges + "ابتداءً من" price; echoes the destination context (default when absent); sort (price/rating) and filter (source) reorder/narrow with count + URL sync; branded empty state; each offer action → `deal-details.html?id=`; readable at 360px.

- [x] T020 [US3] Create `assets/data/compare-offers.json` per M3: a `default` set plus ≥1 destination key, each set with ≥4 offers spanning ≥3 distinct `source` values; every offer `id` resolves to a `deals.json` deal.
- [x] T021 [US3] Create `pages/compare.html` from the scaffold (T007): breadcrumb, single `<h1>` "مقارنة العروض", `data-page="compare"`, a trip-context echo banner (`.inline-msg`), and the default trip's offers statically rendered (`.card`s on mobile, columns/table ≥md) with `.badge-source-*`, `.price`, rating, `data-source`/`data-price`/`data-rating`, and a safe action `<a href="deal-details.html?id=<id>">`.
- [x] T022 [US3] Add the comparison sort (price/rating) + filter (source) bar, result-count `[aria-live]`, and a branded `.empty-state` to `pages/compare.html`.
- [x] T023 [US3] Implement the compare block in `src/js/discovery.js`: read `?destination=`/`dates`/`travelers` → echo context; normalize the free-text `destination` (trim + case/diacritic-insensitive contains-match) against the `compare-offers.json` keys and swap to that destination's offer set, falling back to `default` when absent/unknown (I2); apply sort/filter to the DOM + URL sync + count + empty-state toggle.
- [x] T024 [P] [US3] Add a "كيف تعمل المقارنة" steps + trust band, a comparison help FAQ, and `BreadcrumbList` + `ItemList` JSON-LD to `pages/compare.html`.

**Checkpoint**: `compare.html` renders a believable single-trip comparison and echoes search context.

---

## Phase 6: User Story 4 - Find & copy discount coupons (Priority: P4)

**Goal**: A `coupons.html` listing of ≥6 coupons with copyable codes, filters (source/category), reset, and empty state.

**Independent Test**: Open `coupons.html` at 360px and desktop → ≥6 coupon cards (source badge, discount, illustrative terms, copyable code); copy any code → success toast (no dialog); filter by source/category narrows with count; reset restores; no-match → branded empty state; coupons shared with the homepage are identical.

- [x] T025 [US4] Extend `assets/data/coupons.json` per M2: add a `category` (طيران/فنادق/باقات/أنشطة) to each item and grow to ≥6 items; keep homepage-referenced coupons identical (M4.1).
- [x] T026 [US4] Create `pages/coupons.html` from the scaffold (T007): breadcrumb, single `<h1>` "كوبونات الخصم", `data-page="coupons"`, and ≥6 static coupon `.card`s with `.badge-source-*`, discount label, illustrative validity/terms, a copy control (`data-copy="<CODE>"`, code rendered `dir="ltr"`), and `data-source`/`data-category`.
- [x] T027 [US4] Add the coupons filter bar (source + category) + result-count `[aria-live]` + reset + branded `.empty-state` to `pages/coupons.html`.
- [x] T028 [US4] Implement the coupons block in `src/js/discovery.js`: read URL params → filter the DOM cards → update count → toggle empty state; URL sync on change; reset clears (copy reuses the existing `data-copy` handler — no new code).
- [x] T029 [P] [US4] Add a coupons help FAQ (`<details>`) and `BreadcrumbList` + `ItemList` JSON-LD to `pages/coupons.html`.

**Checkpoint**: `coupons.html` lists, filters, and copies independently.

---

## Phase 7: User Story 5 - Reach the new pages from homepage & shared navigation (Priority: P2)

**Goal**: Wire the homepage and all inlined shells so deals/compare/coupons/deal CTAs navigate to the real pages; out-of-scope links keep "coming soon"; nothing removed; identity unchanged.

**Dependency note**: Although P2, this story is sequenced after the page stories because its links target `deals.html`/`compare.html`/`coupons.html`/`deal-details.html` (which must exist). The canonical `partials/` were already rewired in T006.

**Independent Test**: From the homepage, the hero search navigates to `compare.html?destination=…`; featured-deal cards → `deal-details.html?id=`; view-all/coupons/compare CTAs → the right pages; header/drawer/footer deals/compare/coupons links resolve; out-of-scope links still show "coming soon"; every Spec 002 section still present; visual identity unchanged.

- [x] T030 [US5] Rewire the homepage hero search form in `pages/index.html` to a native `method="get" action="compare.html"` (keep `data-validate`; remove `data-frontend-form`/`data-success-toast`); ensure inputs are named `destination`/`dates`/`travelers` so a valid submit navigates with query params (research D3).
- [x] T031 [US5] Rewire the homepage in-page CTAs in `pages/index.html`: featured-deal cards → `deal-details.html?id=<id>` — each `<id>` MUST exist in `deals.json` / the `#deals-catalog` so the link resolves (C1); "عرض الكل/view all deals" → `deals.html`; coupons section / "احصل على الكوبون" / browse → `coupons.html`; any compare CTA → `compare.html` (remove `data-coming-soon` on these). Also ensure the existing `#deal-quickview` modal is not left with an orphaned trigger — repurpose it as the card's secondary quick-view action or remove the unused modal (L1).
- [x] T032 [US5] Sync the inlined shell in `pages/index.html` to match the updated canonical `partials/` (deals/compare/coupons real; all other links keep `data-coming-soon`).
- [x] T033 [P] [US5] Sync the inlined shell in `pages/styleguide.html` and `pages/components.html` to match the canonical `partials/` (non-regression; SC-017).
- [x] T034 [US5] Verify in `pages/index.html` that out-of-scope links (destinations/blog/guides/auth/about/contact/partners/terms/privacy/social) still use `data-coming-soon` and that **no existing homepage section was removed** (diff against the Spec 002 baseline).

**Checkpoint**: The full discovery funnel is reachable from the homepage and shell; no dead ends, no regressions.

---

## Phase 8: Polish & Cross-Cutting Concerns (QA gate)

**Purpose**: Run the `quickstart.md` "done" gate across all four pages + the homepage integration.

- [x] T035 [P] Run `npm run build`; confirm each new page + the homepage make **zero** external CDN/network requests for CSS/JS/fonts/images (SC-013).
- [x] T036 [P] Run the stack-compliance grep gate (react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(, excluding node_modules) → no matches (SC-013).
- [x] T037 [P] `npx html-validate pages/deals.html pages/deal-details.html pages/compare.html pages/coupons.html` → 0 errors; `npx prettier --check "src/js/**/*.js" "pages/*.html"`; `npx stylelint "src/**/*.css"` if `input.css` was touched.
- [x] T038 Accessibility audit: run `axe` on each new page → 0 WCAG 2.1 AA violations; verify keyboard reaches/operates all controls (filters/sort/reset/card CTAs/copy/modal/inquiry), visible focus, focus-managed modal, reduced-motion, and `[aria-live]` result/empty announcements (SC-015).
- [x] T039 [P] Responsive + RTL pass: 320–360px no horizontal scroll on all four pages; LTR flip (`dir="ltr" lang="en"`) mirrors with no breakage (SC-001/SC-011).
- [x] T040 [P] Mock-data consistency + link integrity: homepage deals/coupons identical on the new pages; every deal-card/offer `?id=` resolves in the inline catalog (no dangling detail links) (SC-009, data-model §8).
- [x] T041 Performance: each new page interactive < 2s under Lighthouse mobile "Slow 4G" + 4× CPU throttle (SC-016).
- [x] T042 Run the full `quickstart.md` per-page "done" checklist + non-regression: `styleguide.html`/`components.html` still render; confirm `src/js/main.js` and `src/js/ui.js` are unchanged vs the start of this feature (SC-017).
- [x] T043 [P] Deep-link verification (SC-018): confirm `deal-details.html?id=<known>` shows that exact deal; `compare.html?destination=<known>` echoes the context and renders that trip's offers; and a filtered/sorted `deals.html?source=…&sort=…` (and `coupons.html?…`) URL reproduces the identical view on reload/share — with a sensible default shown when params are absent or invalid.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup — **blocks all user stories** (provides `deals.json`, `discovery.js` skeleton, rewired `partials/`, page scaffold).
- **User Stories (Phases 3–7)**: after Foundational.
  - US1 (P1), US2 (P2), US3 (P3), US4 (P4) each build a **distinct page file** → independent.
  - US5 (P2) is sequenced **last** among stories: it wires links to the pages built in US1–US4.
- **Polish (Phase 8)**: after all desired stories are complete.

### User-story dependencies

- **US1**: after Foundational. No dependency on other stories.
- **US2**: after Foundational. Uses `deals.json` (Foundational); independently testable for any id.
- **US3**: after Foundational. Adds its own `compare-offers.json`; offer ids reference `deals.json`.
- **US4**: after Foundational. Extends `coupons.json`; fully independent.
- **US5**: after US1–US4 (links must resolve). Canonical `partials/` already rewired in T006.

### Shared-file note (serialization point)

- `src/js/discovery.js` is touched by T005 (skeleton), T011 (US1), T016 (US2), T023 (US3), T028 (US4). These
  edit **different per-page blocks** of the same file → keep them sequential (not `[P]` with each other) or
  coordinate merges. All other per-story work is in distinct page/data files.

### Parallel opportunities

- T002 (Setup) ∥ nothing blocking.
- After Foundational, the **HTML + data** of US1/US2/US3/US4 can be built in parallel by different people
  (distinct files: `deals.html`, `deal-details.html`+`#deals-catalog`, `compare.html`+`compare-offers.json`,
  `coupons.html`+`coupons.json`) — coordinating only the `discovery.js` blocks.
- Within a story, `[P]` tasks (e.g., the JSON-LD/FAQ task) touch separate concerns and can overlap.
- Most Polish tasks (T035–T037, T039, T040) are `[P]` (different tools/files).

---

## Parallel Example: after Foundational (cross-story)

```bash
# Different developers, distinct files (coordinate only on src/js/discovery.js blocks):
Dev A → US1: pages/deals.html        (+ discovery.js deals block)
Dev B → US2: pages/deal-details.html (+ #deals-catalog, discovery.js detail block)
Dev C → US3: pages/compare.html      (+ assets/data/compare-offers.json, discovery.js compare block)
Dev D → US4: pages/coupons.html      (+ assets/data/coupons.json, discovery.js coupons block)
# Then US5 integrates the homepage/shell once the four pages exist.
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational (CRITICAL — blocks all stories).
2. Phase 3 US1 (`deals.html`).
3. **STOP & VALIDATE**: test the deals listing independently (filters/sort/reset/empty/URL).
4. Demo the MVP.

### Incremental delivery

1. Setup + Foundational → foundation ready.
2. US1 (deals) → test → demo (MVP).
3. US2 (deal-details) → test → demo (browse → detail funnel).
4. US3 (compare) → test → demo (search → compare).
5. US4 (coupons) → test → demo (monetization).
6. US5 (homepage/shell rewiring) → test → demo (full funnel, no dead ends).
7. Polish/QA gate → ship.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task. `[Story]` maps a task to its user story.
- Each user story is an independently completable, testable increment.
- Reuse existing components/utilities; do not modify `main.js`/`ui.js`; introduce no new visual identity.
- Keep mock data believable and consistent across pages; never imply live prices or real integrations.
- Commit after each task or logical group. Stop at any checkpoint to validate a story independently.
