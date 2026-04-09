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
  {
    id: "edit-photo",
    name: "Photo Editing",
    name_id: "Edit Foto",
    originalPrice: 0,
    promoPrice: 5000,
    icon: "📸",
    badge: "PROMO",
  },
  {
    id: "edit-image",
    name: "Image Editing",
    name_id: "Edit Gambar",
    originalPrice: 0,
    promoPrice: 5000,
    icon: "🖼️",
    badge: "PROMO",
  },
  {
    id: "edit-qris",
    name: "QRIS Editing",
    name_id: "Edit QRIS",
    originalPrice: 0,
    promoPrice: 5000,
    icon: "💠",
    badge: "PROMO",
  },
  {
    id: "edit-other",
    name: "Other Editing",
    name_id: "Edit Lainnya (Request)",
    originalPrice: 0,
    promoPrice: 5000,
    icon: "🎨",
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
        {/* Banner */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-gold">
          <img
            src={promoBanner}
            alt="JasebKu Store Promo Spesial"
            className="w-full h-auto object-cover"
            loading="lazy"
            width={1200}
            height={512}
          />
        </div>

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

        {/* Products removed — promo banner only */}
      </div>
    </section>
  );
};

export default PromoSection;
