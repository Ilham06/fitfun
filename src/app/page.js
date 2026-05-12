import Image from "next/image";
import Link from "next/link";
import { BarChart3, Zap, Leaf, Heart } from "lucide-react";

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
          className="rounded-[22px] shadow-md"
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
        <Link
          href="/login"
          className="flex items-center justify-center gap-3 w-full bg-white border border-[#E0DDD8] text-[#1A1814] font-semibold text-base rounded-full py-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
            <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.2-17.7 10.7z" fill="#FF3D00"/>
            <path d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.5C29.6 36 26.9 37 24 37c-6 0-10.6-3.1-11.8-8.5l-7 5.4C8 40.5 15.4 45 24 45z" fill="#4CAF50"/>
            <path d="M44.5 20H24v8.5h11.8c-.6 2.9-2.4 5.3-4.9 6.9l6.6 5.5C41.5 37.4 45 31.2 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </Link>
      </div>
    </div>
  );
}
