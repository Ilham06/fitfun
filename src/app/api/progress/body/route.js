import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, successResponse } from "@/lib/utils";

export async function GET() {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const logs = await prisma.bodyMeasurement.findMany({
    where: { userId: session.user.id },
    orderBy: { measuredAt: "asc" },
  });

  return successResponse({ logs });
}
