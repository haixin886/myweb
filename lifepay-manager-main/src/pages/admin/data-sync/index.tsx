import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { syncAllTables, useSyncStore } from '@/services/syncService';
import { RefreshCw, Database, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import SyncStatus from '@/components/sync/SyncStatus';

// 定义要同步的表类别
const TABLE_CATEGORIES = {
  user: ['user_profiles', 'user_transactions', 'user_payments'],
  order: ['recharge_orders', 'payment_orders', 'channel_orders'],
  merchant: ['merchant_profiles', 'merchant_api_keys', 'merchant_applications'],
  system: ['operation_logs', 'permissions', 'roles', 'admin_roles']
};

const DataSyncPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { lastSyncTime, isSyncing } = useSyncStore();
  
  const handleSync = () => {
    syncAllTables().then(success => {
      if (success) {
        toast.success('数据同步成功');
      } else {
        toast.error('部分数据同步失败，请查看详情');
      }
    });
  };
  
  const formatTime = (date: Date | null) => {
    if (!date) return '从未同步';
    return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">数据同步管理</h1>
        <Button 
          onClick={handleSync} 
          disabled={isSyncing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              同步中...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              全量同步
            </>
          )}
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">上次同步时间</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span>{formatTime(lastSyncTime)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">用户数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>已同步</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">订单数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>已同步</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">系统数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>已同步</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="user">用户数据</TabsTrigger>
            <TabsTrigger value="order">订单数据</TabsTrigger>
            <TabsTrigger value="merchant">商户数据</TabsTrigger>
            <TabsTrigger value="system">系统数据</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>数据同步状态</CardTitle>
                <CardDescription>
                  查看所有数据表的同步状态，并可以手动触发同步操作
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SyncStatus />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">数据同步说明</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>系统会自动每5分钟同步一次数据，确保前端和后端数据保持一致</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>当数据库发生变化时，系统会自动通知前端更新数据</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>您也可以手动触发同步操作，立即更新所有数据</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span>如果同步失败，系统会显示错误信息，您可以尝试重新同步</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>用户数据同步</CardTitle>
                <CardDescription>
                  用户相关数据表的同步状态
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TABLE_CATEGORIES.user.map(table => (
                    <div key={table} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{table}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>已同步</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="order">
            <Card>
              <CardHeader>
                <CardTitle>订单数据同步</CardTitle>
                <CardDescription>
                  订单相关数据表的同步状态
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TABLE_CATEGORIES.order.map(table => (
                    <div key={table} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{table}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>已同步</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="merchant">
            <Card>
              <CardHeader>
                <CardTitle>商户数据同步</CardTitle>
                <CardDescription>
                  商户相关数据表的同步状态
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TABLE_CATEGORIES.merchant.map(table => (
                    <div key={table} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{table}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>已同步</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>系统数据同步</CardTitle>
                <CardDescription>
                  系统相关数据表的同步状态
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TABLE_CATEGORIES.system.map(table => (
                    <div key={table} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{table}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>已同步</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataSyncPage;
