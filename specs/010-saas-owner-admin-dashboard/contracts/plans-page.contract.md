# Contract — `admin/plans.html` (`admin-plans`)

Breadcrumb **لوحة الإدارة / الخطط** · active **الخطط** · H1 **الخطط والباقات**. Admin shell; static content; frontend-only actions.

## Structure
1. **Header** — H1 + description + CTA "إنشاء خطة تجريبية" + **monthly/yearly toggle** + safe note "لا يتم إنشاء أو تعديل خطط حقيقية".
2. **Plan cards — 4** (Starter, Growth, Pro, Enterprise). Each card:
   - mock **monthly price** + **yearly price** (`dir="ltr"`), description, target user, **active-companies count**, **status** badge (Active | Disabled mock);
   - **limits/features**: deals, coupons, team users, booking inquiries, customers, integrations, analytics level, AI recommendations (placeholder), scraping review queue, support level, custom domain (placeholder);
   - **actions**: edit · duplicate · disable/enable · view companies on plan.
3. **Monthly/Yearly toggle** — switches **all** displayed prices visually + active state; no network.
4. **Features comparison table — ≥14 rows × 4 plans** — deals, coupons, team users, booking inquiries, customers, integrations, analytics, content pages, AI recommendations (placeholder), scraping review, support, custom domain, white-label (placeholder), API access (placeholder). Collapses gracefully ≤640px.
5. **Create/Edit Plan modal** — name, monthly price, yearly price, description, limits, feature toggles, status, support level, note; **validated** (name req; prices numeric ≥0; status req).
6. **Duplicate** — toast or opens a pre-filled modal with copied data.
7. **Disable confirmation modal** — warns "companies on this plan are not affected in this prototype".
8. **Companies-on-plan preview** — table/list: company, status, subscription renewal, usage, action (→ company-details / filtered companies).
9. **FAQ ≥5** — تغيير الأسعار فعليًا؟ / تأثير الخطة على الشركات؟ / إضافة باقة Enterprise؟ / تفعيل الدفع؟ / ربط الحدود بالباك إند لاحقًا؟

## Behavior (admin.js `admin-plans` controller)
- Monthly/Yearly toggle updates every card price + comparison header active state (reads `data-price-monthly`/`data-price-yearly`); session-only.
- Edit/Create → validated modal → toast (no real plan/price change). Duplicate → toast or pre-filled modal. Disable/Enable → confirm modal → toast (+ optional status badge flip).
- View-companies-on-plan → filter the companies-on-plan preview or navigate to `companies.html` with a plan filter; toast on the latter.

## Honesty
Every price/limit labelled mock; create/edit/disable copy states no real change and no payment activation; placeholders (AI/custom-domain/white-label/API) clearly marked.

## Acceptance
4 plan cards + comparison table (≥14 rows); toggle updates 100% of displayed prices; create/edit validates before toast; duplicate acts; disable uses a custom confirm with the companies-not-affected warning; view-companies acts; FAQ ≥5; renders without JS; no dead control; no browser dialog; no console error; no overflow at 360px.
