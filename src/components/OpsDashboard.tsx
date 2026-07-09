import React, { useState } from "react";
import { StadiumVenue, CrowdAnalysisResult } from "../types";
import { Activity, Users, Play, RefreshCw, ShieldCheck } from "lucide-react";

interface OpsDashboardProps {
  venue: StadiumVenue;
}

export const OpsDashboard: React.FC<OpsDashboardProps> = ({ venue }) => {
  const [selectedScenario, setSelectedScenario] = useState("Halftime mass concourse movement and food concession congestion.");
  const [analysisResult, setAnalysisResult] = useState<CrowdAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runCrowdAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-crowd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId: venue.id,
          scenario: selectedScenario,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
      {/* Ops Header Banner */}
      <div className="bg-gradient-to-r from-emerald-100 via-sky-50 to-rose-50 dark:bg-[#16161B] dark:border-slate-800 rounded-3xl p-6 sm:p-8 border border-emerald-200/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-200/60 dark:bg-emerald-900/80 px-3 py-1 rounded-full">
            FIFA 2026 Venue Command Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2 font-sans tracking-tight">
            {venue.name} - Operations
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Real-time telemetry, crowd flow prediction, and AI decision support for organizers.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-sm text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attendance</div>
            <div className="text-base font-bold text-slate-800 dark:text-white">{venue.attendance.toLocaleString()}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-sm text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Solar Grid</div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">{venue.solarOutputMW}</div>
          </div>
        </div>
      </div>

      {/* Grid: Zone Telemetry & AI Flow Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zone Telemetry */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Live Zone Telemetry & Congestion Monitoring
            </h3>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-medium border border-emerald-100 dark:border-emerald-800/50">
              Live Feed Active
            </span>
          </div>

          <div className="space-y-4">
            {venue.zones.map((zone) => (
              <div key={zone.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white text-sm">{zone.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Wait Time: {zone.waitTimeMinutes} mins</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Density: {zone.density}</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
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
              </div>
            ))}
          </div>
        </div>

        {/* AI Crowd Flow Simulation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-semibold text-slate-800 dark:text-white text-base">AI Crowd Flow & Mitigation Simulator</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select or type a matchday scenario to simulate AI-powered crowd dispersal and risk assessment.
          </p>

          <div className="space-y-4">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="Halftime mass concourse movement and food concession congestion." className="dark:bg-slate-900">
                Halftime mass concourse movement & food congestion
              </option>
              <option value="Post-match sudden heavy rain causing mass surge into main metro transit station." className="dark:bg-slate-900">
                Post-match sudden heavy rain & metro surge
              </option>
              <option value="VIP security corridor rerouting due to unexpected motorcade arrival." className="dark:bg-slate-900">
                VIP security corridor rerouting
              </option>
            </select>
            <button
              onClick={runCrowdAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Telemetry...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run AI Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Result Box */}
          {analysisResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-sky-50/60 dark:from-emerald-950/60 dark:to-sky-950/60 border border-emerald-100 dark:border-emerald-900/60 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">Simulation Output</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    analysisResult.riskLevel === "Critical" || analysisResult.riskLevel === "High"
                      ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                      : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  Risk Level: {analysisResult.riskLevel}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Identified Bottlenecks:</h5>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {analysisResult.bottlenecks?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Actionable Recommendations:</h5>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {analysisResult.recommendations?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/60 text-xs text-slate-700 dark:text-slate-200">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">AI Flow Prediction: </span>
                {analysisResult.aiSimulatedFlowPrediction}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
