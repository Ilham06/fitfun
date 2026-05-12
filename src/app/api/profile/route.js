import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse, successResponse } from "@/lib/utils";
import { calculateTDEE, calculateTargets } from "@/lib/tdee";

export async function GET() {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user?.profile) {
    return errorResponse("Profile not found", "NOT_FOUND", 404);
  }

  return successResponse({
    user: { id: user.id, name: user.name, email: user.email, image: user.image },
    profile: user.profile,
  });
}

export async function PATCH(request) {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const body = await request.json();
  const { age, gender, weightKg, heightCm, program, activityLevel, targetWeightKg, name } = body;

  const existing = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!existing) {
    return errorResponse("Profile not found", "NOT_FOUND", 404);
  }

  const updatedAge = age ?? existing.age;
  const updatedGender = gender ?? existing.gender;
  const updatedWeight = weightKg ?? existing.weightKg;
  const updatedHeight = heightCm ?? existing.heightCm;
  const updatedProgram = program ?? existing.program;
  const updatedActivity = activityLevel ?? existing.activityLevel;
  const updatedTargetWeight = targetWeightKg !== undefined ? targetWeightKg : existing.targetWeightKg;

  const tdee = calculateTDEE({
    age: updatedAge,
    gender: updatedGender,
    weightKg: updatedWeight,
    heightCm: updatedHeight,
    activityLevel: updatedActivity,
  });

  const { dailyCalTarget, proteinTargetG, carbTargetG, fatTargetG } = calculateTargets({
    tdee,
    program: updatedProgram,
    weightKg: updatedWeight,
  });

  const [profile] = await prisma.$transaction([
    prisma.userProfile.update({
      where: { userId: session.user.id },
      data: {
        age: updatedAge,
        gender: updatedGender,
        weightKg: updatedWeight,
        heightCm: updatedHeight,
        program: updatedProgram,
        activityLevel: updatedActivity,
        targetWeightKg: updatedTargetWeight,
        tdee,
        dailyCalTarget,
        proteinTargetG,
        carbTargetG,
        fatTargetG,
      },
    }),
    ...(name !== undefined
      ? [prisma.user.update({ where: { id: session.user.id }, data: { name } })]
      : []),
  ]);

  return successResponse({ profile });
}
