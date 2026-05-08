"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function completeOnboarding() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingDone: true },
  });

  redirect("/dashboard");
}
