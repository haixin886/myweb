// 测试 Supabase 数据库中所有表的连接
import { createClient } from '@supabase/supabase-js';

// Supabase 凭据
const SUPABASE_URL = "https://atxcgfhhpgyomicyipyh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc0MjM3MSwiZXhwIjoyMDU1MzE4MzcxfQ.l9fu7vrM0TXGm6SpJnyF7OHjMHt5l78n3ihxdtkdPN0";

// 创建管理员客户端
const adminSupabase = createClient(SUPABASE_URL, SERVICE_KEY);

// 要测试的表列表
const tablesToTest = [
  'admin_profiles',
  'user_profiles',
  'payment_channels',
  'channel_orders',
  'recharge_cards',
  'merchant_applications',
  'customer_service_messages',
  'customer_service_notices'
];

async function testAllTables() {
  console.log('开始测试数据库表连接...\n');
  
  console.log('使用预定义的表列表进行测试...');
  console.log('要测试的表:', tablesToTest.join(', '));
  console.log('\n');
  
  // 测试每个表
  for (const table of tablesToTest) {
    console.log(`测试表: ${table}`);
    
    try {
      // 查询表中的记录数
      const { count, error: countError } = await adminSupabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error(`  ❌ 表 ${table} 测试失败:`, countError.message);
        
        if (countError.code === '42P01') {
          console.log(`  表 ${table} 不存在`);
        } else {
          console.log(`  错误代码: ${countError.code}`);
        }
      } else {
        console.log(`  ✅ 表 ${table} 测试成功!`);
        console.log(`  记录数: ${count}`);
        
        // 如果表中有记录，获取第一条记录的结构
        if (count > 0) {
          const { data: firstRow, error: rowError } = await adminSupabase
            .from(table)
            .select('*')
            .limit(1)
            .single();
          
          if (rowError) {
            console.error(`  ❌ 获取第一条记录失败:`, rowError.message);
          } else {
            console.log(`  表结构示例:`);
            console.log(`  字段: ${Object.keys(firstRow).join(', ')}`);
          }
        }
      }
    } catch (err) {
      console.error(`  ❌ 测试表 ${table} 时发生异常:`, err);
    }
    
    console.log('\n');
  }
  
  console.log('所有表测试完成!');
}

// 执行测试
testAllTables().catch(err => {
  console.error('❌ 执行测试时发生致命错误:', err);
});
