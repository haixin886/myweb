import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { adminSupabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RefreshCw, Search } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
}

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
}

const PermissionsPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    setIsLoading(true);
    try {
      // 模拟权限数据
      const mockPermissions: Permission[] = [
        { id: "1", name: "查看用户", code: "user:view", description: "查看用户信息", module: "用户管理" },
        { id: "2", name: "编辑用户", code: "user:edit", description: "编辑用户信息", module: "用户管理" },
        { id: "3", name: "删除用户", code: "user:delete", description: "删除用户", module: "用户管理" },
        { id: "4", name: "查看订单", code: "order:view", description: "查看订单信息", module: "订单管理" },
        { id: "5", name: "处理订单", code: "order:process", description: "处理订单", module: "订单管理" },
        { id: "6", name: "查看支付", code: "payment:view", description: "查看支付信息", module: "支付管理" },
        { id: "7", name: "编辑支付", code: "payment:edit", description: "编辑支付信息", module: "支付管理" },
        { id: "8", name: "系统设置", code: "system:settings", description: "管理系统设置", module: "系统管理" },
        { id: "9", name: "查看日志", code: "system:logs", description: "查看系统日志", module: "系统管理" },
      ];
      
      // 模拟角色数据
      const mockRoles: Role[] = [
        { 
          id: "1", 
          name: "超级管理员", 
          description: "拥有所有权限", 
          permissions: mockPermissions.map(p => p.code),
          created_at: new Date().toISOString()
        },
        { 
          id: "2", 
          name: "订单管理员", 
          description: "管理订单相关功能", 
          permissions: ["order:view", "order:process"],
          created_at: new Date().toISOString()
        },
        { 
          id: "3", 
          name: "客服人员", 
          description: "处理客户服务请求", 
          permissions: ["user:view", "order:view"],
          created_at: new Date().toISOString()
        },
      ];

      setPermissions(mockPermissions);
      
      // 过滤角色
      let filteredRoles = mockRoles;
      if (searchTerm) {
        filteredRoles = mockRoles.filter(role => 
          role.name.includes(searchTerm) || 
          role.description.includes(searchTerm)
        );
      }
      
      setRoles(filteredRoles);
    } catch (error) {
      console.error('Error loading roles and permissions:', error);
      toast.error("加载角色和权限失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRolesAndPermissions();
  };

  const handleRefresh = () => {
    fetchRolesAndPermissions();
  };

  const handleCreateRole = async () => {
    if (!newRole.name) {
      toast.error("角色名称不能为空");
      return;
    }

    setIsLoading(true);
    try {
      // 模拟创建角色
      const newRoleId = `role-${Date.now()}`;
      const createdRole: Role = {
        id: newRoleId,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        created_at: new Date().toISOString()
      };
      
      setRoles(prev => [createdRole, ...prev]);
      setNewRole({ name: "", description: "", permissions: [] });
      setIsDialogOpen(false);
      toast.success("角色创建成功");
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("创建角色失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm("确定要删除这个角色吗？")) {
      return;
    }

    setIsLoading(true);
    try {
      // 模拟删除角色
      setRoles(prev => prev.filter(role => role.id !== id));
      toast.success("角色删除成功");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("删除角色失败");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (code: string) => {
    setNewRole(prev => {
      const permissions = prev.permissions.includes(code)
        ? prev.permissions.filter(p => p !== code)
        : [...prev.permissions, code];
      return { ...prev, permissions };
    });
  };

  // 按模块分组权限
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>权限管理</CardTitle>
              <CardDescription>管理系统角色和权限</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="text-white bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    新建角色
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新角色</DialogTitle>
                    <DialogDescription>
                      定义角色名称、描述和权限
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        角色名称
                      </Label>
                      <Input
                        id="name"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        className="col-span-3 text-black"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        角色描述
                      </Label>
                      <Input
                        id="description"
                        value={newRole.description}
                        onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                        className="col-span-3 text-black"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">
                        权限设置
                      </Label>
                      <div className="col-span-3 space-y-4">
                        {Object.entries(permissionsByModule).map(([module, perms]) => (
                          <div key={module} className="space-y-2">
                            <h4 className="font-medium">{module}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {perms.map(permission => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={permission.code}
                                    checked={newRole.permissions.includes(permission.code)}
                                    onCheckedChange={() => togglePermission(permission.code)}
                                  />
                                  <Label htmlFor={permission.code} className="cursor-pointer">
                                    {permission.name} ({permission.description})
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-white bg-gray-600 hover:bg-gray-700">取消</Button>
                    <Button onClick={handleCreateRole} disabled={isLoading} className="text-white bg-blue-600 hover:bg-blue-700">创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索角色名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-black"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button className="ml-2 text-white bg-blue-600 hover:bg-blue-700" onClick={handleSearch} disabled={isLoading}>
              搜索
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>角色名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>权限数量</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      没有找到角色
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.permissions.length}</TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleString('zh-CN')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 text-white bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            // 查看权限详情的功能
                            const permNames = role.permissions.map(code => {
                              const perm = permissions.find(p => p.code === code);
                              return perm ? perm.name : code;
                            });
                            alert(`${role.name}的权限:\n${permNames.join('\n')}`);
                          }}
                        >
                          查看权限
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-white"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={role.name === "超级管理员"} // 防止删除超级管理员
                        >
                          删除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsPage;
