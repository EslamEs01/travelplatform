# Contract — Navigation Audit (Spec 011)

**Purpose**: Make "no dead ends" verifiable. Defines what a clickable element MUST do, the cross-folder relative-path rules, and how absent/coming-soon destinations are handled per surface. Backs FR-003, FR-004, FR-015, SC-001, SC-002.

---

## 1. Allowed behaviors (every clickable element)

A link/button/menu-item/CTA/row-action/modal-action MUST do **exactly one** of:

1. Navigate to an **existing** page (correct relative path per §2).
2. Open a modal (`data-modal-open` / `TUI.modal.open`).
3. Open a drawer (`data-drawer-open` / `TUI.drawer`).
4. Toggle a visible UI state (filter chip, accordion, tab, save/favorite, feature toggle, monthly/yearly, date-range/compare).
5. Copy a value (`data-copy` / `data-copy-target` → `TUI.copyToClipboard` + toast).
6. Apply filter/sort/search (updates the visible set + `aria-live` count + chips).
7. Submit a **frontend-validated** form (valid/invalid/error/success states; honest success).
8. Show a toast (`data-toast` / `TUI.toast`).
9. Show a **safe coming-soon** message (`data-coming-soon` → toast).
10. Open a **custom confirmation modal** for a destructive action (never a browser dialog).

**Forbidden**: bare `#`/empty `href` with no JS handler; a button that does nothing; an `href` to a non-existent file (404); a browser `alert()`/`confirm()`/`prompt()`.

---

## 2. Cross-folder relative-path rules (the resolver contract)

Resolve each internal reference **from the linking page's folder**. A reference is a **defect** if the resolved file does not exist.

| Linking page | → Public page | → Merchant page | → Admin page | → CSS/JS | → assets |
|--------------|---------------|-----------------|--------------|----------|----------|
| `pages/x.html` | `y.html` (sibling) | `../dashboard/y.html` | `../admin/y.html` | `../src/js/…`, `../assets/css/…` | `../assets/…` |
| `dashboard/x.html` | `../pages/y.html` | `y.html` (sibling) | `../admin/y.html` | `../src/js/…`, `../assets/css/…` | `../assets/…` |
| `admin/x.html` | `../pages/y.html` | `../dashboard/y.html` | `y.html` (sibling) | `../src/js/…`, `../assets/css/…` | `../assets/…` |

**Detail-page params**: `…details.html?id=<id>` is allowed (the page resolves a default mock when `id` is absent). Anchor deep-links (`analytics.html#integrations`) are allowed when the target id exists on the page.

---

## 3. Coming-soon / absent-destination handling

These destinations are **intentionally not pages** and MUST be reached only via a `data-coming-soon` toast (or a visibly "قريباً"-marked, non-navigating control) — never an `href` to a missing file, never a 404:

- **Spec 008 (absent)**: `dashboard/bookings.html`, `dashboard/booking-details.html`, `dashboard/customers.html`, `dashboard/customer-details.html`.
- **Owner settings/billing/support** beyond the 7 built admin pages (no page in scope).
- Any other roadmap surface referenced in a sidebar/nav that has no built page.

**Conversely**: a CTA still marked "coming soon" whose destination page **now exists** MUST be repointed to the real page (stale coming-soon is a defect).

---

## 4. Per-surface navigation surfaces to audit

- **Public**: navbar, mobile drawer, footer, homepage hero/section CTAs, card links (deal/destination/article), breadcrumbs, member-area links.
- **Merchant** (`.dash-*` shell): sidebar (incl. the 4 absent → coming-soon), topbar, quick actions, table row-action menus, bulk-action bar, modal actions, "back to site" → `../pages/index.html`.
- **Admin** (`.admin-*` shell): sidebar (7 pages + `analytics.html#integrations` deep-link + settings coming-soon), topbar (3 dropdowns), quick actions, row-action menus (incl. **login-as → disabled/safe**, never a real session), bulk actions, modal actions, "back to site" → `../pages/index.html`, "companies dashboard" → `../dashboard/index.html`.

---

## 5. Verification

- The `link-crawl` gate (G6) resolves 100% of internal references and reports: broken count (must be 0), dead-`#` count (must be 0), absent-page links (must be 0), and the count of verified coming-soon affordances.
- The three **end-to-end flows** (public visitor / merchant / admin, per spec) MUST each complete with 0 broken links or dead controls.

## Acceptance

0 broken internal links; 0 bare-`#`/dead controls; 0 references resolve to an absent page as real navigation; every coming-soon affordance shows a safe message; stale coming-soon CTAs repointed. All destructive actions gated by a custom confirmation modal.
