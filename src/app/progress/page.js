import BottomNav from "@/components/bottom-nav";

export const metadata = { title: "Progress | FitScan" };

function WeightChart() {
  const points = [75.2, 74.8, 74.5, 74.9, 74.3, 74.0, 73.6];
  const goal = 70;
  const max = Math.max(...points) + 1;
  const min = Math.min(goal, ...points) - 1;
  const range = max - min;

  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-extrabold text-sm">Weight</h3>
        <span className="text-xs text-muted">Last 7 days</span>
      </div>
      <div className="relative h-32">
        {/* Goal line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-accent/40"
          style={{ bottom: `${((goal - min) / range) * 100}%` }}
        >
          <span className="absolute -top-3 right-0 text-[9px] text-accent font-semibold">
            Goal: {goal}kg
          </span>
        </div>
        {/* Points */}
        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#D95F2B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points
              .map((p, i) => `${(i / (points.length - 1)) * 300},${100 - ((p - min) / range) * 100}`)
              .join(" ")}
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={(i / (points.length - 1)) * 300}
              cy={100 - ((p - min) / range) * 100}
              r="4"
              fill="#D95F2B"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted2">
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
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-extrabold text-sm">Macro Adherence</h3>
        <span className="text-xs text-muted">Today</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-text2">{item.label}</span>
              <span className="text-xs text-muted">
                {item.current} / {item.target}
                {item.unit || "g"}
              </span>
            </div>
            <div className="h-2 bg-bg2 rounded-full overflow-hidden">
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
  const max = Math.max(...days, target) + 200;

  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-extrabold text-sm">Calorie Trend</h3>
        <span className="text-xs text-muted">7-day</span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {days.map((cal, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-bg2 rounded-t-md overflow-hidden relative" style={{ height: "80px" }}>
              <div
                className={`absolute bottom-0 left-0 right-0 rounded-t-md ${
                  cal >= target ? "bg-accent" : "bg-accent/50"
                }`}
                style={{ height: `${(cal / max) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-muted2">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
        <span className="w-2 h-2 rounded-full bg-accent" /> Target: {target} kcal
      </div>
    </div>
  );
}

function BodyDelta() {
  const deltas = [
    { metric: "Weight", from: "75.2", to: "73.6", unit: "kg" },
    { metric: "Waist", from: "84", to: "82", unit: "cm" },
    { metric: "Chest", from: "96", to: "98", unit: "cm" },
    { metric: "Arms", from: "33", to: "34.5", unit: "cm" },
  ];

  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-extrabold text-sm">Body Changes</h3>
        <span className="text-xs text-muted">30 days</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {deltas.map((d) => {
          const diff = (parseFloat(d.to) - parseFloat(d.from)).toFixed(1);
          const isNeg = parseFloat(diff) < 0;
          return (
            <div key={d.metric} className="bg-surface2 rounded-lg p-3">
              <div className="text-[10px] text-muted mb-1">{d.metric}</div>
              <div className="font-display font-black text-text text-lg">
                {d.to}
                <span className="text-xs text-muted font-normal ml-0.5">{d.unit}</span>
              </div>
              <div className={`text-[11px] font-semibold mt-0.5 ${isNeg ? "text-fiber" : "text-protein"}`}>
                {isNeg ? "" : "+"}
                {diff} {d.unit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-bg pb-28">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-xl font-black text-text">Progress</h1>
        <p className="text-xs text-muted mt-1">Track your transformation</p>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <WeightChart />
        <MacroAdherence />
        <CalorieTrend />
        <BodyDelta />
      </div>

      <BottomNav />
    </div>
  );
}
