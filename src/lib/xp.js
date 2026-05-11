import { prisma } from "@/lib/prisma";

// XP needed to advance FROM this level to the next: level * 200
// Level 1: 0–200 XP, Level 2: 200–600 XP, Level 3: 600–1200 XP …
export function getLevelInfo(totalXP) {
  let level = 1;
  let cumulative = 0;
  while (true) {
    const needed = level * 200;
    if (totalXP < cumulative + needed) {
      const currentLevelXP = totalXP - cumulative;
      return {
        level,
        currentLevelXP,
        xpForNext: needed,
        percentage: Math.round((currentLevelXP / needed) * 100),
      };
    }
    cumulative += needed;
    level++;
  }
}

export function getRank(level) {
  if (level >= 19) return "Diamond";
  if (level >= 13) return "Platinum";
  if (level >= 8)  return "Gold";
  if (level >= 4)  return "Silver";
  return "Bronze";
}

export const RANK_COLORS = {
  Diamond: { text: "text-[#22D3EE]", bg: "bg-[#ECFEFF]", icon: "text-[#0891B2]" },
  Platinum: { text: "text-[#7C3AED]", bg: "bg-[#F3E8FF]", icon: "text-[#7C3AED]" },
  Gold:     { text: "text-[#F59E0B]", bg: "bg-[#FFF8E1]", icon: "text-[#F59E0B]" },
  Silver:   { text: "text-[#6B7280]", bg: "bg-[#F3F4F6]", icon: "text-[#6B7280]" },
  Bronze:   { text: "text-[#92400E]", bg: "bg-[#FEF3C7]", icon: "text-[#D97706]" },
};

// XP awards per action
export const XP_AWARDS = {
  MEAL_MANUAL: 10,
  MEAL_SCAN: 15,
  BODY_MANUAL: 10,
  BODY_SCAN: 20,
};

export async function awardXP(userId, amount) {
  // Use COALESCE so NULL xp (legacy rows) is treated as 0 before incrementing
  await prisma.$executeRaw`
    UPDATE "UserProfile"
    SET "xp" = COALESCE("xp", 0) + ${amount}
    WHERE "userId" = ${userId}
  `;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { xp: true, level: true },
  });

  const totalXP = profile?.xp ?? amount;
  const prevLevel = profile?.level ?? 1;
  const { level: newLevel } = getLevelInfo(totalXP);

  if (newLevel !== prevLevel) {
    await prisma.userProfile.update({
      where: { userId },
      data: { level: newLevel },
    });
  }

  return { xp: totalXP, level: newLevel, leveledUp: newLevel !== prevLevel };
}
