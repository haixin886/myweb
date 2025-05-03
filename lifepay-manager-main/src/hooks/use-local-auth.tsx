import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// 定义用户类型
interface User {
  id: string;
  email: string;
  user_metadata: {
    is_admin: boolean;
    role?: string;
  };
  created_at: string;
}

// 认证上下文类型
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: { is_admin: boolean }) => Promise<{ user: User } | { error: any }>;
  getUsers: () => User[];
  deleteUser: (userId: string) => Promise<{ success: boolean } | { error: any }>;
  updateUser: (data: any) => Promise<void>;
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 默认管理员用户
const DEFAULT_ADMIN: User = {
  id: '1',
  email: 'admin@example.com',
  user_metadata: {
    is_admin: true,
    role: 'admin'
  },
  created_at: new Date().toISOString()
};

// 本地存储键
const LOCAL_STORAGE_KEY = 'lifepay_auth_user';
const LOCAL_STORAGE_USERS_KEY = 'lifepay_auth_users';

// 获取所有用户
const getLocalUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error('Failed to load users from localStorage:', error);
  }
  // 默认返回包含默认管理员的数组
  return [DEFAULT_ADMIN];
};

// 保存所有用户
const saveLocalUsers = (users: User[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
  }
};

// 初始化用户列表
const initializeUsers = () => {
  const users = getLocalUsers();
  // 确保默认管理员始终存在
  if (!users.some(u => u.email === DEFAULT_ADMIN.email)) {
    users.push(DEFAULT_ADMIN);
    saveLocalUsers(users);
  }
};

// 认证提供者组件
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从本地存储加载用户
  useEffect(() => {
    const loadUser = () => {
      try {
        // 初始化用户列表
        initializeUsers();
        
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      // 获取所有用户
      const users = getLocalUsers();
      
      // 查找匹配的用户
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        (u.email === DEFAULT_ADMIN.email ? password === 'admin123' : true) // 默认管理员使用固定密码
      );
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foundUser));
        return null;
      }

      // 如果没有匹配的用户，返回错误
      return { error: { message: '邮箱或密码错误' } };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  // 登出
  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // 注册新用户
  const signUp = async (email: string, password: string, metadata: { is_admin: boolean } = { is_admin: true }) => {
    try {
      // 获取当前用户列表
      const users = getLocalUsers();
      
      // 检查邮箱是否已存在
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: { message: '邮箱已被注册' } };
      }
      
      // 创建新用户
      const newUser: User = {
        id: `local-${Date.now()}`,
        email,
        user_metadata: metadata,
        created_at: new Date().toISOString(),
      };
      
      // 添加到用户列表并保存
      users.push(newUser);
      saveLocalUsers(users);
      
      return { user: newUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  // 获取所有用户
  const getUsers = () => {
    return getLocalUsers();
  };
  
  // 删除用户
  const deleteUser = async (userId: string) => {
    try {
      // 获取当前用户列表
      const users = getLocalUsers();
      
      // 防止删除默认管理员
      if (users.find(u => u.id === userId)?.email === DEFAULT_ADMIN.email) {
        return { error: { message: '无法删除默认管理员' } };
      }
      
      // 防止删除当前登录用户
      if (user && user.id === userId) {
        return { error: { message: '无法删除当前登录的用户' } };
      }
      
      // 过滤出要删除的用户
      const updatedUsers = users.filter(u => u.id !== userId);
      
      // 如果用户列表没有变化，说明用户不存在
      if (updatedUsers.length === users.length) {
        return { error: { message: '用户不存在' } };
      }
      
      // 保存更新后的用户列表
      saveLocalUsers(updatedUsers);
      
      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      return { error };
    }
  };

  // 更新用户
  const updateUser = async (data: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...data
        }
      };
      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  // 计算是否已认证
  const isAuthenticated = !!user;

  // 提供认证上下文
  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    signUp,
    getUsers,
    deleteUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证的钩子
export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
