import { openai } from "@/lib/openai";
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

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayLogs = await prisma.foodLog.findMany({
    where: { userId, loggedAt: { gte: todayStart, lte: todayEnd } },
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

  const remaining = {
    calories: profile.dailyCalTarget - consumed.calories,
    protein: profile.proteinTargetG - Math.round(consumed.protein),
    carbs: profile.carbTargetG - Math.round(consumed.carbs),
    fat: profile.fatTargetG - Math.round(consumed.fat),
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nutrition coach. Based on the user's profile and today's food logs, provide:
1. A short personalized tip (1-2 sentences)
2. 2-3 meal suggestions to reach their daily target

Return JSON format:
{ "tip": "...", "suggestions": [{ "name": "...", "kcal": ..., "proteinG": ... }] }

Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `User Profile: ${profile.program} program, ${profile.dailyCalTarget} kcal/day target.
Today consumed: ${consumed.calories} kcal, ${Math.round(consumed.protein)}g protein, ${Math.round(consumed.carbs)}g carbs, ${Math.round(consumed.fat)}g fat.
Remaining: ${remaining.calories} kcal, ${remaining.protein}g protein, ${remaining.carbs}g carbs, ${remaining.fat}g fat.
Meals logged today: ${todayLogs.map((l) => l.name).join(", ") || "none"}.`,
        },
      ],
      max_tokens: 400,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return successResponse({
      tip: result.tip || "Keep tracking your meals to stay on target!",
      suggestions: result.suggestions || [],
      cachedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Daily tip error:", e);
    return successResponse({
      tip: "Keep tracking your meals consistently to reach your goals!",
      suggestions: [],
      cachedAt: new Date().toISOString(),
    });
  }
}
