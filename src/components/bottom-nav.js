"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/progress", icon: "📊", label: "Progress" },
  { href: "/scan", icon: "📷", label: "Scan", isFab: true },
  { href: "/meals", icon: "🍽️", label: "Meals" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");

          if (tab.isFab) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-14 h-14 rounded-full bg-[#2D9C7E] flex items-center justify-center text-xl shadow-[0_4px_14px_rgba(45,156,126,0.4)]">
                  <span className="text-white text-2xl">📷</span>
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 ${
                    isActive ? "text-[#2D9C7E]" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-1"
            >
              <span className="text-xl">{tab.icon}</span>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-[#2D9C7E]" : "text-muted"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
