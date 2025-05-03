
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UserStatsProps {
  date: Date;
}

export const UserStats = ({ date }: UserStatsProps) => {
  const navigate = useNavigate();

  const { data: userStats, isLoading: loadingUserStats } = useQuery({
    queryKey: ['dashboard', 'userStats', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats_user')
        .select('*')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user stats:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
          toast.error("无权访问管理员功能");
          navigate('/admin/login');
          throw new Error("Unauthorized access");
        }
        toast.error("加载用户统计数据失败");
        throw error;
      }

      return data ?? {
        total_users: 0,
        new_users_today: 0,
        new_users_yesterday: 0,
        total_merchants: 0,
        new_merchants_today: 0,
        new_merchants_yesterday: 0
      };
    },
    retry: false,
    staleTime: 30000 // Cache data for 30 seconds
  });

  const formatUserStats = [
    { label: "总用户数", value: loadingUserStats ? <Skeleton className="h-6 w-24" /> : userStats?.total_users || 0 },
    { label: "今日新增", value: loadingUserStats ? <Skeleton className="h-6 w-24" /> : userStats?.new_users_today || 0 },
    { label: "昨日新增", value: loadingUserStats ? <Skeleton className="h-6 w-24" /> : userStats?.new_users_yesterday || 0 },
    { label: "总商户数", value: loadingUserStats ? <Skeleton className="h-6 w-24" /> : userStats?.total_merchants || 0 },
    { label: "今日新增商户", value: loadingUserStats ? <Skeleton className="h-6 w-24" /> : userStats?.new_merchants_today || 0 },
    { label: "昨日新增商户", value: loadingUserStats ? <Skeleton className="h-6 w-24" /> : userStats?.new_merchants_yesterday || 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {formatUserStats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="text-lg font-medium mt-1">{stat.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
