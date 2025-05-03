
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase, adminSupabase, adminQuery } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface PaymentAddress {
  id: string;
  type: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

export const AddressesTable = () => {
  const [error, setError] = useState<string | null>(null);

  // 使用真实数据库查询
  const { data: addresses, isLoading, refetch } = useQuery({
    queryKey: ['payment-addresses'],
    queryFn: async () => {
      try {
        setError(null);
        console.log('开始获取支付地址数据...');
        
        // 使用增强的管理员客户端查询数据
        const query = adminSupabase
          .from('platform_payment_addresses')
          .select('*')
          .order('created_at', { ascending: false });

        try {
          // 使用新的adminQuery函数处理请求
          const data = await adminQuery('platform_payment_addresses', query);
          
          // 如果没有数据，返回空数组
          if (!data || data.length === 0) {
            console.log('没有找到支付地址数据');
            return [] as PaymentAddress[];
          } else {
            console.log('成功获取支付地址数据:', data.length);
            return data as PaymentAddress[];
          }
        } catch (error: any) {
          console.error('获取支付地址时发生错误:', error);
          setError(error.message || '获取数据失败');
          toast.error(`加载支付地址失败: ${error.message || '未知错误'}`);
          return [] as PaymentAddress[];
        }
      } catch (error: any) {
        console.error('查询过程中发生错误:', error);
        setError(error.message || '查询过程中发生错误');
        toast.error("加载支付地址失败");
        return [] as PaymentAddress[];
      }
    },
    retry: 1
  });

  const toggleAddressStatus = async (id: string, currentStatus: boolean) => {
    try {
      console.log(`开始切换地址 ${id} 状态...`);
      
      // 使用管理员客户端更新状态
      const query = adminSupabase
        .from('platform_payment_addresses')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      try {
        // 使用新的adminQuery函数处理请求
        await adminQuery('platform_payment_addresses', query);
        
        console.log(`成功切换地址 ${id} 状态为 ${!currentStatus}`);
        toast.success("状态更新成功");
        refetch();
      } catch (error: any) {
        console.error('更新地址状态时发生错误:', error);
        toast.error(`更新状态失败: ${error?.message || '未知错误'}`);
      }
    } catch (error: any) {
      console.error('切换状态过程中发生错误:', error);
      toast.error(`更新状态失败: ${error?.message || '未知错误'}`);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <p className="text-red-600 font-semibold">数据加载错误:</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
          >
            重新加载
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              console.log('手动清除错误并重新加载');
              setError(null);
              refetch();
            }}
          >
            清除错误并重试
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  if (!addresses || addresses.length === 0) {
    return <div className="text-center py-4">暂无支付地址</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>地址类型</TableHead>
          <TableHead>支付地址</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address) => (
          <TableRow key={address.id}>
            <TableCell>{address.type}</TableCell>
            <TableCell className="font-mono">{address.address}</TableCell>
            <TableCell>{address.is_active ? '启用' : '禁用'}</TableCell>
            <TableCell>{new Date(address.created_at).toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <Button
                variant={address.is_active ? "destructive" : "default"}
                size="sm"
                onClick={() => toggleAddressStatus(address.id, address.is_active)}
              >
                {address.is_active ? '禁用' : '启用'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
