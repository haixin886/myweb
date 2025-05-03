import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TutorialDialog } from "@/components/product/TutorialDialog";

const Utilities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("100");
  const [usdtAmount, setUsdtAmount] = useState<string>("0");
  const [meterNumber, setMeterNumber] = useState(""); 
  const [companyName, setCompanyName] = useState(""); 
  const [city, setCity] = useState("北京");
  const [userBalance, setUserBalance] = useState<number>(location.state?.userBalance || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageTitle, setPageTitle] = useState("电费充值");
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  
  const EXCHANGE_RATE = 7.15;
  const quickAmounts = ["500", "1000", "10000", "20000", "100000"];

  useEffect(() => {
    if (location.state && location.state.serviceTitle) {
      setPageTitle(location.state.serviceTitle);
    }
    
    if (!location.state?.userBalance) {
      const fetchUserBalance = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('balance')
            .eq('id', session.user.id)
            .single();

          if (!error && profile) {
            setUserBalance(profile.balance || 0);
          }
        }
      };
      
      fetchUserBalance();
    }
  }, [navigate, location.state]);

  const calculateUSDT = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      const usdt = (numAmount / EXCHANGE_RATE).toFixed(2);
      setUsdtAmount(usdt);
    } else {
      setUsdtAmount("0");
    }
  };

  const handleQuickSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
    calculateUSDT(amount);
  };

  useEffect(() => {
    calculateUSDT(customAmount);
  }, [customAmount]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!meterNumber) {
        toast.error("请输入缴费户号");
        setIsSubmitting(false);
        return;
      }

      if (!companyName) {
        toast.error("请输入缴费单位");
        setIsSubmitting(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("请先登录");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }

      const amount = parseFloat(customAmount);
      
      if (amount > userBalance) {
        toast.error("余额不足，请先充值");
        setIsSubmitting(false);
        return;
      }

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          type: pageTitle,
          amount: amount,
          usdt_amount: parseFloat(usdtAmount),
          phone_number: meterNumber,
          name: companyName,
          status: "pending"
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          type: '充值',
          amount: -amount,
          balance: userBalance - amount,
          user_id: session.user.id,
          order_id: order.id,
          description: `${pageTitle} ${companyName}`
        });

      if (transactionError) {
        throw transactionError;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          balance: userBalance - amount 
        })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("订单创建成功");
      navigate(`/orderDetail/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("订单创建失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-base font-medium">{pageTitle}</div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4 pt-16">
        <div className="bg-white p-4 rounded-lg mb-4">
          <button
            onClick={() => setShowTutorialDialog(true)}
            className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
          >
            查看缴费操作教程 →
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">快速选择</div>
            <div className="text-sm text-blue-500">充值有验证</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickSelect(amount)}
                className={`py-2 px-4 rounded-lg border ${
                  selectedAmount === amount
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Input
              placeholder="请输入缴费户号"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Input
              placeholder="请输入缴费单位"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Input
              placeholder="请选择所在城市"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">充值金额</span>
            <div className="flex items-center">
              <span className="text-2xl font-medium mr-1">¥</span>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-20 text-right text-2xl font-medium outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-orange-500">折扣20% 优惠-{parseFloat(customAmount) * 0.2}元</div>
            <div className="text-gray-500">参考汇率:{EXCHANGE_RATE}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span>账户余额:</span>
          <span className="text-blue-600">¥ {userBalance.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span>合计:</span>
          <span className="text-orange-500">$ {usdtAmount} USDT</span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
        >
          {isSubmitting ? "处理中..." : "确认充值"}
        </Button>
      </div>
    </div>
  );
};

export default Utilities;
