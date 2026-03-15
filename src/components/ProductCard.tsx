import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/data/products";
import whatsappIcon from "@/assets/whatsapp.svg";
import { speak } from "@/lib/speak";
import confetti from "canvas-confetti";

const ADMIN_WA = "https://wa.me/628157088769";

interface ProductCardProps {
  product: Product;
  onTouch?: (productId: string) => void;
}

const speakText = (text: string) => {
  speak(text, "id-ID");
};

const ProductCard = ({ product, onTouch }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showWa, setShowWa] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleCardTouch = () => {
    setTouched(true);
    speakText("JasebKu");
    onTouch?.(product.id);
    setTimeout(() => setTouched(false), 400);
  };

  const name = language === "id" ? product.name_id : product.name;
  const description = language === "id" ? product.description_id : product.description;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleBuyClick = () => {
    if (!user) {
      toast({ title: "Please register first", description: "You need an account to make a purchase.", variant: "destructive" });
      navigate("/register");
      return;
    }
    if (product.price_hidden) {
      setShowWa(true);
    } else {
      navigate(`/payment/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardTouch}
      className={`group relative rounded-xl border border-border bg-card shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer ${touched ? "animate-scale-in ring-2 ring-gold/50" : ""}`}
    >
      {/* Top accent line */}
      <div className="h-0.5 gradient-gold" />

      {/* Card Content */}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl animate-float">{product.icon}</div>
          <div className="flex flex-col items-end gap-1">
            {product.badge && (
              <Badge className="gradient-gold text-primary-foreground border-0 text-xs px-2 py-0.5">
                {product.badge}
              </Badge>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock_status === "available" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
              {product.stock_status === "available" ? t.available : t.outOfStock}
            </span>
          </div>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground block">{t.price}</span>
            {product.price_hidden ? (
              <span className="text-base font-bold text-gold">Hubungi Kami</span>
            ) : (
              <span className="text-base font-bold text-gold">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* CTA area */}
          {product.price_hidden ? (
            showWa ? (
              <a
                href={ADMIN_WA}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md gradient-gold text-primary-foreground text-xs font-semibold shadow-gold hover:opacity-90 transition-opacity"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
                WhatsApp
              </a>
            ) : (
              <Button
                size="sm"
                disabled={product.stock_status !== "available"}
                onClick={(e) => { e.stopPropagation(); speakText("gas"); handleBuyClick(); }}
                className="gradient-gold text-primary-foreground hover:opacity-90 shadow-gold text-xs gap-1.5 disabled:opacity-40"
              >
                Tanya Dulu
              </Button>
            )
          ) : (
            <Button
              size="sm"
              disabled={product.stock_status !== "available"}
              onClick={(e) => { e.stopPropagation(); speakText("beli sekarang"); handleBuyClick(); }}
              className="gradient-gold text-primary-foreground hover:opacity-90 shadow-gold text-xs gap-1.5 disabled:opacity-40"
            >
              <ShoppingCart className="w-3 h-3" />
              {t.buyNow}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
