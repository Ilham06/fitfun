"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Plus, UtensilsCrossed, User } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const tabs = [
    { href: "/dashboard", icon: Home, label: t("nav_home") },
    { href: "/progress", icon: Trophy, label: t("nav_quests") },
    { href: "/scan", icon: Plus, label: "", isFab: true },
    { href: "/meals", icon: UtensilsCrossed, label: t("nav_meals") },
    { href: "/profile", icon: User, label: t("nav_profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="max-w-md mx-auto px-3 pb-2">
        <div className="bg-white rounded-[28px] shadow-[0_-2px_24px_rgba(0,0,0,0.10)] px-2 pt-3 pb-3 flex items-end justify-around relative">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;

            if (tab.isFab) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center -mt-10 mb-1"
                >
                  <div className="w-14 h-14 rounded-full bg-[#2D9C7E] flex items-center justify-center shadow-[0_4px_18px_rgba(45,156,126,0.45)]">
                    <Icon size={26} className="text-white" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center gap-1 py-1 min-w-[52px]"
              >
                <Icon
                  size={22}
                  className={isActive ? "text-[#2D9C7E]" : "text-[#B5B0A6]"}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-[#2D9C7E]" : "text-[#B5B0A6]"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span className="block w-5 h-[3px] rounded-full bg-[#2D9C7E]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
