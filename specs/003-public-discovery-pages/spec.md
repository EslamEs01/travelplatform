# Feature Specification: Public Discovery & Monetization Pages (Travel SaaS Platform)

**Feature Branch**: `003-public-discovery-pages`
**Created**: 2026-06-01
**Status**: Draft
**Input**: User description: "Create Spec 003 for the public discovery and monetization pages of the Travel SaaS Platform — the public pages the homepage links to: compare.html, deals.html, coupons.html, deal-details.html. Reuse the Spec 001 foundation and Spec 002 homepage patterns (shell, tokens, cards, badges, forms, modals, drawers, toasts, JS utilities). Do not rebuild the foundation, rewrite the homepage, change the constitution, redesign the visual identity, or implement destinations/blog, member, merchant, or admin pages. No backend, database, real APIs, scraping, payments, authentication, or booking logic. After creating the pages, update homepage/public navigation links where appropriate so CTAs that should now point to real pages no longer use coming-soon behavior; do not remove existing homepage sections."

## Overview

This feature builds the **public discovery and monetization pages** that the completed homepage (Spec 002) already gestures toward but, until now, could only reach through the "coming soon" affordance. It adds four real, standalone public pages — a **deals listing** (`deals.html`), a **deal details** page (`deal-details.html`), an **offer comparison** page (`compare.html`), and a **coupons listing** (`coupons.html`) — and then **rewires the homepage and shared navigation** so the call-to-action links that should now resolve to these real surfaces stop showing the "coming soon" toast and instead navigate to the new pages.

Every page is composed **entirely on top of the existing foundation** — the same Arabic-first RTL shell (top bar + slide-in drawer + footer), the same design tokens, the same reusable components (buttons, cards, badges, modals, drawers, toasts, form fields, skeletons, empty states), and the same `window.TUI` interaction utilities and `data-*` behaviors used by the homepage. No new visual identity is introduced; no foundation artifact or homepage section is rebuilt, removed, or downgraded. The pages reuse and extend the existing realistic mock data (deals, coupons, destinations) so that any deal, coupon, or destination referenced on the homepage stays consistent on the new pages.

This phase completes the **public visitor's discovery funnel**: from the homepage, a traveler can now browse the full set of deals, open any deal to see its full details and a safe primary action, compare equivalent offers from multiple trusted sources side by side, and find and copy discount coupons — all as believable, clearly-mock, frontend-only experiences with zero dead interactions.

## Scope

**In scope**:

- Four new standalone public pages, fully implemented, polished, and production-grade:
  - `travel-saas-frontend/pages/deals.html` — browsable, filterable, sortable deals listing.
  - `travel-saas-frontend/pages/deal-details.html` — single-deal detail page with primary CTA, trust signals, related deals, and help/FAQ.
  - `travel-saas-frontend/pages/compare.html` — side-by-side comparison of mock offers for a trip across multiple sources.
  - `travel-saas-frontend/pages/coupons.html` — browsable, filterable coupons listing with copyable codes.
- Realistic, consistent mock content the pages need (reusing and additively extending `assets/data/*.json`), and any page-only imagery placeholders.
- **Homepage and shared navigation rewiring**: updating CTAs, card links, section "view all" links, header/drawer/footer navigation, and the homepage hero search destination so the controls that should now point to these real pages navigate to them instead of using the "coming soon" toast. Controls that target surfaces still not built in this spec (destinations, blog/guides, auth, saved deals, price alerts, dashboards, admin) keep the "coming soon" affordance.

**Out of scope** (explicitly):

- Rebuilding or modifying the Spec 001 foundation (design system, shell, components, JS utilities, styleguide, components showcase) beyond additive mock-content data and additive, opt-in, non-breaking script enhancements.
- Rewriting or restructuring the Spec 002 homepage; **no existing homepage section is removed or redesigned**. Homepage changes are limited to rewiring links/CTAs (and minimal supporting hooks) so they reach the new pages.
- Modifying the constitution or introducing any new/second visual identity, color system, typography, or component style.
- Destinations / destination-details pages, blog / article pages (the homepage guides teaser keeps its "coming soon" action).
- Member / traveler account pages (auth, saved deals, price alerts beyond the existing frontend-only homepage capture).
- Merchant (travel agency) dashboard pages and SaaS owner admin pages.
- Any backend, database, real APIs, real scraping/price feeds, real payments, real authentication, or real booking logic. All prices, offers, sources, and codes are realistic mock data and MUST NOT imply live/real data.

## Clarifications

### Session 2026-06-01

- Q: What should the Compare page (`compare.html`) actually compare? → A: **Source offers for one trip** — it aggregates multiple providers' offers (Partner / Affiliate / Manual Deal / API Ready) for the *single* searched trip and shows them side by side. It is NOT a shortlist of different deals the visitor assembles.
- Q: How is trip context (search→compare) and the selected deal (card→deal-details) carried between pages, and is filter/sort state deep-linkable? → A: **URL query parameters** — destination/travel intent, the deal `id`, and listing/comparison filter+sort state are encoded in the URL (read client-side) so every view is deep-linkable, shareable, bookmarkable, and backend-ready; pages fall back to a sensible default when params are absent or invalid.
- Q: What should the deal-details primary CTA ("Request Booking", frontend-only) do? → A: **Open a validated inquiry modal/form** capturing at least name, contact, and travel details, with visible valid/invalid/error/success states; the submission is frontend-only — nothing is sent to a backend and no real booking/payment occurs.
- Q: How is the deals dataset organized so the homepage and `deals.html` stay consistent? → A: **A new additive `assets/data/deals.json`** holds the full deals catalog (≥9); the homepage's featured deals are a consistent subset that references the same entities (same id/title/price/source).

## User Scenarios & Testing *(mandatory)*

The beneficiary is a **public visitor / prospective traveler** (Arabic-first, mobile-dominant) who arrives — usually from the homepage — wanting to discover deals, understand a specific offer, compare options across trusted sources, and grab a discount. The feature also serves the **business** by turning the homepage's promises into real, SEO-strong, conversion-oriented public pages that demonstrate the platform's comparison-marketplace thesis, all backend-ready.

### User Story 1 - Browse, filter & sort travel deals (Priority: P1) 🎯 MVP

A visitor leaves the homepage's curated featured deals and opens the full **deals listing** to discover everything on offer. They see a rich grid of believable deal cards (each with a source badge, "starting from" price, rating, and a safe-labeled action), and they can **narrow results with filters** (e.g., destination/region, source type, price range), **sort** them (e.g., by price or rating), **reset** all filters, and understand when no deals match (a branded empty state) or while content is settling (a loading/skeleton state). Every card and control does something observable.

**Why this priority**: The deals listing is the canonical public "listing page" and the core discovery surface beyond the homepage. It is the most self-contained, independently valuable slice — a visitor can discover and shortlist deals on its own — and it establishes the listing contract (filters/sort/empty/skeleton/reset) that the coupons page reuses. This is the demonstrable MVP of the discovery phase.

**Independent Test**: Open `deals.html` at 360px and at desktop. Confirm it renders Arabic RTL with a single `<h1>`, a grid of at least the required number of deal cards (correct source badges, "starting from" pricing, safe CTA labels), working filters that narrow the visible set, working sort that reorders it, a visible reset that restores the full set, a branded empty state when filters exclude everything, and a loading/skeleton state — with no horizontal scroll and no dead controls.

**Acceptance Scenarios**:

1. **Given** a visitor on a 360px phone, **When** `deals.html` loads, **Then** it renders Arabic RTL with one primary heading and a grid of believable deal cards, each showing a source badge (Partner / Affiliate / Manual Deal / API Ready), "starting from" pricing, a rating, and a safe-labeled CTA — with no horizontal scrolling.
2. **Given** the deals listing, **When** the visitor applies one or more filters (e.g., source type and/or price range and/or destination), **Then** the visible deals narrow to only those matching, and a clear indication of the active filters and result count is shown.
3. **Given** active filters that match nothing, **When** the result set is empty, **Then** a branded empty state appears with a clear reset-filters action — never a blank or broken section.
4. **Given** applied filters/sort, **When** the visitor activates reset, **Then** all filters clear and the full, default-sorted deal set returns.
5. **Given** the sort control, **When** the visitor changes the sort order (e.g., price ascending, rating descending), **Then** the visible deals reorder accordingly.
6. **Given** any deal card, **When** the visitor activates its primary action, **Then** it navigates to that deal's details page (`deal-details.html?id=…`) — never a dead link, and never a browser dialog.

---

### User Story 2 - View a deal's full details & take a safe action (Priority: P2)

From a deal card (on the homepage or the deals listing), the visitor opens the **deal details** page to evaluate a single offer in depth. They see the full information (title, destination, imagery/gallery placeholders, "starting from" price, rating and reviews, inclusions/highlights, source attribution badge, and cancellation/terms indicators framed as illustrative), a clear **primary call-to-action** with a safe label (e.g., Request Booking / View Deal), supporting trust signals, a set of **related deals**, and a **help/FAQ** section answering common questions about the offer. The primary CTA performs a visible frontend-only action (it never processes a real booking or payment).

**Why this priority**: The details page completes the discovery → consideration funnel and satisfies the constitution's detail-page contract (main info + primary CTA + related items + FAQ). It depends on deals existing (US1) but adds the depth and the conversion moment that make the listing meaningful. It is independently testable against any single deal.

**Independent Test**: Open `deal-details.html` for a known deal. Confirm it renders Arabic RTL with one `<h1>` (the deal title), complete deal information consistent with the same deal on the homepage/listing, a safe-labeled primary CTA that performs a visible frontend-only action, trust/terms indicators, a related-deals section, and a help/FAQ section — with valid detail-level structured data and no dead controls.

**Acceptance Scenarios**:

1. **Given** a visitor selecting a specific deal from the homepage or deals listing, **When** the deal details page opens, **Then** it shows that deal's full, consistent information (title, destination, imagery, "starting from" price, rating/reviews, highlights/inclusions, source badge, terms/cancellation indicator) clearly framed as illustrative mock content.
2. **Given** the deal details page, **When** the visitor activates the primary CTA (e.g., Request Booking), **Then** a validated inquiry modal/form opens capturing name, contact, and travel details with visible validation states and, on valid submit, a success confirmation — no real booking, no payment, no browser dialog, and nothing implying server-side processing.
3. **Given** the deal details page, **When** the visitor reaches the related-deals section, **Then** at least the required number of related deal cards are shown and each links to its own details page or the deals listing.
4. **Given** the deal details page, **When** the visitor opens the help/FAQ section, **Then** at least the required number of common questions are answered with substantial content, exposed as valid FAQ structured data.
5. **Given** a request for a deal that cannot be resolved (e.g., an unknown identifier), **When** the page loads, **Then** it shows a graceful fallback (a default/representative deal or a branded not-found state with a link back to the deals listing) — never a broken or empty page.

---

### User Story 3 - Compare offers across trusted sources (Priority: P3)

The visitor uses the **comparison** page — the real destination of the homepage hero search and of "compare" CTAs — to view multiple offers for a comparable trip **side by side across several sources**. The comparison echoes the trip context they came in with (e.g., destination/dates/travelers, when provided), lists believable mock offers each carrying a **source badge** (Partner / Affiliate / Manual Deal / API Ready) and "starting from" price, lets them **sort** (e.g., by price or rating) and **filter** (e.g., by source), and offers a safe action per offer (e.g., Compare Offer / View Deal leading to the deal details). The page makes the platform's core promise — *compare deals from many trusted sources in one place* — tangible, while never claiming the prices are live.

**Why this priority**: Comparison is the platform's headline value proposition and the natural landing surface after the homepage search. It is prioritized below the listing and details because it builds on the same deal/offer data and card/badge patterns and is most compelling once deals and details exist. It is independently testable as the search destination.

**Independent Test**: Open `compare.html` (including via the homepage hero search) at 360px and desktop. Confirm it renders Arabic RTL with one `<h1>`, echoes any provided trip context, presents at least the required number of comparable offers across **multiple distinct sources** (with correct source badges and "starting from" pricing), supports sorting and filtering that reorder/narrow the offers, provides a safe action per offer, and shows a branded empty state when filters exclude everything — with no dead controls.

**Acceptance Scenarios**:

1. **Given** a visitor arriving at `compare.html` from the homepage hero search, **When** the page loads, **Then** it visibly echoes the entered trip context (e.g., destination and travel intent) and presents a set of comparable mock offers across multiple sources, each with a source badge and "starting from" price.
2. **Given** the comparison view, **When** the visitor sorts (e.g., price ascending) or filters (e.g., by source type), **Then** the offers reorder/narrow accordingly and the active sort/filter and result count are visible.
3. **Given** a comparison offer, **When** the visitor activates its safe action (e.g., Compare Offer / View Deal), **Then** it navigates to that offer's deal-details page (`deal-details.html?id=…`) — never a dead link.
4. **Given** the comparison page reached directly without any trip context, **When** it loads, **Then** it shows a sensible default comparison (a representative trip) rather than an empty or broken page, clearly framed as illustrative.
5. **Given** the comparison content, **When** the visitor reads it, **Then** it is unmistakably believable mock data and never implies live prices or active real integrations.

---

### User Story 4 - Find & copy discount coupons (Priority: P4)

The visitor opens the full **coupons listing** to find discount codes beyond the homepage's small selection. They browse believable coupon cards (each with title, merchant/source attribution and badge, discount value, validity/terms framed as illustrative, and a **copyable code**), can **filter** them (e.g., by source type or category), **reset** filters, see a branded **empty state** when nothing matches, and **copy any code** with a visible success confirmation. Coupons referenced on the homepage remain consistent here.

**Why this priority**: The coupons page is the monetization-oriented listing and reuses the listing contract established by the deals page plus the copy-to-clipboard utility already proven on the homepage. It is valuable but the most self-contained and least dependent of the four, so it is sequenced last while still being independently testable.

**Independent Test**: Open `coupons.html` at 360px and desktop. Confirm it renders Arabic RTL with one `<h1>`, a grid of at least the required number of coupon cards (with source badges and illustrative validity/terms), working filters and reset, a branded empty state when filters exclude everything, and a copy control on each coupon that copies the code and shows a visible success confirmation — never a browser dialog, with no dead controls.

**Acceptance Scenarios**:

1. **Given** a visitor on a 360px phone, **When** `coupons.html` loads, **Then** it renders Arabic RTL with one primary heading and a grid of believable coupon cards (title, merchant/source attribution with badge, discount value, illustrative validity/terms, copyable code) — with no horizontal scrolling.
2. **Given** a coupon card, **When** the visitor activates its copy control, **Then** the code is copied to the clipboard and a visible success confirmation (toast/inline) appears — never a browser dialog.
3. **Given** the coupons listing, **When** the visitor applies a filter (e.g., source type or category), **Then** the visible coupons narrow accordingly, with active filters and result count shown; **When** the visitor resets, **Then** the full set returns.
4. **Given** filters that match nothing, **When** the result set is empty, **Then** a branded empty state with a reset action appears — never a blank or broken section.

---

### User Story 5 - Reach the new pages from the homepage & shared navigation (Priority: P2)

A visitor on the homepage (or anywhere in the shared shell) follows the natural calls-to-action — the hero search, "view all deals", "browse coupons", "compare offers", a deal card, the header/drawer/footer links — and now **lands on the real pages** instead of seeing a "coming soon" toast. Links that target surfaces still unbuilt in this spec continue to show "coming soon", so there are still no dead ends.

**Why this priority**: Without this wiring, the new pages exist but the homepage's promises stay unfulfilled; it is the integration step that makes the discovery funnel real. It is P2 because it directly multiplies the value of the listing/details work and is testable as soon as any new page exists, but it depends on those pages being present.

**Independent Test**: From the homepage and shared shell, activate each navigation control that should now resolve to a new page (hero search, deals/compare/coupons entry points, deal cards) and confirm it navigates to the correct new page with context preserved where applicable; confirm controls for still-unbuilt surfaces (destinations, blog/guides, auth, saved deals, dashboards, admin) still show "coming soon"; confirm **no existing homepage section was removed** and the visual identity is unchanged.

**Acceptance Scenarios**:

1. **Given** the homepage hero search, **When** the visitor submits a valid query, **Then** it navigates to `compare.html` carrying the entered trip context (instead of only showing a "coming soon" toast).
2. **Given** the homepage featured-deals, coupons, and any "view all"/compare CTAs, **When** the visitor activates the ones that now have real destinations, **Then** they navigate to `deals.html`, `coupons.html`, `compare.html`, or a specific `deal-details.html` as appropriate — not a "coming soon" toast.
3. **Given** the shared header, drawer, and footer navigation, **When** the visitor uses links to deals/compare/coupons, **Then** those links resolve to the real pages, consistently across all pages using the shell.
4. **Given** links to surfaces still out of scope (destinations, blog/guides, auth, saved deals, dashboards, admin), **When** activated, **Then** they keep the existing "coming soon" visible action — no dead links.
5. **Given** the rewired homepage, **When** it is reviewed against the Spec 002 baseline, **Then** every existing section is still present and the visual identity is unchanged.

---

### Edge Cases

- **Very small / very large screens**: All four pages hold from ~320px to wide desktop with no horizontal scrolling and no broken composition; listing grids, the comparison layout, and the details layout reflow gracefully. The comparison table/cards remain readable and usable on the smallest screens (no cramped multi-column tables).
- **Mixed-direction content in RTL**: Latin destination names, prices, dates, ratings, and coupon codes display correctly within Arabic RTL without misalignment; coupon codes (Latin/numeric) remain legible and copyable.
- **Long Arabic strings**: Deal titles, descriptions, inclusions, coupon terms, and FAQ answers wrap gracefully without overflowing cards, comparison cells, or the grid.
- **No results / empty data**: Every listing and the comparison view handle an empty result set (from filtering or absent data) with a branded empty state and a clear reset/return action — never a blank screen.
- **Unknown or missing deal/comparison context**: `deal-details.html` with an unknown/absent deal identifier and `compare.html` with no trip context both degrade gracefully (representative default or branded not-found with a path back) — never a broken or empty page.
- **JavaScript unavailable**: Core content of each page (deal/coupon cards and copy, deal details information, comparison offers, headings, footer) still renders and is readable; enhanced interactions (filter, sort, copy, modal, inquiry form, hero-search navigation) degrade gracefully rather than leaving dead controls.
- **Slow or missing images**: Image areas reserve space (no layout shift) and use a placeholder/skeleton; every image has meaningful alternative text.
- **Keyboard-only & assistive use**: All interactive elements (filters, sort, reset, card CTAs, copy controls, comparison actions, modal/inquiry triggers, form fields) are reachable and operable by keyboard with visible focus; modals/drawers manage focus; result/empty-state changes are announced to assistive technology.
- **Reduced-motion preference**: Card hover, filtering transitions, and any reveal animations respect the user's reduced-motion setting.
- **Duplicate / rapid actions**: Repeatedly copying a code, re-applying filters, or re-submitting an inquiry produces consistent, non-duplicated visible feedback (no stacked broken states).
- **Mock-data consistency**: A deal, destination, or coupon shown on the homepage appears with identical details (title, price, source, code) on the new pages; no contradictory values across pages.

## Requirements *(mandatory)*

### Functional Requirements

**Foundation & homepage reuse / non-regression**

- **FR-001**: The four pages MUST be implemented at `travel-saas-frontend/pages/deals.html`, `travel-saas-frontend/pages/deal-details.html`, `travel-saas-frontend/pages/compare.html`, and `travel-saas-frontend/pages/coupons.html`, each reusing the existing foundation — the shared shell (top bar + slide-in drawer + footer), design tokens, reusable components (buttons, cards, badges, modals, drawers, toasts, form fields, skeletons, empty states), and `window.TUI` interaction utilities / `data-*` behaviors — without introducing a different visual identity or a second design system.
- **FR-002**: The feature MUST NOT rebuild, remove, or downgrade any existing foundation artifact (design system, shell, components, JS utilities, styleguide, components showcase) or any existing homepage section. Changes to shared files are limited to: (a) additive, page-supporting mock-content data and imagery; (b) additive, **opt-in**, non-breaking enhancements to shared scripts that leave all existing behavior intact (e.g., a new opt-in `data-*` behavior for filtering/sorting or for navigating the hero search); and (c) link/CTA target updates required for navigation integration (FR-021–FR-024). No existing shared component/utility behavior may change.
- **FR-003**: Each page MUST be a complete, standalone document that renders correctly on its own without a runtime framework or client-side router, consistent with the existing pages, and MUST keep the shared shell consistent with the canonical `partials/` source.
- **FR-004**: All styling MUST come from the existing local build output; every page MUST make zero external CDN requests for CSS, JavaScript, or fonts, and MUST NOT introduce any forbidden technology (React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN).
- **FR-005**: All deal, offer, destination, and coupon content across the pages MUST be realistic, consistent mock data, reusing and additively extending the existing `assets/data/*.json`; an entity shown on the homepage MUST appear with identical details on the new pages, and nothing may imply that live prices or real integrations are active. The full deals catalog (≥9) MUST live in a new additive `assets/data/deals.json`; the homepage's featured deals MUST be a consistent subset that references the same entities (identical `id`/title/price/source).

**Deals listing — `deals.html` (US1)**

- **FR-006**: `deals.html` MUST present a deals listing (sourced from `assets/data/deals.json`) built from the shared card and badge patterns, showing realistic mock deals each with a source badge (Partner / Affiliate / Manual Deal / API Ready), "starting from" pricing, a realistic rating, and a safe-labeled CTA.
- **FR-007**: The deals listing MUST provide **filters** (at minimum: source type, destination/region, and price range) that narrow the visible deals, a visible indication of active filters and the current result count, and a **sort** control offering at least price and rating orderings. The active filter/sort state MUST be reflected in the URL (query parameters) so a filtered/sorted view is shareable and bookmarkable, and MUST be restored from the URL on load.
- **FR-008**: The deals listing MUST provide a clear **reset** action that clears all filters/sort back to the default set, a branded **empty state** (with reset/return action) when no deals match, and a **loading/skeleton** state pattern for content that would load asynchronously in the future.
- **FR-009**: Each deal card's primary action MUST navigate to that deal's `deal-details.html` via a URL query parameter carrying the deal id (e.g., `deal-details.html?id=deal-002`) — a visible action, never a dead control or bare `#` link.

**Deal details — `deal-details.html` (US2)**

- **FR-010**: `deal-details.html` MUST present a single deal's full information using exactly one `<h1>` (the deal title): destination, imagery/gallery placeholders with meaningful alt text, "starting from" price and currency, rating and reviews count, highlights/inclusions, a source attribution badge, and cancellation/terms indicators framed as illustrative.
- **FR-011**: The deal details page MUST present a clear **primary CTA** with a safe label (e.g., Request Booking / View Deal) that opens a **validated inquiry modal/form** capturing at least name, contact, and travel details, with visible valid / invalid / error / success states; the submission MUST be frontend-only — it never processes a real booking or payment, transmits/persists nothing, and never implies server-side processing.
- **FR-012**: The deal details page MUST include a **related-deals** section (reusing the card pattern) with at least the required number of related deals, each linking to its own details page or the deals listing, and a **help/FAQ** section answering at least the required number of common questions.
- **FR-013**: The deal details page MUST resolve which deal to show from a URL query parameter (`?id=`) read client-side against the shared mock data (`assets/data/deals.json`), and MUST degrade gracefully when the id is absent or unknown (a representative default deal or a branded not-found state linking back to the deals listing) — never a broken or empty page.

**Compare offers — `compare.html` (US3)**

- **FR-014**: `compare.html` MUST present a **side-by-side comparison** of at least the required number of believable mock offers for a **single trip**, aggregating multiple providers' offers drawn from **multiple distinct sources** (not a shortlist of unrelated deals), each offer carrying a source badge (Partner / Affiliate / Manual Deal / API Ready) and "starting from" pricing, using shared card/badge/table patterns and remaining readable and usable down to ~320–360px.
- **FR-015**: The comparison page MUST receive its trip context via **URL query parameters** (e.g., destination and travel intent from the homepage hero search), read client-side, and MUST visibly **echo** that context; when reached without context (absent/invalid params), it MUST show a sensible default/representative single-trip comparison rather than an empty page — clearly framed as illustrative.
- **FR-016**: The comparison page MUST support **sorting** (at least by price and rating) and **filtering** (at least by source type) that reorder/narrow the offers with visible active state and result count, MUST reflect the active sort/filter (alongside the trip context) in the URL so the view is shareable and restored on load, and MUST show a branded empty state when filters exclude everything.
- **FR-017**: Each comparison offer MUST provide a safe-labeled action (e.g., Compare Offer / View Deal) that navigates to the corresponding `deal-details.html?id=` for that trip/offer — a visible action, never a dead control.

**Coupons listing — `coupons.html` (US4)**

- **FR-018**: `coupons.html` MUST present a coupons listing built from the shared card/badge patterns, showing realistic mock coupons each with a title, merchant/source attribution and source badge, discount value, validity/terms framed as illustrative, and a **copyable code** using the existing copy-to-clipboard utility with a visible success confirmation (toast/inline) — never a browser dialog.
- **FR-019**: The coupons listing MUST provide **filters** (at minimum: source type and category) that narrow the visible coupons with visible active state and result count, a clear **reset** action, and a branded **empty state** (with reset action) when no coupons match.
- **FR-020**: Coupons shown on the homepage MUST remain consistent on `coupons.html` (same code, discount, source, and terms), reusing/extending the shared coupons mock data.

**Cross-page navigation & homepage integration (US5)**

- **FR-021**: The homepage hero search MUST, on a valid submit, **navigate to `compare.html`** carrying the entered trip context as URL query parameters (so the comparison page can read and echo it), replacing the prior "coming soon" / inline-only behavior for that control.
- **FR-022**: Homepage CTAs and links that now have real destinations — featured-deal cards, "view all deals", coupons / "browse coupons", and any compare CTA — MUST be rewired to navigate to `deals.html`, a specific `deal-details.html`, `coupons.html`, or `compare.html` respectively, instead of showing the "coming soon" toast.
- **FR-023**: The shared header, drawer, and footer navigation links for deals, compare, and coupons MUST resolve to the real pages consistently across every page that uses the shell, kept in sync with the canonical `partials/` source.
- **FR-024**: Links and CTAs targeting surfaces still out of scope (destinations, destination-details, blog/guides, auth, saved deals, price alerts beyond the existing homepage capture, merchant dashboard, SaaS owner admin) MUST keep the existing "coming soon" visible action and MUST NOT navigate to non-existent pages; **no existing homepage section may be removed** and the visual identity MUST be unchanged.

**Interaction integrity, accessibility, responsiveness**

- **FR-025**: Every interactive element on every new page MUST perform exactly one observable action (navigate to a real existing page or in-page anchor, open a modal, open the drawer, toggle a visible state, show a toast, copy a value, apply/clear a filter or sort, or submit a frontend-validated form). Dead controls and bare `#` links without a handled action are FORBIDDEN.
- **FR-026**: Browser `alert()`, `confirm()`, and `prompt()` MUST NOT be used anywhere; all feedback MUST use the existing toast, modal, drawer, or inline-message patterns. Any form (filters, inquiry, etc.) MUST show visible frontend validation states (valid / invalid / error / success) where input is required.
- **FR-027**: Arabic right-to-left MUST be the default experience on all four pages; the structure MUST remain English-ready (no hard-coded directional assumptions) so the layout mirrors correctly with no visual breakage when direction is flipped to LTR.
- **FR-028**: Each page MUST be mobile-first and responsive, fully usable from ~320–360px up to desktop, with the mobile experience feeling close to a native app (app-like navigation, comfortable touch targets ≥ ~44px) and zero horizontal scrolling on mobile.
- **FR-029**: Each page MUST meet WCAG 2.1 Level AA: AA contrast for text and meaningful UI, full keyboard operability with visible focus, focus management for modals/drawers, meaningful image alternatives, labels and programmatically-linked error messaging for all form fields, announcement of result/empty-state changes to assistive technology, and respect for reduced-motion preferences.

**SEO & backend-readiness**

- **FR-030**: Each page MUST be a non-thin, content-rich, SEO-friendly page using semantic HTML, exactly one `<h1>`, and a correct heading hierarchy, with the required document meta (title, description, language/direction, viewport, theme color, Open Graph baseline) appropriate to that page.
- **FR-031**: `deal-details.html` MUST expose valid product/offer-appropriate structured data for the deal and valid `FAQPage` structured data for its help/FAQ; listing and comparison pages MUST expose appropriate structured data (e.g., item-list / breadcrumb) consistent with the existing structured-data approach. All structured data MUST describe the mock content honestly and MUST NOT assert live pricing.
- **FR-032**: Markup MUST remain semantic and backend-ready for later server-side template integration (predictable, stable structure; shared shell kept consistent with `partials/`), with no dependency on a client-side runtime to render core content.

### Key Entities

- **Deal (mock)**: A believable travel deal — stable id, title, destination, imagery + alt, "starting from" price and currency, rating and reviews count, source label (Partner / Affiliate / Manual Deal / API Ready) and badge, descriptive highlights/inclusions, terms/cancellation indicator, and a safe-labeled CTA. Reuses/extends the existing featured-deals schema and is stored in the catalog file `assets/data/deals.json` (≥9), with the homepage's featured deals being a consistent subset; never implies live pricing. Shared across the homepage, deals listing, comparison, and details pages.
- **Deal Offer / Comparison Row (mock)**: One source's offer for a comparable trip — source label and badge, "starting from" price, rating, and a safe action — used to populate the side-by-side comparison; multiple offers from distinct sources for the same trip.
- **Coupon / Offer (mock)**: A discount offer — id, title, merchant/source attribution and badge, discount value, copyable code, and validity/terms framed as illustrative. Reuses/extends the existing coupons schema; consistent with the homepage.
- **Destination (mock)**: A destination reference (name, country, indicative price/deal count) used for filtering and contextual labeling; reuses the existing destinations data without building a destinations page.
- **Filter & Sort State (frontend-only)**: The visitor's chosen filters (source, destination/region, price range, category) and sort order applied client-side to narrow/reorder listings and the comparison; reflected in the URL (query parameters) for deep-linking/sharing and restored on load; not transmitted to or stored on a backend.
- **Comparison / Search Context (frontend-only)**: The trip context (destination, travel intent) carried from the homepage hero search to the comparison page **via URL query parameters** and echoed there; used only for display, not transmitted to or stored on a backend.
- **Booking Inquiry (frontend-only)**: The visitor's intent expressed via the details-page primary CTA — captured in a **validated inquiry modal/form** (at least name, contact, and travel details) with valid/invalid/error/success states, visibly confirmed on submit, persisting/transmitting nothing and never implying a real booking, payment, or server-side processing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four pages (`deals.html`, `deal-details.html`, `compare.html`, `coupons.html`) render correctly as standalone files at a 360px mobile viewport and at desktop, with zero horizontal scrolling on mobile.
- **SC-002**: Across all four pages, 100% of interactive elements produce a visible action; there are zero dead buttons, zero bare `#` links without a handled action, and zero browser `alert()`/`confirm()`/`prompt()` dialogs.
- **SC-003**: The deals listing presents at least **9** believable deals (each with a correct source badge and safe CTA label), and its filters narrow the visible set, its sort reorders it, and its reset restores the full default set — all verifiable by interaction.
- **SC-004**: When filters exclude every item, the deals listing, coupons listing, and comparison view each show a branded empty state with a working reset/return action — zero blank or broken sections.
- **SC-005**: The deal details page shows complete, consistent information for the selected deal (matching the same deal on the homepage/listing), a safe-labeled primary CTA that opens a validated inquiry modal/form (with valid/invalid/error/success states and a success confirmation), at least **3** related deals, and a help/FAQ answering at least **3** common questions.
- **SC-006**: Requesting the deal details page with an unknown/absent identifier yields a graceful fallback (representative default or branded not-found with a link back) in 100% of cases — never a broken or empty page.
- **SC-007**: The comparison page presents at least **4** comparable offers drawn from at least **3** distinct sources, visibly echoes any provided trip context (and shows a sensible default when none is provided), and its sort and filter reorder/narrow the offers.
- **SC-008**: The coupons listing presents at least **6** believable coupons; every coupon code can be copied via its copy control with a visible success confirmation and zero browser dialogs; its filters and reset work as specified.
- **SC-009**: All entities shown on both the homepage and the new pages are consistent: a spot check of every homepage-referenced deal and coupon finds identical id/title/price/source/code on the corresponding new page (zero contradictions).
- **SC-010**: Homepage and shared-navigation rewiring is verified: the hero search navigates to `compare.html` carrying its context; the deals/compare/coupons/deal CTAs and header/drawer/footer links resolve to the real pages; and 100% of still-out-of-scope links keep the "coming soon" action — with **zero** existing homepage sections removed and the visual identity unchanged versus the Spec 002 baseline.
- **SC-011**: The default rendered experience on all four pages is Arabic RTL; when direction is flipped to LTR, each layout mirrors with no visual breakage (English-ready verified).
- **SC-012**: At least 95% of each page's styling is expressed through the existing design system (tokens/utilities) rather than new ad-hoc, page-specific styles, and no different visual identity is introduced.
- **SC-013**: Each page makes zero external CDN requests for CSS, JavaScript, or fonts, and contains zero occurrences of forbidden technologies (React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN) and zero browser dialogs.
- **SC-014**: Each page passes a structure/SEO check: exactly one `<h1>`, correct heading hierarchy, required document meta present, and valid structured data appropriate to the page (deal/offer + `FAQPage` on details; item-list/breadcrumb on listings/comparison) describing mock content honestly.
- **SC-015**: Each page satisfies WCAG 2.1 AA checks: zero AA contrast/structure violations in an automated audit, and keyboard-only operation can reach and operate 100% of interactive elements including filters, sort, reset, card CTAs, copy controls, comparison actions, and the details-page inquiry form/modal.
- **SC-016**: Each page becomes interactive in under 2 seconds under the defined throttle profile — mobile "Slow 4G" (≈1.6 Mbps down, 150 ms RTT) with 4× CPU throttling.
- **SC-017**: No existing foundation artifact regresses: the styleguide and components showcase still render, the homepage still renders with all Spec 002 sections, and the shared shell on every new page matches the canonical `partials/` source.
- **SC-018**: Views are deep-linkable via URL: visiting `deal-details.html?id=<known>` shows that exact deal; opening `compare.html` with trip-context parameters echoes them and renders the single-trip source-offer comparison; and a filtered/sorted deals or comparison view's URL reproduces the identical view on reload or when shared — with a sensible default shown when parameters are absent or invalid.

## Assumptions

- **Scope is these four public pages plus navigation wiring**: This spec adds only `deals.html`, `deal-details.html`, `compare.html`, and `coupons.html`, and rewires the homepage/shared navigation to reach them. Destinations/destination-details, blog/article, auth, member (saved deals, standalone price alerts), merchant dashboard, and SaaS owner admin pages remain out of scope and keep the "coming soon" affordance.
- **Foundation and homepage are reused, not rebuilt**: Spec 001 (local Tailwind build, Arabic-first RTL shell, header/drawer/footer, design tokens, reusable components, `window.TUI` utilities and `data-*` behaviors) and Spec 002 (the real homepage and its mock-data files: `featured.json`, `coupons.json`, `destinations.json`) are complete and consumed as-is. Additive mock-content data files and imagery placeholders are permitted; additive opt-in, non-breaking script behaviors are permitted; no existing shared behavior or homepage section is changed or removed.
- **No backend**: No real backend, APIs, scraping, price feeds, payments, authentication, or database. The hero-search → compare context pass, listing filters/sort, the deal-details inquiry, and coupon copy are all frontend-only: they validate and confirm visibly but transmit/persist nothing and never imply live prices or server-side processing.
- **Comparison semantics**: Because no real comparison engine exists, `compare.html` renders a frontend-only, clearly-illustrative comparison of mock offers from multiple sources for a **single trip** (price/rating/inclusions aggregated across Partner / Affiliate / Manual Deal / API Ready) — not a shortlist of unrelated deals. The homepage hero search navigates to it carrying the entered context as URL query parameters (read client-side); with absent/invalid params, a representative default single-trip comparison is shown.
- **Deal selection**: `deal-details.html` resolves the target deal from a URL query parameter (`?id=`) read client-side against the shared catalog (`assets/data/deals.json`), with a graceful fallback (default deal or branded not-found) when the id is absent or unknown.
- **Cross-page state via URL**: Trip context, the selected deal id, and listing/comparison filter+sort state are all carried in URL query parameters so every view is deep-linkable, shareable, bookmarkable, and backend-ready; nothing relies on a client-side router and no state is transmitted to or stored on a backend.
- **Deals dataset**: A new additive `assets/data/deals.json` is the single source of truth for the deals catalog (≥9 entities); the homepage's `featured.json` items are kept consistent with (a subset of) the same entities to satisfy cross-page consistency.
- **Listing/detail contracts**: Per the constitution, listing pages (`deals.html`, `coupons.html`, and the comparison) include filters, sorting where relevant, an empty state, a loading/skeleton state where relevant, and a reset action; the detail page (`deal-details.html`) includes main info, a primary CTA, related items, and a FAQ/help section.
- **Source badges & safe labels**: Comparison and deal surfaces use the source badges Partner / Affiliate / Manual Deal / API Ready and the safe action labels (View Deal, Request Booking, Compare Offer, Get Coupon — rendered in their Arabic equivalents), consistent with the homepage and constitution.
- **Mock data only & consistent**: All deals, offers, coupons, and destinations are realistic but clearly not live; entities shared with the homepage stay identical across pages.
- **Language strategy**: Content is authored in Arabic (RTL) for this phase; structure stays English-ready and the existing language-toggle affordance in the shell is reused unchanged.
- **Accessibility target**: WCAG 2.1 Level AA, consistent with the foundation.
- **Browser baseline**: Modern evergreen browsers (Chrome, Edge, Firefox, iOS/macOS Safari), last 2 major versions, consistent with Spec 001/002.
- **Governing constitution**: This feature complies with the project constitution (frontend-first; approved stack only; standalone backend-ready pages; premium & trustworthy; Arabic-first RTL & mobile-first; no dead interactions; listing & detail page contracts; SaaS direction permanent; integration-ready/never-faked; SEO & content quality). The constitution is not modified by this spec.
- **Visual identity preserved**: The new pages keep the established design language; no new color system, typography, or component style is introduced — only composition and content built from existing tokens and patterns.
