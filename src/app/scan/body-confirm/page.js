"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Weight, Ruler, Activity, Check, Camera } from "lucide-react";

const initialFields = [
  { key: "weightKg", label: "Weight", unit: "kg", value: "74.8", prev: "75.2", icon: Weight },
  { key: "waistCm", label: "Waist", unit: "cm", value: "82", prev: "83.5", icon: Ruler },
  { key: "chestCm", label: "Chest", unit: "cm", value: "98", prev: "97", icon: Ruler },
  { key: "hipsCm", label: "Hips", unit: "cm", value: "", prev: "96", icon: Ruler },
  { key: "armsCm", label: "Arms", unit: "cm", value: "34.5", prev: "34", icon: Activity },
  { key: "thighsCm", label: "Thighs", unit: "cm", value: "", prev: "56", icon: Activity },
  { key: "neckCm", label: "Neck", unit: "cm", value: "38", prev: "38.2", icon: Ruler },
  { key: "bodyFatPct", label: "Body Fat", unit: "%", value: "", prev: "18.2", icon: Activity },
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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link
          href="/scan"
          className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={18} className="text-text" />
        </Link>
        <h1 className="font-bold text-lg text-text">
          Body Measurements
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-8">
        {/* Source badge */}
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(123,94,167,0.1)] text-[#7B5EA7]">
            <Camera size={12} /> GPT-4o Vision
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(123,94,167,0.06)] text-[#7B5EA7]">
            Review & edit values
          </span>
        </div>

        {/* BMI Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted">BMI (auto-calculated)</span>
            <div className="font-bold text-2xl text-[#2D9C7E] mt-0.5">
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
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            {fields.map((field, i) => {
              const delta = field.value && field.prev
                ? (parseFloat(field.value) - parseFloat(field.prev)).toFixed(1)
                : null;
              const isNeg = delta && parseFloat(delta) < 0;
              const isPos = delta && parseFloat(delta) > 0;
              const Icon = field.icon;

              return (
                <div key={field.key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0EBF5] flex items-center justify-center">
                    <Icon size={16} className="text-[#7B5EA7]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-muted block mb-1">
                      {field.label} ({field.unit})
                    </label>
                    <input
                      type="number"
                      placeholder="—"
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-border2 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#7B5EA7] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="w-14 text-right">
                    {delta ? (
                      <span
                        className={`text-[11px] font-semibold ${
                          isNeg ? "text-[#2D9C7E]" : isPos ? "text-[#C0392B]" : "text-muted"
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
          className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-[#2D9C7E] text-white font-semibold text-sm shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
        >
          <Check size={18} /> Save Measurements
        </Link>
      </div>
    </div>
  );
}
