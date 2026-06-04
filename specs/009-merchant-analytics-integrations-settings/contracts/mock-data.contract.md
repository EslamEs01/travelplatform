# Contract: Mock-Data Catalogs (Spec 009)

**Feature**: 009 | **Date**: 2026-06-04 | Derives from FR-052; research D11. Five **new** backend-ready JSON catalogs under `travel-saas-frontend/assets/data/`. They are **reference data only** — the static HTML is the source of baseline content and MUST render without fetching them (Constitution III). Reuse existing ids for cross-page identity.

## 1. `merchant-analytics.json`
```jsonc
{
  "dateRange": { "key": "30d", "labelAr": "آخر 30 يوم", "from": "2026-05-05", "to": "2026-06-04" },
  "compare":   { "enabled": false, "periodAr": "الفترة السابقة" },
  "kpis": [
    { "key": "visits",        "labelAr": "الزيارات",                "value": 18420, "unit": "",   "trend": { "dir": "up",   "pct": 12.4 }, "helperAr": "زيارات تجريبية للفترة" }
    // ≥10 total: visits, dealClicks, bookingInquiries, couponCopies, conversionEstimate, topDestination,
    // revenueEstimate, averageRequestValue, newCustomers, mostViewedDeals
  ],
  "series": {
    "inquiries":   [ { "period": "أسبوع 1", "value": 42 } ],   // each metric: ordered points (≥6)
    "dealClicks":  [],
    "couponCopies":[],
    "conversion":  []
  },
  "trafficSources": [ { "name": "Organic Search", "visits": 7100, "pct": 38, "trend": "up" } ],   // ≥8
  "devices":        [ { "name": "mobile", "pct": 63 }, { "name": "desktop", "pct": 29 }, { "name": "tablet", "pct": 8 } ],
  "topDeals": [
    { "dealId": "deal-001", "title": "…", "destination": "دبي", "source": "partner",
      "views": 0, "clicks": 0, "inquiries": 0, "couponCopies": 0, "conversionEst": 0, "status": "active" }
    // ≥8; dealId ∈ deals.json / merchant-deals.json
  ],
  "topDestinations": [ { "name": "دبي", "visits": 0, "dealClicks": 0, "inquiries": 0, "trend": "up" } ], // ≥7
  "couponPerformance": [
    { "couponId": "coupon-001", "code": "SUMMER15", "provider": "…", "category": "hotels",
      "source": "affiliate", "copies": 0, "usageMock": 0, "relatedDealId": "deal-003",
      "expiry": "2026-07-01", "status": "active" }   // ≥8; ids ∈ merchant-coupons.json
  ],
  "insights": [ { "key": "topSegment", "labelAr": "أعلى شريحة قيمة", "valueAr": "عائلات الخليج" } ],   // ≥6
  "recommendations": [
    { "priority": "high", "titleAr": "عرض دبي يحصل على أعلى ضغطات", "explanationAr": "…",
      "action": { "type": "link", "href": "deals.html" } }   // ≥6; action.type ∈ link|toast
  ]
}
```
**Rules**: `clicks ≤ views`, `inquiries ≤ clicks`; trafficSources `pct` sum ≈ 100; devices `pct` sum = 100; codes match `coupons.json`/`merchant-coupons.json`.

## 2. `merchant-integrations.json`
```jsonc
{
  "stats": { "connected": 2, "notConnected": 5, "apiReady": 4, "needsConfig": 3, "needsReview": 2, "comingSoon": 3 },
  "integrations": [
    {
      "key": "travelpayouts", "name": "Travelpayouts", "category": "affiliate",
      "status": "needs-config",                 // connected|not-connected|api-ready|coming-soon|needs-config|needs-review|disabled
      "descriptionAr": "…", "credentialsAr": "Marker ID + API Token",
      "enabled": false, "lastSyncMock": "قبل ساعتين (تجريبي)", "health": "warn",   // ok|warn|review|off
      "configFields": [
        { "name": "marker", "labelAr": "Marker ID", "type": "text", "required": true },
        { "name": "token",  "labelAr": "API Token", "type": "text", "required": true }
        // products checklist, currency/language selects, tracking parameter…
      ],
      "warningsAr": null
    }
    // all cards from integrations-page.contract.md §B4 across 6 categories
  ],
  "activity": [
    { "timeMock": "اليوم 10:24", "event": "تم ضبط Travelpayouts (تجريبي)", "severity": "info" }   // ≥8; severity ∈ info|warn|error
  ],
  "health": { "overall": "warn", "issues": 1, "warnings": 2, "reviewNeeded": 2, "lastCheckMock": "اليوم 11:00 (تجريبي)" }
}
```
**Rules**: every credential field empty/placeholder; statuses are demo labels; scraping integrations carry `warningsAr` with the no-auto-publish / manual-review notice.

## 3. `merchant-settings.json`
```jsonc
{
  "company": { "name": "وكالة الأفق للسفر", "businessType": "وكالة سياحة", "phone": "+966500000000",
               "email": "info@example.com", "website": "https://example.com", "address": "…",
               "country": "السعودية", "city": "الرياض", "supportContact": "…", "workingHours": "9ص–6م",
               "license": "RX-0000 (مثال)" },
  "branding": { "primary": "#0E7C7B", "secondary": "#F4A300", "slug": "alufuq-travel",
                "publicUrlBase": "https://travel.example.com/", "socials": { "instagram": "", "x": "", "facebook": "" } },
  "booking": { "currency": "SAR", "mode": "inquiry",        // inquiry|redirect|manual
               "confirmationMessage": "…", "minDeposit": "", "cancellationNote": "…", "refundNote": "…",
               "workingHours": "9ص–6م", "responseTime": "خلال ساعتين (تجريبي)",
               "requiredDocs": ["passport", "id", "receipt", "travelerNames", "visa"] },
  "notifications": [
    { "key": "newInquiry", "labelAr": "طلب حجز جديد", "channels": { "dashboard": true, "email": true, "whatsapp": false } }
    // ≥9 rows
  ]
}
```

## 4. `merchant-team.json`
```jsonc
{
  "members": [
    { "id": "u-001", "name": "سارة العتيبي", "email": "sara@example.com", "role": "Owner",
      "status": "active", "lastActiveMock": "اليوم", "permissionsAr": "كل الصلاحيات" }
    // ≥6; roles spread Owner/Manager/Agent/Marketing/Support; statuses spread active/invited/disabled
  ]
}
```

## 5. `merchant-usage.json`
```jsonc
{
  "plan": { "name": "Growth", "renewalMock": "2026-07-01 (تجريبي)", "billingNoteAr": "الفوترة غير مفعّلة في هذه النسخة" },
  "usage": [
    { "key": "deals",            "labelAr": "العروض",        "used": 12, "limit": 50 },
    { "key": "coupons",          "labelAr": "الكوبونات",     "used": 14, "limit": 50 },
    { "key": "teamUsers",        "labelAr": "أعضاء الفريق",  "used": 6,  "limit": 10 },
    { "key": "integrations",     "labelAr": "التكاملات",     "used": 2,  "limit": 8 },
    { "key": "bookingInquiries", "labelAr": "طلبات الحجز",   "used": 320,"limit": 1000 },
    { "key": "customers",        "labelAr": "العملاء",       "used": 210,"limit": 1000 },
    { "key": "storage",          "labelAr": "التخزين",       "used": 0,  "limit": 0, "unit": "placeholder" }
  ]
}
```
**Rules**: `used ≤ limit`; numbers consistent with the deals/coupons/team shown elsewhere; storage is an explicit placeholder.

## 6. Cross-catalog & honesty rules
1. `topDeals[].dealId` and `couponPerformance[].couponId`/`relatedDealId` MUST exist in `deals.json`/`merchant-deals.json`/`merchant-coupons.json`.
2. Destination names align with the public destinations set.
3. Static HTML mirrors these values; **no runtime fetch for baseline** (III).
4. No real secrets — credential/key fields are empty or obviously masked samples (e.g., `tp_********`).
5. Every value's surrounding copy uses approved frontend-only wording; "Connected mock"/"API Ready" never imply a live connection.
