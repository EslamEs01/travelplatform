# Contract: Base JS Interaction Utilities (`src/js/ui.js`)

**Feature**: `001-frontend-foundation` | **Date**: 2026-05-31

`ui.js` is a dependency-free, classic (non-module) script that exposes one global namespace `window.TUI`.
It provides the five base interactions the platform reuses everywhere and enforces Principle VI: every
interactive element produces a visible action, and **no** browser `alert()`/`confirm()`/`prompt()` is ever
used. `main.js` wires page elements declaratively via `data-*` attributes; pages need no bespoke JS.

## Public API (`window.TUI`)

```js
// 1) Toast — transient, non-blocking feedback (mounts in #toast-root, aria-live)
TUI.toast(message, { type = 'info', duration = 4000, dismissible = true }) // type: success|error|info|warning
   // → returns { id, close() }

// 2) Modal (dialog) — APG dialog pattern: focus trap, Esc to close, restore focus
TUI.modal.open(targetId, { onClose })   // targetId → element with [data-modal="<id>"]
TUI.modal.close(targetId)

// 3) Drawer (off-canvas) — disclosure pattern + scrim; RTL-aware side
TUI.drawer.open(targetId)                // targetId → element with [data-drawer="<id>"]
TUI.drawer.close(targetId)
TUI.drawer.toggle(targetId)

// 4) Form validation — frontend-only; renders valid/invalid/error/success states inline
TUI.validateForm(formEl, { rules })      // → { valid: boolean, errors: { [field]: message } }
   // honors HTML constraint attrs (required, type, minlength, pattern) + optional custom rules

// 5) Copy to clipboard — with visible toast confirmation (never alert)
TUI.copyToClipboard(text)                // → Promise<boolean>; shows success/error toast
```

## Declarative wiring (data attributes — backend-ready, no inline JS)

| Attribute | Effect |
|-----------|--------|
| `data-drawer-open="<id>"` / `data-drawer-close` | open/close drawer `[data-drawer="<id>"]` |
| `data-modal-open="<id>"` / `data-modal-close` | open/close modal `[data-modal="<id>"]` |
| `data-copy="<value>"` (or `data-copy-target="#sel"`) | copy value/target text → toast |
| `data-toast="<msg>"` `data-toast-type="success"` | show a toast on click |
| `data-coming-soon` | prevent navigation; show "هذه الصفحة قيد الإنشاء" info toast (Principle VIII + VI) |
| `data-validate` on `<form>` | run `validateForm` on submit; block invalid submit; show inline states |

## Behavioral requirements

- **No browser dialogs**: `alert`/`confirm`/`prompt` MUST NOT appear anywhere (hard grep gate).
- **Accessibility (WCAG 2.1 AA / APG)**:
  - Modal: `role="dialog" aria-modal="true"`, labelled by its title, focus trapped, `Esc` closes, focus
    returns to the invoking control.
  - Drawer: focus moves into the panel on open; overlay + `Esc` + close button dismiss; background inert.
  - Toast root: `aria-live="polite"` (errors may use `assertive`); toasts never steal focus.
  - Form errors: set `aria-invalid="true"` and link the message via `aria-describedby`.
- **Reduced motion**: open/close animations are skipped/instant under `prefers-reduced-motion: reduce`.
- **Idempotent & resilient**: re-initialization is safe; missing target IDs fail silently with a `console`
  warning (never a thrown error that breaks the page).
- **No dependencies**: pure DOM APIs; no framework, no jQuery.

## Acceptance scenarios (map to spec US3)

1. Submitting an empty `[data-validate]` form shows inline invalid/error states and blocks submission;
   a valid submit shows a success state/toast.
2. `data-copy` activation copies the value and shows a success toast (no `alert`).
3. A `[data-modal-open]` / `[data-drawer-open]` trigger opens the surface; `Esc`, overlay, and the close
   control all dismiss it; focus is managed and restored.
4. A `data-coming-soon` link does not navigate and shows an informative toast.
