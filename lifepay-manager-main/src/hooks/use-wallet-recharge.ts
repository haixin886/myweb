
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { createRechargeOrder, getPaymentAddresses } from "@/services/rechargeService";
import { useAuth } from "./useAuth"; // Fixed import path

interface PaymentAddress {
  id: string;
  address: string;
  type: string;
  is_active: boolean;
  [key: string]: any;
}

export const useWalletRecharge = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<PaymentAddress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch recharge addresses list from platform_payment_addresses table
  const { data: addresses = [], isLoading: isLoadingAddresses, refetch } = useQuery({
    queryKey: ['payment-addresses', retryCount],
    queryFn: getPaymentAddresses,
    retry: 2,
    staleTime: 60000 // 1 minute
  });

  const refreshAddresses = useCallback(() => {
    setRetryCount(prev => prev + 1);
    refetch();
  }, [refetch]);

  // Auto-select the first address when addresses load
  useEffect(() => {
    if (addresses && Array.isArray(addresses) && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const handleRecharge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("请输入有效的充值金额");
      return;
    }

    if (parseFloat(amount) < 10) {
      toast.error("最小充值金额为 10 USDT");
      return;
    }

    if (!selectedAddress) {
      toast.error("请选择充值地址");
      return;
    }
    
    if (!user) {
      toast.error("请先登录");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 最多尝试3次
      let retries = 0;
      let order = null;
      let lastError = null;
      
      while (retries < 3 && !order) {
        try {
          // 打印详细的请求参数
          console.log('尝试创建充值订单，参数：', {
            userId: user.id,
            amount: parseFloat(amount),
            phone: user.phone || "",
            type: "USDT充值",
            address: selectedAddress.address
          });
          
          // 简化请求，只使用必要的字段
          order = await createRechargeOrder({
            userId: user.id,
            amount: parseFloat(amount),
            phone: user.phone || "",
            type: "USDT充值"
          });
          
          if (order) {
            setCurrentOrder(order);
            setOrderDialogOpen(true);
            return; // 成功创建订单，退出函数
          }
        } catch (error) {
          console.error(`Recharge attempt ${retries + 1} failed:`, error);
          lastError = error;
          retries++;
          
          // 如果不是最后一次尝试，等待一秒后重试
          if (retries < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // 如果所有尝试都失败
      throw lastError || new Error("创建订单失败");
    } catch (error) {
      console.error('All recharge attempts failed:', error);
      toast.error("创建充值订单失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    amount,
    setAmount,
    selectedAddress,
    setSelectedAddress,
    isSubmitting,
    orderDialogOpen,
    setOrderDialogOpen,
    currentOrder,
    addresses,
    isLoadingAddresses,
    handleRecharge,
    refreshAddresses
  };
};
