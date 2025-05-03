import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
}

/**
 * 受保护的路由组件
 * 用于保护需要认证才能访问的路由
 */
const ProtectedRoute = ({ 
  redirectPath = '/admin/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 检查用户是否有权限
  const checkAdminPermission = () => {
    if (!user) {
      console.log('未登录用户，无权限');
      return false;
    }

    console.log('检查管理员权限:', user.email);
    console.log('用户元数据:', user.user_metadata);

    // 检查用户是否有管理员权限
    // 如果是 admin@example.com 或者用户元数据中有 is_admin 标记，则允许访问
    if (user.email === 'admin@example.com') {
      console.log('默认管理员账号，允许访问');
      return true;
    }
    
    const isAdmin = user.user_metadata?.is_admin === true;
    console.log('管理员检查结果:', isAdmin);
    return isAdmin;
  };

  // 如果正在加载认证状态，显示加载指示器
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    console.log('用户未登录，重定向到登录页面');
    return <Navigate to={redirectPath} replace />;
  }
  
  // 检查是否有管理员权限
  const hasAdminPermission = checkAdminPermission();
  
  // 如果没有管理员权限，重定向到登录页面
  if (!hasAdminPermission) {
    console.log('用户没有管理员权限，重定向到登录页面');
    return <Navigate to={redirectPath} replace />;
  }

  // 如果已认证且有管理员权限，渲染子路由
  console.log('用户有管理员权限，允许访问');
  return <Outlet />;
};

export default ProtectedRoute;
