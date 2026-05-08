import Link from "next/link";
import BottomNav from "@/components/bottom-nav";
import { Calendar, Sparkles, Droplets, ChevronRight, UtensilsCrossed, Plus } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Daily Plan | FitScan" };

async function getMealsData(userId) {
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

function NutritionCircle({ label, current, target, percentage, color, unit }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[68px] h-[68px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="5" />
          <circle
            cx="34" cy="34" r={radius} fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-[11px] text-text">{percentage}%</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-text mt-2">{label}</span>
      <span className="text-[9px] text-muted">{current} / {target}{unit}</span>
    </div>
  );
}

function TodaysNutrition({ consumed, profile }) {
  const proteinPct = Math.round((consumed.protein / profile.proteinTargetG) * 100);
  const carbsPct = Math.round((consumed.carbs / profile.carbTargetG) * 100);
  const fatPct = Math.round((consumed.fat / profile.fatTargetG) * 100);
  const calRemaining = profile.dailyCalTarget - consumed.calories;
  const calPct = Math.round((consumed.calories / profile.dailyCalTarget) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Nutrition</h3>
      <div className="flex items-center justify-between">
        <NutritionCircle label="Protein" current={Math.round(consumed.protein)} target={`${profile.proteinTargetG}`} unit="g" percentage={proteinPct} color="#C0392B" />
        <NutritionCircle label="Carbs" current={Math.round(consumed.carbs)} target={`${profile.carbTargetG}`} unit="g" percentage={carbsPct} color="#2471A3" />
        <NutritionCircle label="Fat" current={Math.round(consumed.fat)} target={`${profile.fatTargetG}`} unit="g" percentage={fatPct} color="#D4882A" />
        <div className="flex flex-col items-center">
          <div className="relative w-[68px] h-[68px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="28" fill="none" stroke="#F0F0F0" strokeWidth="5" />
              <circle
                cx="34" cy="34" r="28" fill="none" stroke="#2D9C7E" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 - (Math.min(calPct, 100) / 100) * 2 * Math.PI * 28}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-bold text-[10px] text-text">{calRemaining.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-text mt-2">Calories</span>
          <span className="text-[9px] text-muted">left</span>
        </div>
      </div>
    </div>
  );
}

function AiRecommendation() {
  const suggestions = [
    { text: "Lunch suggestion: Chicken rice bowl · 580 kcal · 42g P", color: "bg-[#E8F5E9]", iconColor: "text-[#388E3C]" },
    { text: "Dinner suggestion: Salmon + sweet potato · 640 kcal · 48g P", color: "bg-[#FFF3E0]", iconColor: "text-[#F57C00]" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-[#2D9C7E]" />
        <h3 className="font-semibold text-sm text-text">AI Recommendation</h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-[#F8F8F8] rounded-xl"
          >
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center shadow-sm`}>
              <UtensilsCrossed size={16} className={s.iconColor} />
            </div>
            <span className="text-xs text-text2 flex-1">{s.text}</span>
            <ChevronRight size={16} className="text-muted2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function WaterCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-water" />
          <h3 className="font-semibold text-sm text-text">Water</h3>
        </div>
        <span className="text-xs text-water font-semibold">0 / 2.5L</span>
      </div>
      <div className="h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div className="h-full bg-water rounded-full" style={{ width: "0%" }} />
      </div>
    </div>
  );
}

const MEAL_COLORS = {
  BREAKFAST: { bg: "bg-[#FFF3E0]", icon: "text-[#F57C00]" },
  LUNCH: { bg: "bg-[#E8F5E9]", icon: "text-[#388E3C]" },
  DINNER: { bg: "bg-[#F3E5F5]", icon: "text-[#7B1FA2]" },
  SNACK: { bg: "bg-[#E3F2FD]", icon: "text-[#1976D2]" },
};

function MealsList({ meals }) {
  if (meals.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Meals</h3>
        <p className="text-xs text-muted text-center py-4">No meals logged yet today.</p>
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

export default async function MealsPage() {
  const session = await auth();
  const data = session?.user?.id ? await getMealsData(session.user.id) : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const { profile, consumed, meals } = data;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl text-text">Daily Plan</h1>
          <button className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Calendar size={18} className="text-muted" />
          </button>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <TodaysNutrition consumed={consumed} profile={profile} />
        <AiRecommendation />
        <WaterCard />
        <MealsList meals={meals} />

        <Link
          href="/meals/add"
          className="flex items-center justify-center gap-2 py-3.5 bg-white rounded-2xl border-2 border-dashed border-[#E0E0E0] text-sm font-semibold text-muted hover:border-[#2D9C7E] hover:text-[#2D9C7E] transition-colors shadow-sm"
        >
          <Plus size={18} /> Log Meal Manually
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
