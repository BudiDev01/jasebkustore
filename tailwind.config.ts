import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        navy: "hsl(var(--navy))",
        "navy-light": "hsl(var(--navy-light))",
        gold: "hsl(var(--gold))",
        "gold-light": "hsl(var(--gold-light))",
        "gold-dark": "hsl(var(--gold-dark))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in": { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "cartoon-bounce": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "20%": { transform: "scale(1.3) rotate(-8deg)" },
          "40%": { transform: "scale(0.85) rotate(6deg)" },
          "60%": { transform: "scale(1.15) rotate(-4deg)" },
          "80%": { transform: "scale(0.95) rotate(2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        "cartoon-wiggle": {
          "0%": { transform: "translateX(0) skewX(0deg)" },
          "15%": { transform: "translateX(-4px) skewX(-6deg)" },
          "30%": { transform: "translateX(3px) skewX(4deg)" },
          "45%": { transform: "translateX(-2px) skewX(-3deg)" },
          "60%": { transform: "translateX(2px) skewX(2deg)" },
          "75%": { transform: "translateX(-1px) skewX(-1deg)" },
          "100%": { transform: "translateX(0) skewX(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        shimmer: "shimmer 2.5s infinite linear",
        float: "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
        "gradient-gold": "var(--gradient-gold)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        gold: "var(--shadow-gold)",
        navy: "var(--shadow-navy)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
