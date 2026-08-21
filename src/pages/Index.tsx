import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Shield, Zap, HeadphonesIcon, Send, Search, X, MessageCircle, Globe, Link2, Server, Bot, Scissors, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import TarotCard from "@/components/TarotCard";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import VideoSection from "@/components/VideoSection";
import WhatsAppButton from "@/components/WhatsAppButton";

import SoundBoard from "@/components/SoundBoard";

import { PRODUCTS } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";


const CATEGORIES: { key: string; icon: string; desc_en?: string; desc_id?: string }[] = [
  { key: "whatsapp", icon: "📱" },
  { key: "telegram", icon: "✈️" },
  { key: "website", icon: "🌐" },
  { key: "domain", icon: "🔤" },
  { key: "hosting", icon: "🖥️" },
  { key: "panelbot", icon: "🤖" },
  { key: "editing", icon: "✂️" },
  { key: "design", icon: "🎨" },
];


const Index = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme] = useState<"light" | "dark">("light");
  const touchedProducts = useRef<Set<string>>(new Set());
  const confettiFired = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      telegram: t.catTelegram,
      website: t.catWebsite,
      domain: t.catDomain,
      hosting: t.catHosting,
      panelbot: t.catPanelbot,
      editing: t.catEditing,
      design: t.catDesign,
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
              <div className="max-w-2xl mx-auto mb-8 rounded-xl overflow-hidden border border-border bg-card shadow-card">
                <video
                  controls
                  preload="metadata"
                  className="w-full aspect-video bg-black"
                >
                  <source src="/video/VID_20260408_132401_512.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
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
      {/* Userbot Banner */}
      <section className="py-6 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-4 sm:grid-cols-2">
          <a
            href="https://t.me/OfficialJasebKuBot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-gold/30 bg-card shadow-gold hover:bg-gold/10 transition-all group"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-center">
              <span className="block text-base font-bold text-foreground group-hover:text-gold transition-colors">
                {language === "id" ? "Gunakan Bot Telegram Kami" : "Use Our Telegram Bot"}
              </span>
              <span className="block text-xs text-muted-foreground">@OfficialJasebKuBot — Rp 10.000/{language === "id" ? "bulan" : "month"}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="https://t.me/jasebkuone_bot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-gold/30 bg-card shadow-gold hover:bg-gold/10 transition-all group"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-center">
              <span className="block text-base font-bold text-foreground group-hover:text-gold transition-colors">
                {language === "id" ? "Userbot Kedua" : "Second Userbot"}
              </span>
              <span className="block text-xs text-muted-foreground">@jasebkuone_bot</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

      </section>

      {/* Contact & Action Buttons */}
      <section className="py-10 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-foreground mb-1">
              {language === "id" ? "Info Promo" : "Promo Info"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "id"
                ? "Tanya admin produk apa saja yang sedang promo saat ini"
                : "Ask the admin which products are currently on promotion"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://t.me/Fadgww"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity text-sm"
            >
              <Send className="w-5 h-5" />
              {language === "id" ? "Tanya Promo" : "Ask About Promos"}
            </a>
            <a
              href="https://t.me/Fadgww"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-500 font-semibold hover:bg-blue-500/20 transition-colors text-sm"
            >
              <span className="text-lg">✈️</span>
              {language === "id" ? "Admin Freelance" : "Freelance Admin"}
            </a>
          </div>

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

          {/* Category Cards with sub-products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">{t.searchNoResults}</p>
            </div>
          ) : (
          <div className="space-y-8">
            {CATEGORIES.map((cat) => {
              const catProducts = filteredProducts.filter((p) => p.category === cat.key);
              if (catProducts.length === 0) return null;
              return (
                <div
                  key={cat.key}
                  className="rounded-2xl border border-border bg-card/40 shadow-card overflow-hidden"
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 px-6 py-4 gradient-gold">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-primary-foreground leading-tight">
                        {categoryLabel(cat.key)}
                      </h3>
                      {(cat.desc_en || cat.desc_id) && (
                        <p className="text-xs text-primary-foreground/80 mt-0.5 max-w-2xl">
                          {language === "id" ? cat.desc_id : cat.desc_en}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sub-products grid */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {catProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onTouch={handleProductTouch} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      <SoundBoard />
      <VideoSection />
      <MusicPlayer />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
