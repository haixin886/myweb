import React from 'react';
import { useSyncStore } from '@/services/syncService';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SyncIndicator: React.FC = () => {
  const { lastSyncTime, isSyncing, syncStatus } = useSyncStore();
  
  const formatTime = (date: Date | null) => {
    if (!date) return '从未同步';
    return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  };
  
  const renderStatusIcon = () => {
    switch (syncStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (syncStatus) {
      case 'success':
        return '数据已同步';
      case 'error':
        return '同步失败';
      case 'syncing':
        return '同步中...';
      default:
        return '未同步';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-1 cursor-pointer p-1 rounded hover:bg-gray-100">
            {renderStatusIcon()}
            <span className="text-xs text-gray-600">{getStatusText()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">上次同步: {formatTime(lastSyncTime)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncIndicator;
