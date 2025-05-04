import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { inquirePhoneInfo, formatMobileNumber, PhoneInquiryResult } from "@/services/phoneInquiryService";

interface PhoneInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhoneNumber?: string;
}

export const PhoneInquiryModal = ({
  isOpen,
  onClose,
  initialPhoneNumber = "",
}: PhoneInquiryModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneInfo, setPhoneInfo] = useState<PhoneInquiryResult | null>(null);

  const handleInquiry = async () => {
    const formattedPhone = formatMobileNumber(phoneNumber);
    if (!formattedPhone) {
      setError("请输入有效的手机号码");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const info = await inquirePhoneInfo(formattedPhone);
      if (info) {
        setPhoneInfo(info);
      } else {
        setError("无法获取手机号码信息");
      }
    } catch (error) {
      console.error('查询手机号码信息出错:', error);
      setError("查询手机号码信息时出错");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>手机号码余额查询</DialogTitle>
          <DialogDescription>
            查询手机号码的余额和归属地信息，帮助您更好地处理缴费业务订单。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              手机号码
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="请输入手机号码"
                className="flex-1"
              />
              <Button 
                onClick={handleInquiry} 
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    查询中
                  </>
                ) : "查询"}
              </Button>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {phoneInfo && (
            <div className="bg-muted p-4 rounded-lg mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="font-medium text-lg">{phoneInfo.mobile}</span>
                  <Badge className="ml-2">{phoneInfo.sp}</Badge>
                </div>
                <Badge variant="outline">原运营商: {phoneInfo.pri_sp}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">归属地</Label>
                  <div className="font-medium">{phoneInfo.province} {phoneInfo.city}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">账户余额</Label>
                  <div className="font-medium text-green-600">¥{phoneInfo.curFee}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">账户类型</Label>
                  <div className="font-medium">{phoneInfo.mobile_fee ? "预付费" : "后付费"}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">查询时间</Label>
                  <div className="font-medium">{new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
