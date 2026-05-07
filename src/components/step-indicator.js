"use client";

import { usePathname } from "next/navigation";

const steps = [
  { path: "/onboarding/profile", label: "Profile" },
  { path: "/onboarding/program", label: "Program" },
  { path: "/onboarding/activity", label: "Activity" },
  { path: "/onboarding/goal", label: "Goal" },
];

export default function StepIndicator() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.path));

  return (
    <div className="mb-8">
      <div className="flex items-center gap-1.5 mb-2">
        {steps.map((step, i) => (
          <div
            key={step.path}
            className={`h-[5px] rounded-full transition-all ${
              i < currentIndex
                ? "bg-[#2D9C7E] w-7"
                : i === currentIndex
                  ? "bg-[#2D9C7E] w-11"
                  : "bg-[#E0E0E0] w-7"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted">
        Step {currentIndex + 1} of {steps.length} — {steps[currentIndex]?.label}
      </p>
    </div>
  );
}
