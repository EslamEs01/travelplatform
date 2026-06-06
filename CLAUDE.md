<!-- SPECKIT START -->
## Active feature: 011-frontend-qa-polish

Frontend-first **Travel SaaS Platform**. Current phase is a **final frontend QA + polish pass** over everything built in
Specs 001–010 — **NOT a feature build**. It audits, surgically fixes, re-verifies, and reports across **32 existing pages**
(public `pages/` ×16, merchant `dashboard/` ×9, owner `admin/` ×7) + the 7 shared JS modules
(`ui/main/dashboard/discovery/content/member/admin.js`) + the shared CSS build / `partials/` / `assets/`. The single
deliverable is **`travel-saas-frontend/QA-FRONTEND-CHECKLIST.md`** (the only new file). **Method**: audit → categorize →
**surgical in-place fix** (reuse `window.TUI` + `main.js` `data-*`, no rewrite) → re-verify → honest report. **Hard
constraints**: add NO product feature, NO new page, NO framework, NO backend, NO visual-identity change; remove NO working
section. The **4 Spec 008 pages** (`dashboard/{bookings,booking-details,customers,customer-details}.html`) are confirmed
**ABSENT and stay unbuilt** — the audit guarantees every reference to them resolves to a `data-coming-soon` affordance,
never a 404.

**14 audit areas**: (1) inventory (32 render; 4 documented-absent); (2) navigation (every link/CTA/row-action/modal-action
resolves; folder-aware relative paths — `pages/`→siblings, `dashboard/`→`../pages/`, `admin/`→`../pages/`+`../dashboard/`;
0 bare-`#`/dead/404; stale coming-soon repointed); (3) responsive (no overflow at 320/360/390/768/1024/1280; tables→cards
or scroll-affordance; ≥44px); (4) RTL (logical props; `dir="ltr"` on coupon-codes/emails/URLs/invoice-ids/amounts;
breadcrumb + drawer side); (5) visual consistency (one design system across surfaces — token spot-check); (6) JS
interactions (drawers/dropdowns/modals/toasts/copy/toggles/filters/tabs/row-menus/bulk/confirm all work; no console error;
no duplicate-listener repeated toasts; body-scroll lock/unlock); (7) forms (labels + inline `aria-invalid`/`aria-describedby`
+ honest success, no unintended reload); (8) content honesty (no false live/real-backend claims; approved safe wording;
session-only); (9) SEO/semantics (one `<h1>`, hierarchy, Arabic title/meta, landmarks, valid non-misleading JSON-LD); (10)
a11y WCAG 2.1 AA (focus/keyboard/labels/`aria-live`/icon-button names/contrast/reduced-motion; axe-if-serveable else
documented manual); (11) performance/assets (no CDN, local fonts, `defer`, no broken image/SVG, no dup scripts, no
chart/table lib, no runtime-fetch core dep); (12) file cleanup (no stray backups/dead code; JSON valid + ids consistent;
styleguide/components still render — **never delete**); (13) end-to-end flows (public/merchant/admin each complete, no dead
control); (14) non-regression (Specs 001–010 still render after any shared-file edit).

**Key decisions (research D1–D16)**: audit→fix→verify never rewrite (D1); reuse installed toolchain only — build /
stack-grep / html-validate / node --check / stylelint / axe / serve (D2); folder-aware link crawler + path rules (D3); 4
Spec 008 pages → coming-soon, unbuilt (D4); responsive = viewport matrix + static overflow sweep + delegated browser script
(D5); RTL = logical-property + `dir="ltr"` enforcement (D6); visual = token spot-check across surfaces (D7); JS = per-
primitive review + console proxies (D8); forms = label+inline-error+honest-success (D9); honesty = bilingual forbidden-claim
grep + safe-wording map (D10); SEO = structural sweep (D11); a11y = axe-or-documented-manual AA (D12); perf =
CDN/defer/broken-path/dup-script sweep (D13); cleanup = backups/dead-code/data-consistency (D14); **fix-safety: NEVER
`prettier --write` HTML with inline `<style>` (Prettier v3 escapes `<`→`\3c` + breaks `@media`) — keep/extend
`.prettierignore`; keep `.htmlvalidate.json` aligned to real HTML5 output** (D15); honest static-vs-browser split + PASS /
PASS WITH NOTES / FAIL rubric — executor has no browser, so browser-only console/pixel checks are scripted in quickstart for
the user (D16). State stays **session-only**; only `QA-FRONTEND-CHECKLIST.md` is added; every shared-file edit is followed by
a non-regression re-render.

**Product honesty (verify + enforce platform-wide)**: no copy may claim real prices, booking, payment, invoice, auth, API,
scraping, notifications, analytics, CMS publishing, billing, suspension/plan-change, impersonation, or persistence — rewrite
to بيانات تجريبية / أسعار إرشادية / إجراء تجريبي / قابل للربط لاحقًا / لا يتم تنفيذ إجراء حقيقي في هذه النسخة / لا يتم الحفظ
على خادم حاليًا / لا يتم إرسال إشعارات حقيقية / لا يتم معالجة مدفوعات فعلية / طلب حجز / يحتاج مراجعة قبل النشر. Source badges
(Partner/Affiliate/Manual Deal/API Ready) + safe booking labels (View Deal/Request Booking/Compare Offer/Get Coupon) +
login-as disabled/safe.

**Read the current plan and its design artifacts:**

- Plan: `specs/011-frontend-qa-polish/plan.md`
- Spec: `specs/011-frontend-qa-polish/spec.md`
- Research (decisions D1–D16): `specs/011-frontend-qa-polish/research.md`
- Page inventory, issue taxonomy, audit-gate registry, report schema: `specs/011-frontend-qa-polish/data-model.md`
- Contracts: `specs/011-frontend-qa-polish/contracts/` (audit-gates, navigation-audit, content-honesty, qa-report)
- Quickstart & QA gate (exact commands + delegated browser script): `specs/011-frontend-qa-polish/quickstart.md`
- Audited surface — SaaS owner admin (Spec 010): `specs/010-saas-owner-admin-dashboard/`
- Audited surface — merchant analytics/integrations/settings (Spec 009): `specs/009-merchant-analytics-integrations-settings/`
- Audited surface — merchant deals/coupons (Spec 007): `specs/007-merchant-deals-coupons/`
- Audited surface — merchant shell/overview (Spec 006): `specs/006-merchant-dashboard-shell/`
- Audited surface — member pages (Spec 005): `specs/005-member-auth-saved-alerts/`
- Audited surface — content/SEO pages (Spec 004): `specs/004-destinations-blog-seo/`
- Audited surface — discovery pages (Spec 003): `specs/003-public-discovery-pages/`
- Audited surface — homepage (Spec 002): `specs/002-public-homepage/`
- Audited foundation — styleguide/components, shell, UI utilities (Spec 001): `specs/001-frontend-foundation/`
- Note: Spec 008 (merchant bookings/customers) was never built — its 4 pages stay coming-soon, not built here.
- Governing constitution: `.specify/memory/constitution.md`

**Stack (non-negotiable)**: HTML + local Tailwind CSS v3.4 build (PostCSS) + vanilla JS only.
Forbidden: React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN, external chart/table library, browser
`alert()`/`confirm()`/`prompt()`. Arabic RTL primary, English-ready, mobile-first (usable at 360px, no horizontal
overflow), WCAG 2.1 AA, standalone backend-ready pages, no CDN at runtime.
<!-- SPECKIT END -->
