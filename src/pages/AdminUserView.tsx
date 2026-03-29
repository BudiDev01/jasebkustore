import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, ShoppingBag, Wallet, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  product_name: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const AdminUserView = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!user) { navigate("/vip"); return; }
    checkAndLoad();
  }, [user, userId]);

  const checkAndLoad = async () => {
    if (!user || !userId) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles || roles.length === 0) { navigate("/vip"); return; }
    setIsAdmin(true);

    const [profileRes, ordersRes, balanceRes, emailRes] = await Promise.all([
      supabase.from("profiles").select("username, full_name, avatar_url").eq("user_id", userId).maybeSingle(),
      supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.rpc("get_user_balance", { uid: userId }),
      supabase.rpc("admin_search_users", { search_term: "" }),
    ]);

    setProfile(profileRes.data);
    setOrders(ordersRes.data ?? []);
    setBalance(typeof balanceRes.data === "number" ? balanceRes.data : 0);

    const users = emailRes.data as { user_id: string; email: string }[] | null;
    const found = users?.find((u) => u.user_id === userId);
    setEmail(found?.email ?? userId ?? "");
    setLoading(false);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === "confirmed") return <CheckCircle className="w-4 h-4 text-blue-400" />;
    return <Clock className="w-4 h-4 text-gold" />;
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen gradient-hero">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/vip/dashboard" className="text-white/50 hover:text-white flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" /> VIP Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-white/50 text-center py-20">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover border-2 border-gold/30" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                      <User className="w-7 h-7 text-gold" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-black text-white">
                      {profile?.username || profile?.full_name || email.split("@")[0]}
                    </h1>
                    <p className="text-white/50 text-sm">{email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-white/40 mb-1">Saldo</div>
                    <div className="text-lg font-black text-gold">{formatPrice(balance)}</div>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-white/40 mb-1">Total Orders</div>
                    <div className="text-lg font-black text-gold flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> {orders.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-gold" /> Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-white/40 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="divide-y divide-white/10">
                    {orders.map((order) => (
                      <div key={order.id} className="py-3 flex items-center gap-4">
                        <StatusIcon status={order.status} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{order.product_name}</div>
                          <div className="text-xs text-white/40">{formatDate(order.created_at)}</div>
                        </div>
                        <div className="text-sm font-bold text-gold">{formatPrice(order.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUserView;
