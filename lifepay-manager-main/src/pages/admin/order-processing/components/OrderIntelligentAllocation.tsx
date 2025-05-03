
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomSwitch } from "@/components/ui/custom-switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Agent {
  id: string;
  nickname: string;
  success_rate: number;
  response_time: number;
  regions: string[];
  product_types: string[];
  is_active: boolean;
}

const OrderIntelligentAllocation = () => {
  const queryClient = useQueryClient();
  const [isAutoAllocation, setIsAutoAllocation] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedProductType, setSelectedProductType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [ruleConfig, setRuleConfig] = useState({
    maxOrdersPerDay: 100,
    priorityLevel: 5,
    autoRejectTimeout: 30
  });

  // 模拟获取代理列表
  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      try {
        // 实际项目中应该从数据库获取
        // 这里先使用模拟数据
        return [
          {
            id: "1",
            nickname: "广州代理A",
            success_rate: 98.5,
            response_time: 5.2,
            regions: ["广东", "广州"],
            product_types: ["话费", "流量卡"],
            is_active: true
          },
          {
            id: "2",
            nickname: "深圳代理B",
            success_rate: 97.2,
            response_time: 8.4,
            regions: ["广东", "深圳"],
            product_types: ["游戏点卡", "视频会员"],
            is_active: true
          },
          {
            id: "3",
            nickname: "上海代理C",
            success_rate: 95.8,
            response_time: 6.5,
            regions: ["上海"],
            product_types: ["话费", "电费"],
            is_active: false
          }
        ] as Agent[];
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("获取代理列表失败");
        return [];
      }
    }
  });

  const regions = ["广东", "广州", "深圳", "上海"];
  const productTypes = ["话费", "流量卡", "游戏点卡", "视频会员", "电费"];

  const filteredAgents = agents?.filter(agent => 
    (selectedRegion === "all" || agent.regions.includes(selectedRegion)) &&
    (selectedProductType === "all" || agent.product_types.includes(selectedProductType)) &&
    (searchTerm === "" || agent.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleAgentActive = (agentId: string, isActive: boolean) => {
    // 在实际项目中，这里应该调用API更新数据库
    // 这里我们直接更新本地状态以实现UI响应
    const updatedAgents = agents?.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, is_active: isActive };
      }
      return agent;
    });
    
    // 手动更新查询缓存，使UI立即响应
    queryClient.setQueryData(["agents"], updatedAgents);
    toast.success(`代理状态已${isActive ? '启用' : '禁用'}`);
  };

  const handleRuleConfigClick = (agentId: string) => {
    const agent = agents?.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      // 设置初始规则配置（在实际项目中，这些值应该从数据库获取）
      setRuleConfig({
        maxOrdersPerDay: 100,
        priorityLevel: agent.success_rate > 95 ? 8 : 5,
        autoRejectTimeout: 30
      });
      setIsRuleDialogOpen(true);
    }
  };
  
  const saveRuleConfig = () => {
    if (!selectedAgent) return;
    
    // 在实际项目中，这里应该调用API保存规则配置到数据库
    toast.success(`已保存 ${selectedAgent.nickname} 的规则配置`);
    setIsRuleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">智能订单分配</h2>
          <p className="text-gray-500">
            系统根据代理处理能力（历史成功率、响应速度）自动分配订单，提升处理效率
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">智能分配</span>
          <CustomSwitch 
            checked={isAutoAllocation} 
            onCheckedChange={setIsAutoAllocation} 
          />
        </div>
      </div>

      <Card className="p-4">
        <h3 className="text-md font-medium mb-4">分配规则配置</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">区域筛选</label>
            <Select 
              value={selectedRegion} 
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger className="bg-black text-white">
                <SelectValue placeholder="选择区域" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md">
                <SelectItem value="all">全部区域</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">商品类型</label>
            <Select 
              value={selectedProductType} 
              onValueChange={setSelectedProductType}
            >
              <SelectTrigger className="bg-black text-white">
                <SelectValue placeholder="选择商品类型" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md">
                <SelectItem value="all">全部类型</SelectItem>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">搜索代理</label>
            <Input 
              placeholder="输入代理名称" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="dark"
            />
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>代理名称</TableHead>
                <TableHead>负责区域</TableHead>
                <TableHead>商品类型</TableHead>
                <TableHead className="text-right">历史成功率</TableHead>
                <TableHead className="text-right">平均响应时间(分钟)</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : filteredAgents?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    未找到符合条件的代理
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents?.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.nickname}</TableCell>
                    <TableCell>{agent.regions.join(", ")}</TableCell>
                    <TableCell>{agent.product_types.join(", ")}</TableCell>
                    <TableCell className="text-right">{agent.success_rate}%</TableCell>
                    <TableCell className="text-right">{agent.response_time}</TableCell>
                    <TableCell>
                      <CustomSwitch 
                        checked={agent.is_active} 
                        onCheckedChange={(checked) => toggleAgentActive(agent.id, checked)} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="dark" size="sm" onClick={() => handleRuleConfigClick(agent.id)}>
                        规则配置
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* 规则配置对话框 */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedAgent?.nickname} 的规则配置</DialogTitle>
            <DialogDescription>
              配置此代理的订单处理规则和优先级
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>每日最大订单量: {ruleConfig.maxOrdersPerDay}</Label>
                <span className="text-sm text-muted-foreground">
                  当前值：{ruleConfig.maxOrdersPerDay}
                </span>
              </div>
              <Slider 
                value={[ruleConfig.maxOrdersPerDay]} 
                min={10} 
                max={500} 
                step={10} 
                onValueChange={(value) => setRuleConfig(prev => ({ ...prev, maxOrdersPerDay: value[0] }))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>优先级: {ruleConfig.priorityLevel}</Label>
                <span className="text-sm text-muted-foreground">
                  当前值：{ruleConfig.priorityLevel} (1-10)
                </span>
              </div>
              <Slider 
                value={[ruleConfig.priorityLevel]} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={(value) => setRuleConfig(prev => ({ ...prev, priorityLevel: value[0] }))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>自动拒绝超时(分钟): {ruleConfig.autoRejectTimeout}</Label>
                <span className="text-sm text-muted-foreground">
                  当前值：{ruleConfig.autoRejectTimeout}
                </span>
              </div>
              <Slider 
                value={[ruleConfig.autoRejectTimeout]} 
                min={5} 
                max={120} 
                step={5} 
                onValueChange={(value) => setRuleConfig(prev => ({ ...prev, autoRejectTimeout: value[0] }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>取消</Button>
            <Button onClick={saveRuleConfig}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderIntelligentAllocation;
