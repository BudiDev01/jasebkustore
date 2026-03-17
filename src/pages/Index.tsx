import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Shield, Zap, HeadphonesIcon } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp.svg"; // WhatsApp icon
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
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";


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

  const [theme] = useState<"light" | "dark">("light");
  const [activeCategory, setActiveCategory] = useState("all");
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

      {/* Contact & Action Buttons */}
      <section className="py-10 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/628157088769"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity text-sm"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
              {language === "id" ? "Tanya Admin" : "Ask Questions"}
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
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onTouch={handleProductTouch} />
            ))}
          </div>
        </div>
      </section>

      {/* Example Websites Section */}
      <section id="examples" className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-3">
              {language === "id" ? "Contoh Website" : "Website Examples"}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
              {language === "id" ? "Lihat Contoh Website Kami" : "See Our Website Examples"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {language === "id"
                ? "Berikut beberapa contoh website yang sudah kami buat. Anda bisa request sesuai kebutuhan!"
                : "Here are some websites we've built. You can request one tailored to your needs!"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Landing Page Bisnis", titleEn: "Business Landing Page", desc: "Website profil bisnis modern & responsif", descEn: "Modern & responsive business profile site", video: "/__l5e/assets-v1/396b1893-b56c-4dd5-982a-f3784a1736cd/example-landing-page.mp4" },
              { title: "Toko Online", titleEn: "Online Store", desc: "E-commerce lengkap dengan keranjang & checkout", descEn: "Full e-commerce with cart & checkout", video: "/__l5e/assets-v1/c1ef93ed-ffac-49c0-b8f6-d8edbf5f2971/example-online-store.mp4" },
              { title: "Portfolio Pribadi", titleEn: "Personal Portfolio", desc: "Tampilkan karya & skill profesional Anda", descEn: "Showcase your work & professional skills", video: "/__l5e/assets-v1/0ba42fc1-0c3a-4900-8110-95f0ea38ff05/example-portfolio.mp4" },
              { title: "Company Profile", titleEn: "Company Profile", desc: "Website perusahaan elegan & informatif", descEn: "Elegant & informative corporate website", video: "/__l5e/assets-v1/08b7a54b-a84a-46ca-bbc3-2d5de322e427/example-company-profile.mp4" },
              { title: "Blog & Media", titleEn: "Blog & Media", desc: "Platform konten dengan CMS yang mudah", descEn: "Content platform with easy CMS", video: "/__l5e/assets-v1/ebeb4c5e-81af-4fd3-9fde-b84f409c4520/example-blog.mp4" },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-card overflow-hidden shadow-card hover:shadow-navy hover:-translate-y-1 transition-all duration-300"
              >
                {/* Video */}
                <div className="aspect-video bg-muted/30 relative overflow-hidden">
                  <video
                    src={item.video}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-gold transition-colors">
                    {language === "id" ? item.title : item.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {language === "id" ? item.desc : item.descEn}
                  </p>
                  <a
                    href={`https://wa.me/628157088769?text=${encodeURIComponent(
                      language === "id"
                        ? `Halo, saya tertarik request website "${item.title}". Bisa info lebih lanjut?`
                        : `Hi, I'm interested in requesting a "${item.titleEn}" website. Can you share more info?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md gradient-gold text-primary-foreground text-xs font-semibold shadow-gold hover:opacity-90 transition-opacity"
                  >
                    <img src={whatsappIcon} alt="WhatsApp" className="w-3.5 h-3.5" />
                    {language === "id" ? "Request Sekarang" : "Request Now"}
                  </a>
                </div>
              </div>
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
