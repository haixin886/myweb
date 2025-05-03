
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const TransactionOrders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error, count } = await supabase
        .from('user_transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { transactions: data, totalCount: count || 0 };
    },
    refetchOnMount: true // Always refetch when the component mounts
  });

  const transactions = transactionsData?.transactions || [];
  const totalCount = transactionsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // Get paginated transactions
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getTransactionTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'recharge':
      case 'usdt充值':
        return 'text-green-500';
      case 'withdraw':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTransactionStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 flex items-center border-b">
        <Button 
          variant="ghost" 
          className="p-0 mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center mr-6">交易记录</h1>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">加载中...</div>
        ) : !paginatedTransactions || paginatedTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            暂无交易记录
          </div>
        ) : (
          <>
            {paginatedTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{transaction.type}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-lg font-semibold ${getTransactionTypeStyle(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    余额: {transaction.balance}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTransactionStatusStyle(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                {transaction.description && (
                  <p className="text-sm text-gray-500 mt-2 border-t pt-2">
                    {transaction.description}
                  </p>
                )}
              </Card>
            ))}

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          href="#" 
                          isActive={pageNumber === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default TransactionOrders;
