
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const AgentCenter = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInviteCode = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("请先登录");
          navigate("/login");
          return;
        }
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('invite_code')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setInviteCode(data.invite_code || "");
      } catch (error: any) {
        console.error("Error loading invite code:", error);
        toast.error("加载邀请码失败");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInviteCode();
  }, [navigate]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode)
      .then(() => toast.success("邀请码已复制到剪贴板"))
      .catch(err => {
        console.error("Could not copy text: ", err);
        toast.error("复制失败");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 flex items-center">
        <Button 
          variant="ghost" 
          className="p-0 mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center mr-6">代理中心</h1>
      </div>
      
      <div className="p-4 space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">我的邀请码</h2>
          <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
            {isLoading ? (
              <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <span className="text-xl font-mono font-bold tracking-wider">{inviteCode}</span>
                <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                  <Copy className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">我的团队</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">直接邀请</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">团队总人数</div>
            </div>
          </div>
          <Button className="w-full" variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            生成邀请海报
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">佣金详情</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">可提现佣金</span>
              <span className="font-bold">0.00 USDT</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">累计获得佣金</span>
              <span className="font-bold">0.00 USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已提现佣金</span>
              <span className="font-bold">0.00 USDT</span>
            </div>
          </div>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default AgentCenter;
