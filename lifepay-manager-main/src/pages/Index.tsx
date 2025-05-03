
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { Header } from "@/components/home/Header";
import { RechargeCards } from "@/components/home/RechargeCards";
import { ServiceList } from "@/components/home/ServiceList";
import { RechargeNotifications } from "@/components/home/RechargeNotifications";
import { OnlineUserCount } from "@/components/home/OnlineUserCount";
import BottomNav from "@/components/BottomNav";
import { DashboardMenu } from "@/components/home/DashboardMenu";
import { Stats } from "@/components/home/Stats";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample banner data
const banners = [
  { id: 1, image: "/lovable-uploads/ce6cbed5-30d5-4e14-93f2-00062abcb167.png", alt: "Banner 1" },
  { id: 2, image: "/lovable-uploads/81a79d97-e565-47d9-ad20-925851dadcc5.png", alt: "Banner 2" },
  { id: 3, image: "/lovable-uploads/ce6cbed5-30d5-4e14-93f2-00062abcb167.png", alt: "Banner 3" }
];

// Sample service data
const services = [
  { id: 1, title: "信用卡还款", description: "快速还款安全可靠", link: "/credit-card" },
  { id: 2, title: "花呗分期还款", description: "正规渠道安全放心", link: "/huabei-repayment" },
  { id: 3, title: "抖音币充值", description: "快速到账低于市价", link: "/douyin-coin" },
  { id: 4, title: "快手币充值", description: "正规渠道安全可靠", link: "/kuaishou-coin" },
  { id: 5, title: "网易游戏充值", description: "自动充值安全放心", link: "/netease-game" },
  { id: 6, title: "京东E卡", description: "折扣优惠正品保障", link: "/product/jd-card" },
  { id: 7, title: "加油卡充值", description: "正规充值便捷快速", link: "/oil-card" },
  { id: 8, title: "燃气费", description: "安全充值便捷快速", link: "/gas-fee" },
  { id: 9, title: "放心贷", description: "快速放款安全可靠", link: "/fangxin-loan" },
  { id: 10, title: "在线客服", description: "7x24小时专业服务", link: "/support" }
];

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`pb-16 bg-gray-100 min-h-screen ${isMobile ? 'max-w-full' : 'max-w-7xl mx-auto'}`}>
      <Header />
      <BannerCarousel banners={banners} />
      
      {/* Add the online user count and recharge notifications */}
      <div className={`${isMobile ? 'px-3 pt-2' : 'px-4 pt-3'}`}>
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

export default Index;
