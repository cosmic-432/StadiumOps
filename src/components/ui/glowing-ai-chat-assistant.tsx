import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X, Loader2 } from 'lucide-react';

interface FloatingAiAssistantProps {
  currentRole?: string;
  venueId?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({ currentRole = 'fan', venueId = 'metlife' }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: `Hello! I'm your StadiaAI assistant for FIFA World Cup 2026. How can I help you with match schedules, stadium navigation, food wait times, or transit today?`
    }
  ]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const maxChars = 2000;
  const chatRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSend = async () => {
    if (!message.trim() || isLoadingAI) return;

    const userText = message.trim();
    setMessage('');
    setCharCount(0);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoadingAI(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          role: currentRole,
          venueId: venueId,
          history: newMessages.slice(0, -1),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', text: data.reply || "I'm here to help with your FIFA 2026 stadium needs!" }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', text: data.error || "Sorry, I encountered an error communicating with the AI service." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', text: "Failed to connect to StadiaAI service. Please check your connection." }]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current || !btnRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);

    btnRef.current.style.transition = 'transform 0.1s linear';
    btnRef.current.style.transform = `translate(${x * 0.35}px, ${y * 0.45}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
    btnRef.current.style.transform = 'translate(0px, 0px)';
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        if (!(event.target as HTMLElement).closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Magnetic Wrapper */}
      <div 
        ref={wrapRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="p-8 -m-8 flex items-center justify-center"
      >
        {/* Floating 3D Glowing AI Logo */}
        <button 
          ref={btnRef}
          className={`floating-ai-button relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
            isChatOpen ? 'rotate-90 scale-95' : 'rotate-0'
          }`}
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            background: 'linear-gradient(135deg, #FF385C 0%, #E00B41 100%)',
            boxShadow: '0 10px 30px -5px rgba(255, 56, 92, 0.5), 0 0 25px rgba(224, 11, 65, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            willChange: 'transform',
          }}
        >
          {/* 3D glass highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-60"></div>
          
          {/* Inner glow ring */}
          <div className="absolute inset-1 rounded-full border border-white/30"></div>
          
          {/* AI Mascot Logo */}
          <div className="relative z-10 text-white drop-shadow-md flex items-center justify-center">
          { isChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg className="w-7 h-7 drop-shadow-lg animate-bounce" viewBox="0 0 24 24" fill="none">
              <path d="M4 14C4 18.5 7.5 21 12 21C16.5 21 20 18.5 20 14V11C20 8.5 16.5 7 12 7C7.5 7 4 8.5 4 11V14Z" fill="url(#rauschGrad)" />
              <path d="M12 7V3C10.5 4 10 5.5 10 7H12Z" fill="#FFA3B1" />
              <path d="M9 7.5C7.5 6.5 6.5 5 6 4C7.5 5.5 8.5 7 9 7.5Z" fill="#FFA3B1" />
              <path d="M15 7.5C16.5 6.5 17.5 5 18 4C16.5 5.5 15.5 7 15 7.5Z" fill="#FFA3B1" />
              <rect x="6.5" y="10.5" width="11" height="6" rx="3" fill="white" />
              <ellipse cx="9.5" cy="13.5" rx="1" ry="1.5" fill="#4A0E17" />
              <ellipse cx="14.5" cy="13.5" rx="1" ry="1.5" fill="#4A0E17" />
              <defs>
                <linearGradient id="rauschGrad" x1="4" y1="7" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF385C" />
                  <stop offset="1" stopColor="#BD1E59" />
                </linearGradient>
              </defs>
            </svg>
          )}
          </div>
          
          {/* Glowing aura animation */}
          <div className="absolute -inset-1.5 rounded-full animate-pulse opacity-85 bg-gradient-to-r from-rose-500 via-pink-500 to-red-400 blur-md -z-10"></div>
        </button>
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <div 
          ref={chatRef}
          className="absolute bottom-20 right-0 w-[90vw] max-w-[440px] transition-all duration-300 origin-bottom-right"
          style={{
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="relative flex flex-col rounded-3xl bg-gradient-to-br from-zinc-900/95 to-zinc-950/98 border border-zinc-700/60 shadow-2xl backdrop-blur-3xl overflow-hidden text-zinc-100 max-h-[600px]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-zinc-200">StadiaAI ({currentRole.toUpperCase()})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-300 rounded-full">
                  Gemini 3.5
                </span>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[350px] min-h-[220px]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-rose-600 text-white rounded-br-none shadow-md'
                        : 'bg-zinc-800/90 text-zinc-200 rounded-bl-none border border-zinc-700/50 shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoadingAI && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs px-2 py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  <span>StadiaAI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="relative border-t border-zinc-800/80 bg-zinc-900/60 p-3">
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={2}
                className="w-full px-3 py-2 bg-zinc-950/60 border border-zinc-700/50 rounded-xl outline-none resize-none text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 transition-colors"
                placeholder={`Ask as ${currentRole} about FIFA 2026 matches, queues, transit...`}
              />

              <div className="flex items-center justify-between mt-2 pt-1">
                <div className="text-[11px] text-zinc-500">
                  <span>{charCount}</span>/<span className="text-zinc-400">{maxChars}</span>
                </div>

                <button 
                  onClick={handleSend}
                  disabled={isLoadingAI || !message.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 rounded-xl cursor-pointer text-white text-xs font-semibold shadow-lg hover:from-rose-500 hover:to-rose-400 transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
