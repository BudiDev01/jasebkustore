import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VipLogin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    const checkExistingAdmin = async () => {
      if (!user) { setChecking(false); return; }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      if (roles && roles.length > 0) {
        navigate("/vip/dashboard", { replace: true });
      } else {
        setChecking(false);
      }
    };
    checkExistingAdmin();
  }, [user]);

  if (checking) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const vipEmail = `${username}@vip.jasebku.local`;
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: vipEmail, password });
    
    if (authError) {
      setLoading(false);
      toast({ title: "Error", description: authError.message, variant: "destructive" });
      return;
    }

    // Check if user has admin role
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

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-white">
            <span className="text-gold">VIP</span> Access
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-navy">
          <h1 className="text-2xl font-black text-white mb-1">VIP Login</h1>
          <p className="text-white/50 text-sm mb-6">Enter your credentials to access the admin panel</p>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="on" id="vip-login-form">
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
              <Label className="text-white/70 text-sm">Password</Label>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm mt-4">
            <Link to="/vip/forgot-password" className="text-gold hover:underline font-medium">
              Forgot Password?
            </Link>
          </p>
          <p className="text-center text-white/30 text-xs mt-4">
            <Link to="/" className="hover:text-white/50">← Back to Store</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipLogin;
