import { useState, useRef, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { Transaction } from '../types';

export const PlaidLinkController = (onConnect: (data: Transaction[]) => void) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const linkRef = useRef<any>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => { tokenRef.current = token; }, [token]);

  const handleSuccess = useCallback(async (publicToken: string) => {
    setLoading(true);
    try {
      const { transactions, isMock } = await apiService.exchangeToken(publicToken);
      onConnect(transactions);     
    } catch (error) {
      console.error("Error exchanging token or fetching transactions", error);
    } finally {
      setLoading(false);
    }
  }, [onConnect]);

  // Plaid Script Loading and Initialization
  useEffect(() => {
    const initPlaid = (linkToken: string, PlaidInstance: any) => {
      if (!PlaidInstance) return;
      linkRef.current = PlaidInstance.create({
        token: linkToken,
        onSuccess: (pt: string) => handleSuccess(pt),
      });
      setLoading(false);
    };

    const load = async () => {
      setLoading(true);
      const linkToken = await apiService.fetchLinkToken();
      setToken(linkToken);

      await apiService.getApiKey();
      
      if (!(window as any).Plaid) {
         const script = document.createElement('script');
         script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
         script.onload = () => initPlaid(linkToken, (window as any).Plaid);
         document.head.appendChild(script);
      } else {
         initPlaid(linkToken, (window as any).Plaid);
      }
    };
    load();
  }, [handleSuccess]);

  const openPlaidLink = () => {
    const currentToken: string | null = tokenRef.current;
    // Check if we are in mock mode (token starts with 'mock')
    if (currentToken && currentToken.startsWith('mock')) {
       // In mock mode, skip Plaid window and directly simulate success
       handleSuccess(currentToken);
    } else if (linkRef.current) {
      linkRef.current.open();
    }
  };

  // Determine if we are using the mock fallback token
  const isMock = token !== null && token.startsWith('mock');

  return { token, loading, isMock, openPlaidLink };
};