import React from "react";
import { Film } from "lucide-react";
import videoAsset from "@/assets/video-corner.mp4.asset.json";

const VideoSection = () => {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3">
            <Film className="w-3 h-3" /> Featured Video
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">🎬 Video Corner</h2>
          
        </div>

        <div className="rounded-xl overflow-hidden border border-border bg-card shadow-card">
          <video
            controls
            preload="metadata"
            className="w-full aspect-video bg-black"
            poster=""
          >
            <source src={videoAsset.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
