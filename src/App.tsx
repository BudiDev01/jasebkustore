import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import VipLogin from "./pages/VipLogin";
import VipDashboard from "./pages/VipDashboard";
import VipForgotPassword from "./pages/VipForgotPassword";
import AdminUserView from "./pages/AdminUserView";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment/:productId" element={<Payment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/vip" element={<VipLogin />} />
              <Route path="/vip/dashboard" element={<VipDashboard />} />
              <Route path="/vip/user/:userId" element={<AdminUserView />} />
              <Route path="/vip/forgot-password" element={<VipForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
