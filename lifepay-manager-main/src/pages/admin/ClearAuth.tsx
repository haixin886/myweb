import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const ClearAuth = () => {
  const navigate = useNavigate();

  const clearAuthData = () => {
    try {
      // 清除所有与认证相关的本地存储
      localStorage.removeItem('local_auth_user');
      localStorage.removeItem('admin_login_success');
      localStorage.removeItem('auth_user');
      
      // 显示成功消息
      toast.success('认证数据已清除，即将跳转到登录页面');
      
      // 延迟1秒后跳转到登录页面
      setTimeout(() => {
        navigate('/admin/login');
      }, 1000);
    } catch (error) {
      console.error('清除认证数据失败:', error);
      toast.error('清除认证数据失败');
    }
  };

  useEffect(() => {
    // 组件加载时自动清除认证数据
    clearAuthData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">正在清除认证数据</h2>
        <p className="mb-4">如果页面没有自动跳转，请点击下方按钮</p>
        <Button onClick={() => navigate('/admin/login')}>
          前往登录页面
        </Button>
      </Card>
    </div>
  );
};

export default ClearAuth;
