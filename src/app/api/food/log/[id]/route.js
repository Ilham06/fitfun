import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";

export async function PATCH(request, { params }) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.foodLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return errorResponse("Food log not found", "NOT_FOUND", 404);
  }

  const updated = await prisma.foodLog.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      calories: body.calories ?? existing.calories,
      proteinG: body.proteinG ?? existing.proteinG,
      carbG: body.carbG ?? existing.carbG,
      fatG: body.fatG ?? existing.fatG,
      portionG: body.portionG ?? existing.portionG,
      mealType: body.mealType ?? existing.mealType,
    },
  });

  return successResponse({ log: updated });
}

export async function DELETE(request, { params }) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const { id } = await params;

  const existing = await prisma.foodLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return errorResponse("Food log not found", "NOT_FOUND", 404);
  }

  await prisma.foodLog.delete({ where: { id } });

  return successResponse({ deleted: true });
}
