import { prisma } from "@/lib/prisma";
import { sendMulticastPush } from "@/lib/firebase-admin";

export async function runNotificationCheck() {
  const now = new Date();
  const hour = now.getHours();

  console.log(`[NOTIFICATION-CRON] Running check at hour ${hour}`);

  if (hour === 7) {
    await sendMorningSummary();
  } else if (hour === 12) {
    await sendLunchReminder();
  } else if (hour === 18) {
    await sendDinnerReminder();
  } else if (hour === 21) {
    await sendEveningDeficitAlert();
  }
}

async function getUsersWithTokens() {
  return prisma.user.findMany({
    where: {
      fcmTokens: { some: {} },
      profile: { isNot: null },
    },
    include: {
      profile: true,
      fcmTokens: true,
    },
  });
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

async function getUserTodayLogs(userId) {
  const { start, end } = getTodayRange();
  return prisma.foodLog.findMany({
    where: {
      userId,
      loggedAt: { gte: start, lt: end },
    },
  });
}

async function sendMorningSummary() {
  console.log("[NOTIFICATION-CRON] Sending morning summary...");
  const users = await getUsersWithTokens();

  for (const user of users) {
    if (!user.profile) continue;
    const tokens = user.fcmTokens.map((t) => t.token);
    const { dailyCalTarget, proteinTargetG, carbTargetG, fatTargetG } = user.profile;

    const title = "Selamat Pagi! 🌅";
    const body = `Target hari ini: ${dailyCalTarget} kcal, ${proteinTargetG}g protein, ${carbTargetG}g karbo, ${fatTargetG}g lemak`;

    try {
      await sendMulticastPush(tokens, title, body);
    } catch (err) {
      console.error(`[NOTIFICATION-CRON] Failed for user ${user.id}:`, err.message);
    }
  }
}

async function sendLunchReminder() {
  console.log("[NOTIFICATION-CRON] Checking lunch logs...");
  const users = await getUsersWithTokens();

  for (const user of users) {
    const logs = await getUserTodayLogs(user.id);
    const hasLunch = logs.some((l) => l.mealType === "LUNCH");

    if (!hasLunch) {
      const tokens = user.fcmTokens.map((t) => t.token);
      try {
        await sendMulticastPush(
          tokens,
          "Sudah makan siang? 🍱",
          "Jangan lupa log meal kamu untuk track progress hari ini"
        );
      } catch (err) {
        console.error(`[NOTIFICATION-CRON] Lunch reminder failed for user ${user.id}:`, err.message);
      }
    }
  }
}

async function sendDinnerReminder() {
  console.log("[NOTIFICATION-CRON] Checking dinner logs...");
  const users = await getUsersWithTokens();

  for (const user of users) {
    const logs = await getUserTodayLogs(user.id);
    const hasDinner = logs.some((l) => l.mealType === "DINNER");

    if (!hasDinner) {
      const tokens = user.fcmTokens.map((t) => t.token);
      try {
        await sendMulticastPush(
          tokens,
          "Waktunya makan malam! 🍽️",
          "Log meal untuk track progress nutrisi kamu"
        );
      } catch (err) {
        console.error(`[NOTIFICATION-CRON] Dinner reminder failed for user ${user.id}:`, err.message);
      }
    }
  }
}

async function sendEveningDeficitAlert() {
  console.log("[NOTIFICATION-CRON] Checking daily deficit...");
  const users = await getUsersWithTokens();

  for (const user of users) {
    if (!user.profile) continue;
    const logs = await getUserTodayLogs(user.id);

    const consumed = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.proteinG,
      }),
      { calories: 0, protein: 0 }
    );

    const { dailyCalTarget, proteinTargetG } = user.profile;
    const calPercent = (consumed.calories / dailyCalTarget) * 100;

    if (calPercent < 80) {
      const remainingCal = dailyCalTarget - consumed.calories;
      const remainingProtein = Math.max(0, proteinTargetG - consumed.protein);
      const tokens = user.fcmTokens.map((t) => t.token);

      try {
        await sendMulticastPush(
          tokens,
          "Target belum tercapai 📊",
          `Kamu masih butuh ${Math.round(remainingCal)} kcal dan ${Math.round(remainingProtein)}g protein hari ini`
        );
      } catch (err) {
        console.error(`[NOTIFICATION-CRON] Deficit alert failed for user ${user.id}:`, err.message);
      }
    }
  }
}
