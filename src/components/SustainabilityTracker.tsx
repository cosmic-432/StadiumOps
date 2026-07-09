import React from "react";
import { StadiumVenue } from "../types";
import { Leaf, Sun, Zap, Droplet, Recycle, Wind, Award, ArrowUpRight, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SustainabilityTrackerProps {
  venue: StadiumVenue;
}

const energyData = [
  { name: "Solar Rooftop Array", value: 45, color: "#10b981" },
  { name: "Battery Storage", value: 25, color: "#06b6d4" },
  { name: "Renewable Grid Hydro", value: 20, color: "#3b82f6" },
  { name: "Wind Turbine Offset", value: 10, color: "#8b5cf6" },
];

export const SustainabilityTracker: React.FC<SustainabilityTrackerProps> = ({ venue }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-50 dark:bg-[#16161B] dark:border-slate-800 rounded-3xl p-6 sm:p-8 border border-emerald-200/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-200/60 dark:bg-emerald-900/80 px-3 py-1 rounded-full">
            FIFA 2026 Green Goal Initiative
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2 font-sans tracking-tight">
            Sustainability & Net-Zero Tracker - {venue.name}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Tracking renewable energy generation, carbon footprint reduction, zero-waste diversion, and water conservation in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-sm">
          <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sustainability Rating</div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">{venue.sustainabilityScore}</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center">
            <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Solar Power Gen</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{venue.solarOutputMW}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Roof photovoltaic array operating at 94% peak efficiency</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
            <Recycle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Zero-Waste Diversion</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">98.4%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compostable packaging & automated sorting bins</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center">
            <Droplet className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Rainwater Harvested</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">14,250 Gal</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Used for pitch irrigation & facility restrooms</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center">
            <Wind className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Carbon Offset Saved</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">42.8 Tons</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Through electric stadium shuttle fleets & rail priority</p>
          </div>
        </div>
      </div>

      {/* Renewable Energy Allocation Pie Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Renewable Energy Source Breakdown</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time distribution of power powering floodlights, concourse HVAC, and pitch turf maintenance.
            </p>
          </div>

          <div className="h-72 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={energyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 22;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#94a3b8"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-[10px] font-medium"
                      >
                        {value}%
                      </text>
                    );
                  }}
                  labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                >
                  {energyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={48} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#94a3b8' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Initiatives Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              FIFA 2026 Eco-Pledge
            </h3>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-medium border border-emerald-100 dark:border-emerald-800/50">
              Certified Green Venue
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-800 dark:text-white text-sm flex items-center justify-between">
                <span>LED Smart Floodlighting</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">-65% Energy</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Dynamic illumination powered entirely by rooftop solar batteries and intelligent motion dimming.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-800 dark:text-white text-sm flex items-center justify-between">
                <span>Green Transit Priority</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">88% Ridership</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Over 88% of spectators arrived via express electric rail and zero-emission shuttle fleets today.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-800 dark:text-white text-sm flex items-center justify-between">
                <span>Zero Single-Use Plastic</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Biodegradable</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                All beverage containers and food serviceware are crafted from plant-based compostable materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

