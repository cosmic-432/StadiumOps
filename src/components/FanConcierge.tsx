import React from "react";
import { StadiumVenue } from "../types";
import { Compass, Clock, Utensils, Bus, Sparkles, Leaf, ShieldAlert } from "lucide-react";

interface FanConciergeProps {
  venue: StadiumVenue;
}

export const FanConcierge: React.FC<FanConciergeProps> = ({ venue }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-rose-50 to-amber-50 dark:bg-[#16161B] dark:border-slate-800 rounded-3xl p-6 sm:p-8 border border-sky-200/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-700 dark:text-sky-300 bg-sky-200/60 dark:bg-sky-900/80 px-3 py-1 rounded-full">
            FIFA World Cup 2026 Fan Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2 font-sans tracking-tight">
            {venue.match}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-xl">
            {venue.name} • Capacity: {venue.capacity.toLocaleString()} • Weather: {venue.weather}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-3 rounded-2xl border border-sky-100 dark:border-sky-900/60 shadow-sm">
          <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sustainability Status</div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{venue.sustainabilityScore}</div>
          </div>
        </div>
      </div>

      {/* Live Gate & Queue Telemetry Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Live Gate & Concession Wait Times
          </h3>
          <span className="text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-medium border border-emerald-100 dark:border-emerald-800/50">
            Real-time Telemetry Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venue.zones.map((zone) => (
            <div key={zone.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white text-base">{zone.name}</h4>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      zone.status === "Congested" || zone.status === "Peak Queue"
                        ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                        : zone.status === "Busy"
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                        : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Estimated queue wait time & density tracking</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-500" /> Wait Time
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">{zone.waitTimeMinutes} mins</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-500" /> Density Level
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{zone.density}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transit & Green Commute Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center">
            <Bus className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Matchday Green Transit Guide</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Plan your low-emission journey to {venue.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Express Rail Shuttle</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Direct express trains running every 4 minutes from Central Terminal.</p>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50">
              Wait Time: 4 mins
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Electric Bus Network</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Zero-emission electric buses operating dedicated stadium lanes.</p>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50">
              Wait Time: 6 mins
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Bicycle & Scooter Valet</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Secure, attended parking stands available at North Plaza.</p>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-100 dark:border-sky-800/50">
              Available (Free)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
