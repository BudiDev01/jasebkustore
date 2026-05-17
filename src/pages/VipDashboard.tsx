import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Crown, Users, LogOut, ArrowLeft, Loader2, Search, Trash2, Eye, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import UserSearch from "@/components/vip/UserSearch";
import AdminChat from "@/components/vip/AdminChat";

type Lang = "en" | "id";

const labels: Record<Lang, Record<string, string>> = {
  en: {
    vipDashboard: "VIP Dashboard",
    store: "Store",
    logout: "Logout",
    analytics: "Analytics",
    topUp: "Top Up",
    totalUsers: "Total Users",
    manageTopUp: "Manage Top Ups",
    manageTopUpDesc: "Approve or reject top up requests from users",
    refresh: "Refresh",
    refreshAll: "Refresh All",
    noTopUps: "No top up requests yet.",
    approve: "Approve",
    reject: "Reject",
    updated: "Updated!",
    approved: "Top up approved.",
    rejected: "Top up rejected.",
    accessDenied: "Access Denied",
    loading: "Loading...",
    error: "Error",
    user: "User",
    success: "Success",
    cancelled: "Rejected",
    waiting: "Waiting",
    searchUsers: "Search Users",
    chat: "Chat",
    searchUsersDesc: "Search users by email address",
  },
  id: {
    vipDashboard: "Dashboard VIP",
    store: "Toko",
    logout: "Keluar",
    analytics: "Analitik",
    topUp: "Top Up",
    totalUsers: "Total Pengguna",
    manageTopUp: "Kelola Top Up",
    manageTopUpDesc: "Approve atau reject permintaan top up dari user",
    refresh: "Segarkan",
    refreshAll: "Segarkan Semua",
    noTopUps: "Belum ada permintaan top up.",
    approve: "Setujui",
    reject: "Tolak",
    updated: "Diperbarui!",
    approved: "Top up disetujui.",
    rejected: "Top up ditolak.",
    accessDenied: "Akses Ditolak",
    loading: "Memuat...",
    error: "Error",
    user: "Pengguna",
    success: "Berhasil",
    cancelled: "Ditolak",
    waiting: "Menunggu",
    searchUsers: "Cari Pengguna",
    chat: "Chat",
    searchUsersDesc: "Cari pengguna berdasarkan alamat email",
  },
};
const VipDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [totalUsers, setTotalUsers] = useState(0);
  const [allUsers, setAllUsers] = useState<{ user_id: string; email: string; created_at: string }[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [userEmailMap, setUserEmailMap] = useState<Record<string, string>>({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("vip-lang") as Lang) || "en");

  const t = labels[lang];

  const switchLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("vip-lang", l);
  };

  useEffect(() => {
    if (!user) { navigate("/vip"); return; }
    checkAdminAndLoad();
  }, [user]);

  const checkAdminAndLoad = async () => {
    if (!user) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles || roles.length === 0) {
      toast({ title: t.accessDenied, variant: "destructive" });
      navigate("/vip");
      return;
    }
    setIsAdmin(true);
    await loadAll();
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadUsers(), loadUserEmails()]);
    setLoading(false);
  };

  const loadUsers = async () => {
    const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true });
    setTotalUsers(count ?? 0);
  };

  const loadUserEmails = async () => {
    const { data } = await supabase.rpc("admin_search_users", { search_term: "" });
    if (data) {
      const map: Record<string, string> = {};
      (data as { user_id: string; email: string }[]).forEach((u) => { map[u.user_id] = u.email; });
      setUserEmailMap(map);
    }
  };

  const handleDeleteUser = async (targetUserId: string, email: string) => {
    if (!confirm(`Hapus user ${email}? Data user akan dihapus permanen.`)) return;
    setDeletingId(targetUserId);
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { target_user_id: targetUserId },
    });
    setDeletingId(null);
    if (error || data?.error) {
      toast({ title: t.error, description: error?.message || data?.error, variant: "destructive" });
    } else {
      toast({ title: t.updated, description: `User ${email} berhasil dihapus.` });
      setAllUsers((prev) => prev.filter((u) => u.user_id !== targetUserId));
      setTotalUsers((prev) => prev - 1);
    }
  };

  const handleLogout = async () => { await signOut(); navigate("/vip"); };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white">
              <span className="text-gold">VIP</span> Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
              <button
                onClick={() => switchLang("id")}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === "id" ? "bg-gold text-primary-foreground" : "text-white/50 hover:text-white"}`}
              >
                ID
              </button>
              <button
                onClick={() => switchLang("en")}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === "en" ? "bg-gold text-primary-foreground" : "text-white/50 hover:text-white"}`}
              >
                EN
              </button>
            </div>
            <Link to="/dashboard" className="text-white/50 hover:text-white text-sm flex items-center gap-1">
              <Users className="w-3 h-3" /> {lang === "id" ? "Dashboard User" : "User Dashboard"}
            </Link>
            <Link to="/" className="text-white/50 hover:text-white text-sm flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> {t.store}
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/50 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-1" /> {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-white/50 text-center py-20">{t.loading}</div>
        ) : (
          <Tabs defaultValue="chat">
            <TabsList className="mb-6 bg-white/5 border border-white/10">
              <TabsTrigger value="chat" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground text-white/60">
                <MessageCircle className="w-4 h-4 mr-1" /> {t.chat}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground text-white/60">
                <Users className="w-4 h-4 mr-1" /> {t.analytics}
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground text-white/60">
                <Search className="w-4 h-4 mr-1" /> {t.searchUsers}
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card
                className="bg-white/5 border-white/10 backdrop-blur-sm max-w-sm cursor-pointer hover:border-gold/40 transition-colors"
                onClick={async () => {
                  if (showAllUsers) { setShowAllUsers(false); return; }
                  setLoadingUsers(true);
                  const { data } = await supabase.rpc("admin_search_users", { search_term: "" });
                  setAllUsers((data as { user_id: string; email: string; created_at: string }[]) ?? []);
                  setShowAllUsers(true);
                  setLoadingUsers(false);
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold" />
                    {t.totalUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-gold">{totalUsers.toLocaleString()}</div>
                  <p className="text-white/40 text-xs mt-1">{loadingUsers ? t.loading : (showAllUsers ? "▲ Tutup daftar" : "▼ Klik untuk lihat semua")}</p>
                </CardContent>
              </Card>

              {showAllUsers && allUsers.length > 0 && (
                <div className="space-y-2">
                  {allUsers.map((u) => (
                    <Card key={u.user_id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-gold font-medium text-sm">{u.email}</p>
                          <p className="text-white/50 text-xs">
                            {t.totalUsers}: {formatDate(u.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-white/30 text-xs font-mono">{u.user_id.slice(0, 8)}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); navigate(`/vip/user/${u.user_id}`); }}
                            className="border-gold/30 text-gold hover:bg-gold/10 gap-1 h-7 px-2"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.user_id, u.email); }}
                            disabled={deletingId === u.user_id}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1 h-7 px-2"
                          >
                            {deletingId === u.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* User Search Tab */}
            <TabsContent value="search">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-white mb-1">{t.searchUsers}</h1>
                <p className="text-white/50">{t.searchUsersDesc}</p>
              </div>
              <UserSearch lang={lang} />
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <AdminChat lang={lang} />
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={loadAll} variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-semibold">
            {t.refreshAll}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VipDashboard;
