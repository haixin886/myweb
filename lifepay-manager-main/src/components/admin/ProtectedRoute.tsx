import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
}

/**
 * 简化版受保护的路由组件
 * 只检查本地存储中是否有用户信息
 */
const ProtectedRoute = ({ 
  redirectPath = '/admin/login'
}: ProtectedRouteProps) => {
  // 检查本地存储中是否有用户信息
  const localStorageUser = localStorage.getItem('local_auth_user');
  const loginSuccess = localStorage.getItem('admin_login_success');
  
  // 如果本地存储中有用户信息或登录成功标记，则认为已登录
  const isAuthenticated = !!localStorageUser || !!loginSuccess;
  
  console.log('检查认证状态:', isAuthenticated ? '已登录' : '未登录');
  
  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    console.log('用户未登录，重定向到登录页面');
    return <Navigate to={redirectPath} replace />;
  }

  // 如果已认证，渲染子路由
  console.log('用户已登录，允许访问管理后台');
  return <Outlet />;
};

export default ProtectedRoute;
