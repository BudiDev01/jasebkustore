import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Globe, Menu, X, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-gold">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">
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
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                {t.dashboard}
              </Link>
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

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gold/40 text-foreground hover:border-gold">
                      {user.email?.split("@")[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      {t.dashboard}
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
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                {t.dashboard}
              </Link>
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
