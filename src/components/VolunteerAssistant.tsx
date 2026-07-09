import React, { useState } from "react";
import { StadiumVenue } from "../types";
import { Languages, Sparkles } from "lucide-react";

interface VolunteerAssistantProps {
  venue: StadiumVenue;
}

export const VolunteerAssistant: React.FC<VolunteerAssistantProps> = ({ venue }) => {
  const [phraseInput, setPhraseInput] = useState("Where is the nearest medical first aid station?");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translationResult, setTranslationResult] = useState<{
    translatedPhrase?: string;
    phonetic?: string;
    audioTip?: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const translatePhrase = async () => {
    if (!phraseInput.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/ai/translate-phrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: phraseInput,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      setTranslationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-8">
      {/* Volunteer Banner */}
      <div className="bg-gradient-to-r from-rose-100 via-amber-50 to-sky-50 dark:bg-[#16161B] dark:border-slate-800 rounded-3xl p-6 sm:p-8 border border-rose-200/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-800 dark:text-rose-300 bg-rose-200/60 dark:bg-rose-900/80 px-3 py-1 rounded-full">
            FIFA 2026 Volunteer Command
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2 font-sans tracking-tight">
            {venue.name} - Volunteer Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Multilingual phrase assistance and instant stadium support for tournament volunteers. Use the floating 3D AI Assistant in the bottom right for any further questions!
          </p>
        </div>
      </div>

      {/* Multilingual Phrase Assistant */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center">
            <Languages className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-base">Multilingual Fan Helper</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Translate essential stadium phrases instantly for international fans</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Common Phrase / Question</label>
            <input
              type="text"
              value={phraseInput}
              onChange={(e) => setPhraseInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Language</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Spanish" className="dark:bg-slate-900">Spanish (Español)</option>
              <option value="French" className="dark:bg-slate-900">French (Français)</option>
              <option value="Portuguese" className="dark:bg-slate-900">Portuguese (Português)</option>
              <option value="Mandarin Chinese" className="dark:bg-slate-900">Mandarin Chinese (中文)</option>
              <option value="Japanese" className="dark:bg-slate-900">Japanese (日本語)</option>
              <option value="Korean" className="dark:bg-slate-900">Korean (한국어)</option>
              <option value="German" className="dark:bg-slate-900">German (Deutsch)</option>
              <option value="Italian" className="dark:bg-slate-900">Italian (Italiano)</option>
              <option value="Arabic" className="dark:bg-slate-900">Arabic (العربية)</option>
              <option value="Hindi" className="dark:bg-slate-900">Hindi (हिन्दी)</option>
              <option value="Dutch" className="dark:bg-slate-900">Dutch (Nederlands)</option>
              <option value="Russian" className="dark:bg-slate-900">Russian (Русский)</option>
            </select>
          </div>

          <button
            onClick={translatePhrase}
            disabled={isTranslating}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-2xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isTranslating ? (
              <span>Translating with AI...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Translate Phrase</span>
              </>
            )}
          </button>
        </div>

        {/* Translation Result */}
        {translationResult && (
          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 space-y-3 animate-fadeIn">
            <div className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Translation Result ({targetLang})</div>
            <div className="text-xl font-bold text-slate-800 dark:text-white font-sans">{translationResult.translatedPhrase}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Phonetic: </span> {translationResult.phonetic}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Context Tip: </span> {translationResult.audioTip}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
