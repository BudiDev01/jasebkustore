import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const name = language === "id" ? product.name_id : product.name;
  const description = language === "id" ? product.description_id : product.description;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative rounded-xl border border-border bg-card shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1 overflow-hidden">
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
            <span className="text-base font-bold text-gold">{formatPrice(product.price)}</span>
          </div>
          <Button
            size="sm"
            disabled={product.stock_status !== "available"}
            onClick={() => navigate(`/payment/${product.id}`)}
            className="gradient-gold text-primary-foreground hover:opacity-90 shadow-gold text-xs gap-1.5 disabled:opacity-40"
          >
            <ShoppingCart className="w-3 h-3" />
            {t.buyNow}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
