"use client";

import Link from "next/link";
import { useState } from "react";

export default function FoodResultPage() {
  const [portion, setPortion] = useState(1);
  const [mealType, setMealType] = useState("LUNCH");

  const base = { name: "Grilled Chicken Breast", portionG: 150, kcal: 246, protein: 46, carbs: 0, fat: 5.4, fiber: 0, confidence: 92 };
  const scaled = {
    kcal: Math.round(base.kcal * portion),
    protein: Math.round(base.protein * portion),
    carbs: Math.round(base.carbs * portion),
    fat: Math.round(base.fat * portion * 10) / 10,
  };

  const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <Link
          href="/scan"
          className="w-9 h-9 rounded-lg bg-surface border border-border2 flex items-center justify-center text-sm"
        >
          ←
        </Link>
        <h1 className="font-display text-lg font-black text-text">
          Scan Result
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-8">
        {/* Confidence badge */}
        <div className="flex gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[rgba(45,156,126,0.1)] text-food">
            📷 GPT-4o Vision
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-accent-dim text-accent">
            {base.confidence}% confident
          </span>
        </div>

        {/* Nutrition Card */}
        <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-base text-text">{base.name}</h2>
              <p className="text-xs text-muted mt-0.5">
                1 portion · ~{Math.round(base.portionG * portion)}g
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-black text-accent leading-none">
                {scaled.kcal}
              </div>
              <div className="text-[10px] text-muted">kcal</div>
            </div>
          </div>

          {/* Macro bars */}
          <div className="flex flex-col gap-2.5">
            <MacroBar label="Protein" value={scaled.protein} max={160} color="bg-protein" />
            <MacroBar label="Carbs" value={scaled.carbs} max={300} color="bg-carb" />
            <MacroBar label="Fat" value={scaled.fat} max={80} color="bg-fat" />
          </div>
        </div>

        {/* Portion Slider */}
        <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text2">Portion</span>
            <span className="font-display font-black text-accent">
              {portion}×
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.25"
            value={portion}
            onChange={(e) => setPortion(parseFloat(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted2 mt-1">
            <span>0.5×</span>
            <span>1×</span>
            <span>2×</span>
            <span>3×</span>
          </div>
        </div>

        {/* Meal Type Picker */}
        <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
          <span className="text-xs font-semibold text-text2 mb-3 block">
            Meal Type
          </span>
          <div className="flex gap-2">
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                  mealType === type
                    ? "bg-accent text-white"
                    : "bg-bg2 text-muted hover:text-text"
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Link
          href="/dashboard"
          className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-accent text-white font-semibold text-sm shadow-[0_2px_8px_rgba(217,95,43,0.28)] hover:bg-[#C4501E] transition-colors"
        >
          ✓ Log Meal
        </Link>
      </div>
    </div>
  );
}

function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-12 text-[11px] text-muted">{label}</span>
      <div className="flex-1 h-[5px] bg-bg2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-[11px] text-text2 font-medium">
        {value}g
      </span>
    </div>
  );
}
