import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShoppingBag, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type LoginMode = "select" | "regular" | "vip";

type SourceOption = {
  value: string;
  label_en: string;
  label_id: string;
};

const SOURCE_OPTIONS: SourceOption[] = [
  { value: "telegram", label_en: "Telegram", label_id: "Telegram" },
  { value: "whatsapp", label_en: "WhatsApp", label_id: "WhatsApp" },
  { value: "friend", label_en: "Friend / Referral", label_id: "Teman / Referral" },
  { value: "google", label_en: "Google Search", label_id: "Pencarian Google" },
  { value: "social", label_en: "Social Media", label_id: "Media Sosial" },
  { value: "other", label_en: "Other", label_id: "Lainnya" },
];

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<LoginMode>("select");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const handleRegularLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      toast({ title: "Error", description: "Please use a Gmail address (@gmail.com)", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/");
  };

  const handleVipLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const vipEmail = `${username}@vip.jasebku.local`;
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: vipEmail,
      password,
    });

    if (authError) {
      setLoading(false);
      toast({ title: "Error", description: authError.message, variant: "destructive" });
      return;
    }

    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      setLoading(false);
      toast({ title: "Access Denied", description: "You don't have VIP access.", variant: "destructive" });
      return;
    }

  setLoading(false);
    navigate("/vip/dashboard");
  };

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  // Selection screen
  if (mode === "select") {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
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
            <h1 className="text-2xl font-black text-white mb-1">{t.loginTitle}</h1>
            <p className="text-white/50 text-sm mb-8">{t.loginSubtitle}</p>

            <div className="space-y-4">
              <button
                onClick={() => { resetForm(); setMode("regular"); }}
                className="w-full group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-gold/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Regular</p>
                    <p className="text-white/40 text-sm">Login dengan Gmail & password</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { resetForm(); setMode("vip"); }}
                className="w-full group relative overflow-hidden rounded-xl border border-gold/20 bg-gold/5 p-5 text-left transition-all hover:border-gold/50 hover:bg-gold/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                    <Crown className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-gold text-lg">VIP</p>
                    <p className="text-white/40 text-sm">Login dengan username & password</p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-center text-white/40 text-sm mt-6">
              {t.noAccount}{" "}
              <Link to="/register" className="text-gold hover:underline font-medium">
                {t.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isVip = mode === "vip";

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
            {isVip ? <Crown className="w-5 h-5 text-primary-foreground" /> : <ShoppingBag className="w-5 h-5 text-primary-foreground" />}
          </div>
          <span className="font-bold text-xl text-white">
            {isVip ? <><span className="text-gold">VIP</span> Access</> : <><span className="text-gold">JasebKu</span> Store</>}
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-navy">
          {/* Back button */}
          <button
            onClick={() => { resetForm(); setMode("select"); }}
            className="text-white/40 hover:text-white/70 text-sm mb-4 flex items-center gap-1"
          >
            ← Kembali
          </button>

          <h1 className="text-2xl font-black text-white mb-1">
            {isVip ? "VIP Login" : t.loginTitle}
          </h1>
          <p className="text-white/50 text-sm mb-6">
            {isVip ? "Enter your credentials to access the admin panel" : t.loginSubtitle}
          </p>

          {!isVip && (
            <form onSubmit={handleRegularLogin} className="space-y-4">
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.loginButton}
              </Button>
            </form>
          )}

          {isVip && (
            <form
              onSubmit={handleVipLogin}
              className="space-y-4"
              autoComplete="on"
              id="vip-login-form"
            >
              <div>
                <Label className="text-white/70 text-sm">Username</Label>
                <Input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  required
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                  placeholder="username"
                />
              </div>
              <div>
                <Label className="text-white/70 text-sm">{t.passwordLabel}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
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
                className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.loginButton}
              </Button>
            </form>
          )}

          {/* Forgot password link - VIP only */}
          {isVip && (
            <p className="text-center text-white/40 text-sm mt-4">
              <Link
                to="/vip/forgot-password"
                className="text-gold hover:underline font-medium"
              >
                {t.forgotPassword}
              </Link>
            </p>
          )}

          <p className="text-center text-white/40 text-sm mt-6">
            {isVip ? (
              <Link to="/" className="hover:text-white/50">← Back to Store</Link>
            ) : (
              <>
                {t.noAccount}{" "}
                <Link to="/register" className="text-gold hover:underline font-medium">
                  {t.register}
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
