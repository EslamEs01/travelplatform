# Feature Specification: Public Homepage (Travel SaaS Platform)

**Feature Branch**: `002-public-homepage`
**Created**: 2026-05-31
**Status**: Draft
**Input**: User description: "Create Spec 002 for the real public homepage of the Travel SaaS Platform. This spec must only cover the public homepage. Reuse all existing patterns from Spec 001 (design system, shell, components, JS utilities). Do not rebuild the foundation, change the constitution, implement dashboards, admin, or any backend. Implement and polish travel-saas-frontend/pages/index.html."

## Overview

This feature elevates the homepage delivered as the Spec 001 *reference page* into the **real, production-grade public homepage** of the Travel SaaS Platform. It is the platform's primary marketing and conversion surface for travelers: it communicates the core value proposition (compare travel deals from many trusted sources in one place), surfaces believable featured deals, popular destinations, and discount coupons, builds trust through social proof, and captures traveler intent through frontend-only validated forms.

The page is built **entirely on top of the Spec 001 foundation** — the same Arabic-first RTL shell (top bar + slide-in drawer + footer), the same design tokens, the same reusable components (buttons, cards, badges, modals, drawers, toasts, form fields, skeletons, empty states), and the same `window.TUI` interaction utilities. No new visual identity is introduced; no foundation artifact is rebuilt, removed, or downgraded.

## Scope

**In scope**: A single page — `travel-saas-frontend/pages/index.html` — finalized as the real public homepage, plus the realistic mock content (e.g., `assets/data/*.json`) and any homepage-only imagery placeholders it needs.

**Out of scope** (explicitly): rebuilding the foundation; modifying the constitution; the design system, shell, components, or JS utilities themselves (they are *reused*, not changed, except additive mock-content data files); any other public page (compare/search results, deals listing, coupons listing, destination detail, blog/article, auth, saved deals, price alerts); merchant dashboard pages; SaaS owner admin pages; and any backend, database, real APIs, scraping, payments, or authentication.

## Clarifications

### Session 2026-05-31

- Q: Since the search/comparison results page and other public pages do not exist yet, what must happen when a visitor uses the homepage's search/comparison entry or clicks a not-yet-built destination? → A: Frontend-only behavior — the search form is validated inline and, on a valid submit, produces a visible non-blocking action (an informative toast that the comparison engine is launching soon, and/or an inline confirmation summarizing the query); links to not-yet-built surfaces use the existing "coming soon" toast affordance. No navigation to non-existent pages and no dead controls.
- Q: How is traveler intent captured (e.g., price alerts / newsletter) given there is no backend? → A: Frontend-only validated capture — the email/price-alert form shows valid/invalid/error states and, on success, a success toast/inline confirmation; nothing is persisted or transmitted, and the UI never implies a real subscription was stored server-side.

## User Scenarios & Testing *(mandatory)*

The beneficiary is a **public visitor / prospective traveler** (Arabic-first, mobile-dominant) who lands on the homepage and must, within seconds, understand what the platform does, trust it, explore believable deals/destinations/coupons, and be able to act — all on a single standalone page with zero dead interactions. The homepage also serves the **business** by presenting a premium, credible, SEO-strong public face that anticipates the platform's future public surfaces.

### User Story 1 - Understand the value & start a comparison (Priority: P1) 🎯 MVP

A first-time visitor opens the homepage on a phone and immediately grasps the platform's promise — *find and compare the best travel deals from many trusted sources in one place* — through a premium Arabic-RTL hero with a clear headline, supporting subtext, credibility cues, and a prominent **search / comparison entry** (e.g., destination + travel dates + travelers). When they fill it in and submit, they get an immediate, visible, non-blocking response (the comparison engine is launching soon) with their query echoed back — never a dead button, never a browser dialog, never a broken page.

**Why this priority**: The hero and its search/comparison entry are the homepage's primary job and conversion moment. If a visitor cannot instantly understand the value and take a first action, nothing else on the page matters. This is the demonstrable MVP of the "real" homepage.

**Independent Test**: Open `index.html` at 360px and at desktop width. Confirm the hero renders in Arabic RTL with a single clear `<h1>`, the value proposition is obvious, the search/comparison entry is visible and usable with comfortable touch targets, and submitting it (empty and filled) produces visible inline validation and a visible non-blocking confirmation — with no horizontal scroll and no dead controls.

**Acceptance Scenarios**:

1. **Given** a visitor on a 360px phone, **When** the homepage loads, **Then** the hero renders Arabic RTL with one primary heading, a concise value proposition, trust/credibility cues, and a visible search/comparison entry, with no horizontal scrolling.
2. **Given** the search/comparison entry, **When** the visitor submits it with required fields empty, **Then** inline validation states appear (invalid/error) and submission is blocked until valid — with no browser `alert()`.
3. **Given** a correctly filled search/comparison entry, **When** the visitor submits, **Then** a visible non-blocking confirmation appears (toast and/or inline message) indicating the comparison is launching soon and echoing the entered criteria — and no navigation to a non-existent page occurs.
4. **Given** any hero call-to-action that targets a not-yet-built surface, **When** it is activated, **Then** it shows the existing "coming soon" visible action rather than navigating to a dead link.

---

### User Story 2 - Explore believable deals, destinations & coupons (Priority: P2)

A visitor scrolls and explores the platform's offering through three reusable, card-based sections: **featured deals** (with source badges and safe action labels), **popular destinations**, and **discount coupons** (each coupon code is copyable with visible confirmation). All content is realistic mock data, clearly never claiming live prices, and every card control does something observable.

**Why this priority**: This is the substance that proves the platform is a real travel-deals marketplace, not a thin landing page. It reuses the card/badge patterns and the copy-to-clipboard utility from the foundation, demonstrating the design system in a production context and anticipating the future deals, destinations, and coupons pages.

**Independent Test**: From the homepage, view the featured-deals, destinations, and coupons sections. Confirm cards render from the shared card/badge patterns with correct source badges (Partner / Affiliate / Manual Deal / API Ready) and safe CTA labels (View Deal / Request Booking / Get Coupon), pricing is framed "starting from" (never live), and activating a coupon's copy control copies the code and shows a visible confirmation toast.

**Acceptance Scenarios**:

1. **Given** the featured-deals section, **When** the visitor views a deal card, **Then** it shows a source badge, realistic "starting from" pricing, a rating, and a safe-labeled CTA; the CTA performs a visible action (e.g., opens a quick-view modal or shows a "coming soon" toast) and never a dead link.
2. **Given** the coupons section, **When** the visitor activates a coupon's copy control, **Then** the coupon code is copied to the clipboard and a visible success confirmation (toast/inline) appears — never a browser dialog.
3. **Given** the popular-destinations section, **When** the visitor selects a destination, **Then** a visible action occurs (quick-view or "coming soon" toast) without navigating to a non-existent page.
4. **Given** all explore sections, **When** the visitor reads the content, **Then** it is clearly believable mock data and never implies that live prices or real integrations are active.

---

### User Story 3 - Build trust & capture intent (Priority: P3)

A considering visitor looks for reasons to trust the platform and a way to stay engaged. They find **social proof** (realistic traveler testimonials/ratings and trusted-partner attribution), a **travel-guides / tips teaser** that strengthens SEO and demonstrates content depth, a **help/FAQ** section answering common traveler questions, and a frontend-only **price-alert / newsletter** capture that validates their email inline and confirms success — without any backend, and without ever implying a real subscription was stored.

**Why this priority**: Trust signals and intent capture turn a credible-looking page into a converting one and complete the "premium & trustworthy" mandate. They build on existing patterns (cards, form fields with validation states, toasts) and round out the SEO/content requirements, but they are enhancements over the core value-and-explore experience.

**Independent Test**: From the homepage, confirm testimonials/partners render as believable mock content with ratings; the guides/FAQ sections present substantial, semantic content (FAQ answers ≥ 3 common questions); and submitting the price-alert/newsletter form empty shows inline validation while a valid email yields a visible success confirmation — with valid `Organization`, `WebSite`, and `FAQPage` structured data present.

**Acceptance Scenarios**:

1. **Given** the social-proof section, **When** the visitor reads it, **Then** believable testimonials/ratings and trusted-partner attribution are shown as clearly mock content.
2. **Given** the price-alert/newsletter form, **When** the visitor submits an invalid or empty email, **Then** inline invalid/error states appear and submission is blocked; **When** a valid email is submitted, **Then** a visible success confirmation appears and the UI does not claim server-side storage.
3. **Given** the help/FAQ section, **When** the visitor expands questions, **Then** at least three common traveler questions are answered with substantial content, and the page exposes valid `FAQPage` structured data.
4. **Given** the guides/tips teaser, **When** the visitor views it, **Then** it presents substantial, semantic, SEO-friendly content and its controls use the "coming soon" visible action rather than dead links.

---

### Edge Cases

- **Very small / very large screens**: The homepage holds from ~320px to wide desktop with no horizontal scrolling and no broken composition; the hero search/comparison entry remains usable and tappable on the smallest screens.
- **Mixed-direction content in RTL**: Latin destination names, prices, dates, and coupon codes display correctly within Arabic RTL without misalignment; coupon codes (Latin/numeric) remain legible and copyable.
- **Long Arabic strings**: Headlines, deal titles, testimonial text, and FAQ answers wrap gracefully without overflowing cards or breaking the grid.
- **JavaScript unavailable**: Core homepage content (hero copy, deals, destinations, coupons, testimonials, guides, FAQ, footer) still renders and is readable; enhanced interactions (search submit, copy, modal, form validation, drawer) degrade gracefully rather than leaving dead controls.
- **Slow or missing images**: Image areas reserve space (no layout shift) and use a placeholder/skeleton; every image has meaningful alternative text.
- **Empty/return states**: Where a section could conceivably be empty (e.g., no coupons), a branded empty state pattern is available; where content would load asynchronously in the future, a skeleton/loading state can be shown.
- **Keyboard-only & assistive use**: All interactive elements (search entry, card CTAs, copy controls, modal/drawer triggers, form fields) are reachable and operable by keyboard with visible focus; modals/drawers manage focus.
- **Reduced-motion preference**: Hero, card hover, and section transitions respect the user's reduced-motion setting.
- **Duplicate submissions**: Submitting the search or price-alert form repeatedly produces consistent, non-duplicated visible feedback (no stacked broken states).

## Requirements *(mandatory)*

### Functional Requirements

**Foundation reuse & non-regression**

- **FR-001**: The homepage MUST be implemented in `travel-saas-frontend/pages/index.html` and MUST reuse the existing Spec 001 foundation — the shared shell (top bar + slide-in drawer + footer), design tokens, reusable components, and `window.TUI` interaction utilities — without introducing a different visual identity.
- **FR-002**: The feature MUST NOT rebuild, remove, or downgrade any existing foundation artifact (design system, shell, components, JS utilities, styleguide, components showcase). Changes to shared files are limited to: (a) additive, homepage-supporting mock-content data and imagery; and (b) additive, **opt-in**, non-breaking enhancements to shared scripts that leave all existing behavior intact (e.g., a new opt-in `data-*` form-completion path in `src/js/main.js`). No existing shared component/utility behavior may change.
- **FR-003**: The homepage MUST remain a complete, standalone document that renders correctly on its own without a runtime framework or client-side router, consistent with the existing pages.
- **FR-004**: All styling MUST come from the existing local build output; the page MUST make zero external CDN requests for CSS, JavaScript, or fonts.

**Hero & value proposition (US1)**

- **FR-005**: The homepage MUST present a hero with exactly one primary heading (`<h1>`) communicating the core value proposition (compare/find the best travel deals from many trusted sources in one place), supporting subtext, and credibility cues.
- **FR-006**: The hero MUST include a visible **search / comparison entry** capturing at least a destination and travel intent (e.g., dates and/or travelers), built from the shared form-field patterns with comfortable mobile touch targets.
- **FR-007**: The search/comparison entry MUST validate inline (visible valid/invalid/error states) and MUST block submission until valid; on a valid submit it MUST produce a visible non-blocking confirmation (toast and/or inline message) indicating the comparison is launching soon and echoing the entered criteria, without navigating to a non-existent page and without any browser dialog.

**Explore: deals, destinations, coupons (US2)**

- **FR-008**: The homepage MUST include a **featured-deals** section built from the shared card and badge patterns, showing realistic mock deals with source badges (Partner / Affiliate / Manual Deal / API-Ready), "starting from" pricing, and realistic ratings.
- **FR-009**: Deal and explore CTAs MUST use safe labels (e.g., View Deal / Request Booking / Compare Offer / Get Coupon) and MUST each perform a visible action (open a quick-view modal, toggle state, show a toast, or copy a value) — never a dead control or bare `#` link.
- **FR-010**: The homepage MUST include a **popular-destinations** section using the shared card pattern, with believable mock destinations and visible actions on selection.
- **FR-011**: The homepage MUST include a **coupons / offers** section where each coupon exposes a copyable code using the existing copy-to-clipboard utility, with a visible success confirmation (toast/inline) — never a browser dialog.
- **FR-012**: All deal/destination/coupon content MUST be realistic, consistent mock data and MUST NOT imply that live prices or real integrations are active.

**Trust & intent capture (US3)**

- **FR-013**: The homepage MUST present trust signals and social proof: realistic mock traveler testimonials/ratings and trusted-partner/source attribution, plus the existing trust indicators (verified deals, secure inquiry, support access).
- **FR-014**: The homepage MUST include a **price-alert / newsletter** capture built from the shared form-field patterns that validates the email inline and, on success, shows a visible confirmation — frontend-only, persisting/transmitting nothing, and never implying server-side storage.
- **FR-015**: The homepage MUST include a **travel-guides / tips teaser** with substantial, semantic, SEO-friendly content whose controls use the "coming soon" visible action rather than dead links.

**Navigation & interaction integrity**

- **FR-016**: Every interactive element on the homepage MUST perform exactly one observable action (navigate to the homepage itself or an in-page anchor, open a modal, open the drawer, toggle a visible state, show a toast, copy a value, or submit a frontend-validated form). Dead controls and bare `#` links without a handled action are FORBIDDEN.
- **FR-017**: Links to not-yet-built public surfaces (compare, deals, coupons, destinations, guides/blog, auth, saved deals, price alerts) MUST use the existing "coming soon" visible action (toast) and MUST NOT navigate to non-existent pages.
- **FR-018**: Browser `alert()`, `confirm()`, and `prompt()` MUST NOT be used anywhere; all feedback MUST use the existing toast, modal, or inline-message patterns.

**Arabic-first, responsive, accessible**

- **FR-019**: Arabic right-to-left MUST be the default experience; the structure MUST remain English-ready (no hard-coded directional assumptions) so the layout mirrors correctly with no visual breakage when direction is flipped to LTR.
- **FR-020**: The homepage MUST be mobile-first and responsive, fully usable from ~320–360px up to desktop, with the mobile experience feeling close to a native app (app-like navigation, comfortable touch targets ≥ ~44px).
- **FR-021**: The homepage MUST meet WCAG 2.1 Level AA: AA contrast for text and meaningful UI, full keyboard operability with visible focus, focus management for modals/drawers, meaningful image alternatives, labels and programmatically-linked error messaging for all form fields, and respect for reduced-motion preferences.

**SEO & backend-readiness**

- **FR-022**: The homepage MUST be a non-thin, content-rich, SEO-friendly page using semantic HTML, exactly one `<h1>`, and a correct heading hierarchy, with the required document meta (title, description, language/direction, viewport, theme color, Open Graph baseline).
- **FR-023**: The homepage MUST include a help/FAQ section answering at least three common traveler questions and MUST expose valid structured data including `Organization`, `WebSite`, and `FAQPage` (JSON-LD).
- **FR-024**: Markup MUST remain semantic and backend-ready for later server-side template integration (predictable, stable structure; shared shell kept consistent with the canonical `partials/` source), with no dependency on a client-side runtime to render core content.

### Key Entities

- **Featured Deal (mock)**: A believable travel deal card — title, destination, image, "starting from" price, currency, rating, reviews count, source label (Partner / Affiliate / Manual Deal / API-Ready), and a safe-labeled CTA. Never implies live pricing.
- **Destination (mock)**: A popular destination card — name (Arabic, English-ready), image, and an indicative cue (e.g., starting price or deal count), with a visible action on selection.
- **Coupon / Offer (mock)**: A discount offer — title, merchant/source attribution, discount value, a copyable code, and validity/terms indicator framed as illustrative, with a copy-to-clipboard control.
- **Testimonial (mock)**: A traveler review — author label, rating, and quote, clearly illustrative mock content.
- **Trusted Partner (mock)**: A partner/source attribution item used as a credibility cue.
- **Guide / Tip teaser (mock)**: A short, SEO-oriented travel-content preview with a "coming soon" action.
- **Search / Comparison Query (frontend-only)**: The visitor's entered criteria (destination, dates and/or travelers) used solely to produce a visible confirmation; not transmitted or stored.
- **Intent Capture (frontend-only)**: A price-alert/newsletter email submission validated inline; not transmitted or stored.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The homepage renders correctly as a standalone file at a 360px mobile viewport and at desktop, with zero horizontal scrolling on mobile.
- **SC-002**: 100% of interactive elements on the homepage produce a visible action; there are zero dead buttons, zero bare `#` links without a handled action, and zero browser `alert()`/`confirm()`/`prompt()` dialogs.
- **SC-003**: The platform's core value proposition and the search/comparison entry are both present within the first viewport on a 360px mobile screen (verifiable: exactly one `<h1>` value proposition and the search form render above the fold without scrolling), so a visitor can identify the value and start a comparison within ~5 seconds of load.
- **SC-004**: The search/comparison entry and the price-alert/newsletter form both show inline validation on invalid/empty input and a visible success confirmation on valid input, with nothing implying server-side storage or live data.
- **SC-005**: Every coupon code can be copied via the copy control with a visible success confirmation, with zero browser dialogs.
- **SC-006**: The homepage presents the explore substance — at least 6 featured deals (with correct source badges and safe CTA labels), at least 4 popular destinations, and at least 3 coupons — all as believable mock data that never claims live prices.
- **SC-007**: The default rendered experience is Arabic RTL; when direction is flipped to LTR, the layout mirrors with no visual breakage (English-ready verified).
- **SC-008**: At least 95% of the homepage's styling is expressed through the existing design system (tokens/utilities) rather than new ad-hoc, page-specific styles, and no different visual identity is introduced.
- **SC-009**: The homepage makes zero external CDN requests for CSS, JavaScript, or fonts; all styling originates from the existing local build.
- **SC-010**: Zero occurrences of forbidden technologies (React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN) and zero browser dialogs anywhere in the page.
- **SC-011**: The homepage passes a structure/SEO check: exactly one `<h1>`, correct heading hierarchy, required document meta present, and valid `Organization`, `WebSite`, and `FAQPage` structured data (JSON-LD); the FAQ answers at least three common traveler questions.
- **SC-012**: The homepage satisfies WCAG 2.1 AA checks: zero AA contrast/structure violations in an automated audit, and keyboard-only operation can reach and operate 100% of interactive elements including the search entry, card CTAs, copy controls, modal/drawer, and forms.
- **SC-013**: The homepage becomes interactive in under 2 seconds under the defined throttle profile — Lighthouse mobile "Slow 4G" (≈1.6 Mbps down, 150 ms RTT) with 4× CPU throttling.
- **SC-014**: No existing foundation artifact regresses: the styleguide and components showcase still render, and the shared shell on the homepage matches the canonical `partials/` source.

## Assumptions

- **Homepage-only scope**: This spec finalizes only `pages/index.html` as the real public homepage. All other public pages (compare/search results, deals, coupons, destinations, blog/article, auth, saved deals, price alerts), the merchant dashboard, and the SaaS owner admin remain out of scope and will be built in later specs. The homepage *anticipates and links toward* these surfaces using the existing "coming soon" visible action.
- **Foundation is reused, not rebuilt**: Spec 001 is complete and provides the local Tailwind build, Arabic-first RTL shell, header/drawer/footer, design tokens, reusable components, and `window.TUI` utilities (toast, modal, drawer, copy, validation). This spec consumes those as-is and does not modify their behavior or visual identity. Additive, homepage-supporting mock-content data files and imagery placeholders are permitted.
- **No backend**: No real backend, APIs, scraping, payments, authentication, or database is implemented. The search/comparison entry and the price-alert/newsletter capture are frontend-only: they validate and confirm visibly but transmit/persist nothing and never imply server-side storage or live prices.
- **Search/comparison behavior**: Because the comparison results page does not exist, a valid search submit produces a visible non-blocking confirmation (toast and/or inline message echoing the criteria, indicating the engine is launching soon) rather than navigating away.
- **Mock data only**: All deals, destinations, coupons, testimonials, partners, and guide teasers are realistic but clearly not live; source badges (Partner / Affiliate / Manual Deal / API-Ready) and safe CTA labels (View Deal / Request Booking / Compare Offer / Get Coupon) are used per the constitution.
- **Language strategy**: Content is authored in Arabic (RTL) for this phase; the structure stays English-ready and the existing (possibly inert) language-toggle affordance in the shell is reused unchanged.
- **Accessibility target**: WCAG 2.1 Level AA, consistent with the foundation.
- **Browser baseline**: Modern evergreen browsers (Chrome, Edge, Firefox, iOS/macOS Safari), last 2 major versions, consistent with Spec 001.
- **Governing constitution**: This feature complies with the project constitution (frontend-first; approved stack only; standalone backend-ready pages; premium & trustworthy; Arabic-first RTL & mobile-first; no dead interactions; integration-ready/never-faked; SEO & content quality). The constitution is not modified by this spec.
- **Visual identity preserved**: The homepage keeps the established design language; no new color system, typography, or component style is introduced — only composition and content built from existing tokens and patterns.
