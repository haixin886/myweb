
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfitRulesConfig from "./components/ProfitRulesConfig";
import SettlementSystem from "./components/SettlementSystem";
import ProfitReports from "./components/ProfitReports";
import ExchangeRateManagement from "./components/ExchangeRateManagement";

const AgentProfitPage = () => {
  const [activeTab, setActiveTab] = useState("profit-rules");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分润与结算系统</h1>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profit-rules">分润规则</TabsTrigger>
            <TabsTrigger value="exchange-rates">汇率管理</TabsTrigger>
            <TabsTrigger value="settlement">自动结算</TabsTrigger>
            <TabsTrigger value="reports">对账报表</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profit-rules" className="p-4">
            <ProfitRulesConfig />
          </TabsContent>
          
          <TabsContent value="exchange-rates" className="p-4">
            <ExchangeRateManagement />
          </TabsContent>
          
          <TabsContent value="settlement" className="p-4">
            <SettlementSystem />
          </TabsContent>
          
          <TabsContent value="reports" className="p-4">
            <ProfitReports />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AgentProfitPage;
