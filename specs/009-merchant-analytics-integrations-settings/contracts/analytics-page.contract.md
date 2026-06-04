# Contract: `dashboard/analytics.html` (`merchant-analytics`)

**Feature**: 009 | **Date**: 2026-06-04 | Derives from FR-001…FR-019, FR-050…FR-056; research D1–D4, D11–D13.
This is the **structural + behavioral contract** the page must satisfy. "MUST" = QA-gated.

## A. Shell & document
- `<html lang="ar" dir="rtl" data-page="merchant-analytics">`; own `<head>` from `partials/head.html` conventions; `robots noindex`; Arabic `<title>` + meta description.
- Paths: `../assets/css/tailwind.css`; `../assets/icons/sprite.svg`; `../src/js/ui.js`, `../src/js/main.js`, `../src/js/dashboard.js` (all `defer`); `../pages/deal-details.html?id=`, `deals.html`, `coupons.html` for links.
- Reuses the Spec 006–007 shell (sidebar/topbar/drawer/breadcrumb/page-header/footer + `#toast-root`); sidebar **التحليلات** has `aria-current="page"`; breadcrumb `لوحة التحكم / التحليلات`; **no public header/footer**.
- Exactly one `<h1>` = `التحليلات`. Renders fully with JS disabled. No console errors. No external CDN. No external chart/table library.

## B. Required sections (static HTML)
1. **Page header** — H1; description; date-range selector (اليوم / آخر 7 أيام / آخر 30 يوم / هذا الشهر / آخر 90 يوم / نطاق مخصص + from/to + apply); compare-period toggle; export-report mock button; safe note `البيانات هنا تجريبية ولا تمثل تتبعًا مباشرًا`.
2. **KPI cards ≥10** — each: icon, number, label, trend indicator (up/down + %), helper text, demo label. Required labels: الزيارات، الضغطات على العروض، طلبات الحجز، نسخ الكوبونات، معدل التحويل التقديري، الوجهة الأعلى، الإيراد التقديري، متوسط قيمة الطلب، العملاء الجدد، العروض الأكثر مشاهدة.
3. **Over-time visuals ×4** — booking inquiries, deal clicks, coupon copies, conversion estimate; CSS/HTML bars/sparkline/progress; each bar/point has an accessible text value (not color-only).
4. **Traffic sources ≥8** — Organic Search, Direct, Social, Referral, Coupon pages, Deal pages, Email mock, WhatsApp mock; each: visits + percentage + trend.
5. **Device breakdown** — mobile/desktop/tablet with percentage bars (sum = 100%).
6. **Top-performing-deals table ≥8 rows** — columns: deal title, destination, source badge, views, clicks, inquiries, coupon copies, conversion estimate, status, action. Collapses to stacked labeled cards ≤360px.
7. **Top destinations ≥7** — Dubai, Istanbul, Cairo, Riyadh, Sharm El Sheikh, Paris, Bangkok; each: visits, deal clicks, inquiries, trend, CTA.
8. **Coupon-performance table ≥8 rows** — columns: code (`dir="ltr"`), provider, category, source badge, copies, usage mock, related deal, expiry, status, action.
9. **Customer & booking insights ≥6** — highest-value segment, most-requested type, avg response time mock, follow-up needs, pending payments, family travel trend.
10. **Recommendations ≥6** — each: priority badge, explanation, action button (link to a merchant page or toast).
11. **Export / report mock** — PDF / CSV / schedule report (toasts or a small modal).
12. **Empty + skeleton** — analytics empty state + skeleton KPI/chart/table pattern (hidden by default; not shown in baseline).
13. **FAQ ≥5** — هل التحليلات حقيقية؟ / هل يتم تتبع الزوار الآن؟ / هل يمكن ربط Google Analytics لاحقًا؟ / ما معنى معدل التحويل التقديري؟ / هل يمكن تصدير تقارير حقيقية لاحقًا؟

## C. Behavior (enhancement; via `dashboard.js` `initMerchantAnalytics`)
- Date-range chip click → sets active (`aria-pressed`/active class); non-custom shows a frontend-only toast; **metrics do not silently recompute** (no fake live query).
- نطاق مخصص → reveals from/to + apply; apply validates `from ≤ to` → toast; invalid → inline/toast message.
- Compare toggle → flips visual compare state (`aria-pressed`).
- Export buttons → toast(s) ("تصدير تجريبي — لا يتم إنشاء ملف فعلي").
- Top-deal "view public" → `../pages/deal-details.html?id=<id>`; "manage" → `deals.html`.
- Coupon "copy code" → `copyToClipboard` + toast (graceful fallback if clipboard unavailable); "manage" → `coupons.html`.
- Recommendation action → link or toast. **No dead controls; no browser dialogs.**

## D. Accessibility / honesty / responsive (MUST)
- WCAG 2.1 AA: visible focus, full keyboard operability, `aria-live` on the active-range/compare announcements + any count, `aria-label` on icon-only buttons, AA contrast, ~44px targets, reduced-motion respected.
- 360px: no horizontal overflow; tables → stacked cards; KPI grid + visuals reflow to one column.
- Every metric/table/export surface carries approved frontend-only wording; no claim of real tracking or real export.
