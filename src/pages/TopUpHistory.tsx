import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wallet, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TopUp {
  id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, label: "Menunggu", color: "text-yellow-400" },
  confirmed: { icon: <CheckCircle2 className="w-4 h-4" />, label: "Dikonfirmasi", color: "text-emerald-400" },
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, label: "Selesai", color: "text-emerald-400" },
  cancelled: { icon: <XCircle className="w-4 h-4" />, label: "Dibatalkan", color: "text-red-400" },
};

const TopUpHistory = () => {
  const { user } = useAuth();
  const [topups, setTopups] = useState<TopUp[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  useEffect(() => {
    if (!user) return;
    const fetchTopups = async () => {
      const { data } = await supabase
        .from("topups")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setTopups((data as TopUp[]) || []);
      setLoading(false);
    };
    fetchTopups();
  }, [user]);

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
    <div className="min-h-screen gradient-hero px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-navy overflow-hidden">
          <div className="gradient-gold p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-primary-foreground" />
              <h1 className="text-xl font-black text-primary-foreground">Riwayat Top Up</h1>
            </div>
            <Link to="/topup">
              <Button size="sm" variant="secondary" className="text-xs font-semibold">
                + Top Up
              </Button>
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-white/40" />
              </div>
            ) : topups.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Belum ada riwayat top up</p>
                <Link to="/topup">
                  <Button className="mt-4 gradient-gold text-primary-foreground text-sm">Top Up Sekarang</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {topups.map((item) => {
                  const cfg = statusConfig[item.status] || statusConfig.pending;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className={`${cfg.color}`}>{cfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{formatPrice(item.amount)}</p>
                        <p className="text-white/40 text-xs">
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpHistory;
