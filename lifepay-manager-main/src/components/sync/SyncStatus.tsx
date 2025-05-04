import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSyncStore, syncAllTables } from '@/services/syncService';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export const SyncStatus: React.FC = () => {
  const { lastSyncTime, isSyncing, syncStatus, syncErrors } = useSyncStore();
  
  const handleSync = () => {
    syncAllTables();
  };
  
  const formatTime = (date: Date | null) => {
    if (!date) return '从未同步';
    return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  };
  
  const renderStatusIcon = () => {
    switch (syncStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const renderStatusBadge = () => {
    switch (syncStatus) {
      case 'success':
        return <Badge className="bg-green-500">同步成功</Badge>;
      case 'error':
        return <Badge className="bg-red-500">同步失败</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-500">正在同步</Badge>;
      default:
        return <Badge className="bg-gray-500">未同步</Badge>;
    }
  };
  
  // 确保错误对象是字符串类型
  const formatErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return JSON.stringify(error);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">数据同步状态</CardTitle>
        {renderStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {renderStatusIcon()}
            <span className="text-sm text-gray-700">
              上次同步: {formatTime(lastSyncTime)}
            </span>
          </div>
          <Button 
            size="sm" 
            onClick={handleSync} 
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                同步中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                同步数据
              </>
            )}
          </Button>
        </div>
        
        {Object.keys(syncErrors).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-500 mb-2">同步错误:</h4>
            <ul className="text-xs space-y-1">
              {Object.entries(syncErrors).map(([table, error]) => (
                <li key={table} className="text-red-400">
                  <span className="font-medium">{table}:</span> {formatErrorMessage(error)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncStatus;
