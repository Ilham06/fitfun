"use client";
import { useEffect, useState } from "react";

export default function AiTipCard() {
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/daily-tip", { method: "POST" })
      .then((r) => r.json())
      .then((d) => { setTip(d.data?.tip || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-5 bg-[#5B21B6] rounded-3xl p-4 shadow-md">
      <div className="flex items-stretch gap-3">
        <div className="shrink-0 w-16">
          <img src="/images/ai.png" alt="AI" className="w-full h-full object-contain object-top" />
        </div>
        <div className="flex-1">
          <span className="font-bold text-xs text-[#E9D5FF] mb-1 block">AI Tip</span>
          {loading ? (
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="h-2.5 bg-white/20 rounded-full w-full animate-pulse" />
              <div className="h-2.5 bg-white/20 rounded-full w-4/5 animate-pulse" />
              <div className="h-2.5 bg-white/20 rounded-full w-3/5 animate-pulse" />
            </div>
          ) : (
            <p className="text-[12px] text-white/90 leading-relaxed">
              {tip || "Keep tracking your meals to stay on target!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
