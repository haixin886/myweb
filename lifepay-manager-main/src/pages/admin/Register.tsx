import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase, adminSupabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.adminKey) {
      setError("请填写所有必填字段");
      toast.error("请填写所有必填字段");
      return false;
    }

    if (formData.password.length < 6) {
      setError("密码长度至少6位");
      toast.error("密码长度至少6位");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      toast.error("两次输入的密码不一致");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("请输入有效的邮箱地址");
      toast.error("请输入有效的邮箱地址");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // 验证管理员密钥
      const { data: settings, error: settingsError } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'admin_register_key')
        .single();

      if (settingsError || !settings) {
        console.error("Error fetching admin key:", settingsError);
        setError("系统错误，请稍后重试");
        toast.error("系统错误，请稍后重试");
        setLoading(false);
        return;
      }
      
      // 验证管理员密钥
      if (settings.value !== formData.adminKey) {
        setError("管理员密钥错误");
        toast.error("管理员密钥错误");
        setLoading(false);
        return;
      }

      // 创建用户账户
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'admin'
          }
        }
      });

      if (authError) {
        console.error("Registration error:", authError);
        
        if (authError.message.includes("already registered")) {
          setError("该邮箱已被注册");
          toast.error("该邮箱已被注册");
        } else {
          setError(authError.message);
          toast.error(authError.message);
        }
        
        setLoading(false);
        return;
      }

      if (data.user) {
        // 创建管理员资料
        const { error: profileError } = await adminSupabase
          .from('admin_profiles')
          .insert({
            user_id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: 'admin',
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Error creating admin profile:", profileError);
          setError("创建管理员资料失败");
          toast.error("创建管理员资料失败");
          
          // 删除已创建的用户账户
          await adminSupabase.auth.admin.deleteUser(data.user.id);
          
          setLoading(false);
          return;
        }

        // 记录注册日志
        console.log('Admin registered:', {
          admin_id: data.user.id,
          name: formData.name,
          email: formData.email,
          created_at: new Date().toISOString()
        });

        toast.success("注册成功，请登录");
        setTimeout(() => {
          navigate("/admin/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("系统错误，请稍后重试");
      toast.error("系统错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate("/admin/login")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">管理员注册</h2>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">管理员姓名</Label>
            <Input
              id="name"
              name="name"
              placeholder="请输入管理员姓名"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-black"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="请输入电子邮箱"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-black"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-black"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full text-black"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminKey">管理员密钥</Label>
            <Input
              id="adminKey"
              name="adminKey"
              type="password"
              placeholder="请输入管理员密钥"
              value={formData.adminKey}
              onChange={handleChange}
              required
              className="w-full text-black"
            />
            <p className="text-xs text-gray-500">需要管理员密钥才能注册管理员账户</p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "注册中..." : "注册"}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            已有账户？ 
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600" 
              onClick={() => navigate("/admin/login")}
            >
              返回登录
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminRegister;
