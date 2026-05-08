import BottomNav from "@/components/bottom-nav";
import { Target, Zap, Weight, Ruler, Pencil, Bell, Download, LogOut, ChevronRight, Flame, Droplets, Award } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Profile | FitScan" };

const ACTIVITY_LABELS = {
  sedentary: "Sedentary",
  lightly_active: "Light Active",
  moderately_active: "Moderate",
  very_active: "Very Active",
};

async function getProfileData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  return user;
}

function ProfileHeader({ user, profile }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#3B0764] rounded-3xl p-5 shadow-lg">
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="50" cy="30" r="4" fill="#A78BFA" />
          <circle cx="100" cy="60" r="3" fill="#C4B5FD" />
          <circle cx="150" cy="20" r="2" fill="#DDD6FE" />
          <circle cx="250" cy="40" r="3" fill="#A78BFA" />
          <circle cx="300" cy="80" r="4" fill="#C4B5FD" />
          <circle cx="350" cy="25" r="2" fill="#DDD6FE" />
          <circle cx="80" cy="120" r="3" fill="#A78BFA" />
          <circle cx="320" cy="140" r="2" fill="#C4B5FD" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] flex items-center justify-center text-3xl border-3 border-white/30 shadow-lg">
              🏋️
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#2D9C7E] text-[8px] font-bold text-white shadow-sm">
              Lv. 12
            </span>
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-lg text-white">{user.name || "FitWarrior"}</h2>
            <p className="text-[11px] text-white/50">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FFA726] to-[#FFD54F] rounded-full" style={{ width: "62%" }} />
              </div>
              <span className="text-[9px] text-white/50">3,106 / 5,000 XP</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA726] to-[#FF8F00] flex items-center justify-center shadow-md">
              <Award size={18} className="text-white" />
            </div>
            <span className="text-[9px] text-[#FFA726] font-bold">Gold</span>
            <span className="text-[8px] text-white/40">Rank</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCards({ profile }) {
  const stats = [
    { icon: Target, label: "Program", value: profile.program.charAt(0) + profile.program.slice(1).toLowerCase(), color: "text-[#2D9C7E]", bg: "bg-[#E8F5F0]" },
    { icon: Zap, label: "Activity", value: ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel, color: "text-[#F59E0B]", bg: "bg-[#FFF8E1]" },
    { icon: Weight, label: "Weight", value: `${profile.weightKg} kg`, color: "text-[#7C3AED]", bg: "bg-[#F3E8FF]" },
    { icon: Ruler, label: "Height", value: `${profile.heightCm} cm`, color: "text-[#EC4899]", bg: "bg-[#FCE7F3]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <Icon size={18} className={s.color} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-medium">{s.label}</div>
              <div className="font-bold text-sm text-gray-800">{s.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MacroTargets({ profile }) {
  const totalCal = profile.dailyCalTarget;
  const proteinPct = totalCal > 0 ? Math.round((profile.proteinTargetG * 4 / totalCal) * 100) : 0;
  const carbPct = totalCal > 0 ? Math.round((profile.carbTargetG * 4 / totalCal) * 100) : 0;
  const fatPct = totalCal > 0 ? Math.round((profile.fatTargetG * 9 / totalCal) * 100) : 0;

  const macros = [
    { label: "Protein", value: `${profile.proteinTargetG}g`, pct: `${proteinPct}%`, color: "text-[#EF5350]", bg: "bg-[#FFEBEE]" },
    { label: "Carbs", value: `${profile.carbTargetG}g`, pct: `${carbPct}%`, color: "text-[#42A5F5]", bg: "bg-[#E3F2FD]" },
    { label: "Fat", value: `${profile.fatTargetG}g`, pct: `${fatPct}%`, color: "text-[#FFA726]", bg: "bg-[#FFF3E0]" },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <h3 className="font-bold text-sm text-gray-800 mb-4">Daily Targets</h3>
      <div className="grid grid-cols-3 gap-3">
        {macros.map((m) => (
          <div key={m.label} className={`text-center p-3 ${m.bg} rounded-2xl`}>
            <div className="text-[10px] text-gray-500 mb-1">{m.label}</div>
            <div className={`font-black text-xl ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{m.pct}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsList() {
  const items = [
    { icon: Pencil, label: "Edit Profile", desc: "Name, age, weight, height" },
    { icon: Target, label: "Change Program", desc: "Bulking, Cutting, Maintenance" },
    { icon: Bell, label: "Notifications", desc: "Reminders & alerts" },
    { icon: Download, label: "Export Data", desc: "Download as CSV" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#F0F0F0]">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8F9FA] transition-colors ${
              i < items.length - 1 ? "border-b border-[#F0F0F0]" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center">
              <Icon size={16} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">{item.label}</div>
              <div className="text-[11px] text-gray-400">{item.desc}</div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        );
      })}
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user?.id ? await getProfileData(session.user.id) : null;

  if (!user?.profile) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1.5 shadow-sm">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-gray-700">12</span>
            </div>
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1.5 shadow-sm">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-gray-700">230</span>
            </div>
          </div>
        </div>
        <h1 className="font-black text-2xl text-gray-800">Profile</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <ProfileHeader user={user} profile={user.profile} />
        <StatsCards profile={user.profile} />
        <MacroTargets profile={user.profile} />
        <SettingsList />

        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
