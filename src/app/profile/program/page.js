"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Equal, Armchair, Footprints, Bike, Flame, Check } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const PROGRAMS = [
  { id: "BULKING", icon: TrendingUp, nameKey: "Bulking", desc: "+15% cal · build mass", color: "text-[#388E3C]", bg: "bg-[#E8F5E9]" },
  { id: "CUTTING", icon: TrendingDown, nameKey: "Cutting", desc: "−20% cal · lose fat", color: "text-[#C0392B]", bg: "bg-[#FFEBEE]" },
  { id: "MAINTENANCE", icon: Equal, nameKey: "Maintain", desc: "= TDEE · stay steady", color: "text-[#2471A3]", bg: "bg-[#E3F2FD]" },
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", icon: Armchair, multiplier: "×1.2", descKey: "Little or no exercise" },
  { id: "lightly_active", icon: Footprints, multiplier: "×1.375", descKey: "Light exercise 1-3 days/week" },
  { id: "moderately_active", icon: Bike, multiplier: "×1.55", descKey: "Moderate exercise 3-5 days/week" },
  { id: "very_active", icon: Flame, multiplier: "×1.725", descKey: "Hard exercise 6-7 days/week" },
];

export default function ChangeProgramPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [program, setProgram] = useState("MAINTENANCE");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProgram(d.profile.program || "MAINTENANCE");
          setActivityLevel(d.profile.activityLevel || "sedentary");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program, activityLevel }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1200);
    } catch {
      setError(t("error_saving"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] flex items-center justify-center">
        <p className="text-gray-400 text-sm">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <div className="px-5 pt-12 pb-6">
        <Link
          href="/profile"
          className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#F0F0F0]"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </Link>
        <div className="mt-4">
          <h1 className="font-black text-2xl text-[#1E293B]">{t("change_program")}</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">{t("change_program_desc")}</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
          <h3 className="font-bold text-sm text-gray-800 mb-3">{t("program")}</h3>
          <div className="flex flex-col gap-2">
            {PROGRAMS.map((prog) => {
              const Icon = prog.icon;
              const selected = program === prog.id;
              return (
                <button
                  key={prog.id}
                  onClick={() => setProgram(prog.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    selected ? "border-[#2D9C7E] shadow-md" : "border-transparent bg-[#F8F9FA]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${prog.bg} flex items-center justify-center`}>
                    <Icon size={20} className={prog.color} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-sm text-gray-800 block">{prog.nameKey}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{prog.desc}</span>
                  </div>
                  {selected && (
                    <div className="w-6 h-6 rounded-full bg-[#2D9C7E] flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
          <h3 className="font-bold text-sm text-gray-800 mb-3">{t("activity")}</h3>
          <div className="flex flex-col gap-2">
            {ACTIVITY_LEVELS.map((level) => {
              const Icon = level.icon;
              const selected = activityLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setActivityLevel(level.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                    selected ? "border-[#2D9C7E] shadow-md" : "border-transparent bg-[#F8F9FA]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5F0] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#2D9C7E]" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-gray-800 block">{t(level.id)}</span>
                    <span className="text-xs text-gray-400">{level.descKey}</span>
                  </div>
                  <span className="text-xs font-bold text-[#2D9C7E]">{level.multiplier}</span>
                  {selected && (
                    <div className="w-5 h-5 rounded-full bg-[#2D9C7E] flex items-center justify-center shrink-0">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        {success ? (
          <div className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#2D9C7E] text-white text-sm font-bold">
            <Check size={18} /> {t("program_updated")}
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 flex items-center justify-center rounded-2xl bg-[#2D9C7E] text-white text-sm font-bold shadow-[0_4px_14px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors disabled:opacity-60"
          >
            {saving ? t("saving") : t("save_changes")}
          </button>
        )}
      </div>
    </div>
  );
}
