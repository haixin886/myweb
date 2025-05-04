
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// 使用类型断言解决类型错误
const supabaseAny = supabase as any;

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [mockVerificationCode, setMockVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!email) {
      toast.error("请输入邮箱");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("请输入有效的邮箱地址");
      return;
    }

    setIsSendingCode(true);

    try {
      // 模拟发送验证码
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`模拟验证码: ${mockCode}`);
      setMockVerificationCode(mockCode);
      toast.success(`验证码已发送: ${mockCode}`);
      
      // 在实际应用中，这里应该调用API发送验证码到用户邮箱
      // await sendEmailVerificationCode(email);

      // 开始倒计时
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码失败:', error);
      toast.error("发送验证码失败，请重试");
    } finally {
      setIsSendingCode(false);
    }
  };
  
  // 验证邮箱格式
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 验证表单
      if (!email || !verificationCode || !password || !confirmPassword) {
        toast.error("请填写所有必填字段");
        setIsLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        toast.error("请输入有效的邮箱地址");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("两次输入的密码不一致");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error("密码长度不能小于6位");
        setIsLoading(false);
        return;
      }

      if (verificationCode !== mockVerificationCode) {
        toast.error("验证码错误");
        setIsLoading(false);
        return;
      }

      // 检查用户是否已存在
      const { data: existingUser } = await supabaseAny
        .from('user_profiles')
        .select('id')
        .eq('nickname', email.split('@')[0])
        .maybeSingle();

      if (existingUser) {
        toast.error("该用户已存在");
        setIsLoading(false);
        return;
      }

      // 注册用户
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password,
        options: {
          data: {
            email: email,
            created_at: new Date().toISOString()
          },
          // 跳过邮箱验证
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        // 如果是发送确认邮件错误，我们忽略它并继续
        if (signUpError.message.includes('Error sending confirmation email')) {
          console.log('忽略发送确认邮件错误，继续注册过程');
        } else if (signUpError.message.includes('User already registered')) {
          // 如果用户已经注册，尝试直接登录
          toast.info("用户已存在，正在尝试登录...");
          
          // 尝试直接登录
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });
          
          if (signInError) {
            toast.error("登录失败，请检查您的密码");
            setIsLoading(false);
            return;
          }
          
          toast.success("登录成功！");
          setIsLoading(false);
          onSuccess();
          return;
        } else {
          toast.error(signUpError.message || "注册失败");
          setIsLoading(false);
          return;
        }
      }

      if (!data?.user) {
        toast.error("注册失败，请重试");
        setIsLoading(false);
        return;
      }

      // 生成随机的推荐码
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // 创建用户资料
      const { error: profileError } = await supabaseAny
        .from('user_profiles')
        .insert({
          id: data.user.id,
          user_id: data.user.id,
          nickname: email.split('@')[0],
          avatar_url: null,
          phone: null,
          balance: 0,
          freeze_balance: 0,
          referral_code: referralCode,
          is_merchant: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast.error(profileError.message || "创建用户资料失败");
        setIsLoading(false);
        return;
      }

      // 注册成功后直接登录
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (signInError) {
        // 登录失败，但注册成功
        toast.success("注册成功！请登录您的账号");
        setIsLoading(false);
        onSuccess();
        return;
      }

      toast.success("注册成功并已自动登录！");
      setIsLoading(false);
      onSuccess();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "注册过程中发生错误");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="请输入邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl bg-white/90 backdrop-blur-sm text-black"
          />
        </div>
        
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="请输入验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="h-12 rounded-xl bg-white/90 backdrop-blur-sm flex-1 text-black"
          />
          <Button
            type="button"
            onClick={sendVerificationCode}
            disabled={isSendingCode || countdown > 0}
            className="h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white min-w-[120px]"
          >
            {isSendingCode ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : countdown > 0 ? (
              `${countdown}s`
            ) : (
              "获取验证码"
            )}
          </Button>
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl bg-white/90 backdrop-blur-sm text-black"
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="请确认密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 rounded-xl bg-white/90 backdrop-blur-sm text-black"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium text-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              注册中...
            </>
          ) : (
            "立即注册"
          )}
        </Button>
      </form>
    </div>
  );
};
