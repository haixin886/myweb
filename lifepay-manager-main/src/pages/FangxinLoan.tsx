
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { createRechargeOrder } from "@/services/rechargeService";

const FangxinLoan = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth hook
  const [account, setAccount] = useState("");
  const [phone, setPhone] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  
  const quickAmounts = ["1000", "3000", "5000", "10000"];
  
  const handleQuickAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
  };
  
  const handleSubmit = async () => {
    if (!account) {
      toast.error("请输入抖音账号");
      return;
    }
    if (!phone) {
      toast.error("请输入手机号");
      return;
    }
    if (!customAmount || parseFloat(customAmount) <= 0) {
      toast.error("请输入有效金额");
      return;
    }
    
    if (!user) {
      toast.error("请先登录");
      return;
    }
    
    try {
      const result = await createRechargeOrder({
        userId: user.id,
        phone: user.phone || "",
        amount: parseFloat(customAmount),
        type: "放心借"
      });
      
      if (result) {
        navigate("/payment/orders");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("提交失败，请重试");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-base font-medium">
            抖音放心借
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4 pt-20 space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-500">
            抖音放心借还款，快速安全便捷
          </div>
        </div>

        <div className="space-y-4 bg-blue-100 rounded-xl p-4">
          <div>
            <div className="text-gray-600 mb-2">抖音账号</div>
            <Input
              placeholder="请输入抖音账号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="bg-white"
            />
          </div>
          
          <div>
            <div className="text-gray-600 mb-2">手机号</div>
            <Input
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <div className="text-gray-600 mb-2">快速选择</div>
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className={`py-3 rounded-lg border ${
                  selectedAmount === amount
                    ? "border-blue-500 bg-blue-50 text-blue-500"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => handleQuickAmountSelect(amount)}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">还款金额</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">¥</span>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-24 text-right outline-none bg-transparent"
                placeholder="输入金额"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded">折扣</span>
            <span className="text-gray-500 ml-2">优惠 {(parseFloat(customAmount || "0") * 0.1).toFixed(2)}元</span>
          </div>
          <span className="text-gray-500">参考汇率: 7.5</span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span>合计:</span>
          <span className="text-orange-500">$ {((parseFloat(customAmount || "0") * 0.9) / 7.5).toFixed(2)} USDT</span>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium mt-6"
        >
          确认还款
        </Button>
      </div>
    </div>
  );
};

export default FangxinLoan;
