# Contract — `admin/analytics.html` (`admin-analytics`)

Breadcrumb **لوحة الإدارة / التحليلات** · active **التحليلات** · H1 **تحليلات المنصة**. Admin shell; static content; **no chart/table library**; all data illustrative.

## Structure
1. **Header** — H1 + **date-range selector** + **compare-period toggle** + export mock + safe note "البيانات تجريبية وليست تتبعًا مباشرًا".
2. **KPI cards ≥12** — total visitors mock, companies growth, active agencies, booking inquiries, deal clicks, coupon copies, estimated MRR (`ltr`), estimated ARR (`ltr`), churn risk mock, trial conversion mock, integration issues, content views.
3. **Chart-like visuals — 8 (CSS/HTML only)** — companies growth (bars) · subscription distribution (donut/`conic-gradient`) · top destinations (h-bars) · top coupon categories (h-bars) · booking inquiries over time (trend) · revenue estimate (trend/bars) · trial-to-paid conversion (funnel/stacked) · integration health trend (multi-series bars). Each: visible title + "بيانات تجريبية" + an accessible text alternative (visually-hidden summary or `<table>`/`<dl>`).
4. **Tables — 5** — top companies (company, plan, revenue estimate, bookings, deals, status) · top destinations (destination, visits, bookings, coupon copies, trend) · top performing deals (deal, company, clicks, inquiries, conversion estimate) · integration errors (integration, company, issue, severity, action) · high-risk subscriptions (company, risk reason, renewal date, action). Action controls toast. **Anchor `id="integrations"`** on the integration-errors/health section (sidebar deep-link target).
5. **Recommendation cards ≥5** — improve onboarding / follow up trial accounts / review integration issues / promote top destinations / review coupons expiring soon; each action toasts.
6. **Export/report modal** — export CSV · export PDF · schedule report · send to owner email — all mock.
7. **FAQ ≥5** — التحليلات مباشرة؟ / الربط بGoogle Analytics؟ / الإيرادات فعلية؟ / تصدير تقارير حقيقية؟ / متابعة التحويلات لاحقًا؟

## Behavior (admin.js `admin-analytics` controller)
- Date-range selector + compare toggle: change **active state only** + a toast clarifying data is illustrative; **no re-query** (visuals are static).
- Table + insight + recommendation action buttons → toast (mock).
- Export → opens the export/report modal; modal actions toast (no real file/email).

## Honesty
Every KPI/visual/table labelled illustrative; revenue is "estimated mock"; export/schedule/send copy states no real file/report/email; integration health is not a live check.

## Acceptance
≥12 KPIs; **8** CSS visuals (grep: zero chart/table-library refs); 5 tables; ≥5 recommendation cards; export modal; date-range/compare toggle active state; `#integrations` anchor present; FAQ ≥5; renders without JS; no dead control; no browser dialog; no console error; no overflow at 360px.
