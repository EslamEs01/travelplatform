# Phase 0 Research: Frontend Foundation & Design System

**Feature**: `001-frontend-foundation` | **Date**: 2026-05-31

All Technical Context items are decided (no `NEEDS CLARIFICATION` remain). This document records the
decisions, rationale, and rejected alternatives for the choices that shape the foundation. Every decision
is constrained by Constitution v1.0.0 (approved stack only; no CDN; Arabic-first RTL; WCAG 2.1 AA;
standalone backend-ready pages).

---

## D1 — CSS engine & version: Tailwind CSS v3.4 (local build)

- **Decision**: Use Tailwind CSS **v3.4.x**, compiled locally via the Tailwind CLI through PostCSS +
  Autoprefixer. Source `src/input.css`; output `assets/css/tailwind.css`.
- **Rationale**: The constitution's prescribed structure names `tailwind.config.js` **and**
  `postcss.config.js` — the classic v3 config-file + PostCSS pipeline. v3.4 is mature and stable, has
  first-class RTL support via logical-property utilities and `rtl:`/`ltr:` variants, and purges unused CSS
  via `content` globs (supports the < 2s performance goal). Local build satisfies "no CDN".
- **Alternatives considered**:
  - *Tailwind v4 (CSS-first `@import "tailwindcss"`, no PostCSS file)*: newest, but its default setup drops
    the explicit `postcss.config.js`/`tailwind.config.js` model the constitution mandates and would require
    deviating from the prescribed tree. Deferred until a future spec opts in.
  - *Hand-written CSS / SCSS*: more effort, weaker consistency guarantees, loses utility-driven token
    reuse (SC-005 requires ≥95% styling via the shared system).
  - *Tailwind CDN*: explicitly FORBIDDEN by the constitution.

## D2 — RTL strategy: logical properties + `dir`, no RTL plugin

- **Decision**: Author Arabic-first with `<html lang="ar" dir="rtl">` and use Tailwind **logical-property
  utilities** (`ms-/me-`, `ps-/pe-`, `start-/end-`, `text-start/text-end`) plus `rtl:`/`ltr:` variants for
  the few direction-specific cases. One stylesheet serves both directions.
- **Rationale**: Logical properties mirror automatically when `dir` flips, making the layout English-ready
  with zero duplicate CSS (FR-009). No extra dependency. Works in all evergreen targets.
- **Alternatives considered**:
  - *`tailwindcss-rtl` / separate `rtl.css`*: duplicate or plugin-managed physical properties; more
    surface area and drift risk than logical properties.
  - *Two compiled stylesheets (ltr/rtl)*: doubles build output and link management for no benefit here.

## D3 — Typography: self-hosted "Cairo" (Arabic + Latin), `woff2`

- **Decision**: Self-host **Cairo** (`woff2`, weights 400/500/600/700) in `assets/fonts/`, with
  `font-display: swap` and a system fallback stack (`system-ui, "Segoe UI", Tahoma, Arial`).
- **Rationale**: Cairo is a modern, premium, highly-legible Arabic typeface that also covers Latin glyphs
  (so Arabic body text and Latin brand names/prices share one family). Self-hosting honors the no-CDN rule
  and keeps the font on the critical path under control (performance + SC-006).
- **Alternatives considered**: *Tajawal / IBM Plex Sans Arabic / Noto Kufi Arabic* — all viable; Cairo
  chosen for its balance of warmth and professionalism. *Google Fonts CDN* — FORBIDDEN. *System Arabic
  fonts only* — inconsistent across platforms, fails the "premium" bar (IV).

## D4 — JavaScript delivery: classic `defer` scripts, single global namespace

- **Decision**: Ship `src/js/ui.js` and `src/js/main.js` as **classic scripts** loaded with `defer`,
  exposing a single global namespace (e.g. `window.TUI`). No bundler, no transpiler.
- **Rationale**: Matches "vanilla JS only when necessary"; pages remain truly standalone and work even when
  opened directly from disk (ES modules hit CORS restrictions over `file://`). Keeps payload tiny
  (performance goal) and the build limited to CSS only.
- **Alternatives considered**:
  - *ES modules (`type="module"`)*: cleaner imports but `file://` CORS breakage undermines standalone
    pages; deferred — can be revisited once a dev server is standard.
  - *A bundler (Vite/esbuild/Rollup)*: unnecessary complexity for a few utilities and adds a toolchain the
    constitution's stack doesn't require.

## D5 — Shared shell: inline markup with `partials/` as source of truth

- **Decision**: Each standalone page embeds the header/footer markup **inline**. The canonical copies live
  in `partials/header.html`, `partials/footer.html`, `partials/head.html` and are what developers copy.
- **Rationale**: Static HTML has no server-side include; inlining keeps every page renderable standalone
  (III) and with no JS dependency for core chrome. The `partials/` files map 1:1 to future Django
  `{% include %}`, making the eventual backend migration mechanical.
- **Alternatives considered**:
  - *JS-injected shell (`fetch` partial + inject)*: breaks no-JS/standalone rendering and adds a flash of
    missing chrome; rejected.
  - *Build-time HTML includes (e.g. a templating step)*: adds a build dependency beyond the CSS pipeline;
    unnecessary for one page now.

## D6 — Icon system: inline SVG sprite via `<use>`

- **Decision**: Maintain a single `assets/icons/sprite.svg` symbol sprite, referenced with
  `<svg><use href="assets/icons/sprite.svg#icon-name"></use></svg>`; decorative icons get
  `aria-hidden="true"`, meaningful icons get an accessible name.
- **Rationale**: One cached request, crisp at any size, CSS-colorable (`currentColor`), and accessible —
  supports performance, the premium look, and WCAG 2.1 AA.
- **Alternatives considered**: *Icon font* — accessibility/anti-aliasing issues, extra font payload.
  *Per-icon inline SVG copied everywhere* — bloats HTML and drifts. *Icon CDN/library* — FORBIDDEN / adds
  dependency.

## D7 — Accessibility: WCAG 2.1 AA via semantic HTML + ARIA Authoring Practices

- **Decision**: Build on semantic landmarks (`header`/`nav`/`main`/`footer`), correct heading order, AA
  contrast tokens, visible focus rings, labelled controls, and the WAI-ARIA Authoring Practices patterns
  for the dialog (modal), disclosure/drawer, and toast (live region). Verify with axe-core / Lighthouse.
- **Rationale**: Q1 clarification fixed the target at WCAG 2.1 AA (FR-025, SC-012). Following established
  ARIA patterns avoids reinventing focus management and gives testable pass/fail criteria.
- **Alternatives considered**: *Best-effort only* — rejected by clarification. *WCAG 2.2 AA* — considered;
  2.1 AA chosen as the agreed target (2.2 extras can be layered later).

## D8 — Interaction utilities: data-attribute driven, dependency-free

- **Decision**: `ui.js` exposes `toast`, `modal` (open/close), `drawer` (open/close), `validateForm`, and
  `copyToClipboard`. Components are wired declaratively via `data-*` attributes (e.g.
  `data-drawer-target`, `data-modal-open`, `data-copy`) so markup stays backend-ready and pages need no
  bespoke glue code. All feedback uses toasts/inline messages — **never** `alert()`/`confirm()`/`prompt()`.
- **Rationale**: Satisfies Principle VI (no dead interactions, no browser dialogs) with one small reusable
  layer; data-attribute wiring keeps the contract stable for future Django-rendered pages.
- **Alternatives considered**: *Headless UI / Alpine / other libs* — add a dependency the stack forbids or
  discourages. *Per-page imperative wiring* — duplicative and error-prone.

## D9 — Unbuilt navigation links: "coming soon" toast (no dead links)

- **Decision**: Nav entries whose destination pages are not built yet carry `data-coming-soon` and, on
  activation, show an informative toast ("هذه الصفحة قيد الإنشاء") instead of navigating; they are never
  bare `#` links and are never silently dead.
- **Rationale**: The shell anticipates future surfaces (VIII) while complying with "no dead interactions"
  (VI) and "no placeholder `#` links without a visible action".
- **Alternatives considered**: *Disabled/greyed items* — acceptable but less informative; the toast better
  communicates intent. *Linking everything to `index.html`* — misleading navigation.

## D10 — Mock content: local JSON + clearly-labelled, never "live"

- **Decision**: The homepage featured section uses realistic mock data from `assets/data/featured.json`
  (or inline equivalent), rendered with the card/badge patterns. Prices show neutral framing ("ابتداءً من")
  and source badges (Partner/Affiliate/Manual-Deal/API-Ready); nothing implies live pricing.
- **Rationale**: Satisfies Principle IX (integration-ready, never faked) and FR-015/FR-017.
- **Alternatives considered**: *Hardcoded inline cards only* — fine, but a small JSON keeps content
  consistent and easy to extend. *Fake "live price" widgets* — FORBIDDEN.

---

## Resolved unknowns summary

| Topic | Decision |
|---|---|
| CSS engine | Tailwind v3.4, local PostCSS build |
| RTL | Logical properties + `dir`, no plugin |
| Font | Self-hosted Cairo (woff2) |
| JS delivery | Classic `defer` scripts, `window.TUI` global |
| Shared shell | Inline markup; `partials/` source → future Django includes |
| Icons | Inline SVG sprite via `<use>` |
| Accessibility | WCAG 2.1 AA, ARIA APG patterns, axe/Lighthouse audit |
| Interaction layer | Data-attribute-driven `ui.js`; no browser dialogs |
| Unbuilt links | `data-coming-soon` → toast |
| Mock data | Local JSON, clearly mock, source-badged |

**All NEEDS CLARIFICATION resolved. Ready for Phase 1 (Design & Contracts).**
