import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createRechargeOrder } from "@/services/rechargeService";

const DouYinCoin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("请先登录");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("请输入有效金额");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const order = await createRechargeOrder({
        userId: user.id,
        phone: user.phone || "",
        amount: parseFloat(amount),
        type: "抖音充值"
      });
      
      if (order) {
        setAmount("");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">抖音币充值</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">充值金额</Label>
            <Input
              id="amount"
              type="number"
              placeholder="请输入充值金额"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "提交中..." : "立即充值"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DouYinCoin;
