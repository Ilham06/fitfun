import BottomNav from "@/components/bottom-nav";
import { Flame, Droplets, Bell, Bot, Target, Zap, Weight, Ruler, UtensilsCrossed } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Home | FitScan" };

async function getDashboardData(userId) {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayLogs = await prisma.foodLog.findMany({
    where: { userId, loggedAt: { gte: todayStart, lte: todayEnd } },
    orderBy: { loggedAt: "asc" },
  });

  const consumed = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.proteinG,
      carbs: acc.carbs + log.carbG,
      fat: acc.fat + log.fatG,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { profile, consumed, meals: todayLogs };
}

function HeroBanner({ name, streak }) {
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-b-[32px] bg-gradient-to-br from-[#A8E6CF] via-[#88D8B0] to-[#6BC5A0] px-5 pt-12 pb-8">
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-30">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="60" cy="180" rx="30" ry="50" fill="#4CAF50" />
          <ellipse cx="100" cy="170" rx="40" ry="60" fill="#66BB6A" />
          <ellipse cx="320" cy="175" rx="35" ry="55" fill="#4CAF50" />
          <ellipse cx="360" cy="180" rx="25" ry="45" fill="#66BB6A" />
          <circle cx="80" cy="40" r="8" fill="#FFF9C4" opacity="0.6" />
          <circle cx="300" cy="50" r="6" fill="#FFF9C4" opacity="0.5" />
          <circle cx="200" cy="20" r="10" fill="#FFF9C4" opacity="0.4" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-end gap-2 mb-4">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-gray-700">{streak}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
            <Droplets size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-gray-700">0</span>
          </div>
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <Bell size={14} className="text-gray-600" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-3 border-white">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] flex items-center justify-center text-2xl">
              🏋️
            </div>
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-xs font-medium">{greeting},</p>
            <h1 className="font-black text-xl text-white drop-shadow-sm">
              {name || "FitWarrior"} 💪
            </h1>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bold text-white backdrop-blur-sm">
              Lv. 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ consumed, profile }) {
  const remaining = Math.max(profile.dailyCalTarget - consumed.calories, 0);
  const calPct = Math.min(Math.round((consumed.calories / profile.dailyCalTarget) * 100), 100);
  const circumference = 2 * Math.PI * 46;
  const strokeOffset = circumference - (calPct / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0] -mt-5 mx-5 relative z-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-gray-800">Today&apos;s Quest</h3>
        <span className="text-xs font-bold text-[#2D9C7E] bg-[#E8F5F0] px-2.5 py-1 rounded-full">
          {calPct}%
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke="#F0F0F0" strokeWidth="10" />
            <circle
              cx="55" cy="55" r="46" fill="none"
              stroke="url(#questGradient)" strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
            />
            <defs>
              <linearGradient id="questGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D9C7E" />
                <stop offset="100%" stopColor="#A8E6CF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-black text-xl text-gray-800 leading-none">{remaining.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 mt-0.5 font-medium">kcal left</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#C0392B]" />
            <span className="text-gray-500">Protein</span>
            <span className="font-bold text-gray-700 ml-auto">{Math.round(consumed.protein)} / {profile.proteinTargetG}g</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#2471A3]" />
            <span className="text-gray-500">Carbs</span>
            <span className="font-bold text-gray-700 ml-auto">{Math.round(consumed.carbs)} / {profile.carbTargetG}g</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#D4882A]" />
            <span className="text-gray-500">Fat</span>
            <span className="font-bold text-gray-700 ml-auto">{Math.round(consumed.fat)} / {profile.fatTargetG}g</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#2D9C7E]" />
            <span className="text-[#2D9C7E] font-semibold">Calories left</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiTipCard({ profile, consumed }) {
  const proteinLeft = profile.proteinTargetG - Math.round(consumed.protein);
  const target = profile.dailyCalTarget >= 1000
    ? `${(profile.dailyCalTarget / 1000).toFixed(1)}k`
    : profile.dailyCalTarget;

  return (
    <div className="mx-5 bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] rounded-3xl p-4 shadow-sm border border-[#90CAF9]/30">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
          <Bot size={24} className="text-[#1976D2]" />
        </div>
        <div className="flex-1">
          <span className="font-bold text-xs text-[#1565C0] mb-1 block">AI Tip</span>
          <p className="text-[12px] text-gray-700 leading-relaxed">
            You&apos;re <span className="font-bold">{profile.program.toLowerCase()}</span> — target {target} kcal.
            {proteinLeft > 0 && (
              <>
                <br />You&apos;re {proteinLeft}g short on protein.
                <br />A post-workout shake + Greek yogurt would close the gap.
              </>
            )}
            {proteinLeft <= 0 && " Great job hitting your protein target today!"}
          </p>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_LABELS = {
  sedentary: "Sedentary",
  lightly_active: "Light",
  moderately_active: "Moderate",
  very_active: "Very Active",
};

function StatsCards({ profile }) {
  const stats = [
    { icon: Target, label: "Program", value: profile.program.charAt(0) + profile.program.slice(1).toLowerCase(), color: "text-[#2D9C7E]", bg: "bg-[#E8F5F0]" },
    { icon: Zap, label: "Activity", value: ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel, color: "text-[#F59E0B]", bg: "bg-[#FFF8E1]" },
    { icon: Weight, label: "Weight", value: `${profile.weightKg} kg`, color: "text-[#7C3AED]", bg: "bg-[#F3E8FF]" },
    { icon: Ruler, label: "Height", value: `${profile.heightCm} cm`, color: "text-[#EC4899]", bg: "bg-[#FCE7F3]" },
  ];

  return (
    <div className="mx-5 grid grid-cols-2 gap-3">
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

const MEAL_COLORS = {
  BREAKFAST: { bg: "bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2]", icon: "text-[#F57C00]" },
  LUNCH: { bg: "bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]", icon: "text-[#388E3C]" },
  DINNER: { bg: "bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7]", icon: "text-[#7B1FA2]" },
  SNACK: { bg: "bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]", icon: "text-[#1976D2]" },
};

function TodaysMeal({ meals }) {
  if (meals.length === 0) {
    return (
      <div className="mx-5 bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
        <h3 className="font-bold text-sm text-gray-800 mb-3">Today&apos;s Meal</h3>
        <p className="text-xs text-gray-400 text-center py-6">No meals logged yet. Scan or add a meal to start your quest!</p>
      </div>
    );
  }

  const latest = meals[meals.length - 1];
  const colors = MEAL_COLORS[latest.mealType] || MEAL_COLORS.SNACK;
  const time = new Date(latest.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="mx-5 bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0] relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#E8F5F0] opacity-50" />
      <div className="absolute -right-1 -bottom-1 w-20 h-20 rounded-full bg-[#A8E6CF]/30" />

      <h3 className="font-bold text-sm text-gray-800 mb-3">Today&apos;s Meal</h3>

      <div className="flex flex-col gap-2.5 relative z-10">
        {meals.slice(-3).map((meal) => {
          const c = MEAL_COLORS[meal.mealType] || MEAL_COLORS.SNACK;
          return (
            <div key={meal.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shadow-sm`}>
                <UtensilsCrossed size={16} className={c.icon} />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-xs text-gray-800 block">
                  {meal.mealType.charAt(0) + meal.mealType.slice(1).toLowerCase()}
                </span>
                <span className="text-[11px] text-gray-500">{meal.name}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{meal.calories} kcal · {Math.round(meal.proteinG)}gP</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const data = session?.user?.id ? await getDashboardData(session.user.id) : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const { profile, consumed, meals } = data;

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      <HeroBanner name={session.user.name?.split(" ")[0]} streak={0} />
      <QuestCard consumed={consumed} profile={profile} />

      <div className="flex flex-col gap-4 mt-4">
        <AiTipCard profile={profile} consumed={consumed} />
        <StatsCards profile={profile} />
        <TodaysMeal meals={meals} />
      </div>

      <BottomNav />
    </div>
  );
}
