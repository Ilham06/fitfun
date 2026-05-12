"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Weight, Ruler, Calendar, Check } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function EditProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", age: "", gender: "male", weightKg: "", heightCm: "", targetWeightKg: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user && d.profile) {
          setForm({
            name: d.user.name || "",
            age: d.profile.age || "",
            gender: d.profile.gender?.toLowerCase() || "male",
            weightKg: d.profile.weightKg || "",
            heightCm: d.profile.heightCm || "",
            targetWeightKg: d.profile.targetWeightKg || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          weightKg: Number(form.weightKg),
          heightCm: Number(form.heightCm),
          targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        }),
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
          <h1 className="font-black text-2xl text-[#1E293B]">{t("edit_profile")}</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">{t("edit_profile_desc")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0] flex flex-col gap-4">
          <Field label={t("name")} icon={User}>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#F8F9FA] rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#2D9C7E]/30 border border-transparent focus:border-[#2D9C7E]/30"
            />
          </Field>

          <Field label={t("age")} icon={Calendar}>
            <input
              type="number"
              min="10"
              max="100"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              className="w-full bg-[#F8F9FA] rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#2D9C7E]/30 border border-transparent focus:border-[#2D9C7E]/30"
            />
          </Field>

          <Field label={t("gender")} icon={User}>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              className="w-full bg-[#F8F9FA] rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#2D9C7E]/30 border border-transparent focus:border-[#2D9C7E]/30"
            >
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
              <option value="other">{t("other_gender")}</option>
            </select>
          </Field>

          <div className="flex gap-3">
            <div className="flex-1">
              <Field label={`${t("weight")} (kg)`} icon={Weight}>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={form.weightKg}
                  onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
                  className="w-full bg-[#F8F9FA] rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#2D9C7E]/30 border border-transparent focus:border-[#2D9C7E]/30"
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label={`${t("height")} (cm)`} icon={Ruler}>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={form.heightCm}
                  onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))}
                  className="w-full bg-[#F8F9FA] rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#2D9C7E]/30 border border-transparent focus:border-[#2D9C7E]/30"
                />
              </Field>
            </div>
          </div>

          <Field label={`${t("target_weight")} (kg)`} icon={Weight}>
            <input
              type="number"
              step="0.1"
              min="30"
              max="300"
              value={form.targetWeightKg}
              onChange={(e) => setForm((f) => ({ ...f, targetWeightKg: e.target.value }))}
              className="w-full bg-[#F8F9FA] rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#2D9C7E]/30 border border-transparent focus:border-[#2D9C7E]/30"
            />
          </Field>
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        {success ? (
          <div className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#2D9C7E] text-white text-sm font-bold">
            <Check size={18} /> {t("profile_updated")}
          </div>
        ) : (
          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 flex items-center justify-center rounded-2xl bg-[#2D9C7E] text-white text-sm font-bold shadow-[0_4px_14px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors disabled:opacity-60"
          >
            {saving ? t("saving") : t("save_changes")}
          </button>
        )}
      </form>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-gray-400" />
        <span className="text-xs font-semibold text-gray-500">{label}</span>
      </div>
      {children}
    </div>
  );
}
