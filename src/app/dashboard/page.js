import BottomNav from "@/components/bottom-nav";

export const metadata = { title: "Dashboard | FitScan" };

function MacroRing() {
  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <div className="flex items-center gap-5">
        {/* SVG Ring */}
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 118 118">
            <circle cx="59" cy="59" r="48" fill="none" stroke="#EDEAE2" strokeWidth="10" />
            <circle
              cx="59" cy="59" r="48" fill="none" stroke="#C0392B" strokeWidth="10"
              strokeDasharray="301" strokeDashoffset="150" strokeLinecap="round"
              transform="rotate(-90 59 59)"
            />
            <circle
              cx="59" cy="59" r="48" fill="none" stroke="#2471A3" strokeWidth="10"
              strokeDasharray="301" strokeDashoffset="90" strokeLinecap="round"
              transform="rotate(39 59 59)"
            />
            <circle
              cx="59" cy="59" r="48" fill="none" stroke="#D4882A" strokeWidth="10"
              strokeDasharray="301" strokeDashoffset="226" strokeLinecap="round"
              transform="rotate(129 59 59)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-black text-accent leading-none">1,842</span>
            <span className="text-[9px] text-muted mt-0.5">kcal left</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-text2">
            <span className="w-2 h-2 rounded-full bg-protein" />
            Protein · 94 / 160g
          </div>
          <div className="flex items-center gap-2 text-xs text-text2">
            <span className="w-2 h-2 rounded-full bg-carb" />
            Carbs · 210 / 300g
          </div>
          <div className="flex items-center gap-2 text-xs text-text2">
            <span className="w-2 h-2 rounded-full bg-fat" />
            Fat · 48 / 80g
          </div>
          <div className="flex items-center gap-2 text-xs text-accent font-semibold mt-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Calories remaining
          </div>
        </div>
      </div>
    </div>
  );
}

function AiTipCard() {
  return (
    <div className="bg-gradient-to-br from-accent-light to-[#FEF9F5] border-[1.5px] border-accent-mid rounded-[14px] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wide">
          AI TIP
        </span>
        <span className="font-bold text-sm text-text">Today&apos;s nutrition plan</span>
      </div>
      <p className="text-[13px] text-text2 leading-relaxed mb-4">
        You&apos;re bulking — target 2,800 kcal. You&apos;re 66g short on protein. A post-workout
        shake + Greek yogurt snack would close the gap perfectly.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5 p-2.5 bg-surface rounded-lg border border-border text-xs cursor-pointer hover:border-accent-mid transition-colors">
          <span className="text-base">🥗</span>
          Lunch suggestion: Chicken rice bowl · 580 kcal · 42g P
        </div>
        <div className="flex items-center gap-2.5 p-2.5 bg-surface rounded-lg border border-border text-xs cursor-pointer hover:border-accent-mid transition-colors">
          <span className="text-base">🍗</span>
          Dinner: Salmon + sweet potato · 640 kcal · 48g P
        </div>
      </div>
    </div>
  );
}

function MealLog() {
  const meals = [
    { type: "Breakfast", time: "8:14 AM", items: [{ name: "Oatmeal + Banana", cal: 320, protein: 12 }] },
    { type: "Lunch", time: "1:02 PM", items: [{ name: "Grilled Chicken Breast", cal: 246, protein: 46 }, { name: "Brown Rice", cal: 180, protein: 4 }] },
    { type: "Snack", time: "4:30 PM", items: [{ name: "Greek Yogurt", cal: 130, protein: 18 }] },
  ];

  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <h3 className="font-display font-extrabold text-sm mb-4">Today&apos;s Meals</h3>
      <div className="flex flex-col gap-4">
        {meals.map((meal) => (
          <div key={meal.type}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text2">
                {meal.type}
              </span>
              <span className="text-[10px] text-muted">{meal.time}</span>
            </div>
            {meal.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-xs text-text">{item.name}</span>
                <div className="flex gap-3">
                  <span className="text-[10px] text-muted">{item.cal} kcal</span>
                  <span className="text-[10px] text-protein font-semibold">
                    {item.protein}g P
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WaterTracker() {
  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-extrabold text-sm">Water</h3>
        <span className="text-xs text-water font-semibold">1.8 / 2.5L</span>
      </div>
      <div className="h-2 bg-bg2 rounded-full overflow-hidden">
        <div className="h-full bg-water rounded-full" style={{ width: "72%" }} />
      </div>
    </div>
  );
}

function StreakBadge() {
  return (
    <div className="bg-surface border border-border rounded-[14px] p-4 shadow-sm flex items-center gap-3">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="font-display font-black text-lg text-accent leading-none">12</div>
        <div className="text-[10px] text-muted">day streak</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg pb-28">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Good afternoon,</p>
            <h1 className="font-display text-xl font-black text-text">John 👋</h1>
          </div>
          <StreakBadge />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 flex flex-col gap-4">
        <MacroRing />
        <AiTipCard />
        <WaterTracker />
        <MealLog />
      </div>

      <BottomNav />
    </div>
  );
}
