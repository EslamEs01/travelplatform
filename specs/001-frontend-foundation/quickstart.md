# Quickstart: Frontend Foundation & Design System

**Feature**: `001-frontend-foundation` | **Date**: 2026-05-31

How to set up, build, preview, and verify the Travel SaaS frontend foundation. Stack: HTML + local
Tailwind CSS v3.4 build + vanilla JS. **No CDN, no framework.**

## Prerequisites

- Node.js ≥ 18 LTS and npm (build-time only — the shipped site is static HTML/CSS/JS).
- A modern evergreen browser (Chrome / Edge / Firefox / Safari, last 2 versions).

## 1. Install

```bash
cd travel-saas-frontend
npm install        # tailwindcss@^3.4, postcss, autoprefixer, @tailwindcss/forms (+ optional dev tools)
```

## 2. Build the CSS (local — never a CDN)

```bash
npm run build      # tailwindcss -i ./src/input.css -o ./assets/css/tailwind.css --minify
npm run watch      # same, with --watch during development
```

`package.json` scripts (target):

```json
{
  "scripts": {
    "build":  "tailwindcss -i ./src/input.css -o ./assets/css/tailwind.css --minify",
    "watch":  "tailwindcss -i ./src/input.css -o ./assets/css/tailwind.css --watch",
    "serve":  "npx serve .",
    "format": "prettier --write .",
    "lint:css": "stylelint \"src/**/*.css\"",
    "audit:a11y": "axe http://localhost:3000/pages/index.html"
  }
}
```

## 3. Preview

```bash
npm run serve      # serve over http:// (recommended) then open /pages/index.html
```

> Prefer a static server over opening `file://` directly so relative asset paths and fonts resolve exactly
> as they will in production. The page is still fully standalone.

## 4. Verify — per-page "done" checklist (Constitution gate)

A page is **NOT done** until all of these pass:

- [ ] **Standalone**: renders correctly served as a static file; no console errors; **zero external CDN
      requests** for CSS/JS/fonts (SC-006).
- [ ] **RTL + mobile-first**: defaults to Arabic `dir="rtl"`; fully usable at 360px with **no horizontal
      scroll** (SC-001/SC-003); touch targets ≥ ~44px (SC-004).
- [ ] **English-ready**: flipping `dir="ltr" lang="en"` mirrors layout with no breakage (FR-009).
- [ ] **Premium + trust**: design tokens used (≥95% styling via system, SC-005); trust signals present.
- [ ] **No dead interactions**: every control navigates / opens modal / opens drawer / toggles / toasts /
      copies / submits a validated form. **Zero** bare `#` links, **zero** dead buttons, **zero**
      `alert()`/`confirm()`/`prompt()` (SC-002).
- [ ] **Patterns**: buttons, cards, badges (incl. source badges), modal, drawer, toast, validated form,
      skeleton, empty state all demonstrable (SC-008).
- [ ] **Integration honesty**: data clearly mock; safe CTA labels; correct source badges; no live-price
      claim (Principle IX).
- [ ] **SEO/semantics**: one `<h1>`, correct heading order, required meta (title/description/lang/dir/
      viewport) (SC-009).
- [ ] **Accessibility — WCAG 2.1 AA**: `npm run audit:a11y` reports **0 AA violations**; keyboard-only
      reaches/operates 100% of interactive elements; visible focus; modal/drawer focus managed;
      reduced-motion respected (SC-012 / FR-025).
- [ ] **Performance**: interactive < 2s on a typical mobile connection (SC-011).

## 5. Stack-compliance hard gate

```bash
# Must return NO matches anywhere in travel-saas-frontend/ (excluding node_modules):
grep -RInE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
```

Any match fails the build review (Principle II).

## Where things live

- Tokens → `tailwind.config.js` theme + `src/input.css` (`@layer`). See `data-model.md`.
- Shared shell → `partials/head.html`, `partials/header.html`, `partials/footer.html`. See
  `contracts/page-shell.contract.md`.
- Interaction utilities → `src/js/ui.js` (`window.TUI`). See `contracts/ui-utilities.contract.md`.
- Component markup → `contracts/component-patterns.contract.md`.
- Reference page → `pages/index.html`.
