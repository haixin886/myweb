import { useState, useEffect } from "react";
import { supabase, adminSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const TestDatabaseConnection = () => {
  const [testResults, setTestResults] = useState<{
    supabaseConnection: boolean | null;
    adminSupabaseConnection: boolean | null;
    tablesExist: Record<string, boolean>;
    error: string | null;
  }>({
    supabaseConnection: null,
    adminSupabaseConnection: null,
    tablesExist: {},
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 测试普通 Supabase 连接
  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("merchant_profiles").select("count()", { count: "exact" }).limit(1);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("Supabase 连接测试失败:", error);
      return false;
    }
  };

  // 测试管理员 Supabase 连接
  const testAdminSupabaseConnection = async () => {
    try {
      const { data, error } = await adminSupabase.from("merchant_profiles").select("count()", { count: "exact" }).limit(1);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("管理员 Supabase 连接测试失败:", error);
      return false;
    }
  };

  // 测试表是否存在
  const testTablesExist = async () => {
    const tables = ["merchant_profiles", "admin_profiles"];
    const results: Record<string, boolean> = {};

    // 测试 auth.users 表
    try {
      const { data, error } = await adminSupabase.auth.getUser();
      results["auth.users"] = !error;
    } catch (error) {
      console.error(`测试 auth.users 表失败:`, error);
      results["auth.users"] = false;
    }

    // 测试其他表
    for (const table of tables) {
      try {
        // 使用类型断言来解决类型问题
        const { data, error } = await adminSupabase
          .from(table as "merchant_profiles" | "admin_profiles")
          .select("count()", { count: "exact" })
          .limit(1);
          
        results[table] = !error;
      } catch (error) {
        console.error(`测试表 ${table} 失败:`, error);
        results[table] = false;
      }
    }

    return results;
  };

  // 运行所有测试
  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults({
      supabaseConnection: null,
      adminSupabaseConnection: null,
      tablesExist: {},
      error: null,
    });

    try {
      // 测试普通 Supabase 连接
      const supabaseConnectionResult = await testSupabaseConnection();
      
      // 测试管理员 Supabase 连接
      const adminSupabaseConnectionResult = await testAdminSupabaseConnection();
      
      // 测试表是否存在
      const tablesExistResult = await testTablesExist();
      
      setTestResults({
        supabaseConnection: supabaseConnectionResult,
        adminSupabaseConnection: adminSupabaseConnectionResult,
        tablesExist: tablesExistResult,
        error: null,
      });

      // 显示测试结果
      if (supabaseConnectionResult && adminSupabaseConnectionResult) {
        toast.success("数据库连接测试成功");
      } else {
        toast.error("数据库连接测试失败，请查看详细结果");
      }
    } catch (error: any) {
      console.error("测试过程中出错:", error);
      setTestResults(prev => ({
        ...prev,
        error: error.message || "测试过程中出现未知错误",
      }));
      toast.error("测试过程中出错");
    } finally {
      setIsLoading(false);
    }
  };

  // 尝试创建测试用户
  const createTestUser = async () => {
    setIsLoading(true);
    try {
      // 1. 创建认证用户
      const { data: authData, error: authError } = await adminSupabase.auth.signUp({
        email: `test_${Date.now()}@example.com`,
        password: "password123",
        options: {
          data: {
            nickname: "测试用户",
            phone: null
          }
        }
      });

      if (authError) {
        throw new Error(`创建认证用户失败: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("创建用户失败: 未返回用户数据");
      }
      
      // 2. 创建用户资料
      const { error: profileError } = await adminSupabase
        .from('merchant_profiles')
        .insert({
          user_id: authData.user.id,
          nickname: "测试用户",
          phone: null,
          status: true,
          created_at: new Date().toISOString(),
          account_balance: 0,
          freeze_balance: 0,
          team_count: 0
        });

      if (profileError) {
        throw new Error(`创建用户资料失败: ${profileError.message}`);
      }
      
      toast.success("测试用户创建成功");
    } catch (error: any) {
      console.error("创建测试用户失败:", error);
      toast.error(`创建测试用户失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">数据库连接测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">连接测试</h2>
          <Button 
            onClick={runAllTests} 
            disabled={isLoading}
            className="w-full mb-4"
          >
            {isLoading ? "测试中..." : "运行所有测试"}
          </Button>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>普通 Supabase 连接:</span>
              <span>
                {testResults.supabaseConnection === null ? "未测试" : 
                 testResults.supabaseConnection ? "✅ 成功" : "❌ 失败"}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>管理员 Supabase 连接:</span>
              <span>
                {testResults.adminSupabaseConnection === null ? "未测试" : 
                 testResults.adminSupabaseConnection ? "✅ 成功" : "❌ 失败"}
              </span>
            </div>
            
            <h3 className="font-semibold mt-4">表存在性测试:</h3>
            {Object.entries(testResults.tablesExist).map(([table, exists]) => (
              <div key={table} className="flex justify-between">
                <span>{table}:</span>
                <span>{exists ? "✅ 存在" : "❌ 不存在"}</span>
              </div>
            ))}
            
            {testResults.error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                <strong>错误:</strong> {testResults.error}
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">创建测试用户</h2>
          <p className="mb-4 text-gray-600">
            点击下面的按钮创建一个测试用户，以验证用户创建功能是否正常工作。
          </p>
          <Button 
            onClick={createTestUser} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "创建中..." : "创建测试用户"}
          </Button>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">故障排除建议</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>如果连接测试失败，请检查 Supabase URL 和 API 密钥是否正确。</li>
          <li>如果表不存在，请确保您的 Supabase 项目中已创建这些表。</li>
          <li>如果创建测试用户失败，请查看错误消息以获取更多信息。</li>
          <li>确保您的 Supabase 服务角色密钥具有足够的权限来执行这些操作。</li>
          <li>检查 Supabase 项目中的行级安全策略是否阻止了这些操作。</li>
        </ul>
      </Card>
    </div>
  );
};

export default TestDatabaseConnection;
