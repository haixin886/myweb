
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

// Mock data for random order notifications
const lastNames = ['张', '李', '王', '赵', '刘', '陈', '杨', '周', '吴', '郑', '林', '高', '何', '郭', '马', '罗', '梁', '宋', '唐', '许'];

// Updated service types with weights for the prioritized types
const serviceTypes = [
  { type: '话费充值', amount: [50, 100, 200, 300, 500], weight: 20 },
  { type: '信用卡代还', amount: [5000, 8000, 10000, 15000, 20000], weight: 20 },
  { type: '花呗代还', amount: [1000, 2000, 3000, 5000, 8000], weight: 20 },
  { type: '电费充值', amount: [100, 200, 300, 500, 800], weight: 20 },
  { type: '抖币充值', amount: [100, 200, 500, 1000, 2000], weight: 5 },
  { type: '快币充值', amount: [100, 200, 500, 1000, 2000], weight: 5 },
  { type: '网易游戏', amount: [100, 200, 300, 500, 1000], weight: 5 },
  { type: '燃气缴费', amount: [100, 200, 300, 500, 800], weight: 5 },
  { type: '石化加油卡', amount: [200, 300, 500, 1000, 2000], weight: 5 }
];

// Utility function to select service type based on weights
const getWeightedRandomServiceType = () => {
  const totalWeight = serviceTypes.reduce((sum, type) => sum + type.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const serviceType of serviceTypes) {
    random -= serviceType.weight;
    if (random <= 0) {
      return serviceType;
    }
  }
  
  return serviceTypes[0]; // Fallback
};

type OrderNotification = {
  id: number;
  name: string;
  serviceType: string;
  amount: number;
  timestamp: Date;
  status: 'new' | 'success';
  displayTime?: string;
}

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
  
  // Generate a random notification
  const generateNewOrderNotification = (): OrderNotification => {
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const serviceType = getWeightedRandomServiceType();
    const amountIndex = Math.floor(Math.random() * serviceType.amount.length);
    const amount = serviceType.amount[amountIndex];
    const now = new Date();
    
    return {
      id: Date.now() + Math.random(),
      name: lastName + '***',
      serviceType: serviceType.type,
      amount,
      timestamp: now,
      displayTime: formatBeijingTime(now),
      status: 'new'
    };
  };
  
  const scheduleSuccessNotification = (notification: OrderNotification) => {
    // Schedule success notification after 30-60 minutes (simulated as 20-40 seconds for demo)
    const delaySeconds = Math.floor(Math.random() * 20) + 20;
    
    setTimeout(() => {
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          name: notification.name,
          serviceType: notification.serviceType,
          amount: notification.amount,
          timestamp: notification.timestamp,
          displayTime: notification.displayTime,
          status: 'success'
        }
      ]);
    }, delaySeconds * 1000);
  };
  
  useEffect(() => {
    // Initialize with 8 random notifications with weighted distribution
    const initialNotifications: OrderNotification[] = [];
    for (let i = 0; i < 8; i++) {
      const notification = generateNewOrderNotification();
      initialNotifications.push(notification);
      scheduleSuccessNotification(notification);
    }
    setNotifications(initialNotifications);
    
    // Add new notification every 5-15 seconds
    const addInterval = setInterval(() => {
      const newNotification = generateNewOrderNotification();
      setNotifications(prev => [...prev, newNotification].slice(-20)); // Keep max 20 notifications
      scheduleSuccessNotification(newNotification);
    }, Math.floor(Math.random() * 10000) + 5000);
    
    return () => {
      clearInterval(addInterval);
    };
  }, []);
  
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
