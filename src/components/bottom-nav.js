"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Plus, UtensilsCrossed, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/progress", icon: Trophy, label: "Quests" },
  { href: "/scan", icon: Plus, label: "", isFab: true },
  { href: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto relative">
        <div className="bg-[#1A1A3E] rounded-t-3xl px-4 pt-3 pb-4 flex items-end justify-around">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;

            if (tab.isFab) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center -mt-8"
                >
                  <div className="w-14 h-14 rounded-full bg-[#2D9C7E] flex items-center justify-center shadow-[0_4px_20px_rgba(45,156,126,0.5)] border-4 border-[#1A1A3E]">
                    <Icon size={26} className="text-white" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center gap-1 py-1 min-w-[48px]"
              >
                <Icon
                  size={22}
                  className={isActive ? "text-[#A78BFA]" : "text-gray-400"}
                  fill={isActive ? "#A78BFA" : "none"}
                />
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-[#A78BFA]" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
