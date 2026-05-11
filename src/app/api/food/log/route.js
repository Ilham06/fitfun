import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";
import { awardXP, XP_AWARDS } from "@/lib/xp";

export async function GET(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  let start, end;
  if (date) {
    start = new Date(date + "T00:00:00");
    end = new Date(date + "T23:59:59.999");
  } else {
    start = new Date();
    start.setHours(0, 0, 0, 0);
    end = new Date();
    end.setHours(23, 59, 59, 999);
  }

  const meals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
      loggedAt: { gte: start, lte: end },
    },
    include: {
      items: true,
    },
    orderBy: { loggedAt: "asc" },
  });

  return successResponse({ meals });
}

export async function POST(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const body = await request.json();
  const { items, mealType } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return errorResponse("Items array is required", "VALIDATION", 400);
  }

  if (!mealType || !["BREAKFAST", "LUNCH", "DINNER", "SNACK"].includes(mealType)) {
    return errorResponse("Valid mealType is required (BREAKFAST, LUNCH, DINNER, SNACK)", "VALIDATION", 400);
  }

  const meal = await prisma.meal.create({
    data: {
      userId: session.user.id,
      mealType,
      source: items[0]?.source || "MANUAL",
      items: {
        create: items.map((item) => ({
          userId: session.user.id,
          name: item.name,
          mealType,
          calories: Math.round(item.calories),
          proteinG: item.proteinG,
          carbG: item.carbG,
          fatG: item.fatG,
          fiberG: item.fiberG || null,
          sodiumMg: item.sodiumMg || null,
          portionG: item.portionG || 100,
          portionMultiplier: item.portionMultiplier || 1.0,
          source: item.source || "MANUAL",
        })),
      },
    },
    include: {
      items: true,
    },
  });

  const isScan = items[0]?.source && items[0].source !== "MANUAL";
  const xpResult = await awardXP(session.user.id, isScan ? XP_AWARDS.MEAL_SCAN : XP_AWARDS.MEAL_MANUAL);

  return successResponse({ meal, xp: xpResult }, 201);
}
