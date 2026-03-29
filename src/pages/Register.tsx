import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { lovable } from "@/integrations/lovable";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/`,
      extraParams: { prompt: "select_account" },
    });
    setGoogleLoading(false);
    if (result?.error) {
      toast({ title: "Error", description: String(result.error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-white">
            <span className="text-gold">JasebKu</span> Store
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-navy">
          <h1 className="text-2xl font-black text-white mb-1">{t.registerTitle}</h1>
          <p className="text-white/50 text-sm mb-6">{t.registerSubtitle}</p>

          <Button
            type="button"
            variant="outline"
            className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 gap-2 h-12 text-base"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {t.continueGoogle}
          </Button>

          <p className="text-center text-white/40 text-sm mt-6">
            {t.alreadyAccount}{" "}
            <Link to="/login" className="text-gold hover:underline font-medium">
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
