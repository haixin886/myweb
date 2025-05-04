import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createRechargeOrder } from "@/services/rechargeService";
import { inquirePhoneInfo, formatMobileNumber, PhoneInquiryResult } from "@/services/phoneInquiryService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const amounts = [20, 50, 100, 200, 300, 500, 1000];

const Recharge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceTitle = location.state?.serviceTitle || "话费充值";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // 手机号码查询相关状态
  const [phoneInfo, setPhoneInfo] = useState<PhoneInquiryResult | null>(null);
  const [isQueryingPhone, setIsQueryingPhone] = useState(false);
  const [phoneQueryError, setPhoneQueryError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("请先登录");
        navigate("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('balance')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setUserBalance(data.balance || 0);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    validateForm();
    
    // 当手机号码变化且有效时，查询手机号码信息
    const formattedPhone = formatMobileNumber(phoneNumber);
    if (formattedPhone && formattedPhone.length === 11) {
      queryPhoneInfo(formattedPhone);
    } else {
      // 如果手机号码无效，清除之前的查询结果
      setPhoneInfo(null);
      setPhoneQueryError("");
    }
  }, [phoneNumber, selectedAmount, customAmount]);

  const validateForm = () => {
    const isPhoneValid = /^1[3-9]\d{9}$/.test(phoneNumber);
    const hasAmount = selectedAmount !== null || (customAmount && Number(customAmount) > 0);
    setIsValid(isPhoneValid && hasAmount);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  // 查询手机号码信息
  const queryPhoneInfo = async (mobile: string) => {
    // 如果已经在查询中，则跳过
    if (isQueryingPhone) return;
    
    setIsQueryingPhone(true);
    setPhoneQueryError("");
    
    try {
      const info = await inquirePhoneInfo(mobile);
      if (info) {
        setPhoneInfo(info);
      } else {
        setPhoneQueryError("无法获取手机号码信息");
      }
    } catch (error) {
      console.error('查询手机号码信息出错:', error);
      setPhoneQueryError("查询手机号码信息时出错");
    } finally {
      setIsQueryingPhone(false);
    }
  };
  
  const getFinalAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return Number(customAmount);
    return 0;
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    const amount = getFinalAmount();
    if (amount <= 0) {
      toast.error("请选择或输入充值金额");
      return;
    }

    if (amount > userBalance) {
      toast.error("余额不足，请先充值");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("会话已过期，请重新登录");
        navigate("/login");
        return;
      }

      const order = await createRechargeOrder({
        userId: session.user.id,
        phone: phoneNumber,
        amount: amount,
        type: serviceTitle
      });

      if (order) {
        // Update user balance
        const newBalance = userBalance - amount;
        
        const { error } = await supabase
          .from('user_profiles')
          .update({ balance: newBalance })
          .eq('id', session.user.id);
        
        if (error) {
          console.error("Error updating user balance:", error);
          toast.error("更新余额失败");
          return;
        }
        
        // Add transaction record
        await supabase
          .from('user_transactions')
          .insert({
            user_id: session.user.id,
            amount: -amount,
            type: 'payment',
            balance: newBalance,
            description: `${serviceTitle} ${phoneNumber}`,
            order_id: order.id
          });
        
        toast.success("充值订单已提交");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("提交订单失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center">
        <Button
          variant="ghost"
          className="p-0 mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center mr-6">
          {serviceTitle}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            充值号码
          </label>
          <div className="mt-1">
            <Input
              type="tel"
              placeholder="请输入手机号码"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            
            {/* 手机号码信息显示区域 */}
            {isQueryingPhone && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                正在查询手机号码信息...
              </div>
            )}
            
            {phoneQueryError && (
              <div className="mt-2 text-sm text-red-500">
                {phoneQueryError}
              </div>
            )}
            
            {phoneInfo && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{phoneInfo.mobile}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{phoneInfo.sp}</Badge>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>原运营商: {phoneInfo.pri_sp}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">归属地: </span>
                    <span>{phoneInfo.province} {phoneInfo.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">账户余额: </span>
                    <span className="font-medium text-green-600">¥{phoneInfo.curFee}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            选择充值金额
          </label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className={cn(
                  "relative rounded-md border shadow-sm px-3 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3182f6]",
                  selectedAmount === amount
                    ? "bg-[#3182f6]/10 text-[#3182f6] border-[#3182f6] ring-2 ring-[#3182f6]"
                    : "text-gray-700 border-gray-300"
                )}
                onClick={() => handleAmountSelect(amount)}
              >
                {amount}
              </Button>
            ))}
          </div>
          <div className="mt-3">
            <Input
              type="number"
              placeholder="自定义金额"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-gray-500">
              账户余额
            </div>
            <div className="text-lg font-bold">
              {userBalance.toFixed(2)}
            </div>
          </div>
          <Button
            className="w-full bg-[#3182f6] hover:bg-[#3182f6]/90 text-white"
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "提交中..." : "立即充值"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Recharge;
