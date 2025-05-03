
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Users, Activity, TrendingUp } from "lucide-react";

interface BusinessStatsProps {
  date: Date;
}

export const BusinessStats = ({ date }: BusinessStatsProps) => {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats', date],
    queryFn: async () => {
      try {
        const [{ data: userStats }, { data: financialStats }] = await Promise.all([
          supabase
            .from('stats_user')
            .select('total_users, new_users_today')
            .eq('date', format(date, 'yyyy-MM-dd'))
            .maybeSingle(),
          supabase
            .from('stats_financial')
            .select('pending_distribution_amount, recharging_amount')
            .eq('date', format(date, 'yyyy-MM-dd'))
            .maybeSingle()
        ]);

        if (!userStats || !financialStats) {
          return {
            userStats: { total_users: 0, new_users_today: 0 },
            financialStats: { pending_distribution_amount: 0, recharging_amount: 0 }
          };
        }

        return {
          userStats,
          financialStats
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
          toast.error("无权访问管理员功能");
          navigate('/admin/login');
          throw new Error("Unauthorized access");
        }
        toast.error("加载统计数据失败");
        throw error;
      }
    },
    retry: false,
    staleTime: 30000 // Cache data for 30 seconds
  });

  const statItems = [
    {
      title: "平台用户",
      value: stats?.userStats?.total_users || 0,
      change: `今日新增 ${stats?.userStats?.new_users_today || 0}`,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      title: "待处理订单",
      value: stats?.financialStats?.pending_distribution_amount || 0,
      change: "实时更新",
      icon: Activity,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500"
    },
    {
      title: "交易总额",
      value: stats?.financialStats?.recharging_amount || 0,
      change: "累计交易金额",
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <Card 
          key={item.title} 
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${item.bgColor}`}>
              <item.icon className={`w-8 h-8 ${item.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-600 text-lg mb-1">{item.title}</h3>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </span>
                <span className="text-sm text-green-500 mt-1">{item.change}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
