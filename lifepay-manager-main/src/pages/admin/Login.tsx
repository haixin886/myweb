import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import useLocalAuth from "@/hooks/use-local-auth"; 

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const localAuth = useLocalAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError('请输入邮箱和密码');
      toast.error('请输入邮箱和密码');
      setLoading(false);
      return;
    }

    try {
      // 使用本地认证登录
      console.log('尝试登录:', formData.email);
      const result = await localAuth.signIn(formData.email, formData.password);

      if (result?.error) {
        setError('邮箱或密码错误');
        toast.error('邮箱或密码错误');
        setLoading(false);
        return;
      }

      // 登录成功，设置本地用户信息和登录成功标记
      const userData = {
        email: formData.email,
        user_metadata: { is_admin: true, role: 'admin' }
      };
      localStorage.setItem('local_auth_user', JSON.stringify(userData));
      localStorage.setItem('admin_login_success', 'true');
      toast.success('登录成功');
      
      // 使用硬编码的路径导航到管理后台首页
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('登录错误:', error);
      setError('登录过程中出现错误');
      toast.error('登录过程中出现错误');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold">管理员登录</h2>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
