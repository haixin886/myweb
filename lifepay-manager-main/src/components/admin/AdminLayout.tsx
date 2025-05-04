
import { ReactNode, useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarMenuItem } from "./menu/SidebarMenuItem";
import { SidebarHeader } from "./menu/SidebarHeader";
import { SidebarFooter } from "./menu/SidebarFooter";
import { menuItems } from "@/pages/admin/menu/menuItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

// 定义MenuItemWithSubMenu类型，与SidebarMenuItem组件兼容
interface SubMenuItem {
  title: string;
  href?: string;
}

interface MenuItemWithSubMenu {
  title: string;
  icon: LucideIcon;
  href?: string;
  submenu?: boolean;
  subMenuItems?: SubMenuItem[];
}

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({});

  // 使用 useMemo 缓存菜单项，避免每次渲染都重新创建
  // 注意：现在直接使用正确的菜单配置文件，不需要转换
  const transformedMenuItems = useMemo(() => {
    // 直接返回菜单项，因为已经使用正确的菜单配置文件
    return menuItems;
  }, []);

  useEffect(() => {
    // 直接设置加载完成，不进行任何认证检查
    setIsLoading(false);
    
    // 设置认证状态变化监听器，仅处理登出事件
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'SIGNED_OUT') {
          // 清除登录成功标记和本地用户
          localStorage.removeItem('admin_login_success');
          localStorage.removeItem('local_auth_user');
          navigate("/admin/login", { replace: true });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  // 处理菜单项的展开/折叠
  const handleToggleMenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-100">
        <Sidebar 
          variant={isMobile ? "floating" : "sidebar"} 
          className="w-64 border-r bg-white shadow-sm"
        >
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup className="p-2">
              <SidebarMenu>
                {transformedMenuItems.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    item={item}
                    isOpen={!!openMenus[item.title]}
                    onToggle={() => handleToggleMenu(item.title)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <main className="flex-1">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SidebarTrigger className="h-8 w-8 items-center justify-center rounded-md border bg-white shadow-sm md:hidden" />
              </div>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
