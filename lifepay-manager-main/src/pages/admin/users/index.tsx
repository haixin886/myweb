import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AddAdminUserSheet from './components/AddAdminUserSheet';

// 定义 Supabase 用户类型
interface SupabaseUser {
  id: string;
  email?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  user_metadata?: Record<string, any> | null;
}

// 定义管理员用户类型
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    is_admin: boolean;
    role?: string;
  };
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [isAddUserSheetOpen, setIsAddUserSheetOpen] = useState(false);

  // 获取管理员用户列表
  const { data: adminUsers, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        // 获取当前用户
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          throw new Error('未登录');
        }

        // 获取所有用户
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error('获取用户列表失败:', error);
          // 如果无法获取所有用户，至少返回当前用户
          return [{ 
            id: currentUser.id, 
            email: currentUser.email || '', 
            created_at: currentUser.created_at || '', 
            last_sign_in_at: currentUser.last_sign_in_at,
            user_metadata: currentUser.user_metadata as { is_admin: boolean; role?: string; }
          }];
        }
        
        if (!data || !data.users) {
          console.error('获取用户列表失败: 数据为空');
          return [];
        }
        
        // 过滤出管理员用户
        const typedUsers = data.users as SupabaseUser[];
        
        return typedUsers
          .filter(user => 
            (user.user_metadata && typeof user.user_metadata === 'object' && 'is_admin' in user.user_metadata && user.user_metadata.is_admin === true) || 
            (user.email && user.email === 'admin@example.com')
          )
          .map(user => ({
            id: user.id,
            email: user.email || '',
            created_at: user.created_at || '',
            last_sign_in_at: user.last_sign_in_at || null,
            user_metadata: (typeof user.user_metadata === 'object' ? user.user_metadata : {}) as { is_admin: boolean; role?: string; }
          }));
      } catch (error) {
        console.error('获取管理员用户列表失败:', error);
        // 备用方法：如果无法获取用户列表，尝试只获取当前用户
        const { data: { user } } = await supabase.auth.getUser();
        return user ? [{ 
          id: user.id, 
          email: user.email || '', 
          created_at: user.created_at || '', 
          last_sign_in_at: user.last_sign_in_at,
          user_metadata: user.user_metadata as { is_admin: boolean; role?: string; }
        }] : [];
      }
    },
  });

  // 删除管理员用户
  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userEmail === 'admin@example.com') {
      toast.error('不能删除初始管理员账号');
      return;
    }
    
    if (!confirm('确定要删除这个管理员用户吗？')) {
      return;
    }

    try {
      // 获取当前用户
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser?.id === userId) {
        toast.error('不能删除自己的账号');
        return;
      }

      // 删除用户
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error('删除管理员用户失败:', error);
        toast.error('删除管理员用户失败');
        return;
      }

      toast.success('管理员用户已删除');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    } catch (error) {
      console.error('删除管理员用户失败:', error);
      toast.error('删除管理员用户失败');
    }
  };

  const handleAddUserSuccess = () => {
    setIsAddUserSheetOpen(false);
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    toast.success('管理员用户已添加');
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">加载管理员用户列表失败</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>管理员用户管理</CardTitle>
          <Sheet open={isAddUserSheetOpen} onOpenChange={setIsAddUserSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="default">添加管理员</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>添加管理员用户</SheetTitle>
              </SheetHeader>
              <AddAdminUserSheet onSuccess={handleAddUserSuccess} />
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>邮箱</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers && adminUsers.length > 0 ? (
                adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.user_metadata?.role || '管理员'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : '从未登录'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        disabled={user.email === 'admin@example.com'} // 禁止删除初始管理员
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    没有管理员用户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
