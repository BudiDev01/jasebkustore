import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopUpCancel = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-navy">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Top Up Dibatalkan</h1>
          <p className="text-white/50 text-sm mb-6">
            Top up Anda telah dibatalkan. Tidak ada pembayaran yang diproses.
          </p>
          <div className="space-y-3">
            <Link to="/topup">
              <Button className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold">
                Coba Lagi
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white/70 hover:bg-white/10 mt-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpCancel;
