import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function GET() {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const userId = session.user.id;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return errorResponse("Profile not found", "NOT_FOUND", 404);
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayLogs = await prisma.foodLog.findMany({
    where: {
      userId,
      loggedAt: { gte: todayStart, lte: todayEnd },
    },
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

  const streakDays = await calculateStreak(userId);

  return successResponse({
    calories: {
      consumed: consumed.calories,
      target: profile.dailyCalTarget,
      remaining: profile.dailyCalTarget - consumed.calories,
    },
    protein: { consumed: Math.round(consumed.protein), target: profile.proteinTargetG },
    carbs: { consumed: Math.round(consumed.carbs), target: profile.carbTargetG },
    fat: { consumed: Math.round(consumed.fat), target: profile.fatTargetG },
    streak: streakDays,
    meals: todayLogs.map((log) => ({
      id: log.id,
      mealType: log.mealType,
      name: log.name,
      calories: log.calories,
      proteinG: log.proteinG,
      loggedAt: log.loggedAt,
    })),
    profile: {
      name: session.user.name,
      program: profile.program,
      activityLevel: profile.activityLevel,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
    },
  });
}

async function calculateStreak(userId) {
  const logs = await prisma.foodLog.findMany({
    where: { userId },
    select: { loggedAt: true },
    orderBy: { loggedAt: "desc" },
  });

  if (logs.length === 0) return 0;

  const uniqueDays = new Set(
    logs.map((l) => l.loggedAt.toISOString().split("T")[0])
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (uniqueDays.has(key)) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}
