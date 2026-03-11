export interface Product {
  id: string;
  name: string;
  name_id: string;
  description: string;
  description_id: string;
  price: number;
  category: string;
  badge?: string;
  stock_status: "available" | "out_of_stock";
  icon: string;
}

export const PRODUCTS: Product[] = [
  // WhatsApp Virtual Numbers
  {
    id: "wa-001",
    name: "WhatsApp Virtual Number – 1 Month",
    name_id: "Nomor Virtual WhatsApp – 1 Bulan",
    description: "Dedicated virtual number for WhatsApp registration. Works with all major countries.",
    description_id: "Nomor virtual khusus untuk registrasi WhatsApp. Tersedia untuk semua negara besar.",
    price: 25000,
    category: "whatsapp",
    badge: "Popular",
    stock_status: "available",
    icon: "📱",
  },
  {
    id: "wa-002",
    name: "WhatsApp Virtual Number – 3 Months",
    name_id: "Nomor Virtual WhatsApp – 3 Bulan",
    description: "Extended 3-month virtual number for WhatsApp. Guaranteed stability.",
    description_id: "Nomor virtual WhatsApp 3 bulan. Stabilitas terjamin.",
    price: 65000,
    category: "whatsapp",
    stock_status: "available",
    icon: "📱",
  },
  // Telegram Virtual Numbers
  {
    id: "tg-001",
    name: "Telegram Virtual Number – 1 Month",
    name_id: "Nomor Virtual Telegram – 1 Bulan",
    description: "Virtual number for Telegram account creation and verification.",
    description_id: "Nomor virtual untuk membuat dan verifikasi akun Telegram.",
    price: 20000,
    category: "telegram",
    badge: "Hot",
    stock_status: "available",
    icon: "✈️",
  },
  {
    id: "tg-002",
    name: "Telegram Virtual Number – 6 Months",
    name_id: "Nomor Virtual Telegram – 6 Bulan",
    description: "Long-term Telegram virtual number. Best value for frequent users.",
    description_id: "Nomor virtual Telegram jangka panjang. Terbaik untuk pengguna aktif.",
    price: 100000,
    category: "telegram",
    stock_status: "available",
    icon: "✈️",
  },
  // Social Media Boosting
  {
    id: "smb-001",
    name: "Instagram Followers – 1,000",
    name_id: "Followers Instagram – 1.000",
    description: "1,000 real-looking Instagram followers. Gradual delivery over 24-48 hours.",
    description_id: "1.000 followers Instagram tampak nyata. Pengiriman bertahap 24-48 jam.",
    price: 35000,
    category: "social",
    badge: "Best Seller",
    stock_status: "available",
    icon: "📈",
  },
  {
    id: "smb-002",
    name: "TikTok Views – 10,000",
    name_id: "Views TikTok – 10.000",
    description: "Boost your TikTok videos with 10,000 views instantly.",
    description_id: "Tingkatkan video TikTok Anda dengan 10.000 penayangan instan.",
    price: 15000,
    category: "social",
    stock_status: "available",
    icon: "🎵",
  },
  {
    id: "smb-003",
    name: "YouTube Subscribers – 500",
    name_id: "Subscriber YouTube – 500",
    description: "500 YouTube subscribers to grow your channel quickly.",
    description_id: "500 subscriber YouTube untuk mengembangkan channel Anda.",
    price: 50000,
    category: "social",
    stock_status: "available",
    icon: "▶️",
  },
  // Google Workspace
  {
    id: "gws-001",
    name: "Google Workspace Business Starter",
    name_id: "Google Workspace Business Starter",
    description: "Official Google Workspace Business Starter account. 30GB storage per user.",
    description_id: "Akun Google Workspace Business Starter resmi. Penyimpanan 30GB per pengguna.",
    price: 150000,
    category: "gworkspace",
    badge: "Official",
    stock_status: "available",
    icon: "🏢",
  },
  {
    id: "gws-002",
    name: "Google Workspace Business Plus",
    name_id: "Google Workspace Business Plus",
    description: "Google Workspace Business Plus with 5TB storage, eDiscovery, and audit.",
    description_id: "Google Workspace Business Plus dengan 5TB penyimpanan, eDiscovery, dan audit.",
    price: 350000,
    category: "gworkspace",
    stock_status: "available",
    icon: "🏢",
  },
  // Premium Apps
  {
    id: "prem-001",
    name: "Netflix Premium – 1 Month",
    name_id: "Netflix Premium – 1 Bulan",
    description: "Shared Netflix Premium account with 4K UHD access. 1-month guarantee.",
    description_id: "Akun Netflix Premium bersama dengan akses 4K UHD. Garansi 1 bulan.",
    price: 45000,
    category: "premium",
    badge: "Popular",
    stock_status: "available",
    icon: "🎬",
  },
  {
    id: "prem-002",
    name: "Spotify Premium – 3 Months",
    name_id: "Spotify Premium – 3 Bulan",
    description: "Individual Spotify Premium account. Ad-free music streaming for 3 months.",
    description_id: "Akun Spotify Premium individual. Streaming musik tanpa iklan selama 3 bulan.",
    price: 55000,
    category: "premium",
    stock_status: "available",
    icon: "🎵",
  },
  // Other Services
  {
    id: "other-001",
    name: "VPN Premium – 1 Month",
    name_id: "VPN Premium – 1 Bulan",
    description: "High-speed premium VPN with unlimited bandwidth. 50+ server locations.",
    description_id: "VPN premium berkecepatan tinggi dengan bandwidth unlimited. 50+ lokasi server.",
    price: 30000,
    category: "other",
    stock_status: "available",
    icon: "🔒",
  },
];
