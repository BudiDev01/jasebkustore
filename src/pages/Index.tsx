import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Shield, Zap, HeadphonesIcon, Send, Search, X, MessageCircle, Globe, Scissors, Palette, CreditCard, Megaphone, Bot, Activity, Scale, Globe2, Server, LayoutDashboard, UserCog, Cpu, Bug, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import TarotCard from "@/components/TarotCard";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";



import { PRODUCTS } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";


const CATEGORIES: { key: string; icon: string; desc_en?: string; desc_id?: string }[] = [
  { key: "whatsapp", icon: "📱" },
  { key: "bot-wa", icon: "🤖" },
  { key: "telegram", icon: "✈️" },
  { key: "website", icon: "🌐" },
  { key: "editing", icon: "✂️" },
  { key: "design", icon: "🎨" },
  { key: "bank", icon: "🏦" },
  { key: "jaseb", icon: "📣" },
  { key: "userbot", icon: "🤖" },
  { key: "suntik", icon: "💉" },
  { key: "legalitas", icon: "⚖️" },
  { key: "domain", icon: "🌐" },
  { key: "hosting", icon: "🖥️" },
  { key: "cpanel", icon: "🎛️" },
  { key: "admin-panel", icon: "🛡️" },
  { key: "vps", icon: "⚡" },
  { key: "hack", icon: "💻" },
  { key: "recovery", icon: "🔑" },
];

import type { LucideIcon } from "lucide-react";
const TAROT_ICONS: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  "bot-wa": Bot,
  telegram: Send,
  website: Globe,
  editing: Scissors,
  design: Palette,
  bank: CreditCard,
  jaseb: Megaphone,
  userbot: Bot,
  suntik: Activity,
  legalitas: Scale,
  domain: Globe2,
  hosting: Server,
  cpanel: LayoutDashboard,
  "admin-panel": UserCog,
  vps: Cpu,
  hack: Bug,
  recovery: KeyRound,
};
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII"];




const Index = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme] = useState<"light" | "dark">("light");
  const touchedProducts = useRef<Set<string>>(new Set());
  const confettiFired = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleProductTouch = useCallback((productId: string) => {
    // Small confetti on each new product touch
    if (!touchedProducts.current.has(productId)) {
      touchedProducts.current.add(productId);
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 }, colors: ["#D4A017", "#FFD700"] });
    }

    // Big confetti when ALL products touched
    if (!confettiFired.current && touchedProducts.current.size >= PRODUCTS.length) {
      confettiFired.current = true;
      const end = Date.now() + 2500;
      const fire = () => {
        confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, colors: ["#D4A017", "#FFD700", "#1a2744", "#ffffff"] });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      fire();
    }
  }, []);

  // Track page visit
  useEffect(() => {
    supabase.from("page_visits").insert({
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    }).then(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const toggleTheme = () => {};

  

  const categoryLabel = (key: string) => {
    const map: Record<string, string> = {
      whatsapp: t.catWhatsapp,
      "bot-wa": t.catBotWa,
      telegram: t.catTelegram,
      website: t.catWebsite,
      editing: t.catEditing,
      design: t.catDesign,
      bank: t.catBanking,
      jaseb: t.catJaseb,
      userbot: t.catUserbot,
      suntik: t.catSuntik,
      legalitas: t.catLegalitas,
      domain: t.catDomain,
      hosting: t.catHosting,
      cpanel: t.catCpanel,
      "admin-panel": t.catAdminPanel,
      vps: t.catVps,
      hack: t.catHacking,
      recovery: t.catRecovery,
    };
    return map[key] || key;
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter((p) => {
      const haystack = [
        p.name,
        p.name_id,
        p.description,
        p.description_id,
        p.category,
        categoryLabel(p.category),
        p.badge,
        p.icon,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [searchQuery, language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="bg-gradient-to-br from-background via-secondary to-background min-h-[88vh] flex items-center relative">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "hsl(var(--gold))" }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl" style={{ background: "hsl(220 60% 50%)" }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="animate-fade-in">
              <Badge className="gradient-gold text-primary-foreground border-0 mb-6 text-xs px-3 py-1 shadow-gold">
                <Sparkles className="w-3 h-3 mr-1" /> JasebKu Store
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 text-foreground leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gradient-gold text-primary-foreground hover:opacity-90 shadow-gold text-base font-semibold gap-2 glow-gold"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t.heroCta} <ArrowRight className="w-4 h-4" />
                </Button>
                {!user && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted text-base font-semibold"
                    onClick={() => navigate("/register")}
                  >
                    {t.register}
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: "50+", label: t.heroStats1 },
                { value: "1K+", label: t.heroStats2 },
                { value: "24/7", label: t.heroStats3 },
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-xl border border-border bg-card backdrop-blur-sm">
                  <div className="text-2xl font-black text-gold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: <Shield className="w-4 h-4 text-gold" />, label: "Secure Payment" },
              { icon: <Zap className="w-4 h-4 text-gold" />, label: "Instant Delivery" },
              { icon: <HeadphonesIcon className="w-4 h-4 text-gold" />, label: "24/7 Support" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram contact */}
      <section className="py-10 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://t.me/Fadgww?text=Saya%20ingin%20membeli%20produk%20dari%20JasebKu."
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram admin"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity text-sm"
          >
            <Send className="w-5 h-5" />
            Admin Telegram
          </a>
          <a
            href="https://t.me/JasebKu_1"
            target="_blank"
            rel="noreferrer"
            aria-label="Channel"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gold/40 bg-card text-gold font-semibold shadow-card hover:bg-gold/5 transition-colors text-sm"
          >
            <Send className="w-5 h-5" />
            Channel
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-3">{t.ourProducts}</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
              {t.ourProducts}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.ourProductsSubtitle}</p>
            <p className="text-gold font-semibold mt-2 text-sm">{t.resellerNote}</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition-all shadow-card"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tarot cards (default) or search results (when searching) */}
          {searchQuery.trim() ? (
            // --- Search results mode ---
            filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t.searchNoResults}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onTouch={handleProductTouch} />
                ))}
              </div>
            )
          ) : (
            // --- Tarot cards mode ---
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
                {CATEGORIES.map((cat, idx) => {
                  const Icon = TAROT_ICONS[cat.key];
                  if (!Icon) return null;
                  return (
                    <TarotCard
                      key={cat.key}
                      icon={Icon}
                      title={categoryLabel(cat.key)}
                      ordinal={ROMAN[idx + 1] || ""}
                      isActive={activeCategory === cat.key}
                      onClick={() =>
                        setActiveCategory((prev) => (prev === cat.key ? null : cat.key))
                      }
                    />
                  );
                })}
              </div>

              {/* Revealed products for the active category */}
              {activeCategory && (
                <div className="mt-12 rounded-2xl border-2 border-gold/40 bg-card/60 shadow-gold overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between gap-3 px-6 py-4 bg-navy">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = TAROT_ICONS[activeCategory];
                        return Icon ? <Icon className="w-6 h-6 text-gold" strokeWidth={1} /> : null;
                      })()}
                      <h3
                        className="text-lg font-bold text-gold uppercase tracking-[0.15em]"
                        style={{ fontFamily: "Cinzel, serif" }}
                      >
                        {categoryLabel(activeCategory)}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="text-gold/70 hover:text-gold text-xs uppercase tracking-[0.2em] transition-colors"
                      style={{ fontFamily: "Cinzel, serif" }}
                    >
                      ✕ {t.close}
                    </button>
                  </div>
                  <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {PRODUCTS.filter((p) => p.category === activeCategory).map((product) => (
                      <ProductCard key={product.id} product={product} onTouch={handleProductTouch} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
