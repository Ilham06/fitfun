"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function NotificationPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      registerToken();
      return;
    }
    if (Notification.permission === "denied") return;

    const dismissed = sessionStorage.getItem("notif-dismissed");
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  async function registerToken() {
    try {
      setRegistering(true);

      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        await navigator.serviceWorker.ready;

        const swScript = await fetch("/firebase-messaging-sw.js");
        if (swScript.ok) {
          registration.active?.postMessage({
            type: "FIREBASE_CONFIG",
            config: {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            },
          });
        }
      }

      const { requestNotificationToken } = await import("@/lib/firebase");
      const token = await requestNotificationToken();

      if (token) {
        await fetch("/api/notifications/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
    } catch (err) {
      console.error("[NotificationPrompt] Error registering token:", err);
    } finally {
      setRegistering(false);
    }
  }

  async function handleAllow() {
    setShowBanner(false);
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await registerToken();
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    sessionStorage.setItem("notif-dismissed", "true");
  }

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-start gap-3 animate-in slide-in-from-top">
      <div className="w-10 h-10 rounded-full bg-[#2D9C7E]/10 flex items-center justify-center flex-shrink-0">
        <Bell size={20} className="text-[#2D9C7E]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900">
          {t("notif_title")}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {t("notif_desc")}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAllow}
            disabled={registering}
            className="px-4 py-1.5 bg-[#2D9C7E] text-white text-xs font-semibold rounded-full"
          >
            {registering ? t("loading") : t("allow")}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full"
          >
            {t("later")}
          </button>
        </div>
      </div>
      <button onClick={handleDismiss} className="text-gray-400">
        <X size={16} />
      </button>
    </div>
  );
}
