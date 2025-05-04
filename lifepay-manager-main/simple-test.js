// 简单测试 Supabase 连接和 admin_profiles 表
import { createClient } from '@supabase/supabase-js';

// Supabase 凭据
const SUPABASE_URL = "https://atxcgfhhpgyomicyipyh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NDIzNzEsImV4cCI6MjA1NTMxODM3MX0.jZgAuHoKvzOwp8kIW1bQZFOumbNM96UT2O7CMa6k-xY";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc0MjM3MSwiZXhwIjoyMDU1MzE4MzcxfQ.l9fu7vrM0TXGm6SpJnyF7OHjMHt5l78n3ihxdtkdPN0";

// 创建管理员客户端
const adminSupabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function testAdminProfiles() {
  try {
    console.log('测试 admin_profiles 表...');
    
    // 1. 直接查询表
    const { data, error } = await adminSupabase
      .from('admin_profiles')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('❌ 查询失败:', error);
      
      if (error.code === '42P01') {
        console.log('表不存在。需要创建 admin_profiles 表。');
      } else {
        console.log('其他错误:', error.message);
      }
    } else {
      console.log('✅ 查询成功!');
      console.log(`找到 ${data.length} 条记录`);
      
      if (data.length > 0) {
        console.log('第一条记录:', data[0]);
      } else {
        console.log('表存在但没有数据');
      }
    }
  } catch (err) {
    console.error('❌ 测试过程中发生错误:', err);
  }
}

// 执行测试
testAdminProfiles();
