import BottomNav from "@/components/bottom-nav";
import { Calendar } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Progress | FitScan" };

async function getProgressData(userId) {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [foodLogs, bodyLogs] = await Promise.all([
    prisma.foodLog.findMany({
      where: { userId, loggedAt: { gte: weekAgo } },
      orderBy: { loggedAt: "asc" },
    }),
    prisma.bodyMeasurement.findMany({
      where: { userId, measuredAt: { gte: weekAgo } },
      orderBy: { measuredAt: "asc" },
    }),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayLogs = foodLogs.filter((l) => l.loggedAt >= todayStart);
  const consumed = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.proteinG,
      carbs: acc.carbs + log.carbG,
      fat: acc.fat + log.fatG,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dailyCals = {};
  foodLogs.forEach((log) => {
    const day = log.loggedAt.toISOString().split("T")[0];
    dailyCals[day] = (dailyCals[day] || 0) + log.calories;
  });

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    last7Days.push(dailyCals[key] || 0);
  }

  const weightPoints = bodyLogs
    .filter((l) => l.weightKg)
    .map((l) => l.weightKg);

  return { profile, consumed, last7Days, weightPoints };
}

function WeightChart({ points, goal }) {
  if (points.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-text mb-4">Weight</h3>
        <p className="text-xs text-muted text-center py-8">No weight measurements yet. Log a body measurement to see your chart.</p>
      </div>
    );
  }

  const max = Math.max(...points) + 1;
  const min = Math.min(goal || points[points.length - 1], ...points) - 1;
  const range = max - min || 1;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-text">Weight</h3>
        <span className="text-[11px] text-muted">Recent</span>
      </div>
      <div className="relative h-36">
        <div className="ml-7 relative h-full">
          {goal && (
            <div
              className="absolute left-0 right-0 border-t-[1.5px] border-dashed border-[#C0392B]/50"
              style={{ bottom: `${((goal - min) / range) * 100}%` }}
            >
              <span className="absolute -top-4 right-0 text-[9px] text-[#C0392B] font-medium">
                Goal: {goal}kg
              </span>
            </div>
          )}
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#2D9C7E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points
                .map((p, i) => `${(i / Math.max(points.length - 1, 1)) * 300},${120 - ((p - min) / range) * 120}`)
                .join(" ")}
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={(i / Math.max(points.length - 1, 1)) * 300}
                cy={120 - ((p - min) / range) * 120}
                r="4"
                fill="#2D9C7E"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

function MacroAdherence({ consumed, profile }) {
  const data = [
    { label: "Protein", current: Math.round(consumed.protein), target: profile.proteinTargetG, color: "bg-protein" },
    { label: "Carbs", current: Math.round(consumed.carbs), target: profile.carbTargetG, color: "bg-carb" },
    { label: "Fat", current: Math.round(consumed.fat), target: profile.fatTargetG, color: "bg-fat" },
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
                {item.current} / {item.target}g
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

function CalorieTrend({ days, target }) {
  const max = Math.max(target, ...days) + 200;

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
                className={`w-full rounded-md ${cal >= target ? "bg-[#2D9C7E]" : cal > 0 ? "bg-[#2D9C7E]/40" : "bg-[#F0F0F0]"}`}
                style={{ height: `${max > 0 ? (cal / max) * 100 : 0}%` }}
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
        Target: {target.toLocaleString()} kcal
      </div>
    </div>
  );
}

export default async function ProgressPage() {
  const session = await auth();
  const data = session?.user?.id ? await getProgressData(session.user.id) : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const { profile, consumed, last7Days, weightPoints } = data;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-text">Progress</h1>
            <p className="text-xs text-muted mt-0.5">Track your transformation</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Calendar size={18} className="text-muted" />
          </button>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <WeightChart points={weightPoints} goal={profile.targetWeightKg} />
        <MacroAdherence consumed={consumed} profile={profile} />
        <CalorieTrend days={last7Days} target={profile.dailyCalTarget} />
      </div>

      <BottomNav />
    </div>
  );
}
