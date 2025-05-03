
import { ShoppingCart, Wallet2, Users, CreditCard, MessageSquare, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TransactionCenterProps {
  onNavigate: (path: string) => void;
}

export const TransactionCenter = ({ onNavigate }: TransactionCenterProps) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onNavigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("退出登录失败");
    }
  };

  const menuItems = [
    { name: "推广海报", icon: ShoppingCart, path: "/poster" },
    { name: "钱包地址", icon: Wallet2, path: "/wallet-address" },
    { name: "代理中心", icon: Users, path: "/agent" },
    { name: "支付管理", icon: CreditCard, path: "/payment/settings" },
    { name: "在线客服", icon: MessageSquare, path: "/support" },
    { name: "出售管理", icon: ShoppingCart, path: "/sales" },
    { name: "交易订单", icon: ShoppingCart, path: "/transactions" },
    { name: "退出登录", icon: ArrowUpRight, path: "/logout", onClick: handleLogout }
  ];

  return (
    <div className="bg-white rounded-3xl mx-5 mt-5 p-5">
      <div className="text-xl font-bold mb-5">交易大厅</div>
      <div className="grid grid-cols-4 gap-y-6">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => item.onClick ? item.onClick() : onNavigate(item.path)}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
