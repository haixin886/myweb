import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminSupabase } from "@/integrations/supabase/client";

// 使用类型断言解决类型错误
const supabaseAny = adminSupabase as any;

interface StatItem {
  title: string;
  value: string | number;
  category: "recharge" | "withdrawal" | "order" | "commission" | "transaction" | "user";
  timeframe: "today" | "yesterday" | "all-time";
}

// 格式化金额的辅助函数
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(value);
};

const StatisticsOverview = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // 获取模拟统计数据的函数
  const getMockStatistics = (): StatItem[] => {
    console.log('生成模拟统计数据...');
    
    return [
      // 充值统计
      { title: '今日充值金额', value: formatCurrency(12580.50), category: 'recharge', timeframe: 'today' },
      { title: '昨日充值金额', value: formatCurrency(9876.20), category: 'recharge', timeframe: 'yesterday' },
      { title: '历史充值总额', value: formatCurrency(1258000.75), category: 'recharge', timeframe: 'all-time' },
      
      // 提现统计
      { title: '今日提现金额', value: formatCurrency(5680.30), category: 'withdrawal', timeframe: 'today' },
      { title: '昨日提现金额', value: formatCurrency(4590.80), category: 'withdrawal', timeframe: 'yesterday' },
      { title: '历史提现总额', value: formatCurrency(568000.25), category: 'withdrawal', timeframe: 'all-time' },
      
      // 佣金统计
      { title: '今日佣金收入', value: formatCurrency(1258.50), category: 'commission', timeframe: 'today' },
      { title: '昨日佣金收入', value: formatCurrency(987.60), category: 'commission', timeframe: 'yesterday' },
      { title: '历史佣金总额', value: formatCurrency(125800.35), category: 'commission', timeframe: 'all-time' },
      
      // 交易统计
      { title: '今日交易金额', value: formatCurrency(25680.70), category: 'transaction', timeframe: 'today' },
      { title: '昨日交易金额', value: formatCurrency(19876.40), category: 'transaction', timeframe: 'yesterday' },
      { title: '历史交易总额', value: formatCurrency(2568000.95), category: 'transaction', timeframe: 'all-time' },
      
      // 用户统计
      { title: '今日新增用户', value: 58, category: 'user', timeframe: 'today' },
      { title: '昨日新增用户', value: 45, category: 'user', timeframe: 'yesterday' },
      { title: '累计用户总数', value: 12580, category: 'user', timeframe: 'all-time' }
    ];
  };
  
  // 使用React Query获取统计数据
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: async () => {
      try {
        console.log('开始获取真实统计数据...');
        
        // 获取今日日期范围
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 获取昨日日期范围
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // 1. 获取充值订单统计
        console.log('获取充值订单统计...');
        const { data: todayRechargeData, error: todayRechargeError } = await supabaseAny
          .from('recharge_orders')
          .select('recharge_amount')
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())
          .eq('status', 'COMPLETED');

        if (todayRechargeError) {
          console.error('获取今日充值数据失败:', todayRechargeError);
          throw todayRechargeError;
        }

        const { data: yesterdayRechargeData, error: yesterdayRechargeError } = await supabaseAny
          .from('recharge_orders')
          .select('recharge_amount')
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
          .eq('status', 'COMPLETED');

        if (yesterdayRechargeError) {
          console.error('获取昨日充值数据失败:', yesterdayRechargeError);
          throw yesterdayRechargeError;
        }

        const { data: allTimeRechargeData, error: allTimeRechargeError } = await supabaseAny
          .from('recharge_orders')
          .select('recharge_amount')
          .eq('status', 'COMPLETED');

        if (allTimeRechargeError) {
          console.error('获取历史充值数据失败:', allTimeRechargeError);
          throw allTimeRechargeError;
        }

        // 2. 获取提现交易统计
        console.log('获取提现交易统计...');
        const { data: todayWithdrawalData, error: todayWithdrawalError } = await supabaseAny
          .from('user_transactions')
          .select('amount')
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())
          .eq('type', 'withdrawal')
          .eq('status', 'COMPLETED');

        if (todayWithdrawalError) {
          console.error('获取今日提现数据失败:', todayWithdrawalError);
          throw todayWithdrawalError;
        }

        const { data: yesterdayWithdrawalData, error: yesterdayWithdrawalError } = await supabaseAny
          .from('user_transactions')
          .select('amount')
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
          .eq('type', 'withdrawal')
          .eq('status', 'COMPLETED');

        if (yesterdayWithdrawalError) {
          console.error('获取昨日提现数据失败:', yesterdayWithdrawalError);
          throw yesterdayWithdrawalError;
        }

        const { data: allTimeWithdrawalData, error: allTimeWithdrawalError } = await supabaseAny
          .from('user_transactions')
          .select('amount')
          .eq('type', 'withdrawal')
          .eq('status', 'COMPLETED');

        if (allTimeWithdrawalError) {
          console.error('获取历史提现数据失败:', allTimeWithdrawalError);
          throw allTimeWithdrawalError;
        }

        // 3. 获取订单数量统计
        console.log('获取订单数量统计...');
        const { count: todayOrderCount, error: todayOrderCountError } = await adminSupabase
          .from('recharge_orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString());

        if (todayOrderCountError) {
          console.error('获取今日订单数量失败:', todayOrderCountError);
          throw todayOrderCountError;
        }

        const { count: yesterdayOrderCount, error: yesterdayOrderCountError } = await adminSupabase
          .from('recharge_orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString());

        if (yesterdayOrderCountError) {
          console.error('获取昨日订单数量失败:', yesterdayOrderCountError);
          throw yesterdayOrderCountError;
        }

        const { count: allTimeOrderCount, error: allTimeOrderCountError } = await adminSupabase
          .from('recharge_orders')
          .select('*', { count: 'exact', head: true });

        if (allTimeOrderCountError) {
          console.error('获取历史订单数量失败:', allTimeOrderCountError);
          throw allTimeOrderCountError;
        }

        // 4. 获取佣金数据
        console.log('获取佣金数据...');
        const { data: todayCommissionData, error: todayCommissionError } = await adminSupabase
          .from('merchant_balance_history')
          .select('amount')
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())
          .eq('type', 'commission');

        if (todayCommissionError) {
          console.error('获取今日佣金数据失败:', todayCommissionError);
          throw todayCommissionError;
        }

        const { data: yesterdayCommissionData, error: yesterdayCommissionError } = await adminSupabase
          .from('merchant_balance_history')
          .select('amount')
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
          .eq('type', 'commission');

        if (yesterdayCommissionError) {
          console.error('获取昨日佣金数据失败:', yesterdayCommissionError);
          throw yesterdayCommissionError;
        }

        const { data: allTimeCommissionData, error: allTimeCommissionError } = await adminSupabase
          .from('merchant_balance_history')
          .select('amount')
          .eq('type', 'commission');

        if (allTimeCommissionError) {
          console.error('获取历史佣金数据失败:', allTimeCommissionError);
          throw allTimeCommissionError;
        }

        // 5. 获取交易数据
        console.log('获取交易数据...');
        const { count: todayTransactionCount, error: todayTransactionCountError } = await adminSupabase
          .from('user_transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString());

        if (todayTransactionCountError) {
          console.error('获取今日交易数量失败:', todayTransactionCountError);
          throw todayTransactionCountError;
        }

        const { count: yesterdayTransactionCount, error: yesterdayTransactionCountError } = await adminSupabase
          .from('user_transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString());

        if (yesterdayTransactionCountError) {
          console.error('获取昨日交易数量失败:', yesterdayTransactionCountError);
          throw yesterdayTransactionCountError;
        }

        const { count: allTimeTransactionCount, error: allTimeTransactionCountError } = await adminSupabase
          .from('user_transactions')
          .select('*', { count: 'exact', head: true });

        if (allTimeTransactionCountError) {
          console.error('获取历史交易数量失败:', allTimeTransactionCountError);
          throw allTimeTransactionCountError;
        }

        // 获取交易金额数据
        const { data: todayTransactionAmountData, error: todayTransactionAmountError } = await adminSupabase
          .from('user_transactions')
          .select('amount')
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())
          .not('type', 'eq', 'withdrawal'); // 排除提现交易

        if (todayTransactionAmountError) {
          console.error('获取今日交易金额失败:', todayTransactionAmountError);
          throw todayTransactionAmountError;
        }

        const { data: yesterdayTransactionAmountData, error: yesterdayTransactionAmountError } = await adminSupabase
          .from('user_transactions')
          .select('amount')
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
          .not('type', 'eq', 'withdrawal'); // 排除提现交易

        if (yesterdayTransactionAmountError) {
          console.error('获取昨日交易金额失败:', yesterdayTransactionAmountError);
          throw yesterdayTransactionAmountError;
        }

        const { data: allTimeTransactionAmountData, error: allTimeTransactionAmountError } = await adminSupabase
          .from('user_transactions')
          .select('amount')
          .not('type', 'eq', 'withdrawal'); // 排除提现交易

        if (allTimeTransactionAmountError) {
          console.error('获取历史交易金额失败:', allTimeTransactionAmountError);
          throw allTimeTransactionAmountError;
        }

        // 6. 获取用户统计数据
        console.log('获取用户统计数据...');
        const { data: userStatsData, error: userStatsError } = await adminSupabase
          .from('stats_user')
          .select('*')
          .order('date', { ascending: false })
          .limit(1);

        if (userStatsError) {
          console.error('获取用户统计数据失败:', userStatsError);
          throw userStatsError;
        }

        // 计算总和的辅助函数
        const calculateSum = (data: { amount?: number, recharge_amount?: number }[] | null) => {
          if (!data || data.length === 0) return 0;
          return data.reduce((sum, item) => {
            const amount = item.amount !== undefined ? Number(item.amount) : 
                          (item.recharge_amount !== undefined ? Number(item.recharge_amount) : 0);
            return sum + amount;
          }, 0);
        };

        // 构建统计数据
        console.log('构建统计数据...');
        const statisticsData: StatItem[] = [
          // 充值相关统计
          {
            title: "今日余额充值（CNY）",
            value: formatCurrency(calculateSum(todayRechargeData)),
            category: "recharge",
            timeframe: "today",
          },
          {
            title: "昨日余额充值（CNY）",
            value: formatCurrency(calculateSum(yesterdayRechargeData)),
            category: "recharge",
            timeframe: "yesterday",
          },
          {
            title: "历史总充值（CNY）",
            value: formatCurrency(calculateSum(allTimeRechargeData)),
            category: "recharge",
            timeframe: "all-time",
          },
          
          // 提现相关统计
          {
            title: "今日提现金额（CNY）",
            value: formatCurrency(calculateSum(todayWithdrawalData)),
            category: "withdrawal",
            timeframe: "today",
          },
          {
            title: "昨日提现金额（CNY）",
            value: formatCurrency(calculateSum(yesterdayWithdrawalData)),
            category: "withdrawal",
            timeframe: "yesterday",
          },
          {
            title: "历史总提现金额（CNY）",
            value: formatCurrency(calculateSum(allTimeWithdrawalData)),
            category: "withdrawal",
            timeframe: "all-time",
          },
          
          // 订单相关统计
          {
            title: "今日订单数量（笔）",
            value: todayOrderCount || 0,
            category: "order",
            timeframe: "today",
          },
          {
            title: "昨日订单数量（笔）",
            value: yesterdayOrderCount || 0,
            category: "order",
            timeframe: "yesterday",
          },
          {
            title: "历史总订单数量（笔）",
            value: allTimeOrderCount || 0,
            category: "order",
            timeframe: "all-time",
          },
          
          // 佣金相关统计
          {
            title: "今日佣金金额（CNY）",
            value: formatCurrency(calculateSum(todayCommissionData)),
            category: "commission",
            timeframe: "today",
          },
          {
            title: "昨日佣金金额（CNY）",
            value: formatCurrency(calculateSum(yesterdayCommissionData)),
            category: "commission",
            timeframe: "yesterday",
          },
          {
            title: "历史总佣金金额（CNY）",
            value: formatCurrency(calculateSum(allTimeCommissionData)),
            category: "commission",
            timeframe: "all-time",
          },
          
          // 交易相关统计
          {
            title: "今日交易数量（笔）",
            value: todayTransactionCount || 0,
            category: "transaction",
            timeframe: "today",
          },
          {
            title: "昨日交易数量（笔）",
            value: yesterdayTransactionCount || 0,
            category: "transaction",
            timeframe: "yesterday",
          },
          {
            title: "历史总交易数量（笔）",
            value: allTimeTransactionCount || 0,
            category: "transaction",
            timeframe: "all-time",
          },
          {
            title: "今日交易金额（CNY）",
            value: formatCurrency(calculateSum(todayTransactionAmountData)),
            category: "transaction",
            timeframe: "today",
          },
          {
            title: "昨日交易金额（CNY）",
            value: formatCurrency(calculateSum(yesterdayTransactionAmountData)),
            category: "transaction",
            timeframe: "yesterday",
          },
          {
            title: "历史总交易金额（CNY）",
            value: formatCurrency(calculateSum(allTimeTransactionAmountData)),
            category: "transaction",
            timeframe: "all-time",
          },
          
          // 用户相关统计
          {
            title: "总用户数",
            value: userStatsData && userStatsData.length > 0 ? userStatsData[0].total_users : 0,
            category: "user",
            timeframe: "all-time",
          },
          {
            title: "今日新增用户",
            value: userStatsData && userStatsData.length > 0 ? userStatsData[0].new_users_today : 0,
            category: "user",
            timeframe: "today",
          },
          {
            title: "昨日新增用户",
            value: userStatsData && userStatsData.length > 0 ? userStatsData[0].new_users_yesterday : 0,
            category: "user",
            timeframe: "yesterday",
          },
          {
            title: "总商户数",
            value: userStatsData && userStatsData.length > 0 ? userStatsData[0].total_merchants : 0,
            category: "user",
            timeframe: "all-time",
          },
          {
            title: "今日新增商户",
            value: userStatsData && userStatsData.length > 0 ? userStatsData[0].new_merchants_today : 0,
            category: "user",
            timeframe: "today",
          },
          {
            title: "昨日新增商户",
            value: userStatsData && userStatsData.length > 0 ? userStatsData[0].new_merchants_yesterday : 0,
            category: "user",
            timeframe: "yesterday",
          },
        ];

        console.log('统计数据获取成功:', statisticsData);
        return statisticsData;
      } catch (error) {
        console.error('获取统计数据失败:', error);
        toast.error('获取统计数据失败，使用模拟数据');
        
        // 如果获取真实数据失败，返回模拟数据
        console.log('使用模拟数据...');
        return getMockStatistics();
      }
    },
    refetchInterval: 60000, // 每分钟自动刷新一次
  });

  // 手动刷新数据
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("数据已刷新");
    } catch (error) {
      toast.error("刷新数据失败，请稍后重试");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 根据类别筛选数据
  const filteredStats = stats?.filter(item => 
    activeTab === "all" || item.category === activeTab
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">统计概览</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新数据
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="recharge">充值</TabsTrigger>
          <TabsTrigger value="withdrawal">提现</TabsTrigger>
          <TabsTrigger value="order">订单</TabsTrigger>
          <TabsTrigger value="commission">佣金</TabsTrigger>
          <TabsTrigger value="transaction">交易</TabsTrigger>
          <TabsTrigger value="user">用户</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStats?.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-sm text-gray-500 mb-1">{item.title}</h3>
                  <p className="text-2xl font-bold">{item.value}</p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsOverview;
