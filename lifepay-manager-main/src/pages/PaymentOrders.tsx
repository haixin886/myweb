
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import CategoryFilter from "@/components/payment-orders/CategoryFilter";
import StatusTabs from "@/components/payment-orders/StatusTabs";
import OrderCard from "@/components/payment-orders/OrderCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  type: string;
  amount: number;
  phoneNumber: string;
  status: string;
  createTime: string;
  discount?: string;
  exchangeRate?: number;
  usdtAmount?: number;
}

const orderTypes = {
  phone: ['普通话费', '无骚扰话费'],
  utility: ['电费缴费', '水费缴费', '燃气费缴费'],
  oil: ['石化加油卡'],
  all: [
    '普通话费', '无骚扰话费', '电费缴费', '水费缴费',
    '燃气费缴费', '石化加油卡'
  ]
};

const PaymentOrders = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setOrders([]);
          return;
        }
        
        // 获取用户的订单
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // 转换数据格式为组件所需格式
        const formattedOrders: Order[] = data.map(order => ({
          id: order.id,
          type: order.type,
          amount: order.amount,
          phoneNumber: order.phone_number || '',
          status: order.status,
          createTime: new Date(order.created_at).toLocaleString(),
          usdtAmount: order.usdt_amount
        }));
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error('加载订单失败:', error);
        toast.error('加载订单失败，请稍后重试');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    // 按分类过滤
    if (selectedCategory !== 'all' && !orderTypes[selectedCategory].includes(order.type)) {
      return false;
    }
    // 按状态过滤
    if (selectedTab !== "all" && selectedTab !== order.status) {
      return false;
    }
    // 按搜索过滤
    if (searchQuery) {
      return order.phoneNumber.includes(searchQuery) || order.id.includes(searchQuery);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="text-lg font-medium">缴费订单</div>
        </div>

        <CategoryFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="px-4 pb-2">
          <div className="relative">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-16" 
              placeholder="请输入卡号/订单号搜索"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500">
              搜索
            </button>
          </div>
        </div>

        <StatusTabs 
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      <div className="px-4 py-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                暂无订单数据
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default PaymentOrders;
