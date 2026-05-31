# Feature Specification: Frontend Foundation & Design System (Travel SaaS Platform)

**Feature Branch**: `001-frontend-foundation`
**Created**: 2026-05-31
**Status**: Draft
**Input**: User description: "Create Spec 001 for the frontend foundation of a premium Travel SaaS Platform — design system, shared public website shell, frontend structure, reusable UI patterns, and base JavaScript utilities. Do not implement product pages, dashboards, admin, or any real backend."

## Clarifications

### Session 2026-05-31

- Q: What accessibility conformance target must the foundation meet? → A: WCAG 2.1 Level AA.
- Q: How functional should the language switcher be in this foundation phase (Arabic primary, English-ready)? → A: Structure-ready, Arabic-only content — the toggle affordance is present but may be inert this phase; English (LTR) is enabled later with no rework.
- Q: What is the primary mobile navigation model for the shared shell? → A: Branded top bar with a slide-in (off-canvas) drawer.
- Q: Which browser baseline must the foundation support? → A: Modern evergreen browsers (Chrome, Edge, Firefox, iOS/macOS Safari), last 2 major versions.

## User Scenarios & Testing *(mandatory)*

This feature establishes the **foundation** every future page is built on. Its direct beneficiaries
are two groups: **public visitors** (who must immediately perceive a premium, trustworthy, Arabic-first
travel platform) and the **team building future pages** (who must be able to assemble new pages quickly
and consistently from a shared design system and pattern library). The homepage (`index.html`) is the one
concrete public page in scope and serves as the visible reference implementation of the foundation.

### User Story 1 - Premium, trustworthy public homepage shell (Priority: P1)

A first-time visitor opens the platform homepage on a phone and instantly experiences a premium,
modern, Arabic right-to-left travel platform: a clear branded header with working navigation, a
compelling hero section, believable featured content, visible trust signals, a footer with support
and partner information, and a clear call to action — all rendering correctly as a single standalone
page with no broken, empty, or dead elements.

**Why this priority**: This is the visible, demonstrable MVP. It proves the foundation works end to end
and gives the business something credible to show. Trust and perceived quality are the product — a
homepage that does not look premium and complete cannot sell the platform's promise.

**Independent Test**: Open `index.html` directly in a browser at a 360px mobile width and at desktop
width. Verify the page renders fully standalone, reads right-to-left in Arabic, has no horizontal
scroll on mobile, and that every visible control does something observable (navigates, opens a
menu/modal/drawer, toggles state, shows a toast, or copies a value).

**Acceptance Scenarios**:

1. **Given** a visitor on a 360px-wide phone, **When** they open the homepage, **Then** the page
   renders in Arabic RTL, is fully readable with no horizontal scrolling, and the layout adapts to the
   small screen with app-like navigation (e.g., a menu drawer and reachable touch targets).
2. **Given** a visitor on the homepage, **When** they tap the menu control in the top bar, **Then** the
   slide-in (off-canvas) navigation drawer opens with a visible transition and can be dismissed via an
   explicit control or the keyboard.
3. **Given** a visitor scanning the homepage, **When** they look for credibility cues, **Then** they
   see trust signals (e.g., verified-deals indicator, secure-inquiry note, partner/source attribution,
   support access, realistic ratings).
4. **Given** a visitor clicks any button or link on the homepage, **When** the action fires, **Then**
   it performs a real, visible action and never triggers a browser `alert()` or leads to a dead `#`.

---

### User Story 2 - Consistent design system & project structure (Priority: P2)

A team member preparing a future page (deals, destinations, dashboard, etc.) opens the project and finds
a documented design system — brand colors, typography scale, spacing, radii, shadows, gradients, and RTL
utilities — plus a locally built styling pipeline and a clear folder structure. They can style a new page
entirely from the shared tokens and utilities, guaranteeing the new page matches the platform's premium
look without inventing ad-hoc styles.

**Why this priority**: Consistency is what makes a multi-page SaaS feel like one premium product. Without
a shared system established first, later pages drift visually and the "premium, trustworthy" requirement
cannot be met platform-wide.

**Independent Test**: Build the styling pipeline locally, create a throwaway sample element using only the
documented tokens/utilities, and confirm it renders with the intended premium styling and correct RTL
behavior — with styling served from a locally built stylesheet and no external CDN requests.

**Acceptance Scenarios**:

1. **Given** the documented design system, **When** a team member applies its tokens to a new element,
   **Then** colors, type scale, spacing, radii, shadows, and gradients render consistently with the
   homepage.
2. **Given** the project structure, **When** a team member adds a new standalone page, **Then** the
   page can reference the shared shell and styles and render correctly on its own without a runtime
   framework or client-side router.
3. **Given** the styling pipeline, **When** the project is built, **Then** all styling is produced by a
   local build step and the running pages make zero external CDN requests for CSS or scripts.
4. **Given** the default layout, **When** the interface direction is switched toward English (LTR),
   **Then** the layout mirrors correctly with no visual breakage, confirming the structure is
   English-ready.

---

### User Story 3 - Reusable UI pattern & interaction library (Priority: P3)

A team member needs the recurring interface pieces the platform will reuse everywhere: buttons (with
variants and states), cards, badges, modals, drawers, toasts, form fields with validation states, loading
/ skeleton states, and empty states — together with base interaction utilities (show a toast, open/close a
modal or drawer, validate a form inline, copy a value). They reuse these patterns so every interactive
element behaves consistently and no control is ever a dead end.

**Why this priority**: These patterns operationalize the platform's interaction rules (no dead buttons,
no browser alerts, every form has validation states). Establishing them in the foundation prevents each
future page from re-solving the same problems inconsistently.

**Independent Test**: From the homepage or a sample page, trigger each pattern: open and dismiss a modal
and a drawer, show a toast, copy a value to the clipboard with confirmation, and submit an empty required
form to see inline validation — all without any browser `alert()`/`confirm()`/`prompt()`.

**Acceptance Scenarios**:

1. **Given** the pattern library, **When** a required form is submitted empty, **Then** inline validation
   states appear (invalid/error messaging) and submission is blocked until valid; on success a success
   state or toast confirms.
2. **Given** a "copy" control (e.g., a code or link), **When** it is activated, **Then** the value is
   copied and a visible confirmation (toast/inline) appears — never a browser alert.
3. **Given** a list/section that may have no items, **When** it is empty, **Then** a clear, branded empty
   state is shown; and where content loads asynchronously, a skeleton/loading state is available.
4. **Given** any modal or drawer, **When** it is open, **Then** it can be dismissed via an explicit
   control and via keyboard, and focus is handled so keyboard users are not trapped or lost.

---

### Edge Cases

- **Very small / very large screens**: Layout holds from ~320px up to wide desktop with no horizontal
  scrolling and no broken composition.
- **Mixed-direction content in RTL**: Latin brand names, numbers, currencies, and dates display correctly
  within Arabic RTL text without misalignment.
- **Long Arabic strings**: Headings and labels wrap or truncate gracefully without overflowing cards or
  breaking the grid.
- **JavaScript unavailable**: Core content and navigation still render and are readable; enhanced
  interactions degrade gracefully rather than leaving dead controls.
- **Slow or missing images**: Image areas reserve space (no layout shift) and show a placeholder/skeleton;
  every image has meaningful alternative text.
- **Keyboard-only and assistive use**: All interactive elements are reachable and operable by keyboard with
  visible focus; modals/drawers manage focus.
- **Reduced-motion preference**: Transitions respect the user's reduced-motion setting.

## Requirements *(mandatory)*

### Functional Requirements

**Project structure & build foundation**

- **FR-001**: The project MUST be organized under a single frontend root containing, at minimum: a package
  manifest, a Tailwind configuration, a PostCSS configuration, a styles entry (`src/input.css`), base
  scripts (`src/js/main.js`, `src/js/ui.js`), an assets area (`assets/images/`, `assets/icons/`), and a
  pages area containing the homepage (`pages/index.html`).
- **FR-002**: All styling MUST be produced by a local build step from the project's own style source; the
  running pages MUST NOT load styling or scripts from any external CDN.
- **FR-003**: The foundation MUST NOT include or depend on React, Vue, Angular, Bootstrap, jQuery, or a
  Tailwind CDN. Custom scripting MUST be vanilla JavaScript, used only where a non-JS solution is not
  sufficient.
- **FR-004**: Every page MUST be a complete, standalone document that renders correctly on its own without
  a runtime framework or client-side router.

**Design system**

- **FR-005**: The foundation MUST define and document a reusable design token set covering brand colors,
  neutral/semantic colors, a typography scale (including an Arabic-appropriate type treatment), spacing,
  border radii, shadows, and gradients.
- **FR-006**: The visual style MUST present as premium, trustworthy, and modern — clean layouts, strong
  visual hierarchy, spacious sections, rounded cards, soft shadows, and elegant gradients.
- **FR-007**: Design tokens and styles MUST be reusable so that future pages achieve the same look without
  introducing ad-hoc, page-specific styles.

**Direction, language & responsiveness**

- **FR-008**: Arabic right-to-left MUST be the default experience (default document language Arabic and
  default direction RTL).
- **FR-009**: Content in this phase MUST be authored in Arabic only; the structure MUST be English-ready so
  English (LTR) can be added later with no rework. A language-toggle affordance MUST be present in the
  shell but MAY be inert (non-switching) in this phase. The layout MUST still mirror correctly with no
  visual breakage when the document direction is flipped to LTR (verified structurally), confirming
  English-readiness.
- **FR-010**: The interface MUST be mobile-first and responsive, remaining fully usable from ~320–360px
  widths up to desktop, with the mobile experience feeling close to a native app (app-like navigation,
  comfortable touch targets).

**Shared public website shell**

- **FR-011**: The foundation MUST provide a consistent, reusable header as a branded **top bar** containing
  brand identity, primary navigation, a language-toggle affordance (present; may be inert this phase per
  FR-009), and a primary call to action. On mobile, primary navigation MUST collapse into a **slide-in
  (off-canvas) drawer** opened from the top bar, with a visible open/close transition and dismissal via an
  explicit control and the keyboard.
- **FR-012**: The foundation MUST provide a consistent, reusable footer containing key links, support/
  contact access, partner/trust information, and secondary navigation.
- **FR-013**: The shared shell MUST be structured so it renders consistently across all future pages.

**Homepage (reference page)**

- **FR-014**: The homepage MUST be a complete, non-thin standalone page that demonstrates the shell and the
  core patterns, including a hero section, at least one featured-content section built from the card/badge
  patterns, visible trust signals, and clear calls to action.
- **FR-015**: Any sample/featured content shown on the homepage MUST be believable, realistic mock data and
  MUST NOT imply that live prices or real integrations are active.

**Reusable UI patterns**

- **FR-016**: The foundation MUST provide reusable interface patterns including, at minimum: buttons (with
  variants and states), cards, badges, modals, drawers, toasts, form fields with explicit validation
  states, loading/skeleton states, and empty states.
- **FR-017**: The badge patterns MUST be able to represent source/label conventions the platform will use
  later (e.g., Partner / Affiliate / Manual Deal / API-Ready style badges) so future listing and comparison
  pages reuse a single consistent badge system.

**Interaction rules**

- **FR-018**: Every clickable element MUST perform exactly one observable action: navigate to a real page,
  open a modal, open a drawer, toggle a visible state, show a toast, copy a value, or submit a
  frontend-validated form. Dead controls are not permitted.
- **FR-019**: Placeholder `#`-only links MUST NOT exist unless a script handles them with a visible action.
- **FR-020**: Browser `alert()`, `confirm()`, and `prompt()` dialogs MUST NOT be used; feedback MUST use
  custom toasts, modals, or inline messages.
- **FR-021**: All forms MUST present visible frontend validation states (valid, invalid, error, and success).
- **FR-022**: The base scripts MUST provide reusable utilities for the core interactions (at minimum:
  toast, modal open/close, drawer open/close, inline form validation, and copy-to-clipboard with
  confirmation).

**Backend-readiness & SEO foundation**

- **FR-023**: Markup MUST be semantic and structured to be backend-ready for later server-side template
  integration (predictable, stable structure and naming; no dependency on a client-side runtime to render
  content).
- **FR-024**: Public pages MUST include an SEO baseline: a document title, meta description, correct
  language/direction attributes, viewport configuration, a single primary heading, and a correct heading
  hierarchy.

**Accessibility baseline**

- **FR-025**: The foundation MUST meet **WCAG 2.1 Level AA**. At minimum: text and meaningful UI contrast
  meet AA ratios (≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI component boundaries); all
  interactive elements are keyboard-operable with a visible focus indicator; modals and drawers manage and
  trap focus appropriately; images carry appropriate text alternatives; form fields have associated labels
  and accessible, programmatically-linked error messaging; and motion respects a reduced-motion preference.

**SEO content enhancements**

- **FR-026**: The homepage MUST include a help/FAQ section (at least 3 common traveler questions) and valid
  structured data (JSON-LD for `Organization` and `WebSite`) to strengthen SEO and trust, consistent with
  the constitution's SEO & content guidance.

### Key Entities

- **Design Token**: A named, reusable design value (color, type scale step, spacing unit, radius, shadow,
  gradient) that future pages reference for visual consistency.
- **UI Pattern / Component**: A reusable interface piece (button, card, badge, modal, drawer, toast, form
  field, skeleton, empty state) with defined variants and states.
- **Page Shell**: The shared header + footer + page scaffold reused across all pages.
- **Navigation Item**: A labeled destination in primary/secondary navigation (Arabic label, English-ready,
  target page).
- **Mock Content Item**: Believable placeholder content (e.g., a sample featured deal/destination card)
  used for demonstration, explicitly not backed by live data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The homepage renders correctly as a standalone file on both a 360px-wide mobile viewport and
  a desktop viewport, with zero horizontal scrolling on mobile.
- **SC-002**: 100% of interactive elements on the homepage produce a visible action; there are zero dead
  buttons, zero `#`-only links without a handled action, and zero browser `alert()`/`confirm()`/`prompt()`
  dialogs.
- **SC-003**: The default rendered experience is Arabic and right-to-left; when switched to left-to-right,
  the layout mirrors with no visual breakage (English-ready verified).
- **SC-004**: All primary touch targets on mobile are comfortably tappable (≥ ~44px), and primary
  navigation is reachable within one interaction on mobile.
- **SC-005**: At least 95% of the homepage's styling is expressed through the shared design system
  (tokens/utilities) rather than one-off, page-specific styles, demonstrating reusability.
- **SC-006**: Running pages make zero external CDN requests for CSS or JavaScript; all styling originates
  from the local build.
- **SC-007**: Zero occurrences of forbidden technologies (React, Vue, Angular, Bootstrap, jQuery, Tailwind
  CDN) anywhere in the foundation.
- **SC-008**: Every reusable pattern (button, card, badge, modal, drawer, toast, form field with validation,
  skeleton, empty state) can be demonstrated working from the homepage or a sample page.
- **SC-009**: The homepage passes a basic SEO/structure check: exactly one primary heading, a correct
  heading hierarchy, the required document meta (title, description, language, direction, viewport), and
  valid `Organization`/`WebSite` structured data (JSON-LD) (per FR-026).
- **SC-010**: A new standalone page can be assembled from the shared shell and design system and visually
  matches the homepage's premium style without introducing new ad-hoc styles.
- **SC-011**: The homepage becomes interactive in under 2 seconds measured under a defined throttle profile —
  Lighthouse mobile **"Slow 4G"** (≈1.6 Mbps down, 150 ms RTT) with **4× CPU** throttling (lean, locally
  built assets; no heavy framework runtime).
- **SC-012**: The homepage and every reusable component satisfy WCAG 2.1 AA checks: zero AA contrast/
  structure violations in an automated audit, and keyboard-only operation can reach and operate 100% of
  interactive elements.

## Assumptions

- **Scope is foundation-only**: This spec delivers the design system, shared shell, project structure,
  reusable UI patterns, base JS utilities, and the homepage (`index.html`) as the reference page. All other
  public pages (deals, compare, coupons, destinations, blog, auth, saved deals, price alerts), the merchant
  dashboard, and the SaaS owner admin are explicitly out of scope here and will be built in later specs on
  top of this foundation. Internal developer/QA reference pages (a foundations styleguide and a components
  showcase) MAY be created to demonstrate and verify the system; these are not public product pages and are
  not part of the shipped public site.
- **No backend in scope**: No real backend, APIs, scraping, payments, authentication, or database logic is
  implemented. The frontend is structured to be backend-ready for later Django integration only.
- **Homepage completeness**: `index.html` is treated as a complete, non-thin premium homepage that doubles
  as the reference implementation of the shell and core patterns, populated with believable mock content.
- **Language strategy**: Content is authored in Arabic (RTL) only in this phase. The shell includes a
  language-toggle affordance that may be inert (non-switching) now; the structure and text handling are
  prepared so English (LTR) can be added later without rework. A premium Arabic-appropriate, locally
  hosted web font is assumed (no CDN fonts).
- **Accessibility target**: The foundation targets WCAG 2.1 Level AA conformance.
- **Browser baseline**: Target modern evergreen browsers — Chrome, Edge, Firefox, and iOS/macOS Safari —
  last 2 major versions. This permits modern CSS (logical properties, fl/grid `gap`, container queries)
  for clean RTL and mobile-first layout; support for legacy browsers is not required.
- **Mobile navigation**: The shared shell uses a branded top bar with a slide-in (off-canvas) drawer as the
  primary mobile navigation model; a bottom tab bar (more app-like) may be layered onto authenticated/member
  areas in a later spec without changing this public shell.
- **Mock data only**: Any sample content is realistic but clearly not live; the foundation never claims real
  prices or active integrations.
- **Governing constitution**: This feature MUST comply with the project constitution (frontend-first,
  approved stack only, standalone backend-ready pages, premium & trustworthy design, Arabic-first RTL &
  mobile-first, no dead interactions, integration-ready/never-faked, and the SEO/content baseline).
- **Reasonable visual defaults**: Specific brand color values, the exact type scale, and the precise
  homepage section composition are left to the design/plan phase, provided they satisfy the premium,
  trustworthy, consistent requirements above.
