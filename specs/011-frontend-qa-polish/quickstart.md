# Quickstart & QA Gate — Final Frontend QA + Polish (Spec 011)

**Feature**: `011-frontend-qa-polish` | **Date**: 2026-06-06 | All commands run from `travel-saas-frontend/`.

This is the runnable companion to the audit gates (`contracts/audit-gates.contract.md`). It gives the exact command for every machine gate, the script the **user** runs for the browser-only confirmations, and the final sign-off that produces `QA-FRONTEND-CHECKLIST.md`.

---

## 0. Prerequisites

```bash
cd travel-saas-frontend
node -v            # ≥ 18 LTS
npm ci             # if node_modules is missing (deps already in package.json)
```

No new dependency is installed for this spec — every tool below is already a devDependency.

---

## 1. Machine gates (executor runs these)

### G1 — Build
```bash
npm run build
# expect: "Done in …ms"; assets/css/tailwind.css regenerated
```

### G2 — Stack-compliance hard gate (must be 0 real hits)
```bash
grep -RniE "react|vue|angular|bootstrap|jquery|cdn\.tailwindcss|alert\(|confirm\(|prompt\(" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
# extended: external chart/table/date libs
grep -RniE "chart\.js|apexcharts|highcharts|echarts|datatables|ag-grid|flatpickr|moment|[^a-z]d3[^a-z]" \
  --include=*.html --include=*.js --include=*.css . | grep -v node_modules
# expect: no output, OR only documented false positives (e.g. onConfirm identifier, Arabic substring)
```

### G3 — HTML validation (all 32 pages, 0 errors)
```bash
npx html-validate pages/*.html dashboard/*.html admin/*.html
# expect: clean (no output / 0 problems)
```

### G4 — JS syntax / load-safety (7 modules)
```bash
for f in src/js/*.js; do node --check "$f" && echo "OK $f" || echo "FAIL $f"; done
```

### G5 — CSS lint
```bash
npm run lint:css
# auto-fix if needed:
npx stylelint --fix "src/**/*.css" && npm run lint:css
```

### G6 — Link crawl (folder-aware) — every internal target exists
```bash
# list every internal href/src per surface for resolution against the filesystem
grep -RhoE '(href|src)="[^"#]+"' pages dashboard admin \
  | sed -E 's/.*="([^"]+)".*/\1/' | sort -u
# then resolve each against the linking folder per navigation-audit.contract.md §2
# and confirm: 0 missing files; 0 links to dashboard/{bookings,booking-details,customers,customer-details}.html
grep -RnE 'href="[^"]*(bookings|booking-details|customers|customer-details)\.html' dashboard admin pages \
  | grep -v 'data-coming-soon'
# expect: no output (absent Spec 008 pages reached only via data-coming-soon)
```
```bash
# bare-# dead controls without a JS handler (data-* action) are defects
grep -RnE 'href="#"' pages dashboard admin | grep -vE 'data-(coming-soon|modal|drawer|copy|toast|tab|toggle)'
# expect: no output (every #-link is JS-handled)
```

### G7 — Asset crawl (no missing image/SVG/sprite symbol)
```bash
# images
grep -RhoE 'src="[^"]+\.(png|jpe?g|svg|webp|avif)"' pages dashboard admin | sed -E 's/.*="([^"]+)".*/\1/' | sort -u
# sprite symbols referenced vs defined
grep -RhoE 'href="#icon-[a-z0-9-]+"' pages dashboard admin | sed -E 's/.*#(icon-[a-z0-9-]+).*/\1/' | sort -u > /tmp/used.txt
grep -oE 'id="icon-[a-z0-9-]+"' assets/icons/sprite.svg | sed -E 's/id="([^"]+)"/\1/' | sort -u > /tmp/defined.txt
comm -23 /tmp/used.txt /tmp/defined.txt   # expect: empty (no used-but-undefined symbol)
```

### G8 — Structural sweep
```bash
# exactly one <h1> per page
for f in pages/*.html dashboard/*.html admin/*.html; do n=$(grep -c '<h1' "$f"); [ "$n" = 1 ] || echo "H1=$n $f"; done
# every script is defer
grep -RnE '<script [^>]*src=' pages dashboard admin | grep -v 'defer' | grep -v 'application/'
# icon-only buttons need an accessible name (spot via html-validate G3 too)
```

### G9 — Content-honesty grep (bilingual; 0 real hits)
```bash
grep -RniE "booking confirmed|payment processed|account created|api connected|scraping running|email sent|whatsapp sent|تم الحجز|تم الدفع|تم إنشاء حساب|تم الاتصال|تم الإرسال|أسعار مباشرة|تم تسجيل الدخول كالشركة" \
  pages dashboard admin | grep -viE 'تجريبي|إرشادي|قابل للربط|لا يتم'
# expect: no output (every such phrase is qualified as mock, or is a documented false positive)
```

### G10 — JSON validity & id consistency
```bash
for f in assets/data/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f'))" && echo "OK $f" || echo "BAD $f"; done
```

### G11 — Accessibility (axe if serveable, else manual)
```bash
# in terminal A:
npm run serve            # serves at http://localhost:3000
# in terminal B (one representative page per surface):
npx axe http://localhost:3000/pages/index.html
npx axe http://localhost:3000/dashboard/index.html
npx axe http://localhost:3000/admin/index.html
# if axe cannot launch a browser/driver in this environment:
#   → record the reason and perform the manual WCAG 2.1 AA checklist (G11 fallback) in the report.
```

---

## 2. Browser-manual confirmations (USER runs these — delegated)

The executor has no browser, so these are scripted for you. Serve the site, then walk each surface.

```bash
npm run serve   # http://localhost:3000
```

**Console-clean** — open DevTools Console on each surface's key pages; expect **no errors / no failed requests**:
- `…/pages/index.html`, `…/pages/compare.html`, `…/pages/deal-details.html`, `…/pages/login.html`
- `…/dashboard/index.html`, `…/dashboard/deals.html`, `…/dashboard/settings.html`
- `…/admin/index.html`, `…/admin/companies.html`, `…/admin/content.html`

**Responsive** — DevTools device toolbar at **320 / 360 / 390 / 768 / 1024 / 1280px** on one page per surface; expect **no horizontal scrollbar**, tables become cards or scroll with an affordance, sidebars become drawers.

**RTL/visual** — confirm Arabic reads right-to-left, coupon codes/emails render LTR, badges/actions sit on the correct side, and the three surfaces look like one design system.

**Three end-to-end flows** (must complete with no dead control):
- *Public*: home → hero search → compare → deal-details → booking-inquiry modal → submit → copy coupon → destinations → article → login/register → saved-deals → price-alerts.
- *Merchant*: dashboard → deals → create-deal → edit-deal → coupons → analytics → integrations (config modal) → settings (toggle). (bookings/customers show coming-soon.)
- *Admin*: overview → companies → company-details → plans (monthly/yearly + disable confirm) → subscriptions (cancel confirm) → analytics → content (tabs + publish/delete confirm).

Record the outcome of each in the report's §6 (✅ / ▶ / ⚠).

---

## 3. Per-area "done" checklist (mirrors the spec's 14 audit areas)

- [ ] **Inventory** — all 32 pages render; 4 Spec 008 pages documented absent.
- [ ] **Navigation** — G6 clean; 0 broken/dead/absent links; stale coming-soon repointed.
- [ ] **Responsive** — static sweep clean; user viewport check signed off.
- [ ] **RTL** — `dir="ltr"` on all Latin runs; logical properties; drawer/breadcrumb side correct.
- [ ] **Visual consistency** — tokens consistent across surfaces; no ad-hoc drift.
- [ ] **JS interactions** — G3/G4 clean; per-primitive review done; console check signed off.
- [ ] **Forms** — labels + inline errors + honest success; no unintended reload.
- [ ] **Content honesty** — G9 clean; safe wording + source badges + safe labels; login-as disabled.
- [ ] **SEO/semantics** — one `<h1>`, hierarchy, Arabic title/meta, valid non-misleading JSON-LD.
- [ ] **Accessibility** — axe pass or documented manual AA.
- [ ] **Performance/assets** — G2/G7 clean; defer; no CDN/chart-lib; no broken assets.
- [ ] **File cleanup** — no stray backups/dead code; JSON valid + consistent; styleguide/components render.
- [ ] **End-to-end flows** — all three complete with no dead control.
- [ ] **Non-regression** — G1–G3 re-run clean after every shared-file edit; Specs 001–010 still render.

---

## 4. Sign-off → produce the deliverable

When the machine gates are green and the browser-manual items are either confirmed or honestly noted as delegated, write **`travel-saas-frontend/QA-FRONTEND-CHECKLIST.md`** per `contracts/qa-report.contract.md` (six sections + status rubric). Expected final status given a browserless executor: **PASS WITH NOTES** (all P1 static gates green; browser-only confirmations delegated; mock limitations documented). `FAIL` only if an unmet P1 remains.

---

## 5. Fix-safety reminders (do not skip)

- **Never** `prettier --write` HTML that contains an inline `<style>` block (Prettier v3 escapes `<`→`\3c` and breaks `@media`); keep/extend `.prettierignore`; scope `npm run format` to JS/JSON/CSS.
- Keep `.htmlvalidate.json` aligned to real output (lowercase doctype, self-closing voids).
- After any edit to `src/js/*`, `src/input.css`, `partials/*`, or `assets/data/*`, re-run G1–G3 and re-render the affected surface (non-regression).
- Surgical edits only — no page rewrite, no section removal, no new framework/page/backend, reuse `window.TUI`.
- Do **not** delete `styleguide.html` / `components.html`.
