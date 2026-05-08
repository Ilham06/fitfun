import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function DELETE(request, { params }) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const { id } = await params;

  const existing = await prisma.bodyMeasurement.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return errorResponse("Measurement not found", "NOT_FOUND", 404);
  }

  await prisma.bodyMeasurement.delete({ where: { id } });

  return successResponse({ deleted: true });
}
