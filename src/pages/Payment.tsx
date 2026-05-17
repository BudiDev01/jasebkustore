import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PRODUCTS } from "@/data/products";

const Payment = () => {
  const { productId } = useParams();
  const { t, language } = useLanguage();

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return <div className="min-h-screen gradient-hero flex items-center justify-center text-white">Product not found</div>;

  const name = language === "id" ? product.name_id : product.name;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.backHome}
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-navy overflow-hidden">
          <div className="gradient-gold p-6">
            <h1 className="text-xl font-black text-primary-foreground">
              {language === "id" ? "Hubungi Admin" : "Contact Admin"}
            </h1>
            <p className="text-primary-foreground/70 text-sm mt-1">
              {language === "id"
                ? "Chat admin via Telegram untuk menyelesaikan pesanan Anda."
                : "Chat the admin on Telegram to complete your order."}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
              <div className="text-3xl">{product.icon}</div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{name}</div>
                <div className="text-white/50 text-xs mt-0.5">{t.totalPayment}</div>
              </div>
              <div className="text-gold font-black text-lg">{formatPrice(product.price)}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 leading-relaxed">
              {language === "id"
                ? "Klik tombol di bawah untuk chat admin di Telegram. Admin akan memandu metode pembayaran dan pengiriman produk."
                : "Click the button below to chat the admin on Telegram. The admin will guide you through payment and delivery."}
            </div>

            <a
              href="https://t.me/Fadgww"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold text-base glow-gold rounded-md px-4 py-3 transition-opacity"
            >
              <Send className="w-5 h-5" />
              {language === "id" ? "Chat Admin di Telegram" : "Chat Admin on Telegram"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
