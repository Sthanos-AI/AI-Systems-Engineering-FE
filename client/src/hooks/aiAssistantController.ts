import { useState } from 'react';
import { Message, Transaction } from '../types';
import { apiService } from '../services/apiService';

export const AIAssistantController = (transactions: Transaction[]) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm your Financial Insights Agent. I can analyze the transaction data you just connected. Ask me about your total spending or category breakdown!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping || transactions.length === 0) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiService.analyzeData(userText, transactions);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
       setMessages(prev => [...prev, { role: 'assistant', text: "Error communicating with AI service." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, input, isTyping, setInput, handleSend };
};