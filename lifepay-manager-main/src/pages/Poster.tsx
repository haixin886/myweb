
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Poster = () => {
  const navigate = useNavigate();

  // Fetch user's invite code
  const { data: userProfile } = useQuery({
    queryKey: ['user-invite-code'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('invite_code')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const promotionLink = userProfile?.invite_code 
    ? `https://2538.top/${userProfile.invite_code}`
    : "";

  const copyLink = () => {
    if (!promotionLink) {
      toast.error("无法获取推广链接");
      return;
    }
    navigator.clipboard.writeText(promotionLink);
    toast.success("链接已复制");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center border-b">
        <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center mr-6">推广海报</h1>
      </div>

      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">推广链接</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm bg-white p-2 border truncate rounded">
                  {promotionLink || "加载中..."}
                </div>
                <Button onClick={copyLink} className="whitespace-nowrap">
                  复制链接
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Poster;
