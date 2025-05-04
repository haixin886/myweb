import React, { createContext, useContext, useEffect } from 'react';
import { initializeSync } from '@/services/syncService';

// 创建同步上下文
const SyncContext = createContext<{
  refreshData: () => void;
}>({
  refreshData: () => {},
});

// 同步上下文提供者组件
export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // 在组件挂载时初始化同步服务
  useEffect(() => {
    const cleanup = initializeSync();
    
    // 在组件卸载时清理
    return () => {
      cleanup();
    };
  }, []);
  
  // 提供刷新数据的方法
  const refreshData = () => {
    window.location.reload();
  };
  
  return (
    <SyncContext.Provider value={{ refreshData }}>
      {children}
    </SyncContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问同步上下文
export const useSync = () => useContext(SyncContext);

export default SyncProvider;
