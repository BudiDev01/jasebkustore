import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "email" | "otp" | "newPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "OTP Sent!", description: "Check your email inbox for the recovery code." });
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Error", description: "Please enter the 6-digit code.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "recovery" });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid Code", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verified!", description: "Now set your new password." });
      setStep("newPassword");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Password has been changed. Please login." });
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

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
          <h1 className="text-2xl font-black text-white mb-1">Reset Password</h1>
          <p className="text-white/50 text-sm mb-6">
            {step === "email" && "Enter your email to receive a recovery code"}
            {step === "otp" && "Enter the 6-digit code sent to your email"}
            {step === "newPassword" && "Set your new password"}
          </p>

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label className="text-white/70 text-sm">{t.emailLabel}</Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold pr-10"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="bg-white/5 border-white/20 text-white" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
              </Button>
              <button type="button" onClick={() => setStep("email")} className="w-full text-white/40 text-sm hover:text-white/60">
                Resend code
              </button>
            </form>
          )}

          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label className="text-white/70 text-sm">New Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold" placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div>
                <Label className="text-white/70 text-sm">Confirm Password</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-gold" placeholder="••••••••" autoComplete="new-password" />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground hover:opacity-90 shadow-gold font-semibold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
              </Button>
            </form>
          )}

          <p className="text-center text-white/30 text-xs mt-6">
            <Link to="/login" className="hover:text-white/50">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
