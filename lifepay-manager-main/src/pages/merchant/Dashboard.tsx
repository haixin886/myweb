
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Edit2, Save } from "lucide-react";
import { toast } from "sonner";

const MerchantDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("今天");
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState({
    creditCard: "信用卡代还",
    phoneRecharge: "无骚扰话费"
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  const getOrderStats = () => {
    const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalFees = orders.reduce((sum, order) => sum + (order.fee || 0), 0);
    
    return {
      activeOrders: 3,
      totalIncome: 300.00,
      orderCommission: 26.73,
      subordinates: 0,
      commissionBalance: 0.00,
      remainingBalance: 0.00,
      totalLimit: 0.00,
      manageLimit: 0.00
    };
  };

  const stats = getOrderStats();
  const dateOptions = ["昨天", "最近7天", "本月", "最近30天", "最近1年"];

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem('dashboardText', JSON.stringify(editableText));
    toast.success("文字修改已保存");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-medium">时间筛选</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                保存修改
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                编辑文字
              </>
            )}
          </Button>
        </div>
        <div className="flex space-x-4 mb-4">
          {dateOptions.map((option) => (
            <Button
              key={option}
              variant={dateRange === option ? "default" : "outline"}
              onClick={() => setDateRange(option)}
              className="bg-white hover:bg-gray-100"
            >
              {option}
            </Button>
          ))}
          <div className="flex items-center space-x-2 text-gray-500">
            <span>2024-02-16</span>
            <span>-</span>
            <span>2025-02-15</span>
          </div>
        </div>

        <div className="text-lg font-medium mb-4">收支汇总</div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-gray-500 mb-2">完成订单</div>
            <div className="text-xl font-bold">{stats.activeOrders} 笔</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">充值流水</div>
            <div className="text-xl font-bold">{stats.totalIncome.toFixed(2)} 元</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">订单结算收益</div>
            <div className="text-xl font-bold">{stats.orderCommission.toFixed(2)} U</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">下级人数</div>
            <div className="text-xl font-bold">{stats.subordinates} 人</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">佣金结算收益</div>
            <div className="text-xl font-bold">{stats.commissionBalance.toFixed(2)} U</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">总收益</div>
            <div className="text-xl font-bold">{stats.remainingBalance.toFixed(2)} U</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">总计提现金额</div>
            <div className="text-xl font-bold">{stats.totalLimit.toFixed(2)} U</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-500 mb-2">账户余额</div>
            <div className="text-xl font-bold">{stats.manageLimit.toFixed(2)} U</div>
          </Card>
        </div>

        <div className="mt-8">
          <div className="text-lg font-medium mb-4">我的订单统计</div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                {isEditing ? (
                  <Input
                    value={editableText.creditCard}
                    onChange={(e) => setEditableText(prev => ({
                      ...prev,
                      creditCard: e.target.value
                    }))}
                    className="text-lg font-medium w-full"
                  />
                ) : (
                  <span className="text-lg font-medium">{editableText.creditCard}</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">充值数量</span>
                  <span>1 笔</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">充值流水</span>
                  <span>100.00 元</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">结账收益</span>
                  <span>7.69 元</span>
                </div>
                <div className="text-red-500 text-sm mt-2">
                  正在充值订单 0笔 0.00元
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                {isEditing ? (
                  <Input
                    value={editableText.phoneRecharge}
                    onChange={(e) => setEditableText(prev => ({
                      ...prev,
                      phoneRecharge: e.target.value
                    }))}
                    className="text-lg font-medium w-full"
                  />
                ) : (
                  <span className="text-lg font-medium">{editableText.phoneRecharge}</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">实收数量</span>
                  <span>2 笔</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">实收流水</span>
                  <span>200.00 元</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">结算返点</span>
                  <span>19.04 元</span>
                </div>
                <div className="text-red-500 text-sm mt-2">
                  正在充值订单 0笔 0.00元
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-lg font-medium mb-4">下级订单统计</div>
          <Card className="p-4">
            <div className="text-center text-gray-500">
              暂无数据
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
