import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "6281570887690";
const DEFAULT_MESSAGE = encodeURIComponent(
  "Hello Admin, I need help with your digital products."
);

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-navy hover:scale-110 transition-transform duration-200 glow-gold"
      style={{ background: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </button>
  );
};

export default WhatsAppButton;
