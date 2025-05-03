import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import BottomNav from "@/components/BottomNav";
import { WalletActions } from "@/components/wallet/WalletActions";
import { AssetDisplay } from "@/components/wallet/AssetDisplay";
import { TransactionList } from "@/components/wallet/TransactionList";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import "@/components/wallet/wallet-animations.css";

const Wallet = () => {
  // Profile data query
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['wallet-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      // Return an empty object with balance property if data is null
      return { balance: data?.balance || 0 };
    },
    refetchOnMount: true
  });

  // Transaction data query
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions, 
    refetch: refetchTransactions 
  } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    refetchOnMount: true
  });

  // Add a refresh function to manually refetch data
  const handleRefresh = () => {
    refetchTransactions();
    toast.success("刷新成功");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WalletHeader 
        handleRefresh={handleRefresh} 
        isLoadingTransactions={isLoadingTransactions} 
      />

      <div className="p-4">
        <WalletActions />
        
        <AssetDisplay isLoading={isLoading} userProfile={userProfile} />

        <div className="mt-8">
          <TransactionList 
            transactions={transactions} 
            isLoadingTransactions={isLoadingTransactions} 
            handleRefresh={handleRefresh} 
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
