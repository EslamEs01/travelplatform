# Contract — Admin Shell (shared across all 7 pages)

**Applies to**: `admin/{index,companies,company-details,plans,subscriptions,analytics,content}.html`

## Document & head
- `<!DOCTYPE html>` · `<html lang="ar" dir="rtl" class="scroll-smooth" data-page="admin-…">` (exact `data-page` per page).
- Own `<head>` from the `partials/head.html` conventions: `meta charset` + viewport; Arabic `<title>` + `<meta name="description">`; `meta theme-color`; **`<meta name="robots" content="noindex">`**; favicon `../assets/icons/favicon.svg`; Cairo font preload `../assets/fonts/cairo-600.woff2`; **`<link rel="stylesheet" href="../assets/css/tailwind.css">`**; a `BreadcrumbList` JSON-LD. **Must NOT** inline `partials/header.html`/`footer.html`.
- Exactly **one `<h1>`** per page (the page header title); correct heading hierarchy below it.

## Visual identity (distinct from merchant)
- Page-scoped `<style>` defines `.admin-*` classes + CSS vars; sidebar rail is dark **`ink`** (`--admin-sidebar-bg`≈`#161C26`/near-black) with a **gold `sunset`** active/accent (`--admin-sidebar-active`≈`#E08D12`); brand label reads **"مالك المنصة · Owner Admin"**. No new tokens; no merchant `.dash-*` reuse verbatim.

## Required regions (in order)
1. **Sidebar** (`<aside>`, RTL, off-canvas drawer ≤`lg`, fixed ≥`lg`): brand; nav `<ul>` with the items + targets in the table below; the active item has `aria-current="page"`. Back-to-site + merchant-dashboard links at the foot.
2. **Topbar** (`<header>`): menu button (`data-drawer-open="admin-sidebar"`, `aria-label`, ≥`44px`); optional search; **notifications dropdown**, **admin user-menu dropdown**, **quick-action dropdown** (each: button with `aria-haspopup`/`aria-expanded` + a `[role="menu"]`).
3. **Scrim** for the drawer (`data-drawer-close`).
4. **Breadcrumb** (`<nav aria-label>` → `<ol>`): trail per page; last crumb `aria-current="page"`.
5. **Page header**: H1 + description + page actions + a visible honesty note.
6. **Main content** (page-specific).
7. **Footer** (small): copyright/year (`data-year`) + a "بيانات تجريبية / واجهة أمامية فقط" line.
8. **`#toast-root`** present once (for `TUI.toast`).

## Sidebar nav (items → targets, active per page)
| Item | Target | Active on |
|---|---|---|
| الرئيسية | `index.html` | admin-overview |
| الشركات | `companies.html` | admin-companies, admin-company-details |
| الخطط | `plans.html` | admin-plans |
| الاشتراكات | `subscriptions.html` | admin-subscriptions |
| التحليلات | `analytics.html` | admin-analytics |
| المحتوى | `content.html` | admin-content |
| مراقبة التكاملات | `analytics.html#integrations` | — |
| الإعدادات | coming-soon toast (`data-coming-soon`) | — |
| العودة للموقع | `../pages/index.html` | — |
| لوحة الشركات | `../dashboard/index.html` | — |

## Scripts (bottom, `defer`, in order)
`../src/js/ui.js` → `../src/js/main.js` → `../src/js/admin.js`. No inline page JS except JSON-LD.

## Behavior (admin.js shell init — runs on every admin page)
- Drawer open/close (menu button, Esc, scrim, `data-drawer-close`); `body` scroll-lock while open; focus moves into the drawer and returns to the trigger on close.
- Three topbar dropdowns via `DropdownController` (Esc + outside-click close; one open at a time; roving focus).
- `الإعدادات` → coming-soon toast; no bare `#` link anywhere.

## Accessibility & responsive
- All interactive elements keyboard-reachable with visible focus; icon-only buttons have `aria-label`; ≥`44px` touch targets; `prefers-reduced-motion` respected.
- ≤`640px`: sidebar is a drawer; no horizontal overflow at 360px; topbar condenses (search may collapse to an icon).

## Acceptance
- Renders standalone (no backend, no JS errors); shell + correct active item + breadcrumb on all 7 pages; visually distinct from `../dashboard/index.html` side-by-side; drawer + 3 dropdowns operable at 360px; zero forbidden tech; honest footer/notes present.
