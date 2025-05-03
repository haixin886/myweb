
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { OrderHeader } from "@/components/order/OrderHeader";
import { OrderStatus } from "@/components/order/OrderStatus";
import { OrderNotice } from "@/components/order/OrderNotice";
import { OrderInfo } from "@/components/order/OrderInfo";
import { PaymentInfo } from "@/components/order/PaymentInfo";
import { OrderActions } from "@/components/order/OrderActions";

interface Order {
  id: string;
  type: string;
  amount: number;
  phoneNumber: string;
  status: string;
  createTime: string;
}

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderStatus, setOrderStatus] = useState("待充值");
  const [showConfirmButtons, setShowConfirmButtons] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const currentOrder = savedOrders.find((order: Order) => order.id === id);
    if (currentOrder) {
      setOrder(currentOrder);
      setOrderStatus(currentOrder.status === "completed" ? "支付成功" : "待充值");
      setShowConfirmButtons(currentOrder.status === "pending");
    }
  }, [id]);

  const handleDelete = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.filter((order: Order) => order.id !== id);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("订单已删除");
    navigate(-1);
  };

  const handleConfirm = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.map((order: Order) => 
      order.id === id ? {...order, status: "completed"} : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrderStatus("支付成功");
    setShowConfirmButtons(false);
    toast.success("订单已确认");
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success("凭证上传成功");
        setOrderStatus("支付成功");
      }
    };
    input.click();
  };

  const handleCustomerService = () => {
    window.open('https://example.com/customer-service', '_blank');
  };

  const handleContinueTopup = () => {
    navigate('/dashboard');
  };

  if (!order) {
    return <div className="p-4 text-center">订单不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <OrderHeader />
      <OrderStatus 
        type={order.type}
        id={order.id}
        createTime={order.createTime}
        status={orderStatus}
      />
      <OrderNotice />
      <OrderInfo 
        type={order.type}
        phoneNumber={order.phoneNumber}
      />
      <PaymentInfo 
        type={order.type}
        amount={order.amount}
      />
      <OrderActions 
        showConfirmButtons={showConfirmButtons}
        onCancel={() => navigate(-1)}
        onConfirm={handleConfirm}
        onDelete={handleDelete}
        onUpload={handleUpload}
        onCustomerService={handleCustomerService}
        onContinueTopup={handleContinueTopup}
      />
    </div>
  );
};

export default OrderDetail;
