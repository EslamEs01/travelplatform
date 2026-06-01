# Phase 0 Research: Public Homepage (Travel SaaS Platform)

**Feature**: `002-public-homepage` | **Date**: 2026-05-31

This feature has **no open `NEEDS CLARIFICATION` items** (the spec's Clarifications session resolved the two
open questions). Research here records the design decisions for composing the real homepage entirely on the
existing Spec 001 foundation, so implementation has zero ambiguity.

---

## D1. Reuse the foundation; build the homepage by composition

- **Decision**: Build the homepage purely by composing existing shell + tokens + component classes +
  `window.TUI` utilities. Do not author new component CSS unless a composition need is genuinely unmet by
  existing utilities/classes.
- **Rationale**: Spec 001 already ships every pattern the homepage needs — `.btn` (+variants/sizes/icon/
  loading), `.card` (+media/body/title/meta/price/badge-wrap), `.badge` (status/source/verified/featured),
  `.modal`, `.drawer`, `.field` (+states), `.skeleton`, `.empty-state`, `.inline-msg`, `.toast`. Reuse
  guarantees the single visual identity (FR-001, SC-008) and the ≥95% token-styling target (SC-008).
- **Alternatives considered**: New bespoke homepage components — rejected; would fork the design language,
  risk drift, and violate "do not create a different visual identity."

## D2. Hero search / comparison entry behavior (frontend-only)

- **Decision**: Render a hero search form built from `.field` patterns capturing **destination** (text,
  required), **travel dates** (date or month, optional), and **travelers** (select, optional). Mark the form
  `data-validate` (reuse inline validation) plus a new opt-in `data-frontend-form`. On valid submit:
  `preventDefault`, show a success `TUI.toast` ("نبحث لك عن أفضل العروض — محرّك المقارنة قيد الإطلاق") and an
  inline confirmation echoing the entered destination/criteria. No navigation occurs.
- **Rationale**: The comparison results page does not exist; the constitution forbids dead controls and
  navigation to non-existent pages. A validated, echoing, non-blocking confirmation satisfies FR-006/FR-007
  and SC-004 while never implying live data.
- **Alternatives considered**: (a) Navigate to a `compare.html` — rejected, page out of scope / would be a
  dead link. (b) Open a modal showing the query — viable, but a toast + inline echo is lighter and matches
  the existing toast-first feedback pattern; a modal remains available for deal quick-view (D4).

## D3. Additive, opt-in `main.js` enhancement for frontend-only forms

- **Decision**: Extend `src/js/main.js` submit handling additively: for a `<form data-validate
  data-frontend-form>` that passes validation, call `preventDefault()`, then show a success toast (message
  from `data-success-toast` if present, else a sensible default) and optionally reveal an inline
  confirmation element (`[data-frontend-success]` within the form) and reset the form. Forms **without**
  `data-frontend-form` keep today's exact behavior.
- **Rationale**: The current handler only `preventDefault`s on *invalid* submits; a valid submit on a static
  page would reload it. The opt-in attribute keeps the "pages need no bespoke JS" contract, is reusable by
  future pages (newsletter, contact, price alerts), and is strictly non-breaking (FR-002).
- **Alternatives considered**: Page-scoped inline `<script>` — rejected (violates the declarative-wiring
  contract and adds page-specific JS). Changing the default valid-submit behavior for all `data-validate`
  forms — rejected (could break the components-showcase demo form's behavior; opt-in is safer).

## D4. Deal cards — visible action on CTA

- **Decision**: Deal-card primary CTAs use safe labels and a visible action: the "عرض التفاصيل / View Deal"
  control opens a **quick-view modal** (reuse `.modal` + `data-modal-open`) summarizing the mock deal;
  "اطلب الحجز / Request Booking" uses the "coming soon" toast (`data-coming-soon`). At least one deal
  demonstrates the modal path so the modal pattern is exercised on the homepage.
- **Rationale**: Satisfies FR-009 (every CTA does something observable) and demonstrates the modal pattern in
  a production context without building a deal-details page (out of scope).
- **Alternatives considered**: All deal CTAs → coming-soon toast — acceptable but thinner; the quick-view
  modal is richer and reuses an existing pattern.

## D5. Coupons — copy-to-clipboard codes

- **Decision**: Each coupon card shows a Latin/numeric code (kept LTR with `dir="ltr"` on the code element)
  and a "نسخ الكود / Copy" control wired via `data-copy="<CODE>"`, reusing `TUI.copyToClipboard` →
  success toast. "Get Coupon" is the safe label.
- **Rationale**: Directly satisfies FR-011 and SC-005 with an existing utility; demonstrates copy interaction
  on a public page. Mixed-direction handling keeps codes legible in RTL (edge case).
- **Alternatives considered**: A modal revealing the code — heavier; copy-to-clipboard is the canonical
  pattern and already built.

## D6. Mock content data files

- **Decision**: Keep `featured.json` (extend to ≥6 consistent deals if needed). Add `destinations.json`
  (≥4) and `coupons.json` (≥3). Testimonials (≥3), trusted partners (≥3), and guide teasers (≥3) are small
  and presentation-coupled, so they may be authored inline in `index.html` (still semantic and SEO-friendly);
  JSON is optional for them. All entities stay consistent with existing mock content and the constitution's
  "believable, never live" rule.
- **Rationale**: Mirrors the existing `featured.json` convention, keeps content backend-ready (maps to future
  Django view context), and avoids over-engineering tiny content sets.
- **Alternatives considered**: One mega JSON — rejected; per-entity files are clearer and match Spec 001.

## D7. Imagery placeholders

- **Decision**: Reuse the existing SVG placeholders (`beach/city/nature/luxury.svg`) for deals/destinations;
  add a small number of additional lightweight SVG placeholders only if a section needs visual variety
  (e.g., destination tiles, partner logos as simple SVG wordmarks). All images carry meaningful `alt`; image
  areas reserve space (width/height or aspect-ratio) to prevent layout shift; non-hero images use
  `loading="lazy"`.
- **Rationale**: Keeps payload small (SC-013), avoids CDN/external images (SC-009), satisfies the
  slow/missing-image edge case and AA image-alternative requirements.
- **Alternatives considered**: Raster photos — rejected (payload + no CDN at runtime; placeholders are
  clearly mock, which is desirable per Principle IX).

## D8. Structured data & SEO

- **Decision**: Keep `Organization` + `WebSite` JSON-LD; **add `FAQPage`** JSON-LD whose Q&A mirrors the
  visible FAQ (≥3 questions). Maintain exactly one `<h1>` (hero) and a correct h2→h3 hierarchy across the new
  sections; each section is a labelled `<section>` landmark. Document `<head>` meta stays per the page-shell
  contract.
- **Rationale**: Satisfies FR-022/FR-023, SC-011; strengthens SEO/trust per Principle X. `FAQPage` is the
  highest-value structured-data addition for a content homepage.
- **Alternatives considered**: Adding `ItemList`/`Offer` for deals — rejected this phase; risks implying live
  offers (Principle IX) and is unnecessary for the homepage's SEO goal.

## D9. Performance & accessibility approach

- **Decision**: Reuse the minified CSS build, font preload + `font-display: swap`, deferred scripts, lazy
  images, and reduced-motion gating already established. New interactive elements (search, copy, modal,
  newsletter) reuse the foundation's focus management and AA-compliant tokens. Verify with the existing QA
  gate (axe-core / Lighthouse / html-validate / stack grep).
- **Rationale**: Inherits Spec 001's verified performance/accessibility posture; the homepage adds content
  and a few interactions, all from AA-compliant patterns (SC-012/SC-013).
- **Alternatives considered**: None needed.

---

## Resolved unknowns summary

| Question | Resolution |
|---|---|
| What happens on search submit (no results page)? | Frontend-only: validate inline → success toast + inline echo; no navigation (D2). |
| How to complete a valid frontend-only form without reload? | Additive opt-in `data-frontend-form` handling in `main.js` (D3). |
| How do deal CTAs avoid dead ends? | Quick-view modal + coming-soon toast with safe labels (D4). |
| How are coupons delivered? | Copy-to-clipboard code via `TUI.copyToClipboard` (D5). |
| Where does new mock content live? | `destinations.json` + `coupons.json`; small sets inline (D6). |
| Which structured data to add? | `FAQPage` alongside existing `Organization` + `WebSite` (D8). |
