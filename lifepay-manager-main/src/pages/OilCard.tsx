
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createRechargeOrder } from "@/services/rechargeService";

const OilCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleServiceSelection = async () => {
    if (!user) {
      toast.error("请先登录");
      return;
    }
    
    try {
      const order = await createRechargeOrder({
        userId: user.id,
        phone: user.phone || "",
        amount: 100, // 默认金额
        type: "加油卡充值"
      });
      
      if (order) {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("提交失败，请重试");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">加油卡充值</h1>
      <p className="text-gray-600 mb-8">选择此服务将为您充值加油卡。</p>
      <Button onClick={handleServiceSelection}>立即充值</Button>
    </div>
  );
};

export default OilCard;
