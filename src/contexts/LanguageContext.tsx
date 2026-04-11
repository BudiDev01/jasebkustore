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
  // Categories
  catFreelance: string;
  catJaseb: string;
  catWhatsapp: string;
  catTelegram: string;
  catSocial: string;
  catGworkspace: string;
  catPremium: string;
  catWebsite: string;
  catDomain: string;
  catHosting: string;
  catDesign: string;
  catEditing: string;
  catVideo: string;
  catCoding: string;
  catRekber: string;
  catOther: string;
  catFavorites: string;
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
  // TopUp
  topUp: string;
  topUpHistory: string;
  forgotPassword: string;
  // General
  loading: string;
  error: string;
  price: string;
  perItem: string;
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
    catFreelance: "Freelance",
    catJaseb: "Jaseb",
    catWhatsapp: "WhatsApp Numbers",
    catTelegram: "Telegram Numbers",
    catSocial: "Medsos",
    catGworkspace: "Google Workspace",
    catPremium: "Premium Apps",
    catWebsite: "Website Services",
    catDomain: "Domain",
    catHosting: "Hosting & VPS",
    catDesign: "Design",
    catEditing: "Editing Services",
    catVideo: "Video Creation",
    catCoding: "Coding Services",
    catRekber: "Rekber",
    catOther: "Other Services",
    catFavorites: "Favorites",
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
    paymentTitle: "Complete Payment",
    paymentSubtitle: "Scan the QRIS below to complete your purchase",
    paymentInstructions: "Payment Instructions",
    paymentStep1: "Open your GoPay / any QRIS-compatible app",
    paymentStep2: "Scan the QR code displayed below",
    paymentStep3: "Enter the exact amount shown",
    paymentStep4: "Complete payment and confirm below",
    confirmPayment: "I Have Paid",
    askFirst: "Ask First",
    paymentSuccess: "Payment Submitted!",
    paymentSuccessMsg: "Thank you! Your order has been received. We'll deliver your product within 1–24 hours via WhatsApp or email.",
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
    topUp: "Top Up",
    topUpHistory: "Top Up History",
    forgotPassword: "Forgot Password?",
    loading: "Loading...",
    error: "Something went wrong",
    price: "Price",
    perItem: "/ item",
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
    catFreelance: "Freelance",
    catJaseb: "Jaseb",
    catWhatsapp: "Nomor WhatsApp",
    catTelegram: "Nomor Telegram",
    catSocial: "Medsos",
    catGworkspace: "Google Workspace",
    catPremium: "Aplikasi Premium",
    catWebsite: "Jasa Website",
    catDomain: "Domain",
    catHosting: "Hosting & VPS",
    catDesign: "Desain",
    catEditing: "Jasa Editing",
    catVideo: "Pembuatan Video",
    catCoding: "Jasa Coding",
    catRekber: "Rekber",
    catOther: "Layanan Lainnya",
    catFavorites: "Favorit",
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
    paymentTitle: "Selesaikan Pembayaran",
    paymentSubtitle: "Scan QRIS di bawah ini untuk menyelesaikan pembelian Anda",
    paymentInstructions: "Cara Pembayaran",
    paymentStep1: "Buka aplikasi GoPay / aplikasi apapun yang mendukung QRIS",
    paymentStep2: "Scan kode QR yang ditampilkan di bawah",
    paymentStep3: "Masukkan nominal yang tertera",
    paymentStep4: "Selesaikan pembayaran dan konfirmasi di bawah",
    confirmPayment: "Saya Sudah Bayar",
    askFirst: "Tanya Dulu",
    paymentSuccess: "Pembayaran Terkirim!",
    paymentSuccessMsg: "Terima kasih! Pesanan Anda telah diterima. Produk akan dikirim dalam 1–24 jam melalui WhatsApp atau email.",
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
    topUp: "Top Up",
    topUpHistory: "Riwayat Top Up",
    forgotPassword: "Lupa Password?",
    loading: "Memuat...",
    error: "Terjadi kesalahan",
    price: "Harga",
    perItem: "/ item",
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
    return (localStorage.getItem("language") as Language) || "en";
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
