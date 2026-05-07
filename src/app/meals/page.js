import BottomNav from "@/components/bottom-nav";
import { Calendar, Sparkles, Droplets, ChevronRight, UtensilsCrossed } from "lucide-react";

export const metadata = { title: "Daily Plan | FitScan" };

function NutritionCircle({ label, current, target, percentage, color }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

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
      <span className="text-[9px] text-muted">{current} / {target}</span>
    </div>
  );
}

function TodaysNutrition() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Nutrition</h3>
      <div className="flex items-center justify-between">
        <NutritionCircle label="Protein" current="94" target="160g" percentage={59} color="#C0392B" />
        <NutritionCircle label="Carbs" current="210" target="300g" percentage={70} color="#2471A3" />
        <NutritionCircle label="Fat" current="48" target="80g" percentage={60} color="#D4882A" />
        <div className="flex flex-col items-center">
          <div className="relative w-[68px] h-[68px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="28" fill="none" stroke="#F0F0F0" strokeWidth="5" />
              <circle
                cx="34" cy="34" r="28" fill="none" stroke="#2D9C7E" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 - (66 / 100) * 2 * Math.PI * 28}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-bold text-[10px] text-text">1,842</span>
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
            className="flex items-center gap-3 p-3 bg-[#F8F8F8] rounded-xl hover:bg-[#F0F0F0] transition-colors cursor-pointer"
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
        <span className="text-xs text-water font-semibold">1.8 / 2.5L</span>
      </div>
      <div className="h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div className="h-full bg-water rounded-full" style={{ width: "72%" }} />
      </div>
    </div>
  );
}

function MealsList() {
  const meals = [
    { type: "Breakfast", time: "8:14 AM", name: "Oatmeal + Banana", cal: 320, protein: 12, color: "bg-[#FFF3E0]", iconColor: "text-[#F57C00]" },
    { type: "Lunch", time: "1:02 PM", name: "Chicken Rice Bowl", cal: 580, protein: 42, color: "bg-[#E8F5E9]", iconColor: "text-[#388E3C]" },
    { type: "Snack", time: "4:30 PM", name: "Greek Yogurt", cal: 200, protein: 18, color: "bg-[#E3F2FD]", iconColor: "text-[#1976D2]" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Meals</h3>
      <div className="flex flex-col gap-3">
        {meals.map((meal) => (
          <div key={meal.type} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${meal.color} flex items-center justify-center`}>
              <UtensilsCrossed size={18} className={meal.iconColor} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-text">{meal.type}</span>
                <span className="text-[10px] text-muted">{meal.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-text2">{meal.name}</span>
                <span className="text-[10px] text-muted">
                  {meal.cal} kcal · <span className="text-protein font-semibold">{meal.protein}g P</span>
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted2 ml-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MealsPage() {
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
        <TodaysNutrition />
        <AiRecommendation />
        <WaterCard />
        <MealsList />
      </div>

      <BottomNav />
    </div>
  );
}
