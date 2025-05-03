import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Edit, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createRechargeOrder } from "@/services/rechargeService";

const CreditCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [cardInfo, setCardInfo] = useState("");
  const [name, setName] = useState("");
  const [actualAmount, setActualAmount] = useState("100");
  const [exchangeRate, setExchangeRate] = useState(7.5);
  const [totalUSDT, setTotalUSDT] = useState(0);

  // 预设金额选项
  const quickAmounts = ["10000", "20000"];

  // 当选择金额或实际金额变化时，计算USDT总额
  useEffect(() => {
    const amount = parseFloat(actualAmount) || 0;
    const usdt = amount / exchangeRate;
    setTotalUSDT(usdt);
  }, [actualAmount, exchangeRate]);

  // 处理快速选择金额
  const handleQuickAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
  };

  // 处理提交
  const handleSubmit = async () => {
    if (!user) {
      toast.error("请先登录");
      return;
    }

    if (!actualAmount || parseFloat(actualAmount) <= 0) {
      toast.error("请输入有效金额");
      return;
    }

    if (!cardInfo) {
      toast.error("请输入卡号与银行信息");
      return;
    }

    if (!name) {
      toast.error("请输入姓名");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createRechargeOrder({
        userId: user.id,
        phone: user.phone || "",
        amount: parseFloat(actualAmount),
        type: "信用卡还款",
        exchangeRate: exchangeRate,
        usdtAmount: totalUSDT,
      });

      if (order) {
        toast.success("提交成功");
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
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6 text-white" />
          </Button>
        </div>
        <div className="text-blue-500">
          <a href="#" className="text-sm">
            充值操作教程
          </a>
        </div>
      </div>

      {/* 快速选择金额 */}
      <div className="px-4 mb-6">
        <div className="text-gray-400 mb-2">快速选择</div>
        <div className="flex gap-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              className={`flex-1 py-4 px-2 rounded border ${
                selectedAmount === amount ? "border-blue-500" : "border-gray-700"
              } bg-gray-900`}
              onClick={() => handleQuickAmountSelect(amount)}
            >
              <div className="text-xl text-center">{amount}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 表单字段 */}
      <div className="px-4 space-y-4">
        {/* 卡号与银行信息 */}
        <div className="border-b border-gray-800 py-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">卡号与银行信息包含支行</div>
            <Input
              className="bg-transparent border-none text-right text-white placeholder-gray-600 focus:outline-none focus:ring-0"
              placeholder="请输入卡号与银行信息包含支行"
              value={cardInfo}
              onChange={(e) => setCardInfo(e.target.value)}
            />
          </div>
        </div>

        {/* 姓名 */}
        <div className="border-b border-gray-800 py-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">姓名</div>
            <Input
              className="bg-transparent border-none text-right text-white placeholder-gray-600 focus:outline-none focus:ring-0"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 实充金额 */}
        <div className="border-b border-gray-800 py-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">实充金额</div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">¥</span>
              <Input
                className="bg-transparent border-none text-right text-white placeholder-gray-600 focus:outline-none focus:ring-0 w-24"
                value={actualAmount}
                onChange={(e) => setActualAmount(e.target.value)}
              />
              <Edit className="h-5 w-5 text-gray-400 ml-2" />
            </div>
          </div>
        </div>

        {/* 折扣信息 */}
        <div className="py-4 flex items-center">
          <div className="bg-red-900/30 text-red-500 px-2 py-1 rounded text-sm mr-2">
            折扣0
          </div>
          <div className="text-red-500 text-sm">优惠-0元</div>
        </div>

        {/* 汇率信息 */}
        <div className="py-4 flex items-center text-gray-400">
          <Info className="h-4 w-4 mr-2" />
          <div className="text-sm">参考汇率 {exchangeRate}</div>
        </div>

        {/* 总计 */}
        <div className="py-4 flex justify-between items-center">
          <div className="text-gray-400">合计:</div>
          <div className="text-red-500 text-xl">${totalUSDT.toFixed(2)} USDT</div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="px-4 fixed bottom-6 w-full">
        <Button
          className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "处理中..." : "确认充值"}
        </Button>
      </div>
    </div>
  );
};

export default CreditCard;
