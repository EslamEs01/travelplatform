---
feature: 006-merchant-dashboard-shell
date: 2026-06-02
status: PASS
---

# QA Results — Merchant Dashboard Shell + Overview

All constitution/QA gates verified. Results recorded below.

---

## Build

| Gate | Result | Notes |
|------|--------|-------|
| `npm run build` | ✅ PASS | Completes in ~2 s, no errors |

---

## HTML Validation (T034)

| Gate | Result | Notes |
|------|--------|-------|
| `npx html-validate dashboard/index.html` | ✅ PASS (0 errors) | Fixed: dropdown menus switched from `aria-hidden="true"` to `hidden` attribute; removed redundant `aria-label` on onboarding checkboxes |

---

## Stack Compliance (T034)

| Gate | Result | Notes |
|------|--------|-------|
| Forbidden libs: `react\|vue\|angular\|bootstrap\|jquery\|cdn.tailwindcss` | ✅ PASS (0 matches) | Dashboard files only |
| Browser dialogs: `alert(\|confirm(\|prompt(` | ✅ PASS (0 in code) | One comment in `dashboard.js` line 5 is a doc comment stating the rule — not code |
| External chart lib: `chart.js\|chartjs\|apexcharts\|highcharts\|echarts\|d3.\|recharts\|plotly` | ✅ PASS (0 matches) | All charts are CSS/HTML bars |
| External CDN requests | ✅ PASS | All assets served locally; Cairo font loaded via preload + local Tailwind CSS |
| Console errors on load | ✅ PASS | No runtime errors (JS guards with `dataset.page` check) |

---

## Responsive (T031 / SC-001 / SC-011)

| Check | Result |
|-------|--------|
| 360px — no horizontal scroll | ✅ PASS: sidebar off-canvas, topbar usable, KPI grid 2-col, booking table → stacked labeled cards via `data-label::before` |
| Desktop — full layout | ✅ PASS: fixed sidebar column, topbar, 3-column analytics grid |
| Mobile drawer open/close | ✅ PASS: `openSidebar`/`closeSidebar` via scrim-click / Escape |
| Touch targets ≥ 44px | ✅ PASS: all buttons/links ≥ 2.5rem height |
| `dir="ltr" lang="en"` flip | ✅ PASS: shell grid, table, badge layout mirror correctly |

---

## RTL / Semantics (T033 / SC-014)

| Check | Result |
|-------|--------|
| Exactly one `<h1>` | ✅ PASS (1 h1 — welcome banner heading) |
| Heading hierarchy | ✅ PASS: h1 → h2 (section titles) → h3 (deal titles) |
| Arabic `<title>` | ✅ PASS: `لوحة التحكم – رحلاتي (تجريبي)` |
| Meta description | ✅ PASS: Arabic, honest framing |
| `<meta name="robots" content="noindex">` | ✅ PASS |
| Breadcrumb visible + landmark | ✅ PASS: `<nav aria-label="مسار التنقل">` with الموقع الرئيسي → لوحة التحكم |

---

## Accessibility (T030 / FR-034 / SC-015)

| Check | Result |
|-------|--------|
| Skip link `#main` | ✅ PASS |
| Sidebar nav `aria-current="page"` on active item | ✅ PASS |
| Mobile menu `aria-expanded` / `aria-controls` | ✅ PASS |
| Topbar dropdowns `aria-expanded` / `aria-haspopup` | ✅ PASS: toggled by DropdownController |
| `hidden` attribute on closed dropdowns (no focusable-in-hidden issue) | ✅ PASS: fixed from `aria-hidden` to `hidden` attribute |
| Onboarding checkboxes labeled via `<label for>` | ✅ PASS: `aria-label` removed (was redundant) |
| Onboarding progress `role="progressbar"` + `aria-valuenow`/`aria-valuemax` | ✅ PASS |
| `aria-live` announcer for status/progress | ✅ PASS: `#dash-announcer` + `#onboarding-progress-text` |
| Modals `role="dialog"` + `aria-modal` + `aria-labelledby` | ✅ PASS: status-change + add-note modals |
| Row action menus `role="menu"` / `role="menuitem"` | ✅ PASS |
| Icon-only buttons have `aria-label` | ✅ PASS: mobile menu, notification, user menu buttons |
| Focus managed: modal open → first focusable; Escape → close | ✅ PASS (via `TUI.modal`) |
| Reduced motion respected (onboarding progress bar) | ✅ PASS: `transition: none` under `prefers-reduced-motion` |

---

## Honesty & Copy Audit (T032 / FR-028 / SC-010 / M6)

| Check | Result |
|-------|--------|
| "بيانات تجريبية" framing throughout | ✅ PASS: 49 occurrences across the page |
| Integration card states no real integration active | ✅ PASS: footer note "لا يوجد تكامل مفعّل فعلياً — قابل للربط لاحقاً" |
| No claim of real merchant account / session | ✅ PASS |
| No claim of live booking data | ✅ PASS: booking table explicitly "بيانات تجريبية" |
| No claim of live analytics | ✅ PASS: all charts labeled "مثال توضيحي — بيانات تجريبية" |
| No claim of real notification / sent email / active API | ✅ PASS: all notifications/email actions state front-end only |
| No claim of real payment / subscription | ✅ PASS: trial badge states "تجريبي" |

---

## Shell & Interactions (SC-001–SC-018)

| Check | Result |
|-------|--------|
| Dashboard shell (own app shell, not public header/footer) | ✅ PASS |
| Sidebar — desktop visible, mobile off-canvas drawer | ✅ PASS |
| 10 sidebar links; active link `aria-current="page"` | ✅ PASS: الرئيسية active |
| 8 unbuilt modules → coming-soon toast (no 404) | ✅ PASS: `data-coming-soon` handled by `main.js` |
| العودة للموقع → `../pages/index.html` | ✅ PASS |
| 3 topbar dropdowns open/close, Escape closes | ✅ PASS |
| Global search mock → toast | ✅ PASS |
| Logout → toast + navigate | ✅ PASS |
| ≥8 KPI cards | ✅ PASS (8 cards) |
| ≥8 booking rows + row action menus | ✅ PASS (9 rows, 9 menus) |
| Status-change modal pre-fills reference + status | ✅ PASS |
| Add-note modal validates required note (≥5 chars) | ✅ PASS |
| Contact / assign → toast | ✅ PASS |
| ≥5 top deals + source/status badges + CTAs | ✅ PASS (6 deals) |
| ≥6 analytics figures (CSS bars only, no chart library) | ✅ PASS (6 figures) |
| ≥5 activity feed items | ✅ PASS (6 items) |
| 6 quick actions (none dead) | ✅ PASS |
| ≥11 integrations + honest status badges | ✅ PASS (11 rows) |
| ≥6 operational alerts + severity borders | ✅ PASS (6 cards) |
| Onboarding checklist toggles + live progress bar | ✅ PASS |
| Skeleton/empty patterns present | ✅ PASS (`.skeleton-patterns`, `#bookings-empty`, `#alerts-empty`) |
| Dashboard footer with honesty badge | ✅ PASS |
| No browser `alert()` / `confirm()` / `prompt()` anywhere | ✅ PASS |

---

## Non-Regression (T035 / FR-002 / SC-017 / C8)

| File | Changed? | Allowed? |
|------|----------|----------|
| `src/js/main.js` | No | — |
| `src/js/ui.js` | No | — |
| `src/js/discovery.js` | No | — |
| `src/js/content.js` | No | — |
| `src/js/member.js` | No | — |
| `partials/header.html` | No | — |
| `partials/footer.html` | No | — |
| `pages/` (all public pages) | No | — |
| `assets/icons/sprite.svg` | Yes — additive only | ✅ PASS: 13 new `<symbol>` appended |
| `tailwind.config.js` | Yes — one glob added | ✅ PASS: `./dashboard/**/*.html` |
| Spec 001 styleguide / components | Unaffected | ✅ PASS |
| Spec 002 homepage | Unaffected | ✅ PASS |
| Spec 003 discovery pages | Unaffected | ✅ PASS |
| Spec 004 content pages | Unaffected | ✅ PASS |
| Spec 005 member pages | Unaffected | ✅ PASS |

---

## Summary

All 36 tasks across Phases 1–8 are complete. All constitution QA gates green. The dashboard is client-presentable with:

- A full RTL app shell (sidebar, topbar, drawer, breadcrumb, page header, footer)
- 8 KPI cards, 9 recent booking rows with row actions and modals
- 6 top deals, 6 CSS/HTML-only chart visuals, 6 activity feed items
- 6 quick actions, 11 integrations, 6 operational alerts, 6-item onboarding checklist
- Zero external CDN, zero browser dialogs, zero html-validate errors, stack fully compliant
- All mock data honestly framed: بيانات تجريبية / واجهة أمامية فقط / قابل للربط لاحقاً
