
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MerchantSearchForm as UserSearchForm } from "./components/MerchantSearchForm";
import { MerchantList as UserList } from "./components/MerchantList";
import { AddUserSheet } from "./components/AddMerchantSheet";
import type { SearchParams, Merchant as User } from "./types";

const UsersPage = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const queryClient = useQueryClient();

  // 定义过滤函数
  const filterUsers = (users: User[], params: SearchParams) => {
    let filtered = [...users];
    
    if (params.nickname) {
      filtered = filtered.filter(user => 
        user.nickname?.toLowerCase().includes(params.nickname?.toLowerCase() || ''));
    }
    if (params.phone) {
      filtered = filtered.filter(user => 
        user.phone?.includes(params.phone || ''));
    }
    if (params.status) {
      filtered = filtered.filter(user => 
        user.status === (params.status === 'enabled'));
    }
    if (params.startDate) {
      filtered = filtered.filter(user => 
        new Date(user.created_at) >= new Date(params.startDate || ''));
    }
    if (params.endDate) {
      filtered = filtered.filter(user => 
        new Date(user.created_at) <= new Date(params.endDate || ''));
    }
    
    // 按创建时间排序
    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // 获取用户列表
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['merchants', searchParams],
    queryFn: async () => {
      try {
        console.log('尝试获取用户列表...');
        
        // 从 Supabase 获取数据
        const { data, error } = await supabase
          .from('merchant_profiles')
          .select('*');
          
        if (error) {
          console.error('获取用户数据失败:', error);
          throw error;
        }
        
        console.log('从 Supabase 获取到用户数据:', data?.length || 0, '条记录');
        
        // 将数据库字段映射到前端需要的字段
        const mappedData = (data || []).map(user => ({
          ...user,
          balance: user.account_balance,
          frozen_balance: user.freeze_balance,
          ip_address: user.ip,
          last_sign_in_at: user.updated_at
        }));
        
        return mappedData;
      } catch (error) {
        console.error('获取用户列表失败:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // 每30秒刷新一次
    refetchOnWindowFocus: true // 窗口获得焦点时刷新数据
  });

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  // 处理状态更改
  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      console.log('尝试更新用户状态:', userId, newStatus);
      
      // 先尝试从 merchant_profiles 表获取数据
      const { data: merchantProfiles, error: fetchError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', userId);
        
      if (fetchError) {
        console.error('获取用户数据失败:', fetchError);
        toast.error('获取用户数据失败');
        return;
      } else {
        console.log('找到用户数据:', merchantProfiles?.length || 0, '条记录');
      }
      
      // 如果有数据，则更新状态
      if (merchantProfiles && merchantProfiles.length > 0) {
        // 使用 supabase 更新用户状态
        const { error } = await supabase
          .from('merchant_profiles')
          .update({ status: newStatus })
          .eq('user_id', userId);

        if (error) {
          console.error('更新用户状态失败:', error);
          toast.error('更新用户状态失败');
          return;
        }
        
        console.log('用户状态更新成功');
      } else {
        console.error('未找到要更新的用户:', userId);
        toast.error('未找到要更新的用户');
        return;
      }

      // 刷新数据
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      toast.success('用户状态更新成功');
    } catch (error) {
      console.error('更新用户状态失败:', error);
      toast.error('更新用户状态失败');
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">平台用户</h1>
        <AddUserSheet />
      </div>
      
      <Card className="p-4 mb-4">
        <UserSearchForm 
          onSearch={(params: SearchParams) => handleSearch(params)} 
          onReset={handleReset} 
        />
      </Card>
      
      <UserList 
        merchants={users}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default UsersPage;
