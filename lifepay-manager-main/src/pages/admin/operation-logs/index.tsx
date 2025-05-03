import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { adminSupabase } from "@/integrations/supabase/client";
import { RefreshCw, Search } from "lucide-react";

interface OperationLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target: string;
  details: string;
  ip_address: string;
  created_at: string;
}

const OperationLogsPage = () => {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // 使用模拟数据，实际应用中应该从数据库获取
      const mockLogs: OperationLog[] = Array(20).fill(null).map((_, index) => ({
        id: `log-${index + 1}`,
        admin_id: `admin-${Math.floor(Math.random() * 5) + 1}`,
        admin_name: `管理员${Math.floor(Math.random() * 5) + 1}`,
        action: ['登录', '修改设置', '添加用户', '删除记录', '更新配置'][Math.floor(Math.random() * 5)],
        target: ['系统', '用户', '配置', '支付地址', '订单'][Math.floor(Math.random() * 5)],
        details: `操作详情 ${index + 1}`,
        ip_address: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      // 模拟搜索和分页
      let filteredLogs = mockLogs;
      if (searchTerm) {
        filteredLogs = mockLogs.filter(log => 
          log.admin_name.includes(searchTerm) || 
          log.action.includes(searchTerm) || 
          log.target.includes(searchTerm) || 
          log.details.includes(searchTerm)
        );
      }
      
      setTotalPages(Math.ceil(filteredLogs.length / pageSize));
      
      // 分页
      const startIndex = (page - 1) * pageSize;
      const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);
      
      setLogs(paginatedLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error("加载操作日志失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchLogs();
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>操作日志</CardTitle>
              <CardDescription>查看系统操作记录</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="text-white bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索管理员、操作类型、目标或详情..."
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
                  <TableHead>管理员</TableHead>
                  <TableHead>操作类型</TableHead>
                  <TableHead>操作目标</TableHead>
                  <TableHead>详情</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      没有找到操作日志
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.admin_name}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>{log.ip_address}</TableCell>
                      <TableCell>{formatDate(log.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                上一页
              </Button>
              <span>
                第 {page} 页，共 {totalPages} 页
              </span>
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                下一页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationLogsPage;
