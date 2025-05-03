
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface WithdrawParams {
  userId: string;
  amount: number;
  accountId: string;
}

export const createWithdrawOrder = async ({ userId, amount, accountId }: WithdrawParams) => {
  try {
    // 检查用户余额
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (profileError) {
      toast.error("获取用户信息失败");
      return false;
    }

    const userBalance = profile?.balance || 0;

    if (userBalance < amount) {
      toast.error("余额不足，无法提现");
      return false;
    }

    // 获取提现账户信息
    const { data: paymentAccount } = await supabase
      .from('user_payments')
      .select('*')
      .eq('id', accountId)
      .single();

    if (!paymentAccount) {
      toast.error("提现账户不存在");
      return false;
    }

    // 创建提现订单
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        type: '提现',
        amount: amount,
        usdt_amount: amount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 创建交易记录并更新余额
    const { error: transactionError } = await supabase
      .from('user_transactions')
      .insert({
        user_id: userId,
        type: 'withdraw',
        amount: -amount,
        balance: userBalance - amount,
        description: `提现到${paymentAccount.type}-${paymentAccount.account_number}`,
        order_id: order.id,
        status: 'pending'
      });

    if (transactionError) throw transactionError;

    // 更新用户余额
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ balance: userBalance - amount })
      .eq('id', userId);

    if (updateError) throw updateError;

    toast.success("提现申请已提交，请等待审核");
    return true;
  } catch (error) {
    console.error('Withdraw error:', error);
    toast.error("提现申请失败，请重试");
    return false;
  }
};
