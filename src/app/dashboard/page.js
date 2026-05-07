import BottomNav from "@/components/bottom-nav";
import { Flame, Sparkles, Target, Zap, Weight, Ruler, ChevronRight, UtensilsCrossed } from "lucide-react";

export const metadata = { title: "Dashboard | FitScan" };

function MacroRing() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-sm text-text mb-4">Today&apos;s Summary</h3>
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#F0F0F0" strokeWidth="12" />
            <circle
              cx="60" cy="60" r="48" fill="none" stroke="#C0392B" strokeWidth="12"
              strokeDasharray="301" strokeDashoffset="123" strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60" cy="60" r="48" fill="none" stroke="#2471A3" strokeWidth="12"
              strokeDasharray="301" strokeDashoffset="90" strokeLinecap="round"
              transform="rotate(97 60 60)"
            />
            <circle
              cx="60" cy="60" r="48" fill="none" stroke="#D4882A" strokeWidth="12"
              strokeDasharray="301" strokeDashoffset="226" strokeLinecap="round"
              transform="rotate(222 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-2xl text-text leading-none">1,842</span>
            <span className="text-[10px] text-muted mt-1">kcal left</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-protein" />
            <span className="text-muted">Protein</span>
            <span className="font-semibold text-text ml-auto">94 / 160g</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-carb" />
            <span className="text-muted">Carbs</span>
            <span className="font-semibold text-text ml-auto">210 / 300g</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-fat" />
            <span className="text-muted">Fat</span>
            <span className="font-semibold text-text ml-auto">48 / 80g</span>
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

function AiTipCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-[#2D9C7E]" />
        <span className="font-semibold text-sm text-text">AI Tip</span>
      </div>
      <p className="text-[13px] text-text2 leading-relaxed">
        You&apos;re bulking — target 2,800 kcal. You&apos;re 66g short on protein. A post-workout
        shake + Greek yogurt snack would close the gap perfectly.
      </p>
    </div>
  );
}

function StatsCards() {
  const stats = [
    { icon: Target, label: "Program", value: "Bulking" },
    { icon: Zap, label: "Activity", value: "Moderate" },
    { icon: Weight, label: "Weight", value: "74.8 kg" },
    { icon: Ruler, label: "Height", value: "178 cm" },
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

function TodaysMeals() {
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Good afternoon,</p>
            <h1 className="font-bold text-2xl text-text">John</h1>
          </div>
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-center gap-2">
            <Flame size={18} className="text-accent" />
            <div>
              <div className="font-bold text-sm text-accent leading-none">12</div>
              <div className="text-[9px] text-muted">Day streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <MacroRing />
        <AiTipCard />
        <StatsCards />
        <TodaysMeals />
      </div>

      <BottomNav />
    </div>
  );
}
