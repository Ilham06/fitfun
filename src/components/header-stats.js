import { prisma } from "@/lib/prisma";
import { Flame, Zap, Bell } from "lucide-react";

async function getStats(userId) {
  const [profile, logs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId }, select: { xp: true } }),
    prisma.foodLog.findMany({
      where: { userId },
      select: { loggedAt: true },
      orderBy: { loggedAt: "desc" },
    }),
  ]);

  const uniqueDays = new Set(logs.map((l) => l.loggedAt.toISOString().split("T")[0]));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (uniqueDays.has(d.toISOString().split("T")[0])) {
      streak++;
    } else {
      if (i === 0) continue; // today might not have a log yet
      break;
    }
  }

  const xp = profile?.xp ?? 0;
  const xpLabel = xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : String(xp);

  return { streak, xpLabel };
}

// dark=true  → pills on dark/purple bg (meals, profile)
// dark=false → pills on light bg (dashboard, progress)
export default async function HeaderStats({ userId, dark = false }) {
  const { streak, xpLabel } = await getStats(userId);

  const pill = dark
    ? "bg-white/15 backdrop-blur-sm"
    : "bg-white/90 backdrop-blur-sm shadow-sm";
  const labelColor = dark ? "text-white" : "text-gray-700";
  const bellColor  = dark ? "text-white"  : "text-gray-600";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 ${pill} rounded-full px-2.5 py-1.5`}>
        <Flame size={14} className="text-orange-400" />
        <span className={`text-xs font-bold ${labelColor}`}>{streak}</span>
      </div>
      <div className={`flex items-center gap-1 ${pill} rounded-full px-2.5 py-1.5`}>
        <Zap size={14} className="text-yellow-400" />
        <span className={`text-xs font-bold ${labelColor}`}>{xpLabel} XP</span>
      </div>
      <div className={`w-8 h-8 ${pill} rounded-full flex items-center justify-center`}>
        <Bell size={14} className={bellColor} />
      </div>
    </div>
  );
}
