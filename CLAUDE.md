<!-- SPECKIT START -->
## Active feature: 001-frontend-foundation

Frontend-first **Travel SaaS Platform**. Current phase builds the **frontend foundation** only:
design-token system, shared public website shell (top bar + slide-in drawer, footer), reusable UI
patterns, base vanilla-JS utilities, and a standalone Arabic-RTL homepage. No backend in this phase.

**Read the current plan and its design artifacts:**

- Plan: `specs/001-frontend-foundation/plan.md`
- Spec: `specs/001-frontend-foundation/spec.md`
- Research (decisions): `specs/001-frontend-foundation/research.md`
- Design tokens & components: `specs/001-frontend-foundation/data-model.md`
- Contracts: `specs/001-frontend-foundation/contracts/` (page-shell, ui-utilities, component-patterns)
- Quickstart & QA gate: `specs/001-frontend-foundation/quickstart.md`
- Governing constitution: `.specify/memory/constitution.md`

**Stack (non-negotiable)**: HTML + local Tailwind CSS v3.4 build (PostCSS) + vanilla JS only.
Forbidden: React, Vue, Angular, Bootstrap, jQuery, Tailwind CDN, browser `alert()`. Arabic RTL primary,
English-ready, mobile-first, WCAG 2.1 AA, standalone backend-ready pages, no CDN at runtime.
<!-- SPECKIT END -->
