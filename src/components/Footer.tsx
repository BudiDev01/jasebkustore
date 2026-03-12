import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-gold">JasebKu</span>
                <span className="text-foreground"> Store</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footerTagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">{t.footerLinks}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t.home}</Link></li>
              <li><a href="#products" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t.products}</a></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t.dashboard}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">{t.footerContact}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/6281570887690"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  +62 815-7088-769
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} JasebKu Store. {t.footerRights}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Made with</span>
            <span className="text-gold text-xs">♥</span>
            <span className="text-xs text-muted-foreground">in Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
