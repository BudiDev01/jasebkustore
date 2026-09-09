import React from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TarotCardProps {
  icon: LucideIcon;
  title: string;
  ordinal: string; // roman numeral e.g. "I", "II"
  isActive: boolean;
  onClick: () => void;
}

/**
 * Mystical tarot card. Clicking flips it to reveal a "drawn" state and
 * triggers the parent to show that category's products below the grid.
 */
const TarotCard = ({ icon: Icon, title, ordinal, isActive, onClick }: TarotCardProps) => {
  const { t } = useLanguage();

  return (
    <div
      className="relative w-full aspect-[2/3] [perspective:1200px] cursor-pointer select-none"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isActive ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ---- Card Front (Mystical Cover) ---- */}
        <div className="absolute inset-0 w-full h-full bg-navy border-2 border-gold rounded-lg shadow-gold flex flex-col items-center justify-between p-4 [backface-visibility:hidden] overflow-hidden group-hover:shadow-[0_0_30px_hsl(var(--gold)/0.4)] transition-shadow">
          {/* inner ornate borders */}
          <div className="absolute inset-1.5 border border-gold/40 rounded-md pointer-events-none" />
          <div className="absolute inset-3 border border-gold/20 rounded-md pointer-events-none" />
          {/* ornate corners */}
          <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-gold rounded-tl-md" />
          <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-gold rounded-tr-md" />
          <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-gold rounded-bl-md" />
          <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-gold rounded-br-md" />

          {/* top row: ordinal */}
          <div className="w-full flex justify-between items-center text-gold text-[10px] uppercase tracking-[0.3em] pt-1" style={{ fontFamily: "Cinzel, serif" }}>
            <span>{ordinal}</span>
            <Sparkles className="w-3 h-3 text-gold/70" />
            <span>{ordinal}</span>
          </div>

          {/* center icon + title */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gold flex items-center justify-center bg-navy-light shadow-gold">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gold" strokeWidth={1} />
            </div>
            <h3
              className="text-gold text-sm sm:text-base font-bold uppercase tracking-[0.15em] leading-tight px-1"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {title}
            </h3>
          </div>

          {/* bottom hint */}
          <span
            className="text-gold/60 text-[10px] tracking-[0.2em] italic pb-1"
            style={{ fontFamily: "Lora, serif" }}
          >
            {t.tarotTapToReveal}
          </span>
        </div>

        {/* ---- Card Back (Drawn / Revealed state) ---- */}
        <div className="absolute inset-0 w-full h-full bg-navy-light border-2 border-gold rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-5 text-center overflow-hidden">
          <div className="absolute inset-1.5 border border-gold/30 rounded-md pointer-events-none" />
          <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-gold rounded-tl-md" />
          <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-gold rounded-tr-md" />
          <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-gold rounded-bl-md" />
          <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-gold rounded-br-md" />

          {/* decorative star */}
          <svg className="w-14 h-14 text-gold/30 mb-3" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5L61 38L95 38L67 58L78 92L50 72L22 92L33 58L5 38L39 38L50 5Z" />
          </svg>

          <h3
            className="text-gold text-sm sm:text-base font-bold uppercase tracking-[0.15em] leading-tight mb-3"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            {title}
          </h3>
          <p className="text-gold/70 text-[11px] italic leading-relaxed mb-4" style={{ fontFamily: "Lora, serif" }}>
            {t.tarotCardSpoken}
          </p>
          <span className="text-gold/50 text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: "Cinzel, serif" }}>
            {t.tarotTapToClose}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
