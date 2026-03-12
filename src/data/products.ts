export interface Product {
  id: string;
  name: string;
  name_id: string;
  description: string;
  description_id: string;
  price: number;
  price_hidden?: boolean;
  category: string;
  badge?: string;
  stock_status: "available" | "out_of_stock";
  icon: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "wa-001",
    name: "WhatsApp Number",
    name_id: "Nomor WhatsApp",
    description: "Get a dedicated WhatsApp number for your needs.",
    description_id: "Dapatkan nomor WhatsApp khusus sesuai kebutuhan Anda.",
    price: 10000,
    category: "whatsapp",
    badge: "Popular",
    stock_status: "available",
    icon: "📱",
  },
  {
    id: "tg-001",
    name: "Telegram Number",
    name_id: "Nomor Telegram",
    description: "Virtual number for Telegram account creation and verification.",
    description_id: "Nomor virtual untuk membuat dan verifikasi akun Telegram.",
    price: 10000,
    category: "telegram",
    badge: "Hot",
    stock_status: "available",
    icon: "✈️",
  },
  {
    id: "gws-001",
    name: "Google Workspace (G Suite)",
    name_id: "Google Workspace (G Suite)",
    description: "Official Google Workspace account for your business or team.",
    description_id: "Akun Google Workspace resmi untuk bisnis atau tim Anda.",
    price: 150,
    category: "gworkspace",
    badge: "Official",
    stock_status: "available",
    icon: "🏢",
  },
  {
    id: "smb-001",
    name: "Social Media Boosting Service",
    name_id: "Layanan Boosting Media Sosial",
    description: "Boost your followers, likes, and views across all major social platforms.",
    description_id: "Tingkatkan followers, likes, dan views di semua platform media sosial.",
    price: 20000,
    category: "social",
    badge: "Best Seller",
    stock_status: "available",
    icon: "📈",
  },
  {
    id: "prem-001",
    name: "Premium Applications",
    name_id: "Aplikasi Premium",
    description: "Access to premium app accounts at an affordable price.",
    description_id: "Akses akun aplikasi premium dengan harga terjangkau.",
    price: 5000,
    category: "premium",
    stock_status: "available",
    icon: "⭐",
  },
  {
    id: "ubot-001",
    name: "Userbot Rental",
    name_id: "Sewa Userbot",
    description: "Rent a fully configured userbot for automation needs. Per month.",
    description_id: "Sewa userbot siap pakai untuk kebutuhan otomasi. Per bulan.",
    price: 15000,
    category: "other",
    stock_status: "available",
    icon: "🤖",
  },
  {
    id: "web-001",
    name: "Website Creation Service",
    name_id: "Jasa Pembuatan Website",
    description: "Professional website creation tailored to your business needs. Contact us for pricing.",
    description_id: "Pembuatan website profesional sesuai kebutuhan bisnis Anda. Hubungi kami untuk harga.",
    price: 0,
    price_hidden: true,
    category: "other",
    badge: "Custom",
    stock_status: "available",
    icon: "🌐",
  },
];
