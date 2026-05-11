import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function GET(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const logs = await prisma.bodyMeasurement.findMany({
    where: { userId: session.user.id },
    orderBy: { measuredAt: "desc" },
    take: limit,
  });

  return successResponse({ logs });
}

export async function POST(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const body = await request.json();
  const { weightKg, muscleMassKg, bodyFatPct, source } = body;

  if (!weightKg || weightKg <= 0) {
    return errorResponse("Weight is required", "VALIDATION", 400);
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
    select: { heightCm: true },
  });

  let bmi = null;
  if (profile?.heightCm) {
    bmi = Math.round((weightKg / Math.pow(profile.heightCm / 100, 2)) * 10) / 10;
  }

  const measurement = await prisma.bodyMeasurement.create({
    data: {
      userId: session.user.id,
      weightKg,
      muscleMassKg: muscleMassKg || null,
      bodyFatPct: bodyFatPct || null,
      bmi,
      source: source || "MANUAL",
    },
  });

  await prisma.userProfile.update({
    where: { userId: session.user.id },
    data: { weightKg },
  });

  return successResponse({ measurement }, 201);
}
