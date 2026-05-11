import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function POST(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const body = await request.json();
  const { token } = body;

  if (!token || typeof token !== "string") {
    return errorResponse("FCM token is required", "VALIDATION", 400);
  }

  const existing = await prisma.fcmToken.findUnique({ where: { token } });

  if (existing) {
    if (existing.userId !== session.user.id) {
      await prisma.fcmToken.update({
        where: { token },
        data: { userId: session.user.id },
      });
    }
    return successResponse({ registered: true, updated: true });
  }

  await prisma.fcmToken.create({
    data: {
      userId: session.user.id,
      token,
    },
  });

  return successResponse({ registered: true }, 201);
}
