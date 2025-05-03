
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
import { menuItems } from "./menu/menuItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/admin/login", { replace: true });
          return;
        }

        // For demo purposes - allow the hardcoded admin login
        if (session.user.email === 'admin@example.com') {
          setIsLoading(false);
          return;
        }
        
        // Check if user is admin in admin_profiles table
        const { data: adminProfile, error: adminError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (adminError || !adminProfile) {
          console.error("Admin check failed:", adminError);
          toast.error("您没有管理员权限");
          // Sign out non-admin user
          await supabase.auth.signOut();
          navigate("/admin/login", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("验证管理员权限时出错");
        navigate("/admin/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'SIGNED_OUT') {
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
                {menuItems.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    item={item}
                    isOpen={true}
                    onToggle={() => {}}
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
