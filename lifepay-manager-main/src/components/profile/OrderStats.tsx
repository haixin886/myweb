
interface OrderStats {
  phoneRechargeCount: number;
  queryOrderCount: number;
}

interface OrderStatsProps {
  orderStats: OrderStats;
  onNavigate: (path: string) => void;
}

export const OrderStats = ({ orderStats, onNavigate }: OrderStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mx-5">
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-500">{orderStats.phoneRechargeCount}</div>
            <div className="text-gray-600 text-sm mt-1">缴费订单</div>
          </div>
          <button onClick={() => onNavigate('/orders')} className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm">
            查看
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-500">{orderStats.queryOrderCount}</div>
            <div className="text-gray-600 text-sm mt-1">查询订单</div>
          </div>
          <button onClick={() => onNavigate('/query-orders')} className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm">
            查看
          </button>
        </div>
      </div>
    </div>
  );
};
