import React, { useState, useRef, useEffect } from 'react';
import { StadiumVenue } from '../types';
import { MessageSquare, Send, Globe, Users, Flame, Trophy, Smile, Sparkles, Heart } from 'lucide-react';

interface GlobalFanChatProps {
  venue: StadiumVenue;
}

interface ChatMessage {
  id: string;
  user: string;
  country: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export const GlobalFanChat: React.FC<GlobalFanChatProps> = ({ venue }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Mateo Silva',
      country: 'Argentina 🇦🇷',
      avatar: '⚽',
      text: `Incredible atmosphere here at ${venue.name}! The pre-match energy is unreal. Vamos Argentina!`,
      timestamp: '10:40 AM',
      likes: 14
    },
    {
      id: '2',
      user: 'Chloe Dubois',
      country: 'France 🇫🇷',
      avatar: '🌟',
      text: 'Greetings from Section 112! Who else is predicting a 2-1 thriller tonight?',
      timestamp: '10:42 AM',
      likes: 8
    },
    {
      id: '3',
      user: 'Kenji Sato',
      country: 'Japan 🇯🇵',
      avatar: '🔥',
      text: 'Amazing stadium organization and seamless transit. Let’s enjoy a fantastic match everyone!',
      timestamp: '10:45 AM',
      likes: 19
    },
    {
      id: '4',
      user: 'Marcus Rashford',
      country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      avatar: '🦁',
      text: 'The fan zone outside is buzzing! Good luck to all teams competing today at World Cup 2026.',
      timestamp: '10:48 AM',
      likes: 22
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('Alex Morgan');
  const [userCountry, setUserCountry] = useState('USA 🇺🇸');
  const [activeChannel, setActiveChannel] = useState<'global' | 'matchday' | 'chants' | 'meetups'>('global');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate incoming live fan messages periodically to make the chat feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      const randomFans = [
        { name: 'Carlos Mendez', country: 'Mexico 🇲🇽', avatar: '🦅', text: `¡El ambiente en ${venue.name} está increíble hoy! 🎉` },
        { name: 'Liam O’Connor', country: 'Ireland 🇮🇪', avatar: '☘️', text: 'Brilliant matchday weather. Enjoy the football everyone!' },
        { name: 'Lucas Silva', country: 'Brazil 🇧🇷', avatar: '⭐', text: 'Joga Bonito! Can’t wait for kickoff! ⚡' },
        { name: 'Emma Watson', country: 'Canada 🇨🇦', avatar: '🍁', text: 'Hosting the world in North America is such an unforgettable experience!' }
      ];
      const randomFan = randomFans[Math.floor(Math.random() * randomFans.length)];
      const newFanMsg: ChatMessage = {
        id: Date.now().toString(),
        user: randomFan.name,
        country: randomFan.country,
        avatar: randomFan.avatar,
        text: randomFan.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: Math.floor(Math.random() * 5) + 1
      };
      setMessages(prev => [...prev.slice(-30), newFanMsg]);
    }, 15000);

    return () => clearInterval(interval);
  }, [venue.name]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: userName,
      country: userCountry,
      avatar: '🌟',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 0
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleLike = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 p-8 text-white shadow-xl border border-indigo-800/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Global Fan Community Arena
              </span>
              <span className="text-xs text-indigo-300/80">• FIFA World Cup 2026 Live Chat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Fans Connected Worldwide
            </h2>
            <p className="text-sm text-indigo-200/80 mt-1">
              Chat live with thousands of spectators across <strong className="text-white">{venue.name}</strong> and all host cities.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              👤
            </div>
            <div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-transparent text-xs font-bold text-white outline-none w-28"
                placeholder="Your Name"
              />
              <select
                value={userCountry}
                onChange={(e) => setUserCountry(e.target.value)}
                className="bg-transparent text-[11px] text-indigo-300 outline-none cursor-pointer"
              >
                <option value="USA 🇺🇸" className="bg-slate-900">USA 🇺🇸</option>
                <option value="Argentina 🇦🇷" className="bg-slate-900">Argentina 🇦🇷</option>
                <option value="Brazil 🇧🇷" className="bg-slate-900">Brazil 🇧🇷</option>
                <option value="France 🇫🇷" className="bg-slate-900">France 🇫🇷</option>
                <option value="England 🏴󠁧󠁢󠁥󠁮󠁧󠁿" className="bg-slate-900">England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
                <option value="Mexico 🇲🇽" className="bg-slate-900">Mexico 🇲🇽</option>
                <option value="Japan 🇯🇵" className="bg-slate-900">Japan 🇯🇵</option>
                <option value="Germany 🇩🇪" className="bg-slate-900">Germany 🇩🇪</option>
                <option value="Canada 🇨🇦" className="bg-slate-900">Canada 🇨🇦</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Matchday Channels</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'global', name: '🌍 Global Fan Lounge', count: '4.8k online' },
              { id: 'matchday', name: `🏟️ ${venue.name} Live`, count: '1.2k here' },
              { id: 'chants', name: '🎵 Chants & Anthems', count: '840 active' },
              { id: 'meetups', name: '🤝 Fan Meetups & Tailgate', count: '510 active' },
            ].map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id as any)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer ${
                  activeChannel === ch.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-semibold">{ch.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeChannel === ch.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {ch.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-2">
            <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Community Guidelines</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Keep discussions respectful, passionate, and welcoming to all football fans worldwide. Enjoy FIFA World Cup 2026!
            </p>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col h-[620px] overflow-hidden">
          {/* Channel Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white capitalize">
                  {activeChannel === 'global' ? 'Global Fan Lounge' : activeChannel === 'matchday' ? `${venue.name} Live Stream` : activeChannel === 'chants' ? 'Chants & Anthems' : 'Fan Meetups & Tailgate'}
                </h4>
                <p className="text-[11px] text-slate-500">Live chat room • Real-time spectator communication</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>4,821 Fans Online</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
            {messages.map((msg) => {
              const isMe = msg.user === userName;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{msg.user}</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded">{msg.country}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-sm shrink-0 shadow-sm">
                      {msg.avatar}
                    </div>

                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      
                      <div className={`flex items-center gap-1.5 mt-2 text-[10px] ${isMe ? 'text-indigo-200 justify-end' : 'text-slate-400 justify-start'}`}>
                        <button
                          onClick={() => handleLike(msg.id)}
                          className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                          <span>{msg.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message as ${userName} (${userCountry})...`}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
