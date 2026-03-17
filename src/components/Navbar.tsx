import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Menu, X, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoAnimating, setLogoAnimating] = useState(false);

  const handleLogoClick = useCallback(() => {
    setLogoAnimating(true);
    setTimeout(() => setLogoAnimating(false), 600);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const isId = language === "id";
      const utterance = new SpeechSynthesisUtterance(
        isId ? "Selamat datang di JasebKu Store" : "Welcome to JasebKu Store"
      );
      utterance.rate = 1;
      utterance.pitch = 1.1;
      utterance.lang = isId ? "id-ID" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={handleLogoClick}>
            <div className={`w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-gold transition-transform ${logoAnimating ? "animate-cartoon-bounce" : ""}`}>
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-transform ${logoAnimating ? "animate-cartoon-wiggle" : ""}`}>
              <span className="text-gold">JasebKu</span>
              <span className="text-foreground"> Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {t.home}
            </Link>
            <a href="#products" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {t.products}
            </a>
            {user && (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {t.dashboard}
                </Link>
                <Link to="/topup" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {t.topUp}
                </Link>
                <Link to="/topup/history" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {t.topUpHistory}
                </Link>
              </>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "text-gold font-semibold" : ""}>
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("id")} className={language === "id" ? "text-gold font-semibold" : ""}>
                  🇮🇩 Bahasa Indonesia
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gold/40 hover:border-gold transition-colors">
                      <Avatar className="w-7 h-7 border border-gold/30">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt="Profile" />
                        ) : null}
                        <AvatarFallback className="gradient-gold text-primary-foreground text-xs font-bold">
                          {(profile?.username || user.email || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                        {profile?.username || profile?.full_name || user.email?.split("@")[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      {t.dashboard}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/topup")}>
                      {t.topUp}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/topup/history")}>
                      {t.topUpHistory}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    {t.login}
                  </Button>
                  <Button size="sm" className="gradient-gold text-primary-foreground hover:opacity-90 shadow-gold" onClick={() => navigate("/register")}>
                    {t.register}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
              {t.home}
            </Link>
            <a href="#products" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
              {t.products}
            </a>
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                  {t.dashboard}
                </Link>
                <Link to="/topup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                  {t.topUp}
                </Link>
                <Link to="/topup/history" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                  {t.topUpHistory}
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
              {user ? (
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                  {t.logout}
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                    {t.login}
                  </Button>
                  <Button size="sm" className="w-full gradient-gold text-primary-foreground" onClick={() => { navigate("/register"); setMenuOpen(false); }}>
                    {t.register}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
