import { useState, useCallback } from 'react';
import { Transaction, FinancialSummary } from '../types';

export const FinancialController = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const summary: FinancialSummary = {
    totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2),
    totalTransactions: transactions.length,
    uniqueCategories: new Set(transactions.map(t => t.category)).size,
  };

  const connectHandler = useCallback((data: Transaction[]) => {
    setIsConnected(true);
    setTransactions(data);
  }, []);

  return { isConnected, transactions, summary, connectHandler };
};