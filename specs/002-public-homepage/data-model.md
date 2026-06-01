# Phase 1 Data Model: Public Homepage

**Feature**: `002-public-homepage` | **Date**: 2026-05-31

No backend data. The "model" here is the homepage's **section inventory**, the **mock-content schemas**
(reused + new), the **interaction map** (which control fires which existing `window.TUI` action), and the
**structured-data** payloads. All values are realistic, clearly-mock, and never imply live data (Principle IX).

---

## 1. Section Inventory (composition order)

The homepage is a single standalone page reusing the canonical shell. `<main id="main">` contains the
following labelled `<section>` landmarks in order. Exactly one `<h1>` (hero); every other section heading is
`<h2>`; card titles are `<h3>`.

| # | Section | Heading | Purpose | Key reused patterns | New mock data |
|---|---------|---------|---------|---------------------|---------------|
| 0 | Shell (header + drawer) | — | Branded top bar + slide-in nav | `partials/header.html` | — |
| 1 | **Hero + search/comparison** | `<h1>` value prop | Understand value; start a comparison | `.field`, `.btn`, `.inline-msg`, toast | — (frontend-only query) |
| 2 | **Featured deals** | `<h2>` العروض المميزة | Believable deals w/ source badges | `.card`, `.badge-source-*`, `.badge-featured/verified`, `.modal` (quick-view) | `featured.json` (reused/extended) |
| 3 | **Popular destinations** | `<h2>` وجهات شهيرة | Destination discovery | `.card`, `.badge` | `destinations.json` (NEW) |
| 4 | **Coupons / offers** | `<h2>` كوبونات وعروض | Copyable discount codes | `.card`, `.badge`, copy-to-clipboard | `coupons.json` (NEW) |
| 5 | **Why us / how it works** | `<h2>` كيف تعمل المنصة | Value reinforcement + trust band | existing trust band + steps | — |
| 6 | **Social proof** | `<h2>` ماذا يقول مسافرونا | Testimonials + trusted partners | `.card`, `.badge`, rating stars | inline (testimonials, partners) |
| 7 | **Travel guides teaser** | `<h2>` دليل السفر والنصائح | SEO content depth | `.card`, coming-soon toast | inline (guides) |
| 8 | **Price-alert / newsletter** | `<h2>` لا تفوّت أي عرض | Frontend-only intent capture | `.field`, `.btn`, `.inline-msg`, toast | — (frontend-only) |
| 9 | **FAQ + final CTA** | `<h2>` الأسئلة الشائعة / ابدأ الآن | Help + conversion | `<details>` FAQ, `.btn`, gradient CTA | — |
| 10 | Shell (footer) | — | Trust row + nav + social | `partials/footer.html` | — |

> Sections 5 (how-it-works + trust band), 9 (FAQ + CTA) already exist in the current `index.html` and are
> retained/polished. Sections 1 (search), 3, 4, 6, 7, 8 are added or upgraded.

---

## 2. Mock-Content Schemas

### 2.1 Featured Deal — `assets/data/featured.json` (reused; ≥6 items)

Existing schema retained. Each item:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key |
| `type` | `deal` \| `destination` | card flavor |
| `title` | string (ar) | e.g. "عطلة في شرم الشيخ – 4 ليالٍ" |
| `location` | string (ar) | e.g. "شرم الشيخ، مصر" |
| `image` | string | relative path in `assets/images/` |
| `imageAlt` | string (ar) | meaningful alt text |
| `priceFrom` | number | framed "ابتداءً من" — never "live" |
| `currency` | string | e.g. "ر.س" |
| `rating` | number (0–5) | realistic, e.g. 4.7 |
| `reviewsCount` | number | e.g. 248 |
| `source` | `Partner`\|`Affiliate`\|`Manual Deal`\|`API Ready` | source label |
| `badgeClass` | string | `badge-source-*` class |
| `badges` | string[] | e.g. ["موثّق","مميّز"] |
| `cta` | `{ label, kind }` | safe label; `kind=coming-soon` or `quick-view` |

### 2.2 Destination — `assets/data/destinations.json` (NEW; ≥4 items)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key |
| `name` | string (ar) | e.g. "إسطنبول" |
| `country` | string (ar) | e.g. "تركيا" |
| `image` | string | relative SVG placeholder path |
| `imageAlt` | string (ar) | meaningful alt |
| `priceFrom` | number | "ابتداءً من" indicative |
| `currency` | string | e.g. "ر.س" |
| `dealsCount` | number | indicative count, e.g. 38 |

### 2.3 Coupon — `assets/data/coupons.json` (NEW; ≥3 items)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | stable key |
| `title` | string (ar) | e.g. "خصم على رحلات الطيران" |
| `merchant` | string (ar) | partner/source attribution |
| `source` | `Partner`\|`Affiliate`\|`Manual Deal`\|`API Ready` | source label → badge |
| `badgeClass` | string | `badge-source-*` |
| `discountLabel` | string (ar) | e.g. "خصم 15%" |
| `code` | string (Latin/numeric) | copyable, rendered `dir="ltr"` |
| `expiry` | string (ar) | illustrative validity, e.g. "حتى 31 ديسمبر" |
| `terms` | string (ar) | short illustrative terms note |

### 2.4 Testimonial — inline (≥3)

| Field | Type | Notes |
|-------|------|-------|
| `author` | string (ar) | first name + city, e.g. "سارة، الرياض" |
| `rating` | number (0–5) | realistic |
| `quote` | string (ar) | believable short review |
| `avatarInitial` | string | initial for avatar chip (no external image) |

### 2.5 Trusted Partner — inline (≥3)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | partner/source name (Latin ok) |
| `kind` | string (ar) | e.g. "شريك معتمد" |
| `mark` | inline SVG | simple wordmark/icon placeholder, `aria-hidden` decorative + visible text label |

### 2.6 Guide / Tip teaser — inline (≥3)

| Field | Type | Notes |
|-------|------|-------|
| `title` | string (ar) | e.g. "أفضل وقت لزيارة تركيا" |
| `excerpt` | string (ar) | 1–2 sentence SEO-friendly summary |
| `category` | string (ar) | e.g. "نصائح" |
| `image` | string | SVG placeholder |
| `cta` | coming-soon | "اقرأ المزيد" → toast |

---

## 3. Frontend-Only Form Models (not persisted)

### 3.1 Search / Comparison Query

| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| destination | `.field-input` text | non-empty, ≥2 chars | yes |
| dates | `.field-input` (date/month) or select | valid value if provided | no |
| travelers | `.field-select` | one of preset options | no |

On valid submit: `preventDefault` → success toast + inline echo ("نبحث لك عن أفضل العروض إلى **{destination}**
— محرّك المقارنة قيد الإطلاق"). Nothing stored/transmitted.

### 3.2 Price-Alert / Newsletter

| Field | Control | Validation | Required |
|-------|---------|------------|----------|
| email | `.field-input` type=email, `dir="ltr"` | HTML email constraint + non-empty | yes |
| consent (optional) | `.field-check` | must be checked if present | optional |

On valid submit: `preventDefault` → success toast + inline confirmation ("سنرسل لك أفضل العروض — شكراً
لاشتراكك"). Nothing stored/transmitted; UI never claims server-side storage.

---

## 4. Interaction Map (control → existing TUI action)

| Control | Mechanism | Result |
|---------|-----------|--------|
| Mobile menu button | `data-drawer-open="main-nav"` | Opens slide-in drawer (existing) |
| Nav links to unbuilt surfaces | `data-coming-soon` | Info toast "هذه الصفحة قيد الإنشاء" |
| Hero search submit | `data-validate data-frontend-form` (+ `data-success-toast`, `[data-frontend-success]`) | Inline validation → success toast + echo |
| Deal "View Deal" | `data-modal-open="deal-quickview"` | Opens quick-view modal (existing `.modal`) |
| Deal "Request Booking" | `data-coming-soon` | Info toast |
| Destination select | `data-coming-soon` (or modal) | Visible action |
| Coupon "Copy code" | `data-copy="<CODE>"` | Copies + success toast |
| Coupon "Get Coupon" | `data-coming-soon` | Info toast |
| Guide "Read more" | `data-coming-soon` | Info toast |
| Newsletter submit | `data-validate data-frontend-form` | Inline validation → success toast/inline |
| FAQ items | native `<details>`/`<summary>` | Expand/collapse (existing) |
| Footer/year | `data-year` | Current year (existing) |

> The only new wiring token is the opt-in **`data-frontend-form`** (+ optional `data-success-toast` /
> `[data-frontend-success]`), handled by the additive `main.js` enhancement. All others already exist.

---

## 5. Structured Data (JSON-LD)

| Schema | Status | Notes |
|--------|--------|-------|
| `Organization` | reused | from existing `<head>` |
| `WebSite` | reused | with `SearchAction` potential-action (already present) |
| `FAQPage` | **NEW** | `mainEntity` array mirrors the visible FAQ Q&A (≥3) |

`FAQPage` MUST stay in sync with the rendered FAQ content (same questions/answers) to avoid structured-data
mismatch.
