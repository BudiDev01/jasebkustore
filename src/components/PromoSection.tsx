import React from "react";
import { useNavigate } from "react-router-dom";
import { Flame, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import promoBanner from "@/assets/promo-banner.jpg";
import { useToast } from "@/hooks/use-toast";

interface PromoItem {
  id: string;
  name: string;
  name_id: string;
  originalPrice: number;
  promoPrice: number;
  icon: string;
  badge?: string;
}

const PROMOS: PromoItem[] = [
  {
    id: "tg-001",
    name: "Noktel ID 1",
    name_id: "Noktel ID 1",
    originalPrice: 0,
    promoPrice: 15000,
    icon: "📱",
    badge: "PROMO",
  },
  {
    id: "web-payment",
    name: "Payment Website",
    name_id: "Website Pembayaran",
    originalPrice: 0,
    promoPrice: 5000,
    icon: "💳",
    badge: "PROMO",
  },
  {
    id: "web-bio",
    name: "Bio Website",
    name_id: "Website Bio",
    originalPrice: 0,
    promoPrice: 5000,
    icon: "🌐",
    badge: "PROMO",
  },
  {
    id: "web-store",
    name: "Store Website",
    name_id: "Website Toko",
    originalPrice: 0,
    promoPrice: 10000,
    icon: "🛒",
    badge: "PROMO",
  },
  {
    id: "web-custom",
    name: "Custom Website",
    name_id: "Website Lainnya (Request)",
    originalPrice: 0,
    promoPrice: 10000,
    icon: "✨",
    badge: "PROMO",
  },
];

const PromoSection = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleBuy = (promo: PromoItem) => {
    if (!user) {
      toast({
        title: language === "id" ? "Silakan daftar dulu" : "Please register first",
        variant: "destructive",
      });
      navigate("/register");
      return;
    }
    navigate(`/payment/${promo.id}`);
  };

  return (
    <section className="py-14 bg-gradient-to-r from-gold/5 via-background to-gold/5 border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 mb-3 gap-1">
            <Flame className="w-3 h-3" />
            {language === "id" ? "Promo Spesial" : "Special Promo"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            {language === "id" ? "🔥 Harga Promo Terbatas" : "🔥 Limited Promo Pricing"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {language === "id"
              ? "Dapatkan harga spesial sebelum promo berakhir!"
              : "Grab special prices before the promo ends!"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {PROMOS.map((promo) => (
            <div
              key={promo.id}
              className="relative w-full max-w-sm rounded-xl border-2 border-gold/30 bg-card shadow-gold overflow-hidden"
            >
              {/* Promo ribbon */}
              <div className="absolute top-3 -right-8 rotate-45 gradient-gold text-primary-foreground text-xs font-bold px-10 py-1 shadow-md">
                PROMO
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{promo.icon}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {language === "id" ? promo.name_id : promo.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {language === "id" ? "Per Akun" : "Per Account"}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-3xl font-black text-gold">
                    {formatPrice(promo.promoPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    /{language === "id" ? "akun" : "account"}
                  </span>
                </div>

                <Button
                  className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold gap-2"
                  onClick={() => handleBuy(promo)}
                >
                  {language === "id" ? "Beli Sekarang" : "Buy Now"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
