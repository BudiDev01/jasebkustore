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
  link?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "wa-id",
    name: "WhatsApp Number Indonesia",
    name_id: "Nomor WhatsApp Indonesia",
    description: "Indonesian WhatsApp number.",
    description_id: "Nomor WhatsApp Indonesia.",
    price: 10000,
    category: "whatsapp",
    badge: "Popular",
    stock_status: "available",
    icon: "🇮🇩",
  },

  {
    id: "wa-international",
    name: "WhatsApp Number International",
    name_id: "Nomor WhatsApp Luar Negeri",
    description: "WhatsApp number from other countries. Contact admin for details.",
    description_id: "Nomor WhatsApp dari luar negeri. Hubungi admin untuk detail.",
    price: 0,
    price_hidden: true,
    category: "whatsapp",
    badge: "Contact Admin",
    stock_status: "available",
    icon: "🌍",
  },

  {
    id: "wa-strengthen",
    name: "WhatsApp Number Strengthening Service",
    name_id: "Jasa Perkuat Nomor",
    description: "Service to strengthen and protect your WhatsApp number. Contact admin for details.",
    description_id: "Layanan perkuat dan lindungi nomor WhatsApp Anda. Hubungi admin untuk detail.",
    price: 0,
    price_hidden: true,
    category: "whatsapp",
    badge: "Service",
    stock_status: "available",
    icon: "🛡️",
  },

  {
    id: "wa-unban",
    name: "WhatsApp Unban Service",
    name_id: "Jasa Unban WhatsApp",
    description: "Professional WhatsApp account unban service. We help recover banned or suspended WhatsApp numbers quickly and securely.",
    description_id: "Jasa unban akun WhatsApp profesional. Kami membantu memulihkan nomor WhatsApp yang dibanned atau ditangguhkan dengan cepat dan aman.",
    price: 0,
    price_hidden: true,
    category: "whatsapp",
    badge: "Service",
    stock_status: "available",
    icon: "🔓",
  },



  {
    id: "tg-id",
    name: "Telegram Number Indonesia",
    name_id: "Nomor Telegram Indonesia",
    description: "Indonesian Telegram number.",
    description_id: "Nomor Telegram Indonesia.",
    price: 0,
    price_hidden: true,
    category: "telegram",
    badge: "Popular",
    stock_status: "available",
    icon: "🇮🇩",
  },

  {
    id: "tg-international",
    name: "Telegram Number International Request",
    name_id: "Permintaan Nomor Telegram Internasional",
    description: "For Telegram numbers from other countries, please contact the admin.",
    description_id: "Untuk nomor Telegram dari negara lainnya, silakan hubungi admin.",
    price: 0,
    price_hidden: true,
    category: "telegram",
    badge: "Contact Admin",
    stock_status: "available",
    icon: "🌍",
  },

  {
    id: "web-001",
    name: "Website Creation Service",
    name_id: "Jasa Pembuatan Website",
    description: "Custom request as desired.",
    description_id: "Bisa request sesuai keinginan.",
    price: 0,
    price_hidden: true,
    category: "website",
    badge: "Custom",
    stock_status: "available",
    icon: "🌐",
  },

  {
    id: "bank-001",
    name: "Bank & E-Wallet Creation",
    name_id: "Pembuatan Bank & E-Wallet",
    description: "Bank & E-Wallet creation service at an affordable price, ready to use.",
    description_id: "Jasa pembuatan Bank & E-Wallet dengan harga murah dan siap digunakan.",
    price: 0,
    price_hidden: true,
    category: "bank",
    badge: "Banking",
    stock_status: "available",
    icon: "🏦",
  },


  {
    id: "design-001",
    name: "Design Services",
    name_id: "Jasa Desain",
    description: "Custom graphic design services for your needs. Logos, banners, posters, social media content, and more.",
    description_id: "Jasa desain grafis kustom sesuai kebutuhan Anda. Logo, banner, poster, konten media sosial, dan lainnya.",
    price: 0,
    price_hidden: true,
    category: "design",
    badge: "Design",
    stock_status: "available",
    icon: "🎨",
  },

  {
    id: "edit-request",
    name: "Editing Service",
    name_id: "Jasa Editing",
    description: "Custom request as desired.",
    description_id: "Bisa request sesuai keinginan.",
    price: 0,
    price_hidden: true,
    category: "editing",
    badge: "Custom",
    stock_status: "available",
    icon: "✂️",
  },

  {
    id: "jaseb-001",
    name: "Jaseb Service",
    name_id: "Jasa Jaseb",
    description: "Price 10,000/month, done every day, and promoted to many groups.",
    description_id: "Harga 10.000/bulan, dilakukan setiap hari, dan dipromosikan ke banyak grup.",
    price: 10000,
    category: "jaseb",
    badge: "Popular",
    stock_status: "available",
    icon: "📣",
  },

  {
    id: "userbot-001",
    name: "Telegram Userbot",
    name_id: "Userbot Telegram",
    description: "Telegram userbot service. Price 10,000/month.",
    description_id: "Layanan userbot Telegram. Harga 10.000/bulan.",
    price: 10000,
    category: "userbot",
    badge: "Bot",
    stock_status: "available",
    icon: "🤖",
  },
];
