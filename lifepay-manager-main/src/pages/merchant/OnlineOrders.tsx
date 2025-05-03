
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/merchant/orders/Header";
import { MerchantStatus } from "@/components/merchant/orders/MerchantStatus";
import { SearchAndFilter } from "@/components/merchant/orders/SearchAndFilter";
import { OrderList } from "@/components/merchant/orders/OrderList";

interface Order {
  id: string;
  type: string;
  amount: number;
  phone_number: string;
  status: string;
  created_at: string;
}

const OnlineOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  // 初始化获取商家在线状态
  useEffect(() => {
    const fetchMerchantStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("请先登录");
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('online_status')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching merchant status:', error);
          return;
        }

        console.log("Merchant status:", data?.online_status);
        // Use nullish coalescing operator to provide a default value
        setIsOnline(data?.online_status ?? false);
      } catch (error) {
        console.error('Error in fetchMerchantStatus:', error);
      }
    };

    fetchMerchantStatus();
  }, [navigate]);

  // 获取订单数据
  const { data: orders = [], isError, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    retry: 1,
  });

  const handleStatusChange = async (value: boolean) => {
    setIsOnline(value);
    const { error } = await supabase.rpc('update_online_status', {
      p_online: value
    });
    
    if (error) {
      console.error('Error updating online status:', error);
      toast.error('更新状态失败');
      return;
    }
    
    toast.success(value ? '已开启接单' : '已暂停接单');
  };

  const filteredOrders = orders.filter(order => {
    if (selectedStatus !== "all" && order.status !== selectedStatus) return false;
    if (searchQuery) {
      return order.phone_number.includes(searchQuery) || 
             order.id.includes(searchQuery);
    }
    return true;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">加载失败，请刷新重试</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <MerchantStatus 
          isOnline={isOnline}
          onStatusChange={handleStatusChange}
        />
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>

      <div className="p-4">
        <OrderList orders={filteredOrders} />
      </div>
    </div>
  );
};

export default OnlineOrders;
