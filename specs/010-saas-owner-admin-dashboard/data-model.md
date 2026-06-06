# Phase 1 Data Model — SaaS Owner Admin Dashboard (Spec 010)

Backend-ready mock shapes (mirrored 1:1 by static HTML — D5), the per-page section inventory with minimum counts, and the interaction/form maps. All values are believable mock; statuses are mock labels; nothing is live (D10).

---

## 1. Entities & JSON schemas

### 1.1 Company — `admin-companies.json` (array, **≥12**)

```jsonc
{
  "id": "co-014",                       // stable; used by company-details.html?id=
  "companyName": "وكالة الأفق للسياحة",
  "ownerName": "سارة مثال",
  "ownerEmail": "owner@ofok-travel.example",   // dir="ltr" in UI
  "phone": "+9665XXXXXXX",                       // dir="ltr"
  "country": "السعودية",
  "city": "الرياض",
  "website": "https://ofok-travel.example",      // dir="ltr"
  "plan": "Pro",                          // Starter | Growth | Pro | Enterprise (→ admin-plans.json id)
  "subscriptionStatus": "Active",         // Active | Trial | Past Due mock | Cancelled mock | Expiring Soon | Manual Review
  "companyStatus": "Active",              // Active | Trial | Suspended mock | Past Due mock | Cancelled mock | Pending Review
  "dealsCount": 42,
  "couponsCount": 18,
  "bookingRequests": 137,                 // self-sufficient (merchant-bookings/customers catalogs absent — D11)
  "customersCount": 96,
  "integrationsEnabled": ["travelpayouts", "booking-affiliate", "coupon-api"],
  "lastActive": "2026-06-04T09:12:00Z",   // dir="ltr" date in UI; also data-last-active for sort
  "trialEndsAt": null,                    // ISO date or null; drives "trial ending" segment
  "monthlyRevenueMock": 149,              // MRR contribution estimate (currency in UI, dir="ltr")
  "usageLimits": {                        // used vs limit per dimension (company-details bars)
    "deals":   { "used": 42,  "limit": 100 },
    "coupons": { "used": 18,  "limit": 50 },
    "teamUsers": { "used": 4, "limit": 10 },
    "integrations": { "used": 3, "limit": 8 },
    "bookingInquiries": { "used": 137, "limit": 500 },
    "customers": { "used": 96, "limit": 1000 },
    "storage": { "used": 1.2, "limit": 5, "unit": "GB" },   // placeholder
    "contentPages": { "used": 7, "limit": 20 }
  },
  "recentActivity": [ { "type": "deal-created", "text": "أضافت عرضًا جديدًا", "ref": "deal-031", "time": "…" } ],
  "adminNotes": [ { "text": "متابعة ترقية الخطة", "type": "follow-up", "author": "Owner", "followUpAt": "2026-06-10", "createdAt": "…" } ]
}
```

**Derived UI attributes** (for the filter/sort engine — D7): each company row/card carries `data-id`, `data-name`, `data-owner`, `data-email`, `data-plan`, `data-sub-status`, `data-company-status`, `data-country`, `data-activity` (active|idle|none), `data-integration` (ok|issues), `data-trial-ending` (true|false), `data-mrr`, `data-last-active`, `data-deals`, `data-bookings`.

### 1.2 Plan — `admin-plans.json` (array of **4**: Starter, Growth, Pro, Enterprise)

```jsonc
{
  "id": "pro",
  "name": "Pro",
  "monthlyPrice": 149, "yearlyPrice": 1490,        // currency + dir="ltr" in UI
  "description": "للوكالات المتنامية التي تحتاج تكاملات وتحليلات أعمق.",
  "targetUser": "وكالات متوسطة",
  "activeCompanies": 38,                            // count of companies on this plan
  "dealsLimit": 100, "couponsLimit": 50, "teamUsers": 10,
  "bookingInquiries": 500, "customersLimit": 1000, "integrationsLimit": 8,
  "analyticsLevel": "متقدم",                        // أساسي | متقدم | كامل
  "AIRecommendations": false,                       // placeholder flag
  "scrapingReviewQueue": true,
  "supportLevel": "أولوية",                         // قياسي | أولوية | مخصص
  "customDomain": false,                            // placeholder flag
  "status": "Active"                                // Active | Disabled mock
}
```

Plus a **comparison matrix** block (≥14 feature rows × 4 plans) — either embedded per-plan or as a `comparison` object keyed by feature → `{starter, growth, pro, enterprise}` value (number | "—" | "✓" | text). Feature rows: deals, coupons, team users, booking inquiries, customers, integrations, analytics, content pages, AI recommendations (placeholder), scraping review, support, custom domain, white-label (placeholder), API access (placeholder).

### 1.3 Subscription — `admin-subscriptions.json` (array, **≥12**) + `stats`

```jsonc
{
  "id": "sub-014",
  "company": "co-014",                    // → admin-companies.json id (display companyName)
  "plan": "Pro",
  "amount": 149, "billingCycle": "monthly",   // monthly | yearly
  "status": "Active",                     // Active | Trial | Past Due mock | Cancelled mock | Expiring Soon | Manual Review
  "paymentStatus": "Paid mock",           // Paid mock | Pending mock | Failed mock | N/A
  "nextRenewal": "2026-07-01",            // dir="ltr"
  "lastPayment": "2026-06-01",
  "trialEndsAt": null,
  "invoiceMockId": "INV-2026-0114",       // dir="ltr"
  "notes": "تجديد تلقائي تجريبي"
}
```

`stats`: `{ active, trial, pastDue, cancelled, renewalsThisMonth, mrrEstimate, arrEstimate, failedPayments }`. Row `data-*`: `data-company`, `data-plan`, `data-status`, `data-cycle`, `data-payment`, `data-renewal`, `data-trial-ending`, `data-amount`.

### 1.4 Invoice (mock) — embedded in subscription/company-details billing timeline

```jsonc
{ "id": "INV-2026-0114", "company": "co-014", "date": "2026-06-01", "amount": 149,
  "status": "Paid mock", "lineItems": [ { "label": "اشتراك Pro — شهري", "amount": 149 } ] }
```

No real generation/file/payment — view/download/send are toasts (D8).

### 1.5 Integration Health — `admin-integration-health.json` (array of **8**)

```jsonc
{ "id": "travelpayouts", "name": "Travelpayouts", "category": "affiliate",
  "status": "healthy",                    // healthy | degraded | down | not-configured (mock)
  "affectedCompanies": 0, "lastCheck": "2026-06-05T06:00:00Z",   // mock — no real check (D9/IX)
  "severity": "info",                     // info | warning | critical
  "errors": [ { "company": "co-031", "issue": "مفتاح API منتهٍ (تجريبي)", "severity": "warning" } ] }
```

The 8: Travelpayouts, Booking Affiliate, Coupon API, Email Notifications, WhatsApp, Scraping Review Queue, Amadeus API, Duffel API. Shared by overview (health cards), analytics (health trend + integration-errors table), and company-details (per-company integration rows).

### 1.6 Content Item — `admin-content.json` (object keyed by tab)

```jsonc
{
  "homepageSections": [ { "id":"hero","name":"hero","status":"Published mock","itemCount":1,"lastUpdated":"…","featuredOrder":1 } ],   // hero, featured deals, destinations teaser, coupons teaser, guides teaser, testimonials, final CTA
  "destinations": [ { "id":"dest-dubai","destination":"دبي","region":"الخليج","status":"Published mock","relatedDeals":12,"relatedArticles":3,"featured":true,"lastUpdated":"…" } ],  // ids → destinations-full.json
  "blogPosts": [ { "id":"art-007","title":"…","category":"أدلة","author":"فريق التحرير","status":"Draft mock","readingTime":"6 د","relatedDestination":"دبي","lastUpdated":"…" } ], // ids → articles.json
  "featuredDeals": [ { "id":"deal-031","deal":"…","company":"co-014","destination":"دبي","status":"Featured mock","featuredPosition":1,"expiry":"…" } ],  // ids → deals.json/merchant-deals.json
  "featuredCoupons": [ { "id":"cpn-022","code":"FLY25","provider":"…","discount":"25%","status":"Active mock","expiry":"…","featured":true } ],  // code dir="ltr"; ids → merchant-coupons.json
  "pendingReview": [ { "type":"coupon","title":"…","source":"مستورد","reason":"بحاجة مراجعة","submittedBy":"نظام","date":"…","status":"Pending Review" } ],
  "stats": { "blogPosts":24,"destinations":18,"featuredDeals":12,"featuredCoupons":9,"homepageSections":7,"drafts":5,"pendingReview":4,"published":52 }
}
```

Each item carries `status`, `author` (where applicable), `lastUpdated`, and a `featured` flag (FR-067).

### 1.7 Platform Analytics Snapshot — `admin-platform-analytics.json`

```jsonc
{
  "kpis": [ { "key":"totalVisitors","label":"إجمالي الزوار (تجريبي)","value":128400,"delta":"+12%","trend":"up" } ],  // ≥12
  "series": {
    "companiesGrowth": [ { "label":"يناير","value":18 }, … ],
    "subscriptionDistribution": [ { "label":"Pro","value":38,"pct":34 }, … ],   // donut
    "topDestinations": [ { "destination":"دبي","value":4200 }, … ],
    "topCouponCategories": [ { "label":"طيران","value":31 }, … ],
    "bookingInquiriesOverTime": [ { "label":"أسبوع 1","value":210 }, … ],
    "revenueEstimate": [ { "label":"يناير","value":4200 }, … ],
    "trialToPaid": [ { "label":"تجربة","value":100 }, { "label":"مدفوع","value":42 } ],   // funnel/stacked
    "integrationHealthTrend": [ { "label":"يناير","healthy":7,"issues":1 }, … ]
  },
  "tables": {
    "topCompanies": [ … ], "topDestinations": [ … ], "topDeals": [ … ],
    "integrationErrors": [ … ], "highRiskSubscriptions": [ … ]
  },
  "recommendations": [ { "title":"تحسين الإعداد الأولي","body":"…","action":"…" } ]   // ≥5
}
```

### 1.8 Overview summary — `admin-overview.json`

```jsonc
{
  "kpis": [ … ],                          // ≥10 (see §2.1)
  "activity": [ { "type":"company-registered","icon":"icon-building","text":"…","name":"…","time":"…","badge":"new" } ],  // ≥10
  "topCompanies": [ … ],                  // ≥8 (subset/sorted from admin-companies.json)
  "subscriptionAlerts": { "trialsEnding":[…], "pastDue":[…], "renewalSoon":[…], "cancelled":[…], "planLimitExceeded":[…] },
  "previews": { "companiesGrowth":[…], "subscriptionDistribution":[…], "topDestinations":[…], "bookingInquiries":[…], "mrrTrend":[…] },  // 5 CSS visuals
  "checklist": [ { "id":"review-trials","label":"مراجعة الشركات التجريبية","done":false }, … ]   // 5
}
```

### 1.9 Admin Note / Task — embedded (company.adminNotes, overview.checklist)

`{ text, type (follow-up|warning|info), author, followUpAt, createdAt, done? }` — session-only (D10).

---

## 2. Page / section inventory (minimum counts)

### 2.1 `index.html` — `admin-overview` · breadcrumb لوحة الإدارة / الرئيسية · active الرئيسية
1. **Header** — H1 "لوحة تحكم المنصة" + description + **4 quick actions** (إضافة شركة تجريبية / إنشاء خطة / مراجعة الاشتراكات / إدارة المحتوى) + safe note "البيانات والإجراءات هنا تجريبية".
2. **KPI cards ≥10** — total/active/trial/suspended companies, active subscriptions, platform booking requests, total deals, total coupons, estimated MRR, integration issues, content pending review, trials nearing expiry.
3. **Activity feed ≥10** — icon + text + company/content name + time + severity/type badge.
4. **Top companies ≥8** — table/list: company, plan, sub status, deals, bookings, customers, last active, MRR, action menu (view→`company-details.html?id=` / change-plan / suspend / contact-owner).
5. **Integration health 8 cards** — status + affected-companies + last-check + action.
6. **Subscription alerts** — trials ending / past due / renewal soon / cancelled / plan-limit-exceeded, each with an action.
7. **Analytics preview — 5 CSS visuals** — companies growth, subscriptions distribution, top destinations, booking inquiries over time, MRR trend.
8. **Quick admin actions (7)** — add company / create plan / review subscriptions / manage content / view analytics / integration health / export mock.
9. **Admin notes/tasks checklist (5)** — toggdle visually.
10. **Empty + skeleton** patterns for widgets.

### 2.2 `companies.html` — `admin-companies` · breadcrumb لوحة الإدارة / الشركات · active الشركات
Header (CTA add + export mock + safe note) · **stats ≥8** · **search + 8 filters + reset** · **6-option sort** · **result count + chips + reset (aria-live)** · **table ≥12 rows** (13 cols incl. checkbox + actions; email `dir="ltr"`; table→cards ≤640px) · **row actions** (view / change-plan / suspend-reactivate / extend-trial / add-note / contact-owner / **login-as disabled-safe**) · **bulk actions** (select-all + count + change-plan / extend-trial / export / add-note / **suspend-selected confirm**) · **modals**: add-company, change-plan, suspend/reactivate (reason + notify placeholder), add-note · **7 segment cards** (trials ending / past due / enterprise / needs review / high usage / no activity / integration issues) → filter · empty + skeleton · **FAQ ≥5**.

### 2.3 `company-details.html` — `admin-company-details` · breadcrumb لوحة الإدارة / الشركات / تفاصيل الشركة · active الشركات
Profile header (name, status badge, plan badge, owner, email`ltr`, phone`ltr`, country/city, website`ltr`, last active) + **7 actions** (change-plan / suspend-reactivate / extend-trial / add-note / contact-owner / **login-as disabled-safe** / back) · frontend-only note · subscription summary (plan, cycle, amount, status, next renewal, trial ends, payment status, usage summary, upgrade/downgrade mock) · **usage bars ≥8** (used/limit/% + near-limit warning) · **activity timeline ≥10** · top-deals table (→ deal-details) · **booking-stats 7 cards** · **integration rows 8** · **billing timeline** (invoice id`ltr`/date/amount/status + view/download/send) · admin notes + add-note · **support/follow-up panel** (priority, next follow-up, assigned admin, issue summary, actions) · **7 modals** (change-plan / suspend-reactivate / extend-trial / add-note / contact-owner / reset-usage confirm / login-as safety) · **FAQ ≥5**. Works with/without `?id=` (default mock).

### 2.4 `plans.html` — `admin-plans` · breadcrumb لوحة الإدارة / الخطط · active الخطط
Header (CTA create + **monthly/yearly toggle** + safe note) · **4 plan cards** (price m/y, description, target user, active-companies, full limit/feature set, status, actions: edit / duplicate / disable-enable / view-companies) · **comparison table ≥14 rows × 4** · **create/edit modal** (validated) · **duplicate** (toast or pre-filled modal) · **disable confirm** (companies-not-affected warning) · **companies-on-plan preview** (company/status/renewal/usage/action) · **FAQ ≥5**.

### 2.5 `subscriptions.html` — `admin-subscriptions` · breadcrumb لوحة الإدارة / الاشتراكات · active الاشتراكات
Header (CTA add + export mock + safe note) · **stats 8** (incl. MRR/ARR estimate, failed payments) · search + filters + reset · **5-option sort** · result count · **table ≥12 rows** (12 cols; invoice id`ltr`; amount`ltr`) · **8 row actions** (view-company / change-plan / extend-trial / mark-paid / send-reminder / cancel / view-invoice / download-invoice) · **bulk** (export / send-reminders / extend-trials / mark-review / **cancel-selected confirm**) · **modals**: subscription detail, invoice mock (line items), extend-trial, **cancel confirm** · **FAQ ≥5**.

### 2.6 `analytics.html` — `admin-analytics` · breadcrumb لوحة الإدارة / التحليلات · active التحليلات
Header (date-range selector + compare toggle + export mock + safe note "البيانات تجريبية وليست تتبعًا مباشرًا") · **KPI cards ≥12** · **8 CSS visuals** (companies growth / subscription distribution / top destinations / top coupon categories / booking inquiries over time / revenue estimate / trial-to-paid / integration health trend) · **5 tables** (top companies / top destinations / top deals / integration errors / high-risk subscriptions) with action toasts · **recommendation cards ≥5** · **export/report modal** (CSV / PDF / schedule / send-to-owner — mock) · **FAQ ≥5**. Anchor `#integrations` targets the integration-errors/health section (sidebar deep-link).

### 2.7 `content.html` — `admin-content` · breadcrumb لوحة الإدارة / المحتوى · active المحتوى
Header (CTA create + export mock + safe note) · **content stats 8** · **6 tabs** (Homepage Sections / Destinations / Blog Posts / Featured Deals / Featured Coupons / Pending Review) — **all panels in DOM** · Homepage tab (**7 sections** + edit/reorder/preview) · Destinations / Blog / Featured Deals / Featured Coupons tables · Pending Review (type/title/source/reason/submittedBy/date + approve/reject/edit/add-note) · **create/edit modal** (validated) · **feature/unfeature toggle** · **publish/unpublish + delete confirms** · **homepage preview panel** · **FAQ ≥5**.

---

## 3. Interaction map (control → behavior, all frontend-only)

| Control | Behavior |
|---|---|
| Topbar menu button | toggle sidebar drawer + scrim (admin.js shell init) |
| Notifications / user-menu / quick-action dropdowns | `DropdownController` open/close (Esc, outside-click, roving focus) |
| Sidebar `الإعدادات` | coming-soon toast (`data-coming-soon`) |
| Sidebar `مراقبة التكاملات` | navigate `analytics.html#integrations` |
| Quick actions / quick-admin grid | navigate (add→companies modal or page), open modal, or toast |
| Filters / search / sort | filter/sort engine → show/hide rows + reorder + `aria-live` count + chips |
| Active-filter chip ✕ / Reset | remove one filter / clear all → restore + recount |
| Segment card (companies) | apply preset filter via the engine |
| Row action menu | open row menu → item opens modal or toasts (login-as → safety modal) |
| Bulk select / select-all | update selected count (`aria-live`); enable bulk bar |
| Bulk suspend / cancel / disable / reset-usage / publish / delete | **custom confirm modal** → confirm → toast (+ optional visual update) |
| Add/Change-plan/Extend/Note/Create forms | `validateAndSubmit` → inline errors or success toast + close (+ optional optimistic row) |
| Invoice view/download/send | toast (mock; "no real invoice/file/email") |
| Monthly/Yearly toggle (plans) | swap all displayed prices + active state; no network |
| Date-range / compare toggle (analytics) | active state + illustrative-data toast; no re-query |
| Feature/unfeature & checklist toggles | flip visual state + toast |
| Tabs (content) | show selected panel, hide others, set `aria-selected`/`aria-current`; panels stay in DOM |
| Copy (id / code / email) | `TUI.copyToClipboard` + toast |
| Export mock (any) | toast "لا يتم إنشاء ملف فعلي" |

---

## 4. Form & validation map (`TUI.validateForm` via `validateAndSubmit`)

| Form | Required / rules | On success |
|---|---|---|
| Add Company | companyName (req), ownerName (req), ownerEmail (req, email, `dir="ltr"`); phone/country/city/plan/trialDays/notes optional | toast + optional prepend mock row; no real company |
| Change Plan | newPlan (req, ≠ current → else info), billingCycle (req); reason optional | toast |
| Suspend/Reactivate | reason (req); notify-owner placeholder toggle | confirm → toast + optional status badge update |
| Add Admin Note | note (req); type (req), followUpDate optional | toast |
| Extend Trial | extensionDays (req, integer 1–90); reason optional | toast |
| Create/Edit Plan | name (req), monthlyPrice (req, number ≥0), yearlyPrice (req, number ≥0); limits numeric; status (req) | toast |
| Create/Edit Content | contentType (req), title (req), slug (req, slug pattern), status (req); category/summary/featured/notes optional | toast |
| Cancel Subscription | confirm modal (reason optional) | confirm → toast |

Validation states: `aria-invalid="true"` + `aria-describedby` → `.field-error` message; success/valid styling; no native dialog. Error/success copy is Arabic.

---

## 5. Shared `data-*` hooks (reused from main.js — unchanged)

`data-drawer-open="admin-sidebar"` / `data-drawer-close` · `data-modal-open="<id>"` / `data-modal-close` · `data-coming-soon` (settings + unbuilt) · `data-copy` / `data-copy-target` · `data-toast` / `data-toast-type` · `data-validate` / `data-frontend-form` / `data-success-toast` · `data-year`. Admin-specific filtering/sort/tab hooks (`data-filter`, `data-sort`, `data-segment`, `data-tab`, `data-label`, plus the row `data-*` in §1) are read by `admin.js` only.

---

## 6. Mock-data consistency & reuse rules

- **Ids are shared identity**: top-deals/featured-deals reuse `deals.json`/`merchant-deals.json` deal ids (→ `../pages/deal-details.html?id=`); featured-coupons/coupon-performance reuse `merchant-coupons.json` ids; top-destinations/content-destinations reuse `destinations-full.json` ids; content blog reuses `articles.json` ids; a subscription's `company` and a content item's `company` reference an `admin-companies.json` id.
- **Cross-page totals agree**: overview KPIs = aggregates of `admin-companies.json` + `admin-subscriptions.json` + `admin-integration-health.json`; analytics tables/series are consistent with those catalogs; plan `activeCompanies` sums match the companies' `plan` distribution; integration health is one catalog surfaced on three pages.
- **Currencies/dates/emails/codes/ids** render `dir="ltr"`.
- **Self-sufficiency**: booking/customer counts live in `admin-companies.json` (the merchant-bookings/customers catalogs are absent — D11); no admin page depends on them.
- **Honesty in data**: status labels carry the "mock" qualifier where the spec defines them (Suspended mock, Past Due mock, Cancelled mock, Paid mock, etc.); no value implies a live source.
