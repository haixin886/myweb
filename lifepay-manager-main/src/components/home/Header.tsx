
import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { DashboardMenu } from "./DashboardMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white py-2 px-4 flex items-center shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </button>
        </SheetTrigger>
        <DashboardMenu />
      </Sheet>
      <h1 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold flex-1 text-center`}>首页</h1>
    </div>
  );
};
