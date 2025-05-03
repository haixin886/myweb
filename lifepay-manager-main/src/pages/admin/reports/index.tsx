import React from "react";
import { Card } from "@/components/ui/card";

const ReportsPage = () => {
  return (
    <div className="h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">数据报表</h1>
      </div>

      <Card className="w-full">
        <div className="p-4">
          <p className="text-lg">数据报表功能正在开发中...</p>
          <p className="text-gray-500 mt-2">
            此页面将提供交易数据、用户增长、收入分析等报表功能。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
