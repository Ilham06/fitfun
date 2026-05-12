import { redirect } from "next/navigation";
import BottomNav from "@/components/bottom-nav";
import { Target, Zap, Weight, Ruler, UtensilsCrossed } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLevelInfo } from "@/lib/xp";
import HeaderStats from "@/components/header-stats";
import AiTipCard from "@/components/ai-tip-card";

export const metadata = { title: "Home | FitScan" };

async function getDashboardData(userId) {
  console.log("[DASHBOARD] getDashboardData called, userId:", userId);
  let profile;
  try {
    profile = await prisma.userProfile.findUnique({ where: { userId } });
    console.log("[DASHBOARD] Profile query result:", profile ? "found" : "NOT FOUND");
  } catch (err) {
    console.error("[DASHBOARD] Profile query ERROR:", err.message);
    return null;
  }
  if (!profile) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Calculate totals from all food logs
  const todayLogs = await prisma.foodLog.findMany({
    where: { userId, loggedAt: { gte: todayStart, lte: todayEnd } },
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

  // Fetch meals (grouped) and standalone logs (legacy)
  const mealsWithItems = await prisma.meal.findMany({
    where: { userId, loggedAt: { gte: todayStart, lte: todayEnd } },
    include: { items: true },
  });

  const standaloneLogs = await prisma.foodLog.findMany({
    where: { userId, mealId: null, loggedAt: { gte: todayStart, lte: todayEnd } },
  });

  // Normalize into a single list format
  const combinedMeals = [
    ...mealsWithItems.map(m => ({
      id: m.id,
      mealType: m.mealType,
      loggedAt: m.loggedAt,
      items: m.items,
      totalCalories: m.items.reduce((sum, item) => sum + item.calories, 0),
      totalProtein: m.items.reduce((sum, item) => sum + item.proteinG, 0),
    })),
    ...standaloneLogs.map(log => ({
      id: log.id,
      mealType: log.mealType,
      loggedAt: log.loggedAt,
      items: [log],
      totalCalories: log.calories,
      totalProtein: log.proteinG,
    }))
  ].sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));

  return { profile, consumed, meals: combinedMeals };
}

function HeroBanner({ name, userId, profile, level }) {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  let bgImage = "/bg/header-bg-night.png";

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
    bgImage = "/bg/header-bg-morning.png";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon";
    bgImage = "/bg/header-bg-afternoon.png";
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0F0] to-[#D4F1F9] px-5 pt-6 h-[250px]">
      <img
        src={bgImage}
        alt=""
        className="absolute bottom-0 left-0 right-0 w-full object-contain object-bottom pointer-events-none h-auto"
      />

      <div className="relative z-10">
        <div className="flex justify-end mb-4">
          <HeaderStats userId={userId} />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 shadow-lg flex items-center justify-center border-4 border-white overflow-hidden">
            <img
              src={profile?.gender?.toLowerCase() === "female" ? "/images/woman-avatar.png" : "/images/men-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-xs font-medium drop-shadow">{greeting},</p>
            <h1 className="font-black text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {name || "FitWarrior"} 💪
            </h1>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bold text-white backdrop-blur-sm">
              Lv. {level}
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
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0] mx-5 -mt-20 relative z-20">
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
      <div className="mx-5 bg-[#F0FDF4] rounded-3xl p-5 shadow-sm border border-[#BBF7D0] relative overflow-hidden">
        <img src="/images/meals.png" alt="Meals" className="absolute -right-2 top-1/2 -translate-y-1/2 w-24 h-24 object-contain opacity-80 -mt-5" />
        <h3 className="font-bold text-sm text-gray-800 mb-3 relative z-10">Today&apos;s Meal</h3>
        <p className="text-xs text-gray-500 text-left py-4 relative z-10 w-[70%]">No meals logged yet. Scan or add a meal to start your quest!</p>
      </div>
    );
  }

  return (
    <div className="mx-5 bg-[#F0FDF4] rounded-3xl p-5 shadow-sm border border-[#BBF7D0] relative overflow-hidden">
      <img src="/images/meals.png" alt="Meals" className="absolute top-2 right-2 w-16 h-16 object-contain opacity-90" />

      <h3 className="font-bold text-sm text-gray-800 mb-3 relative z-10">Today&apos;s Meal</h3>

      <div className="flex flex-col gap-2.5 relative z-10">
        {meals.slice(-3).map((meal) => {
          const c = MEAL_COLORS[meal.mealType] || MEAL_COLORS.SNACK;
          const itemNames = meal.items.map((i) => i.name).join(", ");
          return (
            <div key={meal.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <UtensilsCrossed size={16} className={c.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-xs text-gray-800 block">
                  {meal.mealType.charAt(0) + meal.mealType.slice(1).toLowerCase()}
                </span>
                <span className="text-[11px] text-gray-500 block truncate">{itemNames}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">{meal.totalCalories} kcal · {Math.round(meal.totalProtein)}gP</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  console.log("[DASHBOARD] Start rendering...");
  const session = await auth();
  console.log("[DASHBOARD] Session:", JSON.stringify(session?.user || null));

  if (!session?.user?.id) {
    console.log("[DASHBOARD] No session, redirecting to /login");
    redirect("/login");
  }

  console.log("[DASHBOARD] Fetching data for userId:", session.user.id);
  const data = await getDashboardData(session.user.id);
  console.log("[DASHBOARD] Data result:", data ? "has profile" : "NO profile");

  if (!data) {
    console.log("[DASHBOARD] No profile, redirecting to /onboarding/profile");
    redirect("/onboarding/profile");
  }

  const { profile, consumed, meals } = data;
  const { level } = getLevelInfo(profile.xp ?? 0);

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      <HeroBanner name={session.user.name?.split(" ")[0]} userId={session.user.id} profile={profile} level={level} />
      <QuestCard consumed={consumed} profile={profile} />

      <div className="flex flex-col gap-4 mt-4">
        <AiTipCard />
        <StatsCards profile={profile} />
        <TodaysMeal meals={meals} />
      </div>

      <BottomNav />
    </div>
  );
}
