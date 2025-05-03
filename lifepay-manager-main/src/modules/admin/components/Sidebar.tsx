
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  CreditCard,
  Store,
  FileText,
  LogOut,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "仪表盘", path: "/admin" },
  { icon: Users, label: "用户管理", path: "/admin/users" },
  { icon: Store, label: "商户管理", path: "/admin/merchants" },
  { icon: ShoppingCart, label: "订单管理", path: "/admin/orders" },
  { icon: FileText, label: "业务订单", path: "/admin/business-orders" },
  { 
    icon: CreditCard, 
    label: "财务管理", 
    path: "/admin/finance",
    subItems: [
      { label: "支付管理", path: "/admin/finance/payment" },
      { label: "充值订单", path: "/admin/finance/recharge-orders" },
    ] 
  },
  { icon: Settings, label: "系统设置", path: "/admin/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("退出成功");
      navigate("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("退出失败，请重试");
    }
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold">管理后台</h1>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              {item.subItems ? (
                <div className="space-y-1">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100",
                      location.pathname.startsWith(item.path)
                        ? "bg-gray-100 text-primary font-medium"
                        : "text-gray-600"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                  
                  {/* 子菜单 */}
                  <ul className="ml-8 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                            "hover:bg-gray-100",
                            location.pathname === subItem.path
                              ? "bg-gray-100 text-primary font-medium"
                              : "text-gray-600"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-gray-100",
                    location.pathname === item.path
                      ? "bg-gray-100 text-primary font-medium"
                      : "text-gray-600"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          退出登录
        </Button>
      </div>
    </div>
  );
};
