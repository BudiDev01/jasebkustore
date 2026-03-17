/* Memory: DigiStore project design system and key preferences */

# Design System
- Style: Clean White Premium (light mode ONLY — no dark mode)
- Primary color: Gold HSL(43 90% 52%)
- Background: light mode only, HSL(210 30% 96%)
- Font convention: use Tailwind semantic tokens only, never hardcode colors
- Class conventions: gradient-gold, shadow-gold, shadow-navy, text-gold, glow-gold

# Key Decisions
- Light mode ONLY (no dark toggle, forced light)
- Language saved to localStorage as "language" — en/id
- WhatsApp admin: +62 815-7088-769 → wa.me/628157088769
- QRIS: placeholder shown, user will upload their real QR later
- Project name: JasebKu Store

# Architecture
- Contexts: LanguageContext (i18n), AuthContext (supabase auth)
- Data: src/data/products.ts (static product catalog)
- DB tables: profiles, products, orders, topups, page_visits, user_roles
- Google OAuth via Lovable managed social auth

# Routes
- / → Index (homepage)
- /login → Login
- /register → Register
- /payment/:productId → Payment
- /dashboard → Dashboard (protected)
- /topup → TopUp
- /topup/history → TopUpHistory
- /vip → VipLogin/VipDashboard
