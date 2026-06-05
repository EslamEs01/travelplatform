# Contract — `admin/subscriptions.html` (`admin-subscriptions`)

Breadcrumb **لوحة الإدارة / الاشتراكات** · active **الاشتراكات** · H1 **الاشتراكات**. Admin shell; static content; frontend-only; cancel via custom confirm. No real payments/invoices.

## Structure
1. **Header** — H1 + description + CTA "إضافة اشتراك تجريبي" + export mock + safe note "لا توجد مدفوعات أو فواتير حقيقية".
2. **Stats cards — 8** — active subscriptions, trial, past due mock, cancelled mock, renewal this month, MRR estimate (`ltr`), ARR estimate (`ltr`), failed payments mock.
3. **Search + filters + reset** — company, plan, status, billing cycle, renewal date, payment status, trial ending.
4. **Sort (5)** — next renewal, highest amount, newest, past due, trial ending.
5. **Result count + chips** — `aria-live`; removable active-filter chips; reset.
6. **Subscriptions table ≥12 rows** — cols: checkbox, company, plan, amount (`ltr`), billing cycle, status, payment status, next renewal (`ltr`), last payment (`ltr`), trial ends, invoice mock (`ltr`), actions. Collapses to cards ≤640px.
6b. **Empty + skeleton states** — a styled empty state shown when zero subscriptions match the active filters, and a skeleton/loading placeholder (listing-page contract, Constitution VII).
7. **Row actions (8)** — view company (→ `company-details.html?id=`) · change plan · extend trial · mark paid mock · send reminder mock · cancel subscription mock · view invoice mock · download invoice mock.
8. **Bulk actions** — export · send reminders · extend trials · mark review needed · **cancel selected (custom confirm)**.
9. **Modals** — **Subscription detail** (company, plan, amount, renewal, payment status, invoice list, notes) · **Invoice mock** (invoice id `ltr`, company, amount, status, date, line items, download/send mock) · **Extend trial** (company, current trial end, extension days req, reason) · **Cancel subscription (custom confirm)**.
10. **FAQ ≥5** — تحصيل المدفوعات؟ / الفواتير حقيقية؟ / تمديد التجربة؟ / تغيير الخطة؟ / إرسال تذكير حقيقي؟

## Behavior (admin.js `admin-subscriptions` controller)
- Filter/sort/search engine → visible set + `aria-live` count + reset.
- Row menus: view-company navigates; change-plan/extend-trial/detail/invoice open modals; mark-paid/send-reminder/download-invoice toast (mock); cancel → confirm modal → toast (+ optional status flip).
- Bulk: selected count (`aria-live`); cancel-selected → confirm modal; others toast.
- Extend-trial modal validates `extensionDays` (1–90) → toast.

## Honesty
Every amount/invoice labelled mock; mark-paid/send-reminder/download/cancel copy states no real payment/invoice/email/billing.

## Acceptance
≥12 rows; filter+sort+search update the set + count + chips; filtering to zero shows the styled empty state (+ skeleton placeholder present); all 8 row actions resolve; bulk works; detail/invoice/extend-trial modals open; cancel uses a custom confirm; FAQ ≥5; renders without JS; no dead control; no browser dialog; no console error; no overflow at 360px.
