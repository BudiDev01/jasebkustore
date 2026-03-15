import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Shield, Zap, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import VideoSection from "@/components/VideoSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import SoundBoard from "@/components/SoundBoard";
import { PRODUCTS } from "@/data/products";

const CATEGORIES = [
  { key: "all", icon: "✨" },
  { key: "whatsapp", icon: "📱" },
  { key: "telegram", icon: "✈️" },
  { key: "social", icon: "📈" },
  { key: "gworkspace", icon: "🏢" },
  { key: "premium", icon: "⭐" },
  { key: "other", icon: "🔧" },
];

const Index = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto welcome voice on first visit (triggers on first user interaction due to browser policy)
  useEffect(() => {
    const welcomed = sessionStorage.getItem("jasebku-welcomed");
    if (welcomed) return;

    const speakWelcome = () => {
      if ("speechSynthesis" in window) {
        sessionStorage.setItem("jasebku-welcomed", "true");
        const isId = language === "id";
        const utterance = new SpeechSynthesisUtterance(
          isId ? "Selamat datang di JasebKu Store" : "Welcome to JasebKu Store"
        );
        utterance.rate = 1;
        utterance.pitch = 1.1;
        utterance.lang = isId ? "id-ID" : "en-US";
        window.speechSynthesis.speak(utterance);
      }
      document.removeEventListener("click", speakWelcome);
      document.removeEventListener("touchstart", speakWelcome);
    };

    document.addEventListener("click", speakWelcome, { once: true });
    document.addEventListener("touchstart", speakWelcome, { once: true });

    return () => {
      document.removeEventListener("click", speakWelcome);
      document.removeEventListener("touchstart", speakWelcome);
    };
  }, [language]);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const filteredProducts =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const categoryLabel = (key: string) => {
    const map: Record<string, string> = {
      all: "All",
      whatsapp: t.catWhatsapp,
      telegram: t.catTelegram,
      social: t.catSocial,
      gworkspace: t.catGworkspace,
      premium: t.catPremium,
      other: t.catOther,
    };
    return map[key] || key;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="gradient-hero min-h-[88vh] flex items-center relative">
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
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 text-white leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
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
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base font-semibold"
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
                <div key={i} className="text-center p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="text-2xl font-black text-gold">{stat.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
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
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "gradient-gold text-primary-foreground shadow-gold"
                    : "border border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{categoryLabel(cat.key)}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
