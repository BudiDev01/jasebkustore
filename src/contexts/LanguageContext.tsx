import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "id";

interface Translations {
  // Navbar
  home: string;
  products: string;
  dashboard: string;
  login: string;
  register: string;
  logout: string;
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroStats1: string;
  heroStats2: string;
  heroStats3: string;
  // Products
  ourProducts: string;
  ourProductsSubtitle: string;
  resellerNote: string;
  buyNow: string;
  available: string;
  outOfStock: string;
  searchPlaceholder: string;
  searchNoResults: string;
  scrollToViewProducts: string;
  tarotTapToReveal: string;
  tarotCardSpoken: string;
  tarotTapToClose: string;
  close: string;
  // Categories
  catFreelance: string;
  catJaseb: string;
  catUserbot: string;
  catWhatsapp: string;
  catTelegram: string;
  catSocial: string;
  catGworkspace: string;
  catPremium: string;
    catWebsite: string;
    catDomain: string;
    catHosting: string;
    catCpanel: string;
    catAdminPanel: string;
    catVps: string;
    catDesign: string;
    catEditing: string;
    catPanelbot: string;
    catVideo: string;
    catCoding: string;
    catRekber: string;
    catBanking: string;
    catSuntik: string;
    catLegalitas: string;
    catGaming: string;
    catOther: string;
    catFavorites: string;
    catBotWa: string;
    catHacking: string;
    catRecovery: string;
  // Auth
  emailLabel: string;
  passwordLabel: string;
  usernameLabel: string;
  loginTitle: string;
  registerTitle: string;
  loginSubtitle: string;
  registerSubtitle: string;
  loginButton: string;
  registerButton: string;
  orWith: string;
  continueGoogle: string;
  alreadyAccount: string;
  noAccount: string;
  // Payment
  paymentTitle: string;
  paymentSubtitle: string;
  paymentInstructions: string;
  paymentStep1: string;
  paymentStep2: string;
  paymentStep3: string;
  paymentStep4: string;
  confirmPayment: string;
  askFirst: string;
  paymentSuccess: string;
  paymentSuccessMsg: string;
  backHome: string;
  totalPayment: string;
  uploadProof: string;
  // Dashboard
  dashboardTitle: string;
  profileTab: string;
  ordersTab: string;
  noOrders: string;
  orderDate: string;
  orderStatus: string;
  orderAmount: string;
  pending: string;
  confirmed: string;
  completed: string;
  // Footer
  footerTagline: string;
  footerContact: string;
  footerLinks: string;
  footerRights: string;
  forgotPassword: string;
  // General
  loading: string;
  error: string;
  price: string;
  perItem: string;
  // Website Links Board
  websiteLinksTitle: string;
  websiteLinksSubtitle: string;
}

const translations: Record<Language, Translations> = {
  en: {
    home: "Home",
    products: "Products",
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    logout: "Logout",
    heroTitle: "JasebKu Store",
    heroSubtitle: "Premium digital products & services — instant delivery, unbeatable prices.",
    heroCta: "Explore Products",
    heroStats1: "Products",
    heroStats2: "Happy Customers",
    heroStats3: "Support",
    ourProducts: "Our Products",
    ourProductsSubtitle: "Handpicked digital services to supercharge your online presence",
    resellerNote: "Resellers get lower prices",
    buyNow: "Buy Now",
    available: "Available",
    outOfStock: "Out of Stock",
    searchPlaceholder: "Search products...",
    searchNoResults: "No products found. Try a different keyword.",
    scrollToViewProducts: "To view the contents of this product, please scroll to the bottom of this website to view the product description.",
    tarotTapToReveal: "Tap to Reveal",
    tarotCardSpoken: "The cards have spoken. Your offerings await below.",
    tarotTapToClose: "Tap to close",
    close: "Close",
    catFreelance: "Freelance",
    catJaseb: "Jaseb",
    catUserbot: "Userbot",
    catWhatsapp: "WhatsApp Numbers",
    catTelegram: "Telegram Numbers",
    catSocial: "Medsos",
    catGworkspace: "Google Workspace",
    catPremium: "Premium Apps",
    catWebsite: "Website Services",
    catDomain: "Domain",
    catHosting: "Hosting",
    catCpanel: "cPanel",
    catAdminPanel: "Admin Panel",
    catVps: "VPS",
    catDesign: "Design",
    catEditing: "Editing Services",
    catPanelbot: "Bot Panel",
    catVideo: "Video Creation",
    catCoding: "Coding Services",
    catRekber: "Rekber",
    catBanking: "Bank & E-Wallet",
    catSuntik: "Injection Services",
    catLegalitas: "Legality Services",
    catGaming: "Game Boosting",
    catOther: "Other Services",
    catFavorites: "Favorites",
    catBotWa: "WhatsApp Bot",
    catHacking: "Hacking Services",
    catRecovery: "Account Recovery",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    usernameLabel: "Username",
    loginTitle: "Welcome Back",
    registerTitle: "Create Account",
    loginSubtitle: "Sign in to your account to continue",
    registerSubtitle: "Join thousands of satisfied customers",
    loginButton: "Sign In",
    registerButton: "Create Account",
    orWith: "or continue with",
    continueGoogle: "Continue with Google",
    alreadyAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    paymentTitle: "Contact Admin",
    paymentSubtitle: "Chat the admin on Telegram to complete your order",
    paymentInstructions: "How It Works",
    paymentStep1: "Click the Telegram button below",
    paymentStep2: "Send the product name and price to the admin",
    paymentStep3: "Follow the admin's payment instructions",
    paymentStep4: "Receive your product within 1–24 hours",
    confirmPayment: "I Have Paid",
    askFirst: "Ask First",
    paymentSuccess: "Payment Submitted!",
    paymentSuccessMsg: "Thank you! Your order has been received. We'll deliver your product within 1–24 hours via Telegram or email.",
    backHome: "Back to Home",
    totalPayment: "Total Payment",
    uploadProof: "Upload Payment Proof (Optional)",
    dashboardTitle: "My Dashboard",
    profileTab: "Profile",
    ordersTab: "Order History",
    noOrders: "No orders yet. Start shopping!",
    orderDate: "Date",
    orderStatus: "Status",
    orderAmount: "Amount",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    footerTagline: "Your trusted partner for premium digital products and services.",
    footerContact: "Contact Us",
    footerLinks: "Quick Links",
    footerRights: "All rights reserved.",
    forgotPassword: "Forgot Password?",
    loading: "Loading...",
    error: "Something went wrong",
    price: "Price",
    perItem: "/ item",
    websiteLinksTitle: "Our Websites",
    websiteLinksSubtitle: "Explore our digital platforms",
  },
  id: {
    home: "Beranda",
    products: "Produk",
    dashboard: "Dashboard",
    login: "Masuk",
    register: "Daftar",
    logout: "Keluar",
    heroTitle: "JasebKu Store",
    heroSubtitle: "Produk & layanan digital premium — pengiriman instan, harga terbaik.",
    heroCta: "Lihat Produk",
    heroStats1: "Produk",
    heroStats2: "Pelanggan Puas",
    heroStats3: "Dukungan",
    ourProducts: "Produk Kami",
    ourProductsSubtitle: "Layanan digital pilihan untuk meningkatkan kehadiran online Anda",
    resellerNote: "Reseller mendapat harga lebih murah",
    buyNow: "Beli Sekarang",
    available: "Tersedia",
    outOfStock: "Habis",
    searchPlaceholder: "Cari produk...",
    searchNoResults: "Produk tidak ditemukan. Coba kata kunci lain.",
    scrollToViewProducts: "Untuk melihat isi produk ini, silakan scroll ke bagian paling bawah website ini untuk melihat deskripsi produk.",
    tarotTapToReveal: "Ketuk untuk Buka",
    tarotCardSpoken: "Kartu telah terbuka. Lihat rincian produk di bawah.",
    tarotTapToClose: "Ketuk untuk Tutup",
    close: "Tutup",
    catFreelance: "Freelance",
    catJaseb: "Jaseb",
    catUserbot: "Userbot",
    catWhatsapp: "Nomor WhatsApp",
    catTelegram: "Nomor Telegram",
    catSocial: "Medsos",
    catGworkspace: "Google Workspace",
    catPremium: "Aplikasi Premium",
    catWebsite: "Jasa Website",
    catDomain: "Domain",
    catHosting: "Hosting",
    catCpanel: "cPanel",
    catAdminPanel: "Admin Panel",
    catVps: "VPS",
    catDesign: "Desain",
    catEditing: "Jasa Editing",
    catPanelbot: "Panel Bot",
    catVideo: "Pembuatan Video",
    catCoding: "Jasa Coding",
    catRekber: "Rekber",
    catBanking: "Bank & E-Wallet",
    catSuntik: "Jasa Suntik",
    catLegalitas: "Jasa Legalitas",
    catGaming: "Jasa Joki Game",
    catOther: "Layanan Lainnya",
    catFavorites: "Favorit",
    catBotWa: "Bot WhatsApp",
    catHacking: "Jasa Hack",
    catRecovery: "Pemulihan Akun",
    emailLabel: "Alamat Email",
    passwordLabel: "Kata Sandi",
    usernameLabel: "Nama Pengguna",
    loginTitle: "Selamat Datang",
    registerTitle: "Buat Akun",
    loginSubtitle: "Masuk ke akun Anda untuk melanjutkan",
    registerSubtitle: "Bergabung dengan ribuan pelanggan puas",
    loginButton: "Masuk",
    registerButton: "Buat Akun",
    orWith: "atau lanjutkan dengan",
    continueGoogle: "Lanjutkan dengan Google",
    alreadyAccount: "Sudah punya akun?",
    noAccount: "Belum punya akun?",
    paymentTitle: "Hubungi Admin",
    paymentSubtitle: "Chat admin via Telegram untuk menyelesaikan pesanan Anda",
    paymentInstructions: "Cara Pemesanan",
    paymentStep1: "Klik tombol Telegram di bawah",
    paymentStep2: "Kirim nama produk dan harga ke admin",
    paymentStep3: "Ikuti instruksi pembayaran dari admin",
    paymentStep4: "Terima produk dalam 1–24 jam",
    confirmPayment: "Saya Sudah Bayar",
    askFirst: "Tanya Dulu",
    paymentSuccess: "Pembayaran Terkirim!",
    paymentSuccessMsg: "Terima kasih! Pesanan Anda telah diterima. Produk akan dikirim dalam 1–24 jam melalui Telegram atau email.",
    backHome: "Kembali ke Beranda",
    totalPayment: "Total Pembayaran",
    uploadProof: "Upload Bukti Pembayaran (Opsional)",
    dashboardTitle: "Dashboard Saya",
    profileTab: "Profil",
    ordersTab: "Riwayat Pesanan",
    noOrders: "Belum ada pesanan. Mulai belanja sekarang!",
    orderDate: "Tanggal",
    orderStatus: "Status",
    orderAmount: "Jumlah",
    pending: "Menunggu",
    confirmed: "Dikonfirmasi",
    completed: "Selesai",
    footerTagline: "Mitra terpercaya Anda untuk produk dan layanan digital premium.",
    footerContact: "Hubungi Kami",
    footerLinks: "Tautan Cepat",
    footerRights: "Semua hak dilindungi.",
    forgotPassword: "Lupa Password?",
    loading: "Memuat...",
    error: "Terjadi kesalahan",
    price: "Harga",
    perItem: "/ item",
    websiteLinksTitle: "Website Kami",
    websiteLinksSubtitle: "Jelajahi platform digital kami",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "id";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
