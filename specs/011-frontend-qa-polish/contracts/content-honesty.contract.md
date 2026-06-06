# Contract — Content Honesty (Spec 011)

**Purpose**: Make "honest about mock/frontend-only data" verifiable. Maps forbidden false claims to approved safe wording, and defines the source badges / safe button labels that every surface MUST use. Backs FR-010, SC-011, and Constitution IX.

---

## 1. Forbidden claims (must NOT appear as a real assertion)

No copy, toast, modal, or label may claim that a real backend action occurred or that live data is active:

| Domain | Forbidden claim (examples, AR/EN) |
|--------|-----------------------------------|
| Prices | "أسعار مباشرة/فعلية", "live prices", "guaranteed lowest price" |
| Booking | "تم تأكيد الحجز", "booking confirmed", "حجز مؤكد" |
| Payment | "تم الدفع", "payment processed", "تمت معالجة الدفع" |
| Invoice/Billing | "تم إصدار فاتورة فعلية", "real invoice generated", "تم تحصيل الاشتراك" |
| Auth | "تم إنشاء حسابك", "account created", "تم تسجيل الدخول" (as a real session) |
| Integration/API | "تم الاتصال بـ API", "API connected", "scraping running", "مصدر مباشر" |
| Notifications | "تم إرسال بريد/واتساب", "email sent", "WhatsApp sent" |
| Analytics | "تتبع فعلي للزوار", "real analytics tracking" |
| CMS/Publish | "تم النشر على الموقع", "published live" (without "تجريبي"/review note) |
| Admin actions | "تم إيقاف الشركة فعليًا", "company suspended", "تم تغيير الخطة/السعر فعليًا" |
| Settings/Team | "تم حفظ الإعدادات على الخادم", "team invitation sent" |
| Impersonation | "تم تسجيل الدخول كالشركة" (login-as MUST stay disabled/safe) |
| Visa/Legal | "ضمان تأشيرة رسمي", "official visa guarantee" |
| AI | "الذكاء الاصطناعي نشط الآن" when not implemented |

---

## 2. Approved safe wording (use these)

Rewrite any true hit to the matching safe phrasing already used across Specs 006–010:

- **General mock**: `بيانات تجريبية` · `مثال توضيحي` · `واجهة أمامية فقط` · `حالة تجريبية`
- **Prices**: `أسعار إرشادية` (indicative, not live)
- **Roadmap/binding-later**: `قابل للربط لاحقًا` · `Partner-ready` · `Affiliate-ready` · `API-ready` · `Manual Deal`
- **Action is mock**: `إجراء تجريبي` · `لا يتم تنفيذ إجراء حقيقي في هذه النسخة`
- **No persistence**: `لا يتم الحفظ على خادم حاليًا` / `لا يتم الحفظ على خادم في هذه النسخة`
- **No notifications**: `لا يتم إرسال إشعارات حقيقية`
- **No payments**: `لا يتم معالجة مدفوعات فعلية`
- **Booking**: `طلب حجز` (request, not confirmed)
- **Publish**: `يحتاج مراجعة قبل النشر` / `منشور تجريبي`
- **Impersonation**: `لا يتم تسجيل دخول كالشركة فعليًا`
- **Visa**: `معلومات التأشيرة إرشادية وليست بديلاً عن المصادر الرسمية`

---

## 3. Required badges & safe labels (Constitution IX)

- **Comparison/source badges**: `Partner` · `Affiliate` · `Manual Deal` · `API Ready` — present wherever an external-sourced price/deal is shown.
- **Booking-related buttons** use safe labels only: `View Deal` / `عرض العرض` · `Request Booking` / `طلب حجز` · `Compare Offer` / `قارن العرض` · `Get Coupon` / `احصل على الكوبون`. Never "Book now / احجز الآن" implying a completed transaction.
- **Mutating controls** (suspend / change-plan / publish / delete / send / export / pay / invite / save) carry a visible `إجراء تجريبي`-class note or toast on action.

---

## 4. State invariant

All state is **session-only**: a mock add/edit/toggle/status-change reflects in the UI but is **not persisted**; reload restores mock defaults. No fix may introduce real persistence. Copy must not imply otherwise.

---

## 5. False positives

A grep hit is a documented false positive (not a defect) when the matched substring is part of a legitimate word/identifier and the surrounding copy is already honest (e.g. an honest sentence that contains "تم" in a non-claim context, or a JS identifier like `onConfirm`). Quote and justify each in the report; do not "fix" by corrupting valid copy.

## Acceptance

`honesty-grep` (G9) returns 0 real hits; every mutating control carries safe wording; source badges + safe booking labels present; login-as stays disabled/safe; no copy claims live/real backend behavior or server persistence; all documented false positives justified.
