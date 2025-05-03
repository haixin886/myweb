
import { useState, useEffect } from "react";
import { AdminLayout } from "../layout/AdminLayout";
import { SearchToolbar } from "../components/SearchToolbar";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  amount: number;
  usdt_amount: number;
  status: string | null;
  type: string;
  phone_number: string | null;
  created_at: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error("加载订单数据失败");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">待处理</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">处理中</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">已完成</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">已取消</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.phone_number?.includes(searchTerm) ||
    order.id.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">订单管理</h1>
        </div>

        <SearchToolbar
          placeholder="搜索订单号/手机号..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => {}}
          onReset={() => setSearchTerm("")}
        />

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单编号</TableHead>
                <TableHead>订单类型</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>充值金额</TableHead>
                <TableHead>USDT金额</TableHead>
                <TableHead>订单状态</TableHead>
                <TableHead>创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    暂无订单数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.phone_number || '-'}</TableCell>
                    <TableCell>¥{order.amount.toFixed(2)}</TableCell>
                    <TableCell>${order.usdt_amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
