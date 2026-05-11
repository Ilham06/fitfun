"use client";
import { useEffect, useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n";

const MEAL_EMOJIS = ["🍛", "🥗", "🍳", "🥩", "🍜"];

export default function AiRecommendation({ lang }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/daily-tip", { method: "POST" })
      .then((r) => r.json())
      .then((d) => { setSuggestions(d.data?.suggestions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-[#2D9C7E]" />
        <h3 className="font-bold text-sm text-gray-800">{t(lang, "ai_recommendations")}</h3>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-12 bg-[#F8F9FA] rounded-2xl animate-pulse" />
          <div className="h-12 bg-[#F8F9FA] rounded-2xl animate-pulse" />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-[11px] text-gray-400 text-center py-2">No suggestions available.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-2xl">
              <span className="text-lg">{MEAL_EMOJIS[i % MEAL_EMOJIS.length]}</span>
              <span className="text-[11px] text-gray-600 flex-1 font-medium">
                {s.name} · {s.kcal} kcal · {s.proteinG}g P
              </span>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
