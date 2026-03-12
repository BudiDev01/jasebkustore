# Memory: index.md
Updated: now

/* Memory: DigiStore project design system and key preferences */

# Design System
- Style: Deep Navy Premium (user's choice)
- Primary color: Gold HSL(43 90% 52%)
- Background dark: HSL(220 45% 8%) — deep navy
- Background light: HSL(210 30% 96%)
- Font convention: use Tailwind semantic tokens only, never hardcode colors
- Class conventions: gradient-gold, gradient-hero, shadow-gold, shadow-navy, text-gold, glow-gold

# Key Decisions
- Dark mode default (saved to localStorage as "theme")
- Language saved to localStorage as "language" — en/id
- WhatsApp admin: +62 815-7088-769 → wa.me/6281570887690
- QRIS: real GoPay QR image at src/assets/qris-gopay.jpg
- Project name: JasebKu Store (was DigiStore)

# Architecture
- Contexts: LanguageContext (i18n), AuthContext (supabase auth)
- Data: src/data/products.ts (static product catalog)
- DB tables: profiles, products, orders
- Google OAuth via Lovable managed social auth (lovable.auth.signInWithOAuth)

# Routes
- / → Index (homepage)
- /login → Login
- /register → Register
- /payment/:productId → Payment
- /dashboard → Dashboard (protected)
