import React, { useState } from "react";
import { Sparkles, X, Download, Image as ImageIcon } from "lucide-react";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState("Vibrant World Cup 2026 celebration banner with pastel stadium architecture and soccer ball floating above green pitch.");
  const [style, setStyle] = useState("Minimalist Pastel Art");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || "Failed to generate image.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-100 to-rose-100 dark:from-purple-950 dark:to-rose-950 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">AI Studio Banner & Poster Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 3.1 Flash Image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Banner Description / Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Visual Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Minimalist Pastel Art" className="dark:bg-slate-900">Minimalist Pastel Art</option>
              <option value="Modern Stadium Vector Illustration" className="dark:bg-slate-900">Modern Stadium Vector Illustration</option>
              <option value="Futuristic Neon Pastel Matchday Poster" className="dark:bg-slate-900">Futuristic Neon Pastel Matchday Poster</option>
              <option value="Eco-Friendly Green Stadium Concept" className="dark:bg-slate-900">Eco-Friendly Green Stadium Concept</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white py-3 rounded-2xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generating AI Graphic (approx. 5s)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Graphic</span>
              </>
            )}
          </button>

          {error && <p className="text-xs text-rose-600 dark:text-rose-400 text-center">{error}</p>}

          {imageUrl && (
            <div className="space-y-3 pt-2">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-800">
                <img src={imageUrl} alt="Generated AI Banner" className="w-full h-auto object-cover" />
              </div>
              <button
                onClick={() => {
                  if (!imageUrl) return;
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = 'fifa2026_stadium_poster.svg';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-2xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Generated Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
