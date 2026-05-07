import StepIndicator from "@/components/step-indicator";

export const metadata = {
  title: "Onboarding | FitScan",
};

export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <div className="w-full max-w-md mx-auto px-6 pt-12 pb-8 flex-1 flex flex-col">
        <StepIndicator />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
