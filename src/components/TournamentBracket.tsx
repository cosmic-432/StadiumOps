import React, { useState } from "react";
import { StadiumVenue } from "../types";
import { Trophy, Calendar, MapPin, Globe, Award, Sparkles, ChevronRight } from "lucide-react";

interface TournamentBracketProps {
  venue: StadiumVenue;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({ venue }) => {
  const [selectedRound, setSelectedRound] = useState<"groups" | "round16" | "quarter" | "semi" | "final">("groups");

  const matches = [
    { id: 1, stage: "Group Stage", date: "June 14, 2026", teams: "Brazil vs. France", venue: "MetLife Stadium, NY/NJ", status: "Upcoming", score: "— : —" },
    { id: 2, stage: "Group Stage", date: "June 17, 2026", teams: "Argentina vs. Germany", venue: "SoFi Stadium, Los Angeles", status: "Upcoming", score: "— : —" },
    { id: 3, stage: "Group Stage", date: "June 20, 2026", teams: "England vs. Spain", venue: "AT&T Stadium, Dallas", status: "Upcoming", score: "— : —" },
    { id: 4, stage: "Round of 32", date: "June 28, 2026", teams: "Winner Group A vs. 3rd Place C", venue: "Mercedes-Benz Stadium, Atlanta", status: "Scheduled", score: "— : —" },
    { id: 5, stage: "Round of 16", date: "July 4, 2026", teams: "Winner Match 73 vs. Winner Match 74", venue: "MetLife Stadium, NY/NJ", status: "Scheduled", score: "— : —" },
    { id: 6, stage: "Quarter-Final", date: "July 10, 2026", teams: "Winner Match 89 vs. Winner Match 90", venue: "Gillette Stadium, Boston", status: "Scheduled", score: "— : —" },
    { id: 7, stage: "Semi-Final", date: "July 14, 2026", teams: "Winner QF1 vs. Winner QF2", venue: "AT&T Stadium, Dallas", status: "Scheduled", score: "— : —" },
    { id: 8, stage: "FIFA World Cup Final", date: "July 19, 2026", teams: "Winner SF1 vs. Winner SF2", venue: "MetLife Stadium, NY/NJ", status: "Grand Finale", score: "— : —" },
  ];

  const filteredMatches = selectedRound === "groups" 
    ? matches.filter(m => m.stage === "Group Stage")
    : selectedRound === "round16"
    ? matches.filter(m => m.stage.includes("Round"))
    : selectedRound === "quarter"
    ? matches.filter(m => m.stage.includes("Quarter"))
    : selectedRound === "semi"
    ? matches.filter(m => m.stage.includes("Semi"))
    : matches.filter(m => m.stage.includes("Final"));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-emerald-50 to-indigo-100 rounded-3xl p-6 sm:p-8 border border-sky-200/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800 bg-sky-200/70 px-3 py-1 rounded-full">
            FIFA World Cup 2026 Official Tournament Schedule
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 font-sans tracking-tight">
            Match Bracket & Fixtures
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Explore 104 matches across 16 host cities in USA, Canada, and Mexico leading to the July 19 final at MetLife Stadium.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-2xl border border-sky-200 shadow-sm flex items-center gap-3">
          <Trophy className="w-8 h-8 text-sky-600 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Tournament Stage</div>
            <div className="text-sm font-bold text-slate-800">48 Teams • 3 Host Nations</div>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedRound("groups")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            selectedRound === "groups" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Group Stage
        </button>
        <button
          onClick={() => setSelectedRound("round16")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            selectedRound === "round16" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Round of 32 & 16
        </button>
        <button
          onClick={() => setSelectedRound("quarter")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            selectedRound === "quarter" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Quarter-Finals
        </button>
        <button
          onClick={() => setSelectedRound("semi")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            selectedRound === "semi" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Semi-Finals
        </button>
        <button
          onClick={() => setSelectedRound("final")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            selectedRound === "final" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Final Match
        </button>
      </div>

      {/* Matches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((m) => (
          <div key={m.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {m.stage}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {m.date}
              </span>
            </div>

            <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="text-lg font-bold text-slate-800 tracking-tight">{m.teams}</div>
              <div className="text-xs font-mono font-semibold text-rose-600">{m.score}</div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {m.venue}
              </span>
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
