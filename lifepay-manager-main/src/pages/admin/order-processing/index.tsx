
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderIntelligentAllocation from "./components/OrderIntelligentAllocation";
import OrderGrabbingSystem from "./components/OrderGrabbingSystem";
import BatchProcessing from "./components/BatchProcessing";
import ApiFailoverSystem from "./components/ApiFailoverSystem";

const OrderProcessingCenter = () => {
  const [activeTab, setActiveTab] = useState("intelligent-allocation");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">订单处理中心</h1>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="intelligent-allocation">智能分配</TabsTrigger>
            <TabsTrigger value="order-grab">抢单机制</TabsTrigger>
            <TabsTrigger value="batch-processing">批量操作</TabsTrigger>
            <TabsTrigger value="api-failover">API容错机制</TabsTrigger>
          </TabsList>
          
          <TabsContent value="intelligent-allocation" className="p-4">
            <OrderIntelligentAllocation />
          </TabsContent>
          
          <TabsContent value="order-grab" className="p-4">
            <OrderGrabbingSystem />
          </TabsContent>
          
          <TabsContent value="batch-processing" className="p-4">
            <BatchProcessing />
          </TabsContent>
          
          <TabsContent value="api-failover" className="p-4">
            <ApiFailoverSystem />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default OrderProcessingCenter;
