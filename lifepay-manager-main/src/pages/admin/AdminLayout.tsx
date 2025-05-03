
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarHeader } from "@/components/admin/menu/SidebarHeader";
import { SidebarFooter } from "@/components/admin/menu/SidebarFooter";
import { SidebarMenuItem } from "@/components/admin/menu/SidebarMenuItem";
import { menuItems } from "./menu/menuItems";

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  // 使用状态跟踪打开的菜单项
  const [openMenuItems, setOpenMenuItems] = useState<number[]>([]);
  const location = useLocation();

  // 切换菜单项的打开/关闭状态
  const toggleMenuItem = (index: number) => {
    setOpenMenuItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // 检查当前路径，自动打开相应的菜单项
  const isMenuItemActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
              <SidebarHeader />
              
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {menuItems.map((item, index) => (
                  <SidebarMenuItem 
                    key={index} 
                    item={item} 
                    isOpen={openMenuItems.includes(index)} 
                    onToggle={() => toggleMenuItem(index)} 
                  />
                ))}
              </nav>

              <SidebarFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden">
          {/* Mobile top nav */}
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
