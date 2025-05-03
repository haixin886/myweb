
import { ShoppingCart, CreditCard, MessageSquare, Users, LogOut } from "lucide-react";
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
    { name: "钱包地址", icon: CreditCard, path: "/wallet-address" },
    { name: "代理中心", icon: Users, path: "/agent" },
    { name: "支付管理", icon: CreditCard, path: "/payment" },
    { name: "在线客服", icon: MessageSquare, path: "/support" },
    { name: "出售管理", icon: ShoppingCart, path: "/sales" },
    { name: "交易订单", icon: ShoppingCart, path: "/transactions" },
    { name: "退出登录", icon: LogOut, onClick: handleLogout }
  ];

  return (
    <div className="mx-4 mt-4 bg-white rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">交易大厅</h2>
      <div className="grid grid-cols-4 gap-4">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center cursor-pointer active:opacity-60"
            onClick={() => item.onClick ? item.onClick() : onNavigate(item.path)}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-1">
              <item.icon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
