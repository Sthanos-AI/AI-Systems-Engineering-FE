export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  original_description: string;
  amount: number;
  category: string;
  method: 'Card' | 'Google Pay' | 'ACH';
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export interface FinancialSummary {
  totalSpent: string;
  totalTransactions: number;
  uniqueCategories: number;
}
