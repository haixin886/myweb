
import { Button } from "@/components/ui/button";
import { RechargeHeader } from "@/components/wallet-recharge/RechargeHeader";
import { AmountInput } from "@/components/wallet-recharge/AmountInput";
import { AddressList } from "@/components/wallet-recharge/AddressList";
import { RechargeInfo } from "@/components/wallet-recharge/RechargeInfo";
import { OrderDialog } from "@/components/wallet-recharge/OrderDialog";
import { useWalletRecharge } from "@/hooks/use-wallet-recharge";
import { RefreshCw } from "lucide-react";

const WalletRecharge = () => {
  const {
    amount,
    setAmount,
    selectedAddress,
    setSelectedAddress,
    isSubmitting,
    orderDialogOpen,
    setOrderDialogOpen,
    currentOrder,
    addresses,
    isLoadingAddresses,
    handleRecharge,
    refreshAddresses
  } = useWalletRecharge();

  return (
    <div className="min-h-screen bg-gray-50">
      <RechargeHeader />

      <div className="p-4 pt-20">
        <AmountInput 
          amount={amount} 
          setAmount={setAmount} 
        />

        <div className="flex justify-between items-center mt-4 mb-2">
          <h3 className="text-lg font-medium">选择充值地址</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAddresses}
            disabled={isLoadingAddresses}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            刷新地址
          </Button>
        </div>

        <AddressList 
          addresses={Array.isArray(addresses) ? addresses : []}
          selectedAddress={selectedAddress} 
          setSelectedAddress={setSelectedAddress} 
          isLoading={isLoadingAddresses}
        />

        <Button 
          onClick={handleRecharge} 
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          disabled={isSubmitting || !selectedAddress}
        >
          {isSubmitting ? "处理中..." : "确认充值"}
        </Button>

        <RechargeInfo />
      </div>

      <OrderDialog 
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        currentOrder={currentOrder}
        selectedAddress={selectedAddress}
      />
    </div>
  );
};

export default WalletRecharge;
