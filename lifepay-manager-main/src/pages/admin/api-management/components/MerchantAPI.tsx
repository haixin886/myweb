
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { adminSupabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// 定义 API 密钥类型
type ApiKey = {
  id: string;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  last_used: string | null;
  permissions: string[];
};

// 使用类型断言来解决类型检查问题
const supabaseAny = adminSupabase as any;

const MerchantAPI = () => {
  const [apiName, setApiName] = useState('');
  const [apiPermission, setApiPermission] = useState('read_write');
  
  const { data: merchantApiKeys, isLoading, refetch } = useQuery({
    queryKey: ['merchant-api-keys'],
    queryFn: async (): Promise<ApiKey[]> => {
      try {
        // 使用管理员权限获取所有 API 密钥
        const { data, error } = await supabaseAny
          .from('merchant_api_keys')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('获取商户 API 密钥失败:', error);
          throw error;
        }
        
        // 如果没有数据，返回空数组
        if (!data || data.length === 0) {
          return [];
        }
        
        // 处理数据并返回
        return data.map(item => ({
          id: item.id,
          name: item.name,
          key: item.key_prefix ? `${item.key_prefix}...${item.key_suffix}` : 'sk_test_...',
          is_active: item.is_active,
          created_at: item.created_at,
          last_used: item.last_used || null,
          permissions: Array.isArray(item.permissions) ? item.permissions : ['read']
        }));
      } catch (error) {
        console.error('获取 API 密钥时出错:', error);
        // 如果出错，返回空数组
        return [];
      }
    }
  });
  
  // 生成新的 API 密钥
  const generateApiKey = async () => {
    if (!apiName) {
      toast.error('请输入 API 名称');
      return;
    }
    
    try {
      // 生成随机 API 密钥
      const apiKey = 'sk_test_' + Array.from({ length: 32 }, () => 
        Math.floor(Math.random() * 36).toString(36)
      ).join('');
      
      const keyPrefix = apiKey.substring(0, 12);
      const keySuffix = apiKey.substring(apiKey.length - 4);
      
      // 确定权限
      let permissions;
      switch (apiPermission) {
        case 'read':
          permissions = ['read'];
          break;
        case 'write':
          permissions = ['write'];
          break;
        case 'read_write':
        default:
          permissions = ['read', 'write'];
          break;
      }
      
      // 获取当前用户会话
      const { data: { session } } = await adminSupabase.auth.getSession();
      if (!session) {
        toast.error('未登录');
        return;
      }
      
      // 插入新的 API 密钥
      const { error } = await supabaseAny
        .from('merchant_api_keys')
        .insert({
          merchant_id: session.user.id,
          name: apiName,
          api_key: apiKey,
          key_prefix: keyPrefix,
          key_suffix: keySuffix,
          is_active: true,
          permissions: permissions
        });
        
      if (error) {
        console.error('创建 API 密钥失败:', error);
        toast.error('创建 API 密钥失败: ' + error.message);
        return;
      }
      
      toast.success('API 密钥创建成功');
      setApiName('');
      setApiPermission('read_write');
      refetch();
      
    } catch (error) {
      console.error('创建 API 密钥时出错:', error);
      toast.error('创建 API 密钥失败');
    }
  };
  
  // 切换 API 密钥状态
  const toggleApiKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseAny
        .from('merchant_api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', id);
        
      if (error) {
        console.error('更新 API 密钥状态失败:', error);
        toast.error('更新 API 密钥状态失败');
        return;
      }
      
      toast.success('API 密钥状态已更新');
      refetch();
      
    } catch (error) {
      console.error('更新 API 密钥状态时出错:', error);
      toast.error('更新 API 密钥状态失败');
    }
  };
  
  // 删除 API 密钥
  const deleteApiKey = async (id: string) => {
    if (!confirm('确定要删除此 API 密钥吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const { error } = await supabaseAny
        .from('merchant_api_keys')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('删除 API 密钥失败:', error);
        toast.error('删除 API 密钥失败');
        return;
      }
      
      toast.success('API 密钥已删除');
      refetch();
      
    } catch (error) {
      console.error('删除 API 密钥时出错:', error);
      toast.error('删除 API 密钥失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">商户API管理</h2>
        <Button onClick={generateApiKey}>生成新API密钥</Button>
      </div>
      
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">API名称</label>
              <Input 
                placeholder="输入API名称" 
                value={apiName} 
                onChange={(e) => setApiName(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">权限设置</label>
              <Select 
                value={apiPermission} 
                onValueChange={setApiPermission}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择权限级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">只读</SelectItem>
                  <SelectItem value="write">只写</SelectItem>
                  <SelectItem value="read_write">读写</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <h3 className="text-lg font-medium mt-6">现有API密钥</h3>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">加载中...</div>
        ) : merchantApiKeys?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无API密钥</div>
        ) : (
          merchantApiKeys?.map(apiKey => (
            <Card key={apiKey.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h4 className="font-medium">{apiKey.name}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    创建时间: {new Date(apiKey.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    最后使用: {apiKey.last_used ? new Date(apiKey.last_used).toLocaleString() : '从未使用'}
                  </div>
                  <div className="text-sm text-gray-500">
                    权限: {apiKey.permissions.join(', ')}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={apiKey.is_active} 
                      onCheckedChange={() => toggleApiKeyStatus(apiKey.id, apiKey.is_active)}
                    />
                    <span className="text-sm">{apiKey.is_active ? '启用' : '禁用'}</span>
                  </div>
                  
                  <Button variant="outline" size="sm">查看密钥</Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteApiKey(apiKey.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MerchantAPI;
