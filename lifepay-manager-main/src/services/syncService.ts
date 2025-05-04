import { adminSupabase } from '@/integrations/supabase/client';
import { create } from 'zustand';
import { toast } from 'sonner';

// 使用类型断言解决类型检查问题
const supabaseAny = adminSupabase as any;

// 定义同步状态类型
interface SyncState {
  lastSyncTime: Date | null;
  isSyncing: boolean;
  syncErrors: Record<string, string>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  setSyncing: (isSyncing: boolean) => void;
  setLastSyncTime: (time: Date) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  addSyncError: (table: string, error: string) => void;
  clearSyncErrors: () => void;
}

// 创建同步状态存储
export const useSyncStore = create<SyncState>((set) => ({
  lastSyncTime: null,
  isSyncing: false,
  syncErrors: {},
  syncStatus: 'idle',
  setSyncing: (isSyncing) => set({ isSyncing }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  addSyncError: (table, error) => 
    set((state) => ({ 
      syncErrors: { ...state.syncErrors, [table]: error } 
    })),
  clearSyncErrors: () => set({ syncErrors: {} }),
}));

// 定义需要同步的表
const TABLES_TO_SYNC = [
  'recharge_orders',
  'merchant_api_keys',
  'operation_logs',
  'permissions',
  'roles',
  'admin_roles',
  'user_profiles',
  'merchant_profiles'
];

// 同步单个表的数据
const syncTable = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAny
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error(`同步表 ${tableName} 时出错:`, error);
      useSyncStore.getState().addSyncError(tableName, error.message);
      return false;
    }
    
    // 这里我们只是检查表是否可访问，实际应用中可能需要更复杂的逻辑
    console.log(`表 ${tableName} 同步成功，最新记录:`, data?.[0]);
    return true;
  } catch (error) {
    console.error(`同步表 ${tableName} 时出现异常:`, error);
    useSyncStore.getState().addSyncError(tableName, (error as Error).message);
    return false;
  }
};

// 设置实时订阅
export const setupRealtimeSubscriptions = () => {
  // 为每个表设置实时订阅
  TABLES_TO_SYNC.forEach(tableName => {
    const channel = supabaseAny
      .channel(`public:${tableName}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: tableName 
      }, (payload: any) => {
        console.log(`表 ${tableName} 发生变化:`, payload);
        // 这里可以触发相应的更新逻辑，例如刷新查询或更新本地缓存
        toast.info(`数据已更新: ${tableName}`);
      })
      .subscribe((status: any) => {
        console.log(`订阅 ${tableName} 状态:`, status);
      });
      
    // 返回取消订阅函数，可在组件卸载时调用
    return () => {
      supabaseAny.removeChannel(channel);
    };
  });
};

// 同步所有表的数据
export const syncAllTables = async (): Promise<boolean> => {
  const syncStore = useSyncStore.getState();
  syncStore.setSyncing(true);
  syncStore.setSyncStatus('syncing');
  syncStore.clearSyncErrors();
  
  try {
    const results = await Promise.all(
      TABLES_TO_SYNC.map(tableName => syncTable(tableName))
    );
    
    const allSuccess = results.every(result => result);
    
    if (allSuccess) {
      syncStore.setSyncStatus('success');
      syncStore.setLastSyncTime(new Date());
      toast.success('所有数据同步成功');
      return true;
    } else {
      syncStore.setSyncStatus('error');
      toast.error('部分数据同步失败，请查看控制台获取详情');
      return false;
    }
  } catch (error) {
    console.error('同步数据时出现异常:', error);
    syncStore.setSyncStatus('error');
    toast.error('数据同步失败');
    return false;
  } finally {
    syncStore.setSyncing(false);
  }
};

// 初始化同步
export const initializeSync = () => {
  // 设置实时订阅
  setupRealtimeSubscriptions();
  
  // 首次同步
  syncAllTables().then(success => {
    console.log('初始同步完成，状态:', success ? '成功' : '失败');
  });
  
  // 设置定期同步（每5分钟）
  const intervalId = setInterval(() => {
    syncAllTables().then(success => {
      console.log('定期同步完成，状态:', success ? '成功' : '失败');
    });
  }, 5 * 60 * 1000);
  
  // 返回清理函数
  return () => {
    clearInterval(intervalId);
  };
};

// 导出默认函数，用于在应用启动时初始化
export default initializeSync;
