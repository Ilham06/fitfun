import Link from "next/link";
import BottomNav from "@/components/bottom-nav";
import { Flame, Droplets, Bell, Weight, Plus, Dumbbell, Percent, Calculator, Camera } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Body Progress | FitScan" };

async function getProgressData(userId) {
  const bodyLogs = await prisma.bodyMeasurement.findMany({
    where: { userId },
    orderBy: { measuredAt: "desc" },
    take: 30,
  });

  const reversed = [...bodyLogs].reverse();

  const weightPoints = reversed.filter((l) => l.weightKg).map((l) => l.weightKg);
  const muscleMassPoints = reversed.filter((l) => l.muscleMassKg).map((l) => l.muscleMassKg);
  const bodyFatPoints = reversed.filter((l) => l.bodyFatPct).map((l) => l.bodyFatPct);
  const bmiPoints = reversed.filter((l) => l.bmi).map((l) => l.bmi);

  return { logs: bodyLogs, weightPoints, muscleMassPoints, bodyFatPoints, bmiPoints };
}

function TrendChart({ title, points, unit, color, icon: Icon }) {
  if (points.length === 0) return null;

  const max = Math.max(...points) + 0.5;
  const min = Math.min(...points) - 0.5;
  const range = max - min || 1;
  const latest = points[points.length - 1];

  const chartPoints = points.map((val, i) => {
    const x = 10 + (i / Math.max(points.length - 1, 1)) * 280;
    const y = 110 - ((val - min) / range) * 100;
    return { x, y, val };
  });

  const pathData = chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const gradientId = `grad_${title.replace(/\s/g, "")}`;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <h3 className="font-bold text-sm text-gray-800">{title}</h3>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{latest}{unit}</span>
      </div>

      <div className="relative h-24">
        <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L ${chartPoints[chartPoints.length - 1].x} 120 L ${chartPoints[0].x} 120 Z`}
            fill={`url(#${gradientId})`}
          />
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
          ))}
        </svg>
      </div>
    </div>
  );
}

function LogList({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
        <p className="text-xs text-gray-400 text-center py-4">No measurements logged yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F0F0F0]">
      <h3 className="font-bold text-sm text-gray-800 mb-4">History</h3>
      <div className="flex flex-col gap-3">
        {logs.slice(0, 10).map((log) => {
          const date = new Date(log.measuredAt);
          const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

          return (
            <div key={log.id} className="flex items-center gap-3 py-2 border-b border-[#F5F5F5] last:border-0">
              <div className="w-9 h-9 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
                <Weight size={16} className="text-[#2D9C7E]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-800">{log.weightKg} kg</span>
                  {log.bmi && <span className="text-[10px] text-gray-400">BMI {log.bmi}</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {log.muscleMassKg && (
                    <span className="text-[10px] text-[#F57C00] font-medium">Muscle {log.muscleMassKg}kg</span>
                  )}
                  {log.bodyFatPct && (
                    <span className="text-[10px] text-[#EC4899] font-medium">Fat {log.bodyFatPct}%</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">{dateStr}</span>
                <span className="text-[10px] text-gray-300">{timeStr}</span>
              </div>
            </div>
          );
        })}
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

  const { logs, weightPoints, muscleMassPoints, bodyFatPoints, bmiPoints } = data;

  return (
    <div className="min-h-screen bg-[#F5F9F7] pb-24">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#C9A5E0] to-[#F5F9F7] px-5 pt-6 pb-[32vh]">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20" style={{ WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 80%)", maskImage: "linear-gradient(to bottom, black 40%, transparent 80%)" }}>
          <svg viewBox="0 0 200 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="30" cy="120" r="60" fill="#E8D5F5" />
            <circle cx="50" cy="20" r="30" fill="#CE93D8" />
            <circle cx="120" cy="80" r="20" fill="#9C27B0" />
            <circle cx="80" cy="130" r="15" fill="#D4B8E8" />
            <circle cx="160" cy="30" r="25" fill="#E8D5F5" />
            <circle cx="140" cy="120" r="35" fill="#CE93D8" />
            <circle cx="70" cy="70" r="22" fill="#9C27B0" />
            <circle cx="180" cy="90" r="14" fill="#D4B8E8" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-end gap-2">
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

          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-black text-2xl text-gray-800">Body Progress</h1>
              <p className="text-xs text-gray-600 mt-0.5">Track your transformation</p>
            </div>
            <img src="/images/dino-workout.png" alt="" className="w-32 h-32 object-contain -mb-10" />
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 -mt-[30vh] relative z-10">
        {/* Charts */}
        <TrendChart title="Weight" points={weightPoints} unit=" kg" color="#2D9C7E" icon={Weight} />
        <TrendChart title="Muscle Mass" points={muscleMassPoints} unit=" kg" color="#F57C00" icon={Dumbbell} />
        <TrendChart title="Body Fat" points={bodyFatPoints} unit="%" color="#EC4899" icon={Percent} />
        <TrendChart title="BMI" points={bmiPoints} unit="" color="#7C3AED" icon={Calculator} />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/scan/body-confirm"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2D9C7E] rounded-2xl text-sm font-bold text-white shadow-[0_4px_14px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
          >
            <Plus size={16} /> Log Manual
          </Link>
          <Link
            href="/scan"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#7C3AED] rounded-2xl text-sm font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:bg-[#6D28D9] transition-colors"
          >
            <Camera size={16} /> Scan Scale
          </Link>
        </div>

        {/* Log History */}
        <LogList logs={logs} />
      </div>

      <BottomNav />
    </div>
  );
}
