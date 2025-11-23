import React, { FC, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Card } from './ui/Card';
import { Message } from '../types';

interface AIAssistantViewProps {
  messages: Message[];
  input: string;
  isTyping: boolean;
  setInput: (val: string) => void;
  handleSend: () => void;
}

export const AIAssistantView: FC<AIAssistantViewProps> = ({ 
  messages, input, isTyping, setInput, handleSend 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden shadow-2xl shadow-indigo-100/80">
      <div className="p-4 bg-indigo-600 border-b border-indigo-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">FinSight AI</h3>
          <p className="text-xs text-indigo-200">Live Transaction Analysis</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-xl p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-500 text-white rounded-br-none shadow-md' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-lg'
            }`}>
               {/* Content contains pre-formatted HTML (strong/br) from the service layer */}
               <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-3 shadow-md flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75" />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your total spend..."
            disabled={isTyping || !messages.length} // Disable input until initial message is loaded
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleSend} disabled={isTyping || !input} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};