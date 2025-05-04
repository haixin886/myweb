// 测试数据库连接脚本
import { createClient } from '@supabase/supabase-js';

// 使用更新后的 Supabase 连接信息
const supabaseUrl = 'https://kvekonddtzqqkubqjelh.supabase.co';

// 使用服务端密钥进行测试，以绕过 RLS 限制
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2ZWtvbmRkdHpxcWt1YnFqZWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjMzMzMyMSwiZXhwIjoyMDYxOTA5MzIxfQ.HZFurDjvCu0nhWC3dYNS11U6lowz5O2pcQJt5_Bf5pU';

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('正在测试数据库连接...');
  
  try {
    // 测试查询 - 获取管理员资料表数据
    console.log('尝试查询 admin_profiles 表...');
    const { data: adminProfiles, error: adminProfilesError } = await supabase
      .from('admin_profiles')
      .select('*')
      .limit(5);
    
    if (adminProfilesError) {
      console.error('查询管理员资料表时出错:', adminProfilesError.message);
    } else {
      console.log('成功查询管理员资料表!');
      console.log(`获取到 ${adminProfiles?.length || 0} 条管理员记录`);
      if (adminProfiles && adminProfiles.length > 0) {
        console.table(adminProfiles);
      }
    }
    
    // 测试查询 - 获取商户资料表数据
    console.log('尝试查询 merchant_profiles 表...');
    const { data: merchants, error: merchantsError } = await supabase
      .from('merchant_profiles')
      .select('*')
      .limit(5);
    
    if (merchantsError) {
      console.error('查询商户资料表时出错:', merchantsError.message);
    } else {
      console.log('成功查询商户资料表!');
      console.log(`获取到 ${merchants?.length || 0} 条商户记录`);
      if (merchants && merchants.length > 0) {
        console.table(merchants);
      }
    }
    
    // 测试查询 - 获取订单表数据
    console.log('尝试查询 orders 表...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5);
    
    if (ordersError) {
      console.error('查询订单表时出错:', ordersError.message);
    } else {
      console.log('成功查询订单表!');
      console.log(`获取到 ${orders?.length || 0} 条订单记录`);
      if (orders && orders.length > 0) {
        console.table(orders);
      }
    }
    
    // 测试查询 - 获取用户交易表数据
    console.log('尝试查询 user_transactions 表...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('user_transactions')
      .select('*')
      .limit(5);
    
    if (transactionsError) {
      console.error('查询用户交易表时出错:', transactionsError.message);
    } else {
      console.log('成功查询用户交易表!');
      console.log(`获取到 ${transactions?.length || 0} 条交易记录`);
      if (transactions && transactions.length > 0) {
        console.table(transactions);
      }
    }
    
    // 测试查询 - 获取统计数据
    console.log('尝试查询 stats_business 表...');
    const { data: stats, error: statsError } = await supabase
      .from('stats_business')
      .select('*')
      .limit(5);
    
    if (statsError) {
      console.error('查询业务统计表时出错:', statsError.message);
    } else {
      console.log('成功查询业务统计表!');
      console.log(`获取到 ${stats?.length || 0} 条统计记录`);
      if (stats && stats.length > 0) {
        console.table(stats);
      }
    }
    
    // 测试查询 - 获取充值订单数据
    console.log('尝试查询 recharge_orders 表...');
    const { data: rechargeOrders, error: rechargeOrdersError } = await supabase
      .from('recharge_orders')
      .select('*')
      .limit(5);
    
    if (rechargeOrdersError) {
      console.error('查询充值订单表时出错:', rechargeOrdersError.message);
    } else {
      console.log('成功查询充值订单表!');
      console.log(`获取到 ${rechargeOrders?.length || 0} 条充值订单记录`);
      if (rechargeOrders && rechargeOrders.length > 0) {
        console.table(rechargeOrders);
      }
    }
    
    console.log('\n\n测试结论:');
    if (adminProfilesError || merchantsError || ordersError || statsError || transactionsError || rechargeOrdersError) {
      console.log('数据库连接成功，但某些表可能尚未创建。');
      console.log('请确保已按顺序执行以下 SQL 脚本:');
      console.log('1. database_schema_part1.sql');
      console.log('2. database_schema_part2.sql');
      console.log('3. database_schema_part3.sql');
      console.log('4. database_schema_part4.sql');
      console.log('5. database_schema_part5.sql');
      console.log('6. database_schema_part6.sql');
      console.log('7. sample_data.sql');
    } else {
      console.log('数据库连接和表结构正常！');
    }
    
  } catch (error) {
    console.error('测试数据库连接时发生错误:', error.message);
  }
}

// 运行测试
testConnection();
