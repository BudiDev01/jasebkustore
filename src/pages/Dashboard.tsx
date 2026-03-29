import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, LogOut, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AvatarUpload from "@/components/AvatarUpload";
import CustomerChat from "@/components/CustomerChat";

interface Order {
  id: string;
  product_name: string;
  amount: number;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, refresh: refreshProfile } = useProfile();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
        setIsAdmin(!!data);
      });
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders(data || []);
          setOrdersLoading(false);
        });
    }
  }, [user]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === "confirmed") return <CheckCircle className="w-4 h-4 text-blue-400" />;
    return <Clock className="w-4 h-4 text-gold" />;
  };

  const statusLabel = (status: string) => {
    if (status === "completed") return t.completed;
    if (status === "confirmed") return t.confirmed;
    return t.pending;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-foreground">{t.dashboardTitle}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/5">
            <LogOut className="w-4 h-4" />
            {t.logout}
          </Button>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4" /> {t.profileTab}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <Package className="w-4 h-4" /> {t.ordersTab}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="rounded-xl border border-border bg-card shadow-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <AvatarUpload
                  currentUrl={profile?.avatar_url ?? null}
                  fallback={(profile?.username || user?.email || "U")[0].toUpperCase()}
                  size="w-20 h-20"
                  onUploaded={() => refreshProfile()}
                />
                <div>
                  <div className="font-semibold text-foreground text-lg">
                    {profile?.username || profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                  </div>
                  <div className="text-muted-foreground text-sm">{user?.email}</div>
                  <p className="text-xs text-muted-foreground mt-1">Click photo to change</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Email</div>
                  <div className="text-sm font-medium text-foreground">{user?.email}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Total Orders</div>
                  <div className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gold" />
                    {orders.length} orders
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              {ordersLoading ? (
                <div className="p-8 text-center text-muted-foreground">{t.loading}</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t.noOrders}</p>
                  <Button
                    size="sm"
                    className="mt-4 gradient-gold text-primary-foreground"
                    onClick={() => navigate("/#products")}
                  >
                    Shop Now
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <StatusIcon status={order.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">{order.product_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{formatDate(order.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gold">{formatPrice(order.amount)}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{statusLabel(order.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <WhatsAppButton />
      <CustomerChat />
    </div>
  );
};

export default Dashboard;
