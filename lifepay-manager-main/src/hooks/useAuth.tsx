import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define User type
export interface User {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false, // 默认不加载，避免阻塞渲染
  signIn: async () => {},
  signOut: async () => {},
});

// 创建一个极简版的 AuthProvider，避免在初始渲染时进行数据库操作
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // 默认不加载，避免阻塞渲染

  // 延迟加载认证状态，确保应用程序首先渲染
  useEffect(() => {
    // 设置一个标记，表示组件是否已卸载
    let isMounted = true;

    // 延迟执行认证检查，确保应用程序首先渲染
    const delayedAuthCheck = setTimeout(() => {
      if (!isMounted) return;

      // 检查会话，但不阻塞应用程序渲染
      const checkSession = async () => {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session && isMounted) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      };

      checkSession();

      // 设置认证状态变化监听器
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted) return;
            
            if (session) {
              setUser({
                id: session.user.id,
                email: session.user.email
              });
            } else {
              setUser(null);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth subscription error:', error);
      }
    }, 100); // 短暂延迟，确保应用程序首先渲染

    return () => {
      isMounted = false;
      clearTimeout(delayedAuthCheck);
    };
  }, []);

  // 简化的登录函数
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "登录失败");
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "登录失败");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 简化的登出函数
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message || "登出失败");
        throw error;
      }
      setUser(null);
    } catch (error: any) {
      toast.error(error.message || "登出失败");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
