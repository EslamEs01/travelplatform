# Contract — `admin/index.html` (`admin-overview`)

Breadcrumb **لوحة الإدارة / الرئيسية** · active **الرئيسية** · H1 **لوحة تحكم المنصة**. Uses the admin shell (see `admin-shell.contract.md`). All content static; all actions frontend-only.

## Structure (static HTML, renders without JS)
1. **Page header** — H1 + owner-workspace description + **4 quick-action buttons** (إضافة شركة تجريبية / إنشاء خطة / مراجعة الاشتراكات / إدارة المحتوى) + safe note "البيانات والإجراءات هنا تجريبية".
2. **KPI cards ≥10** — total companies, active, trial, suspended, active subscriptions, platform booking requests, total deals, total coupons, estimated MRR (`dir="ltr"`), integration issues, content pending review, trials nearing expiry. Each: label + value + optional delta/trend chip.
3. **Activity feed ≥10** — list items: icon + event text + company/content name + time (`dir="ltr"`) + severity/type badge. Covers register / plan-upgrade / integration-fail / sub-expiring / featured-deal / pending-coupon / content-update / trial-extended / suspended / support-note (all mock).
4. **Top companies ≥8** — table (→ cards ≤640px via `data-label`): company, plan, sub status, deals, bookings, customers, last active, MRR, action menu. Action menu: **view** → `company-details.html?id=<id>`, change-plan, suspend, contact-owner.
5. **Integration health — 8 cards** — Travelpayouts, Booking Affiliate, Coupon API, Email Notifications, WhatsApp, Scraping Review Queue, Amadeus API, Duffel API; each: status badge + affected-companies count + last-check (mock) + action button.
6. **Subscription alerts** — trials ending / past due mock / renewal soon / cancelled mock / plan limit exceeded; each row/card has an action.
7. **Analytics preview — 5 CSS visuals** — companies growth (bars), subscriptions distribution (donut/`conic-gradient`), top destinations (h-bars), booking inquiries over time (trend), estimated MRR trend (trend). Each has an accessible text alternative + "بيانات تجريبية".
8. **Quick admin actions (7)** — add company / create plan / review subscriptions / manage content / view analytics / integration health / export mock — each navigates, opens a modal, or toasts.
9. **Admin notes/tasks checklist (5)** — مراجعة الشركات التجريبية / تحديث الخطط / مراجعة المحتوى المميز / مراجعة مشاكل التكاملات / متابعة اشتراكات قاربت على الانتهاء — checkboxes toggle visibly (session-only).
10. **Empty + skeleton** — at least one widget demonstrates a styled empty state and a skeleton/loading placeholder.

## Behavior (admin.js `admin-overview` controller)
- Quick actions + quick-admin grid: navigate / open modal / `TUI.toast` (export → "لا يتم إنشاء ملف فعلي").
- Top-company row menus via row-action-menu controller; view navigates; change-plan/suspend/contact-owner → modal or toast (suspend uses the shared confirm modal).
- Integration-card + subscription-alert action buttons → toast (mock; no real check/billing).
- Checklist items toggle `checked` + visual state; an `aria-live` summary may announce remaining tasks.

## Honesty
Every KPI/visual labelled illustrative; every action toast/modal states no real effect (suspension/billing/export/check). No claim of live data.

## Acceptance
≥10 KPIs, ≥10 activity items, ≥8 top companies, 8 health cards, alerts, 5 CSS visuals (no chart lib), 7 quick actions, working checklist, empty+skeleton present; renders without JS; no dead control; no browser dialog; no console error; no overflow at 360px.
