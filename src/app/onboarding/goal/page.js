"use client";

import Link from "next/link";
import { useState } from "react";

export default function OnboardingGoal() {
  const [targetWeight, setTargetWeight] = useState("");

  // Static preview values (will be dynamic later)
  const tdee = 2420;
  const dailyCal = 2783; // BULKING +15%
  const protein = 209; // 30% of cals / 4
  const carbs = 313; // 45% of cals / 4
  const fat = 77; // 25% of cals / 9

  return (
    <>
      <h2 className="font-display text-2xl font-black text-text mb-2">
        Goal & Review
      </h2>
      <p className="text-muted text-sm mb-8">
        Set an optional target weight and review your calculated targets.
      </p>

      <div className="flex flex-col gap-6 flex-1">
        {/* Target Weight (optional) */}
        <div>
          <label className="text-xs font-semibold text-text2 mb-1.5 block">
            Target Weight (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted2">
              🎯
            </span>
            <input
              type="number"
              placeholder="70"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full bg-bg2 border-[1.5px] border-border2 rounded-[9px] pl-9 pr-3 py-2.5 text-sm text-text outline-none focus:border-accent focus:bg-surface transition-colors"
            />
          </div>
        </div>

        {/* Calculated Targets Preview */}
        <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
          <h3 className="font-display font-extrabold text-sm mb-4">
            Your Daily Targets
          </h3>

          {/* TDEE */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <span className="text-xs text-muted">Base TDEE</span>
            <span className="font-display font-black text-lg text-text">
              {tdee} kcal
            </span>
          </div>

          {/* Daily Calories */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs text-muted block">Daily Target</span>
              <span className="text-[10px] text-accent font-semibold">
                Bulking (+15%)
              </span>
            </div>
            <span className="font-display font-black text-2xl text-accent">
              {dailyCal}
            </span>
          </div>

          {/* Macro Split */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-surface2 rounded-lg">
              <div className="text-xs text-muted mb-1">Protein</div>
              <div className="font-display font-black text-protein text-lg">
                {protein}g
              </div>
              <div className="text-[10px] text-muted2">30%</div>
            </div>
            <div className="text-center p-3 bg-surface2 rounded-lg">
              <div className="text-xs text-muted mb-1">Carbs</div>
              <div className="font-display font-black text-carb text-lg">
                {carbs}g
              </div>
              <div className="text-[10px] text-muted2">45%</div>
            </div>
            <div className="text-center p-3 bg-surface2 rounded-lg">
              <div className="text-xs text-muted mb-1">Fat</div>
              <div className="font-display font-black text-fat text-lg">
                {fat}g
              </div>
              <div className="text-[10px] text-muted2">25%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/onboarding/activity"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-surface2 text-text2 text-sm font-semibold hover:border-accent-mid transition-colors"
        >
          Back
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-accent text-white text-sm font-semibold shadow-[0_2px_8px_rgba(217,95,43,0.28)] hover:bg-[#C4501E] transition-colors"
        >
          Start FitScan →
        </Link>
      </div>
    </>
  );
}
