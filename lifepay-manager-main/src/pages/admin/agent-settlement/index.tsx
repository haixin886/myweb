import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AgentSettlementPage = () => {
  const [activeTab, setActiveTab] = useState("commission-rules");
  const [provinceRate, setProvinceRate] = useState("30");
  const [cityRate, setCityRate] = useState("20");
  const [districtRate, setDistrictRate] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [agentLevel, setAgentLevel] = useState("all");
  
  // 结算记录查询状态
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [settlementStatus, setSettlementStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // 添加特殊规则对话框状态
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false);
  
  // 处理保存规则按钮点击
  const handleSaveRules = () => {
    toast.success("分润规则保存成功");
  };
  
  // 处理添加特殊规则按钮点击
  const handleAddSpecialRule = () => {
    toast.info("添加特殊规则功能正在开发中...");
  };
  
  // 处理编辑规则按钮点击
  const handleEditRule = (agentName: string) => {
    toast.info(`正在编辑${agentName}的分润规则...`);
  };
  
  // 处理停用规则按钮点击
  const handleDisableRule = (agentName: string) => {
    toast.success(`${agentName}的分润规则已停用`);
  };
  
  // 处理查询按钮点击
  const handleSearch = () => {
    toast.success("查询条件已应用");
  };
  
  // 处理查看详情按钮点击
  const handleViewDetails = (settlementId: string) => {
    toast.info(`正在查看结算单${settlementId}的详情...`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">代理分润与结算</h1>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="commission-rules">分润规则</TabsTrigger>
            <TabsTrigger value="settlement-records">结算记录</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commission-rules" className="p-6 space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">默认分润规则</h2>
                <p className="text-gray-500 mb-4">
                  设置各级代理的默认分润比例
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">省级代理分润比例</label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={provinceRate}
                      onChange={(e) => setProvinceRate(e.target.value)}
                      className="w-full"
                      variant="dark"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">市级代理分润比例</label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={cityRate}
                      onChange={(e) => setCityRate(e.target.value)}
                      className="w-full"
                      variant="dark"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">区级代理分润比例</label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={districtRate}
                      onChange={(e) => setDistrictRate(e.target.value)}
                      className="w-full"
                      variant="dark"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="dark" onClick={handleSaveRules}>保存规则</Button>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">代理商特殊规则</h2>
                <p className="text-gray-500 mb-4">
                  为特定代理商设置自定义分润规则
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative max-w-sm">
                  <Input 
                    placeholder="搜索代理名称" 
                    className="pl-8"
                    variant="dark"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Select value={agentLevel} onValueChange={setAgentLevel}>
                  <SelectTrigger className="w-[180px] bg-black text-white border-gray-700">
                    <SelectValue placeholder="代理级别" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">全部级别</SelectItem>
                    <SelectItem value="province">省级代理</SelectItem>
                    <SelectItem value="city">市级代理</SelectItem>
                    <SelectItem value="district">区级代理</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="dark" onClick={handleAddSpecialRule}>添加特殊规则</Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>代理名称</TableHead>
                      <TableHead>代理级别</TableHead>
                      <TableHead>分润比例</TableHead>
                      <TableHead>生效时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">广州总代理</TableCell>
                      <TableCell>省级代理</TableCell>
                      <TableCell>35%</TableCell>
                      <TableCell>2023-01-15</TableCell>
                      <TableCell>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">生效中</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="dark" 
                            size="sm" 
                            className="w-16"
                            onClick={() => handleEditRule("广州总代理")}
                          >
                            编辑
                          </Button>
                          <Button 
                            variant="dark" 
                            size="sm" 
                            className="w-16"
                            onClick={() => handleDisableRule("广州总代理")}
                          >
                            停用
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">深圳市代理</TableCell>
                      <TableCell>市级代理</TableCell>
                      <TableCell>25%</TableCell>
                      <TableCell>2023-02-20</TableCell>
                      <TableCell>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">生效中</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="dark" 
                            size="sm" 
                            className="w-16"
                            onClick={() => handleEditRule("深圳市代理")}
                          >
                            编辑
                          </Button>
                          <Button 
                            variant="dark" 
                            size="sm" 
                            className="w-16"
                            onClick={() => handleDisableRule("深圳市代理")}
                          >
                            停用
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settlement-records" className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">结算记录查询</h2>
              <p className="text-gray-500 mb-4">
                查询代理商结算记录和详情
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">代理商</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="bg-black text-white border-gray-700">
                    <SelectValue placeholder="选择代理商" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">全部代理商</SelectItem>
                    <SelectItem value="gz">广州总代理</SelectItem>
                    <SelectItem value="sz">深圳市代理</SelectItem>
                    <SelectItem value="sh">上海代理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">结算状态</label>
                <Select value={settlementStatus} onValueChange={setSettlementStatus}>
                  <SelectTrigger className="bg-black text-white border-gray-700">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待结算</SelectItem>
                    <SelectItem value="processing">结算中</SelectItem>
                    <SelectItem value="completed">已结算</SelectItem>
                    <SelectItem value="failed">结算失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">结算时间</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    className="flex-1"
                    variant="dark"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span>-</span>
                  <Input 
                    type="date" 
                    className="flex-1"
                    variant="dark"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mb-6">
              <Button variant="dark" onClick={handleSearch}>查询</Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>结算单号</TableHead>
                    <TableHead>代理名称</TableHead>
                    <TableHead>结算金额(USDT)</TableHead>
                    <TableHead>结算周期</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>完成时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">SET20230115001</TableCell>
                    <TableCell>广州总代理</TableCell>
                    <TableCell>1,250.75</TableCell>
                    <TableCell>2023-01-01 至 2023-01-15</TableCell>
                    <TableCell>2023-01-16 10:30:00</TableCell>
                    <TableCell>2023-01-16 15:45:22</TableCell>
                    <TableCell>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">已结算</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="dark" 
                        size="sm"
                        onClick={() => handleViewDetails("SET20230115001")}
                      >
                        详情
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SET20230215001</TableCell>
                    <TableCell>深圳市代理</TableCell>
                    <TableCell>850.50</TableCell>
                    <TableCell>2023-02-01 至 2023-02-15</TableCell>
                    <TableCell>2023-02-16 09:15:00</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">结算中</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="dark" 
                        size="sm"
                        onClick={() => handleViewDetails("SET20230215001")}
                      >
                        详情
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SET20230301001</TableCell>
                    <TableCell>上海代理</TableCell>
                    <TableCell>2,100.25</TableCell>
                    <TableCell>2023-02-16 至 2023-02-28</TableCell>
                    <TableCell>2023-03-01 08:00:00</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">结算失败</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="dark" 
                        size="sm"
                        onClick={() => handleViewDetails("SET20230301001")}
                      >
                        详情
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AgentSettlementPage;
