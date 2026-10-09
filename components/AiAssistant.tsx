import React, { useState, useRef, useEffect } from 'react';
import { getAiInsight } from '../services/geminiService';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      getAiInsight('مرحباً').then((response) => {
        setMessages([{ sender: 'ai', text: response }]);
        setIsLoading(false);
      });
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiInsight(currentInput);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (err) {
      console.error('AI assistant error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'عذراً، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'ما هي أكثر المنتجات مبيعاً؟',
    'كم كانت مبيعات اليوم؟',
    'أعطني اقتراح لتحسين العمل',
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 bg-sea-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-sea-blue-600 transition-transform transform hover:scale-110 z-50"
        aria-label="مساعد SEA الذكي"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7-5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z" />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed bottom-24 left-8 w-96 h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          <header className="bg-sea-blue-800 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">مساعد SEA الذكي</h3>
            <button onClick={() => setIsOpen(false)} className="text-2xl" aria-label="إغلاق">
              &times;
            </button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-xl p-3 max-w-xs ${
                    msg.sender === 'user'
                      ? 'bg-sea-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start my-2">
                <div className="rounded-xl p-3 bg-gray-200 text-gray-800">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="text-xs bg-gray-100 text-sea-blue-700 rounded-full px-3 py-1 hover:bg-gray-200 transition"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسألني أي شيء..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="mr-2 bg-sea-blue-500 text-white p-2 rounded-lg disabled:bg-gray-300"
                aria-label="إرسال"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
