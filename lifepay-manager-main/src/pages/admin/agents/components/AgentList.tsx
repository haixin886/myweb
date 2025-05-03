
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  level: string;
  regions: string[];
  balance: number;
  merchantCount: number;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastLogin: string;
}

const AgentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // 模拟获取代理列表
  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      try {
        // 实际项目中应该从数据库获取
        // 这里先使用模拟数据
        return [
          {
            id: "1",
            name: "广州总代理",
            level: "省级代理",
            regions: ["广东", "广州"],
            balance: 15000.75,
            merchantCount: 48,
            status: "active",
            createdAt: "2023-01-15T08:30:00Z",
            lastLogin: "2023-06-18T10:45:22Z"
          },
          {
            id: "2",
            name: "深圳市代理",
            level: "市级代理",
            regions: ["广东", "深圳"],
            balance: 8500.50,
            merchantCount: 26,
            status: "active",
            createdAt: "2023-02-20T14:15:00Z",
            lastLogin: "2023-06-17T16:30:15Z"
          },
          {
            id: "3",
            name: "上海代理",
            level: "省级代理",
            regions: ["上海"],
            balance: 22000.25,
            merchantCount: 52,
            status: "active",
            createdAt: "2022-11-05T09:45:00Z",
            lastLogin: "2023-06-18T09:12:33Z"
          },
          {
            id: "4",
            name: "成都新代理",
            level: "市级代理",
            regions: ["四川", "成都"],
            balance: 3000.00,
            merchantCount: 8,
            status: "pending",
            createdAt: "2023-05-28T11:20:00Z",
            lastLogin: "2023-06-15T14:25:10Z"
          },
          {
            id: "5",
            name: "北京代理",
            level: "省级代理",
            regions: ["北京"],
            balance: 0.00,
            merchantCount: 0,
            status: "suspended",
            createdAt: "2023-03-10T16:40:00Z",
            lastLogin: "2023-04-22T10:15:45Z"
          }
        ] as Agent[];
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("获取代理列表失败");
        return [];
      }
    }
  });

  const filteredAgents = agents?.filter(agent => 
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || agent.status === statusFilter) &&
    (levelFilter === "all" || agent.level === levelFilter)
  );

  // 使用 useMutation 处理状态更新
  const queryClient = useQueryClient();
  
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      // 实际项目中应该调用API更新数据库
      // 这里模拟API调用
      return new Promise<{id: string, status: string}>((resolve) => {
        setTimeout(() => {
          resolve({ id, status: newStatus });
        }, 500);
      });
    },
    onSuccess: (data) => {
      // 成功后直接更新当前列表数据
      if (agents) {
        const updatedAgents = agents.map(agent => 
          agent.id === data.id ? { ...agent, status: data.status } : agent
        );
        queryClient.setQueryData(['agents-list'], updatedAgents);
      }
    },
  });

  const handleToggleStatus = (id: string, currentStatus: string) => {
    // 根据当前状态决定新状态
    let newStatus = 'active';
    let statusMessage = '启用';
    
    if (currentStatus === 'active') {
      newStatus = 'suspended';
      statusMessage = '暂停';
    } else if (currentStatus === 'suspended' || currentStatus === 'pending') {
      newStatus = 'active';
      statusMessage = '启用';
    }
    
    // 立即显示提示，提升用户体验
    toast.promise(toggleStatusMutation.mutateAsync({ id, newStatus }), {
      loading: '正在更新代理状态...',
      success: `代理状态已${statusMessage}`,
      error: '操作失败，请稍后重试'
    });
  };

  const createAgentMutation = useMutation({
    mutationFn: async (agentData: any) => {
      // 实际项目中应该调用API保存到数据库
      // 这里模拟API调用
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          const newAgent = {
            id: Math.random().toString(36).substr(2, 9),
            name: agentData.name,
            level: agentData.level,
            regions: agentData.regions.split(',').map((r: string) => r.trim()),
            balance: 0,
            merchantCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          resolve(newAgent);
        }, 500);
      });
    },
    onSuccess: (newAgent) => {
      // 成功后直接更新当前列表数据
      const currentAgents = queryClient.getQueryData<Agent[]>(['agents-list']) || [];
      queryClient.setQueryData(['agents-list'], [...currentAgents, newAgent]);
    },
  });

  const [newAgentData, setNewAgentData] = useState({
    name: '',
    level: '市级代理',
    regions: '',
    contactName: '',
    contactPhone: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setNewAgentData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAgent = () => {
    // 表单验证
    if (!newAgentData.name) {
      toast.error('请输入代理名称');
      return;
    }
    
    if (!newAgentData.regions) {
      toast.error('请输入所属区域');
      return;
    }

    // 显示加载状态提示
    toast.promise(createAgentMutation.mutateAsync(newAgentData), {
      loading: '正在创建代理...',
      success: () => {
        setIsNewAgentDialogOpen(false);
        // 重置表单
        setNewAgentData({
          name: '',
          level: '市级代理',
          regions: '',
          contactName: '',
          contactPhone: '',
          password: ''
        });
        return '代理创建成功';
      },
      error: '创建失败，请稍后重试'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">正常</Badge>;
      case "suspended":
        return <Badge className="bg-red-500">已暂停</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">待审核</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">代理商列表</h2>
        <p className="text-gray-500 mb-6">
          管理平台代理商，查看代理状态和业务数据
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative max-w-sm">
            <Input 
              placeholder="搜索代理名称" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-black text-white border-gray-700">
              <SelectValue placeholder="代理状态" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">正常</SelectItem>
              <SelectItem value="suspended">已暂停</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px] bg-black text-white border-gray-700">
              <SelectValue placeholder="代理级别" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">全部级别</SelectItem>
              <SelectItem value="省级代理">省级代理</SelectItem>
              <SelectItem value="市级代理">市级代理</SelectItem>
              <SelectItem value="区级代理">区级代理</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isNewAgentDialogOpen} onOpenChange={setIsNewAgentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="min-w-[120px]" variant="dark">添加代理</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>创建新代理</DialogTitle>
              <DialogDescription>
                填写代理信息，创建新的代理商账户
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">代理名称</label>
                <Input 
                  placeholder="输入代理名称" 
                  variant="dark" 
                  value={newAgentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">代理级别</label>
                <Select 
                  value={newAgentData.level} 
                  onValueChange={(value) => handleInputChange('level', value)}
                >
                  <SelectTrigger className="bg-black text-white border-gray-700">
                    <SelectValue placeholder="选择代理级别" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="省级代理">省级代理</SelectItem>
                    <SelectItem value="市级代理">市级代理</SelectItem>
                    <SelectItem value="区级代理">区级代理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">所属区域</label>
                <Input 
                  placeholder="输入所属区域，多个区域用逗号分隔" 
                  variant="dark" 
                  value={newAgentData.regions}
                  onChange={(e) => handleInputChange('regions', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">联系人姓名</label>
                <Input 
                  placeholder="输入联系人姓名" 
                  variant="dark" 
                  value={newAgentData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">联系电话</label>
                <Input 
                  placeholder="输入联系电话" 
                  variant="dark" 
                  value={newAgentData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">初始密码</label>
                <Input 
                  type="password" 
                  placeholder="设置初始登录密码" 
                  variant="dark" 
                  value={newAgentData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAgent} variant="dark">创建代理</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>代理名称</TableHead>
              <TableHead>代理级别</TableHead>
              <TableHead>管辖区域</TableHead>
              <TableHead className="text-right">账户余额(USDT)</TableHead>
              <TableHead className="text-right">管理商户数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后登录</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredAgents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  未找到符合条件的代理
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents?.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.level}</TableCell>
                  <TableCell>{agent.regions.join(", ")}</TableCell>
                  <TableCell className="text-right">${agent.balance.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{agent.merchantCount}</TableCell>
                  <TableCell>{getStatusBadge(agent.status)}</TableCell>
                  <TableCell>{formatDate(agent.createdAt)}</TableCell>
                  <TableCell>{formatDate(agent.lastLogin)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="dark" 
                        size="sm" 
                        disabled={false} /* 移除禁用状态 */
                        onClick={() => handleToggleStatus(agent.id, agent.status)}
                        className="w-16"
                      >
                        {agent.status === "active" ? "暂停" : "启用"}
                      </Button>
                      <Button 
                        variant="dark" 
                        size="sm"
                        className="w-16"
                        onClick={() => {
                          // 打开详情弹窗
                          setSelectedAgent(agent);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 代理详情对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>代理详情</DialogTitle>
            <DialogDescription>
              查看代理商详细信息和业务数据
            </DialogDescription>
          </DialogHeader>
          
          {selectedAgent && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">代理名称</h3>
                  <p className="mt-1">{selectedAgent.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">代理级别</h3>
                  <p className="mt-1">{selectedAgent.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">管辖区域</h3>
                  <p className="mt-1">{selectedAgent.regions.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">账户余额</h3>
                  <p className="mt-1">${selectedAgent.balance.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">管理商户数</h3>
                  <p className="mt-1">{selectedAgent.merchantCount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">状态</h3>
                  <p className="mt-1">{getStatusBadge(selectedAgent.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">创建时间</h3>
                  <p className="mt-1">{formatDate(selectedAgent.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">最后登录</h3>
                  <p className="mt-1">{formatDate(selectedAgent.lastLogin)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium">业务数据统计</h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-gray-500 text-sm">本月交易额</p>
                    <p className="text-lg font-semibold">$12,450.75</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-gray-500 text-sm">本月新增商户</p>
                    <p className="text-lg font-semibold">8</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-gray-500 text-sm">本月订单数</p>
                    <p className="text-lg font-semibold">156</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="dark" onClick={() => setIsDetailDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentList;
