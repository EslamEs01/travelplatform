# Implementation Plan: Frontend Foundation & Design System (Travel SaaS Platform)

**Branch**: `001-frontend-foundation` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-frontend-foundation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Establish the frontend foundation for the Travel SaaS Platform: a locally-built design-token system,
a consistent backend-ready public website shell (branded top bar + slide-in drawer, footer), a library
of reusable UI patterns (buttons, cards, badges, modals, drawers, toasts, validated form fields,
skeletons, empty states), and base vanilla-JavaScript interaction utilities — all demonstrated by a
single complete, standalone, Arabic-RTL, mobile-first homepage (`index.html`). No backend, APIs, or
other pages are built in this phase. Technical approach: HTML5 + a local Tailwind CSS v3.4 build
(PostCSS/Autoprefixer) + small classic-script vanilla-JS utilities, targeting modern evergreen browsers
and WCAG 2.1 AA, with markup structured for later Django template integration.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via Tailwind CSS v3.4; vanilla JavaScript (ES2020, classic
`defer` scripts — no module bundler). Tooling runtime: Node.js ≥ 18 LTS + npm (build-time only).
**Primary Dependencies**: `tailwindcss@^3.4`, `postcss`, `autoprefixer`, `@tailwindcss/forms` (accessible
form base). Build-time/dev only: a static file server for preview (e.g. `npx serve`) and optional
`prettier`, `stylelint`, `html-validate`, `@axe-core/cli`. **No runtime framework. No CDN.**
**Storage**: N/A — no backend or database. Demo data is realistic, clearly-mock content embedded in the
page (and/or a small local `assets/data/*.json` for the featured section).
**Testing**: Manual QA against the per-page "done" checklist (constitution) + automated accessibility/SEO
audit (axe-core / Lighthouse) targeting WCAG 2.1 AA, plus HTML validation and Prettier/Stylelint
formatting. No unit-test framework required for this static foundation (the few JS utilities may get
lightweight tests in a later phase).
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major
versions. Mobile-first (≈320–360px up to desktop).
**Project Type**: Static frontend web application (single project; no backend tier in scope).
**Performance Goals**: Homepage interactive in < 2s on a typical mobile connection (SC-011); minimal JS;
Tailwind content-purged CSS; self-hosted `woff2` fonts with `font-display: swap`; zero runtime CDN requests.
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no browser
`alert()`/`confirm()`/`prompt()`); Arabic RTL default + English-ready structure; WCAG 2.1 AA; every page a
standalone, backend-ready HTML file; no dead interactions; SEO baseline (semantic HTML, heading hierarchy,
meta). Source `src/input.css`; build output linked by pages; no external CDN at runtime.
**Scale/Scope**: Foundation only — 1 reference page (`index.html`), shared shell (header + footer),
the design-token system, ~10 reusable component patterns, and 5 base JS utilities (toast, modal, drawer,
form-validation, copy-to-clipboard).

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications session (2026-05-31) resolved
accessibility target, i18n scope, mobile navigation model, and the browser baseline.*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend; zero backend. This phase *is* the frontend-first foundation. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | HTML + local Tailwind build + vanilla JS only. No forbidden libs; no Tailwind CDN; no `alert()`. Verified by a stack-compliance grep gate. |
| III. Standalone, Backend-Ready Pages | ✅ PASS | `index.html` is self-contained; header/footer kept as canonical `partials/` snippets that map 1:1 to future Django `{% include %}`s; semantic, predictable structure. |
| IV. Premium & Trustworthy | ✅ PASS | Design-token system (soft shadows, rounded cards, elegant gradients), homepage trust band (verified deals, secure inquiry, partner sources, support, ratings). |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | `<html lang="ar" dir="rtl">` default; logical-property utilities; top bar + slide-in drawer; mobile-first breakpoints. |
| VI. No Dead Interactions | ✅ PASS | `ui.js` provides toast/modal/drawer/validate/copy; unbuilt nav links trigger a "coming soon" toast (visible action); no `#`-only dead links; no `alert()`. |
| VII. Listing & Detail Contracts | ✅ PASS (scoped) | No listing/detail *pages* are in scope, but the patterns they require (card, badge, skeleton, loading, empty state) are delivered here. Filter/sort/reset contracts apply when those pages are built in later specs. |
| VIII. SaaS Direction Preserved | ✅ PASS | Shell navigation anticipates future public surfaces (Deals, Compare, Coupons, Destinations, Guides, Auth); nothing is removed or simplified. |
| IX. Integration-Ready, Never Faked | ✅ PASS | Homepage content is clearly mock; badge system includes Partner/Affiliate/Manual-Deal/API-Ready; safe CTA labels; no live-price claims. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, single `<h1>`, correct heading hierarchy, meta (title/description/lang/dir/viewport), non-thin homepage. |
| Technical Standards & File Organization | ✅ PASS | Follows the constitution's prescribed tree with documented, additive extensions (`assets/css/`, `assets/fonts/`, `partials/`). See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist embedded in `quickstart.md`; stack-compliance is a hard gate. |

**Result**: PASS — no violations. The minor structure additions are additive (the constitution permits
structure changes when a spec states them explicitly) and are logged in Complexity Tracking for transparency.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-foundation/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── page-shell.contract.md
│   ├── ui-utilities.contract.md
│   └── component-patterns.contract.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── package.json              # scripts: build / watch / lint / format / serve / audit
├── tailwind.config.js        # theme = design tokens; content globs for purge; RTL-safe
├── postcss.config.js         # tailwindcss + autoprefixer
├── .editorconfig             # consistency (optional tooling)
├── src/
│   ├── input.css             # @tailwind base/components/utilities + @layer tokens & component classes
│   └── js/
│       ├── main.js           # page bootstrap: wire shell (drawer toggle, year, coming-soon links)
│       └── ui.js             # reusable utilities: toast, modal, drawer, validateForm, copyToClipboard
├── assets/
│   ├── css/
│   │   └── tailwind.css       # BUILD OUTPUT (generated from src/input.css) — linked by every page
│   ├── fonts/                 # self-hosted Arabic+Latin webfont (Cairo) as woff2
│   ├── images/                # travel imagery placeholders
│   ├── icons/
│   │   └── sprite.svg         # SVG icon sprite, referenced via <use href="…#icon">
│   └── data/
│       └── featured.json      # realistic mock content for the homepage featured section
├── partials/                  # canonical shared-shell snippets (→ future Django includes)
│   ├── head.html              # <head> meta contract (title/description/lang/dir/viewport/links)
│   ├── header.html            # branded top bar + nav + drawer markup
│   └── footer.html            # footer with trust signals, support, secondary nav
└── pages/
    ├── index.html             # homepage — complete standalone reference implementation (public)
    ├── styleguide.html        # INTERNAL dev/QA reference: design-token foundations (not a public page)
    └── components.html         # INTERNAL dev/QA reference: component & interaction showcase (not a public page)
```

> `styleguide.html` and `components.html` are **internal developer/QA reference pages** used to demonstrate
> and verify the design system and pattern library (they satisfy SC-008's "homepage **or a sample page**"
> and SC-010). They are not public product pages and are not part of the shipped public site.

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/`, matching the
constitution's prescribed tree. Three **additive** directories are introduced and documented here:
`assets/css/` (holds the Tailwind build output linked by pages), `assets/fonts/` (self-hosted webfont,
since CDN fonts are forbidden), and `partials/` (canonical header/footer/head snippets). Because static
HTML cannot do server-side includes, each standalone page embeds the header/footer markup inline; the
`partials/` files are the single source of truth that developers copy and that later become Django
`{% include %}` templates — directly serving Principle III (backend-ready). JavaScript is delivered as
small classic `defer` scripts exposing one global namespace (no bundler, no ES-module CORS pitfalls when
files are opened directly), satisfying "vanilla JS only when necessary."

## Complexity Tracking

> Only deviations from the constitution's prescribed structure are logged here. There are no principle
> violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `assets/css/` (build output) | Pages must link a compiled stylesheet; the prescribed tree names `src/input.css` (source) but no output path. | Linking `src/input.css` directly would ship un-compiled Tailwind directives (broken styling) and violate the local-build requirement. |
| `assets/fonts/` (self-hosted webfont) | Premium Arabic typography is required and CDN fonts are forbidden (Principle II / no external CDN). | A system-font-only stack cannot guarantee the premium Arabic look the constitution demands. |
| `partials/` (shell snippets) | Consistency across future pages + clean mapping to Django `{% include %}` (Principle III). | Re-typing header/footer per page diverges over time; a JS-injected shell would break standalone/no-JS rendering. |
