import React, { useState, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  drama: string;
  src: string;
}

const TRACKS: Track[] = [
  {
    title: "A Love to Kill",
    artist: "Lee Soo Young",
    drama: "A Love to Kill OST",
    src: "/audio/a-love-to-kill.mp3",
  },
  {
    title: "Haengbokhagil Barae",
    artist: "Lim Hyung Joo",
    drama: "Sassy Girl Chun Hyang OST",
    src: "/audio/haengbokhagil-barae.mp3",
  },
  {
    title: "Why (Destiny)",
    artist: "Rain (비)",
    drama: "Full House OST",
    src: "/audio/why-destiny.mp3",
  },
  {
    title: "This Love",
    artist: "Davichi",
    drama: "Descendants of the Sun OST",
    src: "/audio/this-love-davichi.mp3",
  },
  {
    title: "Say Yes",
    artist: "Loco & Punch",
    drama: "Moon Lovers: Scarlet Heart Ryeo OST",
    src: "/audio/say-yes-loco-punch.mp3",
  },
];

const MusicPlayer = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const handlePlay = (idx: number) => {
    // Pause all others
    audioRefs.current.forEach((el, i) => {
      if (el && i !== idx) {
        el.pause();
        el.currentTime = 0;
      }
    });

    const audio = audioRefs.current[idx];
    if (!audio) return;

    if (activeIdx === idx) {
      audio.pause();
      setActiveIdx(null);
    } else {
      audio.play();
      setActiveIdx(idx);
    }
  };

  const handleEnded = () => setActiveIdx(null);

  return (
    <section className="py-16 bg-card/50 border-t border-border/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3">
            <Music className="w-3 h-3" /> K-Drama OST Collection
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">🎵 Music Corner</h2>
          <p className="text-muted-foreground text-sm mt-2">Listen to our favorite K-Drama soundtracks</p>
        </div>

        <div className="space-y-3">
          {TRACKS.map((track, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                activeIdx === idx
                  ? "border-gold/50 bg-gold/5 shadow-gold"
                  : "border-border bg-card hover:border-gold/30"
              }`}
            >
              <button
                onClick={() => handlePlay(idx)}
                className="flex-shrink-0 w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-primary-foreground shadow-gold hover:opacity-90 transition-opacity"
              >
                {activeIdx === idx ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist} — <span className="text-gold/70">{track.drama}</span>
                </p>
              </div>

              <audio
                ref={(el) => { audioRefs.current[idx] = el; }}
                src={track.src}
                onEnded={handleEnded}
                preload="none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicPlayer;
