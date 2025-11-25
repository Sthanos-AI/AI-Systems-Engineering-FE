import axios from 'axios';
import { Transaction } from '../types';

// Mock Data
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', date: '2023-10-27', merchant: 'Netflix', original_description: 'NFLX * SUBSCRIPTION', amount: 15.99, category: 'Subscription', method: 'Card' },
  { id: 'tx_2', date: '2023-10-26', merchant: 'Uber Eats', original_description: 'UBER * EATS HELP.UBER.COM', amount: 42.50, category: 'Food', method: 'Google Pay' },
  { id: 'tx_3', date: '2023-10-25', merchant: 'Target', original_description: 'GOOGLE *Target Store 1122', amount: 124.00, category: 'Shopping', method: 'Google Pay' },
  { id: 'tx_4', date: '2023-10-24', merchant: 'Starbucks', original_description: 'STARBUCKS COFFEE #4922', amount: 5.40, category: 'Food', method: 'Card' },
  { id: 'tx_5', date: '2023-10-23', merchant: 'Gym', original_description: 'Planet Fitness Monthly', amount: 20.00, category: 'Health', method: 'ACH' },
  { id: 'tx_6', date: '2023-10-22', merchant: 'Amazon', original_description: 'AMAZON.COM*BOOK', amount: 35.50, category: 'E-commerce', method: 'Card' },
];
const MOCK_LINK_TOKEN = "mock-token-for-demo-ui";
let apiKey = '';

export const apiService = {
 // 1. Get API Key
  getApiKey: async (): Promise<void> => {    
    try {
      const response = await axios.get('http://localhost:8000/api/ai_key', { responseType: 'text' });
      const data = response.data
      if (!data) throw new Error("Failed to retrieve API Key.");            
      console.log("Successfully fetched API key.");
      apiKey = data;

    } catch (error) {
      console.error("Failed to retrieve API Key.", error);
    }
  },

  // 2. Fetches a Link Token from the backend
  fetchLinkToken: async (): Promise<string> => {
    try {
      const response = await axios.post('http://localhost:8000/api/create_link_token');
      const data = response.data;
      if (!data.link_token) throw new Error("Link token missing in response.");      
      console.log("Successfully fetched link token from API.");
      return data.link_token;
      
    } catch (e) {
      console.error("API Error during token fetch. Falling back to mock token.", e);
      return MOCK_LINK_TOKEN;
    }
  },

  // 3. Exchanges the public token for an access token and fetches transactions
  exchangeToken: async (publicToken: string): Promise<{ transactions: Transaction[], isMock: boolean }> => {
    if (publicToken === MOCK_LINK_TOKEN) {
      console.log("Using mock data for transaction exchange.");
      return { transactions: MOCK_TRANSACTIONS, isMock: true };
    }

    try {
      const response = await axios.post('http://localhost:8000/api/exchange_public_token', { 
        public_token: publicToken 
      });
      const data = response.data;
      if (!data.transactions || data.transactions.length === 0) {
        console.warn("API returned empty transaction list. Using mock as fallback.");
        return { transactions: MOCK_TRANSACTIONS, isMock: false };
      }

      console.log("Successfully fetched real transactions.");
      return { transactions: data.transactions, isMock: false };

    } catch (error) {
      console.error("API Error during transaction fetch. Returning mock data.", error);
      // Fallback to mock data if the real API fails
      return { transactions: MOCK_TRANSACTIONS, isMock: false };
    }
  },

  // 4. Analyzes data using the Gemini API
  analyzeData: async (query: string, transactions: Transaction[]): Promise<string> => {
    
    // In a real application, this would format the transactions and call the Gemini API.
    const userQuery = `Analyze the following financial transactions based on the query: "${query}". 
    Transactions: ${JSON.stringify(transactions.slice(0, 10))}`; // Send a subset to save tokens.
    console.log(apiKey);
    const systemPrompt = "Act as a financial analyst. Provide a concise, single-paragraph summary or response to the user's query about their transactions. Format key findings using **bold** markdown.";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey.replace(/^['"]|['";]$/g, '').trim()}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        tools: [{ "google_search": {} }], // Enable grounding for broader context
    };

    try {
        const response = await axios.post(apiUrl, payload);        
        const result = response.data;
        if (!result) throw new Error(`Gemini API failed with status ${response.status}`);
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          // Format text (replace markdown bold with HTML strong)
          return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
        } else {
          return "I received your query but the AI model didn't return a text response.";
        }

    } catch (error) {
        console.error("Gemini API error:", error);
        // Manual fallback logic if Gemini API fails
        const lowerInput = query.toLowerCase();
        if (lowerInput.includes('total') || lowerInput.includes('spend')) {
          const total = transactions.reduce((sum, t) => sum + t.amount, 0);
          return `The real-time AI analysis failed. Based on ${transactions.length} transactions, you spent approximately **$${total.toFixed(2)}**.`;
        } 
        return "The AI service is temporarily unavailable. Please try again later.";
    }
  }
};