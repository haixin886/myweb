import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, adminSupabase, adminQuery } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddAddressFormProps {
  onSuccess: () => void;
  onAddressAdded?: () => void;
}

export const AddAddressForm = ({ onSuccess, onAddressAdded }: AddAddressFormProps) => {
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !address) {
      toast.error("请填写所有必填字段");
      return;
    }
    
    setIsSubmitting(true);
    console.log('开始添加新的支付地址...');
    
    try {
      const timestamp = new Date().toISOString();
      
      // 使用增强的管理员客户端插入数据
      const query = adminSupabase
        .from('platform_payment_addresses')
        .insert([
          { 
            type, 
            address, 
            is_active: true,
            created_at: timestamp 
          }
        ])
        .select();

      try {
        // 使用新的adminQuery函数处理请求
        const data = await adminQuery('platform_payment_addresses', query);
        
        console.log('成功添加地址:', data);
        toast.success("添加地址成功");
        
        // 重置表单
        setType('');
        setAddress('');
        
        // 如果提供了onAddressAdded回调，则调用它
        if (onAddressAdded) {
          onAddressAdded();
        }
      } catch (error: any) {
        console.error('添加地址过程中发生错误:', error);
        toast.error(`添加地址失败: ${error?.message || '未知错误'}`);
      } finally {
        setIsSubmitting(false);
      }
    } catch (insertError: any) {
      console.log('尝试使用备用方案添加地址...');
      const backupTimestamp = new Date().toISOString();
      const { data: backupData, error: backupError } = await adminSupabase
        .from('platform_payment_addresses')
        .insert([
          { 
            type, 
            address, 
            is_active: true,
            created_at: backupTimestamp
          }
        ])
        .select();

      if (backupError) {
        console.error('备用方案也失败:', backupError);
        toast.error(`添加失败: ${backupError.message}`);
      } else {
        console.log('备用方案成功添加地址:', backupData);
        toast.success("添加地址成功");
        setType("");
        setAddress("");
        if (onSuccess) onSuccess();
        if (onAddressAdded) onAddressAdded();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">地址类型</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-black text-white border-gray-700">
              <SelectValue placeholder="选择地址类型" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="TRC20">TRC20</SelectItem>
              <SelectItem value="ERC20">ERC20</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">支付地址</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="输入支付地址"
            className="bg-black text-white border-gray-700"
            variant="dark"
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} variant="dark">
        {isSubmitting ? "添加中..." : "添加地址"}
      </Button>
    </form>
  );
};
