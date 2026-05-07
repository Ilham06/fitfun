"use client";

import Link from "next/link";
import { useState } from "react";
import { Weight, Ruler } from "lucide-react";

export default function OnboardingProfile() {
  const [form, setForm] = useState({
    name: "John Doe",
    age: "",
    gender: "male",
    weight: "",
    height: "",
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

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
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full bg-white border-[1.5px] border-border2 rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors shadow-sm"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-text2 mb-1.5 block">
              Age
            </label>
            <input
              type="number"
              placeholder="24"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              className="w-full bg-white border-[1.5px] border-border2 rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors shadow-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-text2 mb-1.5 block">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
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
            Current Weight (kg)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Weight size={16} className="text-muted2" />
            </span>
            <input
              type="number"
              placeholder="75"
              value={form.weight}
              onChange={(e) => update("weight", e.target.value)}
              className="w-full bg-white border-[1.5px] border-border2 rounded-xl pl-9 pr-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text2 mb-1.5 block">
            Height (cm)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Ruler size={16} className="text-muted2" />
            </span>
            <input
              type="number"
              placeholder="178"
              value={form.height}
              onChange={(e) => update("height", e.target.value)}
              className="w-full bg-white border-[1.5px] border-border2 rounded-xl pl-9 pr-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] focus:bg-white transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href="/login"
          className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border2 bg-white text-text2 text-sm font-semibold hover:border-[#2D9C7E]/30 transition-colors shadow-sm"
        >
          Back
        </Link>
        <Link
          href="/onboarding/program"
          className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#2D9C7E] text-white text-sm font-semibold shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
        >
          Next
        </Link>
      </div>
    </>
  );
}
