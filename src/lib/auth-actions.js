"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { calculateTDEE, calculateTargets } from "@/lib/tdee";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function completeOnboarding(profileData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { name, age, gender, weight, height, program, activityLevel, targetWeight } = profileData;

  const weightKg = parseFloat(weight);
  const heightCm = parseFloat(height);
  const ageNum = parseInt(age, 10);
  const targetWeightKg = targetWeight ? parseFloat(targetWeight) : null;

  const tdee = calculateTDEE({
    age: ageNum,
    gender,
    weightKg,
    heightCm,
    activityLevel,
  });

  const { dailyCalTarget, proteinTargetG, carbTargetG, fatTargetG } = calculateTargets({
    tdee,
    program,
    weightKg,
  });

  await prisma.$transaction([
    prisma.userProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        age: ageNum,
        gender,
        weightKg,
        heightCm,
        program,
        activityLevel,
        targetWeightKg,
        tdee,
        dailyCalTarget,
        proteinTargetG,
        carbTargetG,
        fatTargetG,
      },
      update: {
        age: ageNum,
        gender,
        weightKg,
        heightCm,
        program,
        activityLevel,
        targetWeightKg,
        tdee,
        dailyCalTarget,
        proteinTargetG,
        carbTargetG,
        fatTargetG,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        onboardingDone: true,
      },
    }),
  ]);

  redirect("/dashboard");
}
