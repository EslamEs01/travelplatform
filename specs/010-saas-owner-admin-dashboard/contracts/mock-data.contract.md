# Contract — Mock Data (7 new catalogs + reuse rules)

New files under `travel-saas-frontend/assets/data/`. Each is backend-ready reference data **mirrored 1:1 by the static HTML** (no baseline `fetch` — D5). Schemas are defined in `data-model.md §1`; this contract fixes the invariants.

## Files (new)
| File | Shape | Minimum |
|---|---|---|
| `admin-overview.json` | object (kpis, activity, topCompanies, subscriptionAlerts, previews, checklist) | kpis ≥10 · activity ≥10 · topCompanies ≥8 · previews 5 · checklist 5 |
| `admin-companies.json` | array of Company | **≥12** |
| `admin-plans.json` | array of Plan (+ comparison matrix) | **4** (Starter/Growth/Pro/Enterprise) · comparison ≥14 features |
| `admin-subscriptions.json` | `{ items[], stats }` | items **≥12** · stats 8 |
| `admin-platform-analytics.json` | object (kpis, series, tables, recommendations) | kpis ≥12 · series 8 · tables 5 · recommendations ≥5 |
| `admin-content.json` | object keyed by tab + stats | 7 homepage sections · stats 8 · each tab ≥4 rows |
| `admin-integration-health.json` | array of IntegrationHealth | **8** (the named integrations) |

## Enumerations (mock labels — keep exact)
- **companyStatus**: Active · Trial · Suspended mock · Past Due mock · Cancelled mock · Pending Review
- **subscriptionStatus**: Active · Trial · Past Due mock · Cancelled mock · Expiring Soon · Manual Review
- **paymentStatus**: Paid mock · Pending mock · Failed mock · N/A
- **plan**: Starter · Growth · Pro · Enterprise
- **integration status**: healthy · degraded · down · not-configured (mock) · severity: info · warning · critical

## Required fields (must be present)
- **Company** (FR-064): id, companyName, ownerName, ownerEmail, phone, country, city, website, plan, subscriptionStatus, companyStatus, dealsCount, couponsCount, bookingRequests, customersCount, integrationsEnabled, lastActive, trialEndsAt, monthlyRevenueMock, usageLimits, recentActivity, adminNotes.
- **Plan** (FR-065): id, name, monthlyPrice, yearlyPrice, dealsLimit, couponsLimit, teamUsers, bookingInquiries, customersLimit, integrationsLimit, analyticsLevel, AIRecommendations, scrapingReviewQueue, supportLevel, customDomain, status.
- **Subscription** (FR-066): id, company, plan, amount, billingCycle, status, paymentStatus, nextRenewal, lastPayment, trialEndsAt, invoiceMockId, notes.
- **Content** (FR-067): homepage sections, destinations, blog posts, featured deals, featured coupons, pending review — each with status, author (where applicable), lastUpdated, featured flag.

## Reuse & consistency invariants
- **Shared ids**: featured/top **deals** → `deals.json`/`merchant-deals.json` ids (→ `../pages/deal-details.html?id=`); featured **coupons**/coupon performance → `merchant-coupons.json` ids; top/content **destinations** → `destinations-full.json` ids; content **blog** → `articles.json` ids; subscription/content **company** → `admin-companies.json` id.
- **Cross-page totals agree**: overview KPIs = aggregates of companies + subscriptions + integration-health; analytics tables/series consistent with the same catalogs; plan `activeCompanies` = count of companies with that `plan`; integration health is **one** catalog surfaced on overview + analytics + company-details.
- **Self-sufficiency**: booking/customer figures live in `admin-companies.json` (the `merchant-bookings.json`/`merchant-customers.json` catalogs do **not** exist; only `merchant-bookings-preview.json` exists — D11). No admin page depends on them.
- **LTR fields**: emails, phones, websites, currency amounts, dates, invoice ids, coupon codes render `dir="ltr"`.
- **Honesty in data**: mock-qualified status labels as above; no field implies a live source, real payment, or real integration check.

## Acceptance
All 7 files valid JSON at the stated minimums; ids resolve to existing catalogs where reused; the static HTML matches the catalogs; no baseline page depends on `fetch`; enumerations and required fields present.
