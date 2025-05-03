
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WaveBackground } from "../components/WaveBackground";
import { ServiceGrid } from "../components/ServiceGrid";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!username || !password) {
        toast.error("请输入账号和密码");
        setIsLoading(false);
        return;
      }

      const email = `${username}@placeholder.com`;
      
      // First check if the user exists by trying to sign in with a known wrong password
      // This is a workaround to check if the user exists without admin access
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email: email,
        password: "checkuserexists_notarealpassword"
      });

      // If the error message doesn't include "Invalid login credentials", the user doesn't exist
      const userDoesNotExist = checkError && !checkError.message.includes("Invalid login credentials");
      
      if (userDoesNotExist) {
        toast.error("账号不存在，请检查或注册新账号");
        setIsLoading(false);
        return;
      }

      // Now try the actual login with the provided password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("密码错误，请重新输入");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("账号未验证，请查收邮件");
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success("登录成功");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WaveBackground />

      <div className="fixed top-0 left-0 right-0 bg-transparent p-4 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Bell className="w-6 h-6 text-white" />
      </div>

      <div className="relative px-6 pt-20 z-10">
        <div className="text-center mb-12">
          <h1 className="mb-3 text-7xl font-bold text-white">汇享生活</h1>
          <p className="text-white/80 text-sm">信息加密、智能交易、资金全额保障</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          <Input 
            type="text" 
            placeholder="请输入账号" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            className="h-12 bg-white/90 backdrop-blur-sm"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <Input 
            type="password" 
            placeholder="请输入密码" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="h-12 bg-white/90 backdrop-blur-sm"
          />
          <div className="flex justify-end">
            <Button
              variant="link"
              className="text-white hover:text-white/80 p-0 h-auto"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              忘记密码？
            </Button>
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#6c2bd9] hover:bg-[#5a23b6]" 
            disabled={isLoading}
          >
            {isLoading ? "登录中..." : "登录"}
          </Button>
        </form>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm border-none cursor-pointer" onClick={() => navigate("/login")}>
            <div className="w-12 h-12 bg-[#00ffa3] rounded-xl mb-2 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium">用户登录</span>
          </Card>

          <Card className="p-4 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm border-none cursor-pointer" onClick={() => navigate("/register")}>
            <div className="w-12 h-12 bg-[#ff4d94] rounded-xl mb-2 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium">用户注册</span>
          </Card>
        </div>

        <ServiceGrid />
      </div>
    </div>
  );
};

export default LoginPage;
