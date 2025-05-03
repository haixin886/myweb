import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AgentSettlement = () => {
  const [activeTab, setActiveTab] = React.useState("commission-rules");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">分润与结算</h2>
        <p className="text-gray-500 mb-6">
          管理代理商分润规则和结算记录
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="commission-rules">分润规则</TabsTrigger>
          <TabsTrigger value="settlement-records">结算记录</TabsTrigger>
        </TabsList>
        
        <TabsContent value="commission-rules" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">默认分润规则</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">省级代理分润比例</label>
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    defaultValue="30" 
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
                    defaultValue="20" 
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
                    defaultValue="10" 
                    className="w-full"
                    variant="dark"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="dark">保存规则</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">代理商特殊规则</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative max-w-sm">
                <Input 
                  placeholder="搜索代理名称" 
                  className="pl-8"
                  variant="dark"
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
              <Select defaultValue="all">
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
              <Button variant="dark">添加特殊规则</Button>
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
                        <Button variant="dark" size="sm" className="w-16">编辑</Button>
                        <Button variant="dark" size="sm" className="w-16">停用</Button>
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
                        <Button variant="dark" size="sm" className="w-16">编辑</Button>
                        <Button variant="dark" size="sm" className="w-16">停用</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="settlement-records" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">结算记录查询</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">代理商</label>
                <Select defaultValue="all">
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
                <Select defaultValue="all">
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
                  />
                  <span>-</span>
                  <Input 
                    type="date" 
                    className="flex-1"
                    variant="dark"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mb-6">
              <Button variant="dark">查询</Button>
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
                      <Button variant="dark" size="sm">详情</Button>
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
                      <Button variant="dark" size="sm">详情</Button>
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
                      <Button variant="dark" size="sm">详情</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentSettlement;
