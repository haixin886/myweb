
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  amount: string;
  setAmount: (amount: string) => void;
}

export const AmountInput = ({ amount, setAmount }: AmountInputProps) => {
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  return (
    <Card className="p-4 bg-white">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          充值金额 (USDT)
        </label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="请输入充值金额"
          className="text-lg bg-gray-900 text-white placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {quickAmounts.map((quickAmount) => (
          <Button
            key={quickAmount}
            variant="outline"
            onClick={() => setAmount(quickAmount.toString())}
            className={cn(
              "w-full bg-white text-[#7C3AED] border-[#7C3AED] hover:bg-[#7C3AED] hover:text-white",
              amount === quickAmount.toString() && "bg-[#7C3AED] text-white border-[#7C3AED]"
            )}
          >
            {quickAmount}
          </Button>
        ))}
      </div>
    </Card>
  );
};
