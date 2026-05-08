import BottomNav from "@/components/bottom-nav";
import { Flame, Sparkles, Target, Zap, Weight, Ruler, ChevronRight, UtensilsCrossed } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard | FitScan" };

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

function MacroRing({ consumed, profile }) {
  const remaining = profile.dailyCalTarget - consumed.calories;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Summary</h3>
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#F0F0F0" strokeWidth="12" />
            <circle
              cx="60" cy="60" r="48" fill="none" stroke="#C0392B" strokeWidth="12"
              strokeDasharray="301" strokeDashoffset={301 - (301 * Math.min(consumed.protein / profile.proteinTargetG, 1) * 0.33)} strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60" cy="60" r="48" fill="none" stroke="#2471A3" strokeWidth="12"
              strokeDasharray="301" strokeDashoffset={301 - (301 * Math.min(consumed.carbs / profile.carbTargetG, 1) * 0.33)} strokeLinecap="round"
              transform="rotate(30 60 60)"
            />
            <circle
              cx="60" cy="60" r="48" fill="none" stroke="#D4882A" strokeWidth="12"
              strokeDasharray="301" strokeDashoffset={301 - (301 * Math.min(consumed.fat / profile.fatTargetG, 1) * 0.33)} strokeLinecap="round"
              transform="rotate(150 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-2xl text-text leading-none">{remaining.toLocaleString()}</span>
            <span className="text-[10px] text-muted mt-1">kcal left</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-protein" />
            <span className="text-muted">Protein</span>
            <span className="font-semibold text-text ml-auto">{Math.round(consumed.protein)} / {profile.proteinTargetG}g</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-carb" />
            <span className="text-muted">Carbs</span>
            <span className="font-semibold text-text ml-auto">{Math.round(consumed.carbs)} / {profile.carbTargetG}g</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-fat" />
            <span className="text-muted">Fat</span>
            <span className="font-semibold text-text ml-auto">{Math.round(consumed.fat)} / {profile.fatTargetG}g</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D9C7E]" />
            <span className="text-[#2D9C7E] font-semibold">Calories left</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiTipCard({ profile, consumed }) {
  const proteinLeft = profile.proteinTargetG - Math.round(consumed.protein);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-[#2D9C7E]" />
        <span className="font-semibold text-sm text-text">AI Tip</span>
      </div>
      <p className="text-[13px] text-text2 leading-relaxed">
        You&apos;re {profile.program.toLowerCase() === "bulking" ? "bulking" : profile.program.toLowerCase()} — target {profile.dailyCalTarget.toLocaleString()} kcal.
        {proteinLeft > 0
          ? ` You're ${proteinLeft}g short on protein. A post-workout shake + Greek yogurt would close the gap.`
          : " Great job hitting your protein target today!"}
      </p>
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

const MEAL_COLORS = {
  BREAKFAST: { bg: "bg-[#FFF3E0]", icon: "text-[#F57C00]" },
  LUNCH: { bg: "bg-[#E8F5E9]", icon: "text-[#388E3C]" },
  DINNER: { bg: "bg-[#F3E5F5]", icon: "text-[#7B1FA2]" },
  SNACK: { bg: "bg-[#E3F2FD]", icon: "text-[#1976D2]" },
};

function TodaysMeals({ meals }) {
  if (meals.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Meals</h3>
        <p className="text-xs text-muted text-center py-4">No meals logged yet today. Scan or add a meal!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Meals</h3>
      <div className="flex flex-col gap-3">
        {meals.map((meal) => {
          const colors = MEAL_COLORS[meal.mealType] || MEAL_COLORS.SNACK;
          const time = new Date(meal.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          return (
            <div key={meal.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <UtensilsCrossed size={18} className={colors.icon} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text">{meal.mealType.charAt(0) + meal.mealType.slice(1).toLowerCase()}</span>
                  <span className="text-[10px] text-muted">{time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-text2">{meal.name}</span>
                  <span className="text-[10px] text-muted">
                    {meal.calories} kcal · <span className="text-protein font-semibold">{Math.round(meal.proteinG)}g P</span>
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted2 ml-1" />
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
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const { profile, consumed, meals } = data;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">{greeting},</p>
            <h1 className="font-bold text-2xl text-text">{session.user.name?.split(" ")[0] || "User"}</h1>
          </div>
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-center gap-2">
            <Flame size={18} className="text-accent" />
            <div>
              <div className="font-bold text-sm text-accent leading-none">0</div>
              <div className="text-[9px] text-muted">Day streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <MacroRing consumed={consumed} profile={profile} />
        <AiTipCard profile={profile} consumed={consumed} />
        <StatsCards profile={profile} />
        <TodaysMeals meals={meals} />
      </div>

      <BottomNav />
    </div>
  );
}
