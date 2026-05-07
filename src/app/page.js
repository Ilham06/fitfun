import Link from "next/link";

export default function SplashPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <h1 className="font-display text-5xl font-black text-accent tracking-tight">
          FitScan
        </h1>
        <p className="text-muted text-sm font-medium">
          AI-Powered Nutrition Tracking
        </p>
      </div>
      <div className="mt-12">
        <Link
          href="/login"
          className="text-xs text-muted2 underline hover:text-accent transition-colors"
        >
          Continue →
        </Link>
      </div>
    </div>
  );
}
