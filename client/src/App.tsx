import { FC } from 'react';
import { Wallet, DollarSign, CheckCircle, TrendingUp, Clock } from 'lucide-react';

// Import Components (Views)
import { Card } from './components/ui/Card';
import { InsightCard } from './components/InsightCard';
import { BankLink } from './components/BankLink';
import { AIAssistantView } from './components/AIAssistantView';

// Import Controllers (Hooks)
import { FinancialController } from './hooks/financialController';
import { PlaidLinkController } from './hooks/plaidLinkController';
import { AIAssistantController } from './hooks/aiAssistantController';

const App: FC = () => {
  // 1. Initialize Financial Data Controller (State management for transactions)
  const { 
    isConnected, transactions, summary, connectHandler 
  } = FinancialController();
  
  // 2. Initialize Plaid Link Controller (Handles connection logic and API interaction)
  const { loading, isMock, openPlaidLink } = PlaidLinkController(connectHandler);

  // 3. Initialize AI Chat Controller (Handles chat state and Gemini interaction)
  const aiState = AIAssistantController(transactions);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm px-6 py-4 mb-10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">FinSight</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Real-Time Financial Insights</h1>
          <p className="text-slate-500 mt-2 text-lg">Harness the power of AI to analyze your recent spending data.</p>
        </header>

        {/* Bank Connection UI */}
        <BankLink 
          isConnected={isConnected} 
          loading={loading} 
          isMock={isMock} 
          openPlaidLink={openPlaidLink} 
        />

        {/* Dashboard Content (Only visible when connected) */}
        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            <div className="lg:col-span-2 space-y-8">
              {/* Insight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InsightCard title="Total Spent" value={`$${summary.totalSpent}`} icon={DollarSign} colorClass="bg-red-600" details="30 Day Outflow" />
                <InsightCard title="Transactions" value={summary.totalTransactions} icon={CheckCircle} colorClass="bg-blue-600" details="Successful retrievals" />
                <InsightCard title="Categories" value={summary.uniqueCategories} icon={TrendingUp} colorClass="bg-purple-600" details="Active buckets" />
              </div>

              {/* Transaction History */}
              <Card className="overflow-hidden shadow-2xl shadow-indigo-50/50">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-white/80 backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900">Transaction History</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-indigo-50/50 transition-colors flex items-center justify-between">
                       <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-base shadow-sm ${
                          tx.category.includes('Food') ? 'bg-amber-100 text-amber-700' :
                          tx.category.includes('Subscription') ? 'bg-rose-100 text-rose-700' :
                          tx.category.includes('Shopping') ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {tx.merchant ? tx.merchant[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-semibold">{tx.merchant}</div>
                          <div className="text-xs text-slate-500">{tx.date} • {tx.category}</div>
                        </div>
                      </div>
                       <div className="font-bold text-red-600">-${tx.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* AI Assistant Chat */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <AIAssistantView {...aiState} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 text-center text-slate-400 font-medium">
             <p className='text-xl'>Awaiting Connection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;