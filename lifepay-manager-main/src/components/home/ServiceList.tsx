
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CreditCard, Droplet, Gamepad, Music, ShoppingCart, Phone, Flame, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  title: string;
  description: string;
  link: string;
}

interface ServiceListProps {
  services: Service[];
}

const getServiceIcon = (title: string) => {
  switch (true) {
    case title.includes('信用卡'):
    case title.includes('花呗'):
    case title.includes('分付'):
      return <CreditCard className="w-6 h-6 text-blue-500" />;
    case title.includes('电费'):
    case title.includes('燃气'):
    case title.includes('水费'):
      return <Droplet className="w-6 h-6 text-blue-500" />;
    case title.includes('游戏'):
      return <Gamepad className="w-6 h-6 text-blue-500" />;
    case title.includes('币充值'):
      return <Music className="w-6 h-6 text-blue-500" />;
    case title.includes('京东'):
    case title.includes('加油卡'):
      return <ShoppingCart className="w-6 h-6 text-blue-500" />;
    case title.includes('手机'):
      return <Phone className="w-6 h-6 text-blue-500" />;
    case title.includes('客服'):
      return <MessageSquare className="w-6 h-6 text-blue-500" />;
    default:
      return <Flame className="w-6 h-6 text-blue-500" />;
  }
};

export const ServiceList = ({ services }: ServiceListProps) => {
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('balance')
            .eq('id', session.user.id)
            .single();

          if (!error && data) {
            setUserBalance(data.balance);
          }
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };
    
    fetchUserBalance();
  }, []);
  
  const handleServiceClick = (service: Service) => {
    setSelectedServiceId(service.id);
  };
  
  const handleConfirmRecharge = async (service: Service) => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsSubmitting(true);
    
    try {
      if (!session) {
        toast.error("请先登录");
        navigate("/login");
        return;
      }
      
      if (service.title.includes('信用卡')) {
        navigate('/credit-card', { state: { userBalance } });
      } else if (service.title.includes('客服')) {
        navigate('/support');
      } else {
        navigate(service.link, { state: { serviceTitle: service.title, userBalance } });
      }
    } catch (error) {
      console.error('Service navigation error:', error);
      toast.error("操作失败，请重试");
    } finally {
      setIsSubmitting(false);
      setSelectedServiceId(null);
    }
  };
  
  return (
    <div className="px-4 pt-1 pb-4">
      <h2 className="text-lg font-medium mb-4">在线业务</h2>
      <div className="space-y-4">
        {services.map(service => (
          <Card key={service.id} className="p-4 bg-gradient-to-r from-gray-50 to-white shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] rounded-2xl border-none">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleServiceClick(service)}>
                {getServiceIcon(service.title)}
                <div>
                  <div className="font-medium">{service.title}</div>
                  <div className="text-sm text-gray-500">{service.description}</div>
                </div>
              </div>
              
              {selectedServiceId === service.id ? (
                <Button 
                  onClick={() => handleConfirmRecharge(service)} 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  {isSubmitting ? "处理中..." : "前往充值"}
                </Button>
              ) : (
                <button 
                  onClick={() => handleServiceClick(service)}
                  className="bg-blue-500 text-white rounded-full flex items-center justify-center w-10 h-10 hover:bg-blue-600 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
