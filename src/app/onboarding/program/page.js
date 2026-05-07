"use client";

import Link from "next/link";
import { useState } from "react";

const programs = [
  {
    id: "BULKING",
    icon: "💪",
    name: "Bulking",
    desc: "+15% cal · build mass",
  },
  {
    id: "CUTTING",
    icon: "🔥",
    name: "Cutting",
    desc: "−20% cal · lose fat",
  },
  {
    id: "MAINTENANCE",
    icon: "⚖️",
    name: "Maintain",
    desc: "= TDEE · stay steady",
  },
];

export default function OnboardingProgram() {
  const [selected, setSelected] = useState("BULKING");

  return (
    <>
      <h2 className="font-display text-2xl font-black text-text mb-2">
        Your Program
      </h2>
      <p className="text-muted text-sm mb-8">
        Choose a fitness goal. This adjusts your daily calorie target.
      </p>

      <div className="flex flex-col gap-3 flex-1">
        {programs.map((prog) => (
          <button
            key={prog.id}
            onClick={() => setSelected(prog.id)}
            className={`flex flex-col items-center p-5 rounded-[14px] border-2 text-center transition-all ${
              selected === prog.id
                ? "border-accent bg-accent-light"
                : "border-border2 bg-surface2 hover:border-accent-mid hover:bg-accent-light"
            }`}
          >
            <span className="text-3xl mb-2">{prog.icon}</span>
            <span className="font-display font-extrabold text-sm">
              {prog.name}
            </span>
            <span className="text-xs text-muted mt-1">{prog.desc}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/onboarding/profile"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-surface2 text-text2 text-sm font-semibold hover:border-accent-mid transition-colors"
        >
          Back
        </Link>
        <Link
          href="/onboarding/activity"
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-accent text-white text-sm font-semibold shadow-[0_2px_8px_rgba(217,95,43,0.28)] hover:bg-[#C4501E] transition-colors"
        >
          Next
        </Link>
      </div>
    </>
  );
}
