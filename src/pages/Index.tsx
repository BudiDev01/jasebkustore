import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Shield, Zap, HeadphonesIcon, ChevronLeft, ChevronRight, Send } from "lucide-react";
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
import CustomerChat from "@/components/CustomerChat";
import SoundBoard from "@/components/SoundBoard";
import PromoSection from "@/components/PromoSection";
import { PRODUCTS } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";


const CATEGORIES: { key: string; icon: string; desc_en?: string; desc_id?: string }[] = [
  { key: "freelance", icon: "💰", desc_en: "Task: create Gmail accounts. You will receive money every day from us.", desc_id: "Tugas: membuat akun Gmail. Kamu akan menerima uang setiap hari dari kami." },
  { key: "jaseb", icon: "📢", desc_en: "Promotion to 60 groups for 1 month, priced at 15,000.", desc_id: "Promosi ke 60 grup selama 1 bulan, harga 15.000." },
  { key: "whatsapp", icon: "📱" },
  { key: "whatsapp_intl", icon: "🌐" },
  { key: "telegram", icon: "✈️" },
  { key: "social", icon: "📈" },
  { key: "gworkspace", icon: "🏢" },
  { key: "premium", icon: "⭐" },
  { key: "website", icon: "🌐" },
  { key: "domain", icon: "🔤" },
  { key: "hosting", icon: "🖥️" },
  { key: "design", icon: "🎨" },
  { key: "editing", icon: "✂️" },
  { key: "video", icon: "🎬" },
  { key: "coding", icon: "💻" },
  { key: "rekber", icon: "🤝" },
  { key: "banking", icon: "🏦" },
];

// Group categories into slides: first slide has 2 (Freelance & Jaseb), rest in groups of 3
const CATEGORY_SLIDES = (() => {
  const slides: typeof CATEGORIES[] = [];
  slides.push(CATEGORIES.slice(0, 2));
  const rest = CATEGORIES.slice(2);
  for (let i = 0; i < rest.length; i += 3) {
    slides.push(rest.slice(i, i + 3));
  }
  return slides;
})();

const Index = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme] = useState<"light" | "dark">("light");
  const [activeCategory, setActiveCategory] = useState("freelance");
  const [catSlide, setCatSlide] = useState(0);
  const touchedProducts = useRef<Set<string>>(new Set());
  const confettiFired = useRef(false);

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

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);

  const categoryLabel = (key: string) => {
    const map: Record<string, string> = {
      freelance: t.catFreelance,
      jaseb: t.catJaseb,
      whatsapp: t.catWhatsapp,
      telegram: t.catTelegram,
      social: t.catSocial,
      gworkspace: t.catGworkspace,
      premium: t.catPremium,
      website: t.catWebsite,
      domain: t.catDomain,
      hosting: t.catHosting,
      design: t.catDesign,
      editing: t.catEditing,
      video: t.catVideo,
      coding: t.catCoding,
      rekber: t.catRekber,
      banking: t.catBanking,
    };
    return map[key] || key;
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 bg-gold/10 text-gold font-semibold hover:bg-gold/20 transition-colors text-sm"
            >
              <span className="text-lg">✈️</span>
              {language === "id" ? "Klaim Deposit" : "Claim Deposits"}
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

          {/* Category Carousel */}
          <div className="relative mb-10">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCatSlide((p) => Math.max(0, p - 1))}
                disabled={catSlide === 0}
                className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 justify-center min-w-[280px] flex-wrap">
                {CATEGORY_SLIDES[catSlide]?.map((cat) => {
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setActiveCategory(cat.key);
                        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, colors: ["#D4A017", "#FFD700", "#1a2744", "#ffffff"] });
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeCategory === cat.key
                          ? "gradient-gold text-primary-foreground shadow-gold"
                          : "border border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{categoryLabel(cat.key)}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCatSlide((p) => Math.min(CATEGORY_SLIDES.length - 1, p + 1))}
                disabled={catSlide === CATEGORY_SLIDES.length - 1}
                className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide indicator dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {CATEGORY_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCatSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === catSlide ? "bg-gold" : "bg-border"}`}
                />
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onTouch={handleProductTouch} />
            ))}
          </div>
        </div>
      </section>

      <PromoSection />
      <SoundBoard />
      <VideoSection />
      <MusicPlayer />
      <Footer />
      <WhatsAppButton />
      <CustomerChat />
    </div>
  );
};

export default Index;
