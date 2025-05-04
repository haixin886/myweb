// 测试与 Supabase 数据库中 admin_profiles 表的连接
import { createClient } from '@supabase/supabase-js';

// 从环境变量或直接配置中获取 Supabase 凭据
const SUPABASE_URL = "https://atxcgfhhpgyomicyipyh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NDIzNzEsImV4cCI6MjA1NTMxODM3MX0.jZgAuHoKvzOwp8kIW1bQZFOumbNM96UT2O7CMa6k-xY";

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminProfilesConnection() {
  console.log('开始测试 admin_profiles 表连接...');
  
  try {
    // 测试1: 检查表是否存在
    console.log('测试1: 检查 admin_profiles 表是否存在...');
    const { data: tableExists, error: tableError } = await supabase
      .from('admin_profiles')
      .select('count(*)', { count: 'exact', head: true });
    
    if (tableError) {
      if (tableError.code === '42P01') { // 表不存在的错误代码
        console.error('❌ 测试1失败: admin_profiles 表不存在');
        console.error('错误详情:', tableError);
        return;
      } else {
        console.error('❌ 测试1失败: 查询 admin_profiles 表时出错');
        console.error('错误详情:', tableError);
        return;
      }
    }
    
    console.log('✅ 测试1通过: admin_profiles 表存在');
    
    // 测试2: 获取管理员列表
    console.log('测试2: 获取管理员列表...');
    const { data: admins, error: adminsError } = await supabase
      .from('admin_profiles')
      .select('*')
      .limit(5);
    
    if (adminsError) {
      console.error('❌ 测试2失败: 无法获取管理员列表');
      console.error('错误详情:', adminsError);
      return;
    }
    
    console.log('✅ 测试2通过: 成功获取管理员列表');
    console.log(`找到 ${admins.length} 个管理员记录`);
    
    if (admins.length > 0) {
      console.log('管理员记录示例:');
      console.log(JSON.stringify(admins[0], null, 2));
    } else {
      console.log('管理员表中没有记录');
    }
    
    // 测试3: 检查表结构
    console.log('测试3: 检查表结构...');
    // 这里我们尝试查询一些预期存在的字段
    const expectedFields = ['id', 'user_id', 'role', 'is_super_admin', 'created_at'];
    const { data: fieldTest, error: fieldError } = await supabase
      .from('admin_profiles')
      .select(expectedFields.join(','))
      .limit(1);
    
    if (fieldError) {
      console.error('❌ 测试3失败: 表结构可能不符合预期');
      console.error('错误详情:', fieldError);
      return;
    }
    
    console.log('✅ 测试3通过: 表结构符合预期');
    
    console.log('所有测试完成，连接正常！');
    
  } catch (error) {
    console.error('❌ 测试过程中发生意外错误:');
    console.error(error);
  }
}

// 执行测试
testAdminProfilesConnection().catch(error => {
  console.error('❗ 测试过程中发生致命错误:', error);
});
