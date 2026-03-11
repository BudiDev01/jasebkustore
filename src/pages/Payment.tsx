import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Upload, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const { productId } = useParams();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return <div className="min-h-screen gradient-hero flex items-center justify-center text-white">Product not found</div>;

  const name = language === "id" ? product.name_id : product.name;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleConfirm = async () => {
    if (!user) {
      toast({ title: "Please login first", description: "You need to be logged in to purchase.", variant: "destructive" });
      navigate("/login");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      amount: product.price,
      status: "pending",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Back */}
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.backHome}
        </Link>

        {success ? (
          /* Success State */
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl p-8 text-center shadow-navy">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t.paymentSuccess}</h2>
            <p className="text-white/60 text-sm mb-6">{t.paymentSuccessMsg}</p>
            <Button
              onClick={() => navigate("/")}
              className="gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
            >
              {t.backHome}
            </Button>
          </div>
        ) : (
          /* Payment Card */
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

              {/* QRIS QR Code Placeholder */}
              <div className="text-center">
                <div className="inline-flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="w-48 h-48 rounded-lg bg-white flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder QR */}
                    <div className="flex flex-col items-center gap-2">
                      <QrCode className="w-20 h-20 text-gray-800" />
                      <span className="text-[10px] text-gray-500 font-medium">QRIS GoPay</span>
                    </div>
                    {/* Overlay watermark */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-700 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 font-medium">Upload your QRIS</p>
                        <p className="text-[10px] text-gray-400">via Cloud Storage</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">DigiStore</p>
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

              {/* Confirm Button */}
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold text-base glow-gold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {t.confirmPayment}
              </Button>

              {!user && (
                <p className="text-center text-white/40 text-xs">
                  You must be{" "}
                  <Link to="/login" className="text-gold hover:underline">logged in</Link>
                  {" "}to confirm payment
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
