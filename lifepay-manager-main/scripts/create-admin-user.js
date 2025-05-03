// 创建管理员用户脚本
import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const SUPABASE_URL = "https://atxcgfhhpgyomicyipyh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc0MjM3MSwiZXhwIjoyMDU1MzE4MzcxfQ.l9fu7vrM0TXGm6SpJnyF7OHjMHt5l78n3ihxdtkdPN0";

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 管理员用户信息
const adminUser = {
  email: 'admin@example.com',
  password: 'admin123',
  metadata: {
    is_admin: true,
    role: 'admin'
  }
};

async function createAdminUser() {
  try {
    console.log('开始创建管理员用户...');
    
    // 直接注册用户
    const { data, error } = await supabase.auth.signUp({
      email: adminUser.email,
      password: adminUser.password,
      options: {
        data: adminUser.metadata
      }
    });
    
    if (error) {
      // 如果错误是因为用户已存在，尝试登录
      if (error.message.includes('already registered')) {
        console.log('用户已存在，尝试登录...');
        
        // 尝试登录
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminUser.email,
          password: adminUser.password
        });
        
        if (signInError) {
          console.error('登录失败:', signInError);
          return;
        }
        
        // 更新用户元数据
        const { error: updateError } = await supabase.auth.updateUser({
          data: adminUser.metadata
        });
        
        if (updateError) {
          console.error('更新用户元数据失败:', updateError);
          return;
        }
        
        console.log('已更新用户元数据，设置为管理员');
        return;
      }
      
      console.error('创建用户失败:', error);
      return;
    }
    
    // 确认用户邮箱
    console.log('尝试确认用户邮箱...');
    
    // 使用管理员权限执行 SQL 查询来确认邮箱
    const { error: rpcError } = await supabase.rpc('confirm_user_email', {
      user_email: adminUser.email
    });
    
    if (rpcError) {
      console.error('确认邮箱失败:', rpcError);
      console.log('请手动确认邮箱或在 Supabase 控制台中确认');
    } else {
      console.log('用户邮箱已确认');
    }
    
    console.log('管理员用户创建成功:', adminUser.email);
    if (data && data.user) {
      console.log('用户ID:', data.user.id);
    }
    
  } catch (error) {
    console.error('创建管理员用户过程中出错:', error);
  }
}

createAdminUser();
