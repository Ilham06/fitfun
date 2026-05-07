"use client";

import Link from "next/link";
import { useState } from "react";

const levels = [
  { id: "sedentary", icon: "🧘", name: "Sedentary", desc: "Little or no exercise", multiplier: "×1.2" },
  { id: "lightly_active", icon: "🚶", name: "Lightly Active", desc: "Light exercise 1-3 days/week", multiplier: "×1.375" },
  { id: "moderately_active", icon: "⚡", name: "Moderately Active", desc: "Moderate exercise 3-5 days/week", multiplier: "×1.55" },
  { id: "very_active", icon: "🏃", name: "Very Active", desc: "Hard exercise 6-7 days/week", multiplier: "×1.725" },
];

export default function OnboardingActivity() {
  const [selected, setSelected] = useState("moderately_active");

  return (
    <>
      <h2 className="font-display text-2xl font-black text-text mb-2">
        Activity Level
      </h2>
      <p className="text-muted text-sm mb-8">
        How active are you on a typical week? This determines your TDEE multiplier.
      </p>

      <div className="flex flex-col gap-3 flex-1">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setSelected(level.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              selected === level.id
                ? "border-accent bg-accent-light"
                : "border-border2 bg-surface2 hover:border-accent-mid"
            }`}
          >
            <span className="text-2xl">{level.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm text-text">{level.name}</div>
              <div className="text-xs text-muted mt-0.5">{level.desc}</div>
            </div>
            <span className="text-xs font-bold text-accent">{level.multiplier}</span>
            {selected === level.id && (
              <span className="text-accent font-bold">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/onboarding/program"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-surface2 text-text2 text-sm font-semibold hover:border-accent-mid transition-colors"
        >
          Back
        </Link>
        <Link
          href="/onboarding/goal"
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-accent text-white text-sm font-semibold shadow-[0_2px_8px_rgba(217,95,43,0.28)] hover:bg-[#C4501E] transition-colors"
        >
          Next
        </Link>
      </div>
    </>
  );
}
