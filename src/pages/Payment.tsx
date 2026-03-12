import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp.svg";
import qrisImage from "@/assets/qris-gopay.jpg";
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
        {/* Back */}
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.backHome}
        </Link>

        {/* Payment Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-navy overflow-hidden">
          {/* Header */}
          <div className="gradient-gold p-6">
            <h1 className="text-xl font-black text-primary-foreground">{t.paymentTitle}</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">{t.paymentSubtitle}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Product summary */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
              <div className="text-3xl">{product.icon}</div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{name}</div>
                <div className="text-white/50 text-xs mt-0.5">{t.totalPayment}</div>
              </div>
              <div className="text-gold font-black text-lg">{formatPrice(product.price)}</div>
            </div>

            {/* QRIS QR Code */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5">
                <img
                  src={qrisImage}
                  alt="QRIS GoPay - JasebKu Store"
                  className="w-56 rounded-lg shadow-lg"
                />
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">JasebKu Store</p>
                  <p className="text-gold font-black text-xl">{formatPrice(product.price)}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="text-gold">📋</span> {t.paymentInstructions}
              </h3>
              <ol className="space-y-2">
                {[t.paymentStep1, t.paymentStep2, t.paymentStep3, t.paymentStep4].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="w-5 h-5 rounded-full gradient-gold text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Ask First via WhatsApp Button */}
            <a
              href="https://wa.me/628157088769"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold text-base glow-gold rounded-md px-4 py-3 transition-opacity"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
              {t.askFirst}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
