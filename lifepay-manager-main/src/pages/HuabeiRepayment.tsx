import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createRechargeOrder } from "@/services/rechargeService";

const HuabeiRepayment = () => {
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
        type: "花呗还款"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">花呗还款</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">还款金额</Label>
            <Input
              type="number"
              id="amount"
              placeholder="请输入还款金额"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : "立即还款"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HuabeiRepayment;
