import React from "react";
import whatsappIcon from "@/assets/whatsapp.svg";

const WHATSAPP_NUMBER = "628157088769";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-navy"
      aria-label="Chat on WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-14 h-14" />
    </button>
  );
};

export default WhatsAppButton;
