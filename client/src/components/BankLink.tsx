import React, { FC } from 'react';
import { Loader2, Building2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';

interface BankLinkProps {
  isConnected: boolean;
  loading: boolean;
  isMock: boolean;
  openPlaidLink: () => void;
}

export const BankLink: FC<BankLinkProps> = ({ isConnected, loading, isMock, openPlaidLink }) => {
  if (isConnected) return null;

  return (
    <Card className="p-6 mb-8 border-indigo-200 bg-indigo-50/70 shadow-2xl shadow-indigo-100/80 transition-all duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-white rounded-xl shadow-md">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Connect Your Financial Account</h3>
            <p className="text-slate-600 text-sm mt-1 max-w-lg">
              Securely link your bank using Plaid to enable real-time analysis and insights.
            </p>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium"><ShieldCheck className="w-3.5 h-3.5 text-green-500"/> Bank-Grade Security</span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium"><Lock className="w-3.5 h-3.5 text-blue-500"/> Data Encryption</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={openPlaidLink}
          disabled={loading}
          className="pointer w-full md:w-auto py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-400/50 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Connect Bank'}
        </button>
      </div>
      {isMock && (
        <div className="mt-4 text-sm text-center font-semibold bg-amber-100 text-amber-800 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 inline mr-2 align-text-bottom" />
          Connection API failed: Using Local Simulation Mode (Mock Data).
        </div>
      )}
    </Card>
  );
};