import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get("next");
  const safeNext = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : null;
  const emailRedirect = safeNext ? window.location.origin + safeNext : window.location.origin;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      toast({ title: "Error", description: "Please use a Gmail address (@gmail.com)", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: emailRedirect },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Check your Gmail inbox to verify your account." });
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label className="text-white/70 text-sm">{t.emailLabel}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                placeholder="you@gmail.com"
              />
            </div>
            <div>
              <Label className="text-white/70 text-sm">{t.passwordLabel}</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold h-12 text-base"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.registerButton}
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            {t.alreadyAccount}{" "}
            <Link to={safeNext ? `/login?next=${encodeURIComponent(safeNext)}` : "/login"} className="text-gold hover:underline font-medium">
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
