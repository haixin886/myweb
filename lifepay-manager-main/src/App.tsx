
// 恢复认证系统，使用之前修改过的更稳健的版本
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "./hooks/use-auth"; // 导入认证提供者
import { AuthProvider as LocalAuthProvider } from "./hooks/use-local-auth"; // 导入本地认证提供者
import { SyncProvider } from "./providers/SyncProvider"; // 导入数据同步提供者

// 导入基本页面组件
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Utilities from "./pages/Utilities";
import Support from "./pages/Support";
import Recharge from "./pages/Recharge";
import Orders from "./pages/Orders";
import PaymentOrders from "./pages/PaymentOrders";

// 导入在线业务页面组件
import CreditCard from "./pages/CreditCard";
import HuabeiRepayment from "./pages/HuabeiRepayment";
import DouYinCoin from "./pages/DouYinCoin";
import KuaishouCoin from "./pages/KuaishouCoin";
import NetEaseGame from "./pages/NetEaseGame";
import OilCard from "./pages/OilCard";
import GasFee from "./pages/GasFee";
import FangxinLoan from "./pages/FangxinLoan";

// 导入钱包相关页面
import Wallet from "./pages/Wallet";
import WalletRecharge from "./pages/WalletRecharge";
import WalletAddress from "./pages/WalletAddress";

// 导入管理后台组件
import AdminRoutes from "./pages/admin/routes";
import AdminLogin from "./pages/admin/Login";
// 其他管理后台组件已经通过 AdminRoutes 导入

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 检查用户是否偏好深色模式
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* 使用修改过的更稳健的 AuthProvider 包装应用程序 */}
      <AuthProvider>
        {/* 添加本地认证提供者作为备份 */}
        <LocalAuthProvider>
          {/* 添加数据同步提供者 */}
          <SyncProvider>
            <SonnerToaster position="top-center" />
            <Toaster />
          <Routes>
            {/* 前台用户端路由 */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/utilities" element={<Utilities />} />
            <Route path="/support" element={<Support />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment-orders" element={<PaymentOrders />} />

            {/* 在线业务路由 */}
            <Route path="/credit-card" element={<CreditCard />} />
            <Route path="/huabei-repayment" element={<HuabeiRepayment />} />
            <Route path="/douyin-coin" element={<DouYinCoin />} />
            <Route path="/kuaishou-coin" element={<KuaishouCoin />} />
            <Route path="/netease-game" element={<NetEaseGame />} />
            <Route path="/oil-card" element={<OilCard />} />
            <Route path="/gas-fee" element={<GasFee />} />
            <Route path="/fangxin-loan" element={<FangxinLoan />} />

            {/* 钱包相关路由 */}
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/recharge" element={<WalletRecharge />} />
            <Route path="/wallet/address" element={<WalletAddress />} />

            {/* 管理后台路由 - 只保留一个路由入口 */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </SyncProvider>
        </LocalAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
