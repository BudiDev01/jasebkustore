import React, { useState, useCallback } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { speak } from "@/lib/speak";

const SOUNDS = [
  { id: 1, label: "Selamat Datang!", text: "Selamat datang di JasebKu Store", emoji: "👋", color: "from-yellow-500 to-amber-600" },
  { id: 2, label: "Beli Sekarang!", text: "Beli sekarang, harga terbaik!", emoji: "🛒", color: "from-green-500 to-emerald-600" },
  { id: 3, label: "Promo Spesial!", text: "Promo spesial hari ini!", emoji: "🔥", color: "from-red-500 to-rose-600" },
  { id: 4, label: "Terima Kasih!", text: "Terima kasih sudah berkunjung!", emoji: "🙏", color: "from-blue-500 to-indigo-600" },
  { id: 5, label: "Gas Langsung!", text: "Gas langsung order sekarang!", emoji: "🚀", color: "from-purple-500 to-violet-600" },
];

const SoundBoard = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const speakText = useCallback((text: string) => {
    if (!soundEnabled) return;
    speak(text, "id-ID");
  }, [soundEnabled]);

  const handleClick = (sound: typeof SOUNDS[0]) => {
    setActiveId(sound.id);
    setAnimating(true);
    speakText(sound.text);
    setTimeout(() => {
      setActiveId(null);
      setAnimating(false);
    }, 600);
  };

  const handleLogoClick = () => {
    setAnimating(true);
    speakText("JasebKu Store, toko digital paling lengkap!");
    setTimeout(() => setAnimating(false), 800);
  };

  return (
    <section className="py-16 bg-card/50 border-y border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> Sound Board
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
            🎵 JasebKu Sound Board
          </h2>
          <p className="text-muted-foreground text-sm">Klik tombol untuk mendengar suara interaktif!</p>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <VolumeX className={`w-4 h-4 ${!soundEnabled ? "text-gold" : "text-muted-foreground"}`} />
          <Switch
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
            className="data-[state=checked]:bg-gold"
          />
          <Volume2 className={`w-4 h-4 ${soundEnabled ? "text-gold" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium text-muted-foreground ml-1">
            {soundEnabled ? "Sound ON" : "Sound OFF"}
          </span>
        </div>

        {/* Animated Logo */}
        <div className="flex justify-center mb-10">
          <button
            onClick={handleLogoClick}
            className={`relative group cursor-pointer transition-all duration-300 ${animating && activeId === null ? "scale-110" : "hover:scale-105"}`}
          >
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl gradient-gold flex items-center justify-center shadow-gold transition-all duration-300 ${animating && activeId === null ? "animate-bounce ring-4 ring-gold/40" : "group-hover:shadow-lg"}`}>
              <span className="text-3xl sm:text-4xl font-black text-primary-foreground tracking-tight">JK</span>
            </div>
            {animating && activeId === null && (
              <>
                <div className="absolute -inset-3 rounded-3xl border-2 border-gold/30 animate-ping" />
                <div className="absolute -inset-6 rounded-3xl border border-gold/15 animate-ping" style={{ animationDelay: "0.2s" }} />
              </>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">Klik logo!</p>
          </button>
        </div>

        {/* Sound Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SOUNDS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => handleClick(sound)}
              className={`relative group p-4 rounded-xl border transition-all duration-300 text-center ${
                activeId === sound.id
                  ? "scale-95 border-gold/60 bg-gold/10 shadow-gold"
                  : "border-border bg-card hover:border-gold/30 hover:bg-gold/5 hover:scale-[1.03]"
              }`}
            >
              <div className={`text-3xl mb-2 transition-transform duration-300 ${activeId === sound.id ? "animate-bounce scale-125" : "group-hover:scale-110"}`}>
                {sound.emoji}
              </div>
              <p className="text-xs font-semibold text-foreground leading-tight">{sound.label}</p>
              {activeId === sound.id && (
                <div className="absolute inset-0 rounded-xl border-2 border-gold/40 animate-ping pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Status */}
        {!soundEnabled && (
          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <VolumeX className="w-3 h-3" /> Suara dimatikan. Nyalakan untuk mendengar efek suara.
          </p>
        )}
      </div>
    </section>
  );
};

export default SoundBoard;
