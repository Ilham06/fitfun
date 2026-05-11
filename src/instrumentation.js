export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const cron = await import("node-cron");
    const { runNotificationCheck } = await import("@/lib/notification-sender");

    cron.default.schedule("0 * * * *", async () => {
      console.log("[CRON] Running hourly notification check...");
      try {
        await runNotificationCheck();
      } catch (err) {
        console.error("[CRON] Notification check failed:", err.message);
      }
    });

    console.log("[INSTRUMENTATION] Cron scheduler started — runs every hour");
  }
}
