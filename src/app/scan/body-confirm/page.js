"use client";

import Link from "next/link";
import { useState } from "react";

const initialFields = [
  { key: "weightKg", label: "Weight", unit: "kg", value: "74.8", prev: "75.2", icon: "⚖️" },
  { key: "waistCm", label: "Waist", unit: "cm", value: "82", prev: "83.5", icon: "📏" },
  { key: "chestCm", label: "Chest", unit: "cm", value: "98", prev: "97", icon: "📐" },
  { key: "hipsCm", label: "Hips", unit: "cm", value: "", prev: "96", icon: "📐" },
  { key: "armsCm", label: "Arms", unit: "cm", value: "34.5", prev: "34", icon: "💪" },
  { key: "thighsCm", label: "Thighs", unit: "cm", value: "", prev: "56", icon: "🦵" },
  { key: "neckCm", label: "Neck", unit: "cm", value: "38", prev: "38.2", icon: "📏" },
  { key: "bodyFatPct", label: "Body Fat", unit: "%", value: "", prev: "18.2", icon: "📊" },
];

export default function BodyConfirmPage() {
  const [fields, setFields] = useState(initialFields);

  const updateField = (index, value) => {
    setFields((f) => f.map((item, i) => (i === index ? { ...item, value } : item)));
  };

  const weightField = fields.find((f) => f.key === "weightKg");
  const heightCm = 178;
  const bmi = weightField?.value
    ? (parseFloat(weightField.value) / (heightCm / 100) ** 2).toFixed(1)
    : "—";

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
          Body Measurements
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-8">
        {/* Source badge */}
        <div className="flex gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[rgba(123,94,167,0.1)] text-body">
            📷 GPT-4o Vision
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-accent-dim text-accent">
            Review & edit values
          </span>
        </div>

        {/* BMI Card */}
        <div className="bg-surface border border-border rounded-[14px] p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted">BMI (auto-calculated)</span>
            <div className="font-display text-2xl font-black text-accent">
              {bmi}
            </div>
          </div>
          <div className="text-xs text-muted text-right">
            Height: {heightCm}cm
            <br />
            Weight: {weightField?.value || "—"}kg
          </div>
        </div>

        {/* Measurement Fields */}
        <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            {fields.map((field, i) => {
              const delta = field.value && field.prev
                ? (parseFloat(field.value) - parseFloat(field.prev)).toFixed(1)
                : null;
              const isNeg = delta && parseFloat(delta) < 0;
              const isPos = delta && parseFloat(delta) > 0;

              return (
                <div key={field.key} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{field.icon}</span>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-muted block mb-1">
                      {field.label} ({field.unit})
                    </label>
                    <input
                      type="number"
                      placeholder="—"
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="w-full bg-bg2 border border-border2 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent focus:bg-surface transition-colors"
                    />
                  </div>
                  {/* Delta indicator */}
                  <div className="w-14 text-right">
                    {delta ? (
                      <span
                        className={`text-[11px] font-semibold ${
                          isNeg ? "text-fiber" : isPos ? "text-protein" : "text-muted"
                        }`}
                      >
                        {isPos ? "+" : ""}
                        {delta}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted2">prev: {field.prev}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <Link
          href="/progress"
          className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-accent text-white font-semibold text-sm shadow-[0_2px_8px_rgba(217,95,43,0.28)] hover:bg-[#C4501E] transition-colors"
        >
          ✓ Save Measurements
        </Link>
      </div>
    </div>
  );
}
