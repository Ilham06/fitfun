import StepIndicator from "@/components/step-indicator";

export const metadata = {
  title: "Onboarding | FitScan",
};

export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="w-full max-w-md mx-auto px-6 py-10 flex-1 flex flex-col">
        <StepIndicator />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
