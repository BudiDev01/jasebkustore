import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import qrisImage from "@/assets/qris-gopay.jpg";

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];

const TopUp = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState<"select" | "pay">("select");
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const selectedAmount = typeof amount === "number" ? amount : parseInt(customAmount) || 0;

  const handleProceed = () => {
    if (selectedAmount < 1000) {
      toast({ title: "Error", description: "Minimum top-up Rp 1.000", variant: "destructive" });
      return;
    }
    setStep("pay");
  };

  const handleConfirm = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please login first", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("topups").insert({
      user_id: user.id,
      amount: selectedAmount,
      method: "qris",
      status: "pending",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate("/topup/success");
    }
  };

  const handleCancel = () => {
    navigate("/topup/cancel");
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/60 mb-4">Silakan login terlebih dahulu</p>
          <Link to="/login">
            <Button className="gradient-gold text-primary-foreground">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-navy overflow-hidden">
          <div className="gradient-gold p-6">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-primary-foreground" />
              <div>
                <h1 className="text-xl font-black text-primary-foreground">Top Up Saldo</h1>
                <p className="text-primary-foreground/70 text-sm">Isi saldo akun Anda</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {step === "select" ? (
              <>
                {/* Preset amounts */}
                <div>
                  <Label className="text-white/70 text-sm mb-3 block">Pilih Nominal</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setAmount(preset); setCustomAmount(""); }}
                        className={`rounded-xl border p-3 text-center text-sm font-semibold transition-all ${
                          amount === preset
                            ? "border-gold bg-gold/20 text-gold"
                            : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {formatPrice(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div>
                  <Label className="text-white/70 text-sm">Atau Masukkan Nominal Lain</Label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
                    min={1000}
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    placeholder="Minimal Rp 1.000"
                  />
                </div>

                <Button
                  onClick={handleProceed}
                  disabled={selectedAmount < 1000}
                  className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold"
                >
                  Lanjutkan — {selectedAmount > 0 ? formatPrice(selectedAmount) : "Rp 0"}
                </Button>
              </>
            ) : (
              <>
                {/* Payment summary */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-white/50 text-sm">Total Top Up</p>
                  <p className="text-gold font-black text-2xl mt-1">{formatPrice(selectedAmount)}</p>
                </div>

                {/* QRIS */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
                    <img src={qrisImage} alt="QRIS" className="w-48 h-48 object-contain rounded-lg" />
                    <p className="text-white/50 text-xs">Scan QRIS untuk membayar</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Saya Sudah Bayar"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                  >
                    Batalkan
                  </Button>
                  <button onClick={() => setStep("select")} className="w-full text-white/40 text-sm hover:text-white/60">
                    ← Ubah Nominal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
