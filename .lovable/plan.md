

## Plan: Update Contact Section Description

The "Contact & Action Buttons" section (lines 194-218 in `Index.tsx`) currently has two buttons: "Ask Questions" (WhatsApp) and "Claim Deposits" (Telegram) with no descriptive text.

### Changes

**File: `src/pages/Index.tsx`**

- Add a heading/description above the buttons in the Contact & Action section explaining that users can ask the admin about which products are currently on promotion.
- Update the WhatsApp button label from generic "Tanya Admin" / "Ask Questions" to something like "Tanya Promo" / "Ask About Promos".
- Add a short description text:
  - **Indonesian**: "Tanya admin produk apa saja yang sedang promo saat ini"
  - **English**: "Ask the admin which products are currently on promotion"

This keeps the section focused on promo inquiries as described by the user.

