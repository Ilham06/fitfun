import BottomNav from "@/components/bottom-nav";

export const metadata = { title: "Progress | FitScan" };

function WeightChart() {
  const points = [75.2, 74.8, 74.5, 74.9, 74.3, 74.0, 73.6];
  const goal = 70;
  const max = Math.max(...points) + 1;
  const min = Math.min(goal, ...points) - 1;
  const range = max - min;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-text">Weight</h3>
        <span className="text-[11px] text-muted">Last 7 days</span>
      </div>
      <div className="relative h-36">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-muted2 w-6">
          <span>76</span>
          <span>74</span>
          <span>72</span>
          <span>70</span>
        </div>

        {/* Chart area */}
        <div className="ml-7 relative h-full">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-gray-100" />
            <div className="border-t border-gray-100" />
            <div className="border-t border-gray-100" />
            <div className="border-t border-gray-100" />
          </div>

          {/* Goal line */}
          <div
            className="absolute left-0 right-0 border-t-[1.5px] border-dashed border-[#C0392B]/50"
            style={{ bottom: `${((goal - min) / range) * 100}%` }}
          >
            <span className="absolute -top-4 right-0 text-[9px] text-[#C0392B] font-medium">
              Goal: {goal}kg
            </span>
          </div>

          {/* Line chart */}
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#2D9C7E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points
                .map((p, i) => `${(i / (points.length - 1)) * 300},${120 - ((p - min) / range) * 120}`)
                .join(" ")}
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={(i / (points.length - 1)) * 300}
                cy={120 - ((p - min) / range) * 120}
                r="4"
                fill="#2D9C7E"
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="flex justify-between mt-3 ml-7 text-[10px] text-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function MacroAdherence() {
  const data = [
    { label: "Protein", current: 94, target: 160, color: "bg-protein" },
    { label: "Carbs", current: 210, target: 300, color: "bg-carb" },
    { label: "Fat", current: 48, target: 80, color: "bg-fat" },
    { label: "Water", current: 1.8, target: 2.5, color: "bg-water", unit: "L" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-text">Macro Adherence</h3>
        <span className="text-[11px] text-muted">Today</span>
      </div>
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-text2">{item.label}</span>
              <span className="text-xs text-muted">
                {item.current} / {item.target}{item.unit || "g"}
              </span>
            </div>
            <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalorieTrend() {
  const days = [2100, 2400, 2650, 2200, 2780, 2500, 2300];
  const target = 2783;
  const max = target + 300;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-text">Calorie Trend</h3>
        <span className="text-[11px] text-muted">7-day</span>
      </div>
      <div className="flex items-end gap-2.5 h-28">
        {days.map((cal, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full relative h-20 flex items-end">
              <div
                className={`w-full rounded-md ${cal >= target ? "bg-[#2D9C7E]" : "bg-[#2D9C7E]/40"}`}
                style={{ height: `${(cal / max) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-muted">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2D9C7E]" />
        Target: {target} kcal
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-text">Progress</h1>
            <p className="text-xs text-muted mt-0.5">Track your transformation</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-sm shadow-sm">
            📅
          </button>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <WeightChart />
        <MacroAdherence />
        <CalorieTrend />
      </div>

      <BottomNav />
    </div>
  );
}
