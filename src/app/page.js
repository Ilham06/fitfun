import Link from "next/link";
import { ScanLine } from "lucide-react";

export default function SplashPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#2D9C7E] flex items-center justify-center shadow-lg">
          <ScanLine size={32} className="text-white" />
        </div>
        <h1 className="font-display text-4xl font-black text-text tracking-tight">
          FitScan
        </h1>
        <p className="text-muted text-sm font-medium">
          AI-Powered Nutrition Tracking
        </p>
      </div>
      <div className="mt-12">
        <Link
          href="/login"
          className="text-xs text-muted2 hover:text-[#2D9C7E] transition-colors"
        >
          Tap to continue
        </Link>
      </div>
    </div>
  );
}
