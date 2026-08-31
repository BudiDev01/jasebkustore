import { useEffect, useState } from "react";

// Admin WhatsApp contacts (local → international format)
const ADMINS = [
  { id: "wa1", label: "Admin WhatsApp 1", number: "6281973125165" },
  { id: "wa2", label: "Admin WhatsApp 2", number: "6285545098952" },
];
const DEFAULT_MESSAGE = "Halo JasebKu, saya ingin bertanya tentang produk yang dijual.";

const WhatsAppIcon = ({ className = "w-7 h-7 shrink-0" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.73 6.4L3.2 28.8l6.56-1.72a12.76 12.76 0 0 0 6.24 1.64h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.72 12.72 0 0 0 16.003 3.2zm0 23.04h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.39a10.58 10.58 0 0 1-1.62-5.65c0-5.87 4.78-10.65 10.65-10.65 2.85 0 5.52 1.11 7.53 3.12a10.58 10.58 0 0 1 3.12 7.54c0 5.87-4.78 10.65-10.65 10.65zm5.85-7.98c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.86-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56l-.62-.01c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.15 3.08 1.31 3.3.16.21 2.25 3.43 5.45 4.81.76.33 1.36.52 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z" />
  </svg>
);

const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const buildHref = (number: string) =>
    `https://wa.me/${number}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Admin options menu */}
      {open && (
        <div className="flex flex-col gap-3 items-end animate-fade-in">
          {ADMINS.map((admin) => (
            <a
              key={admin.id}
              href={buildHref(admin.number)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              aria-label={admin.label}
              className="flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-600/60"
              style={{ padding: "0.65rem 0.85rem" }}
            >
              <WhatsAppIcon className="w-6 h-6 shrink-0" />
              <span className="text-sm font-semibold pr-1 whitespace-nowrap">
                {admin.label}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Main toggle button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Tutup daftar Admin WhatsApp" : "Buka daftar Admin WhatsApp"}
        aria-expanded={open}
        className={`relative flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-600/60 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ padding: "0.65rem 0.85rem" }}
      >
        <WhatsAppIcon />
        <span className="text-sm font-semibold pr-1 hidden sm:inline">WhatsApp Admin</span>
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/30 -z-10" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
