
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const RechargeCards = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);

  useEffect(() => {
    // 获取用户余额
    const fetchUserBalance = async () => {
      // 添加超时控制，避免长时间阻塞
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('获取余额超时')), 5000); // 5秒超时
      });

      try {
        // 使用 Promise.race 实现超时控制
        await Promise.race([
          (async () => {
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
                } else if (error) {
                  console.error("Error fetching balance from database:", error);
                }
              }
            } catch (err) {
              console.error("Error in session check:", err);
            }
          })(),
          timeoutPromise
        ]);
      } catch (error) {
        // 超时或其他错误处理
        console.error("Error or timeout fetching user balance:", error);
        // 不设置用户余额，UI 将显示默认状态
      }
    };
    
    // 延迟执行，确保不阻塞 UI 渲染
    const timer = setTimeout(fetchUserBalance, 100);
    return () => clearTimeout(timer);
  }, []);

  // 从数据库获取充值卡片数据
  const [cards, setCards] = useState<Array<{
    title: string;
    discount: string;
    image: string;
    route: string;
    id?: string;
  }>>([]);

  // 获取充值卡片数据
  useEffect(() => {
    const fetchRechargeCards = async () => {
      try {
        // 设置超时控制
        const timeoutPromise = new Promise<{data: null, error: Error}>((resolve) => {
          setTimeout(() => {
            resolve({
              data: null,
              error: new Error('获取充值卡片超时')
            });
          }, 5000); // 5秒超时
        });

        // 从数据库获取充值卡片数据
        const cardsResult = await Promise.race([
          supabase
            .from('recharge_cards')
            .select('*')
            .order('display_order', { ascending: true }),
          timeoutPromise
        ]);

        const { data, error } = cardsResult;

        if (error) {
          console.error('Error fetching recharge cards:', error);
          // 使用默认卡片数据
          setCards([
            {
              title: "普通话费充值",
              discount: "85折充值",
              image: "/lovable-uploads/8e869de8-5d9c-4962-ab54-b568d60b0295.png",
              route: "/recharge"
            },
            {
              title: "高折扣话费",
              discount: "75折充值",
              image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
              route: "/recharge"
            },
            {
              title: "南网电费充值",
              discount: "80折充值",
              image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
              route: "/utilities"
            },
            {
              title: "燃气费充值",
              discount: "85折充值",
              image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
              route: "/utilities"
            }
          ]);
        } else if (data && data.length > 0) {
          // 将数据库数据转换为卡片格式
          const formattedCards = data.map(card => ({
            id: card.id,
            title: card.title,
            discount: card.discount,
            image: card.image_url,
            route: card.route_path
          }));
          setCards(formattedCards);
        } else {
          // 数据库没有数据，使用默认卡片
          setCards([
            {
              title: "普通话费充值",
              discount: "85折充值",
              image: "/lovable-uploads/8e869de8-5d9c-4962-ab54-b568d60b0295.png",
              route: "/recharge"
            },
            {
              title: "高折扣话费",
              discount: "75折充值",
              image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
              route: "/recharge"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching recharge cards:', error);
        // 出错时使用默认卡片
        setCards([
          {
            title: "普通话费充值",
            discount: "85折充值",
            image: "/lovable-uploads/8e869de8-5d9c-4962-ab54-b568d60b0295.png",
            route: "/recharge"
          },
          {
            title: "高折扣话费",
            discount: "75折充值",
            image: "/lovable-uploads/e081f13f-646d-4fd9-8c8c-276498ba1ea7.png",
            route: "/recharge"
          }
        ]);
      }
    };

    // 调用函数获取数据
    fetchRechargeCards();
  }, []);

  const totalPages = Math.ceil(cards.length / 2);

  const handleCardClick = async (route: string, title: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // 如果用户未登录，引导至登录页面
    if (!session) {
      toast.error("请先登录");
      navigate("/login");
      return;
    }
    
    // 传递服务标题到目标页面
    navigate(route, { state: { serviceTitle: title } });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // 向左滑动
        setCurrentPage(prev => (prev + 1) % totalPages);
      } else {
        // 向右滑动
        setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleDotClick = (index: number) => {
    setCurrentPage(index);
  };

  return (
    <div className="px-4 pt-4 pb-2">
      <h2 className="text-lg font-medium mb-3">缴费充值</h2>
      <div className="w-full">
        <div 
          className="relative overflow-hidden"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {cards.map((card, index) => (
              <div key={index} className="min-w-[50%] px-1.5 flex-shrink-0">
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden aspect-square">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute left-4 top-4 z-10">
                    <div className="text-blue-600 font-medium text-lg">{card.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{card.discount}</div>
                  </div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <Button 
                      className="bg-[#3182f6] hover:bg-[#3182f6]/90 px-10 py-1 rounded-full text-sm text-white font-medium" 
                      onClick={() => handleCardClick(card.route, card.title)}
                    >
                      充值
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* 分页指示点 */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
