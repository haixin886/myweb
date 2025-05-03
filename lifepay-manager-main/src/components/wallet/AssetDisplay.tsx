
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssetDisplayProps {
  isLoading: boolean;
  userProfile: { balance?: number } | undefined;
}

export const AssetDisplay = ({ isLoading, userProfile }: AssetDisplayProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-6 md:mt-8">
      <h2 className="text-center text-gray-600 mb-4 md:mb-6">我的资产</h2>
      <div className={`relative mx-auto rounded-full overflow-hidden ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}>
        <div className="absolute inset-0 bg-blue-500">
          <div className="liquid-circle absolute top-[-50%] left-0 w-full h-[200%] bg-[#4973ff] transition-all duration-500">
            <div className="absolute top-0 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-3/4 bg-[rgba(255,255,255,0.4)] rounded-[45%] animate-[circle-wave1_5s_linear_infinite]"></div>
            <div className="absolute top-0 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-3/4 bg-[rgba(255,255,255,0.2)] rounded-[40%] animate-[circle-wave2_7s_linear_infinite]"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {isLoading ? (
            <span className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-white`}>loading...</span>
          ) : (
            <>
              <span className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-white`}>
                {userProfile?.balance?.toFixed(2) || '0.00'}
              </span>
              <span className="text-white/90 mt-2">总资产(USDT)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
