import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressesTable } from "@/pages/admin/payment/addresses/components/AddressesTable";
import { AddAddressForm } from "@/pages/admin/payment/addresses/components/AddAddressForm";
import PaymentChannelsPage from "@/pages/admin/payment/channels/PaymentChannelsPage";
import PaymentSettingsPage from "@/pages/admin/payment/settings/PaymentSettingsPage";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

const PaymentManagementPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  // 获取支付地址列表
  const { refetch } = useQuery({ 
    queryKey: ['payment-addresses'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('platform_payment_addresses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error("加载支付地址失败");
        return [];
      }
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>支付管理</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">支付设置</TabsTrigger>
              <TabsTrigger value="addresses">支付地址</TabsTrigger>
              <TabsTrigger value="channels">支付通道</TabsTrigger>
            </TabsList>
            <TabsContent value="settings" className="mt-4">
              <PaymentSettingsPage />
            </TabsContent>
            <TabsContent value="addresses" className="mt-4">
              <div className="space-y-4">
                <AddAddressForm onSuccess={handleRefresh} />
                <AddressesTable />
              </div>
            </TabsContent>
            <TabsContent value="channels" className="mt-4">
              <PaymentChannelsPage />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagementPage;
