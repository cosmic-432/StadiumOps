import React, { useState } from "react";
import { StadiumVenue } from "../types";
import { Crown, QrCode, ShieldAlert, Sparkles, CheckCircle2, Utensils, Car, Key, Award } from "lucide-react";

interface VipSuitePassProps {
  venue: StadiumVenue;
}

export const VipSuitePass: React.FC<VipSuitePassProps> = ({ venue }) => {
  const [guestName, setGuestName] = useState("Eleanor Vance");
  const [suiteNumber, setSuiteNumber] = useState("Executive Suite 402");
  const [conciergeRequested, setConciergeRequested] = useState(false);
  const [parkingCode, setParkingCode] = useState("VIP-LOT-A-72");
  const [serviceNote, setServiceNote] = useState("");

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceNote.trim()) return;
    setConciergeRequested(true);
    setTimeout(() => {
      setConciergeRequested(false);
      setServiceNote("");
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-rose-50 to-purple-100 rounded-3xl p-6 sm:p-8 border border-amber-200/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full">
            FIFA 2026 Executive & VIP Lounge
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 font-sans tracking-tight">
            {venue.name} - VIP Hospitality
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Fast-track gate access, private suite concierge, and priority valet parking for FIFA delegates and VIP guests.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Access Level</div>
            <div className="text-sm font-bold text-slate-800">FIFA Tier 1 VIP Pass</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VIP Digital Badge / Pass Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
                Official Credential
              </span>
              <h3 className="text-xl font-bold font-sans mt-3 text-white">FIFA WORLD CUP 2026</h3>
              <p className="text-xs text-slate-300">{venue.match}</p>
            </div>
            <Award className="w-7 h-7 text-amber-400 shrink-0" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center space-y-3">
            <div className="w-32 h-32 mx-auto bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="text-xs text-amber-300 font-mono tracking-wider">SECURE-VIP-TOKEN-9942</div>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Delegate Name:</span>
              <input 
                type="text" 
                value={guestName} 
                onChange={(e) => setGuestName(e.target.value)}
                className="bg-transparent text-right font-semibold text-white focus:outline-none border-b border-amber-500/40 w-36"
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Suite Allocation:</span>
              <span className="font-semibold text-amber-200">{suiteNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Valet Bay:</span>
              <span className="font-semibold text-emerald-400">{parkingCode}</span>
            </div>
          </div>
        </div>

        {/* Suite Concierge & Amenities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-base">In-Suite Gastronomy & Beverage Service</h3>
                <p className="text-xs text-slate-500">Order gourmet dining or private sommelier wine pairing directly to your suite</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setServiceNote("Requested Champagne & Canapés")}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all space-y-1 group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Champagne & Caviar</div>
                <div className="text-[11px] text-slate-500">Vintage Brut & artisanal canapés</div>
              </button>
              <button 
                onClick={() => setServiceNote("Requested Premium Matchday Buffet")}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all space-y-1 group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Executive Buffet</div>
                <div className="text-[11px] text-slate-500">Prime rib & local cheeses</div>
              </button>
              <button 
                onClick={() => setServiceNote("Requested Dedicated Host")}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all space-y-1 group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Dedicated Host</div>
                <div className="text-[11px] text-slate-500">Personal concierge assistance</div>
              </button>
            </div>

            <form onSubmit={handleRequestService} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Custom Suite Request / Dietary Note</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={serviceNote}
                    onChange={(e) => setServiceNote(e.target.value)}
                    placeholder="e.g. Additional seating for 2 guests in Suite 402..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all shrink-0"
                  >
                    Send Request
                  </button>
                </div>
              </div>

              {conciergeRequested && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Success! Your suite concierge has received your request and is en route.</span>
                </div>
              )}
            </form>
          </div>

          {/* Valet & Fast Track Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Car className="w-4 h-4 text-amber-600" />
                <span>Priority Valet Parking</span>
              </div>
              <p className="text-xs text-slate-600">
                Your vehicle is pre-registered in Bay 72. Present your digital badge at Gate 1 VIP Expressway for seamless entry.
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Private Elevator Keycard</span>
              </div>
              <p className="text-xs text-slate-600">
                Tap your NFC-enabled badge at the South Tower elevators for direct access to the Skyboxes and Media Lounge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
