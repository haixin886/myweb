
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  created_at: string;
  status: string;
}

interface TransactionListProps {
  transactions: Transaction[] | undefined;
  isLoadingTransactions: boolean;
  handleRefresh: () => void;
}

export const TransactionList = ({ 
  transactions, 
  isLoadingTransactions, 
  handleRefresh 
}: TransactionListProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Card className={`p-3 md:p-4 ${isMobile ? 'max-w-full mx-2' : 'max-w-xl mx-auto'}`}>
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>余额充值记录</h3>
        {isLoadingTransactions && (
          <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>
      
      {isLoadingTransactions ? (
        <div className="space-y-3 md:space-y-4 py-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 md:h-16 bg-gray-100 animate-pulse rounded"></div>
          ))}
        </div>
      ) : transactions?.length === 0 ? (
        <div className="text-center text-gray-500 py-4">暂无充值记录</div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {transactions?.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div>
                <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>{transaction.type}</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {new Date(transaction.created_at).toLocaleString()}
                </div>
              </div>
              <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium ${
                transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        variant="ghost" 
        className="w-full mt-4"
        size={isMobile ? "sm" : "default"}
        onClick={() => navigate('/transaction-orders')}
      >
        查看更多
      </Button>
    </Card>
  );
};
