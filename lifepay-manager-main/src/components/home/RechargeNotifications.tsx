import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell } from 'lucide-react';
import { adminSupabase } from '@/integrations/supabase/client';

// Mock data for Chinese last names
const lastNames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];

// Weighted service types for more realistic data
const serviceTypes = [
  { type: '话费充值', weight: 40, amount: [50, 100, 200, 300, 500] },
  { type: '流量充值', weight: 25, amount: [10, 20, 30, 50, 100] },
  { type: '游戏充值', weight: 20, amount: [50, 100, 200, 300, 500, 1000] },
  { type: '生活缴费', weight: 15, amount: [50, 100, 150, 200, 300, 500] },
];

// Get a random service type based on weights
const getWeightedRandomServiceType = () => {
  const totalWeight = serviceTypes.reduce((acc, type) => acc + type.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const serviceType of serviceTypes) {
    random -= serviceType.weight;
    if (random <= 0) {
      return serviceType;
    }
  }
  
  return serviceTypes[0]; // Fallback
};

// 从数据库获取最近的订单
const fetchRecentOrders = async (limit: number): Promise<OrderNotification[]> => {
  try {
    const { data, error } = await adminSupabase
      .from('recharge_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('获取充值订单失败:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // 将数据库记录转换为通知格式
    return data.map(order => {
      // 根据支付方式确定服务类型
      let serviceType = '话费充值';
      if (order.payment_method.includes('流量')) {
        serviceType = '流量充值';
      } else if (order.payment_method.includes('游戏')) {
        serviceType = '游戏充值';
      } else if (order.payment_method.includes('生活')) {
        serviceType = '生活缴费';
      }
      
      return {
        id: order.id,
        name: order.user_name || `用户${order.phone_number?.slice(-4) || '****'}`,
        serviceType,
        amount: order.recharge_amount || order.actual_amount,
        timestamp: new Date(order.created_at),
        status: order.status,
        displayTime: format(new Date(order.created_at), 'HH:mm:ss', { locale: zhCN })
      };
    });
  } catch (error) {
    console.error('获取充值订单异常:', error);
    return [];
  }
};

type OrderNotification = {
  id: string | number; // 支持字符串ID（来自数据库）或数字ID（模拟数据）
  name: string;
  serviceType: string;
  amount: number;
  timestamp: Date;
  status: 'new' | 'success' | string; // 允许数据库中的其他状态值
  displayTime?: string;
};

export const RechargeNotifications = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<OrderNotification | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Generate a Beijing time string (UTC+8)
  const formatBeijingTime = (date: Date): string => {
    const hours = date.getHours();
    const period = hours < 12 ? '上午' : '下午';
    return `北京时间${period}${format(date, 'HH:mm', { locale: zhCN })}`;
  };

  useEffect(() => {
    // 加载初始通知
    const loadInitialNotifications = async () => {
      try {
        // 尝试从数据库获取真实订单数据
        const realOrders = await fetchRecentOrders(5);
        
        // 如果没有真实数据，则生成模拟数据
        if (!realOrders || realOrders.length === 0) {
          const mockNotifications: OrderNotification[] = [];
          for (let i = 0; i < 5; i++) {
            const serviceType = getWeightedRandomServiceType();
            mockNotifications.push({
              id: i,
              name: `${lastNames[Math.floor(Math.random() * lastNames.length)]}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
              serviceType: serviceType.type,
              amount: serviceType.amount[Math.floor(Math.random() * serviceType.amount.length)],
              timestamp: new Date(Date.now() - Math.random() * 3600000),
              status: 'success',
              displayTime: format(new Date(Date.now() - Math.random() * 3600000), 'HH:mm:ss', { locale: zhCN })
            });
          }
          
          // 按时间戳排序
          mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setNotifications(mockNotifications);
        } else {
          // 使用真实数据
          setNotifications(realOrders);
        }
      } catch (error) {
        console.error('加载初始通知失败:', error);
        // 出错时使用空数组
        setNotifications([]);
      }
    };
    
    // 加载初始数据
    loadInitialNotifications();
    
    // 设置定时器定期获取新订单
    const interval = setInterval(async () => {
      try {
        // 尝试获取最新订单
        const latestOrders = await fetchRecentOrders(1);
        
        // 如果有新订单且与当前列表中的最新订单不同
        if (latestOrders && latestOrders.length > 0 && 
            (notifications.length === 0 || latestOrders[0].id !== notifications[0].id)) {
          const newNotification = latestOrders[0];
          
          setNotifications(prev => {
            const updated = [newNotification, ...prev.slice(0, 19)]; // 最多保留 20 条通知
            return updated;
          });
          
          // 显示活动通知
          setActiveNotification(newNotification);
          
          // 5 秒后隐藏
          setTimeout(() => {
            setActiveNotification(null);
            // 标记为成功
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === newNotification.id 
                  ? { ...notif, status: 'success' as const }
                  : notif
              )
            );
          }, 5000);
        } else if (Math.random() < 0.2) { // 20% 概率生成模拟通知，保持界面活跃
          const serviceType = getWeightedRandomServiceType();
          const mockNotification: OrderNotification = {
            id: Date.now(),
            name: `${lastNames[Math.floor(Math.random() * lastNames.length)]}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
            serviceType: serviceType.type,
            amount: serviceType.amount[Math.floor(Math.random() * serviceType.amount.length)],
            timestamp: new Date(),
            status: 'new',
            displayTime: format(new Date(), 'HH:mm:ss', { locale: zhCN })
          };
          
          setNotifications(prev => {
            const updated = [mockNotification, ...prev.slice(0, 19)];
            return updated;
          });
          
          setActiveNotification(mockNotification);
          
          setTimeout(() => {
            setActiveNotification(null);
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === mockNotification.id 
                  ? { ...notif, status: 'success' as const }
                  : notif
              )
            );
          }, 5000);
        }
      } catch (error) {
        console.error('获取新订单失败:', error);
      }
    }, 15000); // 每 15 秒检查一次
    
    return () => clearInterval(interval);
  }, [notifications]);
  
  // Set the first notification as active when notifications are loaded
  useEffect(() => {
    if (notifications.length > 0 && !activeNotification) {
      setActiveNotification(notifications[0]);
    }
  }, [notifications, activeNotification]);
  
  // Rotate through notifications
  useEffect(() => {
    if (notifications.length <= 1) return;
    
    const rotateInterval = setInterval(() => {
      setActiveNotification(current => {
        if (!current) return notifications[0];
        const currentIndex = notifications.findIndex(n => n.id === current.id);
        const nextIndex = (currentIndex + 1) % notifications.length;
        return notifications[nextIndex];
      });
    }, 8000); // Change notification every 8 seconds
    
    return () => clearInterval(rotateInterval);
  }, [notifications]);
  
  const renderNotificationText = (notification: OrderNotification) => {
    if (!notification) return null;
    
    if (notification.status === 'new') {
      return (
        <span>
          {notification.displayTime}用户{notification.name}，提交了一笔{notification.serviceType}订单，
          {notification.serviceType.includes('代还') ? '代还' : '充值'}金额
          <span className="text-red-500 font-medium mx-1">{notification.amount}</span>元
        </span>
      );
    } else {
      return (
        <span>
          恭喜{notification.name}，您于{notification.displayTime}提交的
          <span className="text-red-500 font-medium mx-1">{notification.amount}</span>元
          {notification.serviceType}已成功到账，请查收！
        </span>
      );
    }
  };
  
  if (!activeNotification) {
    return null;
  }
  
  return (
    <Card className="p-2 shadow-sm bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      <div className="flex items-center">
        <div className="p-1.5 bg-red-100 rounded-full mr-2 flex-shrink-0">
          <Bell className="h-4 w-4 text-red-500" />
        </div>
        <div ref={containerRef} className="overflow-hidden whitespace-nowrap relative">
          <div 
            ref={contentRef}
            className="animate-marquee"
          >
            {renderNotificationText(activeNotification)}
          </div>
        </div>
      </div>
    </Card>
  );
};
