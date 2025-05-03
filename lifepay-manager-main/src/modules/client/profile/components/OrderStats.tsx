
interface OrderStatsProps {
  onNavigate: (path: string) => void;
}

export const OrderStats = ({ onNavigate }: OrderStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mx-4 mt-4">
      <div className="bg-white rounded-lg p-4 cursor-pointer" onClick={() => onNavigate('/orders')}>
        <div className="text-lg font-bold">5</div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">三网订单</span>
          <span className="text-blue-500">查看 &gt;</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 cursor-pointer" onClick={() => onNavigate('/query-orders')}>
        <div className="text-lg font-bold">0</div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">查询订单</span>
          <span className="text-blue-500">查看 &gt;</span>
        </div>
      </div>
    </div>
  );
};
