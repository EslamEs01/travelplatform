# Contract: `dashboard/settings.html` (`merchant-settings`)

**Feature**: 009 | **Date**: 2026-06-04 | Derives from FR-001…FR-007, FR-030…FR-040, FR-050…FR-056; research D1–D2, D7–D13.

## A. Shell & document
- `<html lang="ar" dir="rtl" data-page="merchant-settings">`; own `<head>`; `robots noindex`; Arabic title/meta; paths `../assets/…`, `../src/js/{ui,main,dashboard}.js` (defer); `../pages/index.html` for the public CTA.
- Reuses the Spec 006–007 shell; sidebar **الإعدادات** `aria-current="page"`; breadcrumb `لوحة التحكم / الإعدادات`; no public header/footer; exactly one `<h1>` = `الإعدادات`.
- Renders fully with JS disabled (**all seven sections present in the DOM**, stacked when JS is off). No console errors, no CDN, no chart/table library.

## B. Required structure (static HTML)
- **Page header** — H1; description; `حفظ كل التغييرات` (mock); `إعادة التعيين` (mock); safe note `الإعدادات هنا تجريبية ولا يتم حفظها على خادم`.
- **Settings navigation (7)** — بيانات الشركة / الهوية البصرية / تفضيلات الحجز / الإشعارات / الفريق / الأمان / الباقة والاستخدام (`role="tablist"` or anchor links; each section has a stable `id`).
- **1. Company Profile** — company name*, business type, phone*, email* (`dir="ltr"`), website (`dir="ltr"`), address, country, city, support contact, working hours, license/registration placeholder. Inline validation on required.
- **2. Branding** — logo upload (mock) + cover upload (mock); primary + secondary color pickers; public slug + public-URL preview; brand-preview card; social-link placeholders. Color + slug **live preview**.
- **3. Booking Preferences** — default currency; default booking mode (Request inquiry / Redirect to partner / Manual confirmation); default confirmation message; minimum-deposit placeholder; cancellation note; refund note; working hours; response-time promise; required-documents checklist (passport / ID / receipt / traveler names / visa document).
- **4. Notification Preferences** — ≥9 toggles (new booking inquiry, booking status changes, coupon copied, deal expiring soon, integration failed, daily summary, weekly analytics, payment pending mock, customer follow-up) across **Dashboard / Email / WhatsApp** channels.
- **5. Team Members** — table ≥6: name, email (`dir="ltr"`), role (Owner/Manager/Agent/Marketing/Support), status (Active/Invited mock/Disabled), last active, permissions summary, actions (invite / change role / disable-enable / resend invite / remove).
- **6. Security** — change-password form (current/new/confirm); 2FA placeholder toggle; API-access placeholder; sessions mock list; login-history mock list — with clear "no real session / placeholder" copy.
- **7. Plan Usage** — ≥7 usage bars (deals used, coupons used, team users, integrations, booking inquiries, customers, storage placeholder); current plan (Starter/Growth/Pro mock); renewal-date mock; billing note; upgrade CTA.
- **Public Page Preview** — company name, logo placeholder, public slug, support info, CTA (public site or coming-soon).
- **Danger Zone** — deactivate company / reset settings / delete account (each → custom confirmation modal).
- **FAQ ≥6** — هل يتم حفظ الإعدادات فعليًا؟ / هل يمكن تغيير رابط الشركة العام؟ / هل يتم إرسال دعوة الفريق؟ / هل يمكن ربط واتساب؟ / هل تغيير كلمة المرور حقيقي؟ / هل يمكن ترقية الباقة الآن؟

## C. Modals (custom `.modal` / `TUI.modal`)
- **Invite Member**: name, email* (`dir="ltr"`), role, permissions checkboxes, note → validate → toast (no invite sent).
- **Change Role**: member, new role*, permissions, note → save → toast (MAY update visible role cell).
- **Disable/Remove confirmation**: custom confirm → toast (MAY flip visible status).
- **Danger Zone** (deactivate / reset / delete): custom confirm → frontend-only warning toast; no destructive action.

## D. Behavior (`dashboard.js` `initMerchantSettings`)
- Tab click → show matching panel, set `aria-selected`/active + update hash; **deep-link `#section` honored on load**.
- Save all / per-section save → `validateForm` (where forms exist) → toast `حُفظت الإعدادات (تجريبي) — لا يتم الحفظ على خادم`; **no persist**.
- Reset → confirm modal → toast (restores visible defaults).
- Company form → `validateForm` (name/phone/email required + email format) → inline errors / success toast.
- Logo/cover upload → toast `لا يتم رفع ملفات حقيقية الآن` (+ optional local object-URL preview, no upload).
- Primary/secondary color input → live brand-preview swatch; public-slug input → live `https://…/<slug>` text.
- Notification toggles (≥9 × 3) → flip state + `aria-live`.
- Invite → modal + `validateForm` → toast (`دعوة تجريبية — لا يتم إرسال دعوة فعلية`). Change role → modal → toast (+ optional cell update). Disable/enable, Remove → confirm modal → toast. Resend invite → toast.
- Change password → `validateForm` (current/new/confirm required + new ≥8 + new = confirm) → inline errors / success toast (`تغيير تجريبي — لا يتم تغيير كلمة المرور`).
- 2FA → flip placeholder state + copy (`لا يتم تفعيل المصادقة الثنائية فعليًا`).
- Upgrade plan → **coming-soon** toast (billing not built).
- Danger-zone actions → confirm modal → frontend-only warning toast.
- **No dead controls; no browser dialogs.**

## E. Accessibility / honesty / responsive (MUST)
- WCAG 2.1 AA: focus visible, full keyboard, modal focus mgmt via `TUI.modal`, labels for every control, `aria-invalid`/`aria-describedby` on validation, `aria-live` on toggle/role/status changes, `aria-label` on icon-only buttons, AA contrast, ~44px targets, reduced-motion respected.
- 360px: tabs scroll/wrap; team table → stacked cards; forms + usage bars reflow to one column; no horizontal overflow.
- Every save/upload/invite/role/password/2FA/upgrade/delete surface carries approved frontend-only wording; no claim of real persistence, invitation, password change, 2FA, upgrade, billing, or deletion.
