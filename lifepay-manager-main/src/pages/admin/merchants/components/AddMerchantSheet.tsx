
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase, adminSupabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const AddUserSheet = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.nickname || !formData.password || !formData.phone) {
      toast.error("请填写所有必填字段");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("密码长度至少6位");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 验证表单
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // 检查手机号是否已存在
      const { data: existingUsers, error: fetchError } = await supabase
        .from("merchant_profiles")
        .select("id")
        .eq("phone", formData.phone);

      if (fetchError) {
        console.error("检查手机号失败:", fetchError);
        setError("检查手机号失败");
        toast.error("检查手机号失败");
        setIsLoading(false);
        return;
      }

      if (existingUsers && existingUsers.length > 0) {
        setError("该手机号已被注册");
        toast.error("该手机号已被注册");
        setIsLoading(false);
        return;
      }

      // 创建用户
      const { data: userData, error: signUpError } = await adminSupabase.auth.signUp({
        email: `${formData.phone}@example.com`,
        password: formData.password,
        options: {
          data: {
            phone: formData.phone,
            nickname: formData.nickname,
          },
        },
      });

      if (signUpError) {
        console.error("创建用户失败:", signUpError);
        setError(signUpError.message);
        toast.error(signUpError.message);
        setIsLoading(false);
        return;
      }

      const userId = userData.user?.id;

      if (!userId) {
        console.error("创建用户失败: 无法获取用户ID");
        setError("创建用户失败");
        toast.error("创建用户失败");
        setIsLoading(false);
        return;
      }

      // 创建用户资料
      const { error: profileError } = await supabase.from("merchant_profiles").insert({
        user_id: userId,
        phone: formData.phone,
        nickname: formData.nickname,
        status: true,
        account_balance: 0,
        freeze_balance: 0,
        commission: 0,
        team_count: 0,
      });

      if (profileError) {
        console.error("创建用户资料失败:", profileError);
        setError("创建用户资料失败");
        toast.error("创建用户资料失败");
        setIsLoading(false);
        return;
      }

      // 清空表单
      setFormData({
        phone: "",
        password: "",
        nickname: "",
        email: ""
      });

      // 刷新用户列表
      queryClient.invalidateQueries({ queryKey: ["merchants"] });

      // 关闭表单
      setIsOpen(false);
      toast.success("用户创建成功");
    } catch (error) {
      console.error("创建用户失败:", error);
      setError("创建用户失败");
      toast.error("创建用户失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="text-white bg-blue-600 hover:bg-blue-700"
        >
          添加用户
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>添加新用户</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">用户昵称</label>
            <Input
              required
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              placeholder="请输入用户昵称"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">登录邮箱</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="请输入登录邮箱"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">邮箱将用于登录和找回密码</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">手机号码</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="请输入手机号码"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">可选填写</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">登录密码</label>
            <Input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="请输入登录密码"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">密码长度至少6位</p>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  创建中...
                </>
              ) : (
                "确认创建"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
