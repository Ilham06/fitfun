import { prisma } from "@/lib/prisma";
import { getSessionOrThrow, errorResponse } from "@/lib/utils";

export async function GET() {
  const { session, error } = await getSessionOrThrow();
  if (error) return error;

  const userId = session.user.id;

  const [foodLogs, bodyLogs, profile] = await Promise.all([
    prisma.foodLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "asc" },
    }),
    prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { measuredAt: "asc" },
    }),
    prisma.userProfile.findUnique({ where: { userId } }),
  ]);

  let csv = "=== PROFILE ===\n";
  if (profile) {
    csv += "Field,Value\n";
    csv += `Program,${profile.program}\n`;
    csv += `Activity,${profile.activityLevel}\n`;
    csv += `Weight (kg),${profile.weightKg}\n`;
    csv += `Height (cm),${profile.heightCm}\n`;
    csv += `TDEE,${profile.tdee}\n`;
    csv += `Daily Target (kcal),${profile.dailyCalTarget}\n`;
    csv += `Protein Target (g),${profile.proteinTargetG}\n`;
    csv += `Carbs Target (g),${profile.carbTargetG}\n`;
    csv += `Fat Target (g),${profile.fatTargetG}\n`;
  }

  csv += "\n=== FOOD LOGS ===\n";
  csv += "Date,Meal Type,Name,Calories,Protein (g),Carbs (g),Fat (g),Portion (g),Source\n";
  foodLogs.forEach((log) => {
    csv += `${log.loggedAt.toISOString()},${log.mealType},"${log.name}",${log.calories},${log.proteinG},${log.carbG},${log.fatG},${log.portionG},${log.source}\n`;
  });

  csv += "\n=== BODY MEASUREMENTS ===\n";
  csv += "Date,Weight (kg),Waist (cm),Chest (cm),Hips (cm),Arms (cm),Thighs (cm),Neck (cm),Body Fat %,BMI,Source\n";
  bodyLogs.forEach((log) => {
    csv += `${log.measuredAt.toISOString()},${log.weightKg || ""},${log.waistCm || ""},${log.chestCm || ""},${log.hipsCm || ""},${log.armsCm || ""},${log.thighsCm || ""},${log.neckCm || ""},${log.bodyFatPct || ""},${log.bmi || ""},${log.source}\n`;
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="fitscan-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
