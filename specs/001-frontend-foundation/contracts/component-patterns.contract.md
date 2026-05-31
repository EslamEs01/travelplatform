# Contract: Reusable UI Component Patterns

**Feature**: `001-frontend-foundation` | **Date**: 2026-05-31

Markup/CSS contract for the reusable patterns (see inventory in `data-model.md §2`). Components are Tailwind
`@layer components` classes (semantic, e.g. `.btn`, `.card`) so future pages — and later Django templates —
reuse one stable, backend-ready surface. All examples are RTL-first and AA-compliant.

## Buttons — `.btn`

```html
<button class="btn btn-primary">اطلب الحجز</button>
<button class="btn btn-secondary">عرض التفاصيل</button>
<a class="btn btn-outline" href="…">اكتشف العروض</a>
<button class="btn btn-ghost btn-icon" aria-label="القائمة" data-drawer-open="main-nav"> <svg>…</svg> </button>
<button class="btn btn-primary" aria-busy="true" disabled>…<span class="spinner"></span></button>
```

- Variants: `btn-primary | btn-secondary | btn-outline | btn-ghost | btn-danger`; sizes `btn-sm|btn-lg`.
- MUST be a real `<button>` or `<a>` (never a styled `<div>`). Visible `:focus-visible` ring. Icon-only
  buttons require `aria-label`. Loading uses `aria-busy="true"` + disabled.

## Card — `.card`

```html
<article class="card">
  <img class="card-media" src="../assets/images/sharm.jpg" alt="شاطئ في شرم الشيخ" loading="lazy">
  <span class="badge badge-source-affiliate">Affiliate</span>
  <div class="card-body">
    <h3 class="card-title"><a href="…" data-coming-soon>عطلة في شرم الشيخ – 4 ليالٍ</a></h3>
    <p class="card-meta">شرم الشيخ، مصر · ⭐ 4.6 (128 تقييم)</p>
    <p class="price">ابتداءً من <strong>1,950</strong> ر.س</p>
    <button class="btn btn-primary btn-sm" data-coming-soon>اطلب الحجز</button>
  </div>
</article>
```

- One meaningful heading + link per card; images carry real `alt`; price framed "ابتداءً من" (never "live").

## Badges — `.badge`

- Status: `badge-neutral | badge-success | badge-warning | badge-danger | badge-info`.
- **Source (Principle IX)**: `badge-source-partner | badge-source-affiliate | badge-source-manual |
  badge-source-api-ready` rendering "Partner / Affiliate / Manual Deal / API Ready".
- Verified/featured: `badge-verified` ("موثّق"), `badge-featured` ("مميّز"). Decorative icons `aria-hidden`.

## Modal — `.modal` (APG dialog)

```html
<div class="modal" data-modal="example" role="dialog" aria-modal="true" aria-labelledby="example-title" hidden>
  <div class="modal-overlay" data-modal-close></div>
  <div class="modal-panel">
    <h2 id="example-title" class="modal-title">العنوان</h2>
    <button class="modal-close btn-icon" aria-label="إغلاق" data-modal-close><svg>…</svg></button>
    <div class="modal-body">…</div>
  </div>
</div>
```

## Drawer — `.drawer` (off-canvas, RTL side = start/right)

```html
<div class="drawer drawer-start" data-drawer="main-nav" hidden>
  <div class="drawer-overlay" data-drawer-close></div>
  <nav class="drawer-panel" aria-label="التنقل الرئيسي">
    <button class="drawer-close btn-icon" aria-label="إغلاق" data-drawer-close><svg>…</svg></button>
    <ul>…nav items…</ul>
  </nav>
</div>
```

## Form field — `.field`

```html
<div class="field">
  <label class="field-label" for="email">البريد الإلكتروني</label>
  <input class="field-input" id="email" name="email" type="email" required
         aria-describedby="email-err">
  <p class="field-error" id="email-err" hidden>الرجاء إدخال بريد إلكتروني صحيح.</p>
</div>
```

- States via classes/attrs: `is-valid` / `is-invalid` (+ `aria-invalid="true"`) / `is-success`, `disabled`.
- Every control has a linked `<label>`; error text linked via `aria-describedby` (FR-021, FR-025).

## Skeleton — `.skeleton`

```html
<div class="card" aria-hidden="true">
  <div class="skeleton skeleton-media"></div>
  <div class="card-body"><div class="skeleton skeleton-line w-2/3"></div>…</div>
</div>
```

- Shimmer animation disabled under `prefers-reduced-motion`. Replaced by real content when loaded.

## Empty state — `.empty-state`

```html
<div class="empty-state">
  <svg class="empty-icon" aria-hidden="true">…</svg>
  <h3 class="empty-title">لا توجد عناصر بعد</h3>
  <p class="empty-text">جرّب تعديل البحث أو تصفّح العروض المميزة.</p>
  <button class="btn btn-primary" data-coming-soon>تصفّح العروض</button>
</div>
```

## Toast (rendered by `ui.js`)

```html
<!-- created dynamically inside #toast-root; do not hand-author -->
<div class="toast toast-success" role="status">تم النسخ بنجاح</div>
```

## Cross-cutting acceptance

- Zero forbidden tech; zero `alert()`; zero bare `#` links without a handled action.
- Every component reachable & operable by keyboard with a visible focus indicator.
- Color usage follows the AA pairing rule in `data-model.md §1.4`.
- All patterns demonstrable from `index.html` or a sample page (SC-008).
