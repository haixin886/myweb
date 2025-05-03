import { useState, useEffect, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";

export const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to meet UserProfile interface requirements
      const typedData: UserProfile[] = (data || []).map(user => ({
        id: user.id,
        username: user.username || '',
        phone: user.phone || '',
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
        balance: user.balance || 0,
        invite_code: user.invite_code || '',
        online_status: user.online_status || false,
        created_at: user.created_at,
        updated_at: user.updated_at
      }));
      
      setUsers(typedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "加载用户失败",
        description: "无法获取用户数据，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 过滤用户
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="搜索用户..."
            className="w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button onClick={fetchUsers}>刷新</Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>电话</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>余额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  未找到用户
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.id.slice(0, 8)}...</TableCell>
                  <TableCell>{user.username || '未设置'}</TableCell>
                  <TableCell>{user.phone || '未设置'}</TableCell>
                  <TableCell>{user.full_name || '未设置'}</TableCell>
                  <TableCell>{user.balance?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.online_status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.online_status ? '在线' : '离线'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      详情
                    </Button>
                    <Button variant="destructive" size="sm">
                      禁用
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;
