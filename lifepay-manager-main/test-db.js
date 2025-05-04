// 使用 ESM 语法测试 Supabase 连接
import { createClient } from '@supabase/supabase-js';

// Supabase 凭据
const SUPABASE_URL = "https://atxcgfhhpgyomicyipyh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NDIzNzEsImV4cCI6MjA1NTMxODM3MX0.jZgAuHoKvzOwp8kIW1bQZFOumbNM96UT2O7CMa6k-xY";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc0MjM3MSwiZXhwIjoyMDU1MzE4MzcxfQ.l9fu7vrM0TXGm6SpJnyF7OHjMHt5l78n3ihxdtkdPN0";

// 创建普通客户端和管理员客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const adminSupabase = createClient(SUPABASE_URL, SERVICE_KEY);

// 简单测试函数
async function testConnection() {
  console.log('开始测试 Supabase 连接...');
  
  try {
    // 测试 1: 基本连接测试
    console.log('测试 1: 检查基本连接...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ 连接测试失败:', error.message);
      return;
    }
    
    console.log('✅ 基本连接测试成功!');
    
    // 测试 2: 使用普通客户端检查 admin_profiles 表
    console.log('\n测试 2: 使用普通客户端检查 admin_profiles 表...');
    try {
      console.log('尝试查询 admin_profiles 表...');
      const { data: adminData, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .limit(1);
      
      console.log('原始响应:', { data: adminData, error: adminError });
      
      if (adminError) {
        console.error('❌ 使用普通客户端查询 admin_profiles 表失败');
        console.error('错误对象:', JSON.stringify(adminError, null, 2));
      } else {
        console.log('✅ 使用普通客户端查询 admin_profiles 表成功!');
        console.log('返回数据:', adminData);
      }
    } catch (err) {
      console.error('❌ 查询 admin_profiles 表时发生异常:', err);
    }
    
    // 测试 3: 使用管理员客户端检查 admin_profiles 表
    console.log('\n测试 3: 使用管理员客户端检查 admin_profiles 表...');
    try {
      const { data: adminData, error: adminError } = await adminSupabase
        .from('admin_profiles')
        .select('*')
        .limit(5);
      
      if (adminError) {
        console.error('❌ 使用管理员客户端查询 admin_profiles 表失败');
        console.error('错误对象:', JSON.stringify(adminError, null, 2));
        
        if (adminError.code === '42P01') {
          console.log('\n⚠️ 表不存在。您需要创建 admin_profiles 表。');
        }
      } else {
        console.log('✅ 使用管理员客户端查询 admin_profiles 表成功!');
        console.log('找到 ' + (adminData ? adminData.length : 0) + ' 条记录');
        if (adminData && adminData.length > 0) {
          console.log('第一条记录:', JSON.stringify(adminData[0], null, 2));
        }
      }
    } catch (err) {
      console.error('❌ 使用管理员客户端查询 admin_profiles 表时发生异常:', err);
    }
    
    // 测试 4: 使用管理员客户端列出所有表
    console.log('\n测试 4: 使用管理员客户端列出所有表...');
    try {
      const { data: tables, error: tablesError } = await adminSupabase
        .rpc('get_tables');
      
      if (tablesError) {
        console.error('❌ 无法获取表列表:', JSON.stringify(tablesError, null, 2));
        
        // 尝试另一种方法
        console.log('尝试直接查询特定表...');
        const { data: specificTables, error: specificError } = await adminSupabase
          .from('admin_profiles')
          .select('id')
          .limit(1);
          
        if (specificError) {
          console.error('❌ 无法查询 admin_profiles 表:', JSON.stringify(specificError, null, 2));
        } else {
          console.log('✅ 可以直接查询 admin_profiles 表');
        }
      } else {
        console.log('✅ 成功获取表列表!');
        console.log('可用的表:', tables);
      }
    } catch (err) {
      console.error('❌ 获取表列表时发生异常:', err);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 执行测试
testConnection().catch(err => {
  console.error('❌ 执行测试时发生致命错误:', err);
});
