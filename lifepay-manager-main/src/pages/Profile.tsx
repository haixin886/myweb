
import { useProfile } from "@/hooks/useProfile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { OrderStats } from "@/components/profile/OrderStats";
import { DigitalCurrencyCard } from "@/components/profile/DigitalCurrencyCard";
import { TransactionCenter } from "@/components/profile/TransactionCenter";
import BottomNav from "@/components/BottomNav";
import { useEffect } from "react";

const Profile = () => {
  const { profile, isLoading, orderStats, navigateTo, refreshProfile } = useProfile();

  useEffect(() => {
    // When component mounts, log to help with debugging
    console.log("Profile component mounted, loading state:", isLoading);
    console.log("Profile data:", profile);
  }, [isLoading, profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  // Fallback in case profile is still null after loading
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <p className="text-gray-500 mb-4">无法加载用户资料</p>
          <button 
            onClick={refreshProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{
      background: "linear-gradient(180deg, #4F95FF 0%, #5C9FFF 100%)"
    }}>
      <ProfileHeader 
        profile={profile} 
        onSettingsClick={() => navigateTo('/settings')} 
      />
      
      <OrderStats 
        orderStats={orderStats} 
        onNavigate={navigateTo} 
      />
      
      <DigitalCurrencyCard 
        onNavigate={navigateTo} 
      />
      
      <TransactionCenter 
        onNavigate={navigateTo} 
      />

      <BottomNav />
    </div>
  );
};

export default Profile;
