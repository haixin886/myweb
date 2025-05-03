import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateTransactionStatus } from "@/services/rechargeService";

// 订单状态映射
const orderStatusMap = {
  pending: { label: "待支付", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "处理中", color: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-800" },
  failed: { label: "失败", color: "bg-red-100 text-red-800" },
};

// 订单详情对话框
const OrderDetailDialog = ({ order }) => {
  if (!order) return null;
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>订单详情</DialogTitle>
        <DialogDescription>
          订单ID: {order.id.slice(0, 8)}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">用户ID</p>
            <p>{order.user_id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">金额</p>
            <p>{order.amount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">USDT金额</p>
            <p>{order.usdt_amount} USDT</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">类型</p>
            <p>{order.type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">状态</p>
            <Badge className={orderStatusMap[order.status]?.color}>
              {orderStatusMap[order.status]?.label || order.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">创建时间</p>
            <p>{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>
        
        {order.name && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">姓名</p>
            <p className="break-all">{order.name}</p>
          </div>
        )}
        
        {order.phone_number && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">电话</p>
            <p className="break-all">{order.phone_number}</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

const RechargeOrdersPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 获取充值订单列表
  const { data: orders = [], refetch } = useQuery({
    queryKey: ['recharge-orders', statusFilter],
    queryFn: async () => {
      try {
        let query = supabase
          .from('orders')
          .select('*')
          .eq('type', 'recharge')
          .order('created_at', { ascending: false });
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching recharge orders:', error);
        toast.error("加载充值订单失败");
        return [];
      }
    }
  });

  // 刷新订单列表
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // 处理订单状态更新
  const handleStatusUpdate = async (orderId, newStatus) => {
    setIsProcessing(true);
    try {
      await updateTransactionStatus(orderId, newStatus);
      toast.success(`订单状态已更新为${orderStatusMap[newStatus]?.label || newStatus}`);
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("更新订单状态失败");
    } finally {
      setIsProcessing(false);
    }
  };

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id?.toLowerCase().includes(searchLower) ||
      order.user_id?.toLowerCase().includes(searchLower) ||
      order.name?.toLowerCase().includes(searchLower) ||
      order.phone_number?.toLowerCase().includes(searchLower)
    );
  });

  // 查看订单详情
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>充值订单</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单号、用户..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === 'all' ? '全部状态' : orderStatusMap[statusFilter]?.label || statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  全部状态
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  待支付
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                  处理中
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  已完成
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                  已取消
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                  失败
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单ID</TableHead>
                  <TableHead>用户信息</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isRefreshing ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">加载中...</TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">暂无订单数据</TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {order.name || order.user_id?.slice(0, 8)}
                        {order.phone_number && (
                          <div className="text-xs text-gray-500">{order.phone_number}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.amount}
                        {order.usdt_amount && (
                          <div className="text-xs text-gray-500">{order.usdt_amount} USDT</div>
                        )}
                      </TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>
                        <Badge className={orderStatusMap[order.status]?.color}>
                          {orderStatusMap[order.status]?.label || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          
                          {order.status === 'processing' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              disabled={isProcessing}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <OrderDetailDialog order={selectedOrder} />
      </Dialog>
    </div>
  );
};

export default RechargeOrdersPage;
