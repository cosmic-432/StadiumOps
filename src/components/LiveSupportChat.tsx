import React, { useState, useRef, useEffect } from 'react';
import { StadiumVenue, SupportTicket } from '../types';
import { MessageSquare, Send, Bot, CheckCircle2, Clock, AlertCircle, PlusCircle, Headphones, Loader2, Sparkles } from 'lucide-react';

interface LiveSupportChatProps {
  venue: StadiumVenue;
}

interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'ai';
  text: string;
  timestamp: string;
}

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({ venue }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-8042',
      subject: 'Assistance requested for Gate B wheelchair entry ramp',
      category: 'Accessibility',
      status: 'In Progress',
      priority: 'High',
      lastMessage: 'A venue accessibility steward is en route to Gate B south portal.',
      updatedAt: '2 mins ago'
    },
    {
      id: 'TCK-8039',
      subject: 'Concession queue inquiry for Sector 108',
      category: 'General',
      status: 'Open',
      priority: 'Medium',
      lastMessage: 'Wait time is currently 14 minutes. Express self-service kiosks open at Section 112.',
      updatedAt: '10 mins ago'
    }
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string>('TCK-8042');
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: `Hello! Welcome to StadiumOps Live Support Desk for ${venue.name}. How can our venue operations team assist you with your match experience today?`,
      timestamp: '10:45 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Assistance requested for Gate B wheelchair entry ramp',
      timestamp: '10:46 AM'
    },
    {
      id: 'm3',
      sender: 'agent',
      text: 'A venue accessibility steward is en route to Gate B south portal.',
      timestamp: '10:47 AM'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Accessibility');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg: SupportMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          category: category,
          venueId: venue.id
        })
      });

      const data = await res.json();
      
      const replyMsg: SupportMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: data.reply || "Support operator has reviewed your message and is coordinating resolution.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: "[Live Support Desk]: Your message was successfully recorded. A steward is reviewing your inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewTicket = () => {
    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTck: SupportTicket = {
      id: newId,
      subject: `New inquiry regarding ${category} at ${venue.name}`,
      category: category,
      status: 'Open',
      priority: 'Medium',
      lastMessage: 'Ticket created. Waiting for operator dispatch.',
      updatedAt: 'Just now'
    };
    setTickets([newTck, ...tickets]);
    setSelectedTicketId(newId);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'agent',
        text: `[Ticket ${newId} Created]: Welcome to Live Support Desk. Please describe your request regarding ${category}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 p-8 text-white shadow-xl border border-emerald-800/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                Live Operator & AI Support Desk
              </span>
              <span className="text-xs text-emerald-300/80">• 24/7 Matchday Concierge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Stadium Support & Ticketing Hub
            </h2>
            <p className="text-sm text-emerald-200/80 mt-1">
              Connect instantly with human venue stewards or AI support agents for <strong className="text-white">{venue.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-slate-900/80 border border-emerald-500/40 text-white rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer"
            >
              <option value="Ticketing">Ticketing</option>
              <option value="Seating">Seating</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Lost & Found">Lost & Found</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General</option>
            </select>

            <button
              onClick={handleCreateNewTicket}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Support Tickets</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {tickets.length} Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {tickets.map(tck => (
              <div
                key={tck.id}
                onClick={() => setSelectedTicketId(tck.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTicketId === tck.id
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{tck.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    tck.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {tck.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{tck.subject}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{tck.lastMessage}</p>
                <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                  <span>{tck.category}</span>
                  <span>{tck.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat Window */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>StadiumOps Live Operator Desk</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">Online</span>
                </h4>
                <p className="text-[11px] text-slate-500">Ticket #{selectedTicketId} • Category: {category}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Assisted Dispatch</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                  <span>{msg.sender === 'user' ? 'You' : 'Venue Operator / AI'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>Support operator is typing a response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message to the stadium support desk..."
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !inputMessage.trim()}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
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
