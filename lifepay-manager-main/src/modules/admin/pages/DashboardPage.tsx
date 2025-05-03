
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout/AdminLayout";
import { StatCard } from "../components/StatCard";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, CreditCard, ShoppingBag, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  dailyData: {
    date: string;
    orders: number;
    revenue: number;
  }[];
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    dailyData: [],
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 获取用户总数
        const { count: usersCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact' });

        // 获取订单数据
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersError) throw ordersError;

        // 计算统计数据
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + order.amount, 0) || 0;

        // 处理每日数据
        const dailyData = processOrdersByDate(orders || []);

        setStats({
          totalUsers: usersCount || 0,
          totalRevenue,
          totalOrders,
          dailyData,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        toast.error("加载数据失败");
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="总用户数"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="总收入"
            value={`¥${stats.totalRevenue.toFixed(2)}`}
            icon={<CreditCard className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="总订单数"
            value={stats.totalOrders}
            icon={<ShoppingBag className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="转化率"
            value="32.5%"
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">收入趋势</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="收入"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  name="订单数"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

// 处理订单按日期分组
const processOrdersByDate = (orders: any[]) => {
  const dailyMap = new Map();
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // 初始化30天的数据
  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyMap.set(dateStr, { date: dateStr, orders: 0, revenue: 0 });
  }

  // 聚合订单数据
  orders.forEach(order => {
    const dateStr = new Date(order.created_at).toISOString().split('T')[0];
    if (dailyMap.has(dateStr)) {
      const dayData = dailyMap.get(dateStr);
      dayData.orders += 1;
      dayData.revenue += order.amount;
    }
  });

  return Array.from(dailyMap.values());
};

export default DashboardPage;
