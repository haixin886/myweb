
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Product = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setSession(session);
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const checkBalance = async () => {
      if (!session) {
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
        toast.error("获取余额失败");
        return;
      }

      setBalance(profile?.balance || 0);
    };

    checkBalance();
  }, [session]);

  const handleSubmit = async (amount: number) => {
    try {
      if (!session) {
        toast.error("请先登录");
        return;
      }

      // 验证电话号码和姓名
      if (!phoneNumber) {
        toast.error("请输入手机号码");
        return;
      }

      if (!fullName) {
        toast.error("请输入姓名");
        return;
      }

      // 检查余额是否足够
      if (amount > balance) {
        toast.error("余额不足，请先充值");
        return;
      }

      setIsSubmitting(true);

      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          type: "话费充值",
          amount: amount,
          usdt_amount: amount,
          phone_number: phoneNumber,
          name: fullName
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // 创建交易记录
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          type: '充值',
          amount: -amount,
          balance: balance - amount,
          user_id: session.user.id,
          order_id: order.id,
          description: `话费充值 ${phoneNumber}`
        });

      if (transactionError) {
        throw transactionError;
      }

      // 更新用户余额
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          balance: balance - amount 
        })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("订单提交成功");
      navigate(`/orderDetail/${order.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error("订单提交失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">话费充值</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">手机号码</label>
          <Input
            type="tel"
            placeholder="请输入手机号码"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <Input
            type="text"
            placeholder="请输入姓名"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => handleSubmit(50)}
            disabled={isSubmitting}
            className="w-full"
          >
            50元
          </Button>
          <Button
            onClick={() => handleSubmit(100)}
            disabled={isSubmitting}
            className="w-full"
          >
            100元
          </Button>
          <Button
            onClick={() => handleSubmit(200)}
            disabled={isSubmitting}
            className="w-full"
          >
            200元
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          当前余额: {balance} 元
        </div>
      </div>
    </div>
  );
};

export default Product;
