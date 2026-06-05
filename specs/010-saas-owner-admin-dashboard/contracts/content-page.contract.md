# Contract — `admin/content.html` (`admin-content`)

Breadcrumb **لوحة الإدارة / المحتوى** · active **المحتوى** · H1 **إدارة المحتوى**. Admin shell; static content; **no real CMS**; publish/delete via custom confirm.

## Structure
1. **Header** — H1 + description + CTA "إنشاء محتوى تجريبي" + export mock + safe note "لا يتم نشر محتوى حقيقي في هذه النسخة".
2. **Content stats — 8** — blog posts, destinations, featured deals, featured coupons, homepage sections, drafts, pending review, published mock.
3. **Tabs — 6** — Homepage Sections / Destinations / Blog Posts / Featured Deals / Featured Coupons / Pending Review. `role="tablist"` + `role="tab"`/`aria-selected`; **all 6 panels present in the DOM** (`role="tabpanel"`) so content is readable without JS (no-JS shows them stacked).
4. **Homepage Sections tab** — table/cards for **7 sections** (hero, featured deals, destinations teaser, coupons teaser, guides teaser, testimonials, final CTA): section name, status, item count, last updated, featured order, actions (edit mock / reorder mock / preview mock).
5. **Destinations tab** — destination, region, status, related deals, related articles, featured, last updated, actions (ids → `destinations-full.json`).
6. **Blog Posts tab** — title, category, author, status, reading time, related destination, last updated, actions (ids → `articles.json`).
7. **Featured Deals tab** — deal, company, destination, status, featured position, expiry, actions (ids → `deals.json`/`merchant-deals.json`).
8. **Featured Coupons tab** — coupon code (`dir="ltr"`), provider, discount, status, expiry, featured, actions (ids → `merchant-coupons.json`).
9. **Pending Review tab** — content type, title, source, reason, submitted by, date, actions: **approve mock / reject mock / edit mock / add note**.
10. **Create/Edit Content modal** — content type, title, slug, status, category, summary, featured toggle, notes; **validated** (type/title/slug/status req; slug pattern) → toast.
11. **Feature/unfeature toggle** — flips visually + toast (copy: homepage not really affected now).
12. **Publish/Unpublish confirmation** — custom modal.
13. **Delete confirmation** — custom modal.
14. **Homepage preview panel** — small preview reflecting the currently-featured homepage selection.
15. **FAQ ≥5** — نشر المحتوى فعليًا؟ / الربط بCMS لاحقًا؟ / تأثير العناصر المميزة على الصفحة الرئيسية الآن؟ / مراجعة محتوى مستورد؟ / حذف محتوى حقيقي؟

## Behavior (admin.js `admin-content` controller)
- Tabs switch the visible panel + `aria-selected`/`aria-current`; panels stay in DOM; deep-link `#<tab>` MAY preselect.
- Create/edit → validated modal → toast. Feature/unfeature toggle → flip + toast. Publish/unpublish + delete → confirm modal → toast (+ optional visual state). Pending-review approve/reject → toast (mock). Edit/reorder/preview/add-note → modal or toast.
- Homepage preview updates from the featured selection (session-only).

## Honesty
No publish/delete/persistence; every action labelled mock; featured toggles state "does not really affect the live homepage now"; imported pending content is reviewable, never auto-published.

## Acceptance
8 stats; 6 tabs switch with all panels in DOM (readable without JS); 7 homepage sections + 5 other tab tables; create/edit validates → toast; feature toggle works; publish/delete use custom confirms; approve/reject toast; homepage preview reflects featured; FAQ ≥5; no dead control; no browser dialog; no console error; no overflow at 360px.
