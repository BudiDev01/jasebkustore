import { Instagram, Facebook, Youtube } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/jaseb.ku?stkn=MXQycTNvdmdraW94dA==",
    Icon: Instagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@jasebku.aether",
    Icon: TikTokIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590357691618&mibextid=ZbWKwL",
    Icon: Facebook,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@jasebku?si=SrXSJQJ-_wypSf9g",
    Icon: Youtube,
  },
];

const SocialLinks = ({ size = "default" }: { size?: "default" | "large" }) => {
  const box = size === "large" ? "w-11 h-11" : "w-9 h-9";
  const icon = size === "large" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className={`${box} rounded-xl border border-gold/30 bg-card text-gold flex items-center justify-center shadow-card hover:bg-gold/10 hover:border-gold/60 hover:shadow-gold transition-all`}
        >
          <Icon className={icon} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
