import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// 定义用户类型
interface User {
  id: string;
  email: string;
  password?: string; // 添加密码字段，只在本地认证中使用
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
  isAuthenticated: boolean;
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
  password: 'admin123', // 添加默认密码
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

  // 本地登录 - 只允许默认管理员账号登录
  const signIn = async (email: string, password: string) => {
    try {
      console.log('尝试本地登录:', email);
      
      // 只允许默认管理员账号登录
      if (email === 'admin@example.com' && password === 'admin123') {
        console.log('默认管理员账号登录成功');
        
        // 创建一个新的管理员用户对象，确保有正确的密码和权限
        const adminUser: User = {
          id: '1',
          email: 'admin@example.com',
          password: 'admin123',
          user_metadata: {
            is_admin: true,
            role: 'admin'
          },
          created_at: new Date().toISOString()
        };
        
        // 设置当前用户
        setUser(adminUser);
        setIsLoading(false);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(adminUser));
        
        // 确保用户列表中有这个管理员
        const users = getLocalUsers();
        if (!users.some(u => u.email === 'admin@example.com')) {
          const updatedUsers = [...users, adminUser];
          localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
        }
        
        console.log('管理员登录成功，用户信息:', adminUser);
        return null; // 返回null表示成功
      }
      
      // 其他所有账号密码组合都返回错误
      console.error('邮箱或密码错误');
      return { error: { message: '邮箱或密码错误' } };
      
      // 其他用户的处理
      const users = getLocalUsers();
      console.log('本地用户列表:', users);
      
      // 检查用户是否存在
      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        console.error('用户不存在');
        return { error: { message: '邮箱或密码错误' } };
      }

      // 检查密码是否正确
      if (foundUser.password !== password) {
        console.error('密码错误:', foundUser.password, password);
        return { error: { message: '邮箱或密码错误' } };
      }
      
      // 如果是管理员账号，确保设置了管理员权限
      if (foundUser.email === 'admin@example.com' && (!foundUser.user_metadata || !foundUser.user_metadata.is_admin)) {
        console.log('默认管理员账号，设置管理员权限');
        foundUser.user_metadata = { ...foundUser.user_metadata, is_admin: true, role: 'admin' };
      }

      // 设置当前用户
      setUser(foundUser);
      setIsLoading(false);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foundUser));
      
      // 更新用户列表中的用户信息
      const updatedUsers = users.map(u => u.id === foundUser.id ? foundUser : u);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      
      console.log('本地登录成功，用户信息:', foundUser);

      return null;
    } catch (error) {
      console.error('登录错误:', error);
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
        password, // 添加密码字段
        user_metadata: metadata,
        created_at: new Date().toISOString(),
      };
      
      // 添加到用户列表并保存
      users.push(newUser);
      saveLocalUsers(users);
      
      console.log('用户创建成功:', newUser);
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
    isAuthenticated,
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
