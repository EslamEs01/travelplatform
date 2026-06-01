# Implementation Plan: Public Homepage (Travel SaaS Platform)

**Branch**: `002-public-homepage` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-public-homepage/spec.md`

## Summary

Elevate `travel-saas-frontend/pages/index.html` from the Spec 001 *reference page* into the **real, production-grade public homepage**. The page communicates the platform's core value proposition (compare travel deals from many trusted sources in one place), provides a hero **search/comparison entry**, and adds substantial explore + trust sections: featured deals, popular destinations, discount coupons (with copy-to-clipboard codes), social proof (testimonials + trusted partners), a travel-guides teaser, an enhanced FAQ, and a frontend-only price-alert/newsletter capture.

**Technical approach**: Pure composition + content on top of the **existing Spec 001 foundation**. Reuse the shared shell (`partials/` header/drawer/footer), design tokens (`tailwind.config.js`), component classes (`src/input.css`: `.btn/.card/.badge/.modal/.drawer/.field/.skeleton/.empty-state/.inline-msg/.toast`), and the `window.TUI` utilities (toast, modal, drawer, validateForm, copyToClipboard) wired declaratively via `data-*`. Add believable mock-content JSON (`destinations.json`, `coupons.json`, plus testimonials/guides as inline or JSON) and a few SVG imagery placeholders. The only shared-JS touch is an **additive, opt-in, non-breaking** enhancement to `src/js/main.js` so a `data-validate` form can complete frontend-only on valid submit (show a success/echo confirmation, no navigation) — existing forms are unaffected. Add `FAQPage` JSON-LD alongside the existing `Organization` + `WebSite`. No visual identity change; no foundation rebuild.

## Technical Context

**Language/Version**: HTML5, CSS3 authored via the existing Tailwind CSS v3.4 local build (PostCSS/Autoprefixer); vanilla JavaScript (ES2020, classic `defer` scripts — no bundler). Build-time runtime: Node.js ≥ 18 LTS + npm (unchanged from Spec 001).
**Primary Dependencies**: None added. Reuses the installed `tailwindcss@^3.4`, `postcss`, `autoprefixer`, `@tailwindcss/forms` and the existing `window.TUI` namespace. No runtime framework. No CDN.
**Storage**: N/A — no backend/database. Mock content is realistic, clearly-mock data embedded in the page and/or small local `assets/data/*.json` files. The search and newsletter forms persist/transmit nothing.
**Testing**: Manual QA against the per-page "done" checklist (constitution) + automated accessibility/SEO audit (axe-core / Lighthouse) targeting WCAG 2.1 AA, plus HTML validation (`html-validate`) and Prettier/Stylelint. The stack-compliance grep gate is a hard gate. No unit-test framework (consistent with Spec 001).
**Target Platform**: Modern evergreen browsers — Chrome, Edge, Firefox, iOS/macOS Safari — last 2 major versions. Mobile-first (~320–360px up to desktop).
**Project Type**: Static frontend web application (single project; one page in scope this phase). No backend tier.
**Performance Goals**: Homepage interactive in < 2s under Lighthouse mobile "Slow 4G" (≈1.6 Mbps, 150 ms RTT) + 4× CPU throttle (SC-013); minified CSS reused; self-hosted `woff2` with `font-display: swap`; lazy images; zero runtime CDN requests.
**Constraints**: Approved stack ONLY (no React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN; no `alert()`/`confirm()`/`prompt()`); Arabic-RTL default + English-ready; WCAG 2.1 AA; standalone backend-ready page; no dead interactions; SEO baseline (semantic HTML, single `<h1>`, heading hierarchy, meta, JSON-LD). Reuse Spec 001 foundation unchanged except additive mock data and one additive, opt-in `main.js` enhancement; preserve the visual identity.
**Scale/Scope**: One page (`index.html`) finalized as the real homepage, with ~9 content sections (hero+search, featured deals, popular destinations, coupons, why-us/how-it-works, social proof + partners, guides teaser, price-alert/newsletter, FAQ + CTA). Mock data: ≥6 deals, ≥4 destinations, ≥3 coupons, ≥3 testimonials, ≥3 partners, ≥3 guides.

*No `NEEDS CLARIFICATION` items remain — the spec's Clarifications (2026-05-31) resolved the two open questions (frontend-only search behavior; frontend-only intent capture).*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–X + Technical Standards + Development Workflow gates).

| Principle / Gate | Status | How this plan satisfies it |
|---|---|---|
| I. Frontend-First Delivery | ✅ PASS | Pure frontend page finalization; zero backend. |
| II. Approved Stack Only (NON-NEGOTIABLE) | ✅ PASS | Reuses the existing local Tailwind build + vanilla JS only. No forbidden libs; no Tailwind CDN; no `alert()`. Verified by the stack-compliance grep gate. |
| III. Standalone, Backend-Ready Pages | ✅ PASS | `index.html` stays self-contained; header/footer remain 1:1 with canonical `partials/`; semantic, server-renderable structure. |
| IV. Premium & Trustworthy | ✅ PASS | Reuses premium tokens; adds trust signals — verified-deal/source badges, testimonials, trusted partners, support cues, realistic ratings. No empty/broken UI. |
| V. Arabic-First RTL & Mobile-First | ✅ PASS | Reuses `<html lang="ar" dir="rtl">` shell, logical-property utilities, mobile-first breakpoints; English-ready structure preserved. |
| VI. No Dead Interactions | ✅ PASS | Search → inline + toast confirmation; coupons → copy + toast; deals → quick-view modal/toast; newsletter → validated form; not-yet-built links → "coming soon" toast. No bare `#`, no `alert()`. |
| VII. Listing & Detail Contracts | ✅ PASS (scoped) | No listing/detail *page* is in scope; the homepage uses curated preview sections (deals/destinations/coupons) and reuses the card/badge/empty/skeleton patterns those pages will need. Full filter/sort/reset contracts apply when listing pages are built in later specs. |
| VIII. SaaS Direction Preserved | ✅ PASS | Homepage anticipates and links toward all public surfaces (compare, deals, coupons, destinations, guides, auth, price alerts) via "coming soon"; nothing removed or simplified. |
| IX. Integration-Ready, Never Faked | ✅ PASS | All content is believable mock; source badges (Partner/Affiliate/Manual Deal/API-Ready); safe CTA labels (View Deal/Request Booking/Compare Offer/Get Coupon); "starting from" pricing; search/newsletter are frontend-only and never imply live data or server-side storage. |
| X. SEO & Content Quality | ✅ PASS | Semantic landmarks, single `<h1>`, correct heading hierarchy, required meta, enhanced FAQ, and `Organization` + `WebSite` + `FAQPage` JSON-LD; non-thin, content-rich page. |
| Technical Standards & File Organization | ✅ PASS | Stays within the established `travel-saas-frontend/` tree; only additive `assets/data/*.json` and `assets/images/*` plus one additive `main.js` enhancement. See Complexity Tracking. |
| Development Workflow & Quality Gates | ✅ PASS | Per-page "done" checklist embedded in `quickstart.md`; stack-compliance is a hard gate; preservation rule honored (no existing section removed). |

**Result**: PASS — no violations. The single shared-file change (`main.js`) is additive and opt-in; logged in Complexity Tracking for transparency.

## Project Structure

### Documentation (this feature)

```text
specs/002-public-homepage/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification (+ Clarifications)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── homepage-content.contract.md
│   └── mock-data.contract.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
travel-saas-frontend/
├── tailwind.config.js        # REUSED unchanged (design tokens)
├── src/
│   ├── input.css             # REUSED; additive only if a homepage-specific composition
│   │                         #   class is unavoidable (prefer existing tokens/utilities)
│   └── js/
│       ├── ui.js             # REUSED unchanged (window.TUI)
│       └── main.js           # ADDITIVE, opt-in: frontend-only valid-submit handling
│                             #   (data-frontend-form → success toast/echo, no navigation)
├── assets/
│   ├── css/tailwind.css      # BUILD OUTPUT (regenerated; not edited by hand)
│   ├── data/
│   │   ├── featured.json     # REUSED (may be extended with consistent mock deals)
│   │   ├── destinations.json # NEW — popular destinations mock content
│   │   └── coupons.json      # NEW — discount coupons mock content
│   └── images/               # NEW additive SVG placeholders if needed (destinations/partners)
├── partials/                 # REUSED unchanged (canonical header/drawer/footer)
│   ├── head.html
│   ├── header.html
│   └── footer.html
└── pages/
    ├── index.html            # ★ THE deliverable — finalized real public homepage
    ├── styleguide.html       # REUSED unchanged (dev/QA reference)
    └── components.html        # REUSED unchanged (dev/QA reference)
```

**Structure Decision**: Single static-frontend project under `travel-saas-frontend/` (unchanged from Spec 001). This feature is overwhelmingly **composition + content** in `pages/index.html`, plus **additive** mock-data JSON, optional additive imagery, and a single **additive, opt-in** `main.js` enhancement for frontend-only form completion. No foundation file is rebuilt or behaviorally changed; the shared shell stays canonical in `partials/`.

## Complexity Tracking

> Only deviations/justified shared-file touches are logged here. There are no principle violations.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Additive opt-in handler in `src/js/main.js` (frontend-only valid submit → success toast/echo + `preventDefault`, gated by a new `data-frontend-form` attribute) | The hero search and newsletter must complete frontend-only with a visible confirmation and no navigation (FR-007/FR-014); the existing `data-validate` handler only blocks *invalid* submits and lets valid submits fall through to a (non-existent) action, which would reload the static page. | A page-scoped inline `<script>` in `index.html` was rejected because the ui-utilities contract states pages need no bespoke JS and wiring is declarative via `data-*`; an opt-in attribute keeps that contract intact and is reusable by future pages. Existing `data-validate` forms without the new attribute are unaffected (non-breaking). |
| New `assets/data/destinations.json`, `assets/data/coupons.json` (+ optional SVG imagery) | The homepage needs believable, consistent mock content for the new explore sections. | Hardcoding everything inline was rejected for consistency/reuse; JSON mirrors the existing `featured.json` convention and keeps content backend-ready (maps to future view context). |
