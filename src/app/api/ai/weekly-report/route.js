import { getOpenAI } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function POST() {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const userId = session.user.id;

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) {
    return errorResponse("Profile not found", "NOT_FOUND", 404);
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekLogs = await prisma.foodLog.findMany({
    where: { userId, loggedAt: { gte: weekAgo } },
    orderBy: { loggedAt: "asc" },
  });

  const bodyLogs = await prisma.bodyMeasurement.findMany({
    where: { userId, measuredAt: { gte: weekAgo } },
    orderBy: { measuredAt: "asc" },
  });

  const dailyTotals = {};
  weekLogs.forEach((log) => {
    const day = log.loggedAt.toISOString().split("T")[0];
    if (!dailyTotals[day]) dailyTotals[day] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    dailyTotals[day].calories += log.calories;
    dailyTotals[day].protein += log.proteinG;
    dailyTotals[day].carbs += log.carbG;
    dailyTotals[day].fat += log.fatG;
  });

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a fitness coach. Analyze the user's 7-day data and provide a weekly insight report.

Return JSON format:
{ "summary": "2-3 sentence overview", "highlights": ["point 1", "point 2", "point 3"], "recommendation": "1-2 sentence actionable advice" }

Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Program: ${profile.program}, Target: ${profile.dailyCalTarget} kcal/day.
7-day nutrition: ${JSON.stringify(dailyTotals)}
Body measurements this week: ${JSON.stringify(bodyLogs.map((l) => ({ date: l.measuredAt, weight: l.weightKg, waist: l.waistCm })))}
Days with logs: ${Object.keys(dailyTotals).length}/7`,
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return successResponse(result);
  } catch (e) {
    console.error("Weekly report error:", e);
    return successResponse({
      summary: "Keep logging your meals consistently for better insights.",
      highlights: [],
      recommendation: "Try to log at least 3 meals per day for accurate tracking.",
    });
  }
}
