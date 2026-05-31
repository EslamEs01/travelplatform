# Phase 1 Data Model: Frontend Foundation & Design System

**Feature**: `001-frontend-foundation` | **Date**: 2026-05-31

This foundation has no backend data. The "model" here is the **design system** (tokens), the **component
inventory**, the **navigation model**, and the **mock-content schema** future pages reuse. Concrete values
below are the proposed baseline (the spec deferred exact values to design); they satisfy the premium,
trustworthy, AA-contrast requirements and are encoded in `tailwind.config.js` theme + `src/input.css`.

---

## 1. Design Tokens

### 1.1 Color — Brand "Lagoon" (primary, teal/ocean → trust + travel)

| Step | Hex | Typical use |
|------|-----|-------------|
| 50 | `#ECFBFB` | tint backgrounds |
| 100 | `#D0F4F4` | subtle fills |
| 200 | `#A4E9EA` | hover fills |
| 300 | `#6FD7D9` | borders/illustration |
| 400 | `#38BCC0` | gradients |
| 500 | `#16A0A5` | brand base |
| 600 | `#0E8186` | **primary buttons / links (AA on white)** |
| 700 | `#0E686C` | hover/pressed |
| 800 | `#115457` | headings on light |
| 900 | `#11464A` | deep surfaces |
| 950 | `#042B2E` | hero/footer base |

### 1.2 Color — Accent "Sunset" (warm amber/gold → premium highlight)

| Step | Hex | Use |
|------|-----|-----|
| 100 | `#FCEBC8` | badge fills |
| 300 | `#F4BE52` | highlights |
| 500 | `#E08D12` | accent base |
| 600 | `#C26C0B` | **accent text/CTA (AA on white)** |
| 700 | `#A14E0D` | hover |

### 1.3 Color — Neutral "Ink"

| Step | Hex | Use |
|------|-----|-----|
| 50 | `#F7F8FA` | page background |
| 100 | `#EEF1F5` | card alt / dividers |
| 200 | `#DEE3EA` | borders |
| 300 | `#C5CDD7` | disabled borders |
| 400 | `#9AA6B4` | placeholder text |
| 500 | `#6B7889` | secondary text (AA on white) |
| 600 | `#4D5969` | body text |
| 700 | `#3A4453` | strong body |
| 800 | `#262E3A` | headings |
| 900 | `#161C26` | max-contrast text |

### 1.4 Color — Semantic

| Token | Hex | Pair (text-on) |
|-------|-----|----------------|
| `success` | `#1F9D57` | white |
| `warning` | `#E0A53B` | ink-900 |
| `danger` | `#D64545` | white |
| `info` | `#2D74C4` | white |

> **AA rule**: body text uses `ink-600/700/800` on light surfaces; on brand/colored surfaces use white only
> against `primary-600+`, `accent-600+`, `success`, `danger`, `info`. All defaults verified ≥ 4.5:1
> (normal) / ≥ 3:1 (large & UI) per FR-025 / SC-012.

### 1.5 Typography

- **Family**: `Cairo` (self-hosted woff2) → fallback `system-ui, "Segoe UI", Tahoma, Arial, sans-serif`.
- **Weights**: 400 / 500 / 600 / 700.
- **Body leading**: relaxed (~1.75) for Arabic legibility; headings ~1.2.

| Token | Size (rem) | Use |
|-------|-----------|-----|
| `xs` | 0.75 | captions, badges |
| `sm` | 0.875 | meta, labels |
| `base` | 1.0 | body |
| `lg` | 1.125 | lead paragraph |
| `xl` | 1.25 | card titles |
| `2xl` | 1.5 | section subheads |
| `3xl` | 1.875 | section headings |
| `4xl` | 2.25 | page heading |
| `5xl` | 3.0 | hero display (scales up at `lg`) |

### 1.6 Spacing, Layout, Radii, Shadows, Gradients, Motion, Z-index

- **Spacing**: Tailwind 4px base scale. **Container**: `max-w-7xl` (~1200px), inline padding `px-4 md:px-6`.
  **Section rhythm**: `py-12 md:py-20`.
- **Radii**: `sm .375 / md .5 / lg .75 / xl 1 / 2xl 1.5 rem / full`. Cards = `rounded-2xl`; buttons/inputs
  = `rounded-xl`; pills/badges = `rounded-full`.
- **Shadows (soft)**: `shadow-soft` (subtle), `shadow-card` (resting card), `shadow-pop` (hover/modal) —
  low-opacity, slate-tinted.
- **Gradients**: `--gradient-brand` (primary-600→primary-400), `--gradient-hero` (primary-900→primary-700
  overlay for hero imagery), `--gradient-accent` (primary-600→accent-500 for special CTAs).
- **Motion**: durations 150/200/300ms, standard easing; ALL transitions gated by
  `@media (prefers-reduced-motion: reduce)`.
- **Z-index**: `dropdown 1000 / sticky 1020 / drawer-overlay 1030 / drawer 1040 / modal-overlay 1050 /
  modal 1060 / toast 1080`.
- **Breakpoints** (mobile-first, Tailwind defaults): `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.

---

## 2. Component Inventory

Each component is a reusable pattern with defined variants, states, and accessibility requirements.
Full markup/attribute contracts live in `contracts/component-patterns.contract.md`.

| Component | Variants | States | Key a11y |
|-----------|----------|--------|----------|
| **Button** | primary, secondary, ghost, outline, danger; sizes sm/md/lg; icon-only | default, hover, focus-visible, active, disabled, loading | real `<button>`/`<a>`; visible focus ring; `aria-busy` when loading; icon-only has `aria-label` |
| **Card** | base, media-top (image), horizontal, interactive (whole-card link) | default, hover (lift), focus-within | one meaningful link/heading; image `alt`; not a `<div>`-only clickable |
| **Badge** | neutral, success, warning, danger, info; **source: Partner / Affiliate / Manual Deal / API-Ready**; "verified", "featured" | static | meaningful badges have text; decorative icon `aria-hidden` |
| **Modal (dialog)** | sm/md/lg | closed, open | `role="dialog" aria-modal="true"`, labelled by title; focus trap; `Esc` closes; returns focus to trigger |
| **Drawer (off-canvas)** | start (RTL: right), end, top | closed, open | disclosure pattern; focus moves in; `Esc`/overlay/close button dismiss; scrim inert background |
| **Toast** | success, error, info, warning | enter, visible, auto-dismiss, manual-close | `aria-live="polite"` region (assertive for errors); never blocks; never a browser dialog |
| **Form field** | input, textarea, select, checkbox, radio | default, focus, valid, invalid/error, success, disabled | `<label>` linked; error text via `aria-describedby`; `aria-invalid` on error |
| **Skeleton** | text-line, card, avatar, image | shimmer (reduced-motion → static) | `aria-hidden="true"`; real content replaces it |
| **Empty state** | generic, search-no-results | static | icon `aria-hidden`; clear heading + helpful action |
| **Inline message / alert** | info, success, warning, error | static, dismissible | `role="status"`/`role="alert"` as appropriate |

---

## 3. Navigation Model

Primary nav anticipates future SaaS public surfaces (Principle VIII). Only `index.html` exists now; every
other entry is `data-coming-soon` and shows a toast instead of navigating (no dead links, Principle VI).

| Key (English-ready) | Arabic label | Target | State |
|---------------------|--------------|--------|-------|
| `home` | الرئيسية | `index.html` | active |
| `deals` | عروض السفر | (future) | coming-soon |
| `compare` | مقارنة الأسعار | (future) | coming-soon |
| `coupons` | كوبونات الخصم | (future) | coming-soon |
| `destinations` | وجهات | (future) | coming-soon |
| `guides` | دليل السفر | (future) | coming-soon |
| `auth` (CTA) | تسجيل الدخول | (future) | coming-soon |

**Footer groups**: المنصة (عن المنصة، كيف تعمل) · استكشف (العروض، الوجهات، الكوبونات) · الدعم (تواصل معنا،
الأسئلة الشائعة) · قانوني (الشروط، الخصوصية). **Trust row**: عروض موثقة · حجز آمن · شركاء معتمدون · دعم على مدار الساعة.

---

## 4. Mock Content Item (homepage featured section)

Realistic, clearly-mock content; never implies live pricing (Principle IX). Source: `assets/data/featured.json`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key |
| `type` | `deal` \| `destination` | card flavor |
| `title` | string (ar) | e.g. "عطلة في شرم الشيخ – 4 ليالٍ" |
| `location` | string (ar) | e.g. "شرم الشيخ، مصر" |
| `image` | string | placeholder path in `assets/images/` |
| `priceFrom` | number | framed as "ابتداءً من" — never "live" |
| `currency` | string | e.g. "ر.س" |
| `rating` | number (0–5) | realistic, e.g. 4.6 |
| `reviewsCount` | number | e.g. 128 |
| `source` | `Partner` \| `Affiliate` \| `Manual Deal` \| `API Ready` | rendered as a source badge |
| `badges` | string[] | e.g. ["موثّق", "مميّز"] |
| `cta` | `{ label, kind }` | safe labels: "عرض التفاصيل" / "اطلب الحجز"; `kind=coming-soon` for now |

---

## 5. Page Shell (structural entity)

A standalone page = **Head meta contract** + **Header (top bar + drawer)** + **`<main>` content** +
**Footer** + **toast container** + linked compiled CSS and `defer` scripts. The exact required `<head>`
tags, landmark order, and script/style links are specified in `contracts/page-shell.contract.md`. Header
and footer markup come from `partials/` (canonical source → future Django includes).
