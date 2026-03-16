import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Crown, Users, Calendar, TrendingUp, LogOut, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface VisitStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

const VipDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<VisitStats>({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
    await loadStats();
  };

  const loadStats = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/vip");
  };

  if (!isAdmin) return null;

  const statCards = [
    { label: "Total Visitors", value: stats.total, icon: Users, color: "text-gold" },
    { label: "Today", value: stats.today, icon: Calendar, color: "text-emerald-400" },
    { label: "This Week", value: stats.thisWeek, icon: TrendingUp, color: "text-sky-400" },
    { label: "This Month", value: stats.thisMonth, icon: TrendingUp, color: "text-violet-400" },
  ];

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
        <h1 className="text-3xl font-black text-white mb-2">Visitor Analytics</h1>
        <p className="text-white/50 mb-8">Monitor your store traffic in real-time</p>

        {loading ? (
          <div className="text-white/50 text-center py-20">Loading stats...</div>
        ) : (
          <>
            {/* Stat Cards */}
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

            {/* Recent Visits Table */}
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
                            <td className="py-2 text-white/70">
                              {new Date(v.visited_at).toLocaleString()}
                            </td>
                            <td className="py-2 text-white/70">{v.page_path}</td>
                            <td className="py-2 text-white/50 hidden sm:table-cell truncate max-w-[200px]">
                              {v.referrer || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 flex justify-end">
              <Button onClick={loadStats} variant="outline" size="sm" className="border-white/20 text-white/60 hover:bg-white/10">
                Refresh Data
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VipDashboard;
