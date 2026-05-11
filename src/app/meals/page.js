import Link from "next/link";
import BottomNav from "@/components/bottom-nav";
import { Droplets, UtensilsCrossed, Plus } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLang } from "@/lib/get-lang";
import { t } from "@/lib/i18n";
import HeaderStats from "@/components/header-stats";
import AiRecommendation from "@/components/ai-recommendation";

export const metadata = { title: "Daily Plan | FitScan" };

async function getMealsData(userId) {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
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

function NutritionCircle({ label, current, target, percentage, color, unit }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[58px] h-[58px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 58 58">
          <circle cx="29" cy="29" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="4.5" />
          <circle
            cx="29" cy="29" r={radius} fill="none" stroke={color} strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-[10px] text-gray-700">{percentage}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-700 mt-1.5">{label}</span>
      <span className="text-[9px] text-gray-400">{current} / {target}{unit}</span>
    </div>
  );
}

function TodaysNutrition({ consumed, profile, lang }) {
  const proteinPct = Math.round((consumed.protein / profile.proteinTargetG) * 100);
  const carbsPct = Math.round((consumed.carbs / profile.carbTargetG) * 100);
  const fatPct = Math.round((consumed.fat / profile.fatTargetG) * 100);
  const calRemaining = Math.max(profile.dailyCalTarget - consumed.calories, 0);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <h3 className="font-bold text-sm text-gray-800 mb-4">{t(lang, "todays_nutrition")}</h3>
      <div className="flex items-center justify-between">
        <NutritionCircle label={t(lang, "protein")} current={Math.round(consumed.protein)} target={`${profile.proteinTargetG}`} unit="g" percentage={proteinPct} color="#EF5350" />
        <NutritionCircle label={t(lang, "carbs")} current={Math.round(consumed.carbs)} target={`${profile.carbTargetG}`} unit="g" percentage={carbsPct} color="#42A5F5" />
        <NutritionCircle label={t(lang, "fat")} current={Math.round(consumed.fat)} target={`${profile.fatTargetG}`} unit="g" percentage={fatPct} color="#FFA726" />
        <div className="flex flex-col items-center">
          <div className="relative w-[58px] h-[58px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 58 58">
              <circle cx="29" cy="29" r="24" fill="none" stroke="#F0F0F0" strokeWidth="4.5" />
              <circle
                cx="29" cy="29" r="24" fill="none" stroke="#2D9C7E" strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24}
                strokeDashoffset={2 * Math.PI * 24 - (Math.min(Math.round((consumed.calories / profile.dailyCalTarget) * 100), 100) / 100) * 2 * Math.PI * 24}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-[9px] text-gray-700">{calRemaining.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-700 mt-1.5">{t(lang, "calories")}</span>
          <span className="text-[9px] text-gray-400">{t(lang, "left")}</span>
        </div>
      </div>
    </div>
  );
}


function WaterCard({ lang }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-[#42A5F5]" />
          <h3 className="font-bold text-sm text-gray-800">{t(lang, "water")}</h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">0 / 2.5L</span>
      </div>
      <div className="h-3 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#42A5F5] to-[#90CAF9] rounded-full" style={{ width: "0%" }} />
      </div>
    </div>
  );
}

function MealsList({ meals, lang }) {
  return (
    <div className="bg-gradient-to-br from-[#2E1065] to-[#4C1D95] rounded-3xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/5" />
      <img src="/images/cat-cook.png" alt="Cat Cook" className="absolute right-0 bottom-0 w-24 h-24 object-contain opacity-80" />

      <h3 className="font-bold text-sm text-white mb-4">{t(lang, "todays_quest")}</h3>

      {meals.length === 0 ? (
        <p className="text-xs text-white/60 text-center py-4 relative z-10">{t(lang, "no_meals_logged")}</p>
      ) : (
        <div className="flex flex-col gap-3 relative z-10">
          {meals.map((meal) => {
            const time = new Date(meal.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const itemNames = meal.items.map((i) => i.name).join(", ");
            return (
              <div key={meal.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2D9C7E] flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                  <UtensilsCrossed size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">
                      {meal.mealType.charAt(0) + meal.mealType.slice(1).toLowerCase()}
                    </span>
                    <span className="text-[10px] text-[#2D9C7E] font-medium">{time}</span>
                  </div>
                  <p className="text-[11px] text-white/70 mt-0.5 truncate">{itemNames}</p>
                  <span className="text-[10px] text-white/50">
                    {meal.totalCalories} kcal · {Math.round(meal.totalProtein)}g P
                    {meal.items.length > 1 && ` · ${meal.items.length} items`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/meals/add"
        className="relative z-10 flex items-center justify-center gap-2 mt-4 py-3 bg-[#2D9C7E] rounded-2xl text-sm font-bold text-white shadow-[0_4px_14px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
      >
        <Plus size={18} /> {t(lang, "log_meal_manually")}
      </Link>
    </div>
  );
}

export default async function MealsPage() {
  const session = await auth();
  const data = session?.user?.id ? await getMealsData(session.user.id) : null;

  const lang = await getLang();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] flex items-center justify-center">
        <p className="text-gray-400">{t(lang, "loading")}</p>
      </div>
    );
  }

  const { profile, consumed, meals } = data;

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      {/* Purple Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#4C1D95] to-[#F5F9F7] px-5 pt-6 pb-[32vh]">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10" style={{ WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 80%)", maskImage: "linear-gradient(to bottom, black 40%, transparent 80%)" }}>
          <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="30" cy="120" r="60" fill="#A78BFA" />
            <circle cx="50" cy="20" r="30" fill="#C4B5FD" />
            <circle cx="120" cy="80" r="20" fill="#8B5CF6" />
            <circle cx="80" cy="130" r="15" fill="#A78BFA" />
            <circle cx="160" cy="30" r="25" fill="#DDD6FE" />
            <circle cx="10" cy="60" r="12" fill="#8B5CF6" />
            <circle cx="90" cy="40" r="10" fill="#C4B5FD" />
            <circle cx="40" cy="80" r="8" fill="#DDD6FE" />
            <circle cx="140" cy="120" r="35" fill="#A78BFA" />
            <circle cx="70" cy="70" r="22" fill="#C4B5FD" />
            <circle cx="110" cy="10" r="18" fill="#8B5CF6" />
            <circle cx="-10" cy="30" r="40" fill="#DDD6FE" />
            <circle cx="180" cy="90" r="14" fill="#C4B5FD" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-end">
            <HeaderStats userId={session.user.id} dark />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-black text-2xl text-white">{t(lang, "daily_plan")}</h1>
              <p className="text-xs text-white/60 mt-0.5">{t(lang, "level_up_day")}</p>
            </div>
            <img src="/images/cat-cook.png" alt="Cat Cook" className="w-32 h-32 object-contain -mb-10" />
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 -mt-[30vh] relative z-10">
        <TodaysNutrition consumed={consumed} profile={profile} lang={lang} />
        <AiRecommendation lang={lang} />

        <WaterCard lang={lang} />
        <MealsList meals={meals} lang={lang} />
      </div>

      <BottomNav />
    </div>
  );
}
