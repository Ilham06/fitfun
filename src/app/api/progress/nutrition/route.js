import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, successResponse } from "@/lib/utils";

export async function GET(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await prisma.foodLog.findMany({
    where: { userId: session.user.id, loggedAt: { gte: since } },
    orderBy: { loggedAt: "asc" },
  });

  const dailyTotals = {};
  logs.forEach((log) => {
    const day = log.loggedAt.toISOString().split("T")[0];
    if (!dailyTotals[day]) {
      dailyTotals[day] = { date: day, calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    dailyTotals[day].calories += log.calories;
    dailyTotals[day].protein += log.proteinG;
    dailyTotals[day].carbs += log.carbG;
    dailyTotals[day].fat += log.fatG;
  });

  return successResponse({ days: Object.values(dailyTotals) });
}
