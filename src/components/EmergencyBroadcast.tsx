import React, { useState } from "react";
import { StadiumVenue } from "../types";
import { Megaphone, AlertTriangle, ShieldAlert, Radio, Send, CheckCircle2, BellRing, Volume2 } from "lucide-react";

interface EmergencyBroadcastProps {
  venue: StadiumVenue;
}

export const EmergencyBroadcast: React.FC<EmergencyBroadcastProps> = ({ venue }) => {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [targetZone, setTargetZone] = useState("All Zones");
  const [alertType, setAlertType] = useState<"info" | "warning" | "emergency">("info");
  const [activeBroadcasts, setActiveBroadcasts] = useState([
    { id: "1", text: "Gate 3 experiencing high density queue. Please direct fans to Gate 4 North Concourse.", zone: "Gate 3", type: "warning", time: "2 mins ago" },
    { id: "2", text: "Weather Advisory: Light breeze expected at kickoff. All roof panels fully secured.", zone: "All Zones", type: "info", time: "15 mins ago" },
  ]);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const newBroadcast = {
      id: Date.now().toString(),
      text: broadcastMessage,
      zone: targetZone,
      type: alertType,
      time: "Just now",
    };

    setActiveBroadcasts([newBroadcast, ...activeBroadcasts]);
    setBroadcastMessage("");
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-100 via-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 border border-rose-200/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-800 bg-rose-200/70 px-3 py-1 rounded-full">
            FIFA 2026 Emergency & PA Broadcast Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 font-sans tracking-tight">
            {venue.name} - Safety Command
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Instant public address broadcast, stadium-wide LED screen tickers, and multi-agency radio dispatch.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">System Status</div>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All PA Channels Active
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Sender Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">New PA Broadcast</h3>
              <p className="text-xs text-slate-500">Push to stadium screens & volunteer radios</p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alert Level</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAlertType("info")}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    alertType === "info" ? "bg-sky-500 text-white border-sky-600 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Info
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType("warning")}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    alertType === "warning" ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Advisory
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType("emergency")}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    alertType === "emergency" ? "bg-rose-600 text-white border-rose-700 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Urgent
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Zone</label>
              <select
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="All Zones">Stadium-Wide (All Zones)</option>
                <option value="Gate 1">Gate 1 & South Plaza</option>
                <option value="Gate 3">Gate 3 & West Concourse</option>
                <option value="North Tribunes">North Tribunes Upper Tier</option>
                <option value="VIP Suites">VIP & Executive Suites</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Announcement Text</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type official stadium announcement..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Live Announcement</span>
            </button>

            {sentSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Broadcast successfully transmitted to venue PA & screens!</span>
              </div>
            )}
          </form>
        </div>

        {/* Active Broadcast Ticker & Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Radio className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-base">Active Broadcast History & Ticker</h3>
                <p className="text-xs text-slate-500">Real-time log of announcements broadcasted across {venue.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              {activeBroadcasts.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl border flex items-start gap-4 ${
                    item.type === "emergency" 
                      ? "bg-rose-50 border-rose-200 text-rose-900" 
                      : item.type === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-sky-50 border-sky-200 text-sky-900"
                  }`}
                >
                  <div className="mt-0.5">
                    {item.type === "emergency" ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : item.type === "warning" ? (
                      <BellRing className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-sky-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-black/5">
                        {item.zone}
                      </span>
                      <span className="text-[11px] opacity-75">{item.time}</span>
                    </div>
                    <p className="text-sm font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
