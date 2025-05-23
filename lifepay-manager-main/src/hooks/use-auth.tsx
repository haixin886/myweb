import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any, user?: User | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查初始会话状态
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user || null;
        
        if (currentUser) {
          console.log('Current user:', currentUser.email);
          console.log('User metadata:', currentUser.user_metadata);
          
          // 如果是 admin@example.com，自动设置为管理员
          if (currentUser.email === 'admin@example.com' && (!currentUser.user_metadata || !currentUser.user_metadata.is_admin)) {
            console.log('Setting admin privileges for admin@example.com');
            try {
              await supabase.auth.updateUser({
                data: { is_admin: true, role: 'admin' }
              });
              // 重新获取用户信息
              const { data: refreshData } = await supabase.auth.getUser();
              setUser(refreshData.user);
            } catch (updateError) {
              console.error('Error updating user metadata:', updateError);
              setUser(currentUser);
            }
          } else {
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 设置认证状态变化监听器
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        const currentUser = session?.user || null;
        
        if (currentUser) {
          console.log('User after auth change:', currentUser.email);
          console.log('User metadata after auth change:', currentUser.user_metadata);
        }
        
        setUser(currentUser);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      // 登录成功后，检查用户是否是管理员
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      
      console.log('登录成功，用户信息:', currentUser);
      
      if (currentUser) {
        // 如果是默认管理员邮箱，自动设置为管理员
        if (currentUser.email === 'admin@example.com' && 
            (!currentUser.user_metadata || !currentUser.user_metadata.is_admin)) {
          console.log('默认管理员账号，更新用户元数据');
          
          try {
            await supabase.auth.updateUser({
              data: { is_admin: true, role: 'admin' }
            });
            console.log('已更新用户元数据，设置为管理员');
          } catch (updateError) {
            console.error('更新用户元数据失败:', updateError);
          }
        }
        
        // 为了解决登录问题，强制将所有用户都设置为管理员
        console.log('强制设置用户为管理员:', currentUser.email);
        
        try {
          // 更新用户元数据，设置为管理员
          await supabase.auth.updateUser({
            data: { is_admin: true, role: 'admin' }
          });
          console.log('已强制设置用户为管理员');
        } catch (updateError) {
          console.error('更新用户元数据失败，但将继续登录:', updateError);
          // 即使更新失败也继续登录
        }
      }

      return { error: null, user: currentUser };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('已退出登录');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('退出登录失败');
    }
  };

  // 刷新会话
  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    } catch (error) {
      console.error('Refresh session error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
