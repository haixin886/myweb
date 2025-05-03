
import React from "react";
import { useNavigate } from "react-router-dom";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { RechargeCards } from "@/components/home/RechargeCards";
import { ServiceList } from "@/components/home/ServiceList";
import { OnlineUserCount } from "@/components/home/OnlineUserCount";
import { RechargeNotifications } from "@/components/home/RechargeNotifications";
import { Header } from "@/components/home/Header";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const banners = [
    {
      id: 1,
      image: "/lovable-uploads/ce6cbed5-30d5-4e14-93f2-00062abcb167.png",
      alt: "创新携手共赢"
    },
    {
      id: 2,
      image: "/lovable-uploads/81a79d97-e565-47d9-ad20-925851dadcc5.png",
      alt: "5G科技"
    }
  ];
  
  const services = [{
    id: 1,
    title: "1-5w信用卡",
    description: "6.5折代还",
    link: "/credit-card"
  }, {
    id: 4,
    title: "花呗代还",
    description: "8折代还",
    link: "/huabei-repayment"
  }, {
    id: 5,
    title: "抖币充值",
    description: "七折充值",
    link: "/douyin-coin"
  }, {
    id: 6,
    title: "快币充值",
    description: "七折充值",
    link: "/kuaishou-coin"
  }, {
    id: 7,
    title: "网易游戏",
    description: "8.5折充值",
    link: "/netease-game"
  }, {
    id: 11,
    title: "石化加油卡",
    description: "暂停充值消化库存",
    link: "/oil-card"
  }, {
    id: 12,
    title: "燃气缴费",
    description: "燃气缴费",
    link: "/gas-fee"
  }, {
    id: 13,
    title: "放心借",
    description: "抖音放心借",
    link: "/fangxin-loan"
  }];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <BannerCarousel banners={banners} />
      
      {/* Add the online user count and recharge notifications */}
      <div className="px-4 pt-3">
        <div className="space-y-2">
          <OnlineUserCount />
          <RechargeNotifications />
        </div>
      </div>
      
      <RechargeCards />
      <ServiceList services={services} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
