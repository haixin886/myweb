
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createRechargeOrder } from "@/services/rechargeService";

const NetEaseGame = () => {
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
        type: "网易游戏充值"
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
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-4">网易游戏充值</h2>
        <p className="text-gray-600 text-center mb-6">选择充值服务，快速到账！</p>
        <Button className="w-full" onClick={handleServiceSelection}>
          立即充值
        </Button>
      </Card>
    </div>
  );
};

export default NetEaseGame;
