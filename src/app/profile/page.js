import BottomNav from "@/components/bottom-nav";
import { Target, Zap, Weight, Ruler, Pencil, Bell, Download, LogOut, ChevronRight, Flame, Droplets, Award, Globe } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLang } from "@/lib/get-lang";
import { t, getActivityLabel } from "@/lib/i18n";
import LanguageSwitcher from "@/components/language-switcher";

export const metadata = { title: "Profile | FitScan" };

function getActivityLabels(lang) {
  return {
    sedentary: t(lang, "activity_sedentary"),
    lightly_active: t(lang, "activity_lightly_active"),
    moderately_active: t(lang, "activity_moderately_active"),
    very_active: t(lang, "activity_very_active"),
  };
}

async function getProfileData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  return user;
}

function ProfileHeader({ user, profile }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FEF9E6] via-[#FCEB9C] to-[#FAD463] rounded-3xl p-5 shadow-md border border-[#FAD463]/40">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mt-10 -mr-10"></div>
      
      <div className="relative z-10 flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-[3px] border-white/80 shadow-md overflow-hidden">
            <img 
              src={profile.gender?.toLowerCase() === 'female' ? '/images/woman-avatar.png' : '/images/men-avatar.png'} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#5D4037] to-[#8C6A3E] text-[10px] font-black text-white shadow-lg border-2 border-white z-20 whitespace-nowrap tracking-wide">
            Lv. 12
          </span>
        </div>

        <div className="flex-1">
          <h2 className="font-bold text-lg text-[#6A4F2B]">{user.name || "FitWarrior"}</h2>
          <p className="text-[11px] text-[#6A4F2B]/70 font-medium">{user.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-[#6A4F2B]/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6A4F2B] to-[#997A53] rounded-full" style={{ width: "62%" }} />
            </div>
            <span className="text-[10px] text-[#6A4F2B] font-bold">3,106 / 5,000 XP</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Award size={20} className="text-[#F59E0B]" />
          </div>
          <span className="text-[10px] text-[#6A4F2B] font-black">Gold</span>
          <span className="text-[8px] text-[#6A4F2B]/60 font-bold uppercase tracking-wider">Rank</span>
        </div>
      </div>
    </div>
  );
}

function StatsCards({ profile, lang }) {
  const ACTIVITY_LABELS = getActivityLabels(lang);
  const stats = [
    { icon: Target, label: t(lang, "program"), value: profile.program.charAt(0) + profile.program.slice(1).toLowerCase(), color: "text-[#2D9C7E]", bg: "bg-[#E8F5F0]" },
    { icon: Zap, label: t(lang, "activity"), value: ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel, color: "text-[#F59E0B]", bg: "bg-[#FFF8E1]" },
    { icon: Weight, label: t(lang, "weight"), value: `${profile.weightKg} kg`, color: "text-[#7C3AED]", bg: "bg-[#F3E8FF]" },
    { icon: Ruler, label: t(lang, "height"), value: `${profile.heightCm} cm`, color: "text-[#EC4899]", bg: "bg-[#FCE7F3]" },
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

function MacroTargets({ profile, lang }) {
  const totalCal = profile.dailyCalTarget;
  const proteinPct = totalCal > 0 ? Math.round((profile.proteinTargetG * 4 / totalCal) * 100) : 0;
  const carbPct = totalCal > 0 ? Math.round((profile.carbTargetG * 4 / totalCal) * 100) : 0;
  const fatPct = totalCal > 0 ? Math.round((profile.fatTargetG * 9 / totalCal) * 100) : 0;

  const macros = [
    { label: t(lang, "protein"), value: `${profile.proteinTargetG}g`, pct: `${proteinPct}%`, color: "text-[#EF5350]", bg: "bg-[#FFEBEE]" },
    { label: t(lang, "carbs"), value: `${profile.carbTargetG}g`, pct: `${carbPct}%`, color: "text-[#42A5F5]", bg: "bg-[#E3F2FD]" },
    { label: t(lang, "fat"), value: `${profile.fatTargetG}g`, pct: `${fatPct}%`, color: "text-[#FFA726]", bg: "bg-[#FFF3E0]" },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <h3 className="font-bold text-sm text-gray-800 mb-4">{t(lang, "daily_targets")}</h3>
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

function SettingsList({ lang }) {
  const items = [
    { icon: Pencil, label: t(lang, "edit_profile"), desc: t(lang, "edit_profile_desc") },
    { icon: Target, label: t(lang, "change_program"), desc: t(lang, "change_program_desc") },
    { icon: Bell, label: t(lang, "notifications"), desc: t(lang, "notifications_desc") },
    { icon: Download, label: t(lang, "export_data"), desc: t(lang, "export_data_desc") },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#F0F0F0]">
      <LanguageSwitcher />
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8F9FA] transition-colors ${i < items.length - 1 ? "border-b border-[#F0F0F0]" : ""
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
  const lang = await getLang();
  const user = session?.user?.id ? await getProfileData(session.user.id) : null;

  if (!user?.profile) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] flex items-center justify-center">
        <p className="text-gray-400">{t(lang, "profile_not_found")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#312E81] to-[#F5F9F7] px-5 pt-6 pb-[32vh]">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20" style={{ WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 80%)", maskImage: "linear-gradient(to bottom, black 40%, transparent 80%)" }}>
          <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="30" cy="120" r="60" fill="#4338CA" />
            <circle cx="50" cy="20" r="30" fill="#6366F1" />
            <circle cx="120" cy="80" r="20" fill="#3730A3" />
            <circle cx="80" cy="130" r="15" fill="#4F46E5" />
            <circle cx="160" cy="30" r="25" fill="#818CF8" />
            <circle cx="10" cy="60" r="12" fill="#4338CA" />
            <circle cx="90" cy="40" r="10" fill="#6366F1" />
            <circle cx="40" cy="80" r="8" fill="#4F46E5" />
            <circle cx="140" cy="120" r="35" fill="#3730A3" />
            <circle cx="70" cy="70" r="22" fill="#6366F1" />
            <circle cx="110" cy="10" r="18" fill="#818CF8" />
            <circle cx="-10" cy="30" r="40" fill="#4F46E5" />
            <circle cx="180" cy="90" r="14" fill="#6366F1" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-bold text-white">12</span>
            </div>
            <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
              <Droplets size={14} className="text-blue-300" />
              <span className="text-xs font-bold text-white">230</span>
            </div>
            <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
              <Bell size={14} className="text-white" />
            </div>
          </div>

          <div className="flex items-end justify-between mt-10">
            <div>
              <h1 className="font-black text-2xl text-white">{t(lang, "profile")}</h1>
              <p className="text-xs text-white/60 mt-0.5">{t(lang, "manage_details")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 -mt-[30vh] relative z-10">
        <ProfileHeader user={user} profile={user.profile} />
        <StatsCards profile={user.profile} lang={lang} />
        <MacroTargets profile={user.profile} lang={lang} />
        <SettingsList lang={lang} />

        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            {t(lang, "signOut")}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
