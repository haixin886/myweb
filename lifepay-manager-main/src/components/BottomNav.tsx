
import {
  HomeIcon,
  ClipboardListIcon,
  ReceiptIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRotating, setIsRotating] = useState(false);

  const navItems = [
    { name: "首页", icon: HomeIcon, path: "/dashboard" },
    { name: "在线订单", icon: ClipboardListIcon, path: "/orders" },
    { name: "缴费订单", icon: ReceiptIcon, path: "/payment/orders" },
    { name: "商户中心", icon: UserIcon, path: "/profile" },
  ];

  const isWalletActive = location.pathname === '/wallet';

  const handleCenterButtonClick = () => {
    setIsRotating(true);
    navigate('/wallet');
    setTimeout(() => setIsRotating(false), 800); // 动画完成后重置状态
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative h-[66px]">
        {/* 背景图 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url("/lovable-uploads/bc3040cd-1705-4559-b1dd-c7a4532803c3.png")' }}
        ></div>
        
        {/* 中间按钮的透明凹陷区域 - 创建一个圆形透明区域 */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80px] h-[40px] overflow-hidden z-10">
          <div className="w-[80px] h-[80px] rounded-full bg-transparent border-[16px] border-[#0000] -mt-[40px]"></div>
        </div>
        
        {/* 导航按钮 - 调整位置 */}
        <div className="relative z-10 grid grid-cols-4 w-full h-full">
          {navItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center h-full ${
                index === 0 ? 'ml-[-8px]' : // 首页按钮向左移动
                index === 1 ? 'ml-[-12px] mr-10' : // 在线订单按钮向左移动更多，增加与中间按钮的间距
                index === 2 ? 'ml-10 mr-[-12px]' : // 缴费订单按钮向右移动更多，增加与中间按钮的间距
                index === 3 ? 'mr-[-8px]' : '' // 商户中心按钮向右移动
              }`}
            >
              <item.icon 
                className={`w-6 h-6 transition-all duration-200 ${
                  location.pathname === item.path 
                    ? 'text-[#3182f6] -translate-y-1.5' 
                    : 'text-gray-400'
                }`} 
              />
              <span className={`text-xs transition-colors duration-200 ${
                location.pathname === item.path ? 'text-[#3182f6]' : 'text-gray-400'
              }`}>
                {item.name}
              </span>
            </button>
          ))}
        </div>
        
        {/* 中间的钱包按钮 - 3D浮动效果 */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-20">
          {/* 阴影效果增强3D感 */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[60px] h-[10px] rounded-full bg-black/20 blur-md z-10"></div>
          
          <button
            onClick={handleCenterButtonClick}
            className={`w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-lg transform transition-all hover:scale-105 active:scale-95 ${
              isWalletActive 
                ? 'bg-[#ff9500]' 
                : 'bg-[#4f95ff]'
            }`}
            style={{ 
              boxShadow: '0 8px 16px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1)' 
            }}
          >
            <WalletIcon 
              className={`w-10 h-10 transition-transform duration-700 ${
                isWalletActive 
                  ? 'text-[#4f95ff]'
                  : 'text-white'
              } ${isRotating ? 'animate-[spin_0.8s_ease-in-out]' : ''}`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
