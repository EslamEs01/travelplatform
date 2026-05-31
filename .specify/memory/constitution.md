<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
Bump rationale: Initial ratification. The previous file was an unfilled template
  with placeholder tokens only; this is the first concrete, governing version.

Modified principles (placeholder → concrete):
  [PRINCIPLE_1] → I. Frontend-First Delivery
  [PRINCIPLE_2] → II. Approved Technology Stack Only (NON-NEGOTIABLE)
  [PRINCIPLE_3] → III. Standalone, Backend-Ready Pages
  [PRINCIPLE_4] → IV. Premium & Trustworthy by Default
  [PRINCIPLE_5] → V. Arabic-First RTL & Mobile-First
  (expanded beyond template's 5) → VI. No Dead Interactions
                                   → VII. Listing & Detail Page Contracts
                                   → VIII. SaaS Direction Is Permanent
                                   → IX. Integration-Ready, Never Faked
                                   → X. SEO & Content Quality

Added sections:
  - Technical Standards & File Organization (was [SECTION_2_NAME])
  - Development Workflow & Quality Gates (was [SECTION_3_NAME])
  - Governance (filled)

Removed sections: none (all template placeholders resolved or expanded)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate is generic and
     resolves against this file at plan time; compatible, no edit required.
  ✅ .specify/templates/spec-template.md — no mandatory-section conflicts; compatible.
  ✅ .specify/templates/tasks-template.md — task categorization compatible (tests
     remain optional; frontend validation is per-page UX, not automated test suite).
  ✅ .specify/templates/checklist-template.md — compatible.
  ✅ .specify/extensions/git/commands/*.md — no outdated agent-specific references.

Follow-up TODOs: none. No placeholders intentionally deferred.
-->

# Travel SaaS Platform Constitution

This constitution is the permanent source of truth for all future specs, plans, tasks,
implementation, and QA. Every artifact produced by the Spec Kit workflow MUST comply with
it. Where any other instruction conflicts with this document, this document wins.

**Project identity**: A frontend-first, multi-tenant Travel SaaS Platform — a scalable
travel business platform for travel agencies, tourism companies, and travel startups. It is
NOT a basic tourism or single booking website, and MUST NOT be simplified into one.

## Core Principles

### I. Frontend-First Delivery

The complete frontend experience MUST be built before any backend implementation begins.
All pages, states, flows, and dashboards are delivered as working static frontend first;
backend integration is a later phase, never a prerequisite for frontend completeness.

Rationale: Frontend-first lets the product, design, and SaaS direction be validated and
demonstrated end-to-end with realistic mock data, decoupling delivery from backend timelines
while keeping the product backend-ready (see Principle III).

### II. Approved Technology Stack Only (NON-NEGOTIABLE)

The frontend MUST be built using ONLY: HTML, CSS, a locally built Tailwind CSS pipeline, and
vanilla JavaScript used only when necessary (prefer CSS/HTML solutions first).

The following are FORBIDDEN and MUST NOT appear anywhere in the codebase: React, Vue,
Angular, Bootstrap, the Tailwind CDN, jQuery, and browser `alert()` / `confirm()` / `prompt()`
dialogs. Tailwind MUST be compiled from a local build (`src/input.css` + `tailwind.config.js`
+ `postcss.config.js`); CDN Tailwind is prohibited.

Rationale: A single, locally built, framework-free stack keeps the output portable,
fast, predictable, and trivially embeddable into the future Django backend without a
framework migration.

### III. Standalone, Backend-Ready Pages

Every page MUST be a complete HTML file that renders correctly as a standalone static page.
Shared elements (header, sidebar, footer, repeated cards) MUST be structured consistently
across pages, but no page may depend on a runtime shell or client-side router to render.
Markup MUST be structured to be backend-ready for later Django integration (semantic,
predictable hooks/classes, server-renderable templates in mind).

Rationale: Standalone pages guarantee the site works as static files today and map cleanly
onto Django templates tomorrow, with no rewrite of structure.

### IV. Premium & Trustworthy by Default

The UI MUST look premium, trustworthy, modern, and suitable for a professional travel
business. It MUST use clean layouts, strong visual hierarchy, spacious sections, rounded
cards, soft shadows, elegant gradients, high-quality travel imagery placeholders, useful
icons, and clear CTAs. There MUST be no empty, broken, or confusing UI.

Every page MUST include relevant trust signals where applicable: verified deals, secure
booking-inquiry indicators, partner/source attribution, customer support access, realistic
ratings, and cancellation/terms indicators.

Rationale: Trust and perceived quality are the product. A travel SaaS that does not look
credible cannot sell deals, win merchants, or convert travelers.

### V. Arabic-First RTL & Mobile-First

Arabic RTL is the PRIMARY experience and MUST be the default rendering direction; the
structure MUST be English-ready (no hard-coded directional assumptions that block future LTR
localization). Mobile-first responsive design is MANDATORY: layouts are designed for small
screens first and scale up, and the mobile experience MUST feel close to a real native app.

Rationale: The target market is Arabic-speaking and mobile-dominant; RTL and mobile are
baseline requirements, not enhancements.

### VI. No Dead Interactions

Every clickable element MUST do exactly one of: navigate to a real existing page, open a
modal, open a drawer, toggle a visible UI state, show a toast, copy a value, or submit a
frontend-only validated form. Dead buttons are FORBIDDEN. Placeholder `#` links are
FORBIDDEN unless JavaScript handles them with a visible action. Browser `alert()` is
FORBIDDEN — use a custom toast, modal, or inline message. All forms MUST have visible
frontend validation states (valid, invalid, error, success).

Rationale: A SaaS demo with dead controls reads as broken and untrustworthy; every control
must produce observable feedback to be considered complete.

### VII. Listing & Detail Page Contracts

Every listing page MUST include: filters; sorting where relevant; an empty state; a
loading/skeleton state where relevant; and a clear reset-filters action. Every details page
MUST include: the main information; a primary CTA; related items; and a FAQ or help section
where relevant. Dashboards MUST use realistic static data until backend integration, and
mock data MUST be believable and consistent across all pages.

Rationale: Consistent page contracts make the platform feel complete and production-grade,
and prevent thin or half-built screens from passing as done.

### VIII. SaaS Direction Is Permanent

The platform MUST be designed for multi-tenant SaaS usage. The frontend MUST visually prepare
for these surfaces and future roles, and these MUST NOT be removed or downgraded into a simple
tourism site:

- **Public travel website**: homepage, search/comparison, deals, coupons, destinations,
  blog, auth, saved deals, price alerts.
- **Merchant (travel agency) dashboard**: overview, deals management, coupons management,
  booking requests, customers, analytics, integrations, settings.
- **SaaS owner admin**: companies, plans, subscriptions, platform analytics, content
  management, integration monitoring.

Future roles the UI must anticipate: Visitor, Member/Traveler, Travel Agency User, Travel
Agency Manager, SaaS Owner Admin, Support Admin. Existing working sections MUST NOT be removed
unless the current spec explicitly requires it.

Rationale: The SaaS, multi-tenant direction is the core differentiator and long-term value;
losing it during incremental work would destroy the product thesis.

### IX. Integration-Ready, Never Faked

The frontend MUST be prepared for future integrations but MUST NOT implement real ones yet
(e.g., Travelpayouts, Booking.com, Expedia/Rapid, Skyscanner, Amadeus, Duffel, coupon APIs,
scraping review queue, email/WhatsApp notifications, online payments, AI recommendations).

Rules:

- Any integration UI MUST clearly appear as configurable settings.
- Any external data shown now MUST be realistic mock data.
- The UI MUST NEVER claim live/real prices are active in the static frontend.
- Comparison pages MUST show source badges: Partner, Affiliate, Manual Deal, API Ready.
- Booking-related buttons MUST use safe labels: View Deal, Request Booking, Compare Offer,
  Get Coupon.

Rationale: Showing integration readiness sells the platform's roadmap; faking live data is
misleading and legally risky, and conflating mock with live undermines trust (Principle IV).

### X. SEO & Content Quality

Public pages MUST be SEO-friendly. Destination and article pages MUST be structured for future
SEO. Markup MUST use semantic HTML and a clear heading hierarchy. FAQ sections MUST be added
where useful. Blog and destination pages MUST support future Arabic and English content. Thin
pages are FORBIDDEN; public content MUST help the platform rank for travel deals, coupons,
destinations, and guides.

Rationale: Organic discovery for deals, coupons, destinations, and guides is a primary growth
channel for the platform and depends on structured, substantial, semantic content.

## Technical Standards & File Organization

**Approved stack**: HTML, CSS, locally built Tailwind CSS, vanilla JS (only when necessary).
**Forbidden stack**: React, Vue, Angular, Bootstrap, Tailwind CDN, jQuery, browser dialog boxes.

**Canonical file structure** (use unless a future spec explicitly changes it):

```text
travel-saas-frontend/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── input.css
│   └── js/
│       ├── main.js
│       ├── dashboard.js
│       └── charts.js
├── assets/
│   ├── images/
│   └── icons/
├── pages/        # public site: index, compare, deals, coupons, deal-details,
│                 # destinations, destination-details, blog, article, login, register
├── dashboard/    # merchant: index, deals, create-deal, edit-deal, coupons,
│                 # create-coupon, bookings, booking-details, customers,
│                 # customer-details, analytics, integrations, settings
└── admin/        # SaaS owner: index, companies, company-details, plans,
                  # subscriptions, analytics, content
```

**Data**: All dynamic-looking content uses realistic, consistent mock data until backend
integration. Mock entities (deals, coupons, destinations, companies, customers, bookings)
MUST stay consistent across every page that references them.

## Development Workflow & Quality Gates

1. **Spec → Plan → Tasks → Implement → QA** all operate under this constitution. The
   `/speckit-plan` Constitution Check gate MUST verify the feature against Principles I–X
   before Phase 0 and again after design.
2. **Preservation rule**: never remove existing working sections unless the active spec
   explicitly requires it; never simplify the product away from its SaaS direction.
3. **Per-page "done" checklist** — a page is NOT complete until it satisfies:
   - Renders standalone (III); Arabic RTL + mobile-first (V); premium look + trust signals (IV).
   - No dead interactions, no `alert()`, no bare `#` links, forms have validation states (VI).
   - Listing pages have filters/sort/empty/skeleton/reset; detail pages have info/CTA/
     related/FAQ (VII).
   - Integration UI is settings-driven, data is clearly mock, correct source badges and safe
     button labels are used (IX).
   - Semantic HTML, heading hierarchy, FAQ where useful, not a thin page (X).
4. **Stack compliance** is a hard gate: any introduction of a forbidden technology (II) fails
   review automatically.

## Governance

This constitution supersedes all other development practices for this project. All specs,
plans, tasks, implementations, and reviews MUST verify compliance with Principles I–X and the
sections above; non-compliance blocks merge/acceptance.

**Amendment procedure**: Proposed changes MUST be documented with rationale, the affected
principles/sections, and a migration note for any existing work. Amendments take effect only
when written into this file and the version is bumped.

**Versioning policy** (semantic):

- **MAJOR**: backward-incompatible governance changes, or removal/redefinition of a principle.
- **MINOR**: a new principle/section, or materially expanded guidance.
- **PATCH**: clarifications, wording, and non-semantic refinements.

**Compliance review**: every PR/review MUST confirm constitution compliance; any complexity or
deviation MUST be justified in writing (e.g., the plan's Complexity Tracking table) or be
removed. Use this file as the authoritative runtime guidance for all Spec Kit commands.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
