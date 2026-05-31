# Contract: Standalone Page Shell (backend-ready)

**Feature**: `001-frontend-foundation` | **Date**: 2026-05-31

Defines the required structure every page MUST follow so it renders correctly standalone (Principle III),
is RTL-first + English-ready (V/FR-009), meets the SEO baseline (X/FR-024), and maps cleanly to future
Django templates. The homepage `index.html` MUST satisfy this contract; future pages reuse it.

## C1. Document & `<head>` (from `partials/head.html`)

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">   <!-- default Arabic RTL; flipping to lang="en" dir="ltr" must not break layout -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{page title — Arabic, ≤ 60 chars}</title>
  <meta name="description" content="{Arabic meta description, 120–160 chars}">
  <meta name="theme-color" content="#0E8186">
  <!-- Open Graph baseline (English-ready, SEO) -->
  <meta property="og:title" content="…"><meta property="og:description" content="…">
  <meta property="og:type" content="website"><meta property="og:locale" content="ar_AR">
  <link rel="icon" href="../assets/icons/favicon.svg">
  <link rel="preload" as="font" type="font/woff2" href="../assets/fonts/cairo-600.woff2" crossorigin>
  <link rel="stylesheet" href="../assets/css/tailwind.css">   <!-- compiled, local; NO CDN -->
  <script type="application/ld+json">{ "@context":"https://schema.org","@type":"Organization", … }</script>
  <script type="application/ld+json">{ "@context":"https://schema.org","@type":"WebSite", … }</script>
</head>
```

**Rules**

- Exactly **one `<title>`** and **one `<meta name="description">`**.
- Default `lang="ar" dir="rtl"`. No physical-direction assumptions in markup that would break LTR.
- Stylesheet is the **local build output** only; zero external CDN `<link>`/`<script>` (SC-006).
- All asset paths are relative so the page works standalone (and re-root cleanly under Django `static`).

## C2. Body landmark order

```html
<body class="bg-ink-50 text-ink-700 antialiased">
  <a href="#main" class="skip-link">تخطَّ إلى المحتوى</a>   <!-- visible on focus (a11y) -->
  <header>…top bar + nav + drawer (partials/header.html)…</header>
  <main id="main">…page content…</main>
  <footer>…trust row + nav groups (partials/footer.html)…</footer>
  <div id="toast-root" aria-live="polite" aria-atomic="true"></div>   <!-- toast mount -->
  <script src="../src/js/ui.js" defer></script>
  <script src="../src/js/main.js" defer></script>
</body>
```

**Rules**

- Landmarks present and unique: one `<header>`, one `<main id="main">`, one `<footer>`.
- Exactly **one `<h1>`** per page; heading levels never skip (h1→h2→h3…), satisfying SC-009.
- `#toast-root` is a polite live region present on every page.
- Scripts are classic `defer` (no `type="module"`); they attach to `window.TUI` (see ui-utilities contract).

## C3. Heading hierarchy (homepage example)

```text
h1  Platform value proposition (hero)
  h2  العروض المميزة (featured)
    h3  card titles
  h2  لماذا تثق بنا (trust)
  h2  كيف تعمل المنصة (how it works)
  h2  الأسئلة الشائعة (FAQ — FR-026)
  h2  ابدأ الآن (CTA band)
footer  (no new h1)
```

## C4. Backend-readiness (Django mapping)

| Static now | Becomes later |
|------------|---------------|
| `partials/head.html` | `{% include "partials/head.html" %}` (block title/description) |
| `partials/header.html` | `{% include "partials/header.html" %}` |
| `partials/footer.html` | `{% include "partials/footer.html" %}` |
| relative `../assets/...` | `{% static 'assets/...' %}` |
| inline mock JSON | view context / template tags |

Markup MUST avoid client-only rendering of core content — everything in `<main>` is present in the HTML
source (progressive enhancement only for interactions).

## Acceptance

- Opening the file (via a static server) renders fully with no console errors and no external network
  requests for CSS/JS/fonts.
- Disabling JavaScript still renders header, main content, and footer legibly (interactions degrade, chrome
  does not disappear).
- Flipping `dir="ltr" lang="en"` in dev mirrors the layout with no overlap/clipping.
