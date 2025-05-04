
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// 定义卡片类型
type RechargeCard = {
  title: string;
  discount: string;
  image: string;
  route: string;
  id?: string;
};

// 默认卡片数据
const DEFAULT_CARDS: RechargeCard[] = [
  {
    title: "普通话费充值",
    discount: "85折充值",
    image: "/lovable-uploads/8e869de8-5d9c-4962-ab54-b568d60b0295.png",
    route: "/recharge",
    id: "1"
  },
  {
    title: "高折扣话费",
    discount: "75折充值",
    image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
    route: "/recharge",
    id: "2"
  },
  {
    title: "南网电费充值",
    discount: "80折充值",
    image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
    route: "/utilities",
    id: "3"
  },
  {
    title: "燃气费充值",
    discount: "85折充值",
    image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
    route: "/utilities",
    id: "4"
  }
];

export const RechargeCards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<RechargeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 简化实现，直接使用默认卡片数据
    setCards(DEFAULT_CARDS);
    setIsLoading(false);
  }, []);

  // 处理卡片点击事件
  const handleCardClick = (route: string, title: string) => {
    // 导航到指定路由
    navigate(route, { state: { serviceTitle: title } });
  };

  if (isLoading) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  return (
    <div className="px-4 pt-4 pb-2">
      <h2 className="text-lg font-medium mb-3">缴费充值</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={card.id || index} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.image})` }}
              ></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.discount}</p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => handleCardClick(card.route, card.title)}
                >
                  立即充值
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
