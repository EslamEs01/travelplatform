# Contract — `admin/companies.html` + `admin/company-details.html`

Both use the admin shell; both active **الشركات**. All content static; all actions frontend-only; all destructive actions via custom confirm modals; "Login as company" always disabled/safe.

---

## A) `companies.html` (`admin-companies`) · breadcrumb لوحة الإدارة / الشركات · H1 الشركات

### Structure
1. **Header** — H1 + description + CTA "إضافة شركة تجريبية" + export mock + safe note "لا يتم إنشاء أو تعديل شركات حقيقية في هذه النسخة".
2. **Stats cards ≥8** — total / active / trial / suspended mock / past due mock / enterprise / new this month / needs review.
3. **Search + 8 filters + reset** — search (company/owner/email); filters: plan, subscription status, company status, country, activity, integration status, trial ending.
4. **Sort (6)** — الأحدث / آخر نشاط / الأعلى طلبات / الأعلى إيرادًا تقديريًا / قاربت التجربة على الانتهاء / حسب الخطة.
5. **Result count + active chips + reset** — `aria-live="polite"` count; each chip removable; reset clears all.
6. **Companies table ≥12 rows** — cols: checkbox, company name, owner, email (`dir="ltr"`), country, plan, subscription status, company status, deals count, booking inquiries, last active, MRR mock, actions. Collapses to stacked cards ≤640px (`data-label`). Each row carries the filter/sort `data-*` (see data-model §1.1).
7. **Row actions** — View → `company-details.html?id=<id>` · Change plan · Suspend/reactivate · Extend trial · Add admin note · Contact owner (toast) · **Login as company (disabled/safe)**.
8. **Bulk actions** — select-all + selected count (`aria-live`) + change plan / extend trial / export / add note / **suspend selected (custom confirm)**.
9. **Modals** — Add Company (companyName req, ownerName req, ownerEmail req `dir="ltr"`, phone, country, city, plan, trial days, notes) · Change Plan (company, current plan, new plan, billing cycle, reason) · Suspend/Reactivate (reason, notify-owner placeholder) · Add Admin Note (company, note req, type, follow-up date).
10. **Segment cards (7)** — Trials ending / Past due / Enterprise / Needs review / High usage / No activity / Integration issues → apply preset filter.
11. **Empty + skeleton states.**
12. **FAQ ≥5** — هل يتم إنشاء شركة حقيقية؟ / تغيير الخطة فعليًا؟ / إيقاف شركة؟ / الدخول كشركة؟ / إرسال إشعار للمالك؟ (all answered: no, frontend-only).

### Behavior
Filter/sort/search engine drives the table + count + chips + segments + empty state. Row menus open the right modal/toast; login-as → safety modal/toast (impersonation inactive). Add-company validates (req + email) → toast + optional prepended mock row. Change-plan/suspend/add-note → toast (suspend may update the status badge). Bulk suspend → confirm modal showing the selected count → toast. Export → toast (no file).

---

## B) `company-details.html` (`admin-company-details`) · breadcrumb لوحة الإدارة / الشركات / تفاصيل الشركة · H1 تفاصيل الشركة

Renders a complete **default mock company** from static HTML — works **with or without** `?id=<company-id>` (id MAY be reflected in labels; never a fetch dependency).

### Structure
1. **Profile header** — name + company-status badge + plan badge + owner + email (`ltr`) + phone (`ltr`) + country/city + website (`ltr`) + last active; **actions**: change plan, suspend/reactivate, extend trial, add note, contact owner, **login-as (disabled/safe)**, back-to-companies.
2. **Frontend-only note** — "هذا ملف شركة تجريبي / لا يتم تنفيذ تغييرات حقيقية".
3. **Subscription summary** — current plan, billing cycle, amount (`ltr`), subscription status, next renewal, trial ends, payment status mock, plan-usage summary, upgrade/downgrade mock action.
4. **Usage limits ≥8 bars** — deals, coupons, team users, integrations, booking inquiries, customers, storage placeholder, content pages; each shows used / limit / % + a **near-limit warning** treatment + accessible label.
5. **Activity timeline ≥10** — deal created / booking request / coupon created / integration configured / note added / plan changed mock / payment status updated mock / login mock / content updated / API test failed mock.
6. **Top deals** — table/list: deal title, destination, clicks, inquiries, coupon copies, status, action (→ `../pages/deal-details.html?id=`).
7. **Booking stats — 7 cards** — total requests, new, confirmed mock, pending payment, cancelled, average amount, top destination.
8. **Integration status — 8 rows** — Travelpayouts/Booking Affiliate/Coupon API/Email/WhatsApp/Scraping Queue/Amadeus/Duffel; each status + action.
9. **Billing timeline** — mock invoices/payments: invoice id (`ltr`), date, amount (`ltr`), status, actions view/download/send (toast). No real billing.
10. **Admin notes** — list + add-note form/modal.
11. **Support/follow-up panel** — priority, next follow-up date, assigned admin, issue summary, action buttons.
12. **Action modals (7)** — change plan · suspend/reactivate confirm · extend trial · add note · contact owner (toast) · **reset usage confirm** · **login-as safety modal**.
13. **FAQ ≥5** — تغيير الخطة فعليًا؟ / الفواتير حقيقية؟ / الدخول كالشركة؟ / إيقاف الشركة فعليًا؟ / بيانات الاستخدام مباشرة؟

### Behavior
All header/timeline/modal actions resolve to a modal or toast; reset-usage + suspend use confirm modals; invoice actions toast (no real invoice/file/email); login-as opens the safety modal. Near-limit bars render a warning state from `used/limit`.

## Acceptance (both)
Companies: ≥12 rows, filter narrows + `aria-live` count + chips + reset works, all row/bulk menus resolve, bulk-suspend confirm, 4 modals validate/toast, 7 segments filter, login-as disabled/safe, FAQ ≥5. Details: complete with/without `?id=`, ≥8 usage bars (warnings), ≥10 timeline, billing/integration/support sections, 7 modals incl. reset-usage + login-as safety. Both: render without JS; no dead control; no browser dialog; no console error; no overflow at 360px; honest copy throughout.
