
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import OrderSearch from "@/components/orders/OrderSearch";
import OrdersList from "@/components/orders/OrdersList";
import OrdersHeader from "@/components/orders/OrdersHeader";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedStatus, setSelectedStatus] = useState("全部");

  const categories = [
    "全部",
    "代还信用卡",
    "抖币充值",
    "快币充值",
    "花呗代还",
    "京东小时达"
  ];

  const statusTypes = ["全部", "待充值", "充值中", "已完成", "已取消"];

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(orders || []);
    };

    fetchOrders();

    const fetchOnlineStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('online_status')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching online status:', error);
        return;
      }

      setIsOnline(data?.online_status || false);
    };

    fetchOnlineStatus();
  }, []);

  const handleOnlineStatusChange = async (checked: boolean) => {
    try {
      const { error } = await supabase.rpc('update_online_status', {
        p_online: checked
      });

      if (error) {
        console.error('Error updating online status:', error);
        toast.error('更新状态失败');
        return;
      }

      setIsOnline(checked);
      toast.success(checked ? '已设置为在线' : '已设置为离线');
    } catch (error) {
      console.error('Error:', error);
      toast.error('更新状态失败');
    }
  };

  const filteredOrders = orders.filter(order => {
    let matchesCategory = true;
    let matchesStatus = true;
    let matchesSearch = true;

    if (selectedCategory !== "全部") {
      matchesCategory = order.type === selectedCategory;
    }

    if (selectedStatus !== "全部") {
      const statusMap = {
        "待充值": "pending",
        "充值中": "processing",
        "已完成": "completed",
        "已取消": "cancelled"
      };
      matchesStatus = order.status === statusMap[selectedStatus];
    }

    if (searchQuery) {
      matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white">
        <OrdersHeader title="在线订单" />
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">在线状态:</span>
            <Switch
              checked={isOnline}
              onCheckedChange={handleOnlineStatusChange}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
            />
            <span className={`text-sm font-medium ${isOnline ? "text-green-500" : "text-gray-500"}`}>
              {isOnline ? "在线" : "离线"}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {isOnline ? "在线中" : "已离线"}
          </div>
        </div>
        
        <div className="overflow-x-auto bg-white">
          <div className="flex gap-2 px-4 py-2 whitespace-nowrap bg-white">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`min-w-fit ${selectedCategory === category ? 'bg-[#3182f6] hover:bg-[#3182f6]/90 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex border-b overflow-x-auto bg-white">
          {statusTypes.map((status) => (
            <button
              key={status}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedStatus === status
                  ? "text-[#3182f6] border-b-2 border-[#3182f6] bg-white"
                  : "text-gray-600 bg-white"
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <OrderSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="px-4 py-3">
        <OrdersList 
          orders={filteredOrders}
          searchQuery={searchQuery}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;
