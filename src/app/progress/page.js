import BottomNav from "@/components/bottom-nav";
import { Calendar, Flame, Droplets, Bell } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Quest Progress | FitScan" };

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
      <div className="bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0]/60 rounded-3xl p-5 shadow-sm border border-[#F8BBD0]/40">
        <h3 className="font-bold text-base text-gray-800 mb-2">Weight</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-600 leading-relaxed">
              No weight measurements yet.
              <br />Log a body measurement
              <br />to see your chart.
            </p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center text-5xl">
            🦕
          </div>
        </div>
      </div>
    );
  }

  const max = Math.max(...points) + 1;
  const min = Math.min(goal || points[points.length - 1], ...points) - 1;
  const range = max - min || 1;

  return (
    <div className="bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0]/60 rounded-3xl p-5 shadow-sm border border-[#F8BBD0]/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-gray-800">Weight</h3>
        <span className="text-[11px] text-gray-500 font-medium">Recent</span>
      </div>
      <div className="relative h-36">
        <div className="ml-7 relative h-full">
          {goal && (
            <div
              className="absolute left-0 right-0 border-t-[1.5px] border-dashed border-[#E91E63]/50"
              style={{ bottom: `${((goal - min) / range) * 100}%` }}
            >
              <span className="absolute -top-4 right-0 text-[9px] text-[#E91E63] font-medium">
                Goal: {goal}kg
              </span>
            </div>
          )}
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#E91E63"
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
                fill="#E91E63"
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
    { label: "Protein", current: Math.round(consumed.protein), target: profile.proteinTargetG, color: "bg-[#EF5350]", dot: "bg-[#EF5350]" },
    { label: "Carbs", current: Math.round(consumed.carbs), target: profile.carbTargetG, color: "bg-[#42A5F5]", dot: "bg-[#42A5F5]" },
    { label: "Fat", current: Math.round(consumed.fat), target: profile.fatTargetG, color: "bg-[#FFA726]", dot: "bg-[#FFA726]" },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-base text-gray-800">Macro Adherence</h3>
        <span className="text-[11px] text-gray-400 font-medium">Today</span>
      </div>
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.dot}`} />
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-600">
                {item.current} / {item.target}g
              </span>
            </div>
            <div className="h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
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
  const validDays = days.some((d) => d > 0);

  const points = days.map((cal, i) => {
    const x = 10 + (i / 6) * 280;
    const y = validDays ? 110 - (cal / max) * 100 : 110;
    return { x, y, cal };
  });

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-gray-800">Calorie Trend</h3>
        <span className="text-[11px] text-gray-400 font-medium">7-day</span>
      </div>

      <div className="mb-2">
        <span className="text-sm font-bold text-gray-700">
          {target >= 1000 ? `${(target / 1000).toFixed(1)}k` : target} kcal
        </span>
      </div>

      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D9C7E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2D9C7E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {validDays && (
            <>
              <path
                d={`${pathData} L ${points[6].x} 120 L ${points[0].x} 120 Z`}
                fill="url(#trendGradient)"
              />
              <path
                d={pathData}
                fill="none"
                stroke="#2D9C7E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2D9C7E" />
              ))}
              <text x={points[6].x} y={points[6].y - 10} textAnchor="middle" fontSize="14" fill="#FFA726">
                ⭐
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="flex justify-between mt-1 px-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <span key={i} className="text-[10px] text-gray-400 font-medium">{day}</span>
        ))}
      </div>
    </div>
  );
}

export default async function ProgressPage() {
  const session = await auth();
  const data = session?.user?.id ? await getProgressData(session.user.id) : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const { profile, consumed, last7Days, weightPoints } = data;

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E8D5F5] via-[#D4B8E8] to-[#C9A5E0] px-5 pt-12 pb-6 rounded-b-[32px]">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
          <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="50" cy="30" r="20" fill="#9C27B0" />
            <circle cx="350" cy="40" r="15" fill="#9C27B0" />
            <circle cx="200" cy="10" r="8" fill="#CE93D8" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-end gap-2 mb-5">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-gray-700">12</span>
            </div>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-gray-700">230</span>
            </div>
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
              <Bell size={14} className="text-gray-600" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-black text-2xl text-gray-800">Quest Progress</h1>
              <p className="text-xs text-gray-600 mt-0.5">Track your transformation</p>
            </div>
            <button className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Calendar size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 mt-5">
        <WeightChart points={weightPoints} goal={profile.targetWeightKg} />
        <MacroAdherence consumed={consumed} profile={profile} />
        <CalorieTrend days={last7Days} target={profile.dailyCalTarget} />
      </div>

      <BottomNav />
    </div>
  );
}
