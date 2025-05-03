import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminSupabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import useAuth from '@/hooks/use-local-auth';

// 表单验证模式
const formSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z
    .string()
    .min(6, { message: '密码至少需要6个字符' })
    .max(100, { message: '密码不能超过100个字符' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAdminUserSheetProps {
  onSuccess: () => void;
}

export default function AddAdminUserSheet({ onSuccess }: AddAdminUserSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // 首先尝试使用 Supabase 创建用户
      try {
        const { data: userData, error } = await adminSupabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true, // 自动确认邮箱
          user_metadata: {
            is_admin: true,
            role: 'admin',
          },
        });

        if (!error) {
          console.log('管理员用户通过 Supabase 创建成功:', userData);
          toast.success('管理员用户创建成功');
          form.reset();
          onSuccess();
          return;
        }
        
        console.warn('Supabase 创建用户失败，尝试使用本地认证:', error);
      } catch (supabaseError) {
        console.warn('Supabase 创建用户出错，尝试使用本地认证:', supabaseError);
      }
      
      // 如果 Supabase 失败，使用本地认证系统
      const result = await signUp(data.email, data.password, { is_admin: true });
      
      if ('error' in result) {
        console.error('创建管理员用户失败:', result.error);
        toast.error(`创建管理员用户失败: ${result.error.message}`);
        return;
      }
      
      console.log('管理员用户通过本地认证创建成功:', result.user);
      toast.success('管理员用户创建成功');
      
      // 重置表单
      form.reset();
      
      // 调用成功回调
      onSuccess();
    } catch (error) {
      console.error('创建管理员用户过程中出错:', error);
      toast.error('创建管理员用户失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="admin@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '正在添加...' : '添加管理员用户'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
