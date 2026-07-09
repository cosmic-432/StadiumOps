import React, { useState } from "react";
import { StadiumVenue, ZoneTelemetry } from "../types";
import { MapPin, Users, AlertTriangle, CheckCircle2, RefreshCw, ZoomIn, Eye, Activity, ShieldCheck } from "lucide-react";

interface CrowdDensityMapProps {
  venue: StadiumVenue;
}

export const CrowdDensityMap: React.FC<CrowdDensityMapProps> = ({ venue }) => {
  const [selectedZone, setSelectedZone] = useState<ZoneTelemetry | null>(venue.zones[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredZones = filterStatus === "All" 
    ? venue.zones 
    : venue.zones.filter(z => z.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Congested":
      case "Peak Queue":
        return "bg-rose-500 text-white shadow-rose-500/30";
      case "Busy":
        return "bg-amber-500 text-white shadow-amber-500/30";
      default:
        return "bg-emerald-500 text-white shadow-emerald-500/30";
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Congested":
      case "Peak Queue":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Busy":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-rose-50 to-emerald-50 dark:bg-[#16161B] dark:border-slate-800 rounded-3xl p-6 sm:p-8 border border-sky-200/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800 dark:text-sky-300 bg-sky-200/60 dark:bg-sky-900/80 px-3 py-1 rounded-full">
            FIFA 2026 Stadium Arena Map
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2 font-sans tracking-tight">
            Visual Stadium Crowd Map - {venue.name}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Interactive stadium bowl schematic. Click any sector around the pitch to inspect real-time crowd density, wait times, and camera feeds.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-3 rounded-2xl border border-sky-100 dark:border-sky-900/60 shadow-sm">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live Attendance</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{venue.attendance.toLocaleString()} / {venue.capacity.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Filter Status:</span>
          {["All", "Normal Flow", "Busy", "Congested", "Peak Queue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterStatus === status
                  ? "bg-slate-800 dark:bg-slate-700 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          Telemetry Live Feed Active
        </div>
      </div>

      {/* Main Grid: Visual Stadium Arena Map + Zone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stadium Interactive Oval Schematic */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                STADIUM BOWL SCHEMATIC
              </span>
              <h3 className="text-xl font-bold mt-2">Interactive Pitch & Stand Map</h3>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Normal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Busy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Congested</span>
            </div>
          </div>

          {/* Authentic Stadium Oval Container */}
          <div className="relative w-full max-w-lg mx-auto h-[340px] my-auto flex items-center justify-center">
            {/* Outer Stadium Bowl Ring */}
            <div className="absolute inset-0 rounded-[140px] border-4 border-slate-700 bg-slate-800/40 backdrop-blur shadow-2xl flex items-center justify-center p-6">
              {/* Inner Concourse Ring */}
              <div className="w-full h-full rounded-[110px] border-2 border-dashed border-slate-600/60 relative flex items-center justify-center">
                
                {/* Football Pitch in Center */}
                <div className="w-48 h-28 bg-emerald-700/80 rounded-2xl border-2 border-white/60 relative flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 border-t border-white/65"></div>
                  <div className="w-12 h-12 rounded-full border border-white/65 absolute"></div>
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-6 border-r border-y border-white/65"></div>
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-6 border-l border-y border-white/65"></div>
                  <span className="text-[10px] font-mono tracking-widest text-white/80 font-bold uppercase z-10">PITCH</span>
                </div>

                {/* Clickable Sector Buttons Positioned Around the Stadium */}
                {venue.zones.map((zone, idx) => {
                  // Position zones around the oval
                  const positions = [
                    "top-2 left-1/2 -translate-x-1/2", // North Concourse
                    "bottom-2 left-1/2 -translate-x-1/2", // South Concourse
                    "top-1/2 left-2 -translate-y-1/2", // West Gate
                    "top-1/2 right-2 -translate-y-1/2", // East VIP Gate
                    "top-6 right-10", // Concourse NW / NE
                    "bottom-6 left-10", // Concourse SW / SE
                  ];
                  const posClass = positions[idx % positions.length];
                  const isSelected = selectedZone?.id === zone.id;

                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`absolute ${posClass} px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-lg border ${
                        isSelected
                          ? "bg-white text-slate-900 border-white scale-110 z-20 shadow-emerald-500/50"
                          : "bg-slate-900/90 text-white border-slate-600 hover:bg-slate-800 hover:scale-105 z-10"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(zone.status).split(" ")[0]}`}></span>
                      <span className="truncate max-w-[110px]">{zone.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({zone.waitTimeMinutes}m)</span>
                    </button>
                  );
                })}

              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 mt-4">
            <span>Click any sector badge on the stadium map to inspect telemetry</span>
            <span className="font-mono text-emerald-400">MAP ENGINE: ACTIVE</span>
          </div>
        </div>

        {/* Selected Zone Inspector Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          {selectedZone ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sector Inspector</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedZone.name}</h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getBadgeStyle(selectedZone.status)}`}>
                  {selectedZone.status}
                </span>
              </div>

              {/* Simulated camera snapshot */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-44 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
                  alt="Stadium sector camera feed"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  CAM-0{selectedZone.id} LIVE FEED
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-800 dark:text-white text-xs px-3 py-1 rounded-xl font-semibold shadow">
                  {selectedZone.density} Density
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Average Wait Time</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedZone.waitTimeMinutes} minutes</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Flow Recommendation</span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                    {selectedZone.waitTimeMinutes > 15 ? "Reroute via Gate B" : "Smooth Flow"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Select a sector from the stadium map to inspect telemetry
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400">FIFA 2026 AI Crowd Management Engine v4.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

