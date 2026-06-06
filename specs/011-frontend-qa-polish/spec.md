# Feature Specification: Final Frontend QA + Polish

**Feature Branch**: `011-frontend-qa-polish`
**Created**: 2026-06-06
**Status**: Draft
**Input**: User description: "Create Spec 011: Final Frontend QA + Polish for the Travel SaaS Platform. Perform a full frontend QA, polish, consistency, and production-readiness review across the entire Travel SaaS Platform frontend built in Specs 001 through 010… The final frontend should feel complete, premium, consistent, Arabic-first RTL, mobile-first, SaaS-ready, client-presentable, free from dead buttons / broken links / console errors, honest about mock/frontend-only data, ready to be converted later into Django/backend."

## Overview

This is a **QA, polish, and production-readiness** feature — **not** a feature-build. Its job is to audit, verify, fix, and polish the existing frontend produced by Specs 001–010 so the whole platform reads as one complete, premium, honest, client-presentable SaaS prototype, and to capture the result in a single QA report.

**The platform spans three surfaces and 32 existing pages**:

- **Public** (`pages/`, 16 pages): homepage, discovery (compare/deals/coupons/deal-details), content/SEO (destinations/destination-details/blog/article), member (login/register/saved-deals/price-alerts/profile), and the foundation showcases (styleguide/components).
- **Merchant dashboard** (`dashboard/`, 9 pages): index, deals, create-deal, edit-deal, coupons, create-coupon, analytics, integrations, settings.
- **SaaS owner admin** (`admin/`, 7 pages): index, companies, company-details, plans, subscriptions, analytics, content.

**Intentionally-absent pages (Spec 008, never built)**: `dashboard/bookings.html`, `dashboard/booking-details.html`, `dashboard/customers.html`, `dashboard/customer-details.html`. These are **out of scope to build** in Spec 011. The audit's job is to ensure nothing links to them as a real destination — every reference must resolve to a safe coming-soon affordance, never a 404.

**This spec does NOT**: add product features, add new pages, redesign the visual identity, change the constitution, introduce frameworks, remove working sections, or fake any backend behavior. It prefers small, surgical fixes and consistency cleanup over rewriting pages.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - No dead ends: every link and control resolves (Priority: P1)

A stakeholder (or a client during a live demo) clicks through every navigation element, CTA, card, breadcrumb, sidebar item, topbar control, quick action, row-action menu, and modal button on all 32 pages. Nothing is a dead end: every clickable element either navigates to a real page, opens a modal/drawer, toggles visible state, copies data, applies a filter/sort/search, submits a frontend-validated form, shows a toast, shows a safe coming-soon message, or opens a custom confirmation modal.

**Why this priority**: A single dead button or broken link instantly breaks the illusion of a finished product during a client demo. This is the most visible failure mode and the highest-value fix.

**Independent Test**: Crawl every `href`/`data-*` action target across the 32 pages; confirm each internal link points to an existing file with the correct relative path (`pages/` → siblings; `dashboard/` → `../pages/`; `admin/` → `../pages/` and `../dashboard/`; assets/CSS/JS resolve from each folder); confirm no bare `#`/silent dead control remains; confirm all four absent Spec 008 targets resolve to coming-soon, not a hard link.

**Acceptance Scenarios**:

1. **Given** any of the 32 pages, **When** the reviewer activates any link or button, **Then** it performs exactly one of the allowed visible behaviors and never lands on a 404 or does nothing.
2. **Given** a link to a Spec 008 page (bookings/customers), **When** activated, **Then** it shows a safe coming-soon toast/message rather than navigating to a missing file.
3. **Given** a CTA whose destination page now exists, **When** the reviewer inspects it, **Then** it links to that page rather than still showing "coming soon".
4. **Given** cross-surface links (admin → merchant → public), **When** followed, **Then** the relative path resolves correctly from the originating folder.

---

### User Story 2 - Honest about mock/frontend-only data (Priority: P1)

A reviewer reads the copy on every page and exercises every mutating control (suspend, change plan, publish, send, export, save, invite, pay, book, sign-in). Nothing claims a real backend action occurred. Every such control and data surface carries approved safe wording (بيانات تجريبية / إجراء تجريبي / أسعار إرشادية / قابل للربط لاحقًا / لا يتم الحفظ على خادم / لا يتم تنفيذ إجراء حقيقي, etc.), and reload restores mock defaults.

**Why this priority**: Presenting a frontend prototype as if it performs real bookings, payments, auth, or billing is dishonest and a legal/trust risk. Honesty is non-negotiable and must be verified platform-wide.

**Independent Test**: Audit all copy and every mutating control across the 32 pages; confirm none falsely claims live prices, real booking confirmed, real API/scraping connected, real payment/invoice processed, real email/WhatsApp sent, real analytics tracking, real CMS publishing, real account created, real settings/billing saved, real suspension/plan change, or visa guarantees; confirm session-only state (reload restores defaults).

**Acceptance Scenarios**:

1. **Given** any mutating control, **When** activated, **Then** the resulting toast/modal/inline message states the action is illustrative/frontend-only and not persisted.
2. **Given** any price, KPI, chart, or status, **When** displayed, **Then** it is labeled mock/illustrative where a viewer might otherwise assume it is live.
3. **Given** the reviewer reloads any page after taking mock actions, **When** the page re-renders, **Then** the original mock defaults are restored (no real persistence).

---

### User Story 3 - Technically sound: clean build, clean console, compliant stack (Priority: P1)

An engineer runs the build, opens each page with devtools, and greps the source. The Tailwind build succeeds; every page loads with a clean console (no JS errors, no 404s for CSS/JS/icons/images); there are zero forbidden technologies (React/Vue/Angular/Bootstrap/jQuery/Tailwind-CDN), zero runtime CDN dependencies, zero browser `alert()`/`confirm()`/`prompt()`, and zero external chart/table/date libraries; all scripts use `defer`.

**Why this priority**: These are objective, automatable gates. A console error or a forbidden dependency is a hard "not production-ready" signal and is cheap to verify and fix.

**Independent Test**: Run `npm run build` (must succeed); run the stack-compliance grep over all html/js/css excluding `node_modules` for `react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(` (must be zero, or each hit documented as a justified false positive); run `npx html-validate` over all pages; open each page and confirm a clean console.

**Acceptance Scenarios**:

1. **Given** the repo, **When** `npm run build` runs, **Then** it completes without error and `assets/css/tailwind.css` regenerates.
2. **Given** the stack-compliance grep, **When** it runs over all source excluding `node_modules`, **Then** it returns zero real hits (any false positive is documented and justified).
3. **Given** each of the 32 pages opened in a browser, **When** loaded and exercised, **Then** the console shows no errors and no failed asset requests.
4. **Given** any page's `<head>`/scripts, **When** inspected, **Then** all scripts are `defer` and no CDN/font/script/image is loaded from an external origin.

---

### User Story 4 - Usable on mobile across every surface (Priority: P2)

A reviewer resizes from 320px up to 1280px+ on representative pages from each surface. There is no horizontal overflow; grids reflow to one column; dense tables collapse to stacked labeled cards or scroll with a visible affordance; sidebars become drawers; modals/dropdowns stay on-screen; touch targets are roughly ≥44px; mobile filters and action menus are usable.

**Why this priority**: The platform is mobile-first and Arabic-first; an unusable mobile layout undermines the "premium SaaS" claim, but it is a layout-polish task rather than a correctness blocker, so P2.

**Independent Test**: Inspect each surface at 320 / 360 / 390 / 768 / 1024 / 1280px; confirm no element exceeds the viewport width, no important control is hidden/clipped, dashboard and admin tables remain usable, and modals/dropdowns are fully reachable.

**Acceptance Scenarios**:

1. **Given** any page at 320–390px, **When** rendered, **Then** there is no horizontal scrollbar and no clipped card or hidden primary button.
2. **Given** a dense merchant/admin table on mobile, **When** viewed, **Then** it presents as stacked labeled cards or scrolls with a visible affordance.
3. **Given** a modal or dropdown opened on mobile, **When** shown, **Then** it fits within the viewport and is dismissible.

---

### User Story 5 - Native Arabic RTL everywhere (Priority: P2)

A reviewer reads every surface in Arabic RTL. Text alignment, icon direction, badges, table action positions, breadcrumb order, and drawer/sidebar open-side are all correct. Latin runs (coupon codes, emails, URLs, invoice numbers, amounts) are marked `dir="ltr"` so they render correctly. Direction is driven by logical CSS properties rather than hardcoded left/right. Arabic reads as native, not translated-from-LTR.

**Why this priority**: RTL correctness is a core identity requirement, but most of it is already in place from prior specs; this is a verification-and-touch-up pass, so P2.

**Independent Test**: Inspect each surface in RTL; confirm logical properties are used (no stray hardcoded left/right that breaks RTL), LTR-content fields carry `dir="ltr"`, breadcrumbs read right-to-left in the correct order, and drawers/sidebars open from the correct side.

**Acceptance Scenarios**:

1. **Given** any page, **When** rendered in RTL, **Then** alignment, badges, and table action columns sit on the correct side.
2. **Given** a coupon code / email / URL / invoice number / amount, **When** displayed, **Then** it carries `dir="ltr"` and renders left-to-right within the RTL layout.
3. **Given** the mobile drawer/sidebar, **When** opened, **Then** it slides in from the RTL-correct side.

---

### User Story 6 - One consistent design system across all surfaces (Priority: P2)

A reviewer compares buttons, cards, badges, inputs, toggles, modals, drawers, toasts, dropdowns, action menus, table rows, empty states, skeletons, spacing, typography, shadows, radii, gradients, and icon sizes across public, merchant, and admin. They look like one product: the public site reads premium and travel-focused, the merchant dashboard app-like and practical, the admin owner/operator-focused — all clearly related through the shared design system, with no ad-hoc drift.

**Why this priority**: Consistency is what makes the prototype feel "finished and premium," but it is incremental polish rather than a functional blocker, so P2.

**Independent Test**: Spot-check shared components on at least one page per surface; confirm consistent token usage (colors/spacing/radii/shadows), consistent button/badge/card variants, and that no component looks borrowed from another product.

**Acceptance Scenarios**:

1. **Given** a button/badge/card on a public page and its counterpart on a dashboard/admin page, **When** compared, **Then** they share the same design language and tokens.
2. **Given** an empty state or skeleton on any listing page, **When** shown, **Then** it matches the established pattern.
3. **Given** any page, **When** scanned for styling, **Then** there are no jarring ad-hoc styles, weak spacing, or low-contrast text.

---

### User Story 7 - Accessible to WCAG 2.1 AA (Priority: P3)

A reviewer navigates by keyboard and screen reader. Focus is visible and well-ordered; modals trap and return focus and close on Esc; drawers close predictably; every form control has a label; validated fields expose `aria-invalid`/`aria-describedby`; dynamic counts/status use `aria-live`; icon-only buttons have accessible labels; contrast meets AA; touch targets are adequate; reduced motion is respected; tables have headers; buttons vs links are used correctly.

**Why this priority**: Accessibility is required by the constitution and important, but the bulk is already implemented per-spec; this is a consolidating verification pass, so P3.

**Independent Test**: Keyboard-only walkthrough of each surface plus a static/manual a11y check (and automated axe where the local environment permits — otherwise documented as a limitation with a manual audit substituted); confirm focus, labels, aria-live, icon-button labels, and Esc/close behavior.

**Acceptance Scenarios**:

1. **Given** keyboard-only navigation, **When** tabbing through a page, **Then** focus is visible, logically ordered, and never trapped outside a modal.
2. **Given** a modal/drawer, **When** opened, **Then** focus moves into it and returns to the trigger on close, and Esc closes it where the shared utility supports it.
3. **Given** an icon-only button, **When** inspected, **Then** it has an accessible name.

---

### User Story 8 - Sound SEO and semantics on public pages (Priority: P3)

A reviewer checks public pages for exactly one `<h1>`, correct heading hierarchy, Arabic title and meta description, semantic landmarks (`main`/`section`/`article`/`nav`/`footer`), descriptive links and alt text, substantial (non-thin) content on blog/article/destination pages, no duplicate titles/meta across important pages, and any existing JSON-LD being valid and not misleading (no fake live offers). Dashboard/admin pages also have one `<h1>` and a sensible hierarchy with semantic tables/lists/forms.

**Why this priority**: SEO matters for the public marketing surface but is largely structural and mostly already in place; a verification-and-touch-up pass, so P3.

**Independent Test**: Validate heading structure and landmarks per page; confirm Arabic title/meta present and non-duplicated on key public pages; confirm JSON-LD (where present) validates and contains no misleading live-offer claims.

**Acceptance Scenarios**:

1. **Given** any public page, **When** parsed, **Then** it has exactly one `<h1>` and a correct heading hierarchy.
2. **Given** any public page, **When** inspected, **Then** it has an Arabic title and meta description, and important pages do not duplicate each other's title/meta.
3. **Given** any existing JSON-LD, **When** validated, **Then** it is well-formed and makes no real-offer/live-price claim.

---

### User Story 9 - Forms and interactions all work and stay honest (Priority: P3)

A reviewer exercises every form (search/newsletter, login/register/forgot, member alerts/profile, merchant create/edit deal and coupon, integration/settings, admin company/plan/subscription/content modals) and every interaction primitive (drawers, dropdowns, modals, toasts, copy, favorite/save toggles, filters/sort/reset/chips, tabs, accordions, row-action menus, bulk actions, confirmation modals). Required fields have labels and inline errors; valid submit shows an honest success toast without implying backend storage; no unintended page reloads; no duplicated listeners producing repeated toasts; reset clears filter state and updates result counts; empty states appear when expected; body scroll locks/unlocks with drawer/modal.

**Why this priority**: These behaviors are mostly implemented; this is the consolidating regression pass that confirms nothing broke from link rewiring or shared-JS/CSS edits, so P3.

**Independent Test**: Run each end-to-end flow (public visitor, merchant, admin) and confirm every primitive behaves correctly with no console error, no repeated toasts, correct focus/scroll handling, and honest success messaging.

**Acceptance Scenarios**:

1. **Given** an invalid form submit, **When** submitted, **Then** inline errors appear with `aria-invalid`/`aria-describedby` and no reload occurs.
2. **Given** a valid form submit, **When** submitted, **Then** an honest success toast/inline message appears without claiming server persistence.
3. **Given** a filter/sort/reset interaction, **When** used, **Then** the result count and active chips update and reset fully clears state.
4. **Given** a destructive action, **When** invoked, **Then** a custom confirmation modal (never a browser dialog) gates it.

---

### Edge Cases

- **Absent Spec 008 pages**: Any bookings/booking-details/customers/customer-details reference must resolve to a coming-soon affordance, never a 404. If a sidebar/nav entry exists for them, it must be visibly marked coming-soon.
- **CTA drift**: A CTA marked "coming soon" whose destination page now exists must be re-pointed to the real page; a CTA linking to a page that does not exist must be converted to coming-soon or removed.
- **Cross-surface relative paths**: Links between `pages/`, `dashboard/`, and `admin/` must use the correct `../` depth; an asset path correct in one folder may be wrong when a block was copied to another.
- **Duplicated event listeners**: A shared-JS guard must prevent the same control binding twice (which would fire repeated toasts).
- **Body scroll lock**: Opening a drawer/modal must lock body scroll and unlock on close; nested/sequential modals must not leave scroll permanently locked.
- **Mock-state reset**: Session-only state must restore on reload; no audit fix may introduce real persistence.
- **False-positive grep hits**: Arabic words or identifiers that contain substrings like "react"/"alert" must be recognized as false positives and documented, not "fixed" by corrupting copy.
- **Automated-tool unavailability**: If axe (or any audit tool) cannot run in the local environment, the limitation must be documented honestly and a manual audit substituted — never silently skipped.
- **Styleguide/components**: These foundation showcases must keep rendering and must not be deleted; they are part of QA.

## Requirements *(mandatory)*

### Functional Requirements

**Deliverable**

- **FR-001**: The feature MUST produce `travel-saas-frontend/QA-FRONTEND-CHECKLIST.md` containing: project summary; QA date; tested scope; commands/checks run; a page-inventory table (columns: page path, renders, nav checked, mobile checked, RTL checked, interactions checked, notes); issues-found-and-fixed grouped by category (navigation, responsive, RTL, visual consistency, JS interactions, forms, accessibility, SEO, content honesty, performance/assets, file cleanup); remaining known notes/limitations; a final confirmation checklist; and a final status of PASS / PASS WITH NOTES / FAIL.

**Page inventory (Audit Area 1)**

- **FR-002**: The audit MUST verify all 32 existing pages render and MUST document the 4 intentionally-absent Spec 008 pages (`dashboard/bookings.html`, `dashboard/booking-details.html`, `dashboard/customers.html`, `dashboard/customer-details.html`) as not present and not linked as real destinations.

**Navigation (Audit Area 2)**

- **FR-003**: Every clickable element across all surfaces (public navbar/drawer/footer, homepage and page CTAs, card links, breadcrumbs, member nav, merchant sidebar/topbar/quick-actions/row-actions, admin sidebar/topbar/quick-actions/row-actions, modal actions) MUST perform exactly one allowed visible behavior: navigate to an existing page, open a modal/drawer, toggle visible state, copy data, apply filter/sort/search, submit a frontend-validated form, show a toast, show a safe coming-soon message, or open a custom confirmation modal.
- **FR-004**: The audit MUST fix broken relative paths, silent `#`/dead buttons, links to missing files, stale coming-soon CTAs whose page now exists, and CTAs pointing to non-existent pages, applying the folder path rules (`pages/`→siblings; `dashboard/`→`../pages/`; `admin/`→`../pages/` and `../dashboard/`; assets/CSS/JS correct per folder).

**Responsive (Audit Area 3)**

- **FR-005**: All pages MUST be usable with no horizontal overflow at 320 / 360 / 390 / 768 / 1024 / 1280px+, with grids reflowing to one column, dense tables presented as stacked labeled cards or scroll-with-affordance, sidebars becoming drawers, modals/dropdowns staying on-screen, and touch targets roughly ≥44px.

**RTL (Audit Area 4)**

- **FR-006**: Arabic RTL MUST be correct across all surfaces: logical CSS direction (no RTL-breaking hardcoded left/right), `dir="ltr"` on coupon codes/emails/URLs/invoice numbers/amounts, correct breadcrumb order, and correct drawer/sidebar open-side.

**Visual consistency (Audit Area 5)**

- **FR-007**: Shared components (buttons, cards, badges, inputs, selects, checkboxes, toggles, modals, drawers, toasts, dropdowns, action menus, table rows, empty states, skeletons, spacing, typography, shadows, radii, gradients, icon sizes) MUST be visually consistent across public/merchant/admin via the shared design system, with no ad-hoc drift, weak spacing, or low-contrast text, while preserving each surface's role (public premium/travel; merchant practical/app-like; admin owner/operator).

**JavaScript interactions (Audit Area 6)**

- **FR-008**: All interaction primitives MUST work without console errors, broken selectors, stuck-open dropdowns, lost focus return, non-working copy, accidental form reloads, missing validation errors, duplicated listeners/repeated toasts, non-opening row menus, no-op toggles, non-clearing resets, stale result counts, missing empty states, or stuck body-scroll. No browser `alert()`/`confirm()`/`prompt()` may be used.

**Forms (Audit Area 7)**

- **FR-009**: Every form MUST have labeled required fields, inline errors with `aria-invalid`/`aria-describedby` where relevant, email validation, working password confirmation where applicable, required terms checkbox where applicable, an honest success toast/inline message on valid submit, no unintended reload (only intended GET search may navigate), and no implication of backend storage or real API.

**Content honesty (Audit Area 8)**

- **FR-010**: All copy MUST be free of false claims (live prices, guaranteed discounts, real booking/payment/invoice, real API/scraping connected, real email/WhatsApp sent, real analytics tracking, real CMS publishing, real account/settings/team/billing saved, real suspension/plan change, visa guarantees, "AI active" when not implemented), replaced with approved safe Arabic/English wording; state MUST be session-only.

**SEO & semantics (Audit Area 9)**

- **FR-011**: Public pages MUST have exactly one `<h1>`, correct heading hierarchy, Arabic title + meta description (non-duplicated across important pages), semantic landmarks, descriptive links/alt text, substantial content on blog/article/destination pages, and valid non-misleading JSON-LD where present; dashboard/admin pages MUST have one `<h1>`, sensible hierarchy, and semantic tables/lists/forms.

**Accessibility (Audit Area 10)**

- **FR-012**: The platform MUST meet WCAG 2.1 AA for the audited concerns: visible focus, keyboard navigation, skip link where used, modal/drawer close + Esc + focus return, form labels and error messaging, `aria-invalid`/`aria-describedby`, `aria-live` for dynamic results/status, icon-only button labels, sufficient contrast, adequate touch targets, meaningful alt text, reduced-motion respect, table headers, and correct button-vs-link usage. If automated axe is blocked locally, the report MUST document the reason and substitute a manual audit.

**Performance & assets (Audit Area 11)**

- **FR-013**: There MUST be no external CDN (scripts/fonts/images), only local fonts, correctly-referenced CSS build output, no missing/broken image or SVG paths, no duplicated scripts, all scripts `defer`, no unused framework imports, no external chart/table/date libraries, and no runtime fetch dependency for core content (pages render without a backend). The build (`npm run build`) and the stack-compliance grep MUST pass.

**File & structure cleanup (Audit Area 12)**

- **FR-014**: The repository MUST have consistent folders and correct relative paths, no accidental backup files, no duplicate/broken scripts, no dead temporary demo code, consistent data files, and rendering styleguide/components (which MUST NOT be deleted). QA notes/README MUST be updated where useful.

**End-to-end flows (Audit Area 13)**

- **FR-015**: The public visitor flow, merchant flow, and admin flow (as enumerated in the input) MUST each be completable end-to-end with no broken link or dead control.

**Non-regression (Audit Area 14)**

- **FR-016**: All prior specs (001–010) MUST still render and behave correctly; any regression introduced by link rewiring or shared JS/CSS edits MUST be fixed. Shared assets that other specs depend on MUST NOT be broken by a fix.

**Constraints (cross-cutting)**

- **FR-017**: The feature MUST NOT add product features, add new pages (the 4 Spec 008 pages stay unbuilt/coming-soon), redesign the visual identity, change the constitution, introduce frameworks, remove working sections, or implement any backend/database/API/auth/payment/notification/scraping/analytics/CMS/upload/export. Fixes MUST be small and surgical, reusing the existing `window.TUI` utilities and existing project JS, with all scripts kept `defer`.

### Key Entities *(include if feature involves data)*

- **QA Report** (`QA-FRONTEND-CHECKLIST.md`): The single deliverable. Holds summary/status, commands run, the page-inventory table, grouped issues-found-and-fixed, remaining notes, and the final confirmation checklist.
- **Page Inventory**: The 32 existing pages across three surfaces, plus the 4 documented-absent Spec 008 pages, each with audit status flags (renders / nav / mobile / RTL / interactions) and notes.
- **Issue Record**: A found problem categorized (navigation/responsive/RTL/visual/JS/forms/a11y/SEO/honesty/performance/cleanup) with its location, the fix applied, and resulting status.
- **Audit Gate**: An automatable check (build, stack-grep, html-validate, console-clean, a11y) with a pass/fail result recorded in the report.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 32 expected pages render; the 4 absent Spec 008 pages are documented and 0 references link to them as real destinations.
- **SC-002**: 0 dead buttons and 0 broken internal links across all 32 pages; every clickable element performs one allowed visible behavior.
- **SC-003**: 0 console errors and 0 failed asset (CSS/JS/icon/image) requests on every page.
- **SC-004**: The stack-compliance grep returns 0 real hits for `react|vue|angular|bootstrap|jquery|cdn.tailwindcss|alert(|confirm(|prompt(`; any false positive is documented and justified.
- **SC-005**: `npm run build` completes with 0 errors and regenerates the CSS build output; `npx html-validate` reports 0 errors across all pages.
- **SC-006**: 0 instances of browser `alert()`/`confirm()`/`prompt()`; 100% of destructive actions are gated by custom confirmation modals.
- **SC-007**: 0 horizontal-overflow occurrences at 320 / 360 / 390 / 768 / 1024 / 1280px on every audited surface; dense dashboard/admin tables remain usable on mobile.
- **SC-008**: RTL renders correctly on 100% of surfaces; 100% of Latin code/email/URL/invoice/amount runs carry `dir="ltr"`.
- **SC-009**: Public/merchant/admin surfaces use one consistent design system (no ad-hoc component drift found in the consistency spot-check).
- **SC-010**: 100% of forms validate inline (labels + `aria-invalid`/`aria-describedby`) and show honest, non-backend-implying success messaging with no unintended reloads.
- **SC-011**: 0 copy instances falsely claim real APIs, bookings, auth, payments, notifications, scraping, analytics, billing, publishing, or persistence; all mock state restores on reload.
- **SC-012**: Each public page has exactly one `<h1>`, an Arabic title + meta description, and valid non-misleading JSON-LD where present.
- **SC-013**: The three end-to-end flows (public visitor, merchant, admin) each complete with 0 broken links or dead controls.
- **SC-014**: All prior specs (001–010) still render with 0 regressions; styleguide/components still render.
- **SC-015**: `QA-FRONTEND-CHECKLIST.md` exists and records every gate above with a final status of PASS or PASS WITH NOTES (FAIL only if a P1 acceptance criterion is unmet), and any limitation (e.g., axe blocked locally → manual audit) documented honestly.

## Assumptions

- **Three surfaces, 32 pages, 4 documented-absent**: The audit scope is the 32 existing pages; the 4 Spec 008 pages are intentionally unbuilt and stay coming-soon (not built in this spec, per "do not add new pages").
- **Frontend-only by design**: There is no backend; all forms, actions, and data are mock/session-only. "Success" messaging is honest about this; this is a documented known limitation, not a defect.
- **Mock integrations/exports/charts**: Integrations, exports, and all chart-like visuals are static/mock (charts are CSS/HTML, no chart library); these are documented limitations, not defects.
- **Reuse existing utilities**: Fixes reuse the existing `window.TUI` primitives and existing project JS (`ui.js`, `main.js`, `dashboard.js`, `discovery.js`, `content.js`, `member.js`, `admin.js`); no new framework or shared-architecture rewrite.
- **Automated a11y may be environment-limited**: If axe-core cannot run headlessly in the local environment, a manual WCAG 2.1 AA audit is substituted and the limitation is documented honestly in the report.
- **Surgical edits preferred**: The work favors small consistency/link/copy/a11y fixes over page rewrites; existing working sections are preserved.
- **Constitution and identity unchanged**: The governing constitution, the design tokens, and the visual identity are not modified.
- **Tooling available**: `npm run build`, `npx html-validate`, `prettier`, and `stylelint` are available locally (as used in Specs 001–010); the static `npx serve .` is available for manual browser/console checks.
