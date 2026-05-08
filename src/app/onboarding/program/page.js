"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Equal } from "lucide-react";
import { useOnboarding } from "@/components/onboarding-provider";

const programs = [
  {
    id: "BULKING",
    icon: TrendingUp,
    name: "Bulking",
    desc: "+15% cal · build mass",
    color: "text-[#388E3C]",
    bg: "bg-[#E8F5E9]",
  },
  {
    id: "CUTTING",
    icon: TrendingDown,
    name: "Cutting",
    desc: "−20% cal · lose fat",
    color: "text-[#C0392B]",
    bg: "bg-[#FFEBEE]",
  },
  {
    id: "MAINTENANCE",
    icon: Equal,
    name: "Maintain",
    desc: "= TDEE · stay steady",
    color: "text-[#2471A3]",
    bg: "bg-[#E3F2FD]",
  },
];

export default function OnboardingProgram() {
  const { data, update } = useOnboarding();

  return (
    <>
      <h2 className="font-display text-2xl font-black text-text mb-2">
        Your Program
      </h2>
      <p className="text-muted text-sm mb-8">
        Choose a fitness goal. This adjusts your daily calorie target.
      </p>

      <div className="flex flex-col gap-3 flex-1">
        {programs.map((prog) => {
          const Icon = prog.icon;
          return (
            <button
              key={prog.id}
              onClick={() => update({ program: prog.id })}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all bg-white ${
                data.program === prog.id
                  ? "border-[#2D9C7E] shadow-md"
                  : "border-transparent shadow-sm hover:border-[#2D9C7E]/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${prog.bg} flex items-center justify-center`}>
                <Icon size={24} className={prog.color} />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm text-text block">
                  {prog.name}
                </span>
                <span className="text-xs text-muted mt-0.5">{prog.desc}</span>
              </div>
              {data.program === prog.id && (
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
          href="/onboarding/profile"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-white text-text2 text-sm font-semibold hover:border-[#2D9C7E]/30 transition-colors shadow-sm"
        >
          Back
        </Link>
        <Link
          href="/onboarding/activity"
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#2D9C7E] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
        >
          Next
        </Link>
      </div>
    </>
  );
}
