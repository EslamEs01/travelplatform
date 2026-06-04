# Contract: `dashboard/integrations.html` (`merchant-integrations`)

**Feature**: 009 | **Date**: 2026-06-04 | Derives from FR-001…FR-007, FR-020…FR-028, FR-050…FR-056; research D1–D2, D5–D6, D11–D13.

## A. Shell & document
- `<html lang="ar" dir="rtl" data-page="merchant-integrations">`; own `<head>`; `robots noindex`; Arabic title/meta; paths `../assets/…`, `../src/js/{ui,main,dashboard}.js` (defer).
- Reuses the Spec 006–007 shell; sidebar **التكاملات** `aria-current="page"`; breadcrumb `لوحة التحكم / التكاملات`; no public header/footer; exactly one `<h1>` = `التكاملات`.
- Renders fully with JS disabled (all cards + all modals present in DOM). No console errors, no CDN, **no external chart/table library**.

## B. Required sections (static HTML)
1. **Page header** — H1; description (affiliate/API/coupon/scraping/notifications readiness); safe note `لا يتم الاتصال بأي مصدر خارجي في هذه النسخة`; CTAs: `إضافة تكامل تجريبي`, `اختبار كل التكاملات تجريبيًا`, `مراجعة المصادر`.
2. **Overview stats (6)** — connected mock / not connected / API ready / needs configuration / needs review / coming soon (demo counts).
3. **Category tabs/filters (7)** — `الكل` / Affiliate / Travel APIs / Coupons / Scraping Review / Notifications / Manual; `role="tab"` + `aria-selected`.
4. **Integration cards** across all categories (≥24 cards):
   - Affiliate: Travelpayouts, Booking.com Affiliate, Expedia Partner, Skyscanner Partner, Kiwi/Tequila, Partner Link Template.
   - Travel APIs: Amadeus, Duffel, Expedia Rapid, Hotelbeds.
   - Coupons: Coupon API, Affiliate Coupon Feed, Manual Coupons, Coupon Import Review.
   - Scraping/Review: Scraping Review Queue, Source URL Monitor, Manual Approval Workflow, Duplicate Coupon Detector, Expiry Validator.
   - Notifications: Email, WhatsApp, Dashboard Alerts, Daily Summary, Weekly Reports.
   - **Each card MUST have**: icon; name; category; status badge (Connected mock / Not connected / API Ready / Coming soon / Needs configuration / Needs review / Disabled); short description; credentials-required note; last-sync mock; health/status indicator; enable/disable toggle; Configure button; Test-connection button; optional action menu. Cards carry `data-category` for filtering.
5. **Activity log ≥8** — Travelpayouts configured / Coupon API test failed / Scraping source added / Manual review required / Email test sent / WhatsApp disabled / API key updated / Sync skipped (each with mock time + severity).
6. **Health panel** — overall health / issues / warnings / review-needed / last mock check.
7. **FAQ ≥6** — هل التكاملات متصلة فعليًا؟ / هل يمكن استخدام Travelpayouts لاحقًا؟ / هل يمكن ربط Amadeus أو Duffel؟ / هل يتم تشغيل Scraping الآن؟ / هل يتم إرسال WhatsApp أو Email؟ / هل يتم نشر الكوبونات تلقائيًا؟
8. **Filter-empty placeholder** — a hidden `.empty-state` shown when a selected category matches 0 cards (a skeleton/loading state is NOT required — the cards are static).

## C. Configure modals (≥10, pre-authored static `.modal`, opened via `data-modal-open`/`TUI.modal`)
| Modal | Required/spec fields |
|---|---|
| Travelpayouts | Marker ID, API Token, default currency, default language, products (Flights/Hotels/Tours/Insurance/Car rental), tracking parameter, **Save**, **Test** |
| Booking Affiliate | Affiliate ID, default destination, link template, tracking parameter, default language, Save, Test |
| Expedia Partner | Partner ID, API/Rapid key placeholder, default market, currency, link template, Save, Test |
| Skyscanner Partner | Partner ID, widget-mode toggle, API-ready placeholder toggle, default market, Save, Test |
| Amadeus API | API Key, API Secret placeholder, environment (Test / Production-disabled), products (Flights/Hotels/Destinations), Save, Test |
| Duffel API | API token placeholder, environment, enabled products, Save, Test |
| Coupon API | API key, region, categories enabled, auto-import toggle, manual-review-required toggle, Save, Test |
| Scraping Review Queue | source name, source URL, crawl-frequency UI, manual-review-required toggle, duplicate-check toggle, expiry-validation toggle, notes, status + **warning** `لا يتم نشر أي كوبون أو عرض مجمّع تلقائيًا قبل المراجعة` |
| Email Notifications | sender name, sender email, API key placeholder, notification types, daily-summary toggle, test-email mock |
| WhatsApp Notifications | provider placeholder, sender name, API key placeholder, phone-number placeholder, notification types, test-message mock |

## D. Behavior (`dashboard.js` `initMerchantIntegrations`)
- Category tab → `aria-selected` + show/hide cards by `data-category` (الكل = all) + `aria-live` visible count; if 0 cards match, reveal a `.empty-state` placeholder (no skeleton/loading state — the cards are static).
- Toggles (enable/disable, auto-import, manual-review) → flip state with `aria-live`; rapid toggling MUST keep a consistent state without stacking duplicate toasts.
- Configure → opens that modal (focus trapped/restored).
- Modal **Save** → `validateForm` on required fields → toast `تم حفظ الإعداد (تجريبي) — لا يتم الحفظ على خادم`; **no persist, no credential validation**.
- **Test** / card Test / `اختبار كل التكاملات تجريبيًا` / test-email / test-message → toast `اختبار اتصال تجريبي — لا يتم الاتصال بأي مصدر خارجي`; **no network call**.
- Enable/disable, auto-import, manual-review toggles → flip visual state (+ status text) + `aria-live`; manual-review surfaces honesty copy.
- Documentation placeholder → toast / `قابل للربط لاحقًا`. Activity action → toast. `إضافة تكامل تجريبي` → toast; `مراجعة المصادر` → focuses/scrolls the scraping section.
- **No dead controls; no browser dialogs; no real external calls.**

## E. Scraping/review honesty (MUST, research D6)
The Scraping group cards + the Scraping Review Queue modal + the FAQ MUST state: no data is scraped in this frontend; sources must respect their policies; nothing is published automatically; all imported content requires manual review before publishing.

## F. Accessibility / responsive (MUST)
WCAG 2.1 AA (focus, keyboard, modal focus mgmt via `TUI.modal`, labels + `aria-invalid`/`aria-describedby` on modal forms, `aria-label` on icon-only buttons, `aria-live` for filter count/toggle, AA contrast, ~44px, reduced-motion). 360px: cards reflow to one column, tabs scroll/wrap, no horizontal overflow.
