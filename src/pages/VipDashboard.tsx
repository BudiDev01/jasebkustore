import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Crown, Users, Calendar, TrendingUp, LogOut, ArrowLeft, Wallet, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface VisitStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface TopUpRecord {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  notes: string | null;
}

const VipDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<VisitStats>({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [topups, setTopups] = useState<TopUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/vip");
      return;
    }
    checkAdminAndLoad();
  }, [user]);

  const checkAdminAndLoad = async () => {
    if (!user) return;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast({ title: "Access Denied", variant: "destructive" });
      navigate("/vip");
      return;
    }

    setIsAdmin(true);
    await loadAll();
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadTopups()]);
    setLoading(false);
  };

  const loadStats = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [totalRes, todayRes, weekRes, monthRes, recentRes] = await Promise.all([
      supabase.from("page_visits").select("id", { count: "exact", head: true }),
      supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("visited_at", todayStart),
      supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("visited_at", weekStart),
      supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("visited_at", monthStart),
      supabase.from("page_visits").select("*").order("visited_at", { ascending: false }).limit(20),
    ]);

    setStats({
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
      thisWeek: weekRes.count ?? 0,
      thisMonth: monthRes.count ?? 0,
    });
    setRecentVisits(recentRes.data ?? []);
  };

  const loadTopups = async () => {
    const { data } = await supabase
      .from("topups")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setTopups(data ?? []);
  };

  const updateTopupStatus = async (id: string, status: "completed" | "cancelled") => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("topups")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    setUpdatingId(null);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated!", description: `Top up ${status === "completed" ? "approved" : "rejected"}.` });
      await loadTopups();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/vip");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "completed") return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400"><CheckCircle className="w-3 h-3" /> Berhasil</span>;
    if (status === "cancelled") return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400"><XCircle className="w-3 h-3" /> Ditolak</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold"><Clock className="w-3 h-3" /> Menunggu</span>;
  };

  if (!isAdmin) return null;

  const statCards = [
    { label: "Total Visitors", value: stats.total, icon: Users, color: "text-gold" },
    { label: "Today", value: stats.today, icon: Calendar, color: "text-emerald-400" },
    { label: "This Week", value: stats.thisWeek, icon: TrendingUp, color: "text-sky-400" },
    { label: "This Month", value: stats.thisMonth, icon: TrendingUp, color: "text-violet-400" },
  ];

  const pendingTopups = topups.filter((t) => t.status === "pending");

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
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/50 hover:text-white text-sm flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Store
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/50 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-white/50 text-center py-20">Loading...</div>
        ) : (
          <Tabs defaultValue="analytics">
            <TabsList className="mb-6 bg-white/5 border border-white/10">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground text-white/60">
                <TrendingUp className="w-4 h-4 mr-1" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="topups" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground text-white/60">
                <Wallet className="w-4 h-4 mr-1" /> Top Up
                {pendingTopups.length > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingTopups.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <h1 className="text-3xl font-black text-white mb-2">Visitor Analytics</h1>
              <p className="text-white/50 mb-8">Monitor your store traffic in real-time</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => (
                  <Card key={s.label} className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        {s.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-black ${s.color}`}>{s.value.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Visits</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentVisits.length === 0 ? (
                    <p className="text-white/40 text-center py-8">No visits recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 text-white/50 font-medium">Time</th>
                            <th className="text-left py-2 text-white/50 font-medium">Page</th>
                            <th className="text-left py-2 text-white/50 font-medium hidden sm:table-cell">Referrer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentVisits.map((v) => (
                            <tr key={v.id} className="border-b border-white/5">
                              <td className="py-2 text-white/70">{new Date(v.visited_at).toLocaleString()}</td>
                              <td className="py-2 text-white/70">{v.page_path}</td>
                              <td className="py-2 text-white/50 hidden sm:table-cell truncate max-w-[200px]">{v.referrer || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Top Up Management Tab */}
            <TabsContent value="topups">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">Kelola Top Up</h1>
                  <p className="text-white/50">Approve atau reject permintaan top up dari user</p>
                </div>
                <Button onClick={loadTopups} variant="outline" size="sm" className="border-white/20 text-white/60 hover:bg-white/10">
                  Refresh
                </Button>
              </div>

              {topups.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="py-12 text-center">
                    <Wallet className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">Belum ada permintaan top up.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {topups.map((tu) => (
                    <Card key={tu.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gold font-black text-lg">{formatPrice(tu.amount)}</span>
                              <StatusBadge status={tu.status} />
                            </div>
                            <p className="text-white/40 text-xs">
                              {formatDate(tu.created_at)} • {tu.method.toUpperCase()} • ID: {tu.id.slice(0, 8)}
                            </p>
                            <p className="text-white/30 text-xs mt-0.5 truncate">User: {tu.user_id.slice(0, 12)}…</p>
                          </div>

                          {tu.status === "pending" && (
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="sm"
                                onClick={() => updateTopupStatus(tu.id, "completed")}
                                disabled={updatingId === tu.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                              >
                                {updatingId === tu.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateTopupStatus(tu.id, "cancelled")}
                                disabled={updatingId === tu.id}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1"
                              >
                                <XCircle className="w-3 h-3" /> Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={loadAll} variant="outline" size="sm" className="border-white/20 text-white/60 hover:bg-white/10">
            Refresh All
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VipDashboard;
