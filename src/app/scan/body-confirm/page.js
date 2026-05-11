"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Weight, Dumbbell, Percent, Calculator, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function BodyLogPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [weightKg, setWeightKg] = useState("");
  const [muscleMassKg, setMuscleMassKg] = useState("");
  const [bodyFatPct, setBodyFatPct] = useState("");
  const [source, setSource] = useState("MANUAL");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("bodyScanResult");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.weightKg) setWeightKg(String(data.weightKg));
        if (data.muscleMassKg) setMuscleMassKg(String(data.muscleMassKg));
        if (data.bodyFatPct) setBodyFatPct(String(data.bodyFatPct));
        setSource("GPT_VISION");
      } catch {}
      sessionStorage.removeItem("bodyScanResult");
    }
  }, []);

  const bmi = weightKg ? (parseFloat(weightKg) / Math.pow(1.78, 2)).toFixed(1) : null;

  const handleSave = async () => {
    if (!weightKg || parseFloat(weightKg) <= 0) {
      alert(t("weight_is_required"));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/body/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightKg: parseFloat(weightKg),
          muscleMassKg: muscleMassKg ? parseFloat(muscleMassKg) : null,
          bodyFatPct: bodyFatPct ? parseFloat(bodyFatPct) : null,
          source,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/progress");
      } else {
        alert(data.error || t("failed_to_save"));
        setSaving(false);
      }
    } catch {
      alert(t("network_error"));
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9F7]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link
          href="/scan"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-lg text-gray-800">{t("log_weight")}</h1>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-8">
        {source === "GPT_VISION" && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F0EBF5] text-[#7B5EA7]">
              {t("ai_detected")}
            </span>
          </div>
        )}

        {/* BMI Auto-calculated */}
        {bmi && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0] flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">{t("bmi_auto")}</span>
              <div className="font-black text-2xl text-[#2D9C7E] mt-0.5">{bmi}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
              <Calculator size={20} className="text-[#2D9C7E]" />
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
          <div className="flex flex-col gap-5">
            {/* Weight - Required */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5F0] flex items-center justify-center">
                  <Weight size={16} className="text-[#2D9C7E]" />
                </div>
                <label className="text-sm font-semibold text-gray-800">
                  {t("weight")} <span className="text-red-400">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 75.0"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">kg</span>
              </div>
            </div>

            {/* Muscle Mass - Optional */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] flex items-center justify-center">
                  <Dumbbell size={16} className="text-[#F57C00]" />
                </div>
                <label className="text-sm font-semibold text-gray-800">
                  {t("muscle_mass_label")} <span className="text-[10px] text-gray-400">({t("optional")})</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 32.5"
                  value={muscleMassKg}
                  onChange={(e) => setMuscleMassKg(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#F57C00] focus:bg-white transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">kg</span>
              </div>
            </div>

            {/* Body Fat % - Optional */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] flex items-center justify-center">
                  <Percent size={16} className="text-[#EC4899]" />
                </div>
                <label className="text-sm font-semibold text-gray-800">
                  {t("body_fat_label")} <span className="text-[10px] text-gray-400">({t("optional")})</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 18.5"
                  value={bodyFatPct}
                  onChange={(e) => setBodyFatPct(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#EC4899] focus:bg-white transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !weightKg}
          className="w-full h-13 flex items-center justify-center gap-2 rounded-2xl bg-[#2D9C7E] text-white font-bold text-sm shadow-[0_4px_14px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Check size={18} />
          )}
          {saving ? t("saving") : t("save_measurement")}
        </button>
      </div>
    </div>
  );
}
