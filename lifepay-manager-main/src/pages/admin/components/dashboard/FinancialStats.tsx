
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FinancialStatsProps {
  date: Date;
}

export const FinancialStats = ({ date }: FinancialStatsProps) => {
  const navigate = useNavigate();

  const { data: financialStats, isLoading: loadingFinancialStats } = useQuery({
    queryKey: ['dashboard', 'financialStats', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats_financial')
        .select('*')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching financial stats:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
          toast.error("无权访问管理员功能");
          navigate('/admin/login');
          throw new Error("Unauthorized access");
        }
        toast.error("加载财务统计数据失败");
        throw error;
      }

      return data ?? {
        user_balance: 0,
        pending_distribution_amount: 0,
        recharging_amount: 0
      };
    },
    retry: false,
    staleTime: 30000 // Cache data for 30 seconds
  });

  const formatFinancialStats = [
    { label: "用户余额", value: loadingFinancialStats ? <Skeleton className="h-6 w-24" /> : `${financialStats?.user_balance?.toFixed(2) || "0.00"} 元` },
    { label: "待分配订单金额", value: loadingFinancialStats ? <Skeleton className="h-6 w-24" /> : `${financialStats?.pending_distribution_amount?.toFixed(2) || "0.00"} 元` },
    { label: "充值中订单金额", value: loadingFinancialStats ? <Skeleton className="h-6 w-24" /> : `${financialStats?.recharging_amount?.toFixed(2) || "0.00"} 元` },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formatFinancialStats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="text-lg font-medium mt-1">{stat.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
