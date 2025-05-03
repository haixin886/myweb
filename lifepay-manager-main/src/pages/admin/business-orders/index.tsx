
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Order {
  id: string;
  type: string;
  amount: number;
  phoneNumber: string;
  status: string;
  createTime: string;
  usdtAmount?: number;
}

const BusinessOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // 只过滤缴费类订单（话费、电费、油卡等）
    const paymentOrders = savedOrders.filter((order: Order) => 
      order.type.includes("话费") || 
      order.type.includes("电费") || 
      order.type.includes("油卡")
    );
    setOrders(paymentOrders);
  }, []);

  const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.map((order: Order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: action === "accept" ? "processing" : "cancelled"
        };
      }
      return order;
    });
    
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    const updatedPaymentOrders = updatedOrders.filter((order: Order) => 
      order.type.includes("话费") || 
      order.type.includes("电费") || 
      order.type.includes("油卡")
    );
    setOrders(updatedPaymentOrders);
    
    toast.success(action === "accept" ? "订单已受理" : "订单已拒绝");
  };

  const filteredOrders = orders.filter(order => 
    order.phoneNumber.includes(searchTerm) || 
    order.id.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">缴费业务订单</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-4 mb-6">
          <Input 
            placeholder="请输入手机号/订单号搜索" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setSearchTerm("")}>重置</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单编号</TableHead>
              <TableHead>订单类型</TableHead>
              <TableHead>手机号码</TableHead>
              <TableHead>充值金额</TableHead>
              <TableHead>支付金额(U)</TableHead>
              <TableHead>订单状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>¥{order.amount.toFixed(2)}</TableCell>
                <TableCell>${order.usdtAmount?.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={
                    order.status === "pending" ? "text-yellow-500" :
                    order.status === "processing" ? "text-blue-500" :
                    order.status === "completed" ? "text-green-500" :
                    "text-red-500"
                  }>
                    {order.status === "pending" ? "待处理" :
                     order.status === "processing" ? "处理中" :
                     order.status === "completed" ? "已完成" :
                     "已取消"}
                  </span>
                </TableCell>
                <TableCell>{new Date(order.createTime).toLocaleString()}</TableCell>
                <TableCell>
                  {order.status === "pending" && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleOrderAction(order.id, "accept")}
                      >
                        受理
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOrderAction(order.id, "reject")}
                      >
                        拒绝
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BusinessOrdersPage;
