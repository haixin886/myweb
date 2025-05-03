import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import useLocalAuth from "@/hooks/use-local-auth"; // 导入本地认证钩子
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useLocalAuthFallback, setUseLocalAuthFallback] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const localAuth = useLocalAuth();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (adminProfile) {
            navigate("/admin/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        // Don't show an error to the user here as they're just loading the page
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("请输入邮箱和密码");
      toast.error("请输入邮箱和密码");
      setLoading(false);
      return;
    }

    try {
      // 首先尝试使用 Supabase 注册
      if (!useLocalAuthFallback) {
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                is_admin: true,
                role: 'admin'
              }
            }
          });

          if (!signUpError) {
            toast.success("注册成功，请登录");
            setIsRegistering(false);
            setLoading(false);
            return;
          }

          console.error("注册错误:", signUpError);
          
          if (signUpError.message.includes("Database error") || signUpError.code === "unexpected_failure") {
            console.error('数据库连接错误:', signUpError);
            setError("数据库连接错误，将使用本地注册模式");
            toast.error("数据库连接错误，将使用本地注册模式");
            setUseLocalAuthFallback(true);
          } else {
            setError(signUpError.message);
            toast.error(signUpError.message);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Supabase 注册错误:", error);
          setUseLocalAuthFallback(true);
        }
      }

      // 如果 Supabase 失败或已启用本地认证，使用本地认证系统
      const result = await localAuth.signUp(formData.email, formData.password, { is_admin: true });
      
      if ('error' in result) {
        setError(result.error.message || '注册失败');
        toast.error(result.error.message || '注册失败');
        setLoading(false);
        return;
      }
      
      toast.success('注册成功，请登录');
      setIsRegistering(false);
    } catch (error) {
      console.error("注册过程中出现错误:", error);
      setError("注册过程中出现错误");
      toast.error("注册过程中出现错误");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 如果启用了本地认证备份，直接使用本地认证
    if (useLocalAuthFallback) {
      try {
        const result = await localAuth.signIn(formData.email, formData.password);
        
        if (result?.error) {
          setError(result.error.message || '登录失败');
          toast.error(result.error.message || '登录失败');
          setLoading(false);
          return;
        }
        
        toast.success('登录成功');
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } catch (error) {
        console.error('本地登录错误:', error);
        setError('登录过程中出现错误');
        toast.error('登录过程中出现错误');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (!formData.email || !formData.password) {
        setError("请输入邮箱和密码");
        toast.error("请输入邮箱和密码");
        setLoading(false);
        return;
      }

      // 先尝试使用 Supabase 认证
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        if (signInError.message.includes("Invalid login credentials")) {
          setError("邮箱或密码错误");
          toast.error("邮箱或密码错误");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("邮箱未验证，请查收邮件");
          toast.error("邮箱未验证，请查收邮件");
        } else if (signInError.message.includes("Database error") || signInError.code === "unexpected_failure") {
          console.error('数据库连接错误:', signInError);
          setError("数据库连接错误，将使用本地认证模式");
          toast.error("数据库连接错误，将使用本地认证模式");
          
          // 切换到本地认证模式
          setUseLocalAuthFallback(true);
          
          // 如果是默认管理员账号，自动尝试本地登录
          if (formData.email === 'admin@example.com') {
            console.log('尝试使用默认管理员账号本地登录...');
            
            const result = await localAuth.signIn(formData.email, formData.password);
            
            if (result?.error) {
              setError('本地登录失败: ' + (result.error.message || ''));
              toast.error('本地登录失败');
              setLoading(false);
              return;
            }
            
            toast.success('登录成功 (本地模式)');
            setTimeout(() => {
              navigate('/admin');
            }, 500);
            return;
          }
          
          setLoading(false);
          return;
        } else {
          setError(signInError.message);
          toast.error(signInError.message);
        }
        
        setLoading(false);
        return;
      }

      // 检查是否是管理员
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('登录用户信息:', user);
      console.log('用户元数据:', user?.user_metadata);
      
      // 如果是 admin@example.com，自动设置为管理员
      if (user && user.email === 'admin@example.com') {
        console.log('检测到默认管理员账号，自动设置管理员权限');
        
        // 更新用户元数据，设置为管理员
        const { error: updateError } = await supabase.auth.updateUser({
          data: { is_admin: true, role: 'admin' }
        });

        if (updateError) {
          console.error('更新用户元数据失败:', updateError);
        } else {
          console.log('已更新用户元数据，设置为管理员');
        }
      } else if (!user || (user.email !== 'admin@example.com' && (!user.user_metadata || !user.user_metadata.is_admin))) {
        // 不是管理员，登出
        await supabase.auth.signOut();
        setError('您不是管理员，无法登录管理后台');
        toast.error('您不是管理员，无法登录管理后台');
        setLoading(false);
        return;
      }

      console.log('管理员登录成功:', user.email);

      toast.success('登录成功');
      // 使用小延迟确保成功消息显示后再跳转
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      setError('登录过程中出现错误');
      toast.error('登录过程中出现错误');

      // 出错时尝试切换到本地认证模式
      setUseLocalAuthFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold">{isRegistering ? '管理员注册' : '管理员登录'}</h2>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {useLocalAuthFallback && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">本地认证模式</AlertTitle>
            <AlertDescription className="text-yellow-700">
              由于数据库连接问题，系统已切换到本地认证模式。您可以使用默认管理员账号 (admin@example.com) 登录，或注册新账号。
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
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
            {loading ? (isRegistering ? '注册中...' : '登录中...') : (isRegistering ? '注册' : '登录')}
          </Button>

          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm"
            >
              {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setUseLocalAuthFallback(!useLocalAuthFallback)}
              className="text-sm"
            >
              {useLocalAuthFallback ? '使用 Supabase 登录' : '使用本地认证'}
            </Button>
          </div>
          
          {useLocalAuthFallback && !isRegistering && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>默认管理员账号: admin@example.com</p>
              <p>默认密码: admin123</p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
