
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
import { Search, Phone, Loader2 } from "lucide-react";
import { PhoneInquiryModal } from "./components/PhoneInquiryModal";
import { inquirePhoneInfo } from "@/services/phoneInquiryService";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Order {
  id: string;
  type: string;
  amount: number;
  phoneNumber: string;
  status: string;
  createTime: string;
  usdtAmount?: number;
  // 添加手机号码信息字段
  phoneInfo?: {
    province?: string;
    city?: string;
    curFee?: number;
    sp?: string;
  };
  isLoadingPhoneInfo?: boolean;
  phoneInfoError?: string;
}

const BusinessOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 手机号码余额查询模态框状态
  const [isPhoneInquiryOpen, setIsPhoneInquiryOpen] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // 只过滤缴费类订单（话费、电费、油卡等）
    const paymentOrders = savedOrders.filter((order: Order) => 
      order.type.includes("话费") || 
      order.type.includes("电费") || 
      order.type.includes("油卡")
    );
    setOrders(paymentOrders);
    
    // 自动查询所有订单的手机号码信息
    paymentOrders.forEach(order => {
      if (order.phoneNumber && order.phoneNumber.length === 11) {
        fetchPhoneInfo(order.id, order.phoneNumber);
      }
    });
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

  // 查询手机号码信息并更新订单数据
  const fetchPhoneInfo = async (orderId: string, phoneNumber: string) => {
    // 更新订单的加载状态
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, isLoadingPhoneInfo: true, phoneInfoError: undefined };
      }
      return order;
    }));
    
    try {
      const phoneInfo = await inquirePhoneInfo(phoneNumber);
      
      // 更新订单的手机号码信息
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            isLoadingPhoneInfo: false, 
            phoneInfo: phoneInfo ? {
              province: phoneInfo.province,
              city: phoneInfo.city,
              curFee: phoneInfo.curFee,
              sp: phoneInfo.sp
            } : undefined
          };
        }
        return order;
      }));
    } catch (error) {
      console.error(`查询手机号码 ${phoneNumber} 信息出错:`, error);
      
      // 更新订单的错误状态
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            isLoadingPhoneInfo: false, 
            phoneInfoError: '查询失败' 
          };
        }
        return order;
      }));
    }
  };
  
  // 打开手机号码余额查询模态框
  const handleOpenPhoneInquiry = (phoneNumber: string) => {
    setCurrentPhoneNumber(phoneNumber);
    setIsPhoneInquiryOpen(true);
  };

  // 关闭手机号码余额查询模态框
  const handleClosePhoneInquiry = () => {
    setIsPhoneInquiryOpen(false);
  };
  
  const filteredOrders = orders.filter(order => 
    order.phoneNumber.includes(searchTerm) || 
    order.id.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">缴费业务订单</h1>
        <Button 
          variant="outline" 
          onClick={() => handleOpenPhoneInquiry("")}
        >
          <Phone className="mr-2 h-4 w-4" />
          手机号码余额查询
        </Button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="请输入手机号/订单号搜索" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 max-w-xs w-full"
            />
          </div>
          <Button variant="outline" onClick={() => setSearchTerm("")}>重置</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单编号</TableHead>
              <TableHead>订单类型</TableHead>
              <TableHead>手机号码</TableHead>
              <TableHead>归属地</TableHead>
              <TableHead>余额/查询</TableHead>
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
                <TableCell>
                  <span>{order.phoneNumber}</span>
                </TableCell>
                <TableCell>
                  {order.isLoadingPhoneInfo ? (
                    <div className="flex items-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-gray-400" />
                      <span className="text-xs text-gray-500">加载中...</span>
                    </div>
                  ) : order.phoneInfoError ? (
                    <span className="text-xs text-red-500">{order.phoneInfoError}</span>
                  ) : order.phoneInfo ? (
                    <div className="text-xs">
                      <span>{order.phoneInfo.province} {order.phoneInfo.city}</span>
                      {order.phoneInfo.sp && (
                        <Badge variant="outline" className="ml-1 text-xs">{order.phoneInfo.sp}</Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">未知</span>
                  )}
                </TableCell>
                <TableCell>
                  {order.isLoadingPhoneInfo ? (
                    <div className="flex items-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-gray-400" />
                    </div>
                  ) : order.phoneInfo?.curFee !== undefined ? (
                    <span className="font-medium text-green-600">¥{order.phoneInfo.curFee}</span>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs" 
                      onClick={() => fetchPhoneInfo(order.id, order.phoneNumber)}
                    >
                      <Phone className="h-3 w-3 mr-1 text-blue-500" />
                      查询
                    </Button>
                  )}
                </TableCell>
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
      
      {/* 手机号码余额查询模态框 */}
      <PhoneInquiryModal
        isOpen={isPhoneInquiryOpen}
        onClose={handleClosePhoneInquiry}
        initialPhoneNumber={currentPhoneNumber}
      />
    </div>
  );
};

export default BusinessOrdersPage;
