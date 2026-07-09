import React, { useState, useEffect } from 'react';
import { StadiumVenue, WeatherData } from '../types';
import { CloudSun, Wind, Droplets, Sun, Compass, RefreshCw, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

interface LiveWeatherWidgetProps {
  venue: StadiumVenue;
}

export const LiveWeatherWidget: React.FC<LiveWeatherWidgetProps> = ({ venue }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWeather = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/weather/${venue.id}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Failed to load weather:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [venue.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-sky-800/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5" />
                Live Meteorological Telemetry
              </span>
              <span className="text-xs text-sky-300/80">• FIFA World Cup 2026 Climate Watch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Weather Operations: {venue.name}
            </h2>
            <p className="text-sm text-sky-200/80 mt-1">
              Active Match: <strong className="text-white">{venue.match}</strong>
            </p>
          </div>

          <button
            onClick={fetchWeather}
            disabled={isRefreshing}
            className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 rounded-xl text-xs font-semibold text-sky-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Radar</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          Loading live weather radar and telemetry...
        </div>
      ) : weather ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Temperature</p>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {weather.temp}
                  </h3>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 flex items-center justify-center text-sky-500 shadow-inner">
                  <Sun className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sky Condition</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{weather.condition}</p>
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Matchday Hourly Forecast</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {weather.hourlyForecast.map((hf, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">{hf.time}</span>
                      <span className="text-base font-bold text-slate-800 dark:text-white my-1 block">{hf.temp}</span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">{hf.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Telemetry Feed: NOAA & Venue Doppler Radar</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Safe Matchday Conditions
              </span>
            </div>
          </div>

          {/* Meteorological Metrics & Radar Status */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-500" />
                <span>Atmospheric Metrics</span>
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Humidity</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{weather.humidity}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Wind className="w-4 h-4 text-indigo-500" />
                    <span>Wind Velocity</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{weather.wind}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>UV Index</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{weather.uvIndex}</span>
                </div>
              </div>
            </div>

            {/* Radar Doppler Status */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-sm border border-emerald-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Doppler Radar Status</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {weather.radarStatus}
              </p>
              <div className="pt-2 text-[11px] text-emerald-400/80 font-medium">
                ✓ No weather advisories or lightning alerts active for this venue sector.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
