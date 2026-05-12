"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Weight, Ruler } from "lucide-react";
import { useOnboarding } from "@/components/onboarding-provider";
import { useState } from "react";

export default function OnboardingProfile() {
  const { data, update } = useOnboarding();
  const router = useRouter();
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!data.name?.trim()) e.name = "Name is required";
    if (!data.age || parseInt(data.age) < 10 || parseInt(data.age) > 120)
      e.age = "Enter a valid age";
    if (!data.weight || parseFloat(data.weight) <= 0)
      e.weight = "Enter a valid weight";
    if (!data.height || parseFloat(data.height) <= 0)
      e.height = "Enter a valid height";
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    router.push("/onboarding/program");
  }

  const fieldClass = (key) =>
    `w-full bg-white border-[1.5px] rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:bg-white transition-colors shadow-sm ${
      errors[key]
        ? "border-red-400 focus:border-red-400"
        : "border-border2 focus:border-[#2D9C7E]"
    }`;

  const fieldClassIcon = (key) =>
    `w-full bg-white border-[1.5px] rounded-xl pl-9 pr-3 py-2.5 text-sm text-text outline-none focus:bg-white transition-colors shadow-sm ${
      errors[key]
        ? "border-red-400 focus:border-red-400"
        : "border-border2 focus:border-[#2D9C7E]"
    }`;

  return (
    <>
      <h2 className="font-display text-2xl font-black text-text mb-2">
        Your Profile
      </h2>
      <p className="text-muted text-sm mb-8">
        Tell us about yourself so we can calculate your daily targets.
      </p>

      <div className="flex flex-col gap-5 flex-1">
        <div>
          <label className="text-xs font-semibold text-text2 mb-1.5 block">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={data.name}
            onChange={(e) => { update({ name: e.target.value }); setErrors((p) => ({ ...p, name: undefined })); }}
            className={fieldClass("name")}
          />
          {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-text2 mb-1.5 block">
              Age <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              placeholder="24"
              value={data.age}
              onChange={(e) => { update({ age: e.target.value }); setErrors((p) => ({ ...p, age: undefined })); }}
              className={fieldClass("age")}
            />
            {errors.age && <p className="text-red-400 text-[11px] mt-1">{errors.age}</p>}
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-text2 mb-1.5 block">
              Gender <span className="text-red-400">*</span>
            </label>
            <select
              value={data.gender}
              onChange={(e) => update({ gender: e.target.value })}
              className="w-full bg-white border-[1.5px] border-border2 rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors shadow-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text2 mb-1.5 block">
            Current Weight (kg) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Weight size={16} className="text-muted2" />
            </span>
            <input
              type="number"
              placeholder="75"
              value={data.weight}
              onChange={(e) => { update({ weight: e.target.value }); setErrors((p) => ({ ...p, weight: undefined })); }}
              className={fieldClassIcon("weight")}
            />
          </div>
          {errors.weight && <p className="text-red-400 text-[11px] mt-1">{errors.weight}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-text2 mb-1.5 block">
            Height (cm) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Ruler size={16} className="text-muted2" />
            </span>
            <input
              type="number"
              placeholder="178"
              value={data.height}
              onChange={(e) => { update({ height: e.target.value }); setErrors((p) => ({ ...p, height: undefined })); }}
              className={fieldClassIcon("height")}
            />
          </div>
          {errors.height && <p className="text-red-400 text-[11px] mt-1">{errors.height}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href="/login"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-white text-text2 text-sm font-semibold hover:border-[#2D9C7E]/30 transition-colors shadow-sm"
        >
          Back
        </Link>
        <button
          onClick={handleNext}
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#2D9C7E] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </>
  );
}
