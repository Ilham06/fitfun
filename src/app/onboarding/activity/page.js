"use client";

import Link from "next/link";
import { useState } from "react";
import { Armchair, Footprints, Bike, Flame } from "lucide-react";

const levels = [
  { id: "sedentary", icon: Armchair, name: "Sedentary", desc: "Little or no exercise", multiplier: "×1.2" },
  { id: "lightly_active", icon: Footprints, name: "Lightly Active", desc: "Light exercise 1-3 days/week", multiplier: "×1.375" },
  { id: "moderately_active", icon: Bike, name: "Moderately Active", desc: "Moderate exercise 3-5 days/week", multiplier: "×1.55" },
  { id: "very_active", icon: Flame, name: "Very Active", desc: "Hard exercise 6-7 days/week", multiplier: "×1.725" },
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
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => setSelected(level.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all bg-white ${
                selected === level.id
                  ? "border-[#2D9C7E] shadow-md"
                  : "border-transparent shadow-sm hover:border-[#2D9C7E]/30"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#E8F5F0] flex items-center justify-center">
                <Icon size={20} className="text-[#2D9C7E]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-text">{level.name}</div>
                <div className="text-xs text-muted mt-0.5">{level.desc}</div>
              </div>
              <span className="text-xs font-bold text-[#2D9C7E]">{level.multiplier}</span>
              {selected === level.id && (
                <div className="w-6 h-6 rounded-full bg-[#2D9C7E] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href="/onboarding/program"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-white text-text2 text-sm font-semibold hover:border-[#2D9C7E]/30 transition-colors shadow-sm"
        >
          Back
        </Link>
        <Link
          href="/onboarding/goal"
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#2D9C7E] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
        >
          Next
        </Link>
      </div>
    </>
  );
}
