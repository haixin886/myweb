
import { cn } from "@/lib/utils";

interface StatusTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const StatusTabs = ({ selectedTab, setSelectedTab }: StatusTabsProps) => {
  return (
    <div className="px-4 bg-white">
      <div className="flex space-x-6 border-b border-gray-200 bg-white">
        {["pending", "processing", "completed", "cancelled", "all"].map((tab) => (
          <button
            key={tab}
            className={cn(
              "pb-2 text-sm bg-white",
              selectedTab === tab ? "text-[#3182f6] border-b-2 border-[#3182f6] font-medium" : "text-gray-700"
            )}
            onClick={() => setSelectedTab(tab)}
          >
            {tab === "pending" ? "待充值" :
             tab === "processing" ? "充值中" :
             tab === "completed" ? "已完成" :
             tab === "cancelled" ? "已取消" : "全部"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusTabs;
