import Image from "next/image";
import { BarChart3, Zap, Leaf, Heart } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth-actions";

const features = [
  {
    icon: BarChart3,
    label: "Track",
    sub: "Your Progress",
    iconBg: "#E8F5EF",
    iconColor: "#2D9C7E",
  },
  {
    icon: Zap,
    label: "Stay Active",
    sub: "Every Day",
    iconBg: "#FEF8E7",
    iconColor: "#E8A020",
    iconFill: "#E8A020",
  },
  {
    icon: Leaf,
    label: "Nourish",
    sub: "Your Body",
    iconBg: "#F5EEF8",
    iconColor: "#8E44AD",
  },
  {
    icon: Heart,
    label: "Feel Great",
    sub: "Have Fun",
    iconBg: "#FDEDEC",
    iconColor: "#E74C3C",
    iconFill: "#E74C3C",
  },
];

export default function SplashPage() {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col overflow-hidden bg-gradient-to-b from-[#E8F5F1] via-[#F2FAF7] to-white relative">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#2D9C7E]/10 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-28 h-28 bg-[#2D9C7E]/06 rounded-full -translate-x-1/2 pointer-events-none" />

      {/* Logo + Brand */}
      <div className="flex flex-col items-center pt-20 px-6 z-10">
        <Image
          src="/fitfun-logo.png"
          alt="FitFun Logo"
          width={88}
          height={88}
          priority
        />
        <h1 className="mt-5 text-[42px] font-black tracking-tight leading-none">
          <span className="text-[#1A1814]">Fit</span>
          <span className="text-[#2D9C7E]">Fun</span>
        </h1>
        <p className="mt-2 text-[13px] text-[#8A8679] font-medium tracking-wide">
          AI-Powered Nutrition Tracking
        </p>
      </div>

      {/* Feature list */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-3">
        {features.map(({ icon: Icon, label, sub, iconBg, iconColor, iconFill }) => (
          <div
            key={label}
            className="bg-white rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.07)] flex items-center gap-4"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: iconBg }}
            >
              <Icon
                size={20}
                color={iconColor}
                fill={iconFill ?? "none"}
              />
            </div>
            <div className="leading-tight">
              <p className="text-[14px] font-bold text-[#1A1814]">{label}</p>
              <p className="text-[12px] text-[#8A8679]">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-12">
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex items-center justify-center gap-3 w-full bg-white border border-[#E0DDD8] text-[#1A1814] font-semibold text-base rounded-full py-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
