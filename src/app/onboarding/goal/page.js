"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { useOnboarding } from "@/components/onboarding-provider";
import { completeOnboarding } from "@/lib/auth-actions";
import { calculateTDEE, calculateTargets } from "@/lib/tdee";
import { useState } from "react";

const PROGRAM_LABELS = {
  BULKING: "Bulking (+15%)",
  CUTTING: "Cutting (−20%)",
  MAINTENANCE: "Maintenance (=)",
};

export default function OnboardingGoal() {
  const { data, update } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const weightKg = parseFloat(data.weight) || 70;
  const heightCm = parseFloat(data.height) || 170;
  const age = parseInt(data.age, 10) || 25;

  const tdee = calculateTDEE({
    age,
    gender: data.gender,
    weightKg,
    heightCm,
    activityLevel: data.activityLevel,
  });

  const { dailyCalTarget, proteinTargetG, carbTargetG, fatTargetG } = calculateTargets({
    tdee,
    program: data.program,
    weightKg,
  });

  async function handleSubmit() {
    setLoading(true);
    await completeOnboarding(data);
  }

  return (
    <>
      <h2 className="font-display text-2xl font-black text-text mb-2">
        Goal & Review
      </h2>
      <p className="text-muted text-sm mb-8">
        Set an optional target weight and review your calculated targets.
      </p>

      <div className="flex flex-col gap-6 flex-1">
        <div>
          <label className="text-xs font-semibold text-text2 mb-1.5 block">
            Target Weight (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Target size={16} className="text-muted2" />
            </span>
            <input
              type="number"
              placeholder="70"
              value={data.targetWeight}
              onChange={(e) => update({ targetWeight: e.target.value })}
              className="w-full bg-white border-[1.5px] border-border2 rounded-xl pl-9 pr-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Your Daily Targets</h3>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <span className="text-xs text-muted">Base TDEE</span>
            <span className="font-bold text-lg text-text">{tdee} kcal</span>
          </div>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs text-muted block">Daily Target</span>
              <span className="text-[10px] text-[#2D9C7E] font-semibold">
                {PROGRAM_LABELS[data.program]}
              </span>
            </div>
            <span className="font-bold text-2xl text-[#2D9C7E]">
              {dailyCalTarget}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F8F8F8] rounded-xl">
              <div className="text-xs text-muted mb-1">Protein</div>
              <div className="font-bold text-protein text-lg">{proteinTargetG}g</div>
              <div className="text-[10px] text-muted2">30%</div>
            </div>
            <div className="text-center p-3 bg-[#F8F8F8] rounded-xl">
              <div className="text-xs text-muted mb-1">Carbs</div>
              <div className="font-bold text-carb text-lg">{carbTargetG}g</div>
              <div className="text-[10px] text-muted2">45%</div>
            </div>
            <div className="text-center p-3 bg-[#F8F8F8] rounded-xl">
              <div className="text-xs text-muted mb-1">Fat</div>
              <div className="font-bold text-fat text-lg">{fatTargetG}g</div>
              <div className="text-[10px] text-muted2">25%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href="/onboarding/activity"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-white text-text2 text-sm font-semibold hover:border-[#2D9C7E]/30 transition-colors shadow-sm"
        >
          Back
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#2D9C7E] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors cursor-pointer disabled:opacity-60"
        >
          {loading ? "Saving..." : "Start FitScan"}
        </button>
      </div>
    </>
  );
}
