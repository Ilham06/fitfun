"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/progress", icon: "📊", label: "Progress" },
  { href: "/scan", icon: "📷", label: "Scan", isFab: true },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-surface border border-border2 rounded-[18px] px-2 py-1.5 shadow-md">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);

          if (tab.isFab) {
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center px-2">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl -mt-3 shadow-[0_4px_14px_rgba(217,95,43,0.35)]">
                  {tab.icon}
                </div>
                <span className="text-[8.5px] font-bold text-accent uppercase tracking-wide mt-0.5">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl min-w-[58px] transition-colors ${
                isActive
                  ? "bg-accent-light text-accent"
                  : "text-muted hover:text-text"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[9.5px] font-bold uppercase tracking-wide">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
