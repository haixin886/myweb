
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SidebarFooter = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('admin_login_success');
      localStorage.removeItem('local_auth_user');
      toast.success('退出登录成功');
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('退出登录失败:', error);
      toast.error('退出登录失败');
    }
  };

  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
        <div className="text-xs text-gray-500 text-center">
          © 2024 Admin System
        </div>
      </div>
    </div>
  );
};
