
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  username: string | null;
  id: string;
  email?: string;
}

interface OrderStats {
  phoneRechargeCount: number;
  queryOrderCount: number;
}

export const useProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    phoneRechargeCount: 0,
    queryOrderCount: 0
  });

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const loadProfile = async () => {
      // 添加超时控制，避免长时间阻塞
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('获取用户资料超时')), 5000); // 5秒超时
      });
      
      try {
        if (isMounted) setIsLoading(true);
        console.log("Loading profile data...");
        
        // 使用 Promise.race 实现超时控制
        await Promise.race([
          (async () => {
            try {
              const {
                data: { session }
              } = await supabase.auth.getSession();
              
              if (!session) {
                console.log("No session found, redirecting to login");
                if (isMounted) {
                  // 延迟导航，确保页面有时间渲染
                  setTimeout(() => navigate("/login"), 100);
                }
                return;
              }
              
              console.log("Session found, fetching profile data");
              
              // 创建一个默认的用户资料，以防数据库查询失败
              const defaultProfile = {
                id: session.user.id,
                username: session.user.email?.split('@')[0] || null,
                email: session.user.email
              };
              
              // 尝试获取用户资料，但设置超时
              try {
                const profileResult = await Promise.race([
                  supabase
                    .from('user_profiles')
                    .select('id, username')
                    .eq('id', session.user.id)
                    .maybeSingle(),
                  new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('获取用户资料数据库查询超时')), 3000)
                  )
                ]);
                
                const { data: profileData, error } = profileResult;

                if (error) {
                  console.error('Error fetching profile:', error);
                  if (isMounted) {
                    // 使用默认资料
                    setProfile(defaultProfile);
                  }
                } else if (profileData) {
                  console.log("Profile data found:", profileData);
                  if (isMounted) {
                    setProfile({
                      id: profileData.id,
                      username: profileData.username || session.user.email?.split('@')[0] || null,
                      email: session.user.email
                    });
                  }
                } else {
                  console.log("No profile found, using default profile");
                  if (isMounted) {
                    setProfile(defaultProfile);
                  }
                }
              } catch (profileError) {
                console.error('Profile fetch timed out or failed:', profileError);
                if (isMounted) {
                  // 使用默认资料
                  setProfile(defaultProfile);
                }
              }

              // 尝试获取订单统计，但不阻塞UI渲染
              try {
                const orderResult = await Promise.race([
                  supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', session.user.id)
                    .eq('type', '话费充值'),
                  new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('获取订单统计超时')), 3000)
                  )
                ]);
                
                const { count: phoneRechargeCount, error: orderError } = orderResult;
                  
                if (orderError) {
                  console.error('Error fetching order count:', orderError);
                } else if (isMounted) {
                  setOrderStats(prev => ({
                    ...prev,
                    phoneRechargeCount: phoneRechargeCount || 0
                  }));
                }
              } catch (orderError) {
                console.error('Order stats fetch timed out or failed:', orderError);
                // 保持默认订单统计
              }
            } catch (sessionError) {
              console.error('Session check error:', sessionError);
              // 如果获取会话失败，我们仍然让UI渲染，但不显示用户资料
            }
          })(),
          timeoutPromise
        ]);
      } catch (error) {
        console.error('Error or timeout in profile loading:', error);
        // 不显示错误提示，避免影响用户体验
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("Profile loading complete");
        }
      }
    };

    // 页面加载时立即调用一次
    loadProfile();

    // 设置定期刷新（每60秒）
    const intervalId = setInterval(loadProfile, 60000);

    // 清理函数
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [navigate]);

  // Add a refresh function that can be called manually
  const refreshProfile = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay to ensure loading state is applied
    
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('id, username')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error refreshing profile:', error);
        toast.error("刷新用户资料失败");
        return;
      }

      if (profileData) {
        setProfile({
          id: profileData.id,
          username: profileData.username || session.user.email?.split('@')[0] || null,
          email: session.user.email
        });
      } else {
        setProfile({
          id: session.user.id,
          username: session.user.email?.split('@')[0] || null,
          email: session.user.email
        });
      }
      
      toast.success("资料刷新成功");
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast.error("刷新失败");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    orderStats,
    navigateTo: navigate,
    refreshProfile
  };
};
