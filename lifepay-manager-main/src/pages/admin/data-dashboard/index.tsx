
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentPerformance from "./components/AgentPerformance";
import GeographicAnalysis from "./components/GeographicAnalysis";
import CustomAlerts from "./components/CustomAlerts";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import StatisticsOverview from "./components/StatisticsOverview";

const DataDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("statistics-overview");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">数据看板</h1>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="statistics-overview">统计概览</TabsTrigger>
            <TabsTrigger value="agent-performance">代理绩效</TabsTrigger>
            <TabsTrigger value="geographic-analysis">地理分析</TabsTrigger>
            <TabsTrigger value="custom-alerts">自定义预警</TabsTrigger>
            <TabsTrigger value="root-cause-analysis">根因分析</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics-overview" className="p-4">
            <StatisticsOverview />
          </TabsContent>
          
          <TabsContent value="agent-performance" className="p-4">
            <AgentPerformance />
          </TabsContent>
          
          <TabsContent value="geographic-analysis" className="p-4">
            <GeographicAnalysis />
          </TabsContent>
          
          <TabsContent value="custom-alerts" className="p-4">
            <CustomAlerts />
          </TabsContent>
          
          <TabsContent value="root-cause-analysis" className="p-4">
            <RootCauseAnalysis />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DataDashboardPage;
