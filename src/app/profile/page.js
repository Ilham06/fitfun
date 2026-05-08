import BottomNav from "@/components/bottom-nav";
import { User, Target, Zap, Weight, Ruler, Pencil, Bell, Download, LogOut, ChevronRight } from "lucide-react";
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
    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#E8F5F0] flex items-center justify-center">
        <User size={28} className="text-[#2D9C7E]" />
      </div>
      <div className="flex-1">
        <h2 className="font-bold text-base">{user.name || "User"}</h2>
        <p className="text-xs text-muted">{user.email}</p>
      </div>
      <div className="text-right">
        <div className="font-bold text-[#2D9C7E] text-lg">{profile.dailyCalTarget.toLocaleString()}</div>
        <div className="text-[10px] text-muted">daily kcal</div>
      </div>
    </div>
  );
}

function StatsCards({ profile }) {
  const stats = [
    { icon: Target, label: "Program", value: profile.program.charAt(0) + profile.program.slice(1).toLowerCase() },
    { icon: Zap, label: "Activity", value: ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel },
    { icon: Weight, label: "Weight", value: `${profile.weightKg} kg` },
    { icon: Ruler, label: "Height", value: `${profile.heightCm} cm` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
              <Icon size={18} className="text-[#2D9C7E]" />
            </div>
            <div>
              <div className="text-[10px] text-muted">{s.label}</div>
              <div className="font-semibold text-sm text-text">{s.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MacroTargets({ profile }) {
  const macros = [
    { label: "Protein", value: `${profile.proteinTargetG}g`, pct: "30%", color: "text-protein" },
    { label: "Carbs", value: `${profile.carbTargetG}g`, pct: "45%", color: "text-carb" },
    { label: "Fat", value: `${profile.fatTargetG}g`, pct: "25%", color: "text-fat" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm mb-4">Daily Targets</h3>
      <div className="grid grid-cols-3 gap-3">
        {macros.map((m) => (
          <div key={m.label} className="text-center p-3 bg-[#F8F8F8] rounded-xl">
            <div className="text-[10px] text-muted mb-1">{m.label}</div>
            <div className={`font-bold text-lg ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-muted2">{m.pct}</div>
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
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8F8F8] transition-colors ${
              i < items.length - 1 ? "border-b border-[#F0F0F0]" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
              <Icon size={18} className="text-muted" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-text">{item.label}</div>
              <div className="text-[11px] text-muted">{item.desc}</div>
            </div>
            <ChevronRight size={16} className="text-muted2" />
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
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <p className="text-muted">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-bold text-xl text-text">Profile</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <ProfileHeader user={user} profile={user.profile} />
        <StatsCards profile={user.profile} />
        <MacroTargets profile={user.profile} />
        <SettingsList />

        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-[rgba(192,57,43,0.18)] bg-[rgba(192,57,43,0.05)] text-[#C0392B] font-semibold text-sm hover:bg-[rgba(192,57,43,0.1)] transition-colors cursor-pointer"
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
